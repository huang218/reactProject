import { DataNode } from 'antd/es/tree';
import * as React from 'react';
import TreeNode from './components/tree';

let treeData: DataNode[] = [
  {
    "title": "0-0",
    "key": "0-0",
    "children": [
        {
          "title": "0-0-0",
          "key": "0-0-0",
          "children": [
            {
              "title": "0-0-0-0",
              "key": "0-0-0-0",
            },
            {
              "title": "0-0-0-1",
              "key": "0-0-0-1",
            },
            {
              "title": "0-0-0-2",
              "key": "0-0-0-2",
            }
          ]
        },
        {
          "title": "0-0-1",
          "key": "0-0-1",
          "children": [
            {
              "title": "0-0-1-0",
              "key": "0-0-1-0",
            },
            {
              "title": "0-0-1-1",
              "key": "0-0-1-1",
            },
            {
              "title": "0-0-1-2",
              "key": "0-0-1-2",
            }
          ]
        },
        {
          "title": "0-0-2",
          "key": "0-0-2",
        }
    ]
  },
  {
    "title": "0-2",
    "key": "0-2",
  }
]

const Tree = () => {

  const afterAdd = (...props) => {
    console.log(props,'新增后返回')
  }

  const afterEdit = (...props) => {
    console.log(props,'编辑后返回')
  }

  return(
    <div style={{width: '500px'}}>
      <TreeNode treeData={treeData} afterAdd={afterAdd} afterEdit={afterEdit} />
    </div>
  )
}

export default Tree;