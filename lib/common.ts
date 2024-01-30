import { enc, lib } from "crypto-js";
import type { NextApiRequest } from "next";

export const createRandomString = (length = 6) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;

  let string = "";

  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return string;
};

// Create token
export function generateToken(length = 64) {
  const tokenBytes = lib.WordArray.random(length);

  return enc.Base64.stringify(tokenBytes);
}

// Tạo đường dẫn (slug) từ tiêu đề cho tất cả các ký tự latin
export const slugify = (text: string) => {
  return text
    .toString()
    .normalize("NFD") // chuyển sang Unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/đ/gi, "d") // xử lý riêng cho ký tự đ, Đ
    .toLowerCase() // chuyển thành chữ viết thường
    .replace(/([^0-9a-z-\s])/g, "") // xóa tất cả các ký tự đặc biệt
    .replace(/\s+/g, "-") // chuyển dấu cách thành dấu gạch ngang
    .replace(/&/g, "-va-") // chuyển ký tự '&' thành 'va'
    .replace(/[^\w\-]+/g, "") // loại bỏ những ký tự không phải chữ cái
    .replace(/\-\-+/g, "-") // gộp nhiều dấu gạch ngang
    .replace(/^-+/, "") // bỏ dấu gạch ngang ở đầu
    .replace(/-+$/, ""); // bỏ dấu gạch ngang ở cuối
};

// Fetch the auth token from the request headers
export const extractAuthToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization || null;

  return authHeader ? authHeader.split(" ")[1] : null;
};

export const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

export const validateDomain = (domain: string): boolean => {
  return domainRegex.test(domain);
};

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password should be at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Password should have at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Password should have at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Password should have at least one number
  if (!/\d/.test(password)) {
    return false;
  }

  // Password should have at least one special character
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return false;
  }

  return true;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const defaultHeaders = {
  "Content-Type": "application/json"
};

export const passwordPolicies = {
  minLength: 8
};
