import { Page1, Hello, UserPage, RolePage, Drag, Echarts, Tree } from "../pages";
export default {
  layout: {
    meta: {
      title: "中心",
    },
  },
  hello: {
    meta: {
      title: "首页",
      icon: 'a-1shouye'
    },
    component: Hello,
    title: '首页',
  },
  sys: {
    meta: {
      title: "系统管理",
      icon: 'a-9jichushezhi'
    },
  },
  user: {
    meta: {
      title: "用户管理",
      icon: 'yonghuguanli1'
    },
    title: '用户管理',
    component: UserPage,
  },
  role: {
    meta: {
      title: "角色管理",
      icon: 'anpaishishijingli'
    },
    title: '角色管理',
    component: RolePage,
    state: { a: 1111 },
  },
  test: {
    meta: {
      title: "网络测试",
      icon: 'a-6baogaomoban'
    },
    title: '网络测试',
    component: Page1
  },
  drag: {
    meta: {
      title: '拖拽模块',
      icon: 'a-1wodemokuai'
    },
    title: '拖拽模块',
    component: Drag
  },
  tree: {
    meta: {
      title: "树组件",
      icon: 'a-5jiancecanshu'
    },
    title: '树组件',
    component: Tree
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
      title: "Echarts图",
      icon: 'zidingyi15'
    },
    title: 'Echarts图',
    component: Echarts
  },
};
