import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let profile = await prisma.profile.findUnique({
      where: { id: "user-1" },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          id: "user-1",
          level: 1,
          overallScore: 0,
          gold: 0,
          goalsScore: 0,
          timeScore: 0,
          healthScore: 0,
          relationScore: 0,
          financeScore: 0,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const profile = await prisma.profile.update({
      where: { id: "user-1" },
      data,
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
