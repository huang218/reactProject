import "react";
import { useEffect, useState } from "react";
import i18n from 'i18next';
import { Divider, Input, message, Segmented } from 'antd';
import { Drawer } from 'antd';
import { observer } from "mobx-react";
import *as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import UploadImage from '@/common/components/uploadImage';
import useTranslationEnum from "@/common/hooks/useTranslationEnum";
import { globalStore } from "@/stores/index";
import { updateConfig } from '../../service'
import styles from "./index.module.scss";

const enmu = {
  '中文': 'zh',
  'English': 'en'
}

export default observer(({
  open,
  onClose
}) => {
  const [value, setValue] = useState<string | number>(globalStore.componentsSize);
  const [language, setLanguage] = useState<string>('中文')
  
  // 切换除路由之外的语言
  const changeLanguage = (val) => {
    i18n.changeLanguage(val);
  }
  const onChange = (target) => {
    setValue(target);
    globalStore.setComponents(target);
    updateGlobalConfig()
  };
  const internationalization = (target) => {
    dayjs.locale('zh-cn')
    let languageType = enmu[target];
    setLanguage(target);
    globalStore.setLanguage(languageType)
    changeLanguage(languageType)
  }

  const colorPickup = (e) => {
    globalStore.setColor(e.target.value)
  }

  const updateGlobalConfig = () => {
    const { componentsSize, themeColor, userImage } = globalStore
    updateConfig({
      componentsSize,
      themeColor,
      userImage,
      language
    }).then(res => {
      message.success(res.data.msg)
      sessionStorage.setItem("GLOBAL_CONFIG", JSON.stringify({ componentsSize, themeColor, userImage }))
    })
  }

  return (
    <Drawer
      title={useTranslationEnum('global.title')}
      placement="right"
      key="right"
      width="400px"
      closable={false}
      onClose={onClose}
      open={open}
    >
      <div className={styles.layout}>
        <div className={styles.name}>{useTranslationEnum('global.color')}：</div>
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
        <div className={styles.name}>{useTranslationEnum('global.size')}：</div>
        <Segmented block options={['small', 'middle', 'large']} value={value} onChange={onChange} />
      </div>
      <Divider />
      <div className={styles.layout}>
        <div className={styles.name}>{useTranslationEnum('global.upload')}：</div>
        <UploadImage update={updateGlobalConfig} />
      </div>
      <Divider />
      <div className={styles.layout}>
        <div className={styles.name}>{useTranslationEnum('global.language')}：</div>
        <Segmented block options={['中文', 'English']} value={language} onChange={internationalization} />
      </div>
    </Drawer>
  );
});