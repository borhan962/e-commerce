"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
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
} from "lucide-react";
import { checkoutSchema, CheckoutFormValues } from "@/lib/checkoutSchema";
import {
  createCashOrder,
  createCheckoutSession,
} from "@/services/order.services";
import { useCart } from "@/context/CartContext";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartId: string;
  totalPrice?: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartId,
  totalPrice,
}: CheckoutModalProps) {
  const router = useRouter();
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

  if (!isOpen) return null;

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!session?.accessToken) {
      setErrorMessage("Please sign in first to place your order.");
      return;
    }

    if (!cartId) {
      setErrorMessage("Cart ID is missing. Please refresh and try again.");
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
          // Reset cart count in navbar
          setCartCount(0);
          onClose();
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
          // Reset cart count in navbar and redirect to Stripe
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111827]">
                Shipping & Checkout
              </h2>
              <p className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>
                  Order for:{" "}
                  <strong className="text-[#111827] font-semibold">
                    {session?.user?.name || "Customer"}
                  </strong>
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]/60 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable if needed on mobile) */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Street Address / Details */}
            <Controller
              name="details"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="block text-xs font-semibold uppercase tracking-wider text-[#111827] mb-1.5"
                    htmlFor={field.name}
                  >
                    Street Address & Details
                  </FieldLabel>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. 15 Tahrir St, Apt 4B"
                      aria-invalid={fieldState.invalid}
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Phone & City (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Phone */}
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
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* City */}
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
                        placeholder="e.g. Cairo / Giza"
                        aria-invalid={fieldState.invalid}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
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
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Payment Method Selection */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#111827] mb-2">
                Select Payment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-[#10B981] bg-[#10B981]/5 ring-1 ring-[#10B981]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB] bg-white"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      paymentMethod === "cash"
                        ? "bg-[#10B981] text-white"
                        : "bg-gray-100 text-[#4B5563]"
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">
                      Cash on Delivery
                    </div>
                    <div className="text-[11px] text-[#6B7280] mt-0.5">
                      Pay in cash upon doorstep delivery
                    </div>
                  </div>
                </button>

                {/* Visa / Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("visa")}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === "visa"
                      ? "border-[#4F46E5] bg-[#4F46E5]/5 ring-1 ring-[#4F46E5]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB] bg-white"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      paymentMethod === "visa"
                        ? "bg-[#4F46E5] text-white"
                        : "bg-gray-100 text-[#4B5563]"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111827]">
                      Visa / Credit Card
                    </div>
                    <div className="text-[11px] text-[#6B7280] mt-0.5">
                      Secure online Stripe checkout
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Total summary snippet if provided */}
            {totalPrice !== undefined && totalPrice > 0 && (
              <div className="pt-2 flex items-center justify-between text-xs text-[#6B7280]">
                <span>Order Total:</span>
                <span className="text-base font-extrabold text-[#111827]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                  paymentMethod === "cash"
                    ? "bg-[#10B981] hover:bg-[#059669]"
                    : "bg-[#4F46E5] hover:bg-[#4338CA]"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : paymentMethod === "cash" ? (
                  <>
                    <span>Confirm Cash on Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Proceed to Visa Payment</span>
                    <CreditCard className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9CA3AF] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Encrypted SSL 256-bit safe checkout</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

