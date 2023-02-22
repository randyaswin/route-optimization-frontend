import { Row, Col, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Switch } from '@app/components/common/Switch/Switch';
import { Radio, RadioButton, RadioGroup } from '@app/components/common/Radio/Radio';
import { Slider } from '@app/components/common/Slider/Slider';
import { Upload, UploadDragger } from '@app/components/common/Upload/Upload';
import { Rate } from '@app/components/common/Rate/Rate';
import { Checkbox, CheckboxGroup } from '@app/components/common/Checkbox/Checkbox';
import { notificationController } from '@app/controllers/notificationController';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { Pagination, UploadVisites } from '@app/api/visit.api';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { getVisit } from '@app/store/slices/visitesSlice';
import { UploadVehicles } from '@app/api/vehicle.api';
import { getVehicle } from '@app/store/slices/vehiclesSlice';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

const normFile = (e = { fileList: [] }) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const UploadForm: React.FC<any> = ({ isUploadModalVisible, setIsUploadModalVisible }) => {
  const dispatch = useAppDispatch();
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [fileList, setfileList] = useState<any>({ fileList: [] });

  const handleUploadChange = (info: { fileList: any }) => {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    fileList = fileList.map((file: { response: { url: any }; url: any }) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setfileList({ fileList });
  };

  const onFinish = async (values = {}) => {
    if (fileList.fileList.length === 0) {
      notificationController.error({ message: 'error', description: 'Please select a file' });
      return;
    }
    setLoading(true);
    await UploadVehicles(fileList.fileList[0].originFileObj)
      .then((res) => {
        notificationController.success({ message: 'success' });
      })
      .catch((err) => {
        notificationController.error({ message: 'error' });
      });
    setLoading(false);
    setfileList({ fileList: [] });
    setIsUploadModalVisible(false);
    dispatch(getVehicle({ pagination: initialPagination, sorter: {} }));
  };

  return (
    <Modal
      title="Upload"
      visible={isUploadModalVisible}
      onOk={() => onFinish()}
      onCancel={() => setIsUploadModalVisible(false)}
    >
      <BaseButtonsForm
        {...formItemLayout}
        isFieldsChanged={isFieldsChanged}
        onFieldsChange={() => setFieldsChanged(true)}
        name="validateForm"
        initialValues={{
          'input-number': 3,
          'checkbox-group': ['A', 'B'],
          rate: 3.5,
        }}
        footer={<BaseButtonsForm.Item></BaseButtonsForm.Item>}
        onFinish={onFinish}
      >
        <BaseButtonsForm.Item name="upload" label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload
            multiple={false}
            accept="application/csv"
            name="file"
            beforeUpload={() => false}
            showUploadList={false}
            fileList={fileList}
            onChange={handleUploadChange}
          >
            <Button type="default" icon={<UploadOutlined />}>
              Click to Upload
            </Button>
            {fileList.fileList.map((file: { name: any }) => (
              <div key={file.name}>{file.name}</div>
            ))}
          </Upload>
        </BaseButtonsForm.Item>
      </BaseButtonsForm>
      <Spinner spinning={isLoading} tip="Uploading..." />
    </Modal>
  );
};
