import { Button } from "@/components/ui/button";

interface ModuleCardProps {
  title: string;
  description: string;
  progress: number;
  onContinue: () => void;
}

export function ModuleCard({
  title,
  description,
  progress,
  onContinue,
}: ModuleCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="h-3 bg-teal-600"></div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-teal-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{progress}% Complete</span>
          <Button
            variant="outline"
            className="text-teal-600 border-teal-600 hover:bg-teal-50"
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
