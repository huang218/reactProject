import { lazy } from "react";
const Layout = lazy(() => import("./layout"));
const Login = lazy(() => import("./login"));
const Page1 = lazy(() => import("./page1"));
const Hello = lazy(() => import("./hello"));
const UserPage = lazy(() => import("./sys/user"));
const RolePage = lazy(() => import("./sys/role"));
const Drag = lazy(() => import("./drag"));
const Echarts = lazy(() => import("./echarts"))
export { 
    Layout, 
    Login, 
    Page1, 
    Hello, 
    UserPage, 
    RolePage,
    Drag,
    Echarts
};
