import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isVendor: boolean("is_vendor").default(false).notNull(),
  fcmToken: text("fcm_token"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Address model
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
});

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
});

// Category model
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image_url: text("image_url"),
  parent_id: text("parent_id"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Product model
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  stock: integer("stock").default(0).notNull(),
  category: text("category"),
  image_url: text("image_url"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  category_id: text("category_id").references(() => categories.id),
  approval_status: text("approval_status").default("approved"),
  rejection_reason: text("rejection_reason"),
  submitted_at: timestamp("submitted_at"),
  approved_at: timestamp("approved_at"),
  brand: text("brand"),
  hsn_code: text("hsn_code"),
  vendor_id: text("vendor_id"),
  sub_category_id: text("sub_category_id"),
  selling_price: integer("selling_price").default(0),
  gst_percentage: decimal("gst_percentage", { precision: 5, scale: 2 }),
  updated_by: text("updated_by"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Banner model
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  imageUrl: text("image_url").notNull(),
  startColor: text("start_color").default("#3B82F6"),
  endColor: text("end_color").default("#6366F1"),
  active: boolean("active").default(true),
  order: integer("order").default(0),
});

export const insertBannerSchema = createInsertSchema(banners).omit({
  id: true,
});

// Vendor profile model
export const vendorProfiles = pgTable("vendor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  businessName: text("business_name").notNull(),
  businessEmail: text("business_email").notNull(),
  businessPhone: text("business_phone").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  category: text("category"),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: integer("total_reviews").default(0),
  status: text("status").default("pending").notNull(),
});

export const insertVendorProfileSchema = createInsertSchema(vendorProfiles).omit({
  id: true,
  averageRating: true,
  totalReviews: true,
});

// Vendor bank account model
export const vendorBankAccounts = pgTable("vendor_bank_accounts", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull().unique(),
  accountName: text("account_name").notNull(),
  accountNumber: text("account_number").notNull(),
  bankName: text("bank_name").notNull(),
  routingNumber: text("routing_number"),
  swiftCode: text("swift_code"),
});

export const insertVendorBankAccountSchema = createInsertSchema(vendorBankAccounts).omit({
  id: true,
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").default("pending").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: integer("shipping_address_id").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

// Order item model
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  vendorId: integer("vendor_id").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

// Cart model
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").unique(),
  sessionId: text("session_id"),
  total: decimal("total", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  total: true,
  createdAt: true,
  updatedAt: true,
});

// Cart item model
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = z.infer<typeof insertAddressSchema>;

// Define a subcategory type
export type SubCategory = {
  id: string;
  name: string;
  image_url: string | null;
};

// Extend the Category type to include subcategories
export type Category = typeof categories.$inferSelect & {
  subcategories?: SubCategory[];
};
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Banner = typeof banners.$inferSelect;
export type InsertBanner = z.infer<typeof insertBannerSchema>;

export type VendorProfile = typeof vendorProfiles.$inferSelect;
export type InsertVendorProfile = z.infer<typeof insertVendorProfileSchema>;

export type VendorBankAccount = typeof vendorBankAccounts.$inferSelect;
export type InsertVendorBankAccount = z.infer<typeof insertVendorBankAccountSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
