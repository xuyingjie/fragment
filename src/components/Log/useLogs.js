import { useState, useCallback } from 'react'
import { getList, put, createKey, del } from '../../utils/index'

export function useLogs() {
    const [logs, setLogs] = useState([])
    const [nextMarker, setNextMarker] = useState('')

    const handleFetch = async (marker) => {
        const data = await getList(marker)
        setNextMarker(data.nextMarker)

        const list = data.map(item => {
            const arr = item.text.split(',')
            if (item.size > 30) {
                const [last, name, type] = arr
                return { ...item, last: +last, name, type }
            } else {
                const [last, text] = arr
                return { ...item, last: +last, text }
            }
        })
        return list
    }

    const initLogs = useCallback(async () => {
        const list = await handleFetch()
        setLogs(list)
    }, [])

    const fetchMoreLogs = useCallback(async () => {
        const list = await handleFetch(nextMarker)
        setLogs([...logs, ...list])
    }, [logs, nextMarker])

    const addLog = async (text) => {
        text = text.trim()
        if (text) {
            const key = await createKey(`${Date.now()},${text}`)
            await put({ key })
            initLogs()
        }
    }

    const deleteLog = (() => {
        let last = 0
        return async (key) => {
            const now = Date.now()
            if (now - last > 200) return last = now

            await del(key)
            setLogs(logs.filter(log => log.key !== key))
        }
    })()

    return {
        logs,
        nextMarker,

        initLogs,
        fetchMoreLogs,
        addLog,
        deleteLog,
    }
}

// function reducer(state, action) {
//     switch (action.type) {
//         case 'INIT_LOGS':
//             return { ...state, logs: action.list }
//         case 'MORE_LOGS':
//             return { ...state, logs: [...state.logs, ...action.list] }
//         case 'DELETE_LOG':
//             return { ...state, logs: state.logs.filter(log => log.key !== action.key) }
//         case 'SET_NEXT_MARKER':
//             return { ...state, nextMarker: action.nextMarker }
//         default:
//             throw new Error()
//     }
// }
