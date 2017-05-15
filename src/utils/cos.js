import crypto from './webcrypto'

const bucket = 'code'
export const site = 'https://code.eqldwf.cn'


export async function getFile({ filepath, passwd }) {
  const data = await fetch(`${site}/${filepath}`)
  let buf = await data.arrayBuffer()
  if (passwd) {
    buf = await crypto.decrypt(passwd, buf)
  }
  const str = crypto.arrayBufferToStr(buf)
  return JSON.parse(str)
}

export async function uploadFile({ filepath, data, passwd = false }) {
  // !(data instanceof ArrayBuffer)
  if (data.constructor !== ArrayBuffer) {
    data = crypto.strToArrayBuffer(JSON.stringify(data))
  }
  if (passwd) {
    data = await crypto.encrypt(passwd, data)
  }

  let form = new FormData()
  form.append('op', 'upload')
  form.append('filecontent', new Blob([data]))
  form.append('insertOnly', 0)
  if (filepath.match(/list|paper/)) {
    form.append('biz_attr', 'Cache-Control:no-cache')
  }

  const url = await getSignUrl(filepath)
  const res = await fetch(url, {
    method: 'POST',
    body: form
  })
  return res.json()
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

  const sign = await crypto.b64HmacSHA1(skey, str)

  const region = 'tj'
  const url = `https://${region}.file.myqcloud.com/files/v2/${appid}/${bucket}/${filepath}`
  return `${url}?sign=${encodeURIComponent(sign)}`
}

// export async function getList() {
//   const url = await getSignUrl()
//   const res = await fetch(`${url}&op=list&num=200&order=0`)
//   return res.json()
// }