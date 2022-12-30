import "react";
import { Table, Form, Tree, Modal } from "antd";
import ModalForm from "./components/modalForm";
import { globalStore } from "@/stores/index";
import {
  BTN_PERMISSIONS,
  ActionsPermissionConfig,
  type BtnItemT,
} from "@/permissions/actionConfig";
import SearchForm from "./components/searchForm";
import type { ColumnsType } from "antd/es/table";
import { useEffect } from "react";
import { centerRouteDta, routesStructData } from "@/router/index";
import routerConfig from "@/router/config";
import { useState } from "react";
import { updatePermissions } from "./service";
import { useNavigate } from "react-router-dom";

interface DataType {
  key: string;
  name: string;
  id: string;
}

const data = [
  {
    key: "1",
    id: "1",
    name: "admin",
  },
  {
    key: "2",
    id: "2",
    name: "usr",
  },
];

const processPermission = (routesData: any[], newData: any[]) => {
  routesData.forEach((routeStructItem) => {
    const { id } = routeStructItem;
    let routeItem = routerConfig[id];
    routeItem.routeId = id;
    let item: any = {
      title: routeItem.meta.title,
      value: routeItem.routeId,
      key: routeItem.routeId,
    };
    newData.push(item);
    if (routeStructItem.children) {
      item.children = [];
      processPermission(routeStructItem.children, item.children);
    } else {
      item.children = [];
      if (routeItem.routeId in ActionsPermissionConfig) {
        const actionsPermissions =
          ActionsPermissionConfig[
            routeItem.routeId as keyof typeof ActionsPermissionConfig
          ];
        actionsPermissions.forEach((actionId) => {
          const btnConfig = BTN_PERMISSIONS[actionId.split(":")[1]];
          item.children?.push({
            title: btnConfig.title,
            value: actionId,
            key: actionId,
          });
        });
      }
    }
  });
};

export default(props) => {
  const { permissions } = globalStore;
  const [allPermissions, setPer] = useState<any>();
  const [checkedKeys, setCheckedKeys] = useState<any>(permissions);
  const navigate = useNavigate();

  const handleSubmit = () => {
    Modal.confirm({
      title: "确定么？",
      content: "更新权限之后，需要重新登陆",
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        if(Array.isArray(checkedKeys)){
          updatePermissions(checkedKeys).then(() => {
            sessionStorage.removeItem("ACCESS_TOKEN");
            sessionStorage.removeItem("PER");
            sessionStorage.removeItem("PERMISSIONS");
            sessionStorage.removeItem("GLOBAL_CONFIG");
            globalStore.init()
            navigate("/");
          });
        }
      },
    });
  };
  const onCheck = (checkedKeysValue: any) => {
    console.log('onCheck', checkedKeysValue.checked);
    setCheckedKeys(checkedKeysValue.checked);
  };

  useEffect(() => {
    let result = [];
    processPermission(routesStructData, result);
    setPer(result);
    console.log(result,'权限',permissions)
  }, []);


  const columns: ColumnsType<DataType> = [
    {
      title: "角色编号",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <ModalForm handleSubmit={handleSubmit}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onValuesChange={() => {}}
            size={"middle"}
          >
            <Form.Item label="权限" name="permission">
              <Tree
                checkStrictly={true}
                autoExpandParent={true}
                defaultCheckedKeys={permissions}
                checkable
                treeData={allPermissions}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
              />
            </Form.Item>
          </Form>
        </ModalForm>
      ),
    },
  ];
  return (
    <div>
      <div onClick={()=>{
        navigate("/center/sys/user")
      }}>test</div>
      <SearchForm />
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
