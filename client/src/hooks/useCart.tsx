// // import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// // import { useToast } from "@/hooks/use-toast";
// // import { apiRequest } from "@/lib/queryClient";
// // import { useAuth } from "@/hooks/useAuth";

// // type CartItem = {
// //   id: number;
// //   productId: string;
// //   quantity: number;
// //   price: number;
// //   product: {
// //     id: string;
// //     name: string;
// //     image_url: string;
// //     price: number;
// //     selling_price: number;
// //     brand: string;
// //     category: string;
// //   };
// // };

// // type Cart = {
// //   id: number;
// //   userId: number | null;
// //   sessionId: string | null;
// //   total: number;
// //   items: CartItem[];
// // };

// // interface CartContextType {
// //   cart: Cart | null;
// //   isLoading: boolean;
// //   error: Error | null;
// //   addItem: (productId: string, quantity: number) => Promise<void>;
// //   removeItem: (itemId: number) => Promise<void>;
// //   updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
// //   clearCart: () => Promise<void>;
// //   refreshCart: () => Promise<void>;
// // }

// // type CartProviderProps = {
// //   children: ReactNode;
// // };

// // const CartContext = createContext<CartContextType | undefined>(undefined);

// // export function CartProvider({ children }: CartProviderProps) {
// //   const [cart, setCart] = useState<Cart | null>(null);
// //   const [isLoading, setIsLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<Error | null>(null);
// //   const { toast } = useToast();
// //   const { isAuthenticated } = useAuth();

// //   const fetchCart = async (): Promise<Cart | null> => {
// //     try {
// //       const res = await fetch("/api/cart", {
// //         credentials: "include",
// //       });
      
// //       if (!res.ok) {
// //         throw new Error("Failed to fetch cart");
// //       }
      
// //       return await res.json();
// //     } catch (error) {
// //       console.error("Error fetching cart:", error);
// //       setError(error instanceof Error ? error : new Error(String(error)));
// //       return null;
// //     }
// //   };

// //   const refreshCart = async (): Promise<void> => {
// //     setIsLoading(true);
// //     try {
// //       const cartData = await fetchCart();
// //       setCart(cartData);
// //     } catch (error) {
// //       console.error("Error refreshing cart:", error);
// //       setError(error instanceof Error ? error : new Error(String(error)));
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Fetch cart on initial load and when auth state changes
// //   useEffect(() => {
// //     refreshCart();
// //   }, [isAuthenticated]);

// //   const addItem = async (productId: string, quantity: number): Promise<void> => {
// //     try {
// //       const res = await apiRequest("POST", "/api/cart", { productId, quantity });
// //       const updatedCart = await res.json();
// //       setCart(updatedCart);
// //       toast({
// //         title: "Item added to cart",
// //         description: "The item was successfully added to your cart.",
// //       });
// //     } catch (error) {
// //       console.error("Error adding item to cart:", error);
// //       toast({
// //         title: "Failed to add item",
// //         description: "There was an error adding the item to your cart. Please try again.",
// //         variant: "destructive",
// //       });
// //       throw error;
// //     }
// //   };

// //   const removeItem = async (itemId: number): Promise<void> => {
// //     try {
// //       const res = await apiRequest("DELETE", `/api/cart/items/${itemId}`, undefined);
// //       const updatedCart = await res.json();
// //       setCart(updatedCart);
// //       toast({
// //         title: "Item removed",
// //         description: "The item was removed from your cart.",
// //       });
// //     } catch (error) {
// //       console.error("Error removing item from cart:", error);
// //       toast({
// //         title: "Failed to remove item",
// //         description: "There was an error removing the item from your cart. Please try again.",
// //         variant: "destructive",
// //       });
// //       throw error;
// //     }
// //   };

// //   const updateItemQuantity = async (itemId: number, quantity: number): Promise<void> => {
// //     // In our API, this is handled by removing and re-adding the item
// //     try {
// //       // First get the product ID for this item
// //       const item = cart?.items.find(item => item.id === itemId);
// //       if (!item) throw new Error("Item not found in cart");
      
// //       // Remove the item
// //       await removeItem(itemId);
      
// //       // Add it back with the new quantity
// //       await addItem(item.productId, quantity);
      
// //       toast({
// //         title: "Quantity updated",
// //         description: "The item quantity was updated in your cart.",
// //       });
// //     } catch (error) {
// //       console.error("Error updating item quantity:", error);
// //       toast({
// //         title: "Failed to update quantity",
// //         description: "There was an error updating the item quantity. Please try again.",
// //         variant: "destructive",
// //       });
// //       throw error;
// //     }
// //   };

