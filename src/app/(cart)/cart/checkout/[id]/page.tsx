"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Building2,
  Mail,
  Banknote,
  CreditCard,
  Loader2,
  ShieldCheck,
  User,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { checkoutSchema, CheckoutFormValues } from "@/lib/checkoutSchema";
import {
  createCashOrder,
  createCheckoutSession,
} from "@/services/order.services";
import { useCart } from "@/context/CartContext";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const cartId = (params?.id as string) || "";

  const { data: session } = useSession();
  const { setCartCount } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "visa">("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      details: "",
      phone: "",
      city: "",
      postalCode: "",
    },
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!session?.accessToken) {
      setErrorMessage("Please sign in first to place your order.");
      return;
    }

    if (!cartId) {
      setErrorMessage("Cart ID is missing. Please return to cart and try again.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const shippingAddress = {
      details: values.details,
      phone: values.phone,
      city: values.city,
      postalCode: values.postalCode || "",
    };

    try {
      if (paymentMethod === "cash") {
        // 1. Cash on Delivery
        const res = await createCashOrder(
          cartId,
          shippingAddress,
          session.accessToken
        );

        console.log("Cash order response:", res);

        if (
          res?.status === "success" ||
          res?.statusMsg === "success" ||
          res?.data?._id ||
          res?.ok
        ) {
          setCartCount(0);
          router.push("/allorders");
        } else {
          setErrorMessage(
            res?.message || "Failed to create cash order. Please try again."
          );
        }
      } else {
        // 2. Visa / Online Card Checkout Session
        const res = await createCheckoutSession(
          cartId,
          shippingAddress,
          session.accessToken,
          typeof window !== "undefined" ? window.location.origin : undefined
        );

        console.log("Checkout session response:", res);

        if (res?.status === "success" && res?.session?.url) {
          setCartCount(0);
          window.location.href = res.session.url;
        } else {
          setErrorMessage(
            res?.message ||
              "Failed to initialize Visa payment session. Please try again."
          );
        }
      }
    } catch (err: any) {
      console.error("Checkout submission error:", err);
      setErrorMessage(
        err?.message || "An unexpected error occurred during checkout."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B7280] hover:text-[#4F46E5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Cart</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-[#F3F4F6] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#111827]">
                  Checkout & Shipping
                </h1>
                <p className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>
                    Recipient:{" "}
                    <strong className="text-[#111827] font-semibold">
                      {session?.user?.name || "Customer"}
                    </strong>
                  </span>
                </p>
              </div>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-500 hidden sm:inline-block">
              Cart: #{cartId.slice(-6).toUpperCase()}
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Street Address */}
            <Controller
              name="details"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="block text-xs font-semibold uppercase tracking-wider text-[#111827] mb-1.5"
                    htmlFor={field.name}
                  >
                    Street Address & Building Details
                  </FieldLabel>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. 15 Tahrir St, Floor 4, Apt 4B"
                      aria-invalid={fieldState.invalid}
                      className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Phone & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="block text-xs font-semibold uppercase tracking-wider text-[#111827] mb-1.5"
                      htmlFor={field.name}
                    >
                      Phone Number
                    </FieldLabel>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        {...field}
                        id={field.name}
                        type="tel"
                        placeholder="01012345678"
                        aria-invalid={fieldState.invalid}
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="city"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="block text-xs font-semibold uppercase tracking-wider text-[#111827] mb-1.5"
                      htmlFor={field.name}
                    >
                      City
                    </FieldLabel>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="e.g. Cairo"
                        aria-invalid={fieldState.invalid}
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Postal Code */}
            <Controller
              name="postalCode"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="block text-xs font-semibold uppercase tracking-wider text-[#111827] mb-1.5"
                    htmlFor={field.name}
                  >
                    Postal Code (Optional)
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. 11511"
                      className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Payment Method Selector */}
            <div className="pt-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111827] mb-2.5">
                Select Payment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-[#10B981] bg-[#10B981]/5 ring-2 ring-[#10B981]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB] bg-white"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      paymentMethod === "cash"
                        ? "bg-[#10B981] text-white"
                        : "bg-gray-100 text-[#4B5563]"
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">
                      Cash on Delivery
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5">
                      Pay in cash upon doorstep delivery
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("visa")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === "visa"
                      ? "border-[#4F46E5] bg-[#4F46E5]/5 ring-2 ring-[#4F46E5]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB] bg-white"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      paymentMethod === "visa"
                        ? "bg-[#4F46E5] text-white"
                        : "bg-gray-100 text-[#4B5563]"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">
                      Visa / Credit Card
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5">
                      Pay securely with Stripe gateway
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-14 rounded-xl text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 active:scale-[0.99] ${
                  paymentMethod === "cash"
                    ? "bg-[#10B981] hover:bg-[#059669]"
                    : "bg-[#4F46E5] hover:bg-[#4338CA]"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : paymentMethod === "cash" ? (
                  <>
                    <span>Confirm Order (Cash on Delivery)</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>Proceed to Visa Payment</span>
                    <CreditCard className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>256-bit Encrypted SSL Safe Checkout</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
