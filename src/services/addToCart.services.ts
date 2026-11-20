export async function AddToCart(productIdOrToken: string, tokenOrProductId?: string) {
  // Support both (productId, token) and (token, productId)
  let productId = productIdOrToken;
  let token = tokenOrProductId || "";

  // If first param looks like a JWT token (contains dots) and second doesn't
  if (productIdOrToken?.includes(".") && !tokenOrProductId?.includes(".")) {
    token = productIdOrToken;
    productId = tokenOrProductId || "";
  }

  if (!token || !productId) {
    console.warn("Missing token or productId in AddToCart");
    return null;
  }

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        token: token,
      },
      body: JSON.stringify({ productId }),
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
