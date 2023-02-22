import "react";
import { useEffect, useState } from "react";
import { Divider, Input, message, Segmented } from 'antd';
import { Drawer } from 'antd';
import { globalStore } from "@/stores/index";
import { observer } from "mobx-react";
import UploadImage from '@/common/components/uploadImage';
import { updateConfig } from '../../service'
import styles from "./index.module.scss";

export default observer(({
  open,
  onClose
}) => {
  const [value, setValue] = useState<string | number>(globalStore.componentsSize);
  
  const onChange = ( target ) => {
    console.log(target,'target')
    setValue(target);
    globalStore.setComponents(target);
    updateGlobalConfig()
  };

  const colorPickup = (e) => {
    globalStore.setColor(e.target.value)
  }

  const updateGlobalConfig = () => {
    const { componentsSize, themeColor, userImage } = globalStore
    updateConfig({
      componentsSize,
      themeColor,
      userImage
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
      width="400"
      closable={false}
      onClose={onClose}
      open={open}
    >
      <div className={styles.layout}>
        <div className={styles.name}>主题颜色：</div>
        <Input 
          type="color" 
          name="color" 
          defaultValue={globalStore.themeColor} 
          className={styles.inputColor} 
          onChange={colorPickup} 
          onBlur={updateGlobalConfig}
        />
      </div>
      <Divider />
      <div className={styles.layout}>
        <div className={styles.name}>组件大小：</div>
        <Segmented block options={['small', 'middle', 'large']} value={value} onChange={onChange} />
      </div><Divider />
      <div className={styles.layout}>
        <div className={styles.name}>头像上传：</div>
        <UploadImage update={updateGlobalConfig} />
      </div>
    </Drawer>
  );
});