export async function getWishlist(token: string) {
  if (!token) return { ok: false, data: [] };

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      method: "GET",
      headers: {
        token: token,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Wishlist API responded with status ${response.status}`);
      return { ok: false, data: [] };
    }

    const data = await response.json();
    return {
      ok: true,
      count: data?.count || 0,
      data: Array.isArray(data?.data) ? data.data : [],
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { ok: false, data: [] };
  }
}

export async function addToWishlist(productId: string, token: string) {
  if (!token || !productId) return null;

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      method: "POST",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();
    return {
      ok: response.ok,
      ...data,
    };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return null;
  }
}

export async function removeFromWishlist(productId: string, token: string) {
  if (!token || !productId) return null;

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        token: token,
      },
    });

    const data = await response.json();
    return {
      ok: response.ok,
      ...data,
    };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return null;
  }
}
