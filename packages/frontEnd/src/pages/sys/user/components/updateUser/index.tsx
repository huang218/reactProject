import "react";
import { Form, Input, message, Modal } from 'antd';
import { updateUser } from '../../service'
import { useState } from "react";
import { useTranslation } from "react-i18next";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

export default ({
  open,
  onClose,
  search
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const submit = () => {
    form.validateFields()
      .then((values) => {
        updateUser(values).then(res => {
          message.success(t(`server.${res.data._msg}`));
          search();
          form.resetFields(); // 重置
        }).catch(err => {
          message.error(err.error)
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
      title={t('common.add')}
      open={open}
      onOk={submit}
      onCancel={onClose}
      destroyOnClose={true}
      maskClosable={false}
      okText={t('common.confirm')}
      cancelText={t('common.cancel')}
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="userName" label={t('sys.user.account')} rules={[{ required: true, message: t('sys.user.msg_account') }]}>
          <Input allowClear showCount maxLength={20} />
        </Form.Item>
        <Form.Item name="passWord" label={t('sys.user.password')} rules={[{ required: true, message: t('sys.user.msg_password') }]}>
          <Input.Password type="password" visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }} allowClear maxLength={20} />
        </Form.Item>
      </Form>
    </Modal>
  );
};