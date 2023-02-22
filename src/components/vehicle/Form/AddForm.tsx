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
import { Pagination, AddVehicle, Sort } from '@app/api/vehicle.api';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getVehicle } from '@app/store/slices/vehiclesSlice';
import { mergeBy } from '@app/utils/utils';
import { Dates } from '@app/constants/Dates';
import { TimePicker } from 'antd';
import moment from 'moment';
import { HubOptions } from '@app/components/hub/Form/Options/hubOptions';

interface VehicleCreate {
  vehicleid: string;
  name: string;
  hub_id: number;
  start: Date;
  end: Date;
  capacity: number;
  distance: number;
  work_time: number;
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
  const tableData = useAppSelector((state) => state.vehicles);
  const [form] = Form.useForm();
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [fields, setFields] = useState<VehicleCreate>({
    vehicleid: '',
    name: '',
    hub_id: 0,
    start: moment('00:00:00', TIME_FORMAT).toDate(),
    end: moment('00:00:00', TIME_FORMAT).toDate(),
    capacity: 0.0,
    distance: 0.0,
    work_time: 0.0,
  });

  const refreshTable = (pagination: Pagination, sorter: Sort) => {
    dispatch(getVehicle({ pagination, sorter }));
  };

  const onFinish = async (values = {}) => {
    setLoading(true);
    AddVehicle({
      ...fields,
      start: moment(fields.start).format(TIME_FORMAT),
      end: moment(fields.end).format(TIME_FORMAT),
    })
      .then((res) => {
        setLoading(false);
        form.resetFields();
        setIsAddModalVisible(false);
        setFields({
          vehicleid: '',
          name: '',
          hub_id: 0,
          start: moment('00:00:00', TIME_FORMAT).toDate(),
          end: moment('00:00:00', TIME_FORMAT).toDate(),
          capacity: 0.0,
          distance: 0.0,
          work_time: 0.0,
        });
        refreshTable(tableData.pagination, tableData.sorter);
        notificationController.success({
          message: 'success',
          description: `Success Added New Vehicle`,
        });
      })
      .catch((err) => {
        notificationController.error({ message: 'error', description: 'failed Add New Vehicle' });
      });
  };

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
            name="vehicleid"
            label="Vehicle ID"
            hasFeedback
            rules={[{ required: true, message: 'Please Input Vehicle ID' }]}
          >
            <Input placeholder="Please Input Vehicle ID" />
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
            name="hub_id"
            label="Hub"
            hasFeedback
            rules={[{ required: true, message: 'Please Input Hub' }]}
          >
            <HubOptions />
          </BaseButtonsForm.Item>
          <BaseButtonsForm.Item
            name="start"
            label="Start"
            hasFeedback
            rules={[{ required: true, message: 'Please Input Start Time' }]}
          >
            <TimePicker />
          </BaseButtonsForm.Item>
          <BaseButtonsForm.Item
            name="end"
            label="End"
            hasFeedback
            rules={[{ required: true, message: 'Please Input End Time' }]}
          >
            <TimePicker />
          </BaseButtonsForm.Item>
          <BaseButtonsForm.Item
            name="capacity"
            label="Capacity"
            hasFeedback
            rules={[{ required: true, message: 'Please Input Capacity' }]}
          >
            <InputNumber placeholder="Please Input Capacity" />
          </BaseButtonsForm.Item>
        </BaseButtonsForm>
      </Modal>
    </>
  );
};
