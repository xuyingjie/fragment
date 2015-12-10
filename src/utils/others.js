
// textarea 插入文本
export function insertText(obj, str) {
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

// File Type Icons
export function icons(type) {
  'use strict';

  switch (type) {
    case 'image/png':
    case 'image/jpeg':
    case 'image/vnd.microsoft.icon':
      return 'octicon octicon-file-media';
    case 'application/x-xz':
    case 'application/gzip':
    case 'application/zip':
      return 'octicon octicon-file-zip';
    case 'text/plain':
    case 'text/x-markdown':
    case 'application/msword':
    case 'application/vnd.oasis.opendocument.text':
      return 'octicon octicon-file-text';
    case 'application/pdf':
      return 'octicon octicon-file-pdf';
    default:
      return 'octicon octicon-file-binary';
  }
}
