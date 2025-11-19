// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  addresses;
  categories;
  products;
  banners;
  vendorProfiles;
  vendorBankAccounts;
  orders;
  orderItems;
  carts;
  cartItems;
  userId;
  addressId;
  categoryId;
  productId;
  bannerId;
  vendorProfileId;
  vendorBankAccountId;
  orderId;
  orderItemId;
  cartId;
  cartItemId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.addresses = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.banners = /* @__PURE__ */ new Map();
    this.vendorProfiles = /* @__PURE__ */ new Map();
    this.vendorBankAccounts = /* @__PURE__ */ new Map();
    this.orders = /* @__PURE__ */ new Map();
    this.orderItems = /* @__PURE__ */ new Map();
    this.carts = /* @__PURE__ */ new Map();
    this.cartItems = /* @__PURE__ */ new Map();
    this.userId = 1;
    this.addressId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.bannerId = 1;
    this.vendorProfileId = 1;
    this.vendorBankAccountId = 1;
    this.orderId = 1;
    this.orderItemId = 1;
    this.cartId = 1;
    this.cartItemId = 1;
    this.initializeData();
  }
  initializeData() {
    const mainCategories = [
      {
        id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        name: "Flour",
        description: "",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/cqvqgxswc9v_1744960850887.jpg",
        parent_id: null,
        is_active: true,
        created_at: /* @__PURE__ */ new Date("2025-04-12T06:06:00.934002+00:00"),
        updated_at: /* @__PURE__ */ new Date("2025-04-18T07:20:59.454884+00:00"),
        slug: "flour"
      },
      {
        id: "9f9c1f99-7a54-4cb7-8dcc-03be8ab89599",
        name: "Ground Nuts",
        description: "Ground Nuts",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/ls3qqenmds_1744960880045.jpg",
        parent_id: null,
        is_active: true,
        created_at: /* @__PURE__ */ new Date("2025-04-12T06:14:50.168145+00:00"),
        updated_at: /* @__PURE__ */ new Date("2025-04-18T07:21:23.877096+00:00"),
        slug: "ground-nuts"
      },
      {
        id: "604baf0b-b583-4ae7-9567-f7b53f924d89",
        name: "Oils & Ghee",
        description: "Oil's & Ghee",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/pnjm0s54ia_1744002316449.jpg",
        parent_id: null,
        is_active: true,
        created_at: /* @__PURE__ */ new Date("2025-04-05T12:11:29.440093+00:00"),
        updated_at: /* @__PURE__ */ new Date("2025-04-29T10:49:14.641566+00:00"),
        slug: "oils-ghee"
      },
      {
        id: "86613b89-fdad-4231-a444-308afb945283",
        name: "Pulses",
        description: "They provide a significant amount of dietary fiber, promoting digestive health and helping regulate blood sugar.",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/7191a19v20s_1744003097018.jpeg",
        parent_id: null,
        is_active: true,
        created_at: /* @__PURE__ */ new Date("2025-04-05T12:31:25.655456+00:00"),
        updated_at: /* @__PURE__ */ new Date("2025-04-07T05:18:21.196938+00:00"),
        slug: "pulses"
      },
      {
        id: "1a915b44-a7d7-472e-abae-90dd70ae3923",
        name: "Rice",
        description: "Each type of rice offers unique flavors, textures, and cooking properties, allowing you to choose the perfect variety for your dishes!",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/18626gx2z3y_1744003292166.jpeg",
        parent_id: null,
        is_active: true,
        created_at: /* @__PURE__ */ new Date("2025-04-05T12:15:10.696512+00:00"),
        updated_at: /* @__PURE__ */ new Date("2025-04-07T05:21:40.292472+00:00"),
        slug: "rice"
      },
      {
        id: "ed18ccf0-16f5-4932-baa0-0bcc4a9d9788",
        name: "Sugar & Salt",
        description: "Sugar",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/0e5f0np7k54a_1743946008909.webp",
        parent_id: null,
        is_active: true,
        created_at: /* @__PURE__ */ new Date("2025-04-05T14:20:45.939243+00:00"),
        updated_at: /* @__PURE__ */ new Date("2025-04-25T13:29:37.999022+00:00"),
        slug: "sugar-salt"
      }
    ];
    const flourSubcategories = [
      {
        id: "6f2571ab-3b72-4734-8896-d485ab86d6ae",
        name: "wheat",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date(),
        description: null,
        slug: "wheat"
      },
      {
        id: "e50ffff9-a614-45ac-8168-cc981677416e",
        name: "Atta",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date(),
        description: null,
        slug: "atta"
      },
      {
        id: "2b82050e-2094-4d76-adf9-27e2bcdb5472",
        name: "Maida",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date(),
        description: null,
        slug: "maida"
      },
      {
        id: "b6436c42-c240-44aa-a341-92a3757fb8a5",
        name: "Besan",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date(),
        description: null,
        slug: "besan"
      },
      {
        id: "6011cd90-6606-4c99-9902-25ac65cb8258",
        name: "Idly Rava",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date(),
        description: null,
        slug: "idly-rava"
      }
    ];
    [...mainCategories, ...flourSubcategories].forEach((category) => {
      this.categories.set(category.id, category);
    });
    const banners2 = [
      {
        title: "Shop From Multiple Vendors",
        subtitle: "Discover unique products from verified sellers",
        buttonText: "Shop Now",
        buttonLink: "/products",
        imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
        startColor: "#3B82F6",
        endColor: "#4F46E5",
        active: true,
        order: 1
      },
      {
        title: "Become a Vendor Today",
        subtitle: "Start selling your products to thousands of customers",
        buttonText: "Register Now",
        buttonLink: "/vendor-register",
        imageUrl: "https://images.unsplash.com/photo-1561715276-a2d087060f1d",
        startColor: "#10B981",
        endColor: "#0D9488",
        active: true,
        order: 2
      }
    ];
    banners2.forEach((banner) => {
      this.createBanner(banner);
    });
    const users2 = [
      { username: "user1", email: "user1@example.com", password: "password123", firstName: "John", lastName: "Doe", isVendor: false },
      { username: "vendor1", email: "vendor1@example.com", password: "password123", firstName: "Alice", lastName: "Smith", isVendor: true },
      { username: "vendor2", email: "vendor2@example.com", password: "password123", firstName: "Bob", lastName: "Johnson", isVendor: true },
      { username: "vendor3", email: "vendor3@example.com", password: "password123", firstName: "Carol", lastName: "Williams", isVendor: true },
      { username: "vendor4", email: "vendor4@example.com", password: "password123", firstName: "David", lastName: "Brown", isVendor: true }
    ];
    users2.forEach((user) => {
      this.createUser(user);
    });
    const vendorProfiles2 = [
      {
        userId: 2,
        businessName: "TechStore",
        businessEmail: "contact@techstore.com",
        businessPhone: "123-456-7890",
        description: "Premium Electronics & Gadgets",
        logoUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
        coverUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f",
        category: "electronics",
        status: "approved"
      },
      {
        userId: 3,
        businessName: "HomeDecor",
        businessEmail: "contact@homedecor.com",
        businessPhone: "123-456-7891",
        description: "Modern Home Furnishings",
        logoUrl: "https://images.unsplash.com/photo-1507138086030-616c3b6dd768",
        coverUrl: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55",
        category: "home-decor",
        status: "approved"
      },
      {
        userId: 4,
        businessName: "BeautyEssentials",
        businessEmail: "contact@beautyessentials.com",
        businessPhone: "123-456-7892",
        description: "Organic Skincare Products",
        logoUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
        coverUrl: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19",
        category: "beauty",
        status: "approved"
      },
      {
        userId: 5,
        businessName: "FashionWorld",
        businessEmail: "contact@fashionworld.com",
        businessPhone: "123-456-7893",
        description: "Trendy Apparel & Accessories",
        logoUrl: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4",
        coverUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "fashion",
        status: "approved"
      }
    ];
    vendorProfiles2.forEach((profile, index) => {
      const created = this.createVendorProfile(profile);
      const ratings = [4.8, 4.7, 4.9, 4.6];
      const reviews = [243, 187, 156, 215];
      this.vendorProfiles.set(created.id, {
        ...created,
        averageRating: ratings[index],
        totalReviews: reviews[index]
      });
    });
    const products2 = [
      {
        name: "Smart Watch Series X",
        slug: "smart-watch-series-x",
        description: "The latest smart watch with advanced health tracking features",
        price: 129.99,
        compareAtPrice: 159.99,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        categoryId: 1,
        vendorId: 1,
        stock: 50,
        featured: true,
        status: "active"
      },
      {
        name: "Wireless Bluetooth Earbuds",
        slug: "wireless-bluetooth-earbuds",
        description: "High-quality wireless earbuds with noise cancellation",
        price: 79.99,
        compareAtPrice: 99.99,
        imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601",
        categoryId: 1,
        vendorId: 1,
        stock: 100,
        featured: true,
        status: "active"
      },
      {
        name: "Running Sneakers Air Max",
        slug: "running-sneakers-air-max",
        description: "Comfortable running shoes with air cushioning",
        price: 149.99,
        compareAtPrice: 199.99,
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
        categoryId: 2,
        vendorId: 4,
        stock: 75,
        featured: true,
        status: "active"
      },
      {
        name: "Minimalist Desk Lamp",
        slug: "minimalist-desk-lamp",
        description: "Modern desk lamp with adjustable brightness",
        price: 49.99,
        compareAtPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657",
        categoryId: 3,
        vendorId: 2,
        stock: 30,
        featured: true,
        status: "active"
      },
      {
        name: "Organic Hand Cream Set",
        slug: "organic-hand-cream-set",
        description: "Set of organic hand creams with natural ingredients",
        price: 29.99,
        compareAtPrice: 39.99,
        imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f",
        categoryId: 4,
        vendorId: 3,
        stock: 15,
        featured: true,
        status: "active"
      }
    ];
    products2.forEach((product) => {
      this.createProduct(product);
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(user) {
    const id = this.userId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async deleteUser(id) {
    return this.users.delete(id);
  }
  // Address methods
  async getAddress(id) {
    return this.addresses.get(id);
  }
  async getAddressesByUserId(userId) {
    return Array.from(this.addresses.values()).filter((address) => address.userId === userId);
  }
  async createAddress(address) {
    const id = this.addressId++;
    const newAddress = { ...address, id };
    this.addresses.set(id, newAddress);
    return newAddress;
  }
  async updateAddress(id, addressData) {
    const address = this.addresses.get(id);
    if (!address) return void 0;
    const updatedAddress = { ...address, ...addressData };
    this.addresses.set(id, updatedAddress);
    return updatedAddress;
  }
  async deleteAddress(id) {
    return this.addresses.delete(id);
  }
  // Category methods
  async getCategory(id) {
    return this.categories.get(id);
  }
  async getCategoryBySlug(slug) {
    return Array.from(this.categories.values()).find((category) => category.slug === slug);
  }
  async getAllCategories() {
    const mainCategories = Array.from(this.categories.values()).filter((cat) => !cat.parent_id);
    return mainCategories.map((cat) => {
      const subCats = Array.from(this.categories.values()).filter((subCat) => subCat.parent_id === cat.id).map((subCat) => ({
        id: subCat.id,
        name: subCat.name,
        image_url: subCat.image_url
      }));
      return {
        ...cat,
        subcategories: subCats
      };
    });
  }
  async createCategory(category) {
    const id = this.categoryId++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  // Product methods
  async getProduct(id) {
    return this.products.get(id);
  }
  async getProductBySlug(slug) {
    return Array.from(this.products.values()).find((product) => product.slug === slug);
  }
  async getProductsByCategory(categoryId, limit, offset = 0) {
    const allProducts = Array.from(this.products.values()).filter((product) => product.categoryId === categoryId);
    if (limit) {
      return allProducts.slice(offset, offset + limit);
    }
    return allProducts;
  }
  async getAllProducts(limit, offset = 0) {
    const allProducts = Array.from(this.products.values());
    if (limit) {
      return allProducts.slice(offset, offset + limit);
    }
    return allProducts;
  }
  async getProductsByVendor(vendorId) {
    return Array.from(this.products.values()).filter((product) => product.vendorId === vendorId);
  }
  async getFeaturedProducts(limit) {
    const featuredProducts = Array.from(this.products.values()).filter((product) => product.featured);
    if (limit) {
      return featuredProducts.slice(0, limit);
    }
    return featuredProducts;
  }
  async createProduct(product) {
    const id = this.productId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  async updateProduct(id, productData) {
    const product = this.products.get(id);
    if (!product) return void 0;
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    return this.products.delete(id);
  }
  // Banner methods
  async getAllBanners() {
    return Array.from(this.banners.values());
  }
  async getActiveBanners() {
    return Array.from(this.banners.values()).filter((banner) => banner.active).sort((a, b) => a.order - b.order);
  }
  async createBanner(banner) {
    const id = this.bannerId++;
    const newBanner = { ...banner, id };
    this.banners.set(id, newBanner);
    return newBanner;
  }
  // Vendor profile methods
  async getVendorProfile(id) {
    return this.vendorProfiles.get(id);
  }
  async getVendorProfileByUserId(userId) {
    return Array.from(this.vendorProfiles.values()).find((profile) => profile.userId === userId);
  }
  async getAllVendorProfiles(limit, offset = 0) {
    const allProfiles = Array.from(this.vendorProfiles.values()).filter((profile) => profile.status === "approved");
    if (limit) {
      return allProfiles.slice(offset, offset + limit);
    }
    return allProfiles;
  }
  // async getFeaturedVendors(limit?: number): Promise<VendorProfile[]> {
  //   const allVendors = Array.from(this.vendorProfiles.values())
  //     .filter(profile => profile.status === "approved")
  //     .sort((a, b) => Number(b.averageRating) - Number(a.averageRating));
  //   if (limit) {
  //     return allVendors.slice(0, limit);
  //   }
  //   return allVendors;
  // }
  async createVendorProfile(vendorProfile) {
    const id = this.vendorProfileId++;
    const newProfile = {
      ...vendorProfile,
      id,
      averageRating: 0,
      totalReviews: 0
    };
    this.vendorProfiles.set(id, newProfile);
    return newProfile;
  }
  async updateVendorProfile(id, vendorData) {
    const profile = this.vendorProfiles.get(id);
    if (!profile) return void 0;
    const updatedProfile = { ...profile, ...vendorData };
    this.vendorProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  // Vendor bank account methods
  async getVendorBankAccount(vendorId) {
    return Array.from(this.vendorBankAccounts.values()).find((account) => account.vendorId === vendorId);
  }
  async createVendorBankAccount(bankAccount) {
    const id = this.vendorBankAccountId++;
    const newAccount = { ...bankAccount, id };
    this.vendorBankAccounts.set(id, newAccount);
    return newAccount;
  }
  async updateVendorBankAccount(vendorId, bankData) {
    const account = Array.from(this.vendorBankAccounts.values()).find((acc) => acc.vendorId === vendorId);
    if (!account) return void 0;
    const updatedAccount = { ...account, ...bankData };
    this.vendorBankAccounts.set(account.id, updatedAccount);
    return updatedAccount;
  }
  // Order methods
  async getOrder(id) {
    return this.orders.get(id);
  }
  async getOrderByOrderNumber(orderNumber) {
    return Array.from(this.orders.values()).find((order) => order.orderNumber === orderNumber);
  }
  async getOrdersByUserId(userId) {
    return Array.from(this.orders.values()).filter((order) => order.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getOrdersByVendorId(vendorId) {
    const vendorOrderItems = Array.from(this.orderItems.values()).filter((item) => item.vendorId === vendorId);
    const orderIds = [...new Set(vendorOrderItems.map((item) => item.orderId))];
    return orderIds.map((id) => this.orders.get(id)).filter((order) => order !== void 0).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async createOrder(order) {
    const id = this.orderId++;
    const orderNumber = `ORD-${Date.now()}-${id}`;
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const newOrder = {
      ...order,
      id,
      orderNumber,
      createdAt
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) return void 0;
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  // Order item methods
  async getOrderItems(orderId) {
    return Array.from(this.orderItems.values()).filter((item) => item.orderId === orderId);
  }
  async createOrderItem(orderItem) {
    const id = this.orderItemId++;
    const newItem = { ...orderItem, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }
  // Cart methods
  async getCart(id) {
    return this.carts.get(id);
  }
  async getCartByUserId(userId) {
    return Array.from(this.carts.values()).find((cart) => cart.userId === userId);
  }
  async getCartBySessionId(sessionId) {
    return Array.from(this.carts.values()).find((cart) => cart.sessionId === sessionId);
  }
  async createCart(cart) {
    const id = this.cartId++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newCart = {
      ...cart,
      id,
      total: 0,
      createdAt: now,
      updatedAt: now
    };
    this.carts.set(id, newCart);
    return newCart;
  }
  async updateCartTotal(id, total) {
    const cart = this.carts.get(id);
    if (!cart) return void 0;
    const updatedCart = {
      ...cart,
      total,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.carts.set(id, updatedCart);
    return updatedCart;
  }
  async deleteCart(id) {
    await this.clearCartItems(id);
    return this.carts.delete(id);
  }
  // Cart item methods
  async getCartItem(id) {
    return this.cartItems.get(id);
  }
  async getCartItems(cartId) {
    return Array.from(this.cartItems.values()).filter((item) => item.cartId === cartId);
  }
  async createCartItem(cartItem) {
    const id = this.cartItemId++;
    const newItem = { ...cartItem, id };
    this.cartItems.set(id, newItem);
    await this.updateCartTotalAfterItemChange(cartItem.cartId);
    return newItem;
  }
  async updateCartItem(id, quantity) {
    const item = this.cartItems.get(id);
    if (!item) return void 0;
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    await this.updateCartTotalAfterItemChange(item.cartId);
    return updatedItem;
  }
  async deleteCartItem(id) {
    const item = this.cartItems.get(id);
    if (!item) return false;
    const cartId = item.cartId;
    const result = this.cartItems.delete(id);
    await this.updateCartTotalAfterItemChange(cartId);
    return result;
  }
  async clearCartItems(cartId) {
    const itemsToDelete = Array.from(this.cartItems.values()).filter((item) => item.cartId === cartId);
    itemsToDelete.forEach((item) => {
      this.cartItems.delete(item.id);
    });
    const cart = this.carts.get(cartId);
    if (cart) {
      this.updateCartTotal(cartId, 0);
    }
    return true;
  }
  // Helper methods
  async updateCartTotalAfterItemChange(cartId) {
    const cartItems2 = await this.getCartItems(cartId);
    const total = cartItems2.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    await this.updateCartTotal(cartId, total);
  }
};
var storage = new MemStorage();

// server/routes.ts
import { z } from "zod";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isVendor: boolean("is_vendor").default(false).notNull(),
  fcmToken: text("fcm_token")
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true
});
var addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  isDefault: boolean("is_default").default(false).notNull()
});
var insertAddressSchema = createInsertSchema(addresses).omit({
  id: true
});
var categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image_url: text("image_url"),
  parent_id: text("parent_id"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});
var products = pgTable("products", {
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
  updated_by: text("updated_by")
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true
});
var banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  imageUrl: text("image_url").notNull(),
  startColor: text("start_color").default("#3B82F6"),
  endColor: text("end_color").default("#6366F1"),
  active: boolean("active").default(true),
  order: integer("order").default(0)
});
var insertBannerSchema = createInsertSchema(banners).omit({
  id: true
});
var vendorProfiles = pgTable("vendor_profiles", {
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
  status: text("status").default("pending").notNull()
});
var insertVendorProfileSchema = createInsertSchema(vendorProfiles).omit({
  id: true,
  averageRating: true,
  totalReviews: true
});
var vendorBankAccounts = pgTable("vendor_bank_accounts", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull().unique(),
  accountName: text("account_name").notNull(),
  accountNumber: text("account_number").notNull(),
  bankName: text("bank_name").notNull(),
  routingNumber: text("routing_number"),
  swiftCode: text("swift_code")
});
var insertVendorBankAccountSchema = createInsertSchema(vendorBankAccounts).omit({
  id: true
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").default("pending").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: integer("shipping_address_id").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  vendorId: integer("vendor_id").notNull()
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});
var carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").unique(),
  // sessionId: text("session_id"),
  total: decimal("total", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  total: true,
  createdAt: true,
  updatedAt: true
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull()
});
var insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true
});

// server/routes.ts
import session from "express-session";
import MemoryStore from "memorystore";

// client/src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = "https://sqpgtmpbfmtaivbfsjuy.supabase.co";
var supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcGd0bXBiZm10YWl2YmZzanV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTg5NjksImV4cCI6MjA1Nzg3NDk2OX0.lXF9kF17AvrXT7Om8It8JoVTD-cLkuYQffz5bdQ61XA";
var supabase = createClient(supabaseUrl, supabaseKey);

// server/routes.ts
var MemoryStoreSession = MemoryStore(session);
var isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
async function registerRoutes(app2) {
  app2.use(
    session({
      cookie: { maxAge: 864e5 },
      // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 864e5
        // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "marketplace-secret"
    })
  );
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      const existingUsername = await storage.getUserByUsername(
        userData.username
      );
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
      const newUser = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = newUser;
      req.session.user = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isVendor: newUser.isVendor
      };
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.post("/api/auth/signin", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        isVendor: user.isVendor
      };
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to sign in" });
    }
  });
  app2.post("/api/auth/signout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to sign out" });
      }
      res.json({ message: "Signed out successfully" });
    });
  });
  app2.get("/api/auth/session", (req, res) => {
    if (req.session && req.session.user) {
      return res.json({ user: req.session.user });
    }
    res.json({ user: null });
  });
  app2.post("/api/auth/otp-signin", (req, res) => {
    res.json({ message: "OTP sent successfully" });
  });
  app2.get("/api/users/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (req.session.user?.id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user" });
    }
  });
  app2.delete("/api/users/:userId/delete", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (req.session.user?.id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Error during session cleanup" });
        }
        res.json({ message: "User deleted successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  app2.post("/api/users/fcm-tokens", isAuthenticated, (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      const userId = req.session.user.id;
      storage.updateUser(userId, { fcmToken: token });
      res.json({ message: "FCM token registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to register FCM token" });
    }
  });
  app2.delete("/api/users/fcm-tokens", isAuthenticated, (req, res) => {
    try {
      const userId = req.session.user.id;
      storage.updateUser(userId, { fcmToken: null });
      res.json({ message: "FCM token unregistered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unregister FCM token" });
    }
  });
  app2.get("/api/users/addresses", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user.id;
      const addresses2 = await storage.getAddressesByUserId(userId);
      res.json(addresses2);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve addresses" });
    }
  });
  app2.post("/api/users/addresses", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user.id;
      const addressData = insertAddressSchema.parse({
        ...req.body,
        userId
      });
      if (addressData.isDefault) {
        const userAddresses = await storage.getAddressesByUserId(userId);
        for (const address of userAddresses) {
          if (address.isDefault) {
            await storage.updateAddress(address.id, { isDefault: false });
          }
        }
      }
      const newAddress = await storage.createAddress(addressData);
      res.status(201).json(newAddress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create address" });
    }
  });
  app2.put(
    "/api/users/addresses/:addressId",
    isAuthenticated,
    async (req, res) => {
      try {
        const addressId = parseInt(req.params.addressId);
        const userId = req.session.user.id;
        const address = await storage.getAddress(addressId);
        if (!address) {
          return res.status(404).json({ message: "Address not found" });
        }
        if (address.userId !== userId) {
          return res.status(403).json({ message: "Forbidden" });
        }
        if (req.body.isDefault) {
          const userAddresses = await storage.getAddressesByUserId(userId);
          for (const addr of userAddresses) {
            if (addr.isDefault && addr.id !== addressId) {
              await storage.updateAddress(addr.id, { isDefault: false });
            }
          }
        }
        const updatedAddress = await storage.updateAddress(addressId, req.body);
        res.json(updatedAddress);
      } catch (error) {
        res.status(500).json({ message: "Failed to update address" });
      }
    }
  );
  app2.delete(
    "/api/users/addresses/:addressId",
    isAuthenticated,
    async (req, res) => {
      try {
        const addressId = parseInt(req.params.addressId);
        const userId = req.session.user.id;
        const address = await storage.getAddress(addressId);
        if (!address) {
          return res.status(404).json({ message: "Address not found" });
        }
        if (address.userId !== userId) {
          return res.status(403).json({ message: "Forbidden" });
        }
        const success = await storage.deleteAddress(addressId);
        res.json({ success });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete address" });
      }
    }
  );
  app2.get("/api/categories", async (_req, res) => {
    try {
      const { data: categories2, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      res.json(categories2);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to retrieve categories" });
    }
  });
  app2.get("/api/products", async (_req, res) => {
    try {
      const { data: products2, error } = await supabase.from("products").select("*");
      if (error) throw error;
      res.json({ products: products2 });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to retrieve products" });
    }
  });
  app2.get("/api/products/:productId", async (req, res) => {
    try {
      const { data: product, error } = await supabase.from("products").select("*").eq("id", req.params.productId).single();
      if (error) throw error;
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to retrieve product" });
    }
  });
  app2.get("/api/banner", async (_req, res) => {
    try {
      const { data: banners2, error } = await supabase.from("banners").select("*").eq("is_active", true);
      if (error) throw error;
      res.json(banners2);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ message: "Failed to retrieve banners" });
    }
  });
  app2.get("/api/cart", async (req, res) => {
    try {
      let cart;
      const sessionId = req.session.id;
      if (req.session.user) {
        cart = await storage.getCartByUserId(req.session.user.id);
      }
      if (!cart) {
        cart = await storage.getCartBySessionId(sessionId);
      }
      if (!cart) {
        cart = await storage.createCart({
          userId: req.session.user?.id,
          sessionId
        });
      }
      const cartItems2 = await storage.getCartItems(cart.id);
      const itemsWithDetails = await Promise.all(
        cartItems2.map(async (item) => {
          const product = await storage.getProduct(Number(item.productId));
          return {
            ...item,
            product: product || { name: "Unknown Product" }
          };
        })
      );
      res.json({
        ...cart,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve cart" });
    }
  });
  app2.post("/api/cart", async (req, res) => {
    try {
      let cart;
      const sessionId = req.session.id;
      if (req.session.user) {
        cart = await storage.getCartByUserId(req.session.user.id);
      }
      if (!cart) {
        cart = await storage.getCartBySessionId(sessionId);
      }
      if (!cart) {
        cart = await storage.createCart({
          userId: req.session.user?.id,
          sessionId
        });
      }
      const { productId, quantity } = req.body;
      if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
      }
      const product = await storage.getProduct(Number(productId));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const cartItems2 = await storage.getCartItems(cart.id);
      const existingItem = cartItems2.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        await storage.updateCartItem(
          existingItem.id,
          existingItem.quantity + quantity
        );
      } else {
        await storage.createCartItem({
          cartId: cart.id,
          productId,
          quantity,
          price: product.price.toString()
        });
      }
      const updatedCart = await storage.getCart(cart.id);
      const updatedItems = await storage.getCartItems(cart.id);
      const itemsWithDetails = await Promise.all(
        updatedItems.map(async (item) => {
          const itemProduct = await storage.getProduct(Number(item.productId));
          return {
            ...item,
            product: itemProduct || { name: "Unknown Product" }
          };
        })
      );
      res.json({
        ...updatedCart,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart" });
    }
  });
  app2.delete("/api/cart/items/:itemId", async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const item = await storage.getCartItem(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      const cart = await storage.getCart(item.cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      if (req.session.user && cart.userId && cart.userId !== req.session.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (!req.session.user && cart.sessionId !== req.session.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      await storage.deleteCartItem(itemId);
      const updatedCart = await storage.getCart(cart.id);
      const updatedItems = await storage.getCartItems(cart.id);
      const itemsWithDetails = await Promise.all(
        updatedItems.map(async (i) => {
          const product = await storage.getProduct(Number(i.productId));
          return {
            ...i,
            product: product || { name: "Unknown Product" }
          };
        })
      );
      res.json({
        ...updatedCart,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });
  const server = createServer(app2);
  return server;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    console.error("Error:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 3e3;
  server.listen(
    {
      port,
      host: "0.0.0.0"
      // reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
