import "react";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Button, message, Space, Table, Tag } from "antd";
import UpdateUser from "./components/updateUser";
import { getUser, deleteUser } from './service'
import styles from './index.module.scss'
import SearchForm from "./components/searchForm";


interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "用户编号",
    dataIndex: "id",
    key: "id",
    width: '100px',
    render: (_, row, index) => <a>{index}</a>,
  },
  {
    title: "用户名称",
    dataIndex: "userName",
    key: "userName",
    // width: '100px',
    render: (text) => <a>{text}</a>,
  },
  {
    title: "操作列",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

export default () => {

  const [isModel, setIsModel] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onClose = () => {
    setIsModel(!isModel);
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const delUser = () => {
    if(!selectedRowKeys.length) {
      message.warning('请选择一条数据!')
      return
    }
    deleteUser(selectedRowKeys).then(res => {
      search()
    })
  }

  const search = () => {
    setLoading(true);
    getUser().then(res => {
      setData(res.data)
      setLoading(false);
      console.log(res,'info')
    }).catch(err => {
      setLoading(true);
    })
  }

  useEffect(() => {
    search()
  },[])

  return (
    <div>
      {/* <SearchForm /> */}
      <div className={styles.btn}>
        <Button type="primary" onClick={onClose}>新增</Button>
        <Button type="dashed" onClick={delUser}>删除</Button>
      </div>
      <Table rowKey="id" loading={loading} rowSelection={rowSelection} columns={columns} dataSource={data} />
      <UpdateUser open={isModel} onClose={onClose} search={search} />
    </div>
  )
}
