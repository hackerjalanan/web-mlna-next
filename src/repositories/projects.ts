// ============================================
// Project Repository
// Handle database operations for projects
// Uses Supabase as the data source
// ============================================

import { createClient, createAdminClient } from "@/lib/supabase/server";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectFilter,
} from "@/types/projects";

export class ProjectRepository {
  private static instance: ProjectRepository;

  private constructor() {}

  public static getInstance(): ProjectRepository {
    if (!ProjectRepository.instance) {
      ProjectRepository.instance = new ProjectRepository();
    }
    return ProjectRepository.instance;
  }

  // Get Supabase client (untuk SELECT queries)
  private async getClient() {
    const supabase = await createClient();
    return supabase;
  }

  // Get Supabase ADMIN client (untuk INSERT/UPDATE/DELETE - bypass RLS)
  private async getAdminClient() {
    const supabase = await createAdminClient();
    return supabase;
  }

  // ============================================
  // CRUD Operations
  // ============================================

  async findAll(): Promise<Project[]> {
    try {
      const supabase = await this.getClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
      return (data as Project[]) || [];
    } catch (error) {
      console.error("ProjectRepository.findAll:", error);
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Project | null> {
    try {
      const supabase = await this.getClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`Failed to fetch project: ${error.message}`);
      }
      return data as Project;
    } catch (error) {
      console.error("ProjectRepository.findBySlug:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Project | null> {
    try {
      const supabase = await this.getClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`Failed to fetch project: ${error.message}`);
      }
      return data as Project;
    } catch (error) {
      console.error("ProjectRepository.findById:", error);
      throw error;
    }
  }

  async create(input: CreateProjectInput): Promise<Project> {
    try {
      const supabase = await this.getAdminClient();
      const { data, error } = await supabase
        .from("projects")
        .insert(input)
        .select("*")
        .single();

      if (error) throw new Error(`Failed to create project: ${error.message}`);
      return data as Project;
    } catch (error) {
      console.error("ProjectRepository.create:", error);
      throw error;
    }
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    try {
      const supabase = await this.getAdminClient();
      const { data, error } = await supabase
        .from("projects")
        .update(input)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw new Error(`Failed to update project: ${error.message}`);
      return data as Project;
    } catch (error) {
      console.error("ProjectRepository.update:", error);
      throw error;
    }
  }

  async updateBySlug(slug: string, input: UpdateProjectInput): Promise<Project> {
    try {
      const supabase = await this.getAdminClient();
      const { data, error } = await supabase
        .from("projects")
        .update(input)
        .eq("slug", slug)
        .select("*")
        .single();

      if (error) throw new Error(`Failed to update project: ${error.message}`);
      return data as Project;
    } catch (error) {
      console.error("ProjectRepository.updateBySlug:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const supabase = await this.getAdminClient();
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw new Error(`Failed to delete project: ${error.message}`);
    } catch (error) {
      console.error("ProjectRepository.delete:", error);
      throw error;
    }
  }

  async deleteBySlug(slug: string): Promise<void> {
    try {
      const supabase = await this.getAdminClient();
      const { error } = await supabase.from("projects").delete().eq("slug", slug);
      if (error) throw new Error(`Failed to delete project: ${error.message}`);
    } catch (error) {
      console.error("ProjectRepository.deleteBySlug:", error);
      throw error;
    }
  }

  // ============================================
  // Filter & Search
  // ============================================

  async findWithFilters(filter: ProjectFilter): Promise<Project[]> {
    try {
      const supabase = await this.getClient();
      let query = supabase.from("projects").select("*");

      if (filter.category && filter.category !== "Semua") {
        query = query.eq("category", filter.category);
      }

      if (filter.search) {
        const searchTerm = `%${filter.search}%`;
        query = query.or(
          `title.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm}`
        );
      }

      if (filter.featured !== undefined) {
        query = query.eq("featured", filter.featured);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw new Error(`Failed to filter projects: ${error.message}`);
      return (data as Project[]) || [];
    } catch (error) {
      console.error("ProjectRepository.findWithFilters:", error);
      throw error;
    }
  }

  async findFeatured(limit: number = 6): Promise<Project[]> {
    try {
      const supabase = await this.getClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw new Error(`Failed to fetch featured projects: ${error.message}`);
      return (data as Project[]) || [];
    } catch (error) {
      console.error("ProjectRepository.findFeatured:", error);
      throw error;
    }
  }

  async count(filter?: ProjectFilter): Promise<number> {
    try {
      const supabase = await this.getClient();
      let query = supabase.from("projects").select("*", { count: "exact", head: true });

      if (filter?.category && filter.category !== "Semua") {
        query = query.eq("category", filter.category);
      }
      if (filter?.featured !== undefined) {
        query = query.eq("featured", filter.featured);
      }

      const { count, error } = await query;
      if (error) throw new Error(`Failed to count projects: ${error.message}`);
      return count || 0;
    } catch (error) {
      console.error("ProjectRepository.count:", error);
      throw error;
    }
  }
}

export const projectRepository = ProjectRepository.getInstance();
