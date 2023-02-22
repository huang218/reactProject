import "react";
import { ConfigProvider } from "antd";
import { globalStore } from '@/stores/index'
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
        componentSize={globalStore.componentsSize}
      >
        <Comp {...props} />
      </ConfigProvider>
    );
  });
};
