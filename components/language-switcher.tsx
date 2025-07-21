"use client"

import { useRouter, usePathname } from 'next/navigation'
import { locales } from '../i18n'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GlobeIcon, CheckIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchLanguage = (locale: string) => {
    console.log('切换语言:', locale);
    // 获取当前路径，移除语言前缀（如果存在）
    const segments = pathname.split('/').filter(Boolean);
    const hasLocalePrefix = segments.length > 0 && locales.includes(segments[0]);
    const pathWithoutLocale = hasLocalePrefix ? segments.slice(1).join('/') : segments.join('/')
    
    // 构建新的路径 - 默认语言(en)不添加前缀，其他语言添加前缀
    const newPath = locale === 'en'
      ? `/${pathWithoutLocale}`.replace(/\/+$/, '') || '/'
      : `/${locale}/${pathWithoutLocale}`.replace(/\/+$/, '') || `/${locale}`
    
    // 导航到新路径 - 添加调试日志
    console.log('切换语言:', { locale, currentPath: pathname, pathWithoutLocale, newPath });
    try {
      router.push(newPath);
      console.log('导航成功');
    } catch (error) {
      console.error('导航失败:', error);
    }
    
    // 保存用户选择的语言到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', locale)
    }
  }

  const getCurrentLanguage = () => {
    // 调试日志 - 打印当前语言
    console.log('当前语言:', currentLocale);

    return languages.find(lang => lang.code === currentLocale) || languages[0]
  }

  // 自动检测浏览器语言（仅在首次访问时）
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language')
      
      if (!savedLanguage) {
        // 检测浏览器语言
        const browserLang = navigator.language.toLowerCase()
        let detectedLang = 'en' // 默认语言
        
        if (browserLang.startsWith('zh')) {
          detectedLang = 'zh'
        }
        
        // 如果检测到的语言与当前语言不同，则切换
        if (detectedLang !== currentLocale && detectedLang !== 'en') {
          switchLanguage(detectedLang)
        }
      }
    }
  }, [mounted, currentLocale])

  if (!mounted) {
    return null
  }

  const currentLang = getCurrentLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <GlobeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.flag} {currentLang.name}</span>
          <span className="sm:hidden">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </span>
            {language.code === currentLocale && (
              <CheckIcon className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}