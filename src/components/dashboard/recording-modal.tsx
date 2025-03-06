import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mic, Square, Loader2, CheckCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { transcribeAudio, uploadAudioToStorage } from "@/lib/audio-processing";
import { generateNotesFromTranscription } from "@/lib/gemini";

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recording: Blob, title: string) => void;
}

export function RecordingModal({
  isOpen,
  onClose,
  onSave,
}: RecordingModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const storeRecording = useMutation(api.recordings.storeRecording);
  const createModule = useMutation(api.modules.createModule);
  const createNote = useMutation(api.notes.createNote);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Simulate processing progress
  useEffect(() => {
    if (isProcessing && processingProgress < 100) {
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isProcessing, processingProgress]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop all audio tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const handleSave = async () => {
    if (audioBlob && recordingTitle.trim()) {
      setIsProcessing(true);
      setProcessingProgress(0);

      try {
        // Step 1: Upload audio to storage
        setProcessingStep("Uploading audio recording...");
        const audioUrl = await uploadAudioToStorage(
          audioBlob,
          recordingTitle.replace(/\s+/g, "-").toLowerCase(),
        );

        // Step 2: Transcribe audio
        setProcessingStep("Transcribing audio to text...");
        const transcription = await transcribeAudio(audioBlob);

        // Step 3: Generate notes and quiz using Gemini
        setProcessingStep("Generating study materials with AI...");
        const aiResponse = await generateNotesFromTranscription(transcription);

        // Step 4: Store everything in Convex
        setProcessingStep("Saving to your library...");

        // Store recording
        const recordingId = await storeRecording({
          title: recordingTitle,
          audioUrl,
          transcription,
          notes: aiResponse.text,
          quizData: aiResponse.quizzes,
        });

        // Create a learning module from the recording
        const moduleContent = {
          overview: aiResponse.summary || "Generated from your recording",
          lessons: [
            {
              id: 1,
              title: "Lecture Transcription",
              content: `<h3>Full Transcription</h3><p>${transcription}</p>`,
              completed: false,
            },
            {
              id: 2,
              title: "Key Concepts",
              content: aiResponse.text,
              completed: false,
            },
          ],
          quizzes: [
            {
              id: 1,
              title: "Knowledge Check",
              questions: aiResponse.quizzes || [],
            },
          ],
          resources: [
            {
              id: 1,
              title: "Original Recording",
              url: audioUrl,
              type: "Audio",
            },
          ],
        };

        await createModule({
          title: recordingTitle,
          description: aiResponse.summary || "Generated from your recording",
          content: moduleContent,
          recordingId,
          progress: 0,
        });

        // Create a note
        await createNote({
          title: recordingTitle,
          content: aiResponse.text,
          tags: ["Recording", "Lecture"],
          recordingId,
        });

        // Call the original onSave callback
        onSave(audioBlob, recordingTitle);

        // Reset and close
        setTimeout(() => {
          setIsProcessing(false);
          resetModal();
          onClose();
        }, 1000);
      } catch (error) {
        console.error("Error processing recording:", error);
        setIsProcessing(false);
        setProcessingStep("Error occurred. Please try again.");
      }
    }
  };

  const resetModal = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setRecordingTitle("");
    setAudioBlob(null);
    setProcessingStep(null);
    setProcessingProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (isRecording) stopRecording();
          resetModal();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Lecture</DialogTitle>
        </DialogHeader>

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="w-full max-w-md">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {processingStep}
                </span>
                {processingProgress === 100 && (
                  <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="mt-4 text-sm text-gray-500 text-center">
                We're using AI to process your recording, generate notes, and
                create interactive learning materials.
              </p>
            </div>
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            {!audioBlob ? (
              <>
                <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center">
                  {isRecording ? (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full border-2 border-teal-600 animate-ping"></div>
                      <Mic className="h-10 w-10 text-teal-600" />
                    </div>
                  ) : (
                    <Mic className="h-10 w-10 text-teal-600" />
                  )}
                </div>

                <div className="text-2xl font-semibold">
                  {formatTime(recordingTime)}
                </div>

                <div className="flex space-x-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="flex items-center"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-full space-y-4">
                  <div className="flex justify-center">
                    <audio
                      src={URL.createObjectURL(audioBlob)}
                      controls
                      className="w-full max-w-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="recording-title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Recording Title
                    </label>
                    <input
                      id="recording-title"
                      type="text"
                      value={recordingTitle}
                      onChange={(e) => setRecordingTitle(e.target.value)}
                      placeholder="Enter a title for your recording"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                    <p className="font-medium text-gray-700 mb-1">
                      What happens next?
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Your audio will be transcribed to text</li>
                      <li>AI will generate comprehensive notes</li>
                      <li>Interactive quizzes will be created</li>
                      <li>A learning module will be added to your dashboard</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>

          {audioBlob && !isProcessing && (
            <Button
              onClick={handleSave}
              disabled={!recordingTitle.trim() || isProcessing}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Process Recording
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
