import console from 'node:console'

const API_URL = 'https://60s.viki.moe/60s?v2=1'

export async function getData() {
  return await fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('网络响应错误')
      }
      return response.json()
    })
    .then(data => data.data)
    .catch((error) => {
      console.error('获取数据失败: ', error)
    })
}
