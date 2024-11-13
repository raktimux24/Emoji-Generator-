"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[400px] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
        <p className="mb-8 text-muted-foreground">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}