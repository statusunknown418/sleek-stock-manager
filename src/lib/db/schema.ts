
import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

// Users table
export const users = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Sessions table
export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
});

// Accounts table
export const accounts = sqliteTable("account", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Verification table
export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Organizations table
export const organizations = sqliteTable("organization", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  metadata: text("metadata"),
});

// Organization members table
export const members = sqliteTable("member", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  organizationId: text("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Invitations table
export const invitations = sqliteTable("invitation", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  organizationId: text("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  status: text("status").notNull().default("pending"),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  inviterId: text("inviterId").notNull().references(() => users.id),
});

// Categories table
export const categories = sqliteTable("category", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  organizationId: text("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Locations table
export const locations = sqliteTable("location", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  organizationId: text("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Products table
export const products = sqliteTable("product", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  sku: text("sku").notNull(),
  barcode: text("barcode"),
  categoryId: text("categoryId").references(() => categories.id),
  organizationId: text("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  unitPrice: real("unitPrice").default(0),
  costPrice: real("costPrice").default(0),
  minStockLevel: integer("minStockLevel").default(0),
  maxStockLevel: integer("maxStockLevel").default(100),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Stock table
export const stock = sqliteTable("stock", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  productId: text("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
  locationId: text("locationId").notNull().references(() => locations.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(0),
  reservedQuantity: integer("reservedQuantity").notNull().default(0),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Stock movements table
export const stockMovements = sqliteTable("stock_movement", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  productId: text("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
  locationId: text("locationId").notNull().references(() => locations.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'in', 'out', 'transfer', 'adjustment'
  quantity: integer("quantity").notNull(),
  previousQuantity: integer("previousQuantity").notNull(),
  newQuantity: integer("newQuantity").notNull(),
  reason: text("reason"),
  userId: text("userId").notNull().references(() => users.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
