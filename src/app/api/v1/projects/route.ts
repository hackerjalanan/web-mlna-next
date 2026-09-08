// ============================================
// Projects API Route
// Handles all project-related API requests
// ============================================

import { NextResponse } from "next/server";
import { projectService } from "@/services/projects.service";
import type { CreateProjectInput } from "@/types/projects";

// ============================================
// GET /api/v1/projects - Get all projects
// ============================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const sortBy = searchParams.get("sort") as "newest" | "oldest" | "name" | null;

    const filter = {
      category: category || undefined,
      search: search || undefined,
      featured: featured ? featured === "true" : undefined,
    };

    const projects = await projectService.getProjects(filter, sortBy || "newest");

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/v1/projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/v1/projects - Create new project
// ============================================
export async function POST(request: Request) {
  try {
    const body: CreateProjectInput = await request.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const project = await projectService.createProject(body);

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/v1/projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: error.message?.includes("already exists") ? 409 : 500 }
    );
  }
}