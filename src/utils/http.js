'use strict';

import * as crypto from './crypto';

const bucket = 'fragment';

// or use Promise
export function get(opts) {

  var xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {

        var passwd, iv;
        if (opts.passwd) {
          passwd = opts.passwd;
          iv = opts.iv;
        } else {
          var user = JSON.parse(localStorage.user);
          passwd = user.passwd;
          iv = user.iv;
        }

        crypto.decrypt({
          passwd,
          iv,
          data: xhr.response,
          callback: decrypted => {
            if (opts.arrayBuffer) {
              opts.success(decrypted);
            } else {
              var str = crypto.arrayBufferToStr(decrypted);
              opts.success(JSON.parse(str));
            }
          },
        });

      }
    }
  };
  if (opts.progress) {
    xhr.onprogress = function(e) {
      if (e.lengthComputable) {
        if (e.loaded === e.total) {
          opts.progress.style.width = '0%';
        } else {
          opts.progress.style.width = ((e.loaded / e.total) * 100).toFixed(2) + '%';
        }
      }
    };
  }

  // var user = JSON.parse(localStorage.user);
  // var StringToSign = `GET\n\n\n${(new Date()).toUTCString()}\n${opts.key}`;
  // var signature = crypto.b64_hmac_sha1(user.SK, StringToSign);
  // var s = `?AWSAccessKeyId=${user.AK}&Expires=${Date.now() + 3600000}&Signature=${signature}`;

  xhr.open('GET', `http://${bucket}.obs.cn-north-1.myhwclouds.com/${opts.key}`, true);

  // in firefox xhr.responseType must behind xhr.open
  xhr.responseType = 'arraybuffer';
  xhr.send(null);
}


export function upload(opts) {

  var user = JSON.parse(localStorage.user);
  var passwd = opts.passwd ? opts.passwd : user.passwd;
  var iv = user.iv;

  if (!opts.arrayBuffer) {
    opts.data = crypto.strToArrayBuffer(opts.data);
  }

  crypto.encrypt({
    passwd,
    iv,
    data: opts.data,
    callback: encrypted => {

      // new Blob([encList.buffer]) fast than new Blob([encList]) type不是必需的
      var blob = new Blob([encrypted], {
        type: 'application/octet-stream',
      });

      var AK = user.AK;
      var SK = user.SK;

      var cache;
      if (opts.key.match('u/') !== null) {
        cache = 'public,max-age=8640000';
      } else {
        cache = 'no-cache';
      }

      var policyJson = {
        'expiration': (new Date(Date.now() + 3600000)).toJSON(),
        'conditions': [
          {'bucket': bucket},
          {'acl': 'public-read'},
          {'Content-Type': 'application/octet-stream'},
          {'Cache-Control': cache},
          ['eq', '$key', opts.key],
        ],
      };
      var policy = btoa(JSON.stringify(policyJson));
      var signature = crypto.b64_hmac_sha1(SK, policy);

      var formData = new FormData();
      formData.append('key', opts.key);
      formData.append('acl', 'public-read');
      formData.append('Content-Type', 'application/octet-stream');
      formData.append('Cache-Control', cache);
      formData.append('AWSAccessKeyId', AK);
      formData.append('policy', policy);
      formData.append('signature', signature);

      // 文件或文本内容，必须是表单中的最后一个域。
      formData.append('file', blob);

      var xhr = new XMLHttpRequest();

      if (opts.progress) {
        xhr.upload.onprogress = function(e) {
          if (e.lengthComputable) {
            if (e.loaded === e.total) {
              opts.progress.style.width = '0%';
            } else {
              opts.progress.style.width = ((e.loaded / e.total) * 100).toFixed(2) + '%';
            }
          }
        };
      }

      xhr.onload = () => {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            opts.success();
          }
        }
      };

      xhr.open('POST', `http://${bucket}.obs.cn-north-1.myhwclouds.com/`, true);
      xhr.send(formData);
    },
  });

}
