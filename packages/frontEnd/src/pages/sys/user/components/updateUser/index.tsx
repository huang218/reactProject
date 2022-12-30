import "react";
import { Form, Input, message, Modal, RadioChangeEvent } from 'antd';
import { Drawer, Radio } from 'antd';
import { globalStore } from "@/stores/index";
import { observer } from "mobx-react";
import type { FormInstance } from 'antd/es/form';
import { updateUser } from '../../service'
import styles from "./index.module.scss";
import { useState } from "react";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

export default observer(({
  open,
  onClose,
  search
}) => {
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const submit = () => {
    form.validateFields()
      .then((values) => {
        updateUser(values).then(res => {
          message.success(res.data.msg);
          search();
          form.resetFields(); // 重置
        }).catch(err => {
          message.error(err.response.data.error)
        }).finally(() => {
          onClose()
        })
        
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  }

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Modal
      title="新增"
      open={open}
      onOk={submit}
      onCancel={onClose}
      destroyOnClose={true}
      maskClosable={false}
      okText="确认"
      cancelText="取消"
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="userName" label="账号" rules={[{ required: true, message: '请输入账号!' }]}>
          <Input allowClear showCount maxLength={20} />
        </Form.Item>
        <Form.Item name="passWord" label="密码" rules={[{ required: true, message: '请输入密码!' }]}>
          <Input.Password type="password" visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }} allowClear maxLength={20} />
        </Form.Item>
      </Form>
    </Modal>
  );
});