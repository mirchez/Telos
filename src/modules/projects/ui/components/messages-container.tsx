"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageCard from "./message-card";
import MessageForm from "./message-form";
import { useEffect, useRef } from "react";
import { Fragment } from "@/generated/prisma";
import { MessageLoading } from "./message-loading";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  // Manejo de loading y error
  const {
    data: messages = [],
    isLoading,
    isError,
    error,
  } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      {
        refetchInterval: 5000,
      }
    )
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageAssistant = lastMessage?.role === "USER";

  // Estado optimista sugerido (no implementado):
  // Podrías mantener un estado local de mensajes enviados y agregarlos a la lista hasta que el backend los confirme.

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading messages...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        {error?.message || "Error loading messages"}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              type={message.type}
              onFragmentClick={setActiveFragment}
            />
          ))}
          {isLastMessageAssistant && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/90 pointer-events-none" />
        {/*
          Para asegurar la invalidación correcta de la query, asegúrate de que el objeto { projectId } sea exactamente igual en MessageForm y aquí.
          Si usas trpc.messages.getMany.queryOptions({ projectId }) en ambos, la key será igual.
        */}
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessagesContainer;
