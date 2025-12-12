import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, integer, uuid, jsonb, decimal, varchar, serial } from "drizzle-orm/pg-core";

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
  isActive: boolean("is_active").default(true).notNull(),
  // Inventory & product fields (SKU unique per tenant)
  sku: varchar("sku", { length: 100 }),
  brand: varchar("brand", { length: 100 }),
  // For simple products without variants. Variants track qty in productOptions.options JSONB
  quantity: integer("quantity").default(0).notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_products_tenant_id").on(table.tenantId),
  index("idx_products_tenant_category").on(table.tenantId, table.categoryId),
  index("idx_products_brand").on(table.brand),
]);

export const productOptions = pgTable("product_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'radio', 'checkbox', 'select'
  isRequired: boolean("is_required").default(false).notNull(),
  price: integer("price").default(0).notNull(),
  options: jsonb("options").notNull(), // [{ label: string, price: number, value?: string, quantity?: number, sku?: string }]
  displayStyle: varchar("display_style", { length: 50 }).default('text'),
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
  // Product/Service Link (Optional now as it can be a cart of multiple items)
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),

  // Customer Details
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"), // Added email

  // Service Specific (Now Optional)
  date: text("date"),
  time: text("time"),
  area: text("area"), // Can still be used or replaced by detailed address

  // Store Specific (New)
  address: text("address"),
  city: text("city"),
  governorate: text("governorate"),
  items: jsonb("items").default([]), // Cart items [{productId, quantity, price...}]

  // Financials
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending").notNull(),
  notes: text("notes"),
  couponCode: text("coupon_code"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),

  // Meta
  selectedOptions: jsonb("selected_options").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_orders_tenant_id").on(table.tenantId),
  index("idx_orders_status").on(table.status),
]);

// ... (previous tables)

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: varchar("discount_type", { length: 20 }).notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(), // Dump says id is integer with nextval sequence! Not UUID.
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  image: text("image").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  subtitleColor: varchar("subtitle_color").default('#FFFFFF'),
  titleColor: varchar("title_color").default('#FFFFFF'),
}, (table) => [
  index("idx_hero_slides_tenant_id").on(table.tenantId),
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
  orders: many(orders),
  coupons: many(coupons),
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

export const couponsRelations = relations(coupons, ({ one }) => ({
  tenant: one(tenants, {
    fields: [coupons.tenantId],
    references: [tenants.id],
  }),
}));

// =====================================================
// NOTIFICATIONS TABLE
// =====================================================

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),

  // Notification source: 'system' (broadcast) or 'tenant' (specific)
  source: varchar("source", { length: 20 }).notNull().default("tenant"),

  // Notification content
  type: varchar("type", { length: 50 }).notNull().default("info"), // order, success, warning, info, error
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // Icon name from lucide-react
  image: text("image"), // Image URL for rich notifications

  // Status
  read: boolean("read").default(false).notNull(),
  readAt: timestamp("read_at"),

  // Optional link/action
  actionUrl: text("action_url"),
  actionLabel: varchar("action_label", { length: 100 }),

  // Related entity (optional)
  entityType: varchar("entity_type", { length: 50 }), // order, product, coupon, etc.
  entityId: uuid("entity_id"),

  // Metadata for additional data
  metadata: jsonb("metadata").default({}),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // Optional expiration
}, (table) => [
  index("idx_notifications_tenant").on(table.tenantId),
  index("idx_notifications_tenant_read").on(table.tenantId, table.read),
  index("idx_notifications_created").on(table.createdAt),
  index("idx_notifications_source").on(table.source),
]);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  tenant: one(tenants, {
    fields: [notifications.tenantId],
    references: [tenants.id],
  }),
}));

