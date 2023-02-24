
import * as React from "react";
import { useState, useEffect } from "react";
import { Tabs } from "antd";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import useLocationListen from "@/common/hooks/useLocationListen";
import { globalStore } from "@/stores/index";
import routeConfig from "@/router/config";
import styles from "./index.module.scss";

// import {
//   arrayMove,
//   horizontalListSortingStrategy,
//   SortableContext,
// } from '@dnd-kit/sortable';
// import DraggableTabNode from './Drag'
// import { DragEndEvent, DragOverlay } from '@dnd-kit/core';
// import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';


export default observer(() => {
  const { t } = useTranslation()
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState("");
  const [items, setItems] = useState([]);
  // const [className, setClassName] = useState('');
  // const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

  useEffect(() => {
    let tabsHistory = Object.values(toJS(globalStore.tabsHistory));
    let data = tabsHistory.map((item) => {
      const { pathname } = item;
      let routeId = pathname.split("/").slice(-1)[0]
      const { meta } = routeConfig[routeId];
      return { label: t(meta.text), key: pathname, text: meta.text, closable: true };
    })
    // pathname !== '/center/hello'
    setItems(data);
  }, [globalStore.tabsHistory, globalStore.language]);

  // const onDragEnd = ({ active, over }: DragEndEvent) => {
  //   if (active.id !== over?.id) {
  //     setItems((prev) => {
  //       const activeIndex = prev.findIndex((i) => i.key === active.id);
  //       const overIndex = prev.findIndex((i) => i.key === over?.id);
  //       console.log(active,over,'拖动元素',arrayMove(prev, activeIndex, overIndex))
  //       setClassName('')
  //       return arrayMove(prev, activeIndex, overIndex);
  //     });
  //   }
  // };

  // const nodeClick = (nd: any) => {
  //   console.log(nd,'e')
  //   navigate(nd);
  // }

  useLocationListen((location) => {
    setActiveKey(location.pathname);
  });

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    navigate(newActiveKey);
  };

  return (
    <Tabs
      className={styles.content}
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      items={items}
      animated={{inkBar: true, tabPane: true}}
      hideAdd={true}
      onEdit={(e, action) => {
        const route = Object.keys(toJS(globalStore.tabsHistory))
        if(route.length === 1) return
        const routeIndex = route.findIndex(h => h == e)
        if(route.length - 1 === routeIndex && e === activeKey){
          navigate(route[routeIndex - 1])
        }else if(e === activeKey) {
          navigate(route[routeIndex + 1])
        }
        if (action == "remove") {
          globalStore.deleteTabHistory(String(e));
        }
      }}
    />
    // <Tabs
    //   className={className}
    //   items={items}
    //   renderTabBar={(tabBarProps, DefaultTabBar) => (
    //     <DndContext 
    //       sensors={[sensor]}
    //       onDragStart={res => {
    //         console.log({ onDragStartMove: res });
    //         // 自己打印看吧
    //       }} 
    //       onDragEnd={onDragEnd}>
    //       <SortableContext items={items.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
    //         <DefaultTabBar {...tabBarProps}>
    //           {(node) => (
    //             <DraggableTabNode
    //               {...node.props}
    //               key={node._owner.key}
    //               nodes={node}
    //               onActiveBarTransform={setClassName}
    //             >
    //               <div onClick={e => {
    //                 nodeClick(node._owner.key)
    //               }} className={styles.border}>
    //                 {node}
    //               </div>
    //             </DraggableTabNode>
    //           )}
    //         </DefaultTabBar>
    //       </SortableContext>
    //     </DndContext>
    //   )}
    // />
    
  );
});
