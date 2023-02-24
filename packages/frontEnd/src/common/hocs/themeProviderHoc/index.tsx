import "react";
import { ConfigProvider } from "antd";
import { globalStore } from '@/stores/index'
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { observer } from "mobx-react";

export default (Comp) => {
  return observer((props) => {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: globalStore.themeColor,
          },
        }}
        locale={globalStore.language === 'zh' ? zhCN : enUS}
        componentSize={globalStore.componentsSize}
      >
        <Comp {...props} />
      </ConfigProvider>
    );
  });
};
