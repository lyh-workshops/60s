import console from 'node:console'
import fs from 'node:fs'
import dayjs from 'dayjs'
import { createShortByUrl, uploadPhotosToXLog } from './xlog'
import { getData } from './60s'

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
    const text = `【${i + 1}】${news[i]}`
    content += text
  }
  content += `【微语】${tip}`
  try {
    const photoUrlList: string[] = []
    photoUrlList.push(cover)
    const attachmentUrlList = await uploadPhotosToXLog(photoUrlList)
    // await createShort(title, content, attachmentUrlList)
    await createShortByUrl(title, content, attachmentUrlList)
    console.log(`${title}: 同步成功`)
  }
  catch (error) {
    console.log(`${title}: 同步失败`)
    console.error(error)
  }
}

main()
