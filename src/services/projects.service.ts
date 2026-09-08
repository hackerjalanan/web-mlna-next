// ============================================
// Project Service
// Business logic layer for projects
// ============================================

import { projectRepository } from "@/repositories/projects.repository";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectFilter,
} from "@/types/projects";

export class ProjectService {
  private static instance: ProjectService;

  private constructor() {}

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  // ============================================
  // Core Operations
  // ============================================

  async getAllProjects(): Promise<Project[]> {
    try {
      return await projectRepository.findAll();
    } catch (error) {
      console.error("ProjectService.getAllProjects:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      return await projectRepository.findBySlug(slug);
    } catch (error) {
      console.error("ProjectService.getProjectBySlug:", error);
      throw new Error("Failed to fetch project");
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      return await projectRepository.findById(id);
    } catch (error) {
      console.error("ProjectService.getProjectById:", error);
      throw new Error("Failed to fetch project");
    }
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    try {
      if (!input.title || !input.slug) {
        throw new Error("Title and slug are required");
      }

      const existing = await projectRepository.findBySlug(input.slug);
      if (existing) {
        throw new Error(`Project with slug '${input.slug}' already exists`);
      }

      return await projectRepository.create(input);
    } catch (error) {
      console.error("ProjectService.createProject:", error);
      throw error;
    }
  }

  async updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
    try {
      const existing = await projectRepository.findById(id);
      if (!existing) {
        throw new Error(`Project with id '${id}' not found`);
      }

      if (input.slug && input.slug !== existing.slug) {
        const existingSlug = await projectRepository.findBySlug(input.slug);
        if (existingSlug) {
          throw new Error(`Project with slug '${input.slug}' already exists`);
        }
      }

      return await projectRepository.update(id, input);
    } catch (error) {
      console.error("ProjectService.updateProject:", error);
      throw error;
    }
  }

  async updateProjectBySlug(slug: string, input: UpdateProjectInput): Promise<Project> {
    try {
      const existing = await projectRepository.findBySlug(slug);
      if (!existing) {
        throw new Error(`Project with slug '${slug}' not found`);
      }

      if (input.slug && input.slug !== existing.slug) {
        const existingSlug = await projectRepository.findBySlug(input.slug);
        if (existingSlug) {
          throw new Error(`Project with slug '${input.slug}' already exists`);
        }
      }

      return await projectRepository.updateBySlug(slug, input);
    } catch (error) {
      console.error("ProjectService.updateProjectBySlug:", error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const existing = await projectRepository.findById(id);
      if (!existing) {
        throw new Error(`Project with id '${id}' not found`);
      }
      await projectRepository.delete(id);
    } catch (error) {
      console.error("ProjectService.deleteProject:", error);
      throw error;
    }
  }

  async deleteProjectBySlug(slug: string): Promise<void> {
    try {
      const existing = await projectRepository.findBySlug(slug);
      if (!existing) {
        throw new Error(`Project with slug '${slug}' not found`);
      }
      await projectRepository.deleteBySlug(slug);
    } catch (error) {
      console.error("ProjectService.deleteProjectBySlug:", error);
      throw error;
    }
  }

  // ============================================
  // Query Operations
  // ============================================

  async getProjects(
    filter: ProjectFilter = {},
    sortBy: "newest" | "oldest" | "name" = "newest"
  ): Promise<Project[]> {
    try {
      let projects = await projectRepository.findWithFilters(filter);
      projects = this.sortProjects(projects, sortBy);
      return projects;
    } catch (error) {
      console.error("ProjectService.getProjects:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  async getFeaturedProjects(limit: number = 6): Promise<Project[]> {
    try {
      return await projectRepository.findFeatured(limit);
    } catch (error) {
      console.error("ProjectService.getFeaturedProjects:", error);
      throw new Error("Failed to fetch featured projects");
    }
  }

  async getProjectsCount(filter?: ProjectFilter): Promise<number> {
    try {
      return await projectRepository.count(filter);
    } catch (error) {
      console.error("ProjectService.getProjectsCount:", error);
      throw new Error("Failed to count projects");
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const projects = await projectRepository.findAll();
      const categories = new Set<string>();
      projects.forEach((p) => {
        if (p.category) categories.add(p.category);
      });
      return Array.from(categories).sort();
    } catch (error) {
      console.error("ProjectService.getCategories:", error);
      throw new Error("Failed to fetch categories");
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  private sortProjects(projects: Project[], sortBy: "newest" | "oldest" | "name"): Project[] {
    return [...projects].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          const aYear = Number(a.year) || 0;
          const bYear = Number(b.year) || 0;
          return bYear - aYear;
        case "oldest":
          const aYearOld = Number(a.year) || 0;
          const bYearOld = Number(b.year) || 0;
          return aYearOld - bYearOld;
        case "name":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });
  }
}

export const projectService = ProjectService.getInstance();
