"use server";

export async function resetPasswordService(email: string, newPassword: string) {
  try {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      ...data,
    };
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return {
      ok: false,
      statusMsg: "fail",
      message: "Could not connect to service. Please check your connection and try again.",
    };
  }
}

