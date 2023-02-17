import { Login, Center, Page1, Hello, UserPage, RolePage } from "../pages";
export default {
  center: {
    meta: {
      title: "中心",
    },
  },
  hello: {
    meta: {
      title: "首页",
    },
    component: Hello,
    title: '首页'
  },
  sys: {
    meta: {
      title: "系统管理",
    },
  },
  user: {
    meta: {
      title: "用户管理",
    },
    title: '用户管理',
    component: UserPage,
  },
  role: {
    meta: {
      title: "角色管理",
    },
    title: '角色管理',
    component: RolePage,
    state: { a: 1111 },
  },
  test: {
    meta: {
      title: "网络测试",
    },
    title: '网络测试',
    component: Page1
  },
  test1: {
    meta: {
      title: "测试一",
    },
    title: '测试一',
    component: Page1
  },
  test2: {
    meta: {
      title: "测试二",
    },
    title: '测试二',
    component: Page1
  },
  test3: {
    meta: {
      title: "测试三",
    },
    title: '测试三',
    component: Page1
  },
};
