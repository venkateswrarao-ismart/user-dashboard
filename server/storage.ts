import {
  User, InsertUser, Address, InsertAddress, Category, InsertCategory, 
  Product, InsertProduct, Banner, InsertBanner, VendorProfile, InsertVendorProfile,
  VendorBankAccount, InsertVendorBankAccount, Order, InsertOrder, OrderItem, 
  InsertOrderItem, Cart, InsertCart, CartItem, InsertCartItem
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Address operations
  getAddress(id: number): Promise<Address | undefined>;
  getAddressesByUserId(userId: number): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, addressData: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;
  
  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number, limit?: number, offset?: number): Promise<Product[]>;
  getAllProducts(limit?: number, offset?: number): Promise<Product[]>;
  getProductsByVendor(vendorId: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Banner operations
  getAllBanners(): Promise<Banner[]>;
  getActiveBanners(): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  
  // Vendor operations
  getVendorProfile(id: number): Promise<VendorProfile | undefined>;
  getVendorProfileByUserId(userId: number): Promise<VendorProfile | undefined>;
  getAllVendorProfiles(limit?: number, offset?: number): Promise<VendorProfile[]>;
  getFeaturedVendors(limit?: number): Promise<VendorProfile[]>;
  createVendorProfile(vendorProfile: InsertVendorProfile): Promise<VendorProfile>;
  updateVendorProfile(id: number, vendorData: Partial<InsertVendorProfile>): Promise<VendorProfile | undefined>;
  
  // Vendor bank account operations
  getVendorBankAccount(vendorId: number): Promise<VendorBankAccount | undefined>;
  createVendorBankAccount(bankAccount: InsertVendorBankAccount): Promise<VendorBankAccount>;
  updateVendorBankAccount(vendorId: number, bankData: Partial<InsertVendorBankAccount>): Promise<VendorBankAccount | undefined>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOrdersByVendorId(vendorId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Cart operations
  getCart(id: number): Promise<Cart | undefined>;
  getCartByUserId(userId: number): Promise<Cart | undefined>;
  getCartBySessionId(sessionId: string): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  updateCartTotal(id: number, total: number): Promise<Cart | undefined>;
  deleteCart(id: number): Promise<boolean>;
  
  // Cart item operations
  getCartItem(id: number): Promise<CartItem | undefined>;
  getCartItems(cartId: number): Promise<CartItem[]>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  clearCartItems(cartId: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private addresses: Map<number, Address>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private banners: Map<number, Banner>;
  private vendorProfiles: Map<number, VendorProfile>;
  private vendorBankAccounts: Map<number, VendorBankAccount>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  
  private userId: number;
  private addressId: number;
  private categoryId: number;
  private productId: number;
  private bannerId: number;
  private vendorProfileId: number;
  private vendorBankAccountId: number;
  private orderId: number;
  private orderItemId: number;
  private cartId: number;
  private cartItemId: number;
  
  constructor() {
    this.users = new Map();
    this.addresses = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.banners = new Map();
    this.vendorProfiles = new Map();
    this.vendorBankAccounts = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    
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
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Create categories based on the provided data
    const mainCategories = [
      {
        id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        name: "Flour",
        description: "",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/cqvqgxswc9v_1744960850887.jpg",
        parent_id: null,
        is_active: true,
        created_at: new Date("2025-04-12T06:06:00.934002+00:00"),
        updated_at: new Date("2025-04-18T07:20:59.454884+00:00"),
        slug: "flour"
      },
      {
        id: "9f9c1f99-7a54-4cb7-8dcc-03be8ab89599",
        name: "Ground Nuts",
        description: "Ground Nuts",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/ls3qqenmds_1744960880045.jpg",
        parent_id: null,
        is_active: true,
        created_at: new Date("2025-04-12T06:14:50.168145+00:00"),
        updated_at: new Date("2025-04-18T07:21:23.877096+00:00"),
        slug: "ground-nuts"
      },
      {
        id: "604baf0b-b583-4ae7-9567-f7b53f924d89",
        name: "Oils & Ghee",
        description: "Oil's & Ghee",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/pnjm0s54ia_1744002316449.jpg",
        parent_id: null,
        is_active: true,
        created_at: new Date("2025-04-05T12:11:29.440093+00:00"),
        updated_at: new Date("2025-04-29T10:49:14.641566+00:00"),
        slug: "oils-ghee"
      },
      {
        id: "86613b89-fdad-4231-a444-308afb945283",
        name: "Pulses",
        description: "They provide a significant amount of dietary fiber, promoting digestive health and helping regulate blood sugar.",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/7191a19v20s_1744003097018.jpeg",
        parent_id: null,
        is_active: true,
        created_at: new Date("2025-04-05T12:31:25.655456+00:00"),
        updated_at: new Date("2025-04-07T05:18:21.196938+00:00"),
        slug: "pulses"
      },
      {
        id: "1a915b44-a7d7-472e-abae-90dd70ae3923",
        name: "Rice",
        description: "Each type of rice offers unique flavors, textures, and cooking properties, allowing you to choose the perfect variety for your dishes!",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/18626gx2z3y_1744003292166.jpeg",
        parent_id: null,
        is_active: true,
        created_at: new Date("2025-04-05T12:15:10.696512+00:00"),
        updated_at: new Date("2025-04-07T05:21:40.292472+00:00"),
        slug: "rice"
      },
      {
        id: "ed18ccf0-16f5-4932-baa0-0bcc4a9d9788",
        name: "Sugar & Salt",
        description: "Sugar",
        image_url: "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/categories/0e5f0np7k54a_1743946008909.webp",
        parent_id: null,
        is_active: true,
        created_at: new Date("2025-04-05T14:20:45.939243+00:00"),
        updated_at: new Date("2025-04-25T13:29:37.999022+00:00"),
        slug: "sugar-salt"
      }
    ];
    
    // Create subcategories for Flour
    const flourSubcategories = [
      {
        id: "6f2571ab-3b72-4734-8896-d485ab86d6ae",
        name: "wheat",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        description: null,
        slug: "wheat"
      },
      {
        id: "e50ffff9-a614-45ac-8168-cc981677416e",
        name: "Atta",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        description: null,
        slug: "atta"
      },
      {
        id: "2b82050e-2094-4d76-adf9-27e2bcdb5472",
        name: "Maida",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        description: null,
        slug: "maida"
      },
      {
        id: "b6436c42-c240-44aa-a341-92a3757fb8a5",
        name: "Besan",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        description: null,
        slug: "besan"
      },
      {
        id: "6011cd90-6606-4c99-9902-25ac65cb8258",
        name: "Idly Rava",
        image_url: null,
        parent_id: "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        description: null,
        slug: "idly-rava"
      }
    ];
    
    // Add all categories to storage
    [...mainCategories, ...flourSubcategories].forEach(category => {
      this.categories.set(category.id, category);
    });
    
    // Create sample banners
    const banners = [
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
    
    banners.forEach(banner => {
      this.createBanner(banner);
    });
    
    // Create sample users (including vendors)
    const users = [
      { username: "user1", email: "user1@example.com", password: "password123", firstName: "John", lastName: "Doe", isVendor: false },
      { username: "vendor1", email: "vendor1@example.com", password: "password123", firstName: "Alice", lastName: "Smith", isVendor: true },
      { username: "vendor2", email: "vendor2@example.com", password: "password123", firstName: "Bob", lastName: "Johnson", isVendor: true },
      { username: "vendor3", email: "vendor3@example.com", password: "password123", firstName: "Carol", lastName: "Williams", isVendor: true },
      { username: "vendor4", email: "vendor4@example.com", password: "password123", firstName: "David", lastName: "Brown", isVendor: true }
    ];
    
    users.forEach(user => {
      this.createUser(user);
    });
    
    // Create vendor profiles
    const vendorProfiles = [
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
    
    vendorProfiles.forEach((profile, index) => {
      const created = this.createVendorProfile(profile);
      // Set some fake ratings
      const ratings = [4.8, 4.7, 4.9, 4.6];
      const reviews = [243, 187, 156, 215];
      
      this.vendorProfiles.set(created.id, {
        ...created,
        averageRating: ratings[index],
        totalReviews: reviews[index]
      });
    });
    
    // Create sample products
    const products = [
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
    
    products.forEach(product => {
      this.createProduct(product);
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  
  // Address methods
  async getAddress(id: number): Promise<Address | undefined> {
    return this.addresses.get(id);
  }
  
  async getAddressesByUserId(userId: number): Promise<Address[]> {
    return Array.from(this.addresses.values()).filter(address => address.userId === userId);
  }
  
  async createAddress(address: InsertAddress): Promise<Address> {
    const id = this.addressId++;
    const newAddress: Address = { ...address, id };
    this.addresses.set(id, newAddress);
    return newAddress;
  }
  
  async updateAddress(id: number, addressData: Partial<InsertAddress>): Promise<Address | undefined> {
    const address = this.addresses.get(id);
    if (!address) return undefined;
    
    const updatedAddress = { ...address, ...addressData };
    this.addresses.set(id, updatedAddress);
    return updatedAddress;
  }
  
  async deleteAddress(id: number): Promise<boolean> {
    return this.addresses.delete(id);
  }
  
  // Category methods
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }
  
  async getAllCategories(): Promise<Category[]> {
    const mainCategories = Array.from(this.categories.values()).filter(cat => !cat.parent_id);
    
    // Format to match the expected structure with subcategories
    return mainCategories.map(cat => {
      const subCats = Array.from(this.categories.values())
        .filter(subCat => subCat.parent_id === cat.id)
        .map(subCat => ({
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
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.slug === slug);
  }
  
  async getProductsByCategory(categoryId: number, limit?: number, offset: number = 0): Promise<Product[]> {
    const allProducts = Array.from(this.products.values())
      .filter(product => product.categoryId === categoryId);
    
    if (limit) {
      return allProducts.slice(offset, offset + limit);
    }
    return allProducts;
  }
  
  async getAllProducts(limit?: number, offset: number = 0): Promise<Product[]> {
    const allProducts = Array.from(this.products.values());
    
    if (limit) {
      return allProducts.slice(offset, offset + limit);
    }
    return allProducts;
  }
  
  async getProductsByVendor(vendorId: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.vendorId === vendorId);
  }
  
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const featuredProducts = Array.from(this.products.values())
      .filter(product => product.featured);
    
    if (limit) {
      return featuredProducts.slice(0, limit);
    }
    return featuredProducts;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Banner methods
  async getAllBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values());
  }
  
  async getActiveBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values())
      .filter(banner => banner.active)
      .sort((a, b) => a.order - b.order);
  }
  
  async createBanner(banner: InsertBanner): Promise<Banner> {
    const id = this.bannerId++;
    const newBanner: Banner = { ...banner, id };
    this.banners.set(id, newBanner);
    return newBanner;
  }
  
  // Vendor profile methods
  async getVendorProfile(id: number): Promise<VendorProfile | undefined> {
    return this.vendorProfiles.get(id);
  }
  
  async getVendorProfileByUserId(userId: number): Promise<VendorProfile | undefined> {
    return Array.from(this.vendorProfiles.values())
      .find(profile => profile.userId === userId);
  }
  
  async getAllVendorProfiles(limit?: number, offset: number = 0): Promise<VendorProfile[]> {
    const allProfiles = Array.from(this.vendorProfiles.values())
      .filter(profile => profile.status === "approved");
    
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
  
  async createVendorProfile(vendorProfile: InsertVendorProfile): Promise<VendorProfile> {
    const id = this.vendorProfileId++;
    const newProfile: VendorProfile = { 
      ...vendorProfile, 
      id, 
      averageRating: 0, 
      totalReviews: 0 
    };
    this.vendorProfiles.set(id, newProfile);
    return newProfile;
  }
  
  async updateVendorProfile(id: number, vendorData: Partial<InsertVendorProfile>): Promise<VendorProfile | undefined> {
    const profile = this.vendorProfiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...vendorData };
    this.vendorProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  // Vendor bank account methods
  async getVendorBankAccount(vendorId: number): Promise<VendorBankAccount | undefined> {
    return Array.from(this.vendorBankAccounts.values())
      .find(account => account.vendorId === vendorId);
  }
  
  async createVendorBankAccount(bankAccount: InsertVendorBankAccount): Promise<VendorBankAccount> {
    const id = this.vendorBankAccountId++;
    const newAccount: VendorBankAccount = { ...bankAccount, id };
    this.vendorBankAccounts.set(id, newAccount);
    return newAccount;
  }
  
  async updateVendorBankAccount(vendorId: number, bankData: Partial<InsertVendorBankAccount>): Promise<VendorBankAccount | undefined> {
    const account = Array.from(this.vendorBankAccounts.values())
      .find(acc => acc.vendorId === vendorId);
    
    if (!account) return undefined;
    
    const updatedAccount = { ...account, ...bankData };
    this.vendorBankAccounts.set(account.id, updatedAccount);
    return updatedAccount;
  }
  
  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values())
      .find(order => order.orderNumber === orderNumber);
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getOrdersByVendorId(vendorId: number): Promise<Order[]> {
    // First get all order items for this vendor
    const vendorOrderItems = Array.from(this.orderItems.values())
      .filter(item => item.vendorId === vendorId);
    
    // Then get unique order IDs
    const orderIds = [...new Set(vendorOrderItems.map(item => item.orderId))];
    
    // Finally get the orders
    return orderIds.map(id => this.orders.get(id))
      .filter((order): order is Order => order !== undefined)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const orderNumber = `ORD-${Date.now()}-${id}`;
    const createdAt = new Date().toISOString();
    
    const newOrder: Order = {
      ...order,
      id,
      orderNumber,
      createdAt
    };
    
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const newItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }
  
  // Cart methods
  async getCart(id: number): Promise<Cart | undefined> {
    return this.carts.get(id);
  }
  
  async getCartByUserId(userId: number): Promise<Cart | undefined> {
    return Array.from(this.carts.values())
      .find(cart => cart.userId === userId);
  }
  
  async getCartBySessionId(sessionId: string): Promise<Cart | undefined> {
    return Array.from(this.carts.values())
      .find(cart => cart.sessionId === sessionId);
  }
  
  async createCart(cart: InsertCart): Promise<Cart> {
    const id = this.cartId++;
    const now = new Date().toISOString();
    
    const newCart: Cart = {
      ...cart,
      id,
      total: 0,
      createdAt: now,
      updatedAt: now
    };
    
    this.carts.set(id, newCart);
    return newCart;
  }
  
  async updateCartTotal(id: number, total: number): Promise<Cart | undefined> {
    const cart = this.carts.get(id);
    if (!cart) return undefined;
    
    const updatedCart = {
      ...cart,
      total,
      updatedAt: new Date().toISOString()
    };
    
    this.carts.set(id, updatedCart);
    return updatedCart;
  }
  
  async deleteCart(id: number): Promise<boolean> {
    // First delete all cart items
    await this.clearCartItems(id);
    
    // Then delete the cart
    return this.carts.delete(id);
  }
  
  // Cart item methods
  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }
  
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values())
      .filter(item => item.cartId === cartId);
  }
  
  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemId++;
    const newItem: CartItem = { ...cartItem, id };
    this.cartItems.set(id, newItem);
    
    // Update the cart total
    await this.updateCartTotalAfterItemChange(cartItem.cartId);
    
    return newItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    
    // Update the cart total
    await this.updateCartTotalAfterItemChange(item.cartId);
    
    return updatedItem;
  }
  
  async deleteCartItem(id: number): Promise<boolean> {
    const item = this.cartItems.get(id);
    if (!item) return false;
    
    const cartId = item.cartId;
    const result = this.cartItems.delete(id);
    
    // Update the cart total
    await this.updateCartTotalAfterItemChange(cartId);
    
    return result;
  }
  
  async clearCartItems(cartId: number): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.values())
      .filter(item => item.cartId === cartId);
    
    itemsToDelete.forEach(item => {
      this.cartItems.delete(item.id);
    });
    
    // Update the cart total
    const cart = this.carts.get(cartId);
    if (cart) {
      this.updateCartTotal(cartId, 0);
    }
    
    return true;
  }
  
  // Helper methods
  private async updateCartTotalAfterItemChange(cartId: number): Promise<void> {
    const cartItems = await this.getCartItems(cartId);
    const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    await this.updateCartTotal(cartId, total);
  }
}

export const storage = new MemStorage();
