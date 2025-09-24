const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 构建脚本
const buildTargets = {
  weapp: '微信小程序',
  h5: 'H5网页',
  alipay: '支付宝小程序',
  tt: '字节跳动小程序'
}

function build(target) {
  console.log(`🚀 开始构建 ${buildTargets[target]}...`)
  
  try {
    // 执行构建命令
    execSync(`npm run build:${target}`, { stdio: 'inherit' })
    
    // 检查构建结果
    const distPath = path.join(__dirname, '../dist')
    if (fs.existsSync(distPath)) {
      console.log(`✅ ${buildTargets[target]} 构建成功！`)
      console.log(`📁 构建文件位置: ${distPath}`)
      
      // 显示构建文件大小
      const stats = fs.statSync(distPath)
      console.log(`📊 构建文件大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
    } else {
      console.log(`❌ ${buildTargets[target]} 构建失败！`)
    }
  } catch (error) {
    console.error(`❌ 构建过程中出现错误:`, error.message)
  }
}

// 获取命令行参数
const target = process.argv[2]

if (!target) {
  console.log('请指定构建目标:')
  Object.keys(buildTargets).forEach(key => {
    console.log(`  npm run build-script ${key}  # ${buildTargets[key]}`)
  })
  process.exit(1)
}

if (!buildTargets[target]) {
  console.log(`❌ 不支持的构建目标: ${target}`)
  console.log('支持的构建目标:', Object.keys(buildTargets).join(', '))
  process.exit(1)
}

build(target)