import { action, makeAutoObservable, toJS } from "mobx";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { tabsType } from '../common/hocs/keepAlive/keepAlives'

// Model the application state.
class Global {
  routerData = null;
  token = "";
  userName = sessionStorage.getItem("USERNAME");
  userImage = "";
  tabsHistory: tabsType = {};
  permissions: any[] = [];
  componentsSize: SizeType = "small";
  themeColor = "#972626";
  animationControl: Boolean = false;


  constructor() {
    makeAutoObservable(this);
  }
  init() {
    this.routerData = [];
    this.token = "";
    this.userName = "";
    this.userImage = "";
    this.tabsHistory = {};
    this.permissions = [];
    this.animationControl = false;
  }
  setRouterData = (data) => {
    this.routerData = data;
  };
  setToken = (token: string) => {
    this.token = token;
  };
  addTabHistory = (newItem: tabsType['keys']) => {
    let temp = toJS(this.tabsHistory);
    temp[newItem.pathname] = newItem;
    this.tabsHistory = temp;
  };
  deleteTabHistory = (pathName: string) => {
    let temp = toJS(this.tabsHistory);
    if (Object.values(temp).length > 1) {
      Reflect.deleteProperty(temp, pathName);
      this.tabsHistory = temp;
    }
  };
  setPermissions = (permissions) => {
    this.permissions = permissions;
  };
  setComponents = (type: SizeType) => {
    this.componentsSize = type
  };
  setColor = (color) => {
    this.themeColor = color
  };
  setAnimationControl = () => {
    this.animationControl = !this.animationControl
  };
  setUserName = (name) => {
    this.userName = name;
    sessionStorage.setItem("USERNAME", name)
  };
  setUserImage = (url) => {
    this.userImage = url;
  }
}

export default new Global();
