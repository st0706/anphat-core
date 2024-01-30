import env from "./env";
import { ApiError } from "./errors";
import { invalid } from "./messages";

export const validateRecaptcha = async (token: string) => {
  if (!env.recaptcha.siteKey || !env.recaptcha.secretKey) {
    return;
  }

  if (!token) {
    throw new ApiError(400, invalid("Hình ảnh xác thực", "Vui lòng thử lại."));
  }

  const params = new URLSearchParams({
    secret: env.recaptcha.secretKey,
    response: token
  });

  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?${params}`, {
    method: "POST"
  });

  const { success } = await response.json();

  if (!success) {
    throw new ApiError(400, invalid("Hình ảnh xác thực", "Vui lòng thử lại."));
  }
};