// //   const clearCart = async (): Promise<void> => {
// //     // Clear cart by removing all items one by one
// //     try {
// //       if (!cart) return;
      
// //       for (const item of cart.items) {
// //         await removeItem(item.id);
// //       }
      
// //       // Refresh cart after clearing
// //       await refreshCart();
      
// //       toast({
// //         title: "Cart cleared",
// //         description: "All items have been removed from your cart.",
// //       });
// //     } catch (error) {
// //       console.error("Error clearing cart:", error);
// //       toast({
// //         title: "Failed to clear cart",
// //         description: "There was an error clearing your cart. Please try again.",
// //         variant: "destructive",
// //       });
// //       throw error;
// //     }
// //   };

// //   return (
// //     <CartContext.Provider
// //       value={{
// //         cart,
// //         isLoading,
// //         error,
// //         addItem,
// //         removeItem,
// //         updateItemQuantity,
// //         clearCart,
// //         refreshCart,
// //       }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // }

// // export function useCart(): CartContextType {
// //   const context = useContext(CartContext);
// //   if (context === undefined) {
// //     throw new Error("useCart must be used within a CartProvider");
// //   }
// //   return context;
// // }
// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/lib/supabase";

// type CartItem = {
//   id: string;
//   product_id: string;
//   quantity: number;
//   created_at: string;
//   products: {
//     name: string;
//     image_url: string;
//     selling_price: number;
//     brand: string;
//     category_id: string;
//     stock: number;
//   };
// };

// type Cart = {
//   items: CartItem[];
//   total: number;
// };

// interface CartContextType {
//   cart: Cart | null;
//   isLoading: boolean;
//   error: Error | null;
//   addItem: (productId: string, quantity: number) => Promise<void>;
//   removeItem: (itemId: string) => Promise<void>;
//   updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
//   clearCart: () => Promise<void>;
//   refreshCart: () => Promise<void>;
// }

// type CartProviderProps = {
//   children: ReactNode;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: CartProviderProps) {
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error | null>(null);
//   const { toast } = useToast();
//   const { user } = useAuth();

//   const getSessionId = () => {
//     if (typeof window === "undefined") return null;
//     let sessionId = localStorage.getItem("cart_session");
//     if (!sessionId) {
//       sessionId = crypto.randomUUID();
//       localStorage.setItem("cart_session", sessionId);
//     }
//     return sessionId;
//   };

//   const calculateTotal = (items: CartItem[]): number => {
//     return items.reduce((total, item) => {
//       return total + (item.products.selling_price ) * item.quantity;
//     }, 0);
//   };

//   const fetchCartItems = async (): Promise<CartItem[]> => {
//     try {
//       const query = supabase
//         .from("cart_items")
//         .select(
//           `id, 
//            quantity, 
      
//            created_at, 
//            product_id,
//            products (
//              name, 
//              image_url, 
//              selling_price, 
//              brand, 
//              category_id,
//              stock
//            )`
//         )
//         .order("created_at", { ascending: true });

//       if (user) {
//         const { data, error } = await query.eq("user_id", user.id);
//         if (error) throw error;
//         return data as unknown as CartItem[];
//       } else {
//         const sessionId = getSessionId();
//         const { data, error } = await query.eq("session_id", sessionId);
//         if (error) throw error;
//         return data as unknown as CartItem[];
//       }
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       throw error;
//     }
//   };

//   const refreshCart = async (): Promise<void> => {
//     setIsLoading(true);
//     try {
//       const items = await fetchCartItems();
//       setCart({
//         items,
//         total: calculateTotal(items),
//       });
//       setError(null);
//     } catch (error) {
//       setError(error instanceof Error ? error : new Error(String(error)));
//       setCart(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     refreshCart();
//   }, [user?.id]);

//   const addItem = async (productId: string, quantity: number): Promise<void> => {
//     try {
//       // Get product details
//       const { data: product, error: productError } = await supabase
//         .from("products")
//         .select("price, selling_price, stock")
//         .eq("id", productId)
//         .single();

//       if (productError || !product) {
//         throw new Error("Product not found");
//       }

//       if (product.stock < quantity) {
//         throw new Error("Insufficient stock");
//       }

