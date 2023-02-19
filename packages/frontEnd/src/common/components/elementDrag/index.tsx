import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/css';
import styles from './index.module.scss'

type PropsType = {
  /** 需要传递的列表 */
  list: any[];
  /** list的key值，默认是id */
  idKey?: string;
  children: ReactNode;
  /** 拖拽结束的回调 */
  onDragEnd: (arr: any[], ids: string[]) => void;
  onClick: (data: any) => void;
};

/** 参考官网：https://docs.dndkit.com/presets/sortable */
/** 
 * 列表排序
 */
export const SortListDndKit = ({
  list = [],
  idKey = 'id',
  children,
  onDragEnd,
  onClick,
}: PropsType) => {
  // 指定传感器，默认是全部
  const sensors = useSensors(
    // useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  // 拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over.id) {
        const oldIndex = list.findIndex((item) => item[idKey] === active.id);
        const newIndex = list.findIndex((item) => item[idKey] === over.id);
        const ids: string[] = list.map((item) => item[idKey]);
        [ids[newIndex], ids[oldIndex]] = [ids[oldIndex], ids[newIndex]];
        const _val = arrayMove(list, oldIndex, newIndex);
        onDragEnd(_val, ids);
    }else {
        // 点击 / 未替换元素 触发
        const _val = list.filter(item => item.id === active.id)
        console.log(active,over,'dianji')
        onClick(_val[0])
    }
  };
  const gridFunc = () => {
    return(
        css`
            display: grid;
            grid-gap: 20px;
            grid-template-columns: repeat(${4}, ${100}px);
            grid-template-rows: repeat(${3}, ${100}px);
        `
    )
  }

  const classFun = () => {
    return(
        css`
            display: flex;
            justify-content: space-evenly;
            background: aliceblue;
            flex-direction: column;
            height: 100%;
            overflow-y: auto;
            max-height: 500px;
        `
    )
  }

  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
        <div className={gridFunc()}>
            <SortableContext items={list.map((item) => item[idKey])}>
                {children}
            </SortableContext>
        </div>
    </DndContext>
  );
};

type SortItemType = {
  id: string;
  children: ReactNode;
};

/**
 * 列表排序的子项
 * - 函数式组件作为children，需要用html元素包裹住
 * - 例：
 * - \<SortItemDndKit>
 * -   \<div>\<Text title='测试组件' />\</div>
 * - \</SortItemDndKit> 
 */
export const SortItemDndKit = ({ id, children }: SortItemType) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const newChild = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }
    // const newClick = () => {
    //     onClick && onClick()
    //     child.props?.onClick();
    // }
    const childProps = {
      ...child.props,
      ref: setNodeRef,
      style,
      ...attributes,
      ...listeners,
    //   onClick: newClick
    };
    return React.cloneElement(child, childProps);
  });
  return <>{newChild}</>;
};

