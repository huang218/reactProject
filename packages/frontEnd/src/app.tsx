import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { createRouteData, routeData } from "@/router/index";
import { observer } from "mobx-react";
import { getPermissions, getGlobalConfig } from "./service";
import { globalStore } from "@/stores/index";
import Errors from '@/pages/error/404';
import Login from "./pages/login";
import Layout from "./pages/layout";
import { useTranslation } from 'react-i18next';
import "./i18n/config";

export default observer(() => {
  const { t } = useTranslation();
  const { pathname } = useLocation()
  const { language, setRouterData, setPermissions } = globalStore;
  const [routerData, setRouter] = useState<any>();
  const navigate = useNavigate();

  const token = sessionStorage.getItem("ACCESS_TOKEN");


  const toRenderRoute = (item) => {
    const { children } = item;
    let arr = [];
    if (children) {
      arr = children.map((item) => {
        return toRenderRoute(item);
      });
    }
    return (
      <Route
        children={arr}
        key={item.path}
        path={item.path}
        element={item.element}
      />
    );
  };
  const routeTo = (data) => {
    const info = data;
    info.map(item => {
      if(item?.children) {
        routeTo(item.children);
      }
      if(item?.meta?.text) {
        item.meta.title = t(item.meta.text)
      }
    })
    return info
  }

  const toStart = (data)=>{
    let temp = createRouteData(data);
    routeTo(temp)
    sessionStorage.setItem("PER", data);
    setRouter(temp);
    setRouterData(temp);
    if(typeof data === 'string') {
      data = data.split(',')
    }
    setPermissions(data);
  }

  useEffect(() => {
    if (globalStore.token || token) {
      sessionStorage.setItem("ACCESS_TOKEN", globalStore.token || token);
      let config = sessionStorage.getItem("GLOBAL_CONFIG")
      if(!config) {
        getGlobalConfig().then(res => {
          const { componentsSize, themeColor, userImage } = res.data
          sessionStorage.setItem("GLOBAL_CONFIG", JSON.stringify(res.data))
          globalStore.setColor(themeColor);
          globalStore.setComponents(componentsSize);
          globalStore.setUserImage(userImage);
          // globalStore.setLanguage(language);
        })
      }else {
        globalStore.setColor(JSON.parse(config).themeColor);
        globalStore.setComponents(JSON.parse(config).componentsSize);
        globalStore.setUserImage(JSON.parse(config).userImage);
        // globalStore.setLanguage(JSON.parse(config).language);
      }
      let name = sessionStorage.getItem("USERNAME")
      if(!name) {
        // 没有用户名~ 请求。。。
      }

      let per = sessionStorage.getItem("PERMISSIONS")
      if (!per) {
        getPermissions()
          .then((res) => {
            const { data } = res;
            sessionStorage.setItem("PERMISSIONS", data);
            toStart(data)
          })
          .finally(() => {
            navigate("/layout/hello");
          });
      }else{
        toStart(per)
      }
    } else {
      navigate("/");
      setRouter(routeData);
      setRouterData(routeData);
    }
  }, [token, globalStore.token]);

  useEffect(() => {
    let per = sessionStorage.getItem("PERMISSIONS")
    toStart(per)
  },[language])

  return (
    <>
      {routerData?.length && (
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route
            path="/layout"
            element={<Layout></Layout>}
            children={routerData?.[1]?.children?.map((item) => {
              return toRenderRoute(item);
            })}
          ></Route>
          {/* 404页面处理 */}
          <Route path="*" element={<Errors />} />
        </Routes>
      )}
    </>
  );
});
