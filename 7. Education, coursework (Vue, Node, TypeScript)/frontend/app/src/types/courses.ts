export interface CoursePayload {
  title: string
  description?: string
  price: number
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  published: boolean
  tags: string[]
  image?: File
}
