import { createTRPCRouter } from "../trpc";
import { todoRouter } from "./todo";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  note: todoRouter,
});

export type AppRouter = typeof appRouter;
