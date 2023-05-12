import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, InputRef, message, Tree } from 'antd';
import type { DataNode, DirectoryTreeProps, TreeProps } from 'antd/es/tree';
import styles from './index.module.scss'
import { css } from '@emotion/css';

interface Props {
  treeData: DataNode[];
  afterAdd: (props, data) => void;
  afterEdit: (props, data) => void;
}
interface tree extends TreeProps<any> {
  isShow?: Boolean;
  push?: (data) =>void
}
interface nodeType {
  title: string;
  key: string;
  isShow: Boolean;
  isAdd: Boolean;
}

// const x = 3;
// const y = 2;
// const z = 1;
// const defaultData: tree = [];

// const generateData = (_level: number, _preKey?: React.Key, _tns?: DataNode[]) => {
//   const preKey = _preKey || '0';
//   const tns = _tns || defaultData;

//   const children: React.Key[] = [];
//   for (let i = 0; i < x; i++) {
//     const key = `${preKey}-${i}`;
//     tns.push({ title: key, key, isShow: false, isAdd: false });
//     if (i < y) {
//       children.push(key);
//     }
//   }
//   if (_level < 0) {
//     return tns;
//   }
//   const level = _level - 1;
//   children.forEach((key, index) => {
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };
// generateData(z);

const App: React.FC<Props> = ({
  treeData,
  afterAdd,
  afterEdit
}) => {
  let inputVal = useRef<string>('')
  const inputRef = useRef<InputRef>(null);
  const [gData, setGData] = useState<any>(null); // tree数据
  const [selKey, setSelKey] = useState<any>(null) // 单选弹出操作栏
  const [expandedKeys] = useState(['0-0']);
  

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    // console.log(info);
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  const gridFunc = (num) => {
    return(
        css`
          transition: all .3s;
          transform: translateX(${num}px);
        `
    )
  }

  const Recursion = (data) => {
    data.map((item) => {
      if(!Reflect.has(item, 'isShow')) {
        item.isShow = false
      }
      if(!Reflect.has(item, 'isAdd')) {
        item.isAdd = false
      }
      if(item?.children) Recursion(item.children)
    })
  }

  useEffect(() => {
    Recursion(treeData)
    console.log(treeData, 'treeData')
    setGData(treeData)
  },[treeData])

  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...gData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setGData(data);
  };
  // 指定当前节点关闭或打开编辑
  const updateInput = (info, key, obj) => {
    const data = [...info];
    data.map(h => {
      if(h.children){
        updateInput(h.children, key, obj)
      }
      if(h.key === key){
        for(let i in obj){
          h[i] = obj[i]
        }
        return
      }else if(obj.isShow || obj.isAdd) {
        h.isShow = false;
        h.isAdd = false;
      }
    })
    setGData(data)
  }

  const addNode = (info, key, data) => {
    const node = [...info];
    node.map(h => {
      if(h.key === key){
        if(h?.children?.length) {
          h.children = [...h.children, data]
        }else {
          h.children = [{...data}]
        }
        setGData(node)
        return
      }
      if(h.children){
        addNode(h.children, key, data)
      }
    })
    setGData(node)
  }

  const delNode = (data, key) => {
    let result = [];
    data.forEach(item => {
      if (item.key !== key) {
        let children = item.children;
        if (children && children.length > 0) {
          item.children = delNode(children, key);
        }
        result.push(item);
      }else if(item.key === key && item?.children?.length) {
        result.push(item);
        message.warning('请先删除子节点')
      }
    });
    return result;
  }

  const addTree = (node, e?) => {
    if(e) {
      e.stopPropagation()
    }
    updateInput(gData, node.key, {isAdd: true})
    Promise.resolve().then(() => {
      inputRef.current!.focus({
        cursor: 'start',
      });
    })
  };

  const editTree = (node, e?) => {
    if(e) e.stopPropagation()
    inputVal.current = node.title
    //通过key递归打开编辑
    updateInput(gData, node.key, {isShow: true})
    Promise.resolve().then(() => {
      inputRef.current!.focus({
        cursor: 'end',
      });
    })
  }

  const deleteNode = (node, e?) => {
    if(e) e.stopPropagation()
    if(node.isShow || node.isAdd) {
      message.warning('请先完成新增/编辑操作！')
      return
    }
    if(gData?.length === 1 && !gData[0].children.length) return
    const data = delNode(gData, node.key)
    setGData(data)
  }

  const confirmEdit = (node, e?) => {
    if(e) e.stopPropagation()
    // 关闭编辑
    updateInput(gData, node.key, {isShow: false, title: inputVal.current})
    inputVal.current = ''
    afterEdit({title: inputVal.current, key: node.key}, gData)
  }

  const confirmAdd = (node, e?) => {
    if(e) e.stopPropagation()
    let _date = new Date().valueOf()
    if(inputVal.current) {
      addNode( gData, node.key, {title: inputVal.current, key: _date, isShow: false, isAdd: false })
    } 
    // 关闭编辑
    updateInput(gData, node.key, {isAdd: false})
    afterAdd({title: inputVal.current, key: _date, parentId: node.key}, gData)
    inputVal.current = ''
  }

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info: any) => {
    setSelKey(keys[0]);
  };

  return (
    <>
      <Tree
        className={styles.draggable_tree}
        defaultExpandedKeys={expandedKeys}
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        onSelect={onSelect}
        treeData={gData}
        titleRender={(node: nodeType) => {
          return(
            <>
              <div className={styles.title} key={node.key}>
                {node.isShow ? (
                  <></>
                ): (
                  <div className={styles.name} style={{marginRight: '10px'}}>{node?.title}</div>
                )}
                {node.isShow || node.isAdd ? (
                  <Input
                    ref={inputRef}
                    className={styles.inputs} 
                    defaultValue={inputVal.current} 
                    placeholder={node.isAdd ? '新增子节点' : ''} 
                    onChange={(e) => {
                      if(e) e.stopPropagation();
                      inputVal.current = e.target.value;
                    }} 
                    onPressEnter={(e) => {
                      if(e) e.stopPropagation();
                      node.isAdd ? confirmAdd(node) : node.isShow ? confirmEdit(node) : null;
                      setSelKey(node.key)
                    }}
                  />
                ) :(
                  <></>
                )}
              </div>
              <div className={node.key === selKey ? gridFunc(0) : gridFunc(80)}>
                {node.isAdd ? (
                  <span title='确认新增' style={{marginLeft: '10px'}} className={`iconfont icon-gou ${styles.hovers}`} onClick={(e) => confirmAdd(node, e)} />
                ) : !node.isShow ? (
                  <span title='新增' className={`iconfont icon-tianjia ${styles.hovers}`} onClick={(e) => addTree(node, e)} />
                ): (<></>)}
                {node.isShow ? (
                  <span title='确认编辑' style={{marginLeft: '10px'}} className={`iconfont icon-gou ${styles.hovers}`} onClick={(e) => confirmEdit(node, e)} />
                ) : !node.isAdd ?(
                  <span title='编辑' style={{marginLeft: '10px'}} className={`iconfont icon-bianji ${styles.hovers}`} onClick={(e) => editTree(node, e)} />
                ): (<></>)}

                <span style={{marginLeft: '10px'}} title='删除' className={`iconfont icon-shanchu ${styles.hovers}`} onClick={(e) => deleteNode(node, e)} />
              </div>
            </>
          )
        }}
      />
    </>
   
  );
};

export default App;