// ============================================
// Projects Categories API Route
// Returns list of unique categories from projects
// ============================================

import { NextResponse } from "next/server";
import { projectService } from "@/services/projects.service";

// ============================================
// GET /api/v1/projects/categories - Get all unique categories
// ============================================
export async function GET() {
  try {
    const categories = await projectService.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/v1/projects/categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
