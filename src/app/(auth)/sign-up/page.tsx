import AuthForm from "@/components/AuthForm";
import { getLoggedInUser } from "@/lib/actions/user.action";
import React from "react";

const SignUp = async () => {
  const loggedInUser = await getLoggedInUser();
  console.log(loggedInUser);

  return (
    <section className="size-full flex-center max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default SignUp;
