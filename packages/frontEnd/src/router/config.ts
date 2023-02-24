import { NetworkTest, Hello, UserPage, RolePage, Drag, Echarts, Tree } from "../pages";
export default {
  layout: {
    meta: {
      title: "中心",
      text: 'route.centre'
    },
  },
  hello: {
    meta: {
      icon: 'a-1shouye',
      text: 'route.hello'
    },
    component: Hello,
    title: '首页', // 无用~展示
  },
  sys: {
    meta: {
      icon: 'a-9jichushezhi',
      text: 'route.system'
    },
  },
  user: {
    meta: {
      icon: 'yonghuguanli1',
      text: 'route.user'
    },
    title: '用户管理',
    component: UserPage,
  },
  role: {
    meta: {
      icon: 'anpaishishijingli',
      text: 'route.role'
    },
    title: '角色管理',
    component: RolePage,
    state: { a: 1111 },
  },
  networkTest: {
    meta: {
      icon: 'a-6baogaomoban',
      text: 'route.net_work'
    },
    title: '网络测试',
    component: NetworkTest
  },
  drag: {
    meta: {
      icon: 'a-1wodemokuai',
      text: 'route.drag_module'
    },
    title: '拖拽模块',
    component: Drag
  },
  tree: {
    meta: {
      icon: 'a-5jiancecanshu',
      text: 'route.tree_comp'
    },
    title: '树组件',
    component: Tree
  },
  test3: {
    meta: {
      icon: 'zidingyi15',
      text: 'route.echarts_picture'
    },
    title: 'Echarts图',
    component: Echarts
  },
};
