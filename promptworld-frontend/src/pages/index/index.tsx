import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Prompt } from '../../types'
import './index.scss'
import Taro from '@tarojs/taro'

const Index = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<string[]>(['全部']);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // API基础URL
  const API_BASE_URL = 'http://192.168.31.33:8081/api/v1';

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await Taro.request({
        url: `${API_BASE_URL}/categories`,
        method: 'GET',
      });
      
      if (response.data.success) {
        setCategories(['全部', ...response.data.data]);
      } else {
        console.error('获取分类失败:', response.data.message);
        Taro.showToast({
          title: '获取分类失败',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('获取分类失败:', error);
      Taro.showToast({
        title: '网络错误，获取分类失败',
        icon: 'error'
      });
      // 网络错误时保持默认的"全部"分类
    }
  };

  // 获取提示词列表
  const fetchPrompts = async (category: string = '全部') => {
    setLoading(true);
    try {
      const params: any = {
        page: 1,
        limit: 50
      };
      
      if (category !== '全部') {
        params.category = category;
      }

      const response = await Taro.request({
        url: `${API_BASE_URL}/prompts`,
        method: 'GET',
        data: params,
      });
      
      if (response.data.success) {
        setPrompts(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('获取提示词失败:', error);
      Taro.showToast({
        title: '获取数据失败',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    
    // 添加环境检测类到body
    const envClass = `env-${process.env.TARO_ENV}`;
    
    // 为H5环境添加额外的平台检测
    let platformClass = '';
    if (process.env.TARO_ENV === 'h5') {
      // 检测是否为移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      platformClass = isMobile ? 'platform-mobile' : 'platform-desktop';
    }
    
    // 添加类到document.documentElement (html元素)
    const htmlElement = document.documentElement;
    htmlElement.classList.add(envClass);
    if (platformClass) {
      htmlElement.classList.add(platformClass);
    }
    
    console.log('环境检测:', {
      TARO_ENV: process.env.TARO_ENV,
      envClass,
      platformClass,
      userAgent: navigator.userAgent
    });
  }, []);

  useEffect(() => {
    fetchPrompts(activeCategory);
  }, [activeCategory]);

  const copyToClipboard = (text: string) => {
    Taro.setClipboardData({
      data: text,
      success: () => Taro.showToast({ title: '已复制', icon: 'success' })
    });
  };

  const openImageModal = (imageUrl: string, allImages?: string[]) => {
    // 检查当前环境，小程序使用原生API，H5/PC使用自定义模态框
    console.log('当前环境:', process.env.TARO_ENV);
    console.log('点击的图片URL:', imageUrl);
    console.log('所有图片URLs:', allImages);
    
    if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay' || process.env.TARO_ENV === 'swan') {
      // 小程序环境使用原生图片预览
      const urls = allImages || [imageUrl];
      
      // 确保current参数是urls数组中的一个元素
      const currentImage = urls.includes(imageUrl) ? imageUrl : urls[0];
      
      console.log('预览参数:', { current: currentImage, urls });
      
      Taro.previewImage({
        current: currentImage,
        urls: urls
      });
    } else {
      // H5/PC环境使用自定义模态框
      console.log('设置图片URL:', imageUrl);
      setSelectedImage(imageUrl);
    }
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const openPromptDetail = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  const closePromptDetailModal = () => {
    setSelectedPrompt(null);
  };

  const scrollToTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  };

  return (
    <View className='index'>
      {/* 顶部导航栏 */}
      <View className='navbar'>
        <View className='nav-container'>
          <Text className='logo'>🌟 PromptWorld</Text>
          <View className='search-container'>
            <Text className='search-icon'>🔍</Text>
            <Input 
              type='text' 
              className='search-box' 
              placeholder='搜索AI提示词...' 
              id='searchInput'
            />
          </View>
        </View>
      </View>

      {/* 主容器 - 包含分类导航和内容区 */}
      <View className='main-container'>
        {/* 分类导航 */}
        <View className='category-nav'>
          <Text className='category-title'>📂 浏览分类</Text>
          
          {/* 桌面端横向标签 */}
          <View className='category-tags desktop-only'>
            {categories.map(cat => (
              <Text
                key={cat}
                className={`category-tag ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Text>
            ))}
          </View>
          
          {/* 移动端下拉按钮 */}
          <View className='category-dropdown mobile-only'>
            <View 
              className='dropdown-trigger'
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text className='current-category'>{activeCategory}</Text>
              <Text className='dropdown-arrow'>{showCategoryDropdown ? '▲' : '▼'}</Text>
            </View>
            
            {showCategoryDropdown && (
              <View 
                className='dropdown-menu'
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  zIndex: 9999
                }}
              >
                <View className='dropdown-content'>
                  {categories.map(cat => (
                    <View
                      key={cat}
                      className={`dropdown-item ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => {
                        setActiveCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text className='dropdown-text'>{cat}</Text>
                      {activeCategory === cat && <Text className='check-icon'>✓</Text>}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 主内容区 */}
        <View className='main-content'>
        {loading && (
          <View className='loading-container'>
            <Text>正在加载...</Text>
          </View>
        )}
        <View className='prompts-grid'>
          {prompts.map(prompt => (
            <View 
              key={prompt.id} 
              className='prompt-card'
              onClick={() => openPromptDetail(prompt)}
            >
              {/* 标题 */}
              <Text className='prompt-title'>{prompt.title}</Text>
              <Text className='prompt-description'>{prompt.description}</Text>
              
              {/* 主标签区域 */}
              <View className='primary-label'>
                <Text className='category-label'>{prompt.category}</Text>
                {prompt.type && <Text className='type-label'>{prompt.type}</Text>}
              </View>
              
              {/* #标签区域 */}
              {prompt.tags && prompt.tags.length > 0 && (
                <View className='hashtags-container'>
                  {prompt.tags.slice(0, 3).map((tag, index) => (
                    <Text key={index} className='hashtag-item'>#{tag}</Text>
                  ))}
                  {prompt.tags.length > 3 && (
                    <Text className='more-hashtags'>+{prompt.tags.length - 3}</Text>
                  )}
                </View>
              )}

              {/* 图片预览区 */}
              {prompt.preview_images && prompt.preview_images.length > 0 && (
                <View className='preview-section'>
                  <View className='preview-label'>
                    <Text>🖼️ 效果预览</Text>
                  </View>
                  <View className='preview-images'>
                    {prompt.preview_images.map((img, index) => (
                      <Image 
                        key={index} 
                        src={img} 
                        className='preview-image loading' 
                        mode='aspectFill'
                        onLoad={() => {
                          // 图片加载成功，小程序中不需要手动操作DOM
                        }}
                        onError={() => {
                          // 图片加载失败，小程序中不需要手动操作DOM
                          console.log('图片加载失败');
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageModal(img, prompt.preview_images);
                        }}
                      />
                    ))}
                  </View>
                </View>
              )}
              
              <View className='prompt-content'>
                {prompt.content}
              </View>

              <View className='prompt-meta'>
                <View className='prompt-stats'>
                  <Text className='stat-item'>👍 {prompt.likes}</Text>
                  <Text className='stat-item'>💬 {prompt.comments}</Text>
                  <Text className='stat-item'>⭐ {prompt.rating}</Text>
                </View>
                <View
                  className='btn copy-btn'
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(prompt.content);
                  }}
                >
                  📋 复制
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 主容器结束 */}
      </View>

      {/* 浮动操作按钮 */}
      <View className='fab' onClick={scrollToTop}>
        ↑
      </View>



      {/* H5/PC模式图片模态框 */}
      {selectedImage && (
        <View className='image-modal' onClick={closeImageModal}>
          <View className='modal-content' onClick={closeImageModal}>
            <Image 
              src={selectedImage} 
              className='modal-image' 
              mode='aspectFill'
              onLoad={() => console.log('H5图片加载成功:', selectedImage)}
              onError={(e) => console.log('H5图片加载失败:', e, selectedImage)}
              onClick={closeImageModal}
              style={{
                width: '80vw',
                height: '70vh',
                maxWidth: '800px',
                maxHeight: '600px',
                minWidth: '400px',
                minHeight: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer'
              }}
            />
          </View>
        </View>
      )}

      {/* 提示词详情模态框 */}
      {selectedPrompt && (
        <View className='prompt-detail-modal' onClick={closePromptDetailModal}>
          <View className='prompt-detail-content' onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <View className='close-modal' onClick={closePromptDetailModal}>×</View>
            
            {/* 标题区域 */}
            <View className='prompt-detail-header'>
              <Text className='modal-prompt-title'>{selectedPrompt.title}</Text>
              <Text className='modal-prompt-description'>{selectedPrompt.description}</Text>
            </View>

            {/* 内容区域 */}
            <View className='detail-body'>
              {/* 图片预览区 */}
              {selectedPrompt.preview_images && selectedPrompt.preview_images.length > 0 && (
                <View className='preview-section'>
                  <View className='section-header'>
                    <Text className='section-icon'>🖼️</Text>
                    <Text className='section-title'>效果预览</Text>
                  </View>
                  <View className='preview-gallery'>
                    {selectedPrompt.preview_images.map((img, index) => (
                      <Image 
                        key={index} 
                        src={img} 
                        className='gallery-image' 
                        mode='aspectFill'
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageModal(img, selectedPrompt.preview_images);
                        }}
                      />
                    ))}
                  </View>
                </View>
              )}
              
              {/* 完整提示词 */}
              <View className='content-section'>
                <View className='section-header'>
                  <Text className='section-icon'>📝</Text>
                  <Text className='section-title'>完整提示词</Text>
                </View>
                <ScrollView className='content-scroll' scrollY>
                  <Text className='content-text'>{selectedPrompt.content}</Text>
                </ScrollView>
              </View>

              {/* 使用说明 */}
              <View className='usage-section'>
                <View className='section-header'>
                  <Text className='section-icon'>💡</Text>
                  <Text className='section-title'>使用说明</Text>
                </View>
                <View className='usage-steps'>
                  <View className='usage-step'>
                    <Text className='step-number'>1.</Text>
                    <Text className='step-text'>复制上方的提示词内容</Text>
                  </View>
                  <View className='usage-step'>
                    <Text className='step-number'>2.</Text>
                    <Text className='step-text'>根据您的具体需求替换方括号中的占位符</Text>
                  </View>
                  <View className='usage-step'>
                    <Text className='step-number'>3.</Text>
                    <Text className='step-text'>将完整的提示词输入到AI助手中</Text>
                  </View>
                  <View className='usage-step'>
                    <Text className='step-number'>4.</Text>
                    <Text className='step-text'>根据生成结果进行微调优化</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 底部操作区 */}
            <View className='detail-footer'>
              <View className='stats-row'>
                <View className='stat-item'>
                  <Text className='stat-icon'>🔥</Text>
                  <Text className='stat-value'>{selectedPrompt.likes}</Text>
                </View>
                <View className='stat-item'>
                  <Text className='stat-icon'>💬</Text>
                  <Text className='stat-value'>{selectedPrompt.comments}</Text>
                </View>
                <View className='stat-item'>
                  <Text className='stat-icon'>⭐</Text>
                  <Text className='stat-value'>{selectedPrompt.rating}</Text>
                </View>
              </View>
              <View className='action-buttons'>
                <View className='action-btn favorite-btn'>
                  <Text className='btn-icon'>❤️</Text>
                  <Text className='btn-text'>收藏</Text>
                </View>
                <View 
                  className='action-btn copy-btn'
                  onClick={() => copyToClipboard(selectedPrompt.content)}
                >
                  <Text className='btn-icon'>📋</Text>
                  <Text className='btn-text'>复制提示词</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default Index;