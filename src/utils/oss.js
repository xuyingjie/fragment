import crypto from './webcrypto'

const bucket = 'eqldwf'
export const site = 'https://eqldwf.cn'

export async function fetchForm({ filepath, data }) {
  const user = JSON.parse(localStorage.user)
  const AK = user.sid
  const SK = user.skey

  const cache = (filepath.match(/list|paper/)) ? 'no-cache' : 'public,max-age=8640000'
  const policyJson = {
    'expiration': (new Date(Date.now() + 600000)).toJSON(),
    'conditions': [
      { bucket },
      { 'Cache-Control': cache },
      ['eq', '$key', filepath]
    ]
  }
  const policy = btoa(JSON.stringify(policyJson))
  const signature = await crypto.b64HmacSHA1(SK, policy)

  let form = new FormData()
  form.append('key', filepath)
  form.append('Cache-Control', cache)
  form.append('OSSAccessKeyId', AK)
  form.append('policy', policy)
  form.append('Signature', signature)
  form.append('file', new Blob([data]))

  const res = await fetch(site, {
    method: 'POST',
    body: form
  })

  if (res.status === 204) {
    return res.status
  }
}