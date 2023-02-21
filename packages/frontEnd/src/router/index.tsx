import { Suspense } from "react";
import { Login, Layout } from "../pages";
import routerConfig from "./config";
export const RouteIds = {
  hello: "hello",
  sys: "sys",
  role: "role",
  user: "user",
  test: "test",
  test1: "test1",
  test2: "test2",
  test3: "test3",
  drag: "drag",
  tree: "tree"
};

export const routesStructData = [
  {
    id: RouteIds.hello,
  },
  {
    id: RouteIds.sys,
    children: [{ id: RouteIds.role }, { id: RouteIds.user }, { id: RouteIds.test }],
  },
  {
    id: RouteIds.tree,
  },
  {
    id: RouteIds.drag,
  },
  {
    id: RouteIds.test3,
  },
];

const processRoute = (children: any[], routesData: any[], prefix: string) => {
  routesData.forEach((routeItem, index) => {
    const { id } = routeItem;
    if (permissions.includes(id)) {
      let routeData = routerConfig[id];
      // 沿途记录，然后拼接成path
      routeData.path = prefix + "/" + id;
      routeData.routeId = id;
      const { component: Component } = routeData;
      if (Component) {
        routeData.element = (
          <Suspense>
            <Component></Component>
          </Suspense>
        );
      }
      children!.push(routeData);
      if (routeItem.children!?.length > 0) {
        routeData.children = [];
        processRoute(routeData.children, routeItem.children!, routeData.path);
      }
    }
  });
};

// 中心路由
export let centerRouteDta = {
  id: RouteIds.hello,
  name: "中心",
  path: "/layout",
  element: (
    <Suspense>
      <Layout></Layout>
    </Suspense>
  ),
  children: [],
};

export let routeData = [
  {
    name: "登陆页",
    path: "/",
    element: <Login></Login>,
  },
  centerRouteDta,
];
let permissions = [];
export const createRouteData = (per) => {
  let result = [];
  permissions = per;
  processRoute(result, routesStructData, "/layout");
  centerRouteDta.children = [];
  centerRouteDta.children = result;
  return routeData;
};

export default routeData;
