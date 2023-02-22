import React, { useState, useEffect, useCallback } from 'react';
import { Popconfirm, Form, Space, TableProps } from 'antd';
import { Table } from 'components/common/Table/Table';
import { DeleteVisit, EditVisites, Visit, Pagination } from 'api/visit.api';
import { EditableCell } from './EditableCell';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getVisit } from '@app/store/slices/visitesSlice';
import moment from 'moment';
import Icon from '@ant-design/icons/lib/components/Icon';
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import Input from 'antd/lib/input/Input';
import { HubOptions } from '@app/components/hub/Form/Options/hubOptions';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { FilterForm } from '../Form/FilterForm';
import { FilterOutlined } from '@ant-design/icons';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

export interface VisitCreate {
  visitid: string;
  name: string;
  hub_id: number;
  address: string;
  open: string;
  close: string;
  demand: number;
  service_time: number;
  longitude: number;
  latitude: number;
}

export interface VisitUpdate extends VisitCreate {}

export interface Visites extends VisitUpdate {
  id: number;
  vehicle_id?: number;
  datang?: string;
  berangkat?: string;
  driving_distance?: number;
  driving_time?: number;
  seq_sales?: number;
}

export interface FilterConfirmProps {
  closeDropdown: boolean;
}
export interface ColumnFilterItem {
  text: React.ReactNode;
  value: string | number | boolean;
  children?: ColumnFilterItem[];
}
export interface FilterDropdownProps {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: () => void;
  filters?: ColumnFilterItem[];
  visible: boolean;
}

export const VisitTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const tableData = useAppSelector((state) => state.visites);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(0);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const fetch = useCallback(
    (pagination: Pagination, sorter, filter?) => {
      dispatch(getVisit({ pagination, sorter, filter }));
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination, {}, {});
  }, [fetch]);

  const handleTableChange: TableProps<Visit>['onChange'] = (pagination: Pagination, filters, sorter) => {
    fetch(pagination, sorter, tableData.filter);
    cancel();
  };

  const isEditing = (record: Visit) => record.id === editingKey;

  const edit = (record: Partial<Visit> & { id: React.Key }) => {
    form.setFieldsValue({ name: '', open: '', close: '', latitude: '', longitude: '', address: '', ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (id: React.Key) => {
    const row = (await form.validateFields()) as Visit;
    const rowid = id as number;
    await EditVisites(rowid, {
      ...row,
      open: moment(row.open).format('HH:mm:ss'),
      close: moment(row.close).format('HH:mm:ss'),
    });
    setEditingKey(0);
    fetch(tableData.pagination, tableData.sorter, tableData.filter);
  };

  const handleDeleteRow = async (rowId: number) => {
    await DeleteVisit(rowId);
    fetch(tableData.pagination, tableData.sorter, tableData.filter);
  };

  const onFilter = (value: any) => {
    fetch(tableData.pagination, tableData.sorter, value);
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: () => <FilterForm onFilter={(v: any) => onFilter(v)} />,
    filterIcon: (filtered: boolean) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: (visible: boolean) => {},
  });

  const columns = [
    {
      title: 'Visit ID',
      dataIndex: 'visitid',
      width: '5%',
      editable: true,
      sorter: true,
      inputType: 'text',
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
      width: '20%',
      editable: true,
      sorter: true,
      inputType: 'text',
    },
    {
      title: 'Hub',
      dataIndex: ['hub', 'name'],
      width: '20%',
      editable: false,
      sorter: true,
      inputType: 'text',
      ...getColumnSearchProps('hub'),
    },
    {
      title: t('common.address'),
      dataIndex: 'address',
      width: '25%',
      editable: true,
      inputType: 'text',
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
      width: '10%',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      width: '10%',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Open',
      dataIndex: 'open',
      width: '20%',
      editable: true,
      sorter: true,
      render: (text: string, record: Visit) => {
        return moment(text).format('HH:mm:ss');
      },
      inputType: 'time',
    },
    {
      title: 'Close',
      dataIndex: 'close',
      width: '20%',
      editable: true,
      sorter: true,
      render: (text: string, record: Visit) => {
        return moment(text).format('HH:mm:ss');
      },
      inputType: 'time',
    },
    {
      title: 'Service Time',
      dataIndex: 'service_time',
      width: '10%',
      editable: true,
      sorter: true,
      inputType: 'number',
    },
    {
      title: 'Demand',
      dataIndex: 'demand',
      width: '10%',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Vehicle ID',
      dataIndex: 'vehicle_id',
      width: '10%',
      editable: false,
      sorter: true,
      inputType: 'number',
    },
    {
      title: 'Datang',
      dataIndex: 'datang',
      width: '10%',
      editable: false,
      sorter: true,
      render: (text: string, record: Visit) => {
        const val = moment(text).format('HH:mm:ss');
        return val === 'Invalid date' ? '' : val;
      },
      inputType: 'time',
    },
    {
      title: 'Berangkat',
      dataIndex: 'berangkat',
      width: '10%',
      editable: false,
      sorter: true,
      render: (text: string, record: Visit) => {
        const val = moment(text).format('HH:mm:ss');
        return val === 'Invalid date' ? '' : val;
      },
      inputType: 'time',
    },
    {
      title: 'Driving Distance',
      dataIndex: 'driving_distance',
      width: '10%',
      editable: false,
      sorter: true,
      inputType: 'number',
    },
    {
      title: 'Driving Time',
      dataIndex: 'driving_time',
      width: '10%',
      editable: false,
      sorter: true,
      inputType: 'number',
    },
    {
      title: 'Sequence Sales',
      dataIndex: 'sequence_sales',
      width: '10%',
      editable: false,
      sorter: true,
      inputType: 'number',
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '10%',
      render: (text: string, record: Visit) => {
        const editable = isEditing(record);
        return (
          <Space>
            {editable ? (
              <>
                <Button type="primary" onClick={() => save(record.id)}>
                  {t('common.save')}
                </Button>
                <Popconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                  <Button type="ghost">{t('common.cancel')}</Button>
                </Popconfirm>
              </>
            ) : (
              <>
                <Button type="ghost" disabled={editingKey !== 0} onClick={() => edit(record)}>
                  {t('common.edit')}
                </Button>
                <Popconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(record.id)}>
                  <Button type="default">{t('tables.delete')}</Button>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Visit) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={tableData.data.map((record) => ({
          ...record,
          key: record.id,
          open: moment(record.open, 'HH:mm:ss'),
          close: moment(record.close, 'HH:mm:ss'),
        }))}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          ...tableData.pagination,
          onChange: cancel,
        }}
        onChange={handleTableChange}
        loading={tableData.loading}
        scroll={{ x: 800 }}
      />
    </Form>
  );
};
