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
import { Pagination, AddHub, Sort } from '@app/api/hub.api';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getHub } from '@app/store/slices/hubsSlice';
import { mergeBy } from '@app/utils/utils';
import { Dates } from '@app/constants/Dates';
import { TimePicker } from 'antd';
import moment from 'moment';
import MapForm from './Map/MapForm';

interface HubCreate {
  hubid: string;
  name: string;
  address: string;
  open: Date;
  close: Date;
  longitude: number;
  latitude: number;
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
  const dispatch = useAppDispatch();
  const tableData = useAppSelector((state) => state.hubs);
  const [form] = Form.useForm();
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [fields, setFields] = useState<HubCreate>({
    hubid: '',
    name: '',
    address: '',
    open: moment('00:00:00', TIME_FORMAT).toDate(),
    close: moment('00:00:00', TIME_FORMAT).toDate(),
    longitude: 0.0,
    latitude: 0.0,
  });

  const refreshTable = (pagination: Pagination, sorter: Sort) => {
    dispatch(getHub({ pagination, sorter }));
  };

  const mapChange = (data: { lng: number; lat: number }) => {
    setFields({ ...fields, longitude: data.lng, latitude: data.lat });
  };

  const onFinish = async (values = {}) => {
    setLoading(true);
    AddHub({
      ...fields,
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
          hubid: '',
          name: '',
          address: '',
          open: moment('00:00:00', TIME_FORMAT).toDate(),
          close: moment('00:00:00', TIME_FORMAT).toDate(),
          longitude: 0.0,
          latitude: 0.0,
        });
        refreshTable(tableData.pagination, tableData.sorter);
        notificationController.success({
          message: 'success',
          description: `Success Added New Hub`,
        });
      })
      .catch((err) => {
        notificationController.error({ message: 'error', description: 'failed Add New Hub' });
      });
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
        onOk={() => onFinish()}
        onCancel={() => setIsAddModalVisible(false)}
        size="large"
      >
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
            name="hubid"
            label="Brach ID"
            hasFeedback
            rules={[{ required: true, message: 'Please Input Hub ID' }]}
          >
            <Input placeholder="Please Input Hub ID" />
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
          <BaseButtonsForm.Item>
            <MapForm marker={fields} mapChange={mapChange} />
          </BaseButtonsForm.Item>
        </BaseButtonsForm>
      </Modal>
    </>
  );
};
