/**
 * fetch progress
 * https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/getReader
 */
export function request({ url, method = 'GET', body = null, progressNode }) {
  // const res = await fetch(url)
  // if (res.status === 404) return null
  // const data = await res.arrayBuffer()
  // return data || 'success'
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.responseType = 'arraybuffer'

    if (progressNode) {
      const cb = (e) => {
        // or progressCallback(percent)
        if (e.lengthComputable) progressNode.style.width = (e.loaded === e.total) ? 0 : e.loaded / e.total * 100 + '%'
      }
      xhr.onprogress = cb
      xhr.upload.onprogress = cb
    }

    xhr.onload = () => {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        if (method.match(/POST/i)) {
          resolve(xhr.status)
        } else {
          resolve(xhr.response)
        }
      } else {
        reject(xhr.status)
      }
    }

    xhr.send(body)
  })
}
