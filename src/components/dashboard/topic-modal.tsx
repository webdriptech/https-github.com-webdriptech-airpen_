import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topic: string, description: string) => void;
}

export function TopicModal({ isOpen, onClose, onSave }: TopicModalProps) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = () => {
    if (topic.trim()) {
      setIsProcessing(true);
      // Simulate processing time
      setTimeout(() => {
        onSave(topic, description);
        setIsProcessing(false);
        resetModal();
        onClose();
      }, 1500);
    }
  };

  const resetModal = () => {
    setTopic("");
    setDescription("");
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

          <div className="text-sm text-gray-500">
            <p>
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

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!topic.trim() || isProcessing}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Create Learning Module"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
