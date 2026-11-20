"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/wishlist.services";

export interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: any[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlistDirect: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  isLoading: boolean;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  wishlistItems: [],
  wishlistCount: 0,
  isInWishlist: () => false,
  toggleWishlist: async () => false,
  removeFromWishlistDirect: async () => {},
  refreshWishlist: async () => {},
  isLoading: false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Live fetch user wishlist from RouteMisr API
  const refreshWishlist = useCallback(async () => {
    if (!session?.accessToken) {
      setWishlistIds([]);
      setWishlistItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const res = await getWishlist(session.accessToken);
      if (res?.ok && Array.isArray(res.data)) {
        setWishlistItems(res.data);
        const ids = res.data.map((item: any) => item._id || item.id);
        setWishlistIds(ids);
      } else {
        setWishlistItems([]);
        setWishlistIds([]);
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setWishlistIds([]);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  // Synchronize on authentication change
  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      refreshWishlist();
    } else if (status === "unauthenticated") {
      setWishlistIds([]);
      setWishlistItems([]);
    }
  }, [status, session?.accessToken, refreshWishlist]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  // Toggle bookmark in wishlist (Add if not present, remove if already present)
  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (!session?.accessToken) return false;

    const currentlyBookmarked = wishlistIds.includes(productId);

    if (currentlyBookmarked) {
      // Optimistic update
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));

      const res = await removeFromWishlist(productId, session.accessToken);
      if (res?.data && Array.isArray(res.data)) {
        setWishlistIds(res.data);
      }
      return false;
    } else {
      // Optimistic update
      setWishlistIds((prev) => [...prev, productId]);

      const res = await addToWishlist(productId, session.accessToken);
      if (res?.data && Array.isArray(res.data)) {
        setWishlistIds(res.data);
      }
      // Re-fetch full items in background so wishlist page has latest product details
      refreshWishlist();
      return true;
    }
  };

  const removeFromWishlistDirect = async (productId: string) => {
    if (!session?.accessToken) return;

    // Optimistic update
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));

    const res = await removeFromWishlist(productId, session.accessToken);
    if (res?.data && Array.isArray(res.data)) {
      setWishlistIds(res.data);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlistDirect,
        refreshWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
