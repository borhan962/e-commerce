"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { verifyResetCodeService } from "@/services/verifyCode.services";

export default function VerifyCode() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("resetEmail");
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  // Handle single digit change
  const handleChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, "");

    const newCode = [...code];
    newCode[index] = cleanVal ? cleanVal[cleanVal.length - 1] : "";
    setCode(newCode);
    setApiError(null);

    // Auto-advance to next input if filled
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace & Arrow keys navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle full 6-digit paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    if (digits.length === 0) return;

    const newCode = [...code];
    digits.forEach((digit, idx) => {
      newCode[idx] = digit;
    });
    setCode(newCode);
    setApiError(null);

    // Focus next empty input or last input
    const nextIdx = Math.min(digits.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const fullCode = code.join("");
  const isComplete = fullCode.length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const res = await verifyResetCodeService(fullCode);
      console.log("Verify Code response:", res);

      const isSuccess =
        res?.status === "Success" ||
        res?.statusMsg === "success" ||
        res?.data?.status === "Success" ||
        res?.data?.statusMsg === "success";

      if (isSuccess) {
        setSuccessMessage("Code verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/ResetPassword");
        }, 1200);
      } else {
        setApiError(
          res?.message || res?.data?.message || "Invalid or expired verification code. Please try again."
        );
      }
    } catch (err: any) {
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
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Verify Code
          </h1>
          <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
            Please enter the 6-digit verification code sent to{" "}
            <strong className="text-[#111827] font-semibold">{email || "your email address"}</strong>.
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

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 6-Input Code Field */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                autoFocus={idx === 0}
                className="w-full aspect-square text-center text-xl sm:text-2xl font-bold rounded-xl border border-[#D1D5DB] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all shadow-2xs"
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isComplete || isLoading}
            className="w-full h-12 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Link */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#6B7280]">
            Didn&apos;t receive the code?{" "}
            <Link
              href="/forgetPassword"
              className="text-[#4F46E5] font-semibold hover:underline ml-1"
            >
              Resend Code
            </Link>
          </p>
        </div>

        {/* Back to Sign In */}
        <div className="mt-6 text-center pt-6 border-t border-[#F3F4F6]">
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

