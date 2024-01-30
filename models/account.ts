import { db } from "@/server/db";

export const getAccount = async (key: { userId: string }) => {
  return await db.account.findFirst({
    where: key
  });
};
