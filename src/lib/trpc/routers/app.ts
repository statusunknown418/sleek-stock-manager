
import { router } from "../index";
import { productsRouter } from "./products";
import { categoriesRouter } from "./categories";
import { locationsRouter } from "./locations";
import { stockRouter } from "./stock";

export const appRouter = router({
  products: productsRouter,
  categories: categoriesRouter,
  locations: locationsRouter,
  stock: stockRouter,
});

export type AppRouter = typeof appRouter;
