import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // 支持的语言列表
  locales: ['en', 'zh'],
  
  // 默认语言
  defaultLocale: 'en',
  
  // 路径名国际化 - 默认语言不显示前缀，其他语言显示
  localePrefix: 'as-needed',
  
  // 自动检测用户浏览器语言
  localeDetection: true,
  
  // 替代语言配置
  alternateLinks: true
})

export const config = {
  // 匹配所有路径，除了API路由和静态文件
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}