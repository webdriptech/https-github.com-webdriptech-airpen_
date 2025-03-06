import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { generateLearningModule } from "@/lib/gemini";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topic: string, description: string) => void;
}

export function TopicModal({ isOpen, onClose, onSave }: TopicModalProps) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const createModule = useMutation(api.modules.createModule);
  const createNote = useMutation(api.notes.createNote);

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

  const handleSave = async () => {
    if (topic.trim()) {
      setIsProcessing(true);
      setProcessingProgress(0);

      try {
        // Step 1: Generate content with AI
        setProcessingStep("Generating learning materials with AI...");
        const aiResponse = await generateLearningModule(topic, description);

        // Step 2: Store in Convex
        setProcessingStep("Creating your learning module...");

        // Create a learning module
        const moduleContent = {
          overview: aiResponse.text,
          lessons: [
            {
              id: 1,
              title: "Introduction to " + topic,
              content: `<h3>Introduction</h3><p>${description || "Welcome to this learning module on " + topic}</p><p>This module will guide you through the key concepts and applications.</p>`,
              completed: false,
            },
            {
              id: 2,
              title: "Key Concepts",
              content: `<h3>Core Concepts</h3><p>Understanding these principles will help you build a solid foundation in ${topic}.</p>`,
              completed: false,
            },
            {
              id: 3,
              title: "Practical Applications",
              content: `<h3>Real-world Applications</h3><p>Let's explore how these concepts are applied in real-world scenarios.</p>`,
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
              title: "Comprehensive Guide",
              url: "#",
              type: "Guide",
            },
            {
              id: 2,
              title: "Practice Exercises",
              url: "#",
              type: "Exercises",
            },
          ],
        };

        await createModule({
          title: topic,
          description:
            description || `AI-generated learning module on ${topic}`,
          content: moduleContent,
          progress: 0,
        });

        // Create a note
        await createNote({
          title: `Notes: ${topic}`,
          content: aiResponse.text,
          tags: ["AI Generated", topic],
        });

        // Call the original onSave callback
        onSave(topic, description);

        // Reset and close
        setTimeout(() => {
          setIsProcessing(false);
          resetModal();
          onClose();
        }, 1000);
      } catch (error) {
        console.error("Error creating topic:", error);
        setIsProcessing(false);
        setProcessingStep("Error occurred. Please try again.");
      }
    }
  };

  const resetModal = () => {
    setTopic("");
    setDescription("");
    setProcessingStep(null);
    setProcessingProgress(0);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetModal();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Learning Topic</DialogTitle>
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
                We're using AI to create personalized learning materials for
                your topic.
              </p>
            </div>
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700"
              >
                Topic Title*
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Introduction to Machine Learning"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what you want to learn about this topic"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
              <p className="font-medium text-gray-700 mb-1">
                AirPen will generate comprehensive learning materials for your
                topic, including:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Interactive study guides</li>
                <li>Practice quizzes</li>
                <li>Visual aids and diagrams</li>
                <li>Recommended resources</li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>

          {!isProcessing && (
            <Button
              onClick={handleSave}
              disabled={!topic.trim() || isProcessing}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Create Learning Module
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
