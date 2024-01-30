import env from "@/lib/env";
import React, { FC } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  onChange: (token: string) => void;
}

const GoogleReCAPTCHA: FC<Props> = ({ recaptchaRef, onChange }) => {
  if (!env.recaptcha.siteKey) {
    return null;
  }

  return <ReCAPTCHA ref={recaptchaRef} onChange={onChange} sitekey={env.recaptcha.siteKey} />;
};

export default GoogleReCAPTCHA;
