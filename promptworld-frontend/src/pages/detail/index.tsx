import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { getPromptById } from '../../services/api'
import { Prompt } from '../../types'
import { copyToClipboard, formatNumber, getImagePlaceholder } from '../../utils'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({})

  useLoad(() => {
    const { id } = router.params
    if (id) {
      loadPromptDetail(id)
    }
  })

  const loadPromptDetail = async (id: string) => {
    setLoading(true)
    try {
      const response = await getPromptById(id)
      if (response.success) {
        setPrompt(response.data)
      } else {
        Taro.showToast({
          title: '提示词不存在',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    } catch (error) {
      console.error('加载提示词详情失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (prompt) {
      copyToClipboard(prompt.content)
    }
  }

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }))
  }

  const getImageSrc = (src: string, index: number) => {
    return imageError[index] ? getImagePlaceholder(index) : src
  }

  const handleBack = () => {
    Taro.navigateBack()
  }

  if (loading) {
    return (
      <View className='detail loading-container'>
        <View className='loading-text'>加载中...</View>
      </View>
    )
  }

  if (!prompt) {
    return (
      <View className='detail error-container'>
        <View className='error-text'>提示词不存在</View>
      </View>
    )
  }

  return (
    <View className='detail'>
      {/* 自定义导航栏 */}
      <View className='custom-navbar'>
        <View className='nav-back' onClick={handleBack}>
          ← 返回
        </View>
        <View className='nav-title'>提示词详情</View>
        <View className='nav-placeholder'></View>
      </View>

      <ScrollView className='detail-content' scrollY>
        {/* 头部信息 */}
        <View className='detail-header'>
          <View className='prompt-type'>{prompt.type}</View>
          <Text className='prompt-title'>{prompt.title}</Text>
          <Text className='prompt-description'>{prompt.description}</Text>
        </View>

        {/* 预览图片 */}
        {prompt.preview_images && prompt.preview_images.length > 0 && (
          <View className='preview-section'>
            <View className='section-title'>🖼️ 效果预览</View>
            <View className='preview-images'>
              {prompt.preview_images.map((image, index) => (
                <Image
                  key={index}
                  className='preview-image'
                  src={getImageSrc(image, index)}
                  mode='aspectFill'
                  onError={() => handleImageError(index)}
                />
              ))}
            </View>
          </View>
        )}

        {/* 提示词内容 */}
        <View className='content-section'>
          <View className='section-title'>📝 完整提示词</View>
          <View className='prompt-content'>
            {prompt.content}
          </View>
        </View>

        {/* 使用说明 */}
        <View className='usage-section'>
          <View className='section-title'>💡 使用说明</View>
          <View className='prompt-usage'>
            {prompt.usage || (
              <>
                <Text className='usage-item'>1. 复制上方的提示词内容</Text>
                <Text className='usage-item'>2. 根据您的具体需求替换方括号中的占位符</Text>
                <Text className='usage-item'>3. 将完整的提示词输入到AI助手中</Text>
                <Text className='usage-item'>4. 根据生成结果进行微调优化</Text>
              </>
            )}
          </View>
        </View>

        {/* 统计信息和操作 */}
        <View className='detail-footer'>
          <View className='footer-horizontal-layout'>
            <View className='stats-left'>
              <Text className='stat-item'>👍 {formatNumber(prompt.likes || 0)}</Text>
              <Text className='stat-item'>💬 {formatNumber(prompt.comments || 0)}</Text>
              <Text className='stat-item'>⭐ {(prompt.rating || 0).toFixed(1)}</Text>
            </View>
            
            <View className='buttons-right'>
              <View className='btn btn-secondary'>❤️ 收藏</View>
              <View className='btn btn-primary' onClick={handleCopy}>
                📋 复制提示词
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}