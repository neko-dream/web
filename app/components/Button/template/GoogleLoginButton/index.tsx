/* eslint-disable import/no-unresolved */
import { ComponentProps, ForwardedRef, forwardRef } from "react";
import GoogleIcon from "~/assets/auth/Google.png";
import Button from "../..";

function GoogleLoginButton(
  props: ComponentProps<"button">,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Button
      {...props}
      ref={ref}
      outline
      className="flex max-w-80 space-x-4 border border-gray-700 px-4"
    >
      <img src={GoogleIcon} className="inset-0 left-6 h-6 w-6" alt="" />
      <p className="text-center">Googleでログイン</p>
    </Button>
  );
}

export default forwardRef(GoogleLoginButton);
