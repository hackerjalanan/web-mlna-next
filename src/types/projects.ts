// ============================================
// Project Types (Schemas)
// ============================================
export type SortOption = "newest" | "oldest" | "name";

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  year: string | null;
  description: string | null;
  technologies: string[];
  image: string | null;
  link: string | null;
  github: string | null;
  demo: string | null;
  featured: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}


export interface CreateProjectInput {
  title: string;
  slug: string;
  category?: string;
  year?: string;
  description?: string;
  technologies?: string[];
  image?: string;
  link?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
}

export interface UpdateProjectInput {
  title?: string;
  slug?: string;
  category?: string;
  year?: string;
  description?: string;
  technologies?: string[];
  image?: string;
  link?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
}

export interface ProjectFilter {
  category?: string;
  search?: string;
  featured?: boolean;
}

export interface ProjectSort {
  by: "newest" | "oldest" | "name";
}

// Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
