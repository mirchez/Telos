import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { openai, createAgent } from "@inngest/agent-kit";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId: string = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("telos-nextjs-test-1");
      return sandbox.sandboxId;
    });
    // // Create a new agent with a system prompt (you can add optional tools, too)
    // const summarizer = createAgent({
    //   name: "summarizer",
    //   system:
    //     "You are an expert summarizer.  You summarize readable, concise, short texts or contexts into a easier and short to read content.",
    //   model: openai({ model: "gpt-4o" }),
    // });

    // //run the agent
    // const { output } = await summarizer.run(
    //   `summarize the following text: ${event.data.value} `
    // );

    //get sandbox url
    const sandboxUrl: string = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    return { sandboxUrl };
  }
);
