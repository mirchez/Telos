import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  EditIcon,
  SunMoonIcon,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <header className="p-2 flex justify-between items-center border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2"
          >
            <Image
              src="/logo.svg"
              alt="telos-logo"
              width={isMobile ? 16 : 18}
              height={isMobile ? 16 : 18}
            />
            <span
              className={`font-medium ${
                isMobile ? "text-xs" : "text-sm"
              } max-w-[150px] truncate`}
            >
              {project.name}
            </span>
            <ChevronDownIcon className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="start"
          className={isMobile ? "w-56" : ""}
        >
          <DropdownMenuItem asChild>
            <Link href="/">
              <ChevronLeftIcon className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
              <span className={isMobile ? "text-xs" : "text-sm"}>
                Go back to home
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon
                className={`text-muted-foreground ${
                  isMobile ? "w-3 h-3" : "w-4 h-4"
                }`}
              />
              <span className={isMobile ? "text-xs" : "text-sm"}>
                Appearance
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light">
                    <span className={isMobile ? "text-xs" : "text-sm"}>
                      Light
                    </span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <span className={isMobile ? "text-xs" : "text-sm"}>
                      Dark
                    </span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <span className={isMobile ? "text-xs" : "text-sm"}>
                      System
                    </span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
