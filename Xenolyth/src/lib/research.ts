export interface ResearchPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  slug: string;
}

export const researchPosts: ResearchPost[] = [];
