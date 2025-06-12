
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../index";
import { locations } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const locationsRouter = router({
  getAll: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(locations)
        .where(eq(locations.organizationId, input.organizationId));
    }),

  create: protectedProcedure
    .input(z.object({ 
      name: z.string().min(1),
      organizationId: z.string().min(1),
      description: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(locations).values({
        name: input.name,
        organizationId: input.organizationId,
        description: input.description,
      });
    }),

  update: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      name: z.string().min(1),
      organizationId: z.string().min(1),
      description: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update(locations)
        .set({ 
          name: input.name,
          description: input.description,
          updatedAt: new Date()
        })
        .where(and(
          eq(locations.id, input.id),
          eq(locations.organizationId, input.organizationId)
        ));
    }),

  delete: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      organizationId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(locations)
        .where(and(
          eq(locations.id, input.id),
          eq(locations.organizationId, input.organizationId)
        ));
    }),
});
