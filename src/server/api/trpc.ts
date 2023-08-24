import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession, type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

type CreateContextOptions = {
  session: Session | null;
};

const createInnerTRCPContext = (opts: CreateContextOptions) => {
  return { session: opts.session, db };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerSession(req, res, authOptions);
  return createInnerTRCPContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
