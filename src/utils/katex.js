import katex from 'katex'

export function convertLatex(text) {
  const regex = /\$\$[^$]*\$\$|\$[^$]*\$/g
  const matchArr = text.match(regex) || []

  matchArr.forEach(match => {
    const isBlock = match[1] === '$'
    const tex = isBlock ? match.slice(2, -2) : match.slice(1, -1)

    try {
      let html = katex.renderToString(tex)
      if (isBlock) {
        html = `<p class="katex-box">${html}<p>`
      }
      text = text.replace(match, html)
    } catch (e) {
      console.log(e)
    }
  })
  return text
}
