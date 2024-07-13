"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.action";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
  const formSchema = authFormSchema(type);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          email: data.email!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          password: data.password!,
          ssn: data.ssn!,
        };
        const newUser = await signUp(userData);

        setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            alt="Logo"
            width={34}
            height={34}
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-3">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      placeholder="Enter your first name"
                      control={form.control}
                      formName="firstName"
                      label="First Name"
                    />
                    <CustomInput
                      placeholder="Enter your last name"
                      control={form.control}
                      formName="lastName"
                      label="Last Name"
                    />
                  </div>
                  <CustomInput
                    placeholder="Enter your specific address"
                    control={form.control}
                    formName="address1"
                    label="Address"
                  />
                  <CustomInput
                    placeholder="Enter your city"
                    control={form.control}
                    formName="city"
                    label="City"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      placeholder="ex: Lagos"
                      control={form.control}
                      formName="state"
                      label="State"
                    />
                    <CustomInput
                      placeholder="ex: 100123"
                      control={form.control}
                      formName="postalCode"
                      label="Postal Code"
                    />
                  </div>
                  <CustomInput
                    placeholder="yyyy-mm-dd"
                    control={form.control}
                    formName="dateOfBirth"
                    label="Date of Birth"
                  />
                  <CustomInput
                    placeholder="ex: 1234"
                    control={form.control}
                    formName="ssn"
                    label="SSN"
                  />
                </>
              )}
              <CustomInput
                placeholder="Enter your email"
                control={form.control}
                formName="email"
                label="Email"
              />
              <CustomInput
                placeholder="Enter your password"
                control={form.control}
                formName="password"
                label="Password"
                type="password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-500">
              {type === "sign-in"
                ? "Don't have an account"
                : "Already have an account"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="text-14 text-blue-500"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
