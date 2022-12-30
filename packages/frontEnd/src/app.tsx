import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { globalStore } from "@/stores/index";
import { createRouteData, routeData } from "@/router/index";
import { observer } from "mobx-react";
import { getPermissions, getGlobalConfig } from "./service";
import Login from "./pages/login";
import Center from "./pages/center";

export default observer(() => {
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
      let per = sessionStorage.getItem("PERMISSIONS")
      if (!per) {
        getPermissions()
          .then((res) => {
            const { data } = res;
            sessionStorage.setItem("PERMISSIONS", data);
            toStart(data)
          })
          .finally(() => {
            navigate("/center/hello");
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
      ></Route>
    );
  };

  return (
    <>
      {routerData && (
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route
            path="/center"
            element={<Center></Center>}
            children={routerData?.[1]?.children?.map((item) => {
              return toRenderRoute(item);
            })}
          ></Route>
        </Routes>
      )}
    </>
  );
});
