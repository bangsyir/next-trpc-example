import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const todoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, { message: "Title is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { email: ctx.session.user.email as string },
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const newTodo = await ctx.db.todo.create({
        data: {
          title: input.title,
          userId: user.id,
        },
      });
      return { ...newTodo };
    }),
  getTodo: protectedProcedure.query(async ({ ctx, input }) => {
    const todo = await ctx.db.todo.findMany({
      where: {
        userId: ctx.session.user.sub,
      },
    });
    return todo;
  }),
  updateDone: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        done: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.db.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: input.done,
        },
      });
      return update;
    }),
});
