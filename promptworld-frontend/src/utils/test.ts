// 测试API连接的工具函数
export const testApiConnection = async () => {
  try {
    const response = await fetch('http://localhost:8081/')
    const data = await response.json()
    console.log('API连接测试成功:', data)
    return true
  } catch (error) {
    console.error('API连接测试失败:', error)
    return false
  }
}

// 测试获取提示词列表
export const testGetPrompts = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/v1/prompts')
    const data = await response.json()
    console.log('获取提示词列表测试:', data)
    return data
  } catch (error) {
    console.error('获取提示词列表失败:', error)
    return null
  }
}

// 测试获取分类
export const testGetCategories = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/v1/categories')
    const data = await response.json()
    console.log('获取分类测试:', data)
    return data
  } catch (error) {
    console.error('获取分类失败:', error)
    return null
  }
}