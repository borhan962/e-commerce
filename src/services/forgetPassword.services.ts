"use server";

export async function forgotPasswordService(email: string) {
  try {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      ...data,
    };
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return {
      ok: false,
      statusMsg: "fail",
      message: "Could not connect to service. Please check your connection and try again.",
    };
  }
}
