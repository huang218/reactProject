import { action, makeAutoObservable, toJS } from "mobx";
import type { Location } from "react-router-dom";
import type { SizeType } from 'antd/es/config-provider/SizeContext';

// Model the application state.
class Global {
  routerData = null;
  token = "";
  tabsHistory: { [key: string]: Location } = {};
  permissions: any[] = [];
  componentsSize: SizeType = "small";
  themeColor = "#972626"


  constructor() {
    makeAutoObservable(this);
  }
  init() {
    this.routerData = [];
    this.token = "";
    this.tabsHistory = {};
    this.permissions = [];
  }
  setRouterData = (data) => {
    this.routerData = data;
  };
  setToken = (token: string) => {
    this.token = token;
  };
  addTabHistory = (newItem: Location) => {
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
  }
  setColor = (color) => {
    this.themeColor = color
  }
}

export default new Global();
