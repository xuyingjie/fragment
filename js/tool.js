//
// ajax
// or use Promise
//
function get(opts) {
  'use strict';
  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {

        var token = opts.token ? opts.token : localStorage.token;
        var uint8Arr = asmCrypto.AES_CBC.decrypt(xhr.response, token);
        // console.log('AES.decrypt');
        if (opts.arrayBuffer) {
          opts.success(uint8Arr.buffer);
        } else {
          var str = arrayBufferToStr(uint8Arr.buffer);
          opts.success(JSON.parse(str));
        }
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

  xhr.open('GET', 'http://' + bucket + '.oss-cn-beijing.aliyuncs.com/' + opts.key, true);

  // in firefox xhr.responseType must behind xhr.open
  xhr.responseType = 'arraybuffer';
  xhr.send(null);
}


function upload(opts) {
  'use strict';

  var token = opts.token ? opts.token : localStorage.token;

  if (!opts.arrayBuffer) {
    opts.data = strToArrayBuffer(opts.data);
  }

  // opts.data can be ArrayBuffer or Uint8Array. strings will garbled characters.
  var uint8Arr = asmCrypto.AES_CBC.encrypt(opts.data, token);
  // console.log('AES.encrypt');

  // new Blob([encList.buffer]) fast than new Blob([encList]) type不是必需的
  var blob = new Blob([uint8Arr.buffer], {
    type: 'application/octet-stream'
  });

  var user = JSON.parse(localStorage.user);
  var AK = user.AK;
  var SK = user.SK;

  var policyJson = {
    'expiration': (new Date(Date.now() + 3600000)).toJSON(),
    'conditions': [{
      'bucket': bucket
    },
      ['eq', '$key', opts.key]
    ]
  };
  var policy = btoa(JSON.stringify(policyJson));
  var signature = asmCrypto.HMAC_SHA1.base64(policy, SK);

  var formData = new FormData();
  formData.append('OSSAccessKeyId', AK);
  formData.append('policy', policy);
  formData.append('signature', signature);

  if (opts.key.match('u/') !== null) {
    formData.append('Cache-Control', 'public,max-age=8640000');
  } else {
    formData.append('Cache-Control', 'no-cache');
  }

  formData.append('key', opts.key);

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

  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        opts.success();
      }
    }
  };

  xhr.open('POST', 'http://' + bucket + '.oss-cn-beijing.aliyuncs.com/', true);
  xhr.send(formData);
}

function insertText(obj, str) {
  'use strict';

  if (document.selection) {
    var sel = document.selection.createRange();
    sel.text = str;
  } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
    var startPos = obj.selectionStart,
      endPos = obj.selectionEnd,
      cursorPos = startPos,
      tmpStr = obj.value;
    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
    cursorPos += str.length;
    obj.selectionStart = obj.selectionEnd = cursorPos;
  } else {
    obj.value += str;
  }
}


//
// File Type Icons
//
function fileTypeIcons(type) {
  'use strict';

  switch (type) {
    case 'image/png':
    case 'image/jpeg':
    case 'image/vnd.microsoft.icon':
      return 'fa fa-file-image-o';
    case 'application/x-xz':
    case 'application/gzip':
    case 'application/zip':
      return 'fa fa-file-archive-o';
    case 'text/plain':
    case 'text/x-markdown':
      return 'fa fa-file-text-o';
    case 'application/pdf':
      return 'fa fa-file-pdf-o';
    case 'application/msword':
    case 'application/vnd.oasis.opendocument.text':
      return 'fa fa-file-word-o';
    default:
      return 'fa fa-file-o';
  }
}

function timeDiff() {
  'use strict';
  return Date.now() + '' + Math.floor(Math.random() * 9000 + 1000);
}

function arrayBufferToStr(buf) {
  'use strict';
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function strToArrayBuffer(str) {
  'use strict';

  var buf = new ArrayBuffer(str.length * 2);
  var bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


//
// WebCryptoAPI
// or use Promise
//
function importKey(str, callback) {
  'use strict';
  window.crypto.subtle.importKey(
    "raw", //can be "jwk" or "raw"
    strToArrayBuffer(str), { //this is the algorithm options
      name: "AES-GCM",
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  )
    .then(key => {
      //returns the symmetric key
      callback(key);
    })
    .catch(err => {
      console.error(err);
    });
}

function encrypt(opt) {
  'use strict';
  importKey(opt.passwd, key => {
    window.crypto.subtle.encrypt({
      name: "AES-GCM",

      //Don't re-use initialization vectors!
      //Always generate a new iv every time your encrypt!
      //Recommended to use 12 bytes length
      iv: strToArrayBuffer(opt.iv),

      //Additional authentication data (optional)
      // additionalData: ArrayBuffer,

      //Tag length (optional)
      tagLength: 128, //can be 32, 64, 96, 104, 112, 120 or 128 (default)
    },
      key, //from generateKey or importKey above
      opt.data //ArrayBuffer of data you want to encrypt
    )
      .then(encrypted => {
        //returns an ArrayBuffer containing the encrypted data
        opt.callback(encrypted);
      })
      .catch(err => {
        console.error(err);
      });
  });
}

function decrypt(opt) {
  'use strict';
  importKey(opt.passwd, key => {
    window.crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: strToArrayBuffer(opt.iv), //The initialization vector you used to encrypt
      // additionalData: ArrayBuffer, //The addtionalData you used to encrypt (if any)
      tagLength: 128, //The tagLength you used to encrypt (if any)
    },
      key, //from generateKey or importKey above
      opt.data //ArrayBuffer of the data
    )
      .then(decrypted => {
        //returns an ArrayBuffer containing the decrypted data
        opt.callback(decrypted);
      })
      .catch(err => {
        console.error(err);
      });
  });
}
