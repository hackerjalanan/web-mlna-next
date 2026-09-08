import { NextResponse } from "next/server";
import { projectService } from "@/services/projects";
import type { UpdateProjectInput } from "@/types/projects";

// GET /api/v1/projects/[slug] - Get project by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const project = await projectService.getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`GET /api/v1/projects/${slug}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/projects/[slug] - Update project by slug
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body: UpdateProjectInput = await request.json();
    const project = await projectService.updateProjectBySlug(slug, body);

    return NextResponse.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    console.error(`PATCH /api/v1/projects/${slug}:`, error);
    
    return NextResponse.json(
      { error: message },
      { status: message.includes("not found") ? 404 : 500 }
    );
  }
}

// DELETE /api/v1/projects/[slug] - Delete project by slug
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await projectService.deleteProjectBySlug(slug);

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    console.error(`DELETE /api/v1/projects/${slug}:`, error);
    
    return NextResponse.json(
      { error: message },
      { status: message.includes("not found") ? 404 : 500 }
    );
  }
}