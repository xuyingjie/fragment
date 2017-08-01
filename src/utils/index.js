import crypto from './webcrypto'

import { site, fetchForm } from './oss'
export { site }

export async function getFile({ filepath, passwd }) {
  const data = await fetch(`${site}/${filepath}`)
  if (data.status === 404) return null
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

  return await fetchForm({ filepath, data })
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

export function downloadArrayBuffer({ name, type, data }) {
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
}
