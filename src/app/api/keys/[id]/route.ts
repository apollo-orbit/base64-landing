import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  // Verify the API key belongs to the user
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: params.id },
  });
  
  if (!apiKey || apiKey.userId !== user.id) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }
  
  await prisma.apiKey.delete({
    where: { id: params.id },
  });
  
  return NextResponse.json({ success: true });
}
