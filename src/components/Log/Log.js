import React, { useState, useRef, useEffect } from 'react'
import HyperText from './HyperText'
import { useLogs } from './useLogs'

import { download } from '../../utils/file'
import { formatTime } from '../../utils/date'

function Log({ refresh, preview }) {
  const { logs, nextMarker, initLogs, fetchMoreLogs, addLog, deleteLog } = useLogs()

  const [textNode, setTextNode] = useState(null)
  async function handleSave(e) {
    e.preventDefault()
    await addLog(textNode.value)
    textNode.value = ''
  }

  // 当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染。
  const progressNodeList = useRef([])
  async function handleDownload({ key, name, type }, index) {
    download({
      key, name, type,
      onprogress: (e) => {
        if (e.lengthComputable) progressNodeList.current[index].style.width = (e.loaded === e.total) ? 0 : e.loaded / e.total * 100 + '%'
      }
    })
  }

  useEffect(() => {
    initLogs()
  }, [initLogs, refresh])

  return (
    <div className="log">
      <form onSubmit={handleSave}>
        <textarea ref={setTextNode} />
        <input type="submit" className="button" value="保存" />
      </form>

      <div className="post-content">
        {logs.map((item, index) => (
          <p key={item.key}>
            {
              item.size > 30 ?
                <>
                  {preview && item.type.match(/image|video/) && (+item.size < 10 * 1024 * 1024) && <HyperText item={item} />}
                  <span className="assets">
                    <strong className="pointer" onClick={() => handleDownload(item, index)}>{item.name}</strong>
                    <i className="progress" ref={node => { progressNodeList.current[index] = node }}></i>
                  </span>
                </>
                :
                item.text
            }
            <sub> {formatTime(item.last)} <span onClick={() => deleteLog(item.key)}>✖</span></sub>
          </p>
        ))}

        {nextMarker &&
          <p>
            <strong className="pointer" onClick={fetchMoreLogs}>加载更多</strong>
            <span role="img" aria-label="more">🌿</span>
          </p>
        }
      </div>
    </div>
  )
}

export default Log
