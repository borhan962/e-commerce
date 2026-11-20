export async function getCartUser(token: string) {
  if (!token) {
    console.warn("No token provided to getCartUser");
    return null;
  }

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
      method: "GET",
      headers: {
        token: token,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Cart API responded with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Could not connect to cart service:", error);
    return null;
  }
}

export async function updateCartItemQuantity(productId: string, count: number, token: string) {
  if (!token) return null;

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`, {
      method: "PUT",
      headers: {
        token: token,
        "content-type": "application/json",
      },
      body: JSON.stringify({ count }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn("Error updating cart item:", error);
    return null;
  }
}

export async function removeCartItem(productId: string, token: string) {
  if (!token) return null;

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`, {
      method: "DELETE",
      headers: {
        token: token,
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn("Error removing cart item:", error);
    return null;
  }
}

export async function clearUserCart(token: string) {
  if (!token) return null;

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
      method: "DELETE",
      headers: {
        token: token,
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn("Error clearing cart:", error);
    return null;
  }
}
