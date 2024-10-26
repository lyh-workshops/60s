import process from 'node:process'

export async function sendToTelegram(title: string, content: string, photoUrlList: string[]) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error('invalid TELEGRAM_BOT_TOKEN')
  }
  if (!process.env.TELEGRAM_CHAT_ID) {
    throw new Error('invalid TELEGRAM_CHAT_ID')
  }
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  const url = `https://api.telegram.org/bot${token}/sendMessage`
  let message = `${title}\n${content}`
  for (const photo of photoUrlList) {
    message += `\n${photo}`
  }
  const payload = {
    chat_id: chatId,
    text: message,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '问题反馈❓',
            url: 'https://github.com/lyh-workshops/60s/issues',
          },
        ],
      ],
    },
  }
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(((response) => {
    if (!response.ok) {
      throw new Error('网络响应错误')
    }
  }))
}
