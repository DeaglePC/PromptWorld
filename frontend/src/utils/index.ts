import Taro from '@tarojs/taro'

// 复制文本到剪贴板
export const copyToClipboard = (text: string) => {
  return Taro.setClipboardData({
    data: text
  }).then(() => {
    Taro.showToast({
      title: '复制成功',
      icon: 'success'
    })
  }).catch(() => {
    Taro.showToast({
      title: '复制失败',
      icon: 'none'
    })
  })
}

// 格式化时间显示
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 30) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 防抖函数
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}