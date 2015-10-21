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

        var passwd, iv;
        if (opts.passwd) {
          passwd = opts.passwd;
          iv = opts.iv;
        } else {
          var user = JSON.parse(localStorage.user);
          passwd = user.passwd;
          iv = user.iv;
        }

        decrypt({
          passwd,
          iv,
          data: xhr.response,
          callback: decrypted => {
            if (opts.arrayBuffer) {
              opts.success(decrypted);
            } else {
              var str = arrayBufferToStr(decrypted);
              opts.success(JSON.parse(str));
            }
          }
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
  // var signature = b64_hmac_sha1(user.SK, StringToSign);
  // var s = `?AWSAccessKeyId=${user.AK}&Expires=${Date.now() + 3600000}&Signature=${signature}`;

  xhr.open('GET', `http://${bucket}.obs.cn-north-1.myhwclouds.com/${opts.key}`, true);

  // in firefox xhr.responseType must behind xhr.open
  xhr.responseType = 'arraybuffer';
  xhr.send(null);
}


function upload(opts) {
  'use strict';

  var user = JSON.parse(localStorage.user);
  var passwd = opts.passwd ? opts.passwd : user.passwd;
  var iv = user.iv;

  if (!opts.arrayBuffer) {
    opts.data = strToArrayBuffer(opts.data);
  }

  encrypt({
    passwd,
    iv,
    data: opts.data,
    callback: encrypted => {

      // new Blob([encList.buffer]) fast than new Blob([encList]) type不是必需的
      var blob = new Blob([encrypted], {
        type: 'application/octet-stream'
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
          ['eq', '$key', opts.key]
        ]
      };
      var policy = btoa(JSON.stringify(policyJson));
      var signature = b64_hmac_sha1(SK, policy);

      var formData = new FormData();
      formData.append('key', opts.key);
      formData.append('acl', "public-read");
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

      xhr.onload = function() {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            opts.success();
          }
        }
      };

      xhr.open('POST', `http://${bucket}.obs.cn-north-1.myhwclouds.com/`, true);
      xhr.send(formData);
    }
  });

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

function b64_hmac_sha1(k,d,_p,_z){
  'use strict';
  // heavily optimized and compressed version of http://pajhome.org.uk/crypt/md5/sha1.js
  // _p = b64pad, _z = character size; not used here but I left them available just in case
  if(!_p){_p='=';}if(!_z){_z=8;}function _f(t,b,c,d){if(t<20){return(b&c)|((~b)&d);}if(t<40){return b^c^d;}if(t<60){return(b&c)|(b&d)|(c&d);}return b^c^d;}function _k(t){return(t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514;}function _s(x,y){var l=(x&0xFFFF)+(y&0xFFFF),m=(x>>16)+(y>>16)+(l>>16);return(m<<16)|(l&0xFFFF);}function _r(n,c){return(n<<c)|(n>>>(32-c));}function _c(x,l){x[l>>5]|=0x80<<(24-l%32);x[((l+64>>9)<<4)+15]=l;var w=[80],a=1732584193,b=-271733879,c=-1732584194,d=271733878,e=-1009589776;for(var i=0;i<x.length;i+=16){var o=a,p=b,q=c,r=d,s=e;for(var j=0;j<80;j++){if(j<16){w[j]=x[i+j];}else{w[j]=_r(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);}var t=_s(_s(_r(a,5),_f(j,b,c,d)),_s(_s(e,w[j]),_k(j)));e=d;d=c;c=_r(b,30);b=a;a=t;}a=_s(a,o);b=_s(b,p);c=_s(c,q);d=_s(d,r);e=_s(e,s);}return[a,b,c,d,e];}function _b(s){var b=[],m=(1<<_z)-1;for(var i=0;i<s.length*_z;i+=_z){b[i>>5]|=(s.charCodeAt(i/8)&m)<<(32-_z-i%32);}return b;}function _h(k,d){var b=_b(k);if(b.length>16){b=_c(b,k.length*_z);}var p=[16],o=[16];for(var i=0;i<16;i++){p[i]=b[i]^0x36363636;o[i]=b[i]^0x5C5C5C5C;}var h=_c(p.concat(_b(d)),512+d.length*_z);return _c(o.concat(h),512+160);}function _n(b){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s='';for(var i=0;i<b.length*4;i+=3){var r=(((b[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((b[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((b[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>b.length*32){s+=_p;}else{s+=t.charAt((r>>6*(3-j))&0x3F);}}}return s;}function _x(k,d){return _n(_h(k,d));}return _x(k,d);
}
