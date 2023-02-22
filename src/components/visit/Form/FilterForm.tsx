import { Row, Col, Form, Space } from 'antd';
import { Modal } from '@app/components/common/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { UploadOutlined, InboxOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
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
import { Pagination, AddVisit, Sort } from '@app/api/visit.api';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getVisit } from '@app/store/slices/visitesSlice';
import { mergeBy } from '@app/utils/utils';
import { Dates } from '@app/constants/Dates';
import { TimePicker } from 'antd';
import moment from 'moment';
import MapForm from './Map/MapForm';
import { HubOptions } from '../../hub/Form/Options/hubOptions';

interface VisitCreate {
  visitid: string;
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

export const FilterForm: React.FC<any> = ({ onFilter }) => {
  const dispatch = useAppDispatch();
  const tableData = useAppSelector((state) => state.visites);
  const [form] = Form.useForm();
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [fields, setFields] = useState<any>({});

  const handleChange = () => {
    onFilter(fields);
  };

  const handleReset = () => {
    setFields({});
    form.resetFields();
    onFilter({});
  };

  return (
    <div>
      <BaseButtonsForm
        {...formItemLayout}
        form={form}
        isFieldsChanged={isFieldsChanged}
        onFieldsChange={(_, allFields) => {
          setFieldsChanged(true);
          setFields({ ...fields, [Array.isArray(_[0].name) ? _[0].name[0] : '']: _[0].value });
        }}
        footer={<BaseButtonsForm.Item></BaseButtonsForm.Item>}
      >
        <BaseButtonsForm.Item
          name="hub_id"
          label="Hub"
          hasFeedback
          rules={[{ required: false, message: 'Please Input Hub' }]}
        >
          <HubOptions mode="multiple" />
        </BaseButtonsForm.Item>
      </BaseButtonsForm>
      <Space>
        <Button
          type="primary"
          onClick={() => handleChange()}
          icon={<FilterOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Filter
        </Button>
        <Button size="small" style={{ width: 90 }} onClick={() => handleReset()}>
          Reset
        </Button>
      </Space>
    </div>
  );
};
