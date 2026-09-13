import { NextRequest, NextResponse } from "next/server";

interface StudyPlanRequest {
  courseCode: string;
  courseTitle: string;
  examDate: string;
  availableHoursPerDay: number;
  preferredDurationMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  topics: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: StudyPlanRequest = await req.json();
    const {
      courseCode,
      courseTitle,
      examDate,
      availableHoursPerDay = 3,
      preferredDurationMinutes = 45,
      difficulty = "Hard",
      topics = [],
    } = body;

    if (!courseTitle) {
      return NextResponse.json({ error: "Course is required" }, { status: 400 });
    }

    // Default topics if none provided
    const planTopics =
      topics.length > 0
        ? topics
        : [
            "Core Theoretical Concepts",
            "Foundational Principles & Architecture",
            "Algorithmic Derivations & Logic",
            "Practical Problem Solving",
            "Midterm Mock Examination",
            "Final Weak Areas Review",
          ];

    // Calculate days until exam
    const today = new Date();
    const targetDate = examDate ? new Date(examDate) : new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dayDiff = Math.max(
      3,
      Math.min(14, Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
    );

    const taskTypes = [
      "Read Topic",
      "Watch Learning Material",
      "Practice Problems",
      "Review Notes",
      "Take Quiz",
      "Revise Weak Areas",
      "Mock Examination",
    ] as const;

    const tasks = planTopics.slice(0, dayDiff).map((topic, idx) => {
      const dayNum = idx + 1;
      const taskDate = new Date(today.getTime() + idx * 24 * 60 * 60 * 1000);
      const scheduledDate = taskDate.toISOString().split("T")[0];

      let taskType: typeof taskTypes[number] = "Read Topic";
      if (dayNum === 1) taskType = "Read Topic";
      else if (dayNum === 2) taskType = "Watch Learning Material";
      else if (dayNum === 3) taskType = "Practice Problems";
      else if (dayNum === dayDiff - 1) taskType = "Mock Examination";
      else if (dayNum === dayDiff) taskType = "Revise Weak Areas";
      else if (dayNum % 2 === 0) taskType = "Practice Problems";
      else taskType = "Review Notes";

      const durationMinutes = Math.min(180, Math.max(60, availableHoursPerDay * 45));

      return {
        id: `task-${Date.now()}-${idx}`,
        planId: `plan-${Date.now()}`,
        dayNumber: dayNum,
        dayLabel: `Day ${dayNum}`,
        title: `${taskType}: ${topic}`,
        topic,
        taskType,
        durationMinutes,
        completed: false,
        scheduledDate,
        notes: `Focus on mastering key formulas and past Iqra University exam questions. Estimated study time: ${(durationMinutes / 60).toFixed(1)} hours.`,
      };
    });

    const newPlan = {
      id: `plan-${Date.now()}`,
      courseCode: courseCode || "CS-201",
      courseTitle,
      examDate: targetDate.toISOString().split("T")[0],
      availableHoursPerDay,
      preferredDurationMinutes,
      difficulty,
      topics: planTopics,
      createdAt: new Date().toISOString().split("T")[0],
      totalHours: tasks.reduce((acc, t) => acc + t.durationMinutes / 60, 0),
      tasks,
    };

    return NextResponse.json({ plan: newPlan });
  } catch (error: any) {
    console.error("Study Planner API error:", error);
    return NextResponse.json({ error: "Failed to generate study plan" }, { status: 500 });
  }
}
