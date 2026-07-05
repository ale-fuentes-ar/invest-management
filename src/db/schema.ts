import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const portfolios = sqliteTable("portfolios", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
});

export const assets = sqliteTable("assets", {
  id: integer("id").primaryKey(),
  ticker: text("ticker").notNull().unique(),
  assetType: text("asset_type").notNull(), // 'STOCK', 'FII', 'WIN', 'WDO'
  sector: text("sector"),
});

export const operations = sqliteTable("operations", {
  id: integer("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfolios.id),
  assetId: integer("asset_id").notNull().references(() => assets.id),
  operationType: text("operation_type").notNull(), // 'BUY', 'SELL', 'DIVIDEND'
  quantity: real("quantity").notNull(),
  price: real("price").notNull(),
  brokerageFees: real("brokerage_fees").default(0).notNull(),
  taxes: real("taxes").default(0).notNull(),
  settlementDate: integer("settlement_date", { mode: "timestamp" }).notNull(),
});

export const targetAllocations = sqliteTable("target_allocations", {
  id: integer("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfolios.id),
  assetType: text("asset_type").notNull(),
  targetPercentage: real("target_percentage").notNull(),
});

export const targetAssetAllocations = sqliteTable("target_asset_allocations", {
  id: integer("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfolios.id),
  assetId: integer("asset_id").notNull().references(() => assets.id),
  targetPercentage: real("target_percentage").notNull(),
});
