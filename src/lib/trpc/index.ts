
import { initTRPC, TRPCError } from "@trpc/server";
import { getSession } from "../auth/client";
import { db } from "../db";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    const session = await getSession();
    if (!session?.data?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        user: session.data.user,
        session: session.data.session,
      },
    });
  })
);

export const createTRPCContext = async () => {
  return {
    db,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
