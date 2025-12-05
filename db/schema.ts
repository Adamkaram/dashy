import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, integer, uuid, jsonb, decimal, varchar } from "drizzle-orm/pg-core";

// =====================================================
// AUTH TABLES
// =====================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// =====================================================
// MULTI-TENANCY TABLES
// =====================================================

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }).unique(),
  subdomain: varchar("subdomain", { length: 100 }).unique(),
  activeThemeId: uuid("active_theme_id"),
  plan: varchar("plan", { length: 50 }).default("free"),
  status: varchar("status", { length: 50 }).default("active"),
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionStartedAt: timestamp("subscription_started_at").defaultNow(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  settings: jsonb("settings").default({}),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tenants_slug").on(table.slug),
  index("idx_tenants_subdomain").on(table.subdomain),
  index("idx_tenants_domain").on(table.domain),
]);

export const themes = pgTable("themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 50 }).default("custom"),
  isPublic: boolean("is_public").default(false),
  isActive: boolean("is_active").default(true),
  previewImage: text("preview_image"),
  demoUrl: text("demo_url"),
  config: jsonb("config").notNull().default({}),
  createdBy: uuid("created_by").references(() => tenants.id, { onDelete: "set null" }),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  version: varchar("version", { length: 20 }).default("1.0.0"),
  tags: text("tags").array(),
  downloads: integer("downloads").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_themes_slug").on(table.slug),
  index("idx_themes_type").on(table.type),
  index("idx_themes_is_public").on(table.isPublic),
]);

// =====================================================
// CONTENT TABLES (with tenant_id)
// =====================================================

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  parentReference: index("categories_parent_id_idx").on(table.parentId),
  tenantIndex: index("idx_categories_tenant_id").on(table.tenantId),
}));

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  subtitle: text("subtitle"),
  description: text("description"),
  image: text("image"),
  basePrice: integer("base_price").default(0).notNull(),
  salePrice: integer("sale_price").default(0),
  badge: text("badge"),
  isActive: boolean("is_active").default(true).notNull(),
  providerName: text("provider_name").default("My Moments"),
  providerLogo: text("provider_logo"),
  policy: text("policy"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_products_tenant_id").on(table.tenantId),
  index("idx_products_tenant_category").on(table.tenantId, table.categoryId),
]);

export const productOptions = pgTable("product_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'radio', 'checkbox', 'select'
  isRequired: boolean("is_required").default(false).notNull(),
  price: integer("price").default(0).notNull(),
  options: jsonb("options").notNull(), // [{ label: string, price: number }]
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_product_images_tenant_id").on(table.tenantId),
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  area: text("area").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending").notNull(),
  notes: text("notes"),
  couponCode: text("coupon_code"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  selectedOptions: jsonb("selected_options").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_orders_tenant_id").on(table.tenantId),
  index("idx_orders_status").on(table.status),
]);

// =====================================================
// RELATIONS
// =====================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  activeTheme: one(themes, {
    fields: [tenants.activeThemeId],
    references: [themes.id],
  }),
  categories: many(categories),
  products: many(products),
}));

export const themesRelations = relations(themes, ({ one, many }) => ({
  creator: one(tenants, {
    fields: [themes.createdBy],
    references: [tenants.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [categories.tenantId],
    references: [tenants.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_hierarchy",
  }),
  subCategories: many(categories, {
    relationName: "category_hierarchy",
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [products.tenantId],
    references: [tenants.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  options: many(productOptions),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  tenant: one(tenants, {
    fields: [productImages.tenantId],
    references: [tenants.id],
  }),
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productOptionsRelations = relations(productOptions, ({ one }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  tenant: one(tenants, {
    fields: [orders.tenantId],
    references: [tenants.id],
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
}));
