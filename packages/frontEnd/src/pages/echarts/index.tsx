import { useEffect, useRef } from "react";
import RelayRef from "@/common/hocs/logProps/indexTwo";
import { Button, DatePicker, Select, TimePicker } from "antd";
import internationalization from '@/common/hooks/useTranslationEnum';

const Test = () => {
  let refProps = useRef<any>('')
  let refPropsT = useRef<any>('')
  const { RangePicker } = DatePicker;
  useEffect(() => {
    
  },[])

  return(
    <>
      <Select showSearch style={{ width: 200 }}>
        <Select.Option value="jack">jack</Select.Option>
        <Select.Option value="lucy">lucy</Select.Option>
      </Select><br />
      <DatePicker /><br />
      <TimePicker /><br />
      <RangePicker style={{ width: 200 }} /><br />
      <RelayRef label="142" ref={refProps}></RelayRef>
      <Button onClick={() => console.log(refProps.current.focus())}>refs</Button>
    </>
  )
}

export default Test;
