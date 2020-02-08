import crypto from './webcrypto'
import { request } from './request'

import { OSS_DOMAIN, CDN_DOMAIN, createForm } from './oss'

export async function uploadFile({ key, data, passwd = false, progressNode }) {
  try {
    // !(data instanceof ArrayBuffer)
    if (data.constructor !== ArrayBuffer) {
      data = crypto.strToArrayBuffer(JSON.stringify(data))
    }
    if (passwd) {
      data = await crypto.encrypt(passwd, data)
    }
    const form = await createForm({ key, data })

    const params = {
      url: OSS_DOMAIN,
      method: 'POST',
      body: form,
      progressNode,
    }
    return await request(params)
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function readAsJson({ key, passwd }) {
  try {
    let data = await request({ url: `${CDN_DOMAIN}/${key}` })
    if (passwd) {
      data = await crypto.decrypt(passwd, data)
    }
    const str = crypto.arrayBufferToStr(data)
    return JSON.parse(str)
  } catch (e) {
    console.log(e)
    return ''
  }
}

export async function readAsBlobURL({ url, type }) {
  try {
    const data = await request({ url })
    const blob = new Blob([data], { type })
    return URL.createObjectURL(blob)
  } catch (e) {
    console.log(e)
    return ''
  }
}

export async function download({ url, name, type, progressNode }) {
  try {
    const data = await request({ url, progressNode })
    const blob = new Blob([data], { type })

    const anchor = document.createElement('a')
    anchor.download = name
    anchor.href = URL.createObjectURL(blob)
    // anchor.target = '_blank'
    document.body.appendChild(anchor)

    const evt = document.createEvent('MouseEvents')
    evt.initEvent('click', true, true)
    anchor.dispatchEvent(evt)
    document.body.removeChild(anchor)
  } catch (e) {
    console.log(e)
  }
}

export function readAsArrayBuffer(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}
