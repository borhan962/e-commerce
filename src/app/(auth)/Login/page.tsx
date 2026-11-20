"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";   
// import { signIn } from "@/services/signIn.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/loginSchima";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleLogin = async (values: any) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log("NextAuth response:", res);

      if (res?.ok) {
        router.push("/");
      } else {
        // NextAuth returns 401 with error "CredentialsSignin" when credentials are invalid
        setApiError("Incorrect email or password.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setApiError(err?.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };


     const {control, handleSubmit} = useForm({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: "",
        password: ""
      },
     })

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-[#F9FAFB] px-4 py-16">
      {/* 480px Wide Pure White Login Card Resting on Off-White Background */}
      <div className="w-full max-w-[480px] bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E5E7EB] p-8 sm:p-10 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Welcome Back
          </h1>
          <p className="text-sm text-[#6B7280] mt-2">
            Please enter your credentials to access your account.
          </p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="p-3.5 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium text-center">
            {apiError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">



                 <Controller
               name="email"
                      control={control}
                             render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                 <FieldLabel className="block text-sm font-medium text-[#111827] mb-1.5" htmlFor={field.name}>Email</FieldLabel>
                         <Input
                 type="Email"
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="jane.doe@example.com"
        autoComplete="off"
        className="w-full h-12 px-4 rounded-xl bg-white border border-[#D1D5DB] text-[#111827] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/> 


       <Controller
               name="password"
                      control={control}
                             render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                 <FieldLabel className="block text-sm font-medium text-[#111827] mb-1.5" htmlFor={field.name}>Password </FieldLabel>
                         <div className="relative">
                           <Input
                             type={showPassword ? "text" : "password"}
                             {...field}
                             id={field.name}
                             aria-invalid={fieldState.invalid}
                             placeholder="At least 8 characters"
                             autoComplete="off"
                             className="w-full h-12 pl-4 pr-11 rounded-xl bg-white border border-[#D1D5DB] text-[#111827] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                           />
                           <button
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer"
                             aria-label={showPassword ? "Hide password" : "Show password"}
                           >
                             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                           </button>
                         </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/> 

          {/* Large Vibrant Indigo 'Sign In' Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>


        <Link href="/forgetPassword">
        <div className="text-center">
          <p className="text-sm text-[#6B7280] mt-2 cursor-pointer">Forget Password?</p>
        </div>
        </Link>

        {/* Subtle Divider Line with 'OR' */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#FFFFFF] px-3 font-medium text-[#6B7280]">
              OR
            </span>
          </div>
        </div>

        {/* Two Social Login Buttons at Bottom */}
        <div className="grid grid-cols-2 gap-3.5">
          <button
            type="button"
            className="h-12 px-4 rounded-xl border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] bg-white flex items-center justify-center gap-2.5 text-sm font-medium text-[#111827] transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            className="h-12 px-4 rounded-xl border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] bg-white flex items-center justify-center gap-2.5 text-sm font-medium text-[#111827] transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current text-[#111827]" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.05-1.82.93-2.88-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.75-.95 2.79 1.02.08 2.06-.52 2.69-1.28z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Footer sign up prompt */}
        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Don't have an account?{" "}
          <Link
            href="/Register"
            className="text-[#4F46E5] font-semibold hover:text-[#4338CA] hover:underline transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
