import defaultSettings from '@/settings'

const title = defaultSettings.title || '词汇学习后台管理系统' // 如果拿不到标题就起字符串中的名称

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
