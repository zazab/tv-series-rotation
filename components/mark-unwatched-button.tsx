"use client";

import { useState, useTransition } from "react";

type MarkUnwatchedButtonProps = {
  ratingKey: string;
  title: string;
};

export function MarkUnwatchedButton({ ratingKey, title }: MarkUnwatchedButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const onClick = () => {
    setStatus("idle");
    setMessage("");

    startTransition(async () => {
      try {
        const response = await fetch(`/api/series/${ratingKey}/mark-unwatched`, {
          method: "POST"
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? "Unable to update Plex watched state.");
        }

        setStatus("success");
        setMessage(`Marked ${title} as unwatched.`);
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unexpected error.");
      }
    });
  };

  return (
    <div className="action-stack">
      <button
        type="button"
        className="primary-button"
        onClick={onClick}
        disabled={isPending}
        aria-label={`Mark ${title} as unwatched`}
      >
        {isPending ? "Updating..." : "Mark unwatched"}
      </button>
      {status !== "idle" ? (
        <p className={status === "success" ? "status-success" : "status-error"} role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
