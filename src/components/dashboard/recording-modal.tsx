import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mic, Square, Loader2 } from "lucide-react";

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

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

  const handleSave = () => {
    if (audioBlob && recordingTitle.trim()) {
      setIsProcessing(true);
      // Simulate processing time
      setTimeout(() => {
        onSave(audioBlob, recordingTitle);
        setIsProcessing(false);
        resetModal();
        onClose();
      }, 2000);
    }
  };

  const resetModal = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setRecordingTitle("");
    setAudioBlob(null);
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
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>

          {audioBlob && (
            <Button
              onClick={handleSave}
              disabled={!recordingTitle.trim() || isProcessing}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Save & Process"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
