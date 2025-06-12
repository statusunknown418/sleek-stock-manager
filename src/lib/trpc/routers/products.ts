
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../index";
import { products } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const productsRouter = router({
  getAll: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(products)
        .where(eq(products.organizationId, input.organizationId));
    }),

  create: protectedProcedure
    .input(z.object({ 
      name: z.string().min(1),
      organizationId: z.string().min(1),
      sku: z.string().min(1),
      description: z.string().optional(),
      barcode: z.string().optional(),
      categoryId: z.string().optional(),
      unitPrice: z.number().optional(),
      costPrice: z.number().optional(),
      minStockLevel: z.number().optional(),
      maxStockLevel: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(products).values({
        name: input.name,
        organizationId: input.organizationId,
        sku: input.sku,
        description: input.description,
        barcode: input.barcode,
        categoryId: input.categoryId,
        unitPrice: input.unitPrice,
        costPrice: input.costPrice,
        minStockLevel: input.minStockLevel,
        maxStockLevel: input.maxStockLevel,
      });
    }),

  update: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      name: z.string().min(1),
      organizationId: z.string().min(1),
      sku: z.string().min(1),
      description: z.string().optional(),
      barcode: z.string().optional(),
      categoryId: z.string().optional(),
      unitPrice: z.number().optional(),
      costPrice: z.number().optional(),
      minStockLevel: z.number().optional(),
      maxStockLevel: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update(products)
        .set({ 
          name: input.name,
          sku: input.sku,
          description: input.description,
          barcode: input.barcode,
          categoryId: input.categoryId,
          unitPrice: input.unitPrice,
          costPrice: input.costPrice,
          minStockLevel: input.minStockLevel,
          maxStockLevel: input.maxStockLevel,
          updatedAt: new Date()
        })
        .where(and(
          eq(products.id, input.id),
          eq(products.organizationId, input.organizationId)
        ));
    }),

  delete: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      organizationId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(products)
        .where(and(
          eq(products.id, input.id),
          eq(products.organizationId, input.organizationId)
        ));
    }),
});
