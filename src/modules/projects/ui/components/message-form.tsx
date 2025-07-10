import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { FormField, Form } from "@/components/ui/form";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Prompt is required" })
    .max(1000, { message: "Prompt should be shorter" }),
  projectId: z.string().min(1, { message: "Project id required" }),
});

const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
      projectId, // Añadido para evitar warning
    },
  });

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
          //TODO: Invalidate usage status
        );
      },
      onError: (e) => {
        //TODO: redirect to pricing page if user run out of tokens
        toast.error(e.message);
      },
    })
  );

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  const isMac = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-[#18181b] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#232329_1px,transparent_1px)] [background-size:16px_16px]" />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent"
              placeholder="Describe what you want to build..."
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.ctrlKey || e.metaKey)
                ) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />

        <div className="flex gap-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span>{isMac ? "⌘" : "Ctrl"}</span>+<span>Enter</span>
            </kbd>
            &nbsp; to submit
          </div>

          <Button
            type="submit"
            disabled={isButtonDisabled}
            className={cn(
              "size-8 rounded-full",
              isButtonDisabled && "bg-muted-foreground border"
            )}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MessageForm;
