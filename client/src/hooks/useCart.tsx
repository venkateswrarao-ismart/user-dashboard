import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

type CartItem = {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image_url: string;
    price: number;
    selling_price: number;
    brand: string;
    category: string;
  };
};

type Cart = {
  id: number;
  userId: number | null;
  sessionId: string | null;
  total: number;
  items: CartItem[];
};

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: Error | null;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

type CartProviderProps = {
  children: ReactNode;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const fetchCart = async (): Promise<Cart | null> => {
    try {
      const res = await fetch("/api/cart", {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }
      
      return await res.json();
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  };

  const refreshCart = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const cartData = await fetchCart();
      setCart(cartData);
    } catch (error) {
      console.error("Error refreshing cart:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart on initial load and when auth state changes
  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addItem = async (productId: string, quantity: number): Promise<void> => {
    try {
      const res = await apiRequest("POST", "/api/cart", { productId, quantity });
      const updatedCart = await res.json();
      setCart(updatedCart);
      toast({
        title: "Item added to cart",
        description: "The item was successfully added to your cart.",
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Failed to add item",
        description: "There was an error adding the item to your cart. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeItem = async (itemId: number): Promise<void> => {
    try {
      const res = await apiRequest("DELETE", `/api/cart/items/${itemId}`, undefined);
      const updatedCart = await res.json();
      setCart(updatedCart);
      toast({
        title: "Item removed",
        description: "The item was removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Failed to remove item",
        description: "There was an error removing the item from your cart. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItemQuantity = async (itemId: number, quantity: number): Promise<void> => {
    // In our API, this is handled by removing and re-adding the item
    try {
      // First get the product ID for this item
      const item = cart?.items.find(item => item.id === itemId);
      if (!item) throw new Error("Item not found in cart");
      
      // Remove the item
      await removeItem(itemId);
      
      // Add it back with the new quantity
      await addItem(item.productId, quantity);
      
      toast({
        title: "Quantity updated",
        description: "The item quantity was updated in your cart.",
      });
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast({
        title: "Failed to update quantity",
        description: "There was an error updating the item quantity. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const clearCart = async (): Promise<void> => {
    // Clear cart by removing all items one by one
    try {
      if (!cart) return;
      
      for (const item of cart.items) {
        await removeItem(item.id);
      }
      
      // Refresh cart after clearing
      await refreshCart();
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Failed to clear cart",
        description: "There was an error clearing your cart. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
