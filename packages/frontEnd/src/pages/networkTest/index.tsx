import { Button, Form, Input, Skeleton, Radio } from "antd";
import "react";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { ipReg, domainUrl } from "@/common/utils";
import { getPings } from './service';

export default (props) => {
  const [form] = Form.useForm();
  const [resultDate, setResultDate] = useState('');
  const [loading, setLoading] = useState<Boolean>(false);
  const [radioContent, setRadioContent] = useState<String>('domain')

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

  const radioCanhge = (e: any) => {
    setRadioContent(e.target.value)
  }

  useEffect(() => {
    form.setFieldValue('obj', 'domain')
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
            label="测试对象"
            name="obj"
            rules={
              [{ required: true, message: `请选择测试对象` }]
            }
          >
            <Radio.Group buttonStyle="solid" onChange={radioCanhge}>
              <Radio.Button value="domain">域名</Radio.Button>
              <Radio.Button value="ip">Ip</Radio.Button>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            label={`${radioContent === 'domain' ? '域名' : 'Ip'}`}
            name="ipName"
            rules={
              [
                { required: true, message: `请输入${radioContent === 'domain' ? '域名' : 'Ip地址'} ！` },
                {
                  pattern: radioContent === 'domain' ? domainUrl : radioContent === 'ip' ? ipReg : null,
                  message: `${radioContent === 'domain' ? '域名' : 'Ip地址'}不正确`
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
