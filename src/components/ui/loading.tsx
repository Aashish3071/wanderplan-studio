import { Icons } from "@/components/ui/icons";

interface LoadingProps {
  text?: string;
}

export function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Icons.loader className="h-8 w-8 animate-spin" />
      <p className="text-lg text-muted-foreground">{text}</p>
    </div>
  );
}
