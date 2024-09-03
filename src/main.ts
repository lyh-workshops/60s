import console from 'node:console'
import fs from 'node:fs'
import dayjs from 'dayjs'
import { createShort, uploadPhotosToXLog } from './xlog'

async function getData() {
  return await fetch('https://60s.viki.moe/60s?v2=1')
    .then((response) => {
      if (!response.ok) {
        throw new Error('网络响应错误')
      }
      return response.json()
    })
    .then(data => data.data)
    .catch((error) => {
      console.log('获取数据时出错: ', error)
    })
}

async function main() {
  const data = await getData()
  const { news, tip, cover, updated } = data
  const updatedTime = String(updated)
  if (fs.existsSync('updated')) {
    const content = fs.readFileSync('updated', 'utf8')
    if (content === updatedTime) {
      return
    }
    else {
      fs.writeFileSync('updated', updatedTime, { encoding: 'utf8' })
    }
  }
  else {
    fs.writeFileSync('updated', updatedTime, { encoding: 'utf8' })
  }
  const title = `【${dayjs.unix(Number(updated) / 1000).format('YYYY-MM-DD')}】每天 60 秒读懂世界`
  console.log(title)
  let content = ''
  for (let i = 0; i < news.length; i++) {
    const text = `【${i + 1}】${news[i]}`
    content += text
  }
  content += `【微语】${tip}`
  console.log('---- sync xlog start ----')
  const photoUrlList: string[] = []
  photoUrlList.push(cover)
  const attachmentUrlList = await uploadPhotosToXLog(photoUrlList)
  await createShort(title, content, attachmentUrlList)
  console.log('---- sync xlog end ----')
}

main()
