import { createElement } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Modal } from "antd";
import styles from "./index.module.scss";
import { globalStore } from "@/stores/index";
import {
  Outlet,
  useNavigate,
  useLocation,
  type Location,
} from "react-router-dom";
import { PoweroffOutlined, MenuUnfoldOutlined, MenuFoldOutlined, SettingOutlined } from '@ant-design/icons';
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import themeProviderHoc from "@/common/hocs/themeProviderHoc/index";
import Tabs from "./components/tabs";
import Breadcrumb from "./components/breadcrumb";
import GlobalConfig from "./components/globalConfig";
import useLocationListen from "@/common/hooks/useLocationListen";
import KeepAlive from "@/common/hocs/keepAlive";
import routerConfig from "@/router/config";
const { Header, Content, Sider } = Layout;

const processRoute = (data, result: any) => {
  data.forEach((item) => {
    let temp: any = {
      key: item.routeId,
      icon: createElement(UserOutlined),
      label: item.meta.title,
    };
    result.push(temp);
    if (item?.children?.length) {
      temp.children = [];
      processRoute(item.children, temp.children);
    }
  });
};

const center = observer(() => {
  const navigate = useNavigate();
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([]);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false);
  const { routerData = [] } = globalStore;


  useLocationListen((location: Location) => {
    const { pathname } = location;
    let temp = pathname.split("/").filter((item) => {
      return item;
    });
    setDefaultSelectedKeys([temp.slice(-1)[0]]);
    let temp2 = temp.slice(1, temp.length - 1);
    if (temp2.length) {
      setDefaultOpenKeys(temp2);
    }
    globalStore.addTabHistory(location);
  });
  // 路由监听
  let location = useLocation();
  useEffect(() => {}, [location]);
  useEffect(() => {
    if (routerData.length) {
      let result = [];
      processRoute(routerData[1].children, result);
      setMenuData(result);
      console.log(routerData,'routerData',result)
    }
  }, [routerData]);

  const loginOut = () => {
    Modal.confirm({
      title: "是否退出登录？",
      cancelText: '取消',
      okText: '确定',
      // content: "更新权限之后，需要重新登陆",
      onOk: () => {
        sessionStorage.removeItem("ACCESS_TOKEN");
        sessionStorage.removeItem("PER");
        sessionStorage.removeItem("PERMISSIONS");
        sessionStorage.removeItem("GLOBAL_CONFIG");
        globalStore.init()
        navigate("/");
      },
    });
  }

  const config = () => {
    setOpen(!open)
  }

  
  return (
    <Layout className={styles.content}>
      <Header className="header">
        <div className={styles.head}>
          <div>
            <div className={styles.logo}>Moderate admin React</div>
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: styles.loginOut,
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <div>
            <SettingOutlined title="配置" className={styles.loginOut} onClick={config} />
            <PoweroffOutlined title="退出" className={styles.loginOut} onClick={loginOut} />
          </div>
        </div>
        
      </Header>
      <Layout>
        <Sider width={260} collapsed={collapsed} className={styles.siders}>
          {menuData.length > 0 && (
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={defaultSelectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              style={{ height: "100%" }}
              items={menuData}
              onClick={({ key }) => {
                const path = routerConfig[key]?.path;
                if (path) {
                  navigate(path);
                }
              }}
            />
          )}
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb />
          <Content
            className="site-layout-background"
            style={{ margin: 0, minHeight: 280 }}
          >
            <Tabs></Tabs>
            <div style={{ padding: 32, background: "white", height: 'calc(100% - 40px)' }}>
              <KeepAlive include={["/center/sys/user", "/center/sys/role"]} keys={[]}></KeepAlive>
            </div>
          </Content>
        </Layout>
        <GlobalConfig open={open} onClose={config} />
      </Layout>
    </Layout>
  );
});

export default themeProviderHoc(center);
