import { message, Modal, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type{ RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';
import { globalStore } from "@/stores/index";
import { uploadFile } from './service';

const Uploads = ({
  update
}) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<any>([{url: globalStore.userImage}]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>('');
  const [previewTitle, setPreviewTitle] = useState('');

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    }
    setFileList([...fileList, file])
    console.log(isJpgOrPng , isLt2M)
    return false;
  };
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if(info.file.status === 'removed') {
      return;
    }
    const formData = new FormData()
    formData.append('user', globalStore.userName);
    formData.append('files', fileList[0] as any);
    uploadFile(formData).then((res: any) => {
      setImageUrl([res])
      globalStore.setUserImage(res.url);
      Promise.resolve().then(res => {
        update()
      })
    }).catch(err => {
      console.log(err,'err')
    })
    console.log(info,'file')
  };

  const imgPreview = (file: any) => {
    setPreviewImage(file.url);
    setPreviewOpen(true);
    setPreviewTitle(file.originalFilename);
  }
  const remove = () => {
    setFileList([])
    globalStore.setUserImage('');
    setImageUrl([])
  }
  const handleCancel = () => setPreviewOpen(false);


  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  
  return(
    <>
      <Upload
        name="avatar"
        listType="picture-card"
        maxCount={1}
        fileList={imageUrl}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={imgPreview}
        onRemove={remove}
      >
        {imageUrl.length != 0 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default Uploads;