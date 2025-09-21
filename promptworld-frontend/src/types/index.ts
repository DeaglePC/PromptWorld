// 提示词数据类型
export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  type?: string
  tags?: string[]
  preview_images?: string[]
  images?: string[]  // 兼容模拟数据
  usage?: string
  likes?: number
  comments?: number
  rating?: number
  views?: number
  created_at?: string
  updated_at?: string
}

// 分类数据类型
export interface Category {
  id: string
  name: string
}

// API响应类型
export interface PromptResponse {
  success: boolean
  message: string
  data: Prompt[]
  total: number
}

export interface PromptDetailResponse {
  success: boolean
  message: string
  data: Prompt
}

export interface CategoryResponse {
  success: boolean
  message: string
  data: string[]
}

// 组件Props类型
export interface PromptCardProps {
  prompt: Prompt
  onCardClick?: (prompt: Prompt) => void
}

export interface SearchBarProps {
  value: string
  onSearch: (value: string) => void
  placeholder?: string
}

export interface CategoryNavProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}