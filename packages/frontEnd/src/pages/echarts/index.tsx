import { useEffect, useRef } from "react";
import RelayRef from "@/common/hocs/logProps/indexTwo";
import { Button, DatePicker, Select, TimePicker } from "antd";
import internationalization from '@/common/hooks/useTranslationEnum';

const Test = () => {
  let refProps = useRef<any>('')
  let refPropsT = useRef<any>('')
  const { RangePicker } = DatePicker;

  const callback = async (name, age?) => {
    try {
      const result: any = await back(name, age);
      console.log(result.name,'result')
    } catch (error) {
      console.log(error,'error')
    }
    // back(name, age).then(res => {
    //   console.log(res,'success')
    // }).catch(err => {
    //   console.error(err,'error')
    // })
  }

  const back = (name?, age?) => {
    let data = {
      name: name + '2023',
      age: age && age++
    }
    return new Promise((resolve, reject) => {
      if(data?.name && data?.age) {
        resolve(data)
      }else {
        reject(data)
      }
    })
  }

  useEffect(() => {
    
  },[])

  return(
    <>
      <div
        style={{
          boxShadow: 'border-box',
          width: '100px',
          height: "100px",
          margin: '10px',
          padding: '10px',
          border: '1px solid red'
        }}
      ></div>
      <Button onClick={() => callback('name','12')} type="primary">Promise-success</Button><br />
      <Button onClick={() => callback('name')} danger>Promise-error</Button><br />
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
