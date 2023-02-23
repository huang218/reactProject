import { lazy } from "react";
const Layout = lazy(() => import("./layout"));
const Login = lazy(() => import("./login"));
const NetworkTest = lazy(() => import("./networkTest"));
const Hello = lazy(() => import("./hello"));
const UserPage = lazy(() => import("./sys/user"));
const RolePage = lazy(() => import("./sys/role"));
const Drag = lazy(() => import("./drag"));
const Echarts = lazy(() => import("./echarts"));
const Tree = lazy(() => import("./tree"));
export { 
    Layout, 
    Login, 
    NetworkTest, 
    Hello, 
    UserPage, 
    RolePage,
    Drag,
    Echarts,
    Tree
};
