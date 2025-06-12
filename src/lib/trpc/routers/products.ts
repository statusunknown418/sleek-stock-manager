
import { z } from "zod";
import { router, protectedProcedure } from "../index";
import { products, categories, stock } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export const productsRouter = router({
  getAll: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          sku: products.sku,
          barcode: products.barcode,
          unitPrice: products.unitPrice,
          costPrice: products.costPrice,
          minStockLevel: products.minStockLevel,
          maxStockLevel: products.maxStockLevel,
          image: products.image,
          createdAt: products.createdAt,
          category: {
            id: categories.id,
            name: categories.name,
          },
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.organizationId, input.organizationId))
        .orderBy(desc(products.createdAt));
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      sku: z.string().min(1),
      barcode: z.string().optional(),
      categoryId: z.string().optional(),
      organizationId: z.string(),
      unitPrice: z.number().min(0).optional(),
      costPrice: z.number().min(0).optional(),
      minStockLevel: z.number().min(0).optional(),
      maxStockLevel: z.number().min(0).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [product] = await ctx.db.insert(products).values(input).returning();
      return product;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      sku: z.string().min(1).optional(),
      barcode: z.string().optional(),
      categoryId: z.string().optional(),
      unitPrice: z.number().min(0).optional(),
      costPrice: z.number().min(0).optional(),
      minStockLevel: z.number().min(0).optional(),
      maxStockLevel: z.number().min(0).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [product] = await ctx.db
        .update(products)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();
      return product;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
