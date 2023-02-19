import { useRef, useEffect, useReducer, useMemo, memo } from 'react'
import { SwitchTransition, TransitionGroup, CSSTransition } from 'react-transition-group'
import { useLocation, useOutlet } from 'react-router-dom'
import { globalStore } from "@/stores/index";
import styles from './index.module.scss'
import type { tabsType } from './keepAlive.d'


const KeepAlive = (props: {
  include: any;
  keys: tabsType
}) => {
  const outlet = useOutlet()
  const { include, keys } = props
  const { animationControl } = globalStore // 动画控制
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
    forceUpdate()
  }, [cacheKey, include]) // eslint-disable-line
  // in={animationControl}

  return (
    <TransitionGroup components={null}>
      {Array.from(componentList.current).map(([key, component]) => (
        <CSSTransition
          key={key}
          in={false}
          appear={true}
          timeout={{
            appear: 500,
            enter: 300,
            exit: 500,
          }}
          classNames={{
            // appear: styles.fade_enter,
            // appearActive: styles.fade_appear_active,
            // appearDone: styles.fade_enter_done,
            // enter: styles.fade_enter,
            // enterActive: styles.fade_enter_active,
            // enterDone: styles.fade_enter_done,
            exit: styles.fade_exit,
            exitActive: styles.fade_exit_active,
            exitDone: styles.fade_exit_done,
          }}
          onEnter={el => console.log('开始进入')}
          onEntering={el => console.log('正在进入')}
          onEntered={el => console.log('进入完成')}
          onExit={el => console.log('开始退出')}
          onExiting={el => console.log('退出状态')}
          onExited={() => console.log('完成退出')}
          style={{ display: key === activeKey.current ? '' : 'none', height: activeKey.current ? 'calc(100% - 64px)' : '0', background: '#fff'}}
        >
          {key === activeKey.current ? (
            <div className={`${styles.layout_container} ${styles.keep_alive_fade} `} style={{height: '100%'}}>{component}</div>
          ) : (
            <div style={{ display: 'none' }}>{component}</div>
          )}
        </CSSTransition>
      ))}
      </TransitionGroup>
  )
}

export default memo(KeepAlive)
