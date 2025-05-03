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
  insertOrderItemSchema,
} from "@shared/schema";
import session from "express-session";
import crypto from "crypto";
import MemoryStore from "memorystore";
import { supabase } from "../client/src/lib/supabase";

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
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "marketplace-secret",
    }),
  );

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
      const existingUsername = await storage.getUserByUsername(
        userData.username,
      );
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
        isVendor: newUser.isVendor,
      };

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
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
        isVendor: user.isVendor,
      };

      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to sign in" });
    }
  });

  app.post("/api/auth/signout", (req, res) => {
    req.session.destroy((err) => {
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
      req.session.destroy((err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error during session cleanup" });
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
        userId,
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
        return res
          .status(400)
          .json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create address" });
    }
  });

  app.put(
    "/api/users/addresses/:addressId",
    isAuthenticated,
    async (req, res) => {
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
    },
  );

  app.delete(
    "/api/users/addresses/:addressId",
    isAuthenticated,
    async (req, res) => {
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
    },
  );

  // Category routes  (Replaced with Supabase)
  app.get("/api/categories", async (_req, res) => {
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to retrieve categories" });
    }
  });

  // Product routes (Replaced with Supabase)
  app.get("/api/products", async (_req, res) => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      res.json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to retrieve products" });
    }
  });

  // Single product route (Replaced with Supabase)
  app.get("/api/products/:productId", async (req, res) => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', req.params.productId)
        .single();

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

  // Banners route (Replaced with Supabase)
  app.get("/api/banner", async (_req, res) => {
    try {
      const { data: banners, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ message: "Failed to retrieve banners" });
    }
  });


  // Cart routes (Retained from original code)
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
          sessionId,
        });
      }

      // Get cart items
      const cartItems = await storage.getCartItems(cart.id);

      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(Number(item.productId));
          return {
            ...item,
            product: product || { name: "Unknown Product" },
          };
        }),
      );

      res.json({
        ...cart,
        items: itemsWithDetails,
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
      }

      if (!cart) {
        // Create a new cart
        cart = await storage.createCart({
          userId: req.session.user?.id,
          sessionId,
        });
      }

      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res
          .status(400)
          .json({ message: "Product ID and quantity are required" });
      }

      // Check if product exists
      const product = await storage.getProduct(Number(productId));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if item already exists in cart
      const cartItems = await storage.getCartItems(cart.id);
      const existingItem = cartItems.find(
        (item) => item.productId === productId,
      );

      if (existingItem) {
        // Update quantity
        await storage.updateCartItem(
          existingItem.id,
          existingItem.quantity + quantity,
        );
      } else {
        // Add new item
        await storage.createCartItem({
          cartId: cart.id,
          productId,
          quantity,
          price: product.price.toString(),
        });
      }

      // Get updated cart with items
      const updatedCart = await storage.getCart(cart.id);
      const updatedItems = await storage.getCartItems(cart.id);

      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        updatedItems.map(async (item) => {
          const itemProduct = await storage.getProduct(Number(item.productId));
          return {
            ...item,
            product: itemProduct || { name: "Unknown Product" },
          };
        }),
      );

      res.json({
        ...updatedCart,
        items: itemsWithDetails,
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
      if (
        req.session.user &&
        cart.userId &&
        cart.userId !== req.session.user.id
      ) {
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
          const product = await storage.getProduct(Number(i.productId));
          return {
            ...i,
            product: product || { name: "Unknown Product" },
          };
        }),
      );

      res.json({
        ...updatedCart,
        items: itemsWithDetails,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  const server = createServer(app);
  return server;
}