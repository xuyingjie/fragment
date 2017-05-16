import crypto from './webcrypto'

const bucket = 'code'
export const site = 'https://code.eqldwf.cn'

export async function fetchForm({ filepath, data }) {
  let form = new FormData()
  form.append('op', 'upload')
  form.append('filecontent', new Blob([data]))
  form.append('insertOnly', 0)

  const url = await getSignUrl(filepath)
  const res = await fetch(url, {
    method: 'POST',
    body: form
  })

  if (filepath.match(/list|paper/)) {
    updateHeader(url)
  }
  return res.json()
}

function updateHeader(url) {
  let form = new FormData()
  form.append('op', 'update')
  form.append('custom_headers', JSON.stringify({ 'Cache-Control': 'no-cache' }))

  fetch(url, {
    method: 'POST',
    body: form
  })
}

async function getSignUrl(filepath = '') {
  const user = JSON.parse(localStorage.user)
  const appid = user.appid
  const sid = user.sid
  const skey = user.skey

  const random = parseInt(Math.random() * Math.pow(2, 32), 10)
  const now = parseInt(new Date().getTime() / 1000, 10)
  const e = now + 60  // 签名过期时间为当前+60s
  const path = '' // 多次签名这里填空
  const str = 'a=' + appid + '&k=' + sid + '&e=' + e + '&t=' + now + '&r=' + random +
    '&f=' + path + '&b=' + bucket

  const sign = await crypto.b64HmacSHA1(skey, str, true)

  const region = 'tj'
  const url = `https://${region}.file.myqcloud.com/files/v2/${appid}/${bucket}/${filepath}`
  return `${url}?sign=${encodeURIComponent(sign)}`
}
