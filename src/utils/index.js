
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
