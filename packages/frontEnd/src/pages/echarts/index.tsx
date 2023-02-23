import { useEffect, useRef } from "react";
import RelayRef from "@/common/hocs/logProps/indexTwo";
import { Button } from "antd";
import internationalization from '@/common/hooks/useTranslationEnum';

const Test = () => {
  let refProps = useRef<any>('')
  let refPropsT = useRef<any>('')
  useEffect(() => {
    
  },[])

  return(
    <>
      <div>{internationalization('home.hot_recommended')}</div>
      <RelayRef label="142" ref={refProps}></RelayRef>
      <Button onClick={() => console.log(refProps.current.focus())}>refs</Button>
    </>
  )
}

export default Test;
