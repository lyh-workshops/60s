import console from 'node:console'
import fs from 'node:fs'
import dayjs from 'dayjs'
import { sendToXlog } from './xlog'
import { getData } from './60s'
import { DEFAULT_COVER, TG, XLOG } from './constants'
import { sendToTelegram } from './telegram'

async function main() {
  const data = await getData()
  const { news, tip, cover, updated } = data
  // UTC +08:00
  const date = dayjs.unix(Number(updated) / 1000).add(8, 'hour').format('YYYY-MM-DD')
  const title = `【${date}】每天 60 秒读懂世界`
  const updatedTime = String(updated)
  if (fs.existsSync('updated')) {
    const content = fs.readFileSync('updated', 'utf8')
    if (content === updatedTime) {
      console.log(`${title}: 已经同步过了`)
      return
    }
    else {
      fs.writeFileSync('updated', updatedTime, { encoding: 'utf8' })
    }
  }
  else {
    fs.writeFileSync('updated', updatedTime, { encoding: 'utf8' })
  }
  let content = ''
  for (let i = 0; i < news.length; i++) {
    const text = `【${i + 1}】${news[i]}\n`
    content += text
  }
  content += `【微语】${tip}`
  try {
    const photoUrlList: string[] = []
    if (cover) {
      photoUrlList.push(cover)
    }
    else {
      photoUrlList.push(DEFAULT_COVER)
    }
    if (XLOG) {
      sendToXlog(title, content, photoUrlList)
    }
    if (TG) {
      sendToTelegram(title, content, photoUrlList)
    }
    console.log(`${title}: 同步成功`)
  }
  catch (error) {
    console.log(`${title}: 同步失败`)
    console.error(error)
  }
}

main()
