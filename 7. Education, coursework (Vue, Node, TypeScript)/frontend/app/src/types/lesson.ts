// src/types/lesson.ts

export interface ILesson {
  _id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  course: string;
  order?: number;
  createdAt: string;
}
