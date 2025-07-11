"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Props {
  points: number;
  msBeforeNext: number;
}

export const Usage = ({ points, msBeforeNext }: Props) => {
  const { has } = useAuth();
  const hasPremiumAccess = has?.({ plan: "pro" });

  // Estado para el tiempo restante
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    // Solo se ejecuta en el cliente
    const update = () => {
      setTimeRemaining(
        formatDuration(
          intervalToDuration({
            start: new Date(),
            end: new Date(Date.now() + msBeforeNext),
          }),
          { format: ["months", "days", "hours"] }
        )
      );
    };
    update();
    // Opcional: actualiza cada minuto si quieres que sea dinámico
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [msBeforeNext]);

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points} {hasPremiumAccess ? "" : "free"} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in {timeRemaining || "..."}
          </p>
        </div>
        {!hasPremiumAccess && (
          <Button asChild size="sm" variant="tertiary" className="ml-auto">
            <Link href="/pricing">
              <CrownIcon />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
