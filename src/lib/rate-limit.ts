import { prisma } from "./prisma";

const LANDING_RATE_LIMIT = 40; // requests per day per IP

export async function checkIpRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0); // Reset at midnight

  // Find or create rate limit record
  let record = await prisma.ipRateLimit.findUnique({
    where: { ip },
  });

  if (!record) {
    // Create new record
    record = await prisma.ipRateLimit.create({
      data: {
        ip,
        count: 1,
        resetAt: tomorrow,
      },
    });
    return { allowed: true, remaining: LANDING_RATE_LIMIT - 1 };
  }

  // Check if we need to reset
  if (now >= record.resetAt) {
    record = await prisma.ipRateLimit.update({
      where: { ip },
      data: {
        count: 1,
        resetAt: tomorrow,
      },
    });
    return { allowed: true, remaining: LANDING_RATE_LIMIT - 1 };
  }

  // Check if under limit
  if (record.count >= LANDING_RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  // Increment count
  record = await prisma.ipRateLimit.update({
    where: { ip },
    data: {
      count: { increment: 1 },
    },
  });

  return { allowed: true, remaining: LANDING_RATE_LIMIT - record.count };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}
