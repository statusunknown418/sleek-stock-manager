
import { z } from "zod";
import { router, protectedProcedure } from "../index";
import { stock, products, locations, stockMovements } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const stockRouter = router({
  getByLocation: protectedProcedure
    .input(z.object({
      locationId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: stock.id,
          quantity: stock.quantity,
          reservedQuantity: stock.reservedQuantity,
          updatedAt: stock.updatedAt,
          product: {
            id: products.id,
            name: products.name,
            sku: products.sku,
            minStockLevel: products.minStockLevel,
            maxStockLevel: products.maxStockLevel,
          },
        })
        .from(stock)
        .innerJoin(products, eq(stock.productId, products.id))
        .where(eq(stock.locationId, input.locationId));
    }),

  updateQuantity: protectedProcedure
    .input(z.object({
      productId: z.string(),
      locationId: z.string(),
      quantity: z.number(),
      type: z.enum(["in", "out", "transfer", "adjustment"]),
      reason: z.string().optional(),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { productId, locationId, quantity, type, reason, userId } = input;

      // Get current stock
      const currentStock = await ctx.db
        .select()
        .from(stock)
        .where(and(eq(stock.productId, productId), eq(stock.locationId, locationId)))
        .limit(1);

      const previousQuantity = currentStock[0]?.quantity || 0;
      let newQuantity: number;

      switch (type) {
        case "in":
          newQuantity = previousQuantity + quantity;
          break;
        case "out":
          newQuantity = Math.max(0, previousQuantity - quantity);
          break;
        case "adjustment":
          newQuantity = quantity;
          break;
        default:
          newQuantity = previousQuantity;
      }

      // Update or insert stock record
      const stockRecord = await ctx.db
        .insert(stock)
        .values({
          productId,
          locationId,
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [stock.productId, stock.locationId],
          set: {
            quantity: newQuantity,
            updatedAt: new Date(),
          },
        })
        .returning();

      // Record stock movement
      await ctx.db.insert(stockMovements).values({
        productId,
        locationId,
        type,
        quantity: Math.abs(quantity),
        previousQuantity,
        newQuantity,
        reason,
        userId,
      });

      return stockRecord[0];
    }),

  getMovements: protectedProcedure
    .input(z.object({
      productId: z.string().optional(),
      locationId: z.string().optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input.productId) conditions.push(eq(stockMovements.productId, input.productId));
      if (input.locationId) conditions.push(eq(stockMovements.locationId, input.locationId));

      return await ctx.db
        .select({
          id: stockMovements.id,
          type: stockMovements.type,
          quantity: stockMovements.quantity,
          previousQuantity: stockMovements.previousQuantity,
          newQuantity: stockMovements.newQuantity,
          reason: stockMovements.reason,
          createdAt: stockMovements.createdAt,
          product: {
            id: products.id,
            name: products.name,
            sku: products.sku,
          },
          location: {
            id: locations.id,
            name: locations.name,
          },
        })
        .from(stockMovements)
        .innerJoin(products, eq(stockMovements.productId, products.id))
        .innerJoin(locations, eq(stockMovements.locationId, locations.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(stockMovements.createdAt))
        .limit(input.limit);
    }),
});
