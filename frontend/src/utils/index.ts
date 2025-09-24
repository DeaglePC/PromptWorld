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

// 格式化数字显示
export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
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

// 获取图片占位符
export const getImagePlaceholder = (index: number = 0): string => {
  const colors = [
    '#9acd32', '#6b8e23', '#adff2f', '#32cd32', 
    '#7cfc00', '#00ff7f', '#90ee90', '#98fb98'
  ]
  const color = colors[index % colors.length]
  
  // 返回一个简单的SVG占位符
  const svg = `data:image/svg+xml;base64,${btoa(`
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#grad)" />
      <text x="150" y="130" font-family="Arial" font-size="48" fill="white" text-anchor="middle">🎨</text>
      <text x="150" y="180" font-family="Arial" font-size="16" fill="white" text-anchor="middle">示例图片</text>
    </svg>
  `)}`
  
  return svg
}