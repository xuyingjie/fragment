
const DOMAIN = window.location.origin

export async function fetchText(key) {
  try {
    const res = await fetch(`${DOMAIN}/${key}.md`)
    return await res.text()
  } catch (e) {
    console.log(e)
  }
}
