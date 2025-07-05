import { Sandbox } from "@e2b/code-interpreter";

export async function getSandbox(sanxboxId: string) {
  const sandbox = await Sandbox.connect(sanxboxId);
  return sandbox;
}
