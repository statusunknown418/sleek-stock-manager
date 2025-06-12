
import { z } from "zod";
import { router, protectedProcedure } from "../index";
import { categories } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export const categoriesRouter = router({
  getAll: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.organizationId, input.organizationId))
        .orderBy(desc(categories.createdAt));
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      organizationId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [category] = await ctx.db.insert(categories).values(input).returning();
      return category;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [category] = await ctx.db
        .update(categories)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(categories.id, id))
        .returning();
      return category;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
