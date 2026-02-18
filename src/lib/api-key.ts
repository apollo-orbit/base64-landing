import { prisma } from "./prisma";
import { randomBytes } from "crypto";

export function generateApiKey(): string {
  return `b64_${randomBytes(24).toString("hex")}`;
}

export async function createApiKey(userId: string, name?: string) {
  const key = generateApiKey();
  return prisma.apiKey.create({
    data: {
      key,
      name,
      userId,
    },
  });
}

export async function validateApiKey(key: string) {
  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: { user: true },
  });

  if (!apiKey || !apiKey.enabled) {
    return null;
  }

  // Update last used
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsed: new Date() },
  });

  return apiKey;
}

export async function checkApiKeyRateLimit(apiKeyId: string, userId: string): Promise<boolean> {
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: apiKeyId },
  });

  if (!apiKey) return false;

  // Count requests in the last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const requestCount = await prisma.usageLog.count({
    where: {
      apiKeyId,
      createdAt: { gte: oneDayAgo },
    },
  });

  return requestCount < apiKey.rateLimit;
}

export async function logApiUsage(
  userId: string,
  endpoint: string,
  apiKeyId?: string,
  ip?: string
) {
  return prisma.usageLog.create({
    data: {
      userId,
      endpoint,
      apiKeyId,
      ip,
    },
  });
}
