"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { getCartUser } from "@/services/cartUser.services";

export interface CartContextType {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  refreshCartCount: () => Promise<void>;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType>({
  cartCount: 0,
  setCartCount: () => {},
  refreshCartCount: async () => {},
  isLoading: false,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Live fetch cart items count from RouteMisr API
  const refreshCartCount = useCallback(async () => {
    if (!session?.accessToken) {
      setCartCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const res = await getCartUser(session.accessToken);
      if (res?.numOfCartItems !== undefined) {
        setCartCount(res.numOfCartItems);
      } else if (res?.data?.products && Array.isArray(res.data.products)) {
        setCartCount(res.data.products.length);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  // Synchronize count whenever session token changes or user signs in/out
  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      refreshCartCount();
    } else if (status === "unauthenticated") {
      setCartCount(0);
    }
  }, [status, session?.accessToken, refreshCartCount]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        refreshCartCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to consume the cart count anywhere in the app
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Aliases for convenience
export const useCartCount = useCart;
export const useNumberOfCart = useCart;

