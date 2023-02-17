import { useRef, useEffect, useReducer, useMemo, memo } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useLocation, useOutlet } from 'react-router-dom'
import styles from './index.module.scss'
import type { tabsType } from './keepAlive.d'


const KeepAlive = (props: {
  include: any;
  keys: tabsType
}) => {
  const outlet = useOutlet()
  const { include, keys } = props
  const { pathname } = useLocation()
  const componentList = useRef(new Map())
  const forceUpdate = useReducer((bool: any) => !bool, true)[1] // 强制渲染
  const cacheKey = useMemo(
    () => pathname + '__' + keys[pathname]?.pathname,
    [pathname, keys]
  ) // eslint-disable-line
  const activeKey = useRef<string>('')

  useEffect(() => {
    componentList.current.forEach(function (value, keys) {
      const _key = keys.split('__')[0]
      if (!include.includes(_key) || _key === pathname) {
        this.delete(keys)
      }
    }, componentList.current)

    activeKey.current = cacheKey
    if (!componentList.current.has(activeKey.current)) {
      componentList.current.set(activeKey.current, outlet)
    }
    console.log(activeKey.current,'componentList', componentList.current)
    forceUpdate()
  }, [cacheKey, include]) // eslint-disable-line

  return (
    <TransitionGroup component={null}>
      {Array.from(componentList.current).map(([key, component]) => (
        <CSSTransition 
          key={key}
          in={true}
          appear={ true }
          timeout={ 500 }
          unmountOnExit={true}
          classNames='fade'
          style={{ display: key === activeKey.current ? '' : 'none' , height: activeKey.current ? 'calc(100% - 64px)' : '0', background: '#fff'}}>
          {key === activeKey.current ? (
            <div className={`${styles.layout_container} ${styles.keep_alive_fade}`} style={{height: '100%'}}>{component}</div>
          ) : (
            <div className={`${styles.layout_container} ${styles.keep_alive}`} style={{ display: 'none' }}>{component}</div>
          )}
        </CSSTransition>
      ))}
    </TransitionGroup>
  )
}

export default memo(KeepAlive)
