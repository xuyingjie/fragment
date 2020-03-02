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

const bucket = 'i-n-t-e-l-l-i-g-e-n-t'
const site = `https://${bucket}.oss-cn-beijing.aliyuncs.com`

async function request({ method = 'GET', key = '', search = '', body, responseType, onprogress }) {
  const headers = acl() ? await createOSSAuthHeaders({
    method,
    bucket,
    key,
    ...acl(),
  }) : []
  if (method === 'PUT') {
    headers['Cache-Control'] = 'public,max-age=8640000'
  }

  const url = `${site}/${key}${search}`
  const data = await ajax({ method, url, headers, body, responseType, onprogress })
  return data
}

export async function put({ key, data = new ArrayBuffer(0), passwd = false, onprogress }) {
  const enc = await encrypt(passwd || acl().cryptoKey, data)
  await request({
    method: 'PUT',
    key,
    body: concat(enc.iv, enc.data),
    responseType: 'text',
    onprogress,
  })
  return 200
}

export async function get({ key, passwd = false, onprogress }) {
  const data = await request({ key, onprogress })
  return await decrypt(passwd || acl().cryptoKey, data.slice(0, 12), data.slice(12))
}

export async function del(key) {
  await request({ method: 'DELETE', key })
  return 204
}

export async function getList(marker = '') {
  const maxKeys = 100
  const xml = await request({
    search: `?max-keys=${maxKeys}&marker=${marker}&delimiter=/`,
    responseType: 'document'
  })

  const contents = parseContents(xml)
  const list = []
  for (let i = 0; i < contents.length; i++) {
    const key = contents[i]['Key']
    const text = await parseKey(key)
    list.push({
      key,
      text,
      // last: contents[i]['LastModified'],//有可能随着文件移动而失效
      size: contents[i]['Size'],
    })
  }

  const isTruncated = parseXMLNode(xml, 'IsTruncated')
  if (isTruncated === 'true') {
    list.nextMarker = parseXMLNode(xml, 'NextMarker')
  } else {
    list.nextMarker = ''
  }

  return list
}

function parseXMLNode(xml, nodeName) {
  const node = xml.documentElement.querySelector(nodeName)
  return node.textContent
}

function parseContents(xml) {
  return [...xml.documentElement.querySelectorAll('Contents')].map(el => {
    return [...el.querySelectorAll('*')].reduce((total, sub) => {
      total[sub.nodeName] = sub.textContent
      return total
    }, {})
  })
}

export async function createKey(text) {
  const buf = stringToArrayBuffer(text)
  const enc = await encrypt(acl().cryptoKey, buf)
  const base64 = arrayBufferToBase64(concat(enc.iv, enc.data))
  return orderNum() + base64.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export async function parseKey(key) {
  try {
    const base64 = key.replace(/-/g, '+').replace(/_/g, '/').slice(8)
    const enc = base64ToArrayBuffer(base64)
    const buf = await decrypt(acl().cryptoKey, enc.slice(0, 12), enc.slice(12))
    return arrayBufferToString(buf)
  } catch (e) {
    console.log(e)
    return 'parse key error'
  }
}

function orderNum() {
  // 'FFFFFFFF'
  return (5878000000 - Math.floor(Date.now() / 1000)).toString(16)
}

function acl() {
  try {
    const int8 = Int8Array.from(localStorage.a.split(','))
    const { accessKeyId, accessKeySecret, cryptoKey } = JSON.parse(arrayBufferToString(int8))
    return { accessKeyId, accessKeySecret, cryptoKey }
  } catch (e) {
    // console.log(e)
    return ''
  }
}
