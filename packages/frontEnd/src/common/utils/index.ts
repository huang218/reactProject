import type { RouteKeyT } from "@/permissions/routerConfig";
export const UUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const addCodeToPermission = <T>(data: any) => {
  let num = 0;
  for (let key in data) {
    const item = data[key as RouteKeyT];
    item.code = 2 ** num+"";
    item.name = key;
    num++;
  }
  return data;
};
// ip-v4
export const ipReg = /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/
