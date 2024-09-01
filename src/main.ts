import fs from 'node:fs'

async function main() {
  const url = 'https://60s.viki.moe/60s?v2=1'
  let svg: string
  fetch(url)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error('网络响应错误')
      }
      return resp.json()
    })
    .then(data => data.data)
    .then((data) => {
      const { news, tip, cover } = data
      const len = news.length
      const totalHeight = 400 + (len + 1) * 30
      svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="720" height="${totalHeight}">`
      svg += `<rect width="720" height="${totalHeight}" fill="white" stroke="#03a1ea" stroke-width="1" />`
      svg += `<image width="720" height="400" href="${cover}" />`
      for (let i = 0; i < len; i++) {
        const text = news[i].substring(0, 40)
        svg += `<text x="5" y="${420 + i * 30}" font-family="Arial" font-size="16" fill="blue">${text}</text>`
      }
      svg += `<text x="50%" y="${420 + len * 30}" font-family="Arial" font-size="16" fill="red" text-anchor="middle" dominant-baseline="middle" >【微语】${tip}</text>`
      svg += `</svg>`
      fs.writeFileSync('60s.svg', svg)
    })
    .catch((error) => {
      console.error('获取数据时出错: ', error)
    })
}

main()
