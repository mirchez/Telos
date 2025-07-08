import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project id required" }),
      })
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          fragment: true,
        },
      });

      return messages;
    }),

  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Propmt is required" })
          .max(1000, { message: "Prompt should be shorter" }),
        projectId: z.string().min(1, { message: "Project id required" }),
      })
    )
    .mutation(async ({ input }) => {
      const createMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "code-agent/run ",
        data: { value: input.value, projectId: input.projectId },
      });

      return createMessage;
    }),
});
