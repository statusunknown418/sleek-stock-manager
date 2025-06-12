
import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "../auth/server";
import { db } from "../db";
import superjson from "superjson";

export const createTRPCContext = async (opts: { req?: Request }) => {
  let session = null;
  let user = null;

  if (opts.req) {
    try {
      const authResult = await auth.api.getSession({
        headers: opts.req.headers,
      });
      if (authResult) {
        session = authResult.session;
        user = authResult.user;
      }
    } catch (error) {
      // Session validation failed
      console.log("Session validation failed:", error);
    }
  }

  return {
    db,
    session,
    user,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        user: ctx.user,
      },
    });
  })
);
