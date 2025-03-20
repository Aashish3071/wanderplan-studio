import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function ServerError() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h1 className="text-4xl font-bold">500</h1>
      <p className="text-xl text-muted-foreground">Server error</p>
      <p className="text-muted-foreground">
        Something went wrong on our end. Please try again later.
      </p>
      <Button onClick={() => router.push("/")}>Return Home</Button>
    </div>
  );
}
