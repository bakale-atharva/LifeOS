import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const quests = await prisma.quest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quest = await prisma.quest.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type || "SIDE",
        difficulty: body.difficulty || 1,
        antiGoals: body.antiGoals,
        milestones: body.milestones || [],
        preMortem: body.preMortem,
        dailyAction: body.dailyAction,
        totalHp: body.totalHp || 100,
        currentHp: body.totalHp || 100,
      },
    });
    return NextResponse.json(quest);
  } catch (error) {
    console.error("POST Quest Error:", error);
    return NextResponse.json({ error: "Failed to create quest" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    
    // If quest is being completed, update the user profile score
    if (updates.status === "COMPLETED" || (updates.currentHp !== undefined && updates.currentHp <= 0)) {
      const quest = await prisma.quest.findUnique({ where: { id } });
      if (quest && quest.status !== "COMPLETED") {
        const reward = quest.type === "BOSS" ? 10 : 2; // Fixed rewards for now
        const profile = await prisma.profile.findUnique({ where: { id: "user-1" } });
        if (profile) {
          await prisma.profile.update({
            where: { id: "user-1" },
            data: { 
              goalsScore: Math.min(100, profile.goalsScore + reward),
              gold: profile.gold + (reward * 50)
            }
          });
        }
        updates.status = "COMPLETED";
        updates.currentHp = 0;
        updates.completedAt = new Date();
      }
    }

    const quest = await prisma.quest.update({
      where: { id },
      data: updates,
    });
    return NextResponse.json(quest);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update quest" }, { status: 500 });
  }
}
