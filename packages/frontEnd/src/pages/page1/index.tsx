import { Button, Form, Input, Skeleton } from "antd";
import "react";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { ipReg } from "@/common/utils";
import { getPings } from './service';

export default (props) => {
  const [form] = Form.useForm();
  const [resultDate, setResultDate] = useState('');
  const [loading, setLoading] = useState(false);

  const localPing = (values: {ipName: String}) => {
    getPings({
      tyspes: 'Ping',
      ip: values.ipName
    }).then(res => {
      const str = res.data.replace(/\r\n/g,"<br />")
      setResultDate(str)
      setLoading(false)
    }).catch(err => {
      setLoading(false)
    })
  }

  const onFinish = (values: any) => {
    setLoading(true)
    setResultDate('')
    localPing(values)
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    form.setFieldValue('ipName', '10.0.105.6')
  },[])

  return (
    <div className={styles.content}>
      <div className={styles.search}>
        <Form
          name="basic"
          form={form}
          layout="inline"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="测试ip"
            name="ipName"
            rules={
              [
                { required: true, message: '请输入测试ip地址!' },
                { 
                  pattern: ipReg,
                  message: '测试ip格式不正确!' 
                }
              ]
            }
          >
            <Input />
          </Form.Item>
          <Form.Item shouldUpdate>
            <Button type="primary" htmlType="submit">测试</Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles._htmlStyle}>
        {
          loading
          ? <Skeleton active paragraph={{ rows: 5 }} />
          : <div dangerouslySetInnerHTML={{__html: resultDate}}></div> 
        }
      </div>
    </div>
  )
};
