"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessagesContainer from "../components/messages-container";
import { Suspense, useState, useEffect } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CodeIcon,
  CrownIcon,
  EyeIcon,
  MessageSquareIcon,
  MonitorIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "@/components/file-explorer";
import { UserControl } from "@/components/user-control";
import { useAuth } from "@clerk/nextjs";

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<"chat" | "preview">("chat");

  const { has } = useAuth();
  const hasPremiumAccess = has?.({ plan: "pro" });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Vista móvil
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        {/* Header móvil */}
        <div className="border-b bg-background">
          <Suspense fallback={<p>Loading project...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>

          {/* Navegación móvil */}
          <div className="flex border-t">
            <button
              onClick={() => setMobileView("chat")}
              className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                mobileView === "chat"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <MessageSquareIcon className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                mobileView === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <MonitorIcon className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Contenido móvil */}
        <div className="flex-1 min-h-0 flex flex-col">
          {mobileView === "chat" ? (
            <div className="flex-1 min-h-0 flex flex-col">
              <Suspense fallback={<p>Loading...</p>}>
                <MessagesContainer
                  projectId={projectId}
                  activeFragment={activeFragment}
                  setActiveFragment={setActiveFragment}
                />
              </Suspense>
            </div>
          ) : (
            <Tabs
              className="h-full"
              defaultValue="preview"
              value={tabState}
              onValueChange={(value) =>
                setTabState(value as "preview" | "code")
              }
            >
              <div className="w-full flex items-center p-2 border-b gap-x-2">
                <TabsList className="h-8 p-0 border rounded-md">
                  <TabsTrigger value="preview" className="rounded-md text-xs">
                    <EyeIcon className="w-3 h-3" />
                    <span>Demo</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="rounded-md text-xs">
                    <CodeIcon className="w-3 h-3" />
                    <span>Code</span>
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-x-1">
                  {!hasPremiumAccess && (
                    <Button
                      asChild
                      size="sm"
                      variant="default"
                      className="text-xs"
                    >
                      <Link href="/pricing">
                        <CrownIcon className="w-3 h-3" />
                        Upgrade
                      </Link>
                    </Button>
                  )}
                  <UserControl />
                </div>
              </div>
              <TabsContent value="preview" className="mt-0 h-full">
                {!!activeFragment && <FragmentWeb data={activeFragment} />}
              </TabsContent>
              <TabsContent value="code" className="mt-0 h-full min-h-0">
                {activeFragment?.files && (
                  <FileExplorer
                    files={activeFragment.files as { [path: string]: string }}
                  />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    );
  }

  // Vista escritorio (código original)
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading project...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<p>Loading...</p>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle
          className="hover:bg-primary transition-colors"
          withHandle
        />

        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasPremiumAccess && (
                  <Button asChild size="sm" variant="default">
                    <Link href="/pricing">
                      <CrownIcon />
                      Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>

            <TabsContent value="code" className="min-h-0">
              {activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
