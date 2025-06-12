
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../index";
import { categories } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const categoriesRouter = router({
  getAll: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(categories)
        .where(eq(categories.organizationId, input.organizationId));
    }),

  create: protectedProcedure
    .input(z.object({ 
      name: z.string().min(1),
      organizationId: z.string().min(1),
      description: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(categories).values({
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
      return ctx.db.update(categories)
        .set({ 
          name: input.name,
          description: input.description,
          updatedAt: new Date()
        })
        .where(and(
          eq(categories.id, input.id),
          eq(categories.organizationId, input.organizationId)
        ));
    }),

  delete: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      organizationId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(categories)
        .where(and(
          eq(categories.id, input.id),
          eq(categories.organizationId, input.organizationId)
        ));
    }),
});
