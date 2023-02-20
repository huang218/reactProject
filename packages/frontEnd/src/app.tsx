import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { globalStore } from "@/stores/index";
import { createRouteData, routeData } from "@/router/index";
import { observer } from "mobx-react";
import { getPermissions, getGlobalConfig } from "./service";
import Errors from '@/pages/error/404';
import Login from "./pages/login";
import Layout from "./pages/layout";

export default observer(() => {
  const { pathname } = useLocation()
  const { setRouterData, setPermissions } = globalStore;
  const [routerData, setRouter] = useState<any>();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("ACCESS_TOKEN");

  useEffect(() => {
    if (globalStore.token || token) {
      sessionStorage.setItem("ACCESS_TOKEN", globalStore.token || token);
      const toStart = (data)=>{
        let temp = createRouteData(data);
        sessionStorage.setItem("PER", data);
        setRouter(temp);
        setRouterData(temp);
        if(typeof data === 'string') {
          data = data.split(',')
        }
        setPermissions(data);
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
      let config = sessionStorage.getItem("GLOBAL_CONFIG")
      if(!config) {
        getGlobalConfig().then(res => {
          const { componentsSize, themeColor } = res.data
          sessionStorage.setItem("GLOBAL_CONFIG", JSON.stringify(res.data))
          globalStore.setColor(themeColor);
          globalStore.setComponents(componentsSize);
        })
      }else {
        globalStore.setColor(JSON.parse(config).themeColor);
        globalStore.setComponents(JSON.parse(config).componentsSize);
      }
    } else {
      navigate("/");
      setRouter(routeData);
      setRouterData(routeData);
    }
  }, [token, globalStore.token]);

  // 封装一层 专门负责显示页面标题
  // const DomTitle = ({item}) => {
    // const data = item
    // let route: any = {};
    // if(data?.children?.length > 0){
    //   data?.children.forEach(h =>{
    //     if(h.path === pathname) {
    //       route = h
    //     }
    //   })
    // }else {
    //   route = data
    // }
    // console.log(item,'标题',route)
  //   document.title = item.title;
  //   return item.element
  // }
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

  return (
    <>
      {routerData && (
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
