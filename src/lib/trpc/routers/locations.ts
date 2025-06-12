
import { z } from "zod";
import { router, protectedProcedure } from "../index";
import { locations } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export const locationsRouter = router({
  getAll: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(locations)
        .where(eq(locations.organizationId, input.organizationId))
        .orderBy(desc(locations.createdAt));
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      organizationId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [location] = await ctx.db.insert(locations).values(input).returning();
      return location;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [location] = await ctx.db
        .update(locations)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(locations.id, id))
        .returning();
      return location;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(locations).where(eq(locations.id, input.id));
      return { success: true };
    }),
});
