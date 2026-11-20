import { jwtDecode } from "jwt-decode";

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

// 1. Cash on Delivery Order API
export async function createCashOrder(
  cartId: string,
  shippingAddress: ShippingAddress,
  token: string
) {
  if (!token || !cartId) {
    return { ok: false, message: "Missing token or cartId" };
  }

  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ shippingAddress }),
      }
    );

    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      ...data,
    };
  } catch (error: any) {
    console.error("Cash order error:", error);
    return { ok: false, message: "Network error creating cash order." };
  }
}

// 2. Visa / Online Card Checkout Session API
export async function createCheckoutSession(
  cartId: string,
  shippingAddress: ShippingAddress,
  token: string,
  returnUrl?: string
) {
  if (!token || !cartId) {
    return { ok: false, message: "Missing token or cartId" };
  }

  const origin =
    returnUrl ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(origin)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ shippingAddress }),
      }
    );

    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      ...data,
    };
  } catch (error: any) {
    console.error("Checkout session error:", error);
    return { ok: false, message: "Network error creating checkout session." };
  }
}

// 3. Get All User Orders API
export async function getUserOrders(
  userIdOrToken: string,
  maybeToken?: string
) {
  let userId = userIdOrToken;
  let token = maybeToken || "";

  // If a JWT token is passed directly as first parameter, decode userId automatically
  if (userIdOrToken?.includes(".") && !maybeToken) {
    token = userIdOrToken;
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.id || decoded._id || decoded.sub || "";
    } catch {
      userId = "";
    }
  }

  if (!userId) {
    console.warn("No userId provided to getUserOrders");
    return { ok: false, data: [] };
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.token = token;
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.warn(`Orders API responded with status ${response.status}`);
      return { ok: false, data: [] };
    }

    const data = await response.json();
    return {
      ok: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { ok: false, data: [] };
  }
}

// Alias
export const getAllOrdersUser = getUserOrders;
