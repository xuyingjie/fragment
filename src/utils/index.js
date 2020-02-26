import {
  concat,
  stringToArrayBuffer,
  arrayBufferToString,
  encrypt,
  decrypt,
  arrayBufferToBase64,
  base64ToArrayBuffer,

  ajax,
  createOSSAuthHeaders,
} from 'pessoa'

const bucket = ''
const site = `https://${bucket}.oss-cn-beijing.aliyuncs.com`

const prefix = 'cache'
export const postsDir = 'posts'
export const attachmentsDir = 'attachments'

async function request({ method = 'GET', bucket, key = '', cacheControl, url, body, responseType, onprogress }) {
  if (key) {
    key = `${prefix}/${key}`
  }
  const headers = bucket ? await createOSSAuthHeaders({
    method,
    bucket,
    key,
    cacheControl,
    ...acl(),
  }) : []
  if (!url) {
    url = `${site}/${key}`
  }
  const data = await ajax({ url, method, headers, body, responseType, onprogress })
  return data
}

export async function put({ key, data, passwd = false, onprogress }) {
  if (data.constructor !== ArrayBuffer) {
    data = stringToArrayBuffer(JSON.stringify(data))
  }
  const enc = await encrypt(passwd || acl().cryptoKey, data)

  const out = await request({
    method: 'PUT',
    bucket,
    key,
    cacheControl: key.match(postsDir) ? 'no-cache' : 'public,max-age=8640000',
    body: concat(enc.iv, enc.data),
    onprogress,
  })
  return out || 200
}

export async function get({ key, passwd = false, responseType = 'json', onprogress }) {
  const out = await request({ key, onprogress })
  const data = await decrypt(passwd || acl().cryptoKey, out.slice(0, 12), out.slice(12))

  if (responseType === 'arraybuffer') {
    return data
  }
  if (responseType === 'json') {
    return JSON.parse(arrayBufferToString(data))
  }
}

export async function del(key) {
  const out = await request({
    method: 'DELETE',
    bucket,
    key,
  })
  return out || 200
}

export async function getList() {
  const xml = await request({
    bucket,
    url: `${site}?prefix=${prefix}/${postsDir}/&delimiter=/`,
    responseType: 'document'
  })
  const list = parseDocument(xml, 'Contents')
  return list
}

function parseDocument(xml, nodeName) {
  return [...xml.documentElement.querySelectorAll(nodeName)].map(el => {
    return [...el.querySelectorAll('*')].reduce((total, sub) => {
      total[sub.nodeName] = sub.innerHTML
      return total
    }, {})
  }).filter(el => +el['Size'] !== 0)
}

export async function createId(text) {
  const buf = stringToArrayBuffer(text)
  const enc = await encrypt(acl().cryptoKey, buf)
  const base64 = arrayBufferToBase64(concat(enc.iv, enc.data))
  return base64.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export async function parseId(id) {
  const base64 = id.replace(/-/g, '+').replace(/_/g, '/')
  const enc = base64ToArrayBuffer(base64)
  const buf = await decrypt(acl().cryptoKey, enc.slice(0, 12), enc.slice(12))
  return arrayBufferToString(buf)
}

function acl() {
  const { accessKeyId, accessKeySecret, key } = JSON.parse(localStorage.user)
  return { accessKeyId, accessKeySecret, cryptoKey: key }
}
