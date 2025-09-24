// src/types/enrollment.ts

export interface IEnrollment {
  _id: string;
  user: string;
  course: string;
  completedLessons: string[];
  progress: number;
  createdAt: string;
}
