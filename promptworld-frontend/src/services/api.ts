import Taro from '@tarojs/taro'

// API基础配置
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://192.168.31.33:8081/api/v1' 
  : 'http://192.168.31.33:8081/api/v1'

// 请求拦截器
const request = (options: any) => {
  return Taro.request({
    url: `${BASE_URL}${options.url}`,
    method: options.method || 'GET',
    data: options.data,
    header: {
      'Content-Type': 'application/json',
      ...options.header
    }
  }).then(res => {
    if (res.statusCode === 200) {
      return res.data
    } else {
      throw new Error(`请求失败: ${res.statusCode}`)
    }
  }).catch(err => {
    console.error('API请求错误:', err)
    Taro.showToast({
      title: '网络请求失败',
      icon: 'none'
    })
    throw err
  })
}

// 导出具名函数以保持兼容性
export const getPrompts = (params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}) => {
  const query = new URLSearchParams()
  if (params?.category) query.append('category', params.category)
  if (params?.search) query.append('search', params.search)
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  
  const queryString = query.toString()
  return request({
    url: `/prompts${queryString ? `?${queryString}` : ''}`
  })
}

export const getPromptById = (id: string) => {
  return request({
    url: `/prompts/${id}`
  })
}

export const getCategories = () => {
  return request({
    url: '/categories'
  })
}

// API接口定义
export const api = {
  // 获取提示词列表
  getPrompts,
  // 获取单个提示词详情  
  getPromptById,
  // 获取分类列表
  getCategories
}

export default api