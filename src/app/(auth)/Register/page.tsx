"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserCheck, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import z from "zod";
import zod from "zod";
import { signUp } from "@/services/signUp.services";
import { useRouter } from "next/navigation";
import { formSchema } from "@/lib/registerSchima";
import { useSession } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleRegister = async (values: any) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await signUp(values);
      const data = typeof res?.json === "function" ? await res.json() : res;

      console.log("Signup response:", data, "Status code:", res?.status);

      // Check if response is 200/201 or message/status indicates success
      if (
        res?.status === 200 ||
        res?.status === 201 ||
        data?.message === "success" ||
        data?.status === "success" ||
        res?.ok
      ) {
        router.push("/Login");
      } else {
        setApiError(data?.message || "Registration failed. Please check your data.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setApiError(error?.message || "Something went wrong during registration.");
    } finally {
      setIsLoading(false);
    }
  };

   const {control, handleSubmit} = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
   })


  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-[#F9FAFB] px-4 py-16">
      {/* 540px Wide Pure White Sign-Up Card on Off-White Background */}
      <div className="w-full max-w-[540px] bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E5E7EB] p-8 sm:p-10 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] mb-4">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Create Account
          </h1>
          <p className="text-sm text-[#6B7280] mt-2">
            Join thousands of collectors and design enthusiasts worldwide.
          </p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="p-3.5 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium text-center">
            {apiError}
          </div>
        )}

        {/* Registration Form */}
        
        <form onSubmit={handleSubmit(handleRegister)}  className="space-y-5">

           <Controller
                name="name"
                      control={control}
                             render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                 <FieldLabel className="block text-sm font-medium text-[#111827] mb-1.5" htmlFor={field.name}>First Name</FieldLabel>
                         <Input
                 type="text"
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="Jane"
        autoComplete="off"
        className="w-full h-12 px-4 rounded-xl bg-white border border-[#D1D5DB] text-[#111827] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>


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
                             autoComplete="new-password"
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


       <Controller
               name="rePassword"
                      control={control}
                             render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                 <FieldLabel className="block text-sm font-medium text-[#111827] mb-1.5" htmlFor={field.name}>Confirm Password </FieldLabel>
                         <div className="relative">
                           <Input
                             type={showRePassword ? "text" : "password"}
                             {...field}
                             id={field.name}
                             aria-invalid={fieldState.invalid}
                             placeholder="At least 8 characters"
                             autoComplete="new-password"
                             className="w-full h-12 pl-4 pr-11 rounded-xl bg-white border border-[#D1D5DB] text-[#111827] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                           />
                           <button
                             type="button"
                             onClick={() => setShowRePassword(!showRePassword)}
                             className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer"
                             aria-label={showRePassword ? "Hide confirm password" : "Show confirm password"}
                           >
                             {showRePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                           </button>
                         </div>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/> 


       <Controller
               name="phone"
                      control={control}
                             render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                 <FieldLabel className="block text-sm font-medium text-[#111827] mb-1.5" htmlFor={field.name}>Phone Number </FieldLabel>
                         <Input
                type={"text"}
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="Enter your phone number"
        autoComplete="off"

        className="w-full h-12 px-4 rounded-xl bg-white border border-[#D1D5DB] text-[#111827] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
        
      />

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/> 

          {/* Large Vibrant Indigo 'Create Account' Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer sign in prompt */}
        <p className="mt-8 text-center text-sm text-[#6B7280] border-t border-[#F3F4F6] pt-6">
          Already have an account?{" "}
          <Link
            href="/Login"
            className="text-[#4F46E5] font-semibold hover:text-[#4338CA] hover:underline transition-colors"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
