import "react";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';
import UpdateUser from "./components/updateUser";
import useTranslationEnum from "@/common/hooks/useTranslationEnum";
import { useTranslation } from "react-i18next";
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

export default () => {
  const { confirm } = Modal;
  const { t } = useTranslation();
  const [isModel, setIsModel] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const columns: ColumnsType<DataType> = [
    {
      title: t('sys.user.user_num'),
      dataIndex: "id",
      key: "id",
      width: '100px',
      render: (_, row, index) => <a>{index + 1}</a>,
    },
    {
      title: t('sys.user.user_name'),
      dataIndex: "userName",
      key: "userName",
      // width: '100px',
      render: (text) => <a>{text}</a>,
    },
    {
      title: t('sys.user.user_option'),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>{t('common.del')}</a>
        </Space>
      ),
    },
  ];

  const onClose = () => {
    setIsModel(!isModel);
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showDeleteConfirm = () => {
    if(!selectedRowKeys.length) {
      message.warning(t('common.null_value'))
      return
    }
    confirm({
      title: t('common.del_msg_pointer'),
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      okText: t('common.confirm'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk() {
        deleteUser(selectedRowKeys).then(res => {
          message.success(t(`server.${res.data._msg}`));
          search()
        })
      },
      onCancel() {
        console.log('Cancel');
      }
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
    <>
      {/* <SearchForm /> */}
      <div className={styles.btn}>
        <Button type="primary" onClick={onClose}>{useTranslationEnum('common.add')}</Button>
        <Button type="dashed" onClick={showDeleteConfirm}>{useTranslationEnum('common.del')}</Button>
      </div>
      <div className={styles.tableUser}>
        <Table rowKey="id" loading={loading} rowSelection={rowSelection} columns={columns} dataSource={data} />
        <UpdateUser open={isModel} onClose={onClose} search={search} />
      </div>
    </>
  )
}
