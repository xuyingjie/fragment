import crypto from './webcrypto'

const bucket = 'pessoa'
export const OSS_DOMAIN = `//${bucket}.oss-cn-beijing.aliyuncs.com`
export const CDN_DOMAIN = '//pessoa.cn'

/**
 * https://help.aliyun.com/document_detail/31988.html
 */
export async function createForm({ key, data }) {
  const user = JSON.parse(localStorage.user)
  const accessKeyId = user.accessKeyId
  const accessKeySecret = user.accessKeySecret

  const cache = (key.match(/list|paper/)) ? 'no-cache' : 'public,max-age=8640000'
  const policyJson = {
    'expiration': (new Date(Date.now() + 600000)).toJSON(),
    'conditions': [
      { bucket },
      { 'Cache-Control': cache },
      ['eq', '$key', key]
    ]
  }
  const policy = btoa(JSON.stringify(policyJson))
  const signature = await crypto.b64HmacSHA1(accessKeySecret, policy)

  const form = new FormData()
  form.append('key', key)
  form.append('Cache-Control', cache)
  form.append('OSSAccessKeyId', accessKeyId)
  form.append('policy', policy)
  form.append('Signature', signature)
  form.append('file', new Blob([data]))

  return form
}
