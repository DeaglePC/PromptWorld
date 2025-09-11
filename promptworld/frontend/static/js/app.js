// 全局变量
let currentPage = 1;
let currentCategory = '全部';
let currentSearch = '';
let isLoading = false;
let hasMore = true;

// API基础URL
const API_BASE_URL = '/api/v1';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    loadCategories();
    loadPrompts();
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearch = e.target.value.trim();
            resetAndLoadPrompts();
        }, 500);
    });

    // 加载更多按钮
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePrompts);
    }

    // 模态框事件
    setupModalEvents();
}

// 设置模态框事件
function setupModalEvents() {
    // 图片模态框
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageModal();
            }
        });
    }

    // 详情模态框
    const promptDetailModal = document.getElementById('promptDetailModal');
    if (promptDetailModal) {
        promptDetailModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePromptDetailModal();
            }
        });
    }

    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
            closePromptDetailModal();
        }
    });
}

// 加载分类
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        
        if (data.success && data.data) {
            renderCategories(data.data);
        }
    } catch (error) {
        console.error('加载分类失败:', error);
    }
}

// 渲染分类
function renderCategories(categories) {
    const categoryTags = document.getElementById('categoryTags');
    if (!categoryTags) return;

    // 保留"全部"标签
    const allTag = categoryTags.querySelector('.category-tag[data-category="全部"]');
    categoryTags.innerHTML = '';
    if (allTag) {
        categoryTags.appendChild(allTag);
    }

    // 添加其他分类
    categories.forEach(category => {
        if (category && category !== '全部') {
            const tag = createCategoryTag(category);
            categoryTags.appendChild(tag);
        }
    });
}

// 创建分类标签
function createCategoryTag(category) {
    const tag = document.createElement('a');
    tag.href = '#';
    tag.className = 'category-tag';
    tag.setAttribute('data-category', category);
    tag.textContent = category;
    
    tag.addEventListener('click', function(e) {
        e.preventDefault();
        selectCategory(category);
    });
    
    return tag;
}

// 选择分类
function selectCategory(category) {
    // 更新活动状态
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.classList.remove('active');
    });
    
    const selectedTag = document.querySelector(`[data-category="${category}"]`);
    if (selectedTag) {
        selectedTag.classList.add('active');
    }
    
    currentCategory = category;
    resetAndLoadPrompts();
}

// 重置并加载提示词
function resetAndLoadPrompts() {
    currentPage = 1;
    hasMore = true;
    const promptsGrid = document.getElementById('promptsGrid');
    if (promptsGrid) {
        promptsGrid.innerHTML = '';
    }
    loadPrompts();
}

// 加载提示词
async function loadPrompts() {
    if (isLoading || !hasMore) return;
    
    isLoading = true;
    showLoading();
    
    try {
        const params = new URLSearchParams({
            page: currentPage,
            limit: 20
        });
        
        if (currentCategory && currentCategory !== '全部') {
            params.append('category', currentCategory);
        }
        
        if (currentSearch) {
            params.append('search', currentSearch);
        }
        
        const response = await fetch(`${API_BASE_URL}/prompts?${params}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            renderPrompts(data.data, currentPage === 1);
            
            // 检查是否还有更多数据
            const totalLoaded = (currentPage - 1) * 20 + data.data.length;
            hasMore = totalLoaded < data.total;
            
            updateLoadMoreButton();
        } else {
            showError('加载提示词失败: ' + (data.message || '未知错误'));
        }
    } catch (error) {
        console.error('加载提示词失败:', error);
        showError('网络错误，请稍后重试');
    } finally {
        isLoading = false;
        hideLoading();
    }
}

// 加载更多提示词
function loadMorePrompts() {
    if (!isLoading && hasMore) {
        currentPage++;
        loadPrompts();
    }
}

// 渲染提示词
function renderPrompts(prompts, replace = false) {
    const promptsGrid = document.getElementById('promptsGrid');
    if (!promptsGrid) return;
    
    if (replace) {
        promptsGrid.innerHTML = '';
    }
    
    prompts.forEach(prompt => {
        const card = createPromptCard(prompt);
        promptsGrid.appendChild(card);
    });
    
    // 重新设置图片加载
    setupImageLoading();
}

// 创建提示词卡片
function createPromptCard(prompt) {
    const card = document.createElement('article');
    card.className = 'prompt-card';
    card.setAttribute('data-id', prompt.id);
    
    let previewSection = '';
    if (prompt.preview_images && prompt.preview_images.length > 0) {
        const images = prompt.preview_images.map((img, index) => 
            `<img src="${img}" alt="预览图片${index + 1}" class="preview-image loading" onclick="openImageModal('${img}')">`
        ).join('');
        
        previewSection = `
            <div class="preview-section">
                <div class="preview-label">🖼️ 效果预览</div>
                <div class="preview-images">${images}</div>
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="prompt-type">${prompt.type}</div>
        <h3 class="prompt-title">${escapeHtml(prompt.title)}</h3>
        <p class="prompt-description">${escapeHtml(prompt.description)}</p>
        ${previewSection}
        <div class="prompt-content">${escapeHtml(prompt.content)}</div>
        <div class="prompt-meta">
            <div class="prompt-stats">
                <span class="stat-item">👍 ${formatNumber(prompt.likes)}</span>
                <span class="stat-item">💬 ${formatNumber(prompt.comments)}</span>
                <span class="stat-item">⭐ ${prompt.rating}</span>
            </div>
            <button class="btn copy-btn" onclick="copyPrompt(this, event)">📋 复制</button>
        </div>
    `;
    
    // 添加点击事件（排除按钮和图片）
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.btn') && !e.target.closest('.preview-image')) {
            openPromptDetail(prompt);
        }
    });
    
    return card;
}

// 显示加载状态
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'block';
    }
}

// 隐藏加载状态
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// 更新加载更多按钮
function updateLoadMoreButton() {
    const container = document.getElementById('loadMoreContainer');
    const button = document.getElementById('loadMoreBtn');
    
    if (container && button) {
        if (hasMore) {
            container.style.display = 'block';
            button.textContent = isLoading ? '加载中...' : '加载更多';
            button.disabled = isLoading;
        } else {
            container.style.display = 'none';
        }
    }
}

// 显示错误信息
function showError(message) {
    const promptsGrid = document.getElementById('promptsGrid');
    if (promptsGrid && currentPage === 1) {
        promptsGrid.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #e53e3e;">
                <p>${message}</p>
            </div>
        `;
    }
}

// 复制提示词功能
function copyPrompt(button, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const card = button.closest('.prompt-card');
    const content = card.querySelector('.prompt-content').textContent.trim();
    
    copyToClipboard(content, button);
}

// 复制到剪贴板
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        showCopySuccess(button);
    }).catch(err => {
        console.error('复制失败:', err);
        // 备用复制方法
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopySuccess(button);
        } catch (fallbackErr) {
            console.error('备用复制方法也失败:', fallbackErr);
            alert('复制失败，请手动选择文本复制');
        }
    });
}

