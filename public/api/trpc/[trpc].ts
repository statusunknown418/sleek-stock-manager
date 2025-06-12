
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../src/lib/trpc/routers/app";
import { createTRPCContext } from "../../../src/lib/trpc";

export async function GET(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext({ req: request }),
  });
}

export async function POST(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext({ req: request }),
  });
}
