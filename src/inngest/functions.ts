import { inngest } from "./client";

import { openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    // Create a new agent with a system prompt (you can add optional tools, too)
    const summarizer = createAgent({
      name: "summarizer",
      system:
        "You are an expert summarizer.  You summarize readable, concise, short texts or contexts into a easier and short to read content.",
      model: openai({ model: "gpt-4o" }),
    });

    //run the agent
    const { output } = await summarizer.run(
      `summarize the following text: ${event.data.value} `
    );

    return { output };
  }
);
