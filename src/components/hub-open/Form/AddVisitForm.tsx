import { Row, Col, Form } from 'antd';
import { Modal } from '@app/components/common/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
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
import { Input } from '@app/components/common/inputs/Input/Input';
import { notificationController } from '@app/controllers/notificationController';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { Pagination, AddVisit, Sort, UploadVisites } from '@app/api/visit.api';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getVisit } from '@app/store/slices/visitesSlice';
import { mergeBy } from '@app/utils/utils';
import { Dates } from '@app/constants/Dates';
import { TimePicker } from 'antd';
import moment from 'moment';
import MapForm from './Map/MapForm';
import { HubOptions } from '../../hub/Form/Options/hubOptions';
import { getOpenHub } from '@app/store/slices/hubsSlice';
import { useParams } from 'react-router-dom';
import { TabPane, Tabs } from '@app/components/common/Tabs/Tabs';
import { UploadHubVisit } from '@app/api/hub.api';

interface VisitCreate {
  visitid: string;
  hub_id: number;
  name: string;
  address: string;
  open: Date;
  close: Date;
  longitude: number;
  latitude: number;
  demand: number;
  service_time: number;
}

const TIME_FORMAT = 'HH:mm:ss';

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

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

export const AddForm: React.FC<any> = ({ isAddModalVisible, setIsAddModalVisible }) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const tableData = useAppSelector((state) => state.visites);
  const [form] = Form.useForm();
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [fileList, setfileList] = useState<any>({ fileList: [] });
  const [addMode, setAddMode] = useState('form');

  const [fields, setFields] = useState<VisitCreate>({
    visitid: '',
    name: '',
    address: '',
    hub_id: id ? parseInt(id) : 0,
    open: moment('00:00:00', TIME_FORMAT).toDate(),
    close: moment('00:00:00', TIME_FORMAT).toDate(),
    longitude: 0.0,
    latitude: 0.0,
    demand: 0,
    service_time: 0,
  });

  const refreshTable = (id: string) => {
    dispatch(getOpenHub(id));
  };

  const mapChange = (data: { lng: number; lat: number }) => {
    setFields({ ...fields, longitude: data.lng, latitude: data.lat });
  };

  const onFinish = async (values = {}) => {
    setLoading(true);
    AddVisit({
      ...fields,
      hub_id: id ? parseInt(id) : 0,
      open: moment(fields.open).format(TIME_FORMAT),
      close: moment(fields.close).format(TIME_FORMAT),
    })
      .then((res) => {
        setLoading(false);
        form.resetFields();
        form.setFieldsValue({
          longitude: 0.0,
          latitude: 0.0,
        });
        setIsAddModalVisible(false);
        setFields({
          visitid: '',
          name: '',
          hub_id: id ? parseInt(id) : 0,
          address: '',
          open: moment('00:00:00', TIME_FORMAT).toDate(),
          close: moment('00:00:00', TIME_FORMAT).toDate(),
          longitude: 0.0,
          latitude: 0.0,
          demand: 0,
          service_time: 0,
        });
        refreshTable(id ? id : '');
        notificationController.success({
          message: 'success',
          description: `Success Added New Visit`,
        });
      })
      .catch((err) => {
        notificationController.error({ message: 'error', description: 'failed Add New Visit' });
      });
  };

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

  const onUploadFinish = async (values = {}) => {
    if (fileList.fileList.length === 0) {
      notificationController.error({ message: 'error', description: 'Please select a file' });
      return;
    }
    setLoading(true);
    await UploadHubVisit(fileList.fileList[0].originFileObj, id ? parseInt(id) : 0)
      .then((res) => {
        notificationController.success({ message: 'success' });
      })
      .catch((err) => {
        notificationController.error({ message: 'error' });
      });
    setLoading(false);
    setfileList({ fileList: [] });
    setIsAddModalVisible(false);
    refreshTable(id ? id : '');
  };

  useEffect(() => {
    form.setFieldsValue({
      longitude: fields.longitude,
      latitude: fields.latitude,
    });
  }, [form, fields]);

  return (
    <>
      <Modal
        title="Add"
        centered
        visible={isAddModalVisible}
        onOk={() => (addMode == 'form' ? onFinish() : onUploadFinish())}
        onCancel={() => setIsAddModalVisible(false)}
        size="large"
      >
        <Tabs defaultActiveKey="form" onChange={(r) => setAddMode(r)}>
          <TabPane tab="Form" key="form">
            <BaseButtonsForm
              {...formItemLayout}
              form={form}
              isFieldsChanged={isFieldsChanged}
              onFieldsChange={(_, allFields) => {
                setFieldsChanged(true);
                setFields({ ...fields, [Array.isArray(_[0].name) ? _[0].name[0] : '']: _[0].value });
              }}
              name="AddForm"
              footer={<BaseButtonsForm.Item></BaseButtonsForm.Item>}
              onFinish={onFinish}
              loading={isLoading}
            >
              <BaseButtonsForm.Item
                name="visitid"
                label="Visit ID"
                hasFeedback
                rules={[{ required: true, message: 'Please Input Visit ID' }]}
              >
                <Input placeholder="Please Input Visit ID" />
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item
                name="name"
                label="Name"
                hasFeedback
                rules={[{ required: true, message: 'Please Input Name' }]}
              >
                <Input placeholder="Please Input Name" />
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item
                name="address"
                label="Address"
                hasFeedback
                rules={[{ required: true, message: 'Please Input Address' }]}
              >
                <Input placeholder="Please Input Address" />
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item
                name="open"
                label="Open"
                hasFeedback
                rules={[{ required: true, message: 'Please Input Open Time' }]}
              >
                <TimePicker />
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item
                name="close"
                label="Close"
                hasFeedback
                rules={[{ required: true, message: 'Please Input Close Time' }]}
              >
                <TimePicker />
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item
                name="longitude"
                label="Longitude"
                hasFeedback
                rules={[{ required: true, message: 'Please Input Longitude' }]}
              >
                <InputNumber placeholder="Please Input Longitude" min={-180} max={180} />
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item
                name="latitude"
                label="Latitude"
                hasFeedback
                rules={[{ required: true, message: 'Please Input Latitude' }]}
              >
                <InputNumber placeholder="Please Input Latitude" min={-90} max={90} />
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item
                name="demand"
                label="Demand"
                hasFeedback
                rules={[{ required: true, message: 'Please Input Demand' }]}
              >
                <InputNumber placeholder="Please Input Demand" min={0} />
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item
                name="service_time"
                label="Service Time"
                hasFeedback
                rules={[{ required: true, message: 'Please Input Service Time' }]}
              >
                <InputNumber placeholder="Please Input Service Time" min={0} />
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item>
                <MapForm marker={fields} mapChange={mapChange} />
              </BaseButtonsForm.Item>
            </BaseButtonsForm>
          </TabPane>
          <TabPane tab="Upload" key="upload">
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
              onFinish={onUploadFinish}
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
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};
