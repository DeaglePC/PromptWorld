export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: 'rgba(255, 255, 255, 0.9)',
    navigationBarTitleText: 'PromptWorld',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: true,
    backgroundColor: '#c6ffdd'
  }
})
