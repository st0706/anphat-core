import { db } from "@/server/db";
import { createHash, randomBytes } from "crypto";

interface CreateApiKeyParams {
  name: string;
  teamId: string;
}

export const hashApiKey = (apiKey: string) => {
  return createHash("sha256").update(apiKey).digest("hex");
};

export const generateUniqueApiKey = () => {
  const apiKey = randomBytes(16).toString("hex");

  return [hashApiKey(apiKey), apiKey];
};

export const createApiKey = async (params: CreateApiKeyParams) => {
  const { name, teamId } = params;

  const [hashedKey, apiKey] = generateUniqueApiKey();

  await db.apiKey.create({
    data: {
      name,
      hashedKey: hashedKey,
      team: { connect: { id: teamId } }
    }
  });

  return apiKey;
};

export const fetchApiKeys = async (teamId: string) => {
  return db.apiKey.findMany({
    where: {
      teamId
    }
  });
};

export const deleteApiKey = async (id: string) => {
  return db.apiKey.delete({
    where: {
      id
    }
  });
};
