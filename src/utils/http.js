import * as crypto from './crypto'

const bucket = 'fragment'

// or use Promise
export function get({ key, passwd, iv, arrayBuffer, progress, success }) {
  const xhr = new XMLHttpRequest()

  xhr.onload = () => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        if (!passwd) {
          const user = JSON.parse(localStorage.user)
          passwd = user.passwd
          iv = user.iv
        }

        crypto.decrypt({
          passwd,
          iv,
          data: xhr.response,
          callback: decrypted => {
            if (arrayBuffer) {
              success(decrypted)
            } else {
              const str = crypto.arrayBufferToStr(decrypted)
              success(JSON.parse(str))
            }
          },
        })
      }
    }
  }
  if (progress) {
    xhr.onprogress = e => {
      if (e.lengthComputable) {
        if (e.loaded === e.total) {
          progress.style.width = '0%'
        } else {
          progress.style.width = ((e.loaded / e.total) * 100).toFixed(2) + '%'
        }
      }
    }
  }

  // var user = JSON.parse(localStorage.user)
  // var StringToSign = `GET\n\n\n${(new Date()).toUTCString()}\n${opts.key}`
  // var signature = crypto.b64_hmac_sha1(user.SK, StringToSign)
  // var s = `?AWSAccessKeyId=${user.AK}&Expires=${Date.now() + 3600000}&Signature=${signature}`

  xhr.open('GET', `https://${bucket}.oss-cn-beijing.aliyuncs.com/${key}`)

  // in firefox xhr.responseType must behind xhr.open
  xhr.responseType = 'arraybuffer'
  xhr.send(null)
}


export function upload({ key, data, passwd, arrayBuffer, progress, success }) {
  const user = JSON.parse(localStorage.user)
  const iv = user.iv
  if (!passwd) {
    passwd = user.passwd
  }

  if (!arrayBuffer) {
    data = crypto.strToArrayBuffer(data)
  }

  crypto.encrypt({
    passwd,
    iv,
    data,
    callback: encrypted => {
      // new Blob([encList.buffer]) fast than new Blob([encList]) type不是必需的
      const blob = new Blob([encrypted], {
        type: 'application/octet-stream',
      })

      const AK = user.AK
      const SK = user.SK

      let cache
      if (key.match('u/') !== null) {
        cache = 'public,max-age=8640000'
      } else {
        cache = 'no-cache'
      }

      const policyJson = {
        'expiration': (new Date(Date.now() + 3600000)).toJSON(),
        'conditions': [
          { bucket },
          // { 'acl': 'public-read' },
          { 'Content-Type': 'application/octet-stream' },
          { 'Cache-Control': cache },
          ['eq', '$key', key],
        ],
      }
      const policy = btoa(JSON.stringify(policyJson))
      const signature = crypto.b64_hmac_sha1(SK, policy)

      const formData = new FormData()
      formData.append('key', key)
      formData.append('x-oss-object-acl', 'public-read')
      formData.append('Content-Type', 'application/octet-stream')
      formData.append('Cache-Control', cache)
      formData.append('OSSAccessKeyId', AK)
      formData.append('policy', policy)
      formData.append('signature', signature)

      // 文件或文本内容，必须是表单中的最后一个域。
      formData.append('file', blob)

      const xhr = new XMLHttpRequest()

      if (progress) {
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) {
            if (e.loaded === e.total) {
              progress.style.width = '0%'
            } else {
              progress.style.width = ((e.loaded / e.total) * 100).toFixed(2) + '%'
            }
          }
        }
      }

      xhr.onload = () => {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            success()
          }
        }
      }

      xhr.open('POST', `https://${bucket}.oss-cn-beijing.aliyuncs.com/`)
      xhr.send(formData)
    },
  })
}
