import "react";
import { Input, message, RadioChangeEvent } from 'antd';
import { Drawer, Radio } from 'antd';
import { globalStore } from "@/stores/index";
import { observer } from "mobx-react";
import { updateConfig } from '../../service'
import styles from "./index.module.scss";

export default observer(({
  open,
  onClose
}) => {
  const optionsWithDisabled = [
    { label: 'small', value: 'small' },
    { label: 'middle', value: 'middle' },
    { label: 'large', value: 'large' },
  ];
  
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    globalStore.setComponents(value);
    updateGlobalConfig()
  };

  const colorPickup = (e) => {
    globalStore.setColor(e.target.value)
  }

  const updateGlobalConfig = () => {
    const { componentsSize, themeColor } = globalStore
    updateConfig({
      componentsSize,
      themeColor 
    }).then(res => {
      message.success(res.data.msg)
      sessionStorage.setItem("GLOBAL_CONFIG", JSON.stringify({ componentsSize, themeColor }))
    })
  }

  return (
    <Drawer
      title="全局设置"
      placement="right"
      key="right"
      closable={false}
      onClose={onClose}
      open={open}
    >
      <div className={styles.layout}>
        <span>组件大小：</span>
        <Radio.Group
          options={optionsWithDisabled}
          onChange={onChange}
          value={globalStore.componentsSize}
          optionType="button"
          buttonStyle="solid"
        />
      </div>
      <div className={styles.layout}>
        <span>主题颜色：</span>
        <Input 
          type="color" 
          name="color" 
          defaultValue={globalStore.themeColor} 
          className={styles.inputColor} 
          onChange={colorPickup} 
          onBlur={updateGlobalConfig}
        />
      </div>
    </Drawer>
  );
});