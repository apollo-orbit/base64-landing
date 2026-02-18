import { NextRequest, NextResponse } from "next/server";
import { checkIpRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateApiKey, checkApiKeyRateLimit, logApiUsage } from "@/lib/api-key";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const authHeader = request.headers.get("authorization");
  
  // Check if using API key
  if (authHeader?.startsWith("Bearer ")) {
    const key = authHeader.slice(7);
    const apiKey = await validateApiKey(key);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }
    
    const allowed = await checkApiKeyRateLimit(apiKey.id, apiKey.userId);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Upgrade your plan for more requests." },
        { status: 429 }
      );
    }
    
    // Process request
    const result = await processConversion(request);
    
    // Log usage
    await logApiUsage(apiKey.userId, "/api/convert", apiKey.id, ip);
    
    return result;
  }
  
  // Landing page demo - IP rate limiting
  const { allowed, remaining } = await checkIpRateLimit(ip);
  
  if (!allowed) {
    return NextResponse.json(
      { 
        error: "Demo rate limit exceeded. Sign up for free to get 100 requests/day.",
        signUp: "/auth/signin"
      },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Limit": "40",
        }
      }
    );
  }
  
  const result = await processConversion(request);
  
  return new NextResponse(result.body, {
    status: result.status,
    headers: {
      ...Object.fromEntries(result.headers),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Limit": "40",
    },
  });
}

async function processConversion(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing 'type' or 'data' in request body" },
        { status: 400 }
      );
    }
    
    if (type === "encode") {
      // Text to Base64
      const encoded = Buffer.from(data).toString("base64");
      return NextResponse.json({ result: encoded, type: "base64" });
    } else if (type === "decode") {
      // Base64 to text
      const decoded = Buffer.from(data, "base64").toString("utf-8");
      return NextResponse.json({ result: decoded, type: "text" });
    } else {
      return NextResponse.json(
        { error: "Invalid type. Use 'encode' or 'decode'" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
