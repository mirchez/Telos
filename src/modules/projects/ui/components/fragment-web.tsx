"use client";
import { useState, useEffect } from "react";

import { Fragment } from "@/generated/prisma";

import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { Hint } from "@/components/hint";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.sandboxUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert("Could not copy automatically. Please select and copy manually.");
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh iframe" side="bottom">
          <Button
            size={isMobile ? "sm" : "sm"}
            variant="outline"
            onClick={onRefresh}
          >
            <RefreshCcwIcon className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
          </Button>
        </Hint>

        <Hint text="Click to copy" side="bottom">
          <Button
            size={isMobile ? "sm" : "sm"}
            variant="outline"
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 justify-start text-start font-normal min-w-0"
          >
            <span className={`truncate ${isMobile ? "text-xs" : "text-sm"}`}>
              {data.sandboxUrl}
            </span>
          </Button>
        </Hint>

        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            disabled={!data.sandboxUrl}
            size={isMobile ? "sm" : "sm"}
            variant="outline"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      ></iframe>
    </div>
  );
}
