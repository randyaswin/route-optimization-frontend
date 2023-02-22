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
import { Pagination, AddVisit, Sort } from '@app/api/visit.api';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getVisit } from '@app/store/slices/visitesSlice';
import { mergeBy } from '@app/utils/utils';
import { Dates } from '@app/constants/Dates';
import { TimePicker } from 'antd';
import moment from 'moment';
import { Hub, ListHubs } from '@app/api/hub.api';

export const HubOptions: React.FC<any> = ({ ...anotherProps }) => {
  const dispatch = useAppDispatch();
  const tableData = useAppSelector((state) => state.visites);
  const [form] = Form.useForm();
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [pagination, setpagination] = useState<Pagination>({ current: 1, pageSize: 10 });
  const [hubOptions, sethubOptions] = useState<Hub[]>([
    { id: 0, hubid: '', name: '', address: '', open: '', close: '', longitude: 0, latitude: 0, status: '' },
  ]);
  const [min, setmin] = useState(0);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState();
  const { t } = useTranslation();
  const extraProps = {};

  useEffect(() => {
    (async function anyNameFunction() {
      await ListHubs(pagination, {}).then((res) => {
        setpagination(res.pagination);
        sethubOptions(res.data);
      });
    })();
  }, []);

  const handleScroll = (e: any) => {
    e.stopPropagation();
    let delta;
    let newMin = pagination.current ? pagination.current : 1;
    if (e.wheelDelta) {
      delta = e.wheelDelta;
    } else {
      delta = -1 * e.deltaY;
    }

    if (!loadingMore) {
      if (delta < 0) {
        newMin = (pagination.current ? pagination.current : 1) * (pagination.pageSize ? pagination.pageSize : 10) + 1;
        if (
          newMin >= (pagination.current ? pagination.current : 1) * (pagination.pageSize ? pagination.pageSize : 10) &&
          (pagination.current ? pagination.current : 1) * (pagination.pageSize ? pagination.pageSize : 10) -
            (pagination.total ? pagination.total : 10) <=
            (pagination.pageSize ? pagination.pageSize : 10)
        ) {
          setLoadingMore(true);
          console.log(newMin);
          (async function anyNameFunction() {
            await ListHubs({ ...pagination, current: (pagination.current ? pagination.current : 1) + 1 }, {})
              .then((res) => {
                setpagination({ ...res.pagination, current: (pagination.current ? pagination.current : 1) + 1 });
                sethubOptions([...hubOptions, ...res.data]);
                console.log('hubOptions', hubOptions);
                setLoadingMore(false);
              })
              .catch((err) => {
                setLoadingMore(false);
              });
          })();
        }
      } else if (delta > 0 && (pagination.current ? pagination.current : 1) >= 1) {
        newMin = (pagination.current ? pagination.current : 1) + (pagination.pageSize ? pagination.pageSize : 10) - 1;
      }
    }
  };

  return (
    <Select
      placeholder="Please Select Hub"
      style={{ width: '100%' }}
      dropdownRender={(menu) => <div onWheel={handleScroll}>{menu}</div>}
      loading={loadingMore}
      filterOption={false}
      size="small"
      defaultActiveFirstOption={false}
      {...anotherProps}
    >
      {hubOptions.map((i) => (
        <Option key={i.id} value={i.id}>
          {i.name}
        </Option>
      ))}
    </Select>
  );
};
