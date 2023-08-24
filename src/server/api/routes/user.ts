import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../../db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(5),
        email: z.string().min(5),
        password: z.string().min(5),
      })
    )
    .mutation(async (opts) => {
      const user = await db.user.findFirst({
        where: {
          email: opts.input.email,
        },
      });
      if (user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "email in not found",
        });
      }
      const hash = bcrypt.hashSync(opts.input.password, 10);
      const register = await db.user.create({
        data: {
          name: opts.input.name,
          email: opts.input.email,
          password: hash,
        },
      });
      return register;
    }),
  list: publicProcedure.query(async () => {
    const users = await db.user.findMany();
    return { users };
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      const user = await db.user.findFirst({
        where: {
          id,
        },
      });
      return user;
    }),
});
