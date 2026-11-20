"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/resetPasswordSchema";
import { resetPasswordService } from "@/services/resetPassword.services";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, setValue } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Prepopulate email if available from forgetPassword/verifyCode step
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("resetEmail");
      if (savedEmail) {
        setValue("email", savedEmail);
      }
    }
  }, [setValue]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const res = await resetPasswordService(values.email, values.newPassword);
      console.log("Reset Password response:", res);

      // RouteMisr returns { token: "..." } on success, or statusMsg: "fail" on failure
      const isSuccess = !!res?.token || res?.statusMsg === "success" || res?.ok;

      if (isSuccess && !res?.statusMsg?.includes("fail")) {
        setSuccessMessage("Password reset successfully! Redirecting to login...");

        if (typeof window !== "undefined") {
          localStorage.removeItem("resetEmail");
        }

        setTimeout(() => {
          router.push("/Login");
        }, 1500);
      } else {
        // Show server error and DO NOT redirect
        setApiError(
          res?.message || "Failed to reset password. Please check your credentials and try again."
        );
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setApiError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 py-16">
      {/* 480px Centered Card */}
      <div className="w-full max-w-[480px] bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E5E7EB] p-8 sm:p-10 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] mb-4 shadow-2xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Reset Your Password
          </h1>
          <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
            Choose a strong new password for your account to regain access.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 mb-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {apiError && (
          <div className="p-3.5 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium text-center">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="block text-sm font-medium text-[#111827] mb-1.5"
                  htmlFor={field.name}
                >
                  Email Address
                </FieldLabel>
                <div className="relative">
                  <Mail className="w-5 h-5 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="email"
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="jane.doe@example.com"
                    autoComplete="email"
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-[#D1D5DB] text-[#111827] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* New Password */}
          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="block text-sm font-medium text-[#111827] mb-1.5"
                  htmlFor={field.name}
                >
                  New Password
                </FieldLabel>
                <div className="relative">
                  <Lock className="w-5 h-5 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full h-12 pl-11 pr-11 rounded-xl bg-white border border-[#D1D5DB] text-[#111827] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] transition-colors"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="block text-sm font-medium text-[#111827] mb-1.5"
                  htmlFor={field.name}
                >
                  Confirm New Password
                </FieldLabel>
                <div className="relative">
                  <Lock className="w-5 h-5 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full h-12 pl-11 pr-11 rounded-xl bg-white border border-[#D1D5DB] text-[#111827] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 text-center pt-6 border-t border-[#F3F4F6]">
          <Link
            href="/Login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4B5563] hover:text-[#4F46E5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
