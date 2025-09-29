import { View, Text, ScrollView, Input, Image, RichText } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Prompt } from '../../types'
import './index.scss'
import Taro from '@tarojs/taro'
import { marked } from 'marked'

const Index = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<string[]>(['全部']);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedTags, setExpandedTags] = useState<{[key: string]: boolean}>({});

  // 切换标签展开状态
  const toggleTagsExpansion = (promptId: string) => {
    setExpandedTags(prev => ({
      ...prev,
      [promptId]: !prev[promptId]
    }));
  };

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
    
    // 添加环境检测类
    const envClass = `env-${process.env.TARO_ENV}`;
    
    // 只在H5环境下操作DOM
    if (process.env.TARO_ENV === 'h5') {
      // 为H5环境添加额外的平台检测
      let platformClass = '';
      // 检测是否为移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      platformClass = isMobile ? 'platform-mobile' : 'platform-desktop';
      
      // 添加类到document.documentElement (html元素)
      const htmlElement = document.documentElement;
      htmlElement.classList.add(envClass);
      if (platformClass) {
        htmlElement.classList.add(platformClass);
      }
      
      console.log('H5环境检测:', {
        TARO_ENV: process.env.TARO_ENV,
        envClass,
        platformClass,
        userAgent: navigator.userAgent
      });
    } else {
      // 小程序环境
      console.log('小程序环境检测:', {
        TARO_ENV: process.env.TARO_ENV,
        envClass
      });
    }
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
    // 统一使用Taro的原生图片预览API，支持所有平台
    console.log('当前环境:', process.env.TARO_ENV);
    console.log('点击的图片URL:', imageUrl);
    console.log('所有图片URLs:', allImages);
    
    const urls = allImages || [imageUrl];
    
    // 确保current参数是urls数组中的一个元素
    const currentImage = urls.includes(imageUrl) ? imageUrl : urls[0];
    
    console.log('预览参数:', { current: currentImage, urls });
    
    Taro.previewImage({
      current: currentImage,
      urls: urls
    });
  };


  const openPromptDetail = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    
    // 禁用背景滚动
    if (process.env.TARO_ENV === 'h5') {
      // H5环境下完整禁用body滚动并记录位置
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollTop}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    }
  };

  const closePromptDetailModal = () => {
    setSelectedPrompt(null);
    
    // 恢复背景滚动
    if (process.env.TARO_ENV === 'h5') {
      // H5环境下恢复body滚动和位置
      const top = parseInt(document.body.style.top || '0', 10) || 0;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, -top);
    }
  };

  const scrollToTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  };

  // 解析Markdown内容
  const parseMarkdown = (content: string): string => {
    try {
      // 配置marked选项
      marked.setOptions({
        breaks: true, // 支持换行
        gfm: true,    // 支持GitHub风格的Markdown
      });
      
      // 解析Markdown并返回HTML字符串
      const html = marked.parse(content);
      return typeof html === 'string' ? html : String(html);
    } catch (error) {
      console.error('Markdown解析失败:', error);
      // 如果解析失败，返回原始内容并转换换行符
      return content.replace(/\n/g, '<br/>');
    }
  };



  return (
    <View className={`index env-${process.env.TARO_ENV}`}>
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
                <ScrollView 
                  className='dropdown-content'
                  scrollY
                  style={{
                    maxHeight: '400rpx'
                  }}
                >
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
                </ScrollView>
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
                  {(expandedTags[prompt.id] ? prompt.tags : prompt.tags.slice(0, 3)).map((tag, index) => (
                    <Text key={index} className='hashtag-item'>#{tag}</Text>
                  ))}
                  {prompt.tags.length > 3 && (
                    <Text 
                      className='more-hashtags'
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTagsExpansion(prompt.id);
                      }}
                    >
                      {expandedTags[prompt.id] ? '收起' : `+${prompt.tags.length - 3}`}
                    </Text>
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
                {prompt.content.length > 150 
                  ? `${prompt.content.substring(0, 150)}...` 
                  : prompt.content
                }
              </View>

              <View className='prompt-meta'>
                
                <View className='prompt-stats'>
                  {/* 
                  <Text className='stat-item'>👍 {prompt.likes}</Text>
                  <Text className='stat-item'>💬 {prompt.comments}</Text>
                  <Text className='stat-item'>⭐ {prompt.rating}</Text>
                  */}
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





      {/* 提示词详情模态框 */}
      {selectedPrompt && (
        <View 
          className='prompt-detail-modal' 
          onClick={closePromptDetailModal}
          catchMove={process.env.TARO_ENV !== 'h5'} // 小程序环境下阻止滚动穿透
        >
          <View className='prompt-detail-content' onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <View className='close-modal' onClick={closePromptDetailModal}>×</View>
            
            {/* 标题区域 */}
            <View className='prompt-detail-header'>
              <Text className='modal-prompt-title'>{selectedPrompt.title}</Text>
              <View className='modal-prompt-description'>
                <RichText 
                  nodes={parseMarkdown(selectedPrompt.description)} 
                  className='description-rich-text'
                />
              </View>
              
              {/* 统计信息 - 暂时注释，后续再加 */}
              {/* 
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
              */}
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
                  <View className='content-wrapper'>
                    <RichText 
                      nodes={parseMarkdown(selectedPrompt.content.trim())} 
                      className='content-rich-text'
                    />
                  </View>
                </ScrollView>
              </View>
              
              {/* 使用说明 */}
              {/* <View className='usage-section'>
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
              </View> */}
            </View>

            {/* 底部操作区 */}
            <View className='detail-footer'>
              <View className='action-buttons'>
                {/* 
                <View className='action-btn favorite-btn'>
                  <Text className='btn-icon'>❤️</Text>
                  <Text className='btn-text'>收藏</Text>
                </View>
                 */}
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