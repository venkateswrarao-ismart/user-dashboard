import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertAddressSchema,
  insertVendorProfileSchema,
  insertVendorBankAccountSchema,
  insertCartSchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";
import session from "express-session";
import crypto from "crypto";
import MemoryStore from "memorystore";

// Session store
const MemoryStoreSession = MemoryStore(session);

type AuthUser = {
  id: number;
  username: string;
  email: string;
  isVendor: boolean;
};

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

// Vendor authorization middleware
const isVendor = (req: Request, res: Response, next: Function) => {
  if (req.session && req.session.user && req.session.user.isVendor) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: Vendor access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(session({
    cookie: { maxAge: 86400000 }, // 24 hours
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "marketplace-secret"
  }));

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with this email already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      
      // Check if username is taken
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
      
      // Create the new user
      const newUser = await storage.createUser(userData);
      
      // Remove password before sending response
      const { password, ...userWithoutPassword } = newUser;
      
      // Set session
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

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password (in a real app, this would use proper password hashing)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password before sending response
      const { password: _, ...userWithoutPassword } = user;
      
      // Set session
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

  app.post("/api/auth/signout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Failed to sign out" });
      }
      res.json({ message: "Signed out successfully" });
    });
  });

  app.get("/api/auth/session", (req, res) => {
    if (req.session && req.session.user) {
      return res.json({ user: req.session.user });
    }
    res.json({ user: null });
  });

  app.post("/api/auth/otp-signin", (req, res) => {
    // In a real app, this would send an OTP to the user's phone
    // For now, just return a success message
    res.json({ message: "OTP sent successfully" });
  });

  // User routes
  app.get("/api/users/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Only allow users to access their own profile unless they're an admin
      if (req.session.user?.id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password before sending response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user" });
    }
  });

  app.delete("/api/users/:userId/delete", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Only allow users to delete their own account
      if (req.session.user?.id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Destroy session
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: "Error during session cleanup" });
        }
        res.json({ message: "User deleted successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.post("/api/users/fcm-tokens", isAuthenticated, (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      
      // Update user's FCM token
      const userId = req.session.user!.id;
      storage.updateUser(userId, { fcmToken: token });
      
      res.json({ message: "FCM token registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to register FCM token" });
    }
  });

  app.delete("/api/users/fcm-tokens", isAuthenticated, (req, res) => {
    try {
      // Remove user's FCM token
      const userId = req.session.user!.id;
      storage.updateUser(userId, { fcmToken: null });
      
      res.json({ message: "FCM token unregistered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unregister FCM token" });
    }
  });

  // Address routes
  app.get("/api/users/addresses", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const addresses = await storage.getAddressesByUserId(userId);
      
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve addresses" });
    }
  });

  app.post("/api/users/addresses", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const addressData = insertAddressSchema.parse({
        ...req.body,
        userId
      });
      
      // If this is set as default, unset any existing default
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

  app.put("/api/users/addresses/:addressId", isAuthenticated, async (req, res) => {
    try {
      const addressId = parseInt(req.params.addressId);
      const userId = req.session.user!.id;
      
      // Check if address exists and belongs to user
      const address = await storage.getAddress(addressId);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      
      if (address.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // If this is set as default, unset any existing default
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
  });

  app.delete("/api/users/addresses/:addressId", isAuthenticated, async (req, res) => {
    try {
      const addressId = parseInt(req.params.addressId);
      const userId = req.session.user!.id;
      
      // Check if address exists and belongs to user
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
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const response = await fetch('https://v0-next-js-and-supabase-app.vercel.app/api/categories');
      const categories = await response.json();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve categories" });
    }
  });

  app.get("/api/categories/:categoryId/products", async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const response = await fetch(`https://v0-next-js-and-supabase-app.vercel.app/api/categories/${categoryId}/products`);
      const products = await response.json();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve products" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const response = await fetch('https://v0-next-js-and-supabase-app.vercel.app/api/products');
      const products = await response.json();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve products" });
    }
  });
            "price": 2470,
            "stock": 0,
            "category": "Rice",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/624b6157-493b-45d4-907e-f6dc7f7556f4.png",
            "created_at": "2025-04-26T13:24:47.604886+00:00",
            "updated_at": "2025-04-28T14:15:17.305236+00:00",
            "category_id": "1a915b44-a7d7-472e-abae-90dd70ae3923",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-26T13:24:47.604886+00:00",
            "approved_at": null,
            "brand": "Sri Anmol",
            "hsn_code": "1006",
            "vendor_id": null,
            "sub_category_id": "6f3d55f5-b640-4aad-97e7-2e618ec7b3c1",
            "selling_price": 0,
            "gst_percentage": 5,
            "updated_by": "f6439f7a-4289-4310-9550-6b3ad1d901d8"
        }, {
            "id": "04e38c22-f18f-4b3d-af31-dfaab0a522d3",
            "name": "Sri Anmol Diamond plus Old Raw HMT Rice",
            "description": "Sri Anmol Diamond plus old Raw HMT Rice",
            "price": 2496,
            "stock": 0,
            "category": "Rice",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/4c2575dd-460d-4cb3-ba28-7607077611bc.png",
            "created_at": "2025-04-26T13:22:36.991971+00:00",
            "updated_at": "2025-04-28T12:18:43.536285+00:00",
            "category_id": "1a915b44-a7d7-472e-abae-90dd70ae3923",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-26T13:22:36.991971+00:00",
            "approved_at": null,
            "brand": "Sri Anmol",
            "hsn_code": "1006",
            "vendor_id": null,
            "sub_category_id": "6f3d55f5-b640-4aad-97e7-2e618ec7b3c1",
            "selling_price": 0,
            "gst_percentage": 5,
            "updated_by": "118de4f6-0322-4301-b521-7f46c50eb3cd"
        }, {
            "id": "c689d64c-23cb-41e7-9c69-535fe161f739",
            "name": "Sri Anmol Diamond STM HMT Rice",
            "description": "Sri Anmol Diamond ST HMT rice",
            "price": 2392,
            "stock": 0,
            "category": "Rice",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/83d1a016-8f61-441a-bca5-4268f62bda52.png",
            "created_at": "2025-04-26T13:20:40.394789+00:00",
            "updated_at": "2025-04-28T12:19:05.351377+00:00",
            "category_id": "1a915b44-a7d7-472e-abae-90dd70ae3923",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-26T13:20:40.394789+00:00",
            "approved_at": null,
            "brand": "Sri Anmol",
            "hsn_code": "1006",
            "vendor_id": null,
            "sub_category_id": "c1f7cd79-3ee1-439c-8a4e-bb6eeba140d2",
            "selling_price": 0,
            "gst_percentage": 5,
            "updated_by": "118de4f6-0322-4301-b521-7f46c50eb3cd"
        }, {
            "id": "6487df32-36c9-4097-beba-825f074deff7",
            "name": "Shalimar A1 Besan",
            "description": "",
            "price": 2350,
            "stock": 74,
            "category": "Flour",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/ec6dfd1d-2de8-444a-95f7-3060a65c71d3.png",
            "created_at": "2025-04-25T11:52:25.768948+00:00",
            "updated_at": "2025-04-25T11:52:25.975614+00:00",
            "category_id": "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-25T11:52:25.768948+00:00",
            "approved_at": null,
            "brand": "Shalimar A1 Besan",
            "hsn_code": "11061000",
            "vendor_id": null,
            "sub_category_id": "b6436c42-c240-44aa-a341-92a3757fb8a5",
            "selling_price": 1924.99,
            "gst_percentage": 0,
            "updated_by": "118de4f6-0322-4301-b521-7f46c50eb3cd"
        }, {
            "id": "b8ee396b-3580-4f3f-be96-8840de9006b0",
            "name": "Vijaya Groundnut Oil 1L",
            "description": "Experience purity and taste with Vijaya Groundnut Oil, a trusted name in kitchens across India. Extracted from premium quality groundnuts, this 1-litre pack is perfect for daily cooking needs, offering a healthy and flavorful choice for your meals.",
            "price": 3050,
            "stock": 50,
            "category": "Oils & Ghee",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/7c4b09c7-551c-4bcd-9b76-50792a5b4178.png",
            "created_at": "2025-04-22T10:20:22.274164+00:00",
            "updated_at": "2025-04-22T11:05:19.287662+00:00",
            "category_id": "604baf0b-b583-4ae7-9567-f7b53f924d89",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-22T10:20:22.274164+00:00",
            "approved_at": null,
            "brand": "Vijaya Groundnut Oil ",
            "hsn_code": "",
            "vendor_id": null,
            "sub_category_id": "c1cf9705-aaf9-45f7-90e9-ef066e45be37",
            "selling_price": 2319.99,
            "gst_percentage": 0,
            "updated_by": null
        }]
      };
      
      // Filter the products by the exact category_id match
      const filteredProducts = productsData.products.filter(p => 
        p.category_id === categoryId || 
        p.sub_category_id === categoryId
      );
      
      // If we found filtered products, return them
      if (filteredProducts.length > 0) {
        return res.json(filteredProducts);
      }
      
      // If no products match the category ID, return all products
      res.json(productsData.products);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve products" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const featured = req.query.featured === "true";
      
      // Using the sample data from attached file
      const productsData = {
        "products": [{
            "id": "395636ed-a460-45c8-b25e-83f8043359f2",
            "name": "Sri Anmol Kohenur STM JSR Rice",
            "description": "Sri Anmol kohernur ST JSR rice",
            "price": 2470,
            "stock": 0,
            "category": "Rice",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/624b6157-493b-45d4-907e-f6dc7f7556f4.png",
            "created_at": "2025-04-26T13:24:47.604886+00:00",
            "updated_at": "2025-04-28T14:15:17.305236+00:00",
            "category_id": "1a915b44-a7d7-472e-abae-90dd70ae3923",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-26T13:24:47.604886+00:00",
            "approved_at": null,
            "brand": "Sri Anmol",
            "hsn_code": "1006",
            "vendor_id": null,
            "sub_category_id": "6f3d55f5-b640-4aad-97e7-2e618ec7b3c1",
            "selling_price": 0,
            "gst_percentage": 5,
            "updated_by": "f6439f7a-4289-4310-9550-6b3ad1d901d8"
        }, {
            "id": "04e38c22-f18f-4b3d-af31-dfaab0a522d3",
            "name": "Sri Anmol Diamond plus Old Raw HMT Rice",
            "description": "Sri Anmol Diamond plus old Raw HMT Rice",
            "price": 2496,
            "stock": 0,
            "category": "Rice",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/4c2575dd-460d-4cb3-ba28-7607077611bc.png",
            "created_at": "2025-04-26T13:22:36.991971+00:00",
            "updated_at": "2025-04-28T12:18:43.536285+00:00",
            "category_id": "1a915b44-a7d7-472e-abae-90dd70ae3923",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-26T13:22:36.991971+00:00",
            "approved_at": null,
            "brand": "Sri Anmol",
            "hsn_code": "1006",
            "vendor_id": null,
            "sub_category_id": "6f3d55f5-b640-4aad-97e7-2e618ec7b3c1",
            "selling_price": 0,
            "gst_percentage": 5,
            "updated_by": "118de4f6-0322-4301-b521-7f46c50eb3cd"
        }, {
            "id": "c689d64c-23cb-41e7-9c69-535fe161f739",
            "name": "Sri Anmol Diamond STM HMT Rice",
            "description": "Sri Anmol Diamond ST HMT rice",
            "price": 2392,
            "stock": 0,
            "category": "Rice",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/83d1a016-8f61-441a-bca5-4268f62bda52.png",
            "created_at": "2025-04-26T13:20:40.394789+00:00",
            "updated_at": "2025-04-28T12:19:05.351377+00:00",
            "category_id": "1a915b44-a7d7-472e-abae-90dd70ae3923",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-26T13:20:40.394789+00:00",
            "approved_at": null,
            "brand": "Sri Anmol",
            "hsn_code": "1006",
            "vendor_id": null,
            "sub_category_id": "c1f7cd79-3ee1-439c-8a4e-bb6eeba140d2",
            "selling_price": 0,
            "gst_percentage": 5,
            "updated_by": "118de4f6-0322-4301-b521-7f46c50eb3cd"
        }, {
            "id": "6487df32-36c9-4097-beba-825f074deff7",
            "name": "Shalimar A1 Besan",
            "description": "",
            "price": 2350,
            "stock": 74,
            "category": "Flour",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/ec6dfd1d-2de8-444a-95f7-3060a65c71d3.png",
            "created_at": "2025-04-25T11:52:25.768948+00:00",
            "updated_at": "2025-04-25T11:52:25.975614+00:00",
            "category_id": "00bd9236-3aa2-48f0-9dfe-d9e54b655e2e",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-25T11:52:25.768948+00:00",
            "approved_at": null,
            "brand": "Shalimar A1 Besan",
            "hsn_code": "11061000",
            "vendor_id": null,
            "sub_category_id": "b6436c42-c240-44aa-a341-92a3757fb8a5",
            "selling_price": 1924.99,
            "gst_percentage": 0,
            "updated_by": "118de4f6-0322-4301-b521-7f46c50eb3cd"
        }, {
            "id": "b8ee396b-3580-4f3f-be96-8840de9006b0",
            "name": "Vijaya Groundnut Oil 1L",
            "description": "Experience purity and taste with Vijaya Groundnut Oil, a trusted name in kitchens across India. Extracted from premium quality groundnuts, this 1-litre pack is perfect for daily cooking needs, offering a healthy and flavorful choice for your meals.",
            "price": 3050,
            "stock": 50,
            "category": "Oils & Ghee",
            "image_url": "https://sqpgtmpbfmtaivbfsjuy.supabase.co/storage/v1/object/public/productsimages/7c4b09c7-551c-4bcd-9b76-50792a5b4178.png",
            "created_at": "2025-04-22T10:20:22.274164+00:00",
            "updated_at": "2025-04-22T11:05:19.287662+00:00",
            "category_id": "604baf0b-b583-4ae7-9567-f7b53f924d89",
            "approval_status": "approved",
            "rejection_reason": null,
            "submitted_at": "2025-04-22T10:20:22.274164+00:00",
            "approved_at": null,
            "brand": "Vijaya Groundnut Oil ",
            "hsn_code": "",
            "vendor_id": null,
            "sub_category_id": "c1cf9705-aaf9-45f7-90e9-ef066e45be37",
            "selling_price": 2319.99,
            "gst_percentage": 0,
            "updated_by": null
        }]
      };
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve products" });
    }
  });

  // Banner routes
  app.get("/api/banner", async (req, res) => {
    try {
      const banners = await storage.getActiveBanners();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve banners" });
    }
  });
  
  // Vendor routes
  app.get("/api/vendors", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const vendors = await storage.getAllVendorProfiles(limit, offset);
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve vendors" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      let cart;
      const sessionId = req.session.id;
      
      if (req.session.user) {
        // Try to find cart by user ID
        cart = await storage.getCartByUserId(req.session.user.id);
      }
      
      if (!cart) {
        // Try to find cart by session ID
        cart = await storage.getCartBySessionId(sessionId);
      }
      
      if (!cart) {
        // Create a new cart
        cart = await storage.createCart({
          userId: req.session.user?.id,
          sessionId
        });
      }
      
      // Get cart items
      const cartItems = await storage.getCartItems(cart.id);
      
      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
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

  app.post("/api/cart", async (req, res) => {
    try {
      let cart;
      const sessionId = req.session.id;
      
      if (req.session.user) {
        // Try to find cart by user ID
        cart = await storage.getCartByUserId(req.session.user.id);
      }
      
      if (!cart) {
        // Try to find cart by session ID
        cart = await storage.getCartBySessionId(sessionId);
        
        // If cart exists but user is now logged in, update the user ID
        if (cart && req.session.user) {
          cart = await storage.updateCart(cart.id, { userId: req.session.user.id });
        }
      }
      
      if (!cart) {
        // Create a new cart
        cart = await storage.createCart({
          userId: req.session.user?.id,
          sessionId
        });
      }
      
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
      }
      
      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if item already exists in cart
      const cartItems = await storage.getCartItems(cart.id);
      const existingItem = cartItems.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update quantity
        await storage.updateCartItem(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Add new item
        await storage.createCartItem({
          cartId: cart.id,
          productId,
          quantity,
          price: Number(product.price)
        });
      }
      
      // Get updated cart with items
      const updatedCart = await storage.getCart(cart.id);
      const updatedItems = await storage.getCartItems(cart.id);
      
      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        updatedItems.map(async (item) => {
          const itemProduct = await storage.getProduct(item.productId);
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

  app.delete("/api/cart/items/:itemId", async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      
      // Get the item to check cart ownership
      const item = await storage.getCartItem(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      // Get the cart to check ownership
      const cart = await storage.getCart(item.cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      // Check if user owns this cart
      if (req.session.user && cart.userId && cart.userId !== req.session.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Check if session owns this cart
      if (!req.session.user && cart.sessionId !== req.session.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Delete the item
      await storage.deleteCartItem(itemId);
      
      // Get updated cart
      const updatedCart = await storage.getCart(cart.id);
      const updatedItems = await storage.getCartItems(cart.id);
      
      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        updatedItems.map(async (i) => {
          const product = await storage.getProduct(i.productId);
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

  // Order routes
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      
      // Check if user is a vendor
      if (req.session.user!.isVendor) {
        const vendorProfile = await storage.getVendorProfileByUserId(userId);
        if (vendorProfile) {
          const vendorOrders = await storage.getOrdersByVendorId(vendorProfile.id);
          return res.json(vendorOrders);
        }
      }
      
      // Regular user orders
      const orders = await storage.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve orders" });
    }
  });

  app.get("/api/orders/:orderId", isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const userId = req.session.user!.id;
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if user owns this order or is a vendor for this order
      if (order.userId !== userId) {
        // Check if user is a vendor for this order
        if (req.session.user!.isVendor) {
          const vendorProfile = await storage.getVendorProfileByUserId(userId);
          if (vendorProfile) {
            const orderItems = await storage.getOrderItems(orderId);
            const hasVendorItems = orderItems.some(item => item.vendorId === vendorProfile.id);
            
            if (!hasVendorItems) {
              return res.status(403).json({ message: "Forbidden" });
            }
          } else {
            return res.status(403).json({ message: "Forbidden" });
          }
        } else {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
      
      // Get order items with product details
      const orderItems = await storage.getOrderItems(orderId);
      const itemsWithDetails = await Promise.all(
        orderItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          const vendor = product ? await storage.getVendorProfile(product.vendorId) : null;
          
          return {
            ...item,
            product: product || { name: "Unknown Product" },
            vendor: vendor || { businessName: "Unknown Vendor" }
          };
        })
      );
      
      // Get shipping address
      const shippingAddress = await storage.getAddress(order.shippingAddressId);
      
      res.json({
        ...order,
        items: itemsWithDetails,
        shippingAddress
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve order" });
    }
  });

  app.get("/api/users/:userId/orders", isAuthenticated, async (req, res) => {
    try {
      const requestedUserId = parseInt(req.params.userId);
      const userId = req.session.user!.id;
      
      // Only allow users to see their own orders
      if (requestedUserId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const orders = await storage.getOrdersByUserId(requestedUserId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve orders" });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      
      const { shippingAddressId, paymentMethod } = req.body;
      
      if (!shippingAddressId || !paymentMethod) {
        return res.status(400).json({ message: "Shipping address and payment method are required" });
      }
      
      // Get user's cart
      const cart = await storage.getCartByUserId(userId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      // Get cart items
      const cartItems = await storage.getCartItems(cart.id);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Create order
      const order = await storage.createOrder({
        userId,
        orderNumber: `ORD-${Date.now()}`,
        status: "pending",
        total: Number(cart.total),
        shippingAddressId,
        paymentMethod,
        paymentStatus: paymentMethod === "cash-on-delivery" ? "pending" : "paid"
      });
      
      // Create order items
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        if (!product) continue;
        
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.price),
          total: Number(item.price) * item.quantity,
          vendorId: product.vendorId
        });
        
        // Update product stock
        await storage.updateProduct(product.id, {
          stock: product.stock - item.quantity
        });
      }
      
      // Clear cart
      await storage.clearCartItems(cart.id);
      await storage.deleteCart(cart.id);
      
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Payment method routes
  app.get("/api/payment-methods/cash-on-delivery", (req, res) => {
    res.json({
      id: "cash-on-delivery",
      name: "Cash on Delivery",
      description: "Pay when you receive your order",
      enabled: true
    });
  });

  // Vendor routes
  app.post("/api/shop-owner-registrations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      
      // Check if user is already a vendor
      if (req.session.user!.isVendor) {
        return res.status(409).json({ message: "User is already a vendor" });
      }
      
      // Check if vendor profile already exists
      const existingProfile = await storage.getVendorProfileByUserId(userId);
      if (existingProfile) {
        return res.status(409).json({ message: "Vendor profile already exists" });
      }
      
      // Update user to be a vendor
      await storage.updateUser(userId, { isVendor: true });
      
      // Create vendor profile
      const vendorProfile = await storage.createVendorProfile({
        ...req.body,
        userId,
        status: "pending" // Requires approval in a real system
      });
      
      // Update session
      req.session.user = {
        ...req.session.user!,
        isVendor: true
      };
      
      res.status(201).json(vendorProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register as vendor" });
    }
  });

  app.post("/api/owner-bank-accounts", isAuthenticated, isVendor, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      
      // Get vendor profile
      const vendorProfile = await storage.getVendorProfileByUserId(userId);
      if (!vendorProfile) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }
      
      // Check if bank account already exists
      const existingAccount = await storage.getVendorBankAccount(vendorProfile.id);
      if (existingAccount) {
        return res.status(409).json({ message: "Bank account already exists" });
      }
      
      // Create bank account
      const bankAccount = await storage.createVendorBankAccount({
        ...req.body,
        vendorId: vendorProfile.id
      });
      
      res.status(201).json(bankAccount);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create bank account" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
