import { get, put, createKey } from './index'

export async function upload({ files, onprogress }) {
    const readAndUpload = async (file) => {
        const info = `${Date.now()},${file.name.trim()},${file.type}`
        const key = await createKey(info)
        const data = await readAsArrayBuffer(file)
        return await put({
            key,
            data,
            onprogress,
        })
    }
    const status = await Promise.all([...files].map(readAndUpload))
    // console.log(status)
    return status
}

function readAsArrayBuffer(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsArrayBuffer(file)
    })
}

export async function download({ key, name, type, onprogress }) {
    try {
        const link = document.createElement('a')
        link.download = name
        link.href = await readAsBlobURL({ key, type, onprogress })
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (e) {
        console.log(e)
    }
}

export async function readAsBlobURL({ key, type, onprogress }) {
    try {
        const data = await get({ key, onprogress })
        const blob = new Blob([data], { type })
        return URL.createObjectURL(blob)
    } catch (e) {
        console.log(e)
        return ''
    }
}