//       // Check if item already exists in cart
//       const existingItem = cart?.items.find(
//         (item) => item.product_id === productId
//       );

//       if (existingItem) {
//         await updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
//         return;
//       }

//       // Insert new cart item
//       const { error } = await supabase.from("cart_items").insert({
//         product_id: productId,
//         quantity,
      
//       });

//       if (error) throw error;

//       await refreshCart();
//       toast({
//         title: "Added to cart",
//         description: "Item has been added to your cart",
//       });
//     } catch (error) {
//       console.error("Error adding item:", error);
//       toast({
//         title: "Failed to add item",
//         description: error instanceof Error ? error.message : "Something went wrong",
//         variant: "destructive",
//       });
//     }
//   };

//   const removeItem = async (itemId: string): Promise<void> => {
//     try {
//       const { error } = await supabase
//         .from("cart_items")
//         .delete()
//         .eq("id", itemId);

//       if (error) throw error;

//       await refreshCart();
//       toast({
//         title: "Item removed",
//         description: "Item has been removed from your cart",
//       });
//     } catch (error) {
//       console.error("Error removing item:", error);
//       toast({
//         title: "Failed to remove item",
//         description: "Could not remove item from cart",
//         variant: "destructive",
//       });
//     }
//   };

//   const updateItemQuantity = async (itemId: string, quantity: number): Promise<void> => {
//     try {
//       const item = cart?.items.find((i) => i.id === itemId);
//       if (!item) throw new Error("Item not found in cart");

//       if (quantity < 1) {
//         await removeItem(itemId);
//         return;
//       }

//       // Check stock availability
//       if (item.products.stock < quantity) {
//         throw new Error("Insufficient stock");
//       }

//       const { error } = await supabase
//         .from("cart_items")
//         .update({ quantity })
//         .eq("id", itemId);

//       if (error) throw error;

//       await refreshCart();
//       toast({
//         title: "Quantity updated",
//         description: "Item quantity has been updated",
//       });
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//       toast({
//         title: "Failed to update",
//         description: error instanceof Error ? error.message : "Something went wrong",
//         variant: "destructive",
//       });
//     }
//   };

//   const clearCart = async (): Promise<void> => {
//     try {
//       if (!cart) return;

//       const { error } = await supabase
//         .from("cart_items")
//         .delete()
//         .in(
//           "id",
//           cart.items.map((item) => item.id)
//         );

//       if (error) throw error;

//       await refreshCart();
//       toast({
//         title: "Cart cleared",
//         description: "All items have been removed from your cart",
//       });
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//       toast({
//         title: "Failed to clear cart",
//         description: "Could not clear your cart",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         isLoading,
//         error,
//         addItem,
//         removeItem,
//         updateItemQuantity,
//         clearCart,
//         refreshCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart(): CartContextType {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// }


"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


interface Product {
  name: string;
  image_url: string;
  selling_price: number;
  brand: string;
  category_id: string;
  stock: number;
}

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products: Product;
}

interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserIdFromStorage = (): string => {
    const raw = localStorage.getItem("sb-sqpgtmpbfmtaivbfsjuy-auth-token");
    if (!raw) throw new Error("User not authenticated");
    const token = JSON.parse(raw);
    return token.user?.id;
  };

  const getOrCreateCartId = async (userId: string): Promise<string> => {
    const { data: existingCart, error } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (existingCart) return existingCart.id;

    const { data: newCart, error: insertError } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return newCart.id;
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const userId = getUserIdFromStorage();
      const cartId = await getOrCreateCartId(userId);

      const { data: items, error } = await supabase
        .from("cart_items")
        .select(
          `
            id,
            quantity,
            created_at,
            product_id,
            products (
              name,
              image_url,
              selling_price,
              brand,
              category_id,
              stock
            )
          `
        )
        .eq("cart_id", cartId)
        .order("created_at");

      if (error) throw error;

      setCart({
        id: cartId,
        user_id: userId,
        items: items as CartItem[],
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number) => {
    const userId = getUserIdFromStorage();
    const cartId = await getOrCreateCartId(userId);

    const existingItem = cart?.items.find(item => item.product_id === productId);

    if (existingItem) {
      await updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, product_id: productId, quantity });

    if (error) throw error;

    await fetchCart();
  };

  const updateItemQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(cartItemId);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId);

    if (error) throw error;

    await fetchCart();
  };

  const removeItem = async (cartItemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (error) throw error;

    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateItemQuantity,
        removeItem,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
