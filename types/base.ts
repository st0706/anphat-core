import type { Prisma } from "@prisma/client";

export type ApiError = {
  code?: string;
  message: string;
  values: { [key: string]: string };
};

export type ApiResponse<T = unknown> =
  | {
      data: T;
      error: never;
    }
  | {
      data: never;
      error: ApiError;
    };

export type Role = "owner" | "member";

export type TeamWithMemberCount = Prisma.TeamGetPayload<{
  include: {
    _count: {
      select: { members: true };
    };
  };
}>;

export type WebookFormSchema = {
  name: string;
  url: string;
  eventTypes: string[];
};

export type AppEvent =
  | "invitation.created"
  | "invitation.removed"
  | "invitation.fetched"
  | "member.created"
  | "member.removed"
  | "member.left"
  | "member.fetched"
  | "member.role.updated"
  | "user.password.updated"
  | "user.password.request"
  | "user.updated"
  | "user.signup"
  | "user.password.reset"
  | "team.fetched"
  | "team.created"
  | "team.updated"
  | "team.removed"
  | "apikey.created"
  | "apikey.removed"
  | "apikey.fetched"
  | "apikey.removed"
  | "webhook.created"
  | "webhook.removed"
  | "webhook.fetched"
  | "webhook.updated";

export type AUTH_PROVIDER = "google" | "email" | "credentials";

export interface TeamFeature {
  auditLog: boolean;
  webhook: boolean;
  apiKey: boolean;
}

export interface TreeNode {
  id: string;
  parentId: string | null;
  name: string;
  logo: string | null;
  children: TreeNode[];
  teamId: string;
  organizationId: string;
  abbreviation: string | null;
  phoneNumber: string | null;
  email: string | null;
  provinceAddress: string | null;
  districtAddress: string | null;
  wardAddress: string | null;
  detailAddress: string | null;
  provinceVATBill: string | null;
  districtVATBill: string | null;
  wardVATBill: string | null;
  detailVATBill: string | null;
  website: string | null;
}

export interface DataGrid {
  id: string;
  parentId: string | null;
  name: string;
  logo: string | null;
  teamId: string;
  organizationId: string;
  abbreviation: string | null;
  phoneNumber: string | null;
  email: string | null;
  provinceAddress: string | null;
  districtAddress: string | null;
  wardAddress: string | null;
  detailAddress: string | null;
  provinceVATBill: string | null;
  districtVATBill: string | null;
  wardVATBill: string | null;
  detailVATBill: string | null;
  website: string | null;
  subRows: DataGrid[];
}

export type ParamsWithToken = {
  params: {
    token: string;
  };
};

export type ParamsWithSlug = {
  params: {
    slug: string;
  };
};

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export interface IStaff {
  familyName: string;
  name: string;
  otherName: string;
  engName: string;
  gender: Gender;
  dob: string;
  country: string;
  permanentAddress: string;
  currentAddress: string;
  CID: string;
  issuedBy: string;
  issuedDay: string;
  phoneNumber: string;
  email: string;
  organizationId: string;
  organizationName: string;
  ethnicMinority: string;
  nationality: string;
  religion: string;
  culturalLevel: string;
  dojCYU: string;
  dojCPV: string;
  officalDojCPV: string;
  avatar: string;
  habit: string;
}

export const ethnicMinority = [
  "Kinh",
  "Tày",
  "Hoa",
  "Nùng",
  "Thái",
  "Mường",
  "Khmer",
  "Chăm",
  "Tày Đủ",
  "Tày Trại",
  "Dao",
  "Dao Thanh Y",
  "Dao Tiền",
  "Dao Quần Chẹt",
  "Dao Đỏ",
  "Dao Tuyển",
  "Dao Ngao",
  "Dao Gù",
  "H'Mông",
  "H'Mông Đen",
  "H'Mông Hoa",
  "H'Mông Chẻo",
  "H'Mông Si La",
  "H'Mông Cống",
  "Lào",
  "Ơ Đu",
  "Xơ Đăng",
  "Mạ",
  "Cơ Tu",
  "Rơ Măm",
  "Khơ Mú",
  "Co",
  "Giẻ Triêng",
  "Ba Na",
  "Bru-Vân Kiều"
];