// 显示复制成功
function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '✅ 已复制';
    button.style.background = 'linear-gradient(135deg, rgba(154, 205, 50, 0.4) 0%, rgba(154, 205, 50, 0.3) 100%)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// 打开提示词详情
function openPromptDetail(prompt) {
    const modal = document.getElementById('promptDetailModal');
    if (!modal) return;
    
    // 填充内容
    document.getElementById('modalPromptType').textContent = prompt.type;
    document.getElementById('modalPromptTitle').textContent = prompt.title;
    document.getElementById('modalPromptDescription').textContent = prompt.description;
    document.getElementById('modalPromptContent').textContent = prompt.content;
    
    // 填充统计信息
    document.getElementById('modalLikes').textContent = `👍 ${formatNumber(prompt.likes)}`;
    document.getElementById('modalComments').textContent = `💬 ${formatNumber(prompt.comments)}`;
    document.getElementById('modalRating').textContent = `⭐ ${prompt.rating}`;
    
    // 处理预览图片
    const modalPreview = document.getElementById('modalPromptPreview');
    if (prompt.preview_images && prompt.preview_images.length > 0) {
        const images = prompt.preview_images.map((img, index) => 
            `<img src="${img}" alt="预览图片${index + 1}" class="preview-image loading" onclick="openImageModal('${img}')">`
        ).join('');
        
        modalPreview.innerHTML = `
            <div class="preview-section">
                <div class="preview-label">🖼️ 效果预览</div>
                <div class="preview-images">${images}</div>
            </div>
        `;
        modalPreview.style.display = 'block';
    } else {
        modalPreview.style.display = 'none';
    }
    
    // 显示模态框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // 重新设置图片加载
    setupImageLoading();
}

// 关闭提示词详情模态框
function closePromptDetailModal() {
    const modal = document.getElementById('promptDetailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 复制模态框中的提示词
function copyModalPrompt(buttonElement) {
    const content = document.getElementById('modalPromptContent').textContent;
    const button = buttonElement || event.target;
    
    copyToClipboard(content, button);
}

// 收藏功能
function favoritePrompt() {
    const button = event.target;
    const isFavorited = button.textContent.includes('❤️');
    
    if (isFavorited) {
        button.textContent = '🤍 取消收藏';
        button.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)';
    } else {
        button.textContent = '❤️ 收藏';
        button.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.3) 0%, rgba(255, 107, 107, 0.2) 100%)';
    }
}

// 图片模态框功能
function openImageModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    if (modal && modalImage) {
        modalImage.src = src;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 回到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 设置图片加载
function setupImageLoading() {
    const images = document.querySelectorAll('.preview-image.loading');
    
    images.forEach((img, index) => {
        const timeout = setTimeout(() => {
            if (img.classList.contains('loading')) {
                createFallbackImage(img, index);
            }
        }, 5000);

        img.addEventListener('load', function() {
            clearTimeout(timeout);
            this.classList.remove('loading');
            this.classList.add('loaded');
        });

        img.addEventListener('error', function() {
            clearTimeout(timeout);
            createFallbackImage(this, index);
        });
    });
}

// 创建占位图
function createFallbackImage(img, index) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;

    const gradients = [
        ['#9acd32', '#6b8e23'],
        ['#adff2f', '#9acd32'],
        ['#32cd32', '#228b22'],
        ['#7cfc00', '#32cd32'],
        ['#98fb98', '#90ee90'],
        ['#00ff7f', '#00fa9a'],
        ['#90ee90', '#8fbc8f'],
        ['#f0fff0', '#e0ffe0']
    ];

    const gradient = gradients[index % gradients.length];
    const grd = ctx.createLinearGradient(0, 0, 300, 300);
    grd.addColorStop(0, gradient[0]);
    grd.addColorStop(1, gradient[1]);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 300, 300);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎨', 150, 130);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('示例图片', 150, 180);

    img.src = canvas.toDataURL();
    img.classList.remove('loading');
    img.classList.add('loaded');
}

// 工具函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}