import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ActionButton({
  icon,
  label,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <Button
      variant="outline"
      className="flex flex-col items-center p-4 h-auto gap-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-colors duration-200"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="p-2 bg-teal-100 rounded-full text-teal-600">{icon}</div>
      <span>{label}</span>
    </Button>
  );
}
