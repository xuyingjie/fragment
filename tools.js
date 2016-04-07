const bucket = 'whitehairpin'
export const privacy = true

const url = `https://${bucket}.oss-cn-beijing.aliyuncs.com`
const cdn = `http://${bucket}.img-cn-beijing.aliyuncs.com`

export function getSrc(type,id) {
  return new Promise(resolve => {
    if (privacy) {
      get(`file/${id}`, {file:true}).then(data => {
        var blob = new Blob([data], {type})
        resolve(URL.createObjectURL(blob))
      })
    } else {
      let url = `${cdn}/file/${id}@.jpg`
      if (type.match(/gif|svg/i) !== null) url = `${cdn}/file/${id}`
      resolve(url)
    }
  })
}

export function get(key, { file, progress, passwd } = {}) {
  return new Promise(resolve => {
    if (privacy || passwd) {
      _get(key, { progress }).then(data => {
        if (!passwd) passwd = JSON.parse(localStorage.user).passwd
        decrypt(passwd, data).then(out => {
          if (!file) out = JSON.parse(arrayBufferToStr(out))
          resolve(out)
        })
      })
    } else {
      let responseType = 'json'
      if (file) responseType = 'arraybuffer'
      _get(key, { responseType, progress }).then(data => {
        resolve(data)
      })
    }
  })
}

export function upload(key, data, { file, progress, passwd } = {}) {
  return new Promise(resolve => {
    if (!file) data = JSON.stringify(data)
    if (privacy || passwd) {
      if (!passwd) passwd = JSON.parse(localStorage.user).passwd
      if (!file) data = strToArrayBuffer(data)
      encrypt(passwd, data).then(out => {
        _upload(key, out, { progress }).then(() => {
          resolve()
        })
      })
    } else {
      _upload(key, data, { progress }).then(() => {
        resolve()
      })
    }
  })
}

function _get(key, { responseType, progress } = {}) {
  return new Promise(resolve => {

    var xhr = new XMLHttpRequest()
    xhr.open('GET', `${url}/${key}`)
    xhr.responseType = responseType ? responseType : 'arraybuffer'

    xhr.onprogress = (e) => {
      if (!progress) progress = document.getElementById('progress')
      if (e.lengthComputable) progress.style.width = (e.loaded === e.total) ? 0 : e.loaded / e.total * 100 + '%'
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        resolve(xhr.response)
      }
    }

    xhr.send(null)
  })
}

function _upload(key, data, { progress } = {}) {
  return new Promise(resolve => {
    form(key, data).then(out => {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url)

      xhr.upload.onprogress = (e) => {
        if (!progress) progress = document.getElementById('progress')
        if (e.lengthComputable) progress.style.width = (e.loaded === e.total) ? 0 : e.loaded / e.total * 100 + '%'
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          resolve(xhr.response)
        }
      }

      xhr.send(out)
    })
  })
}

function form(key, data) {
  const user = JSON.parse(localStorage.user)
  const AK = user.AK
  const SK = user.SK

  var cache = (key.match(/(img|file)\//) === null) ? 'no-cache' : 'public,max-age=8640000'
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

  return new Promise(resolve => {
    b64HmacSHA1(SK, policy).then(signature => {
      const formData = new FormData()
      formData.append('key', key)

      formData.append('x-oss-object-acl', 'public-read')
      formData.append('Content-Type', 'application/octet-stream')
      formData.append('Cache-Control', cache)
      formData.append('OSSAccessKeyId', AK)
      formData.append('policy', policy)
      formData.append('signature', signature)

      // 文件或文本内容，必须是表单中的最后一个域。
      formData.append('file', new Blob([data]))
      resolve(formData)
    })
  })
}


function arrayBufferToStr(buf) {
  // return String.fromCharCode.apply(null, new Uint16Array(buf))  // >100kb string -> chrome 'Unhandled promise rejection RangeError: Maximum call stack size exceeded'
  return (new Uint16Array(buf)).reduce((str, x) => str + String.fromCharCode(x), '')
}
function strToArrayBuffer(str) {
  // return Uint16Array.from([...str], s => s.charCodeAt(0)).buffer
  // return new Uint16Array([...str].map(s => s.charCodeAt(0))).buffer
  return new TextEncoder('utf-16').encode(str)
}

//
// WebCryptoAPI
//
// concat arrayBuffer
function set(a, b) {
  var out = new Uint8Array(a.byteLength + b.byteLength)
  out.set(new Uint8Array(a))
  out.set(new Uint8Array(b), a.byteLength)
  return out.buffer
}

function importKey(passwd) {
  return new Promise((resolve, reject) => {
    window.crypto.subtle.importKey(
      'raw', // can be 'jwk' or 'raw'
      strToArrayBuffer(passwd),
      { // this is the algorithm options
        name: 'AES-GCM',
      },
      false, // whether the key is extractable (i.e. can be used in exportKey)
      ['encrypt', 'decrypt'] // can 'encrypt', 'decrypt', 'wrapKey', or 'unwrapKey'
    )
      .then(key => {
        // returns the symmetric key
        resolve(key)
      })
      .catch(err => {
        reject(err)
      })
  })
}

function encrypt(passwd, data) {
  return new Promise((resolve, reject) => {
    importKey(passwd)
      .then(key => {

        var iv = window.crypto.getRandomValues(new Uint8Array(12))
        window.crypto.subtle.encrypt({
          name: 'AES-GCM',

          // Don't re-use initialization vectors! Always generate a new iv every time your encrypt!
          // Recommended to use 12 bytes length
          // where iv is an ArrayBuffer or an ArrayBufferView with 12 random bytes (these should be generated by RandomSource.getRandomValues()).
          iv
        },
          key, // from generateKey or importKey above
          data // ArrayBuffer of data you want to encrypt
        )
          .then(encrypted => {
            // returns an ArrayBuffer containing the encrypted data
            resolve(set(iv.buffer, encrypted))
          })
          .catch(err => {
            reject(err)
          })
      })
  })
}

function decrypt(passwd, data) {
  return new Promise((resolve, reject) => {
    importKey(passwd)
      .then(key => {
        window.crypto.subtle.decrypt({
          name: 'AES-GCM',
          iv: data.slice(0, 12) // The initialization vector you used to encrypt
        },
          key, // from generateKey or importKey above
          data.slice(12) // ArrayBuffer of the data
        )
          .then(decrypted => {
            // returns an ArrayBuffer containing the decrypted data
            resolve(decrypted)
          })
          .catch(err => {
            reject(err)
          })
      })
  })
}

function b64HmacSHA1(key, str) {
  return new Promise(resolve => {
    let keyBuf = new TextEncoder('utf-8').encode(key)
    let buf = new TextEncoder('utf-8').encode(str)
    let hmacSha1 = {name: 'hmac', hash: {name: 'sha-1'}}
    crypto.subtle.importKey('raw', keyBuf, hmacSha1, true, ['sign', 'verify']).then(out => {
      crypto.subtle.sign(hmacSha1, out, buf).then(result => {
        resolve(btoa(String.fromCharCode.apply(null, new Uint8Array(result))))
      })
    })
  })
}
