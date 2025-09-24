export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  published: boolean;
  author: string;
  tags: string[];
  createdAt: string;
}
