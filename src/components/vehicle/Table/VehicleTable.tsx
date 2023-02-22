import React, { useState, useEffect, useCallback } from 'react';
import { Popconfirm, Form, Space, TableProps } from 'antd';
import { Table } from 'components/common/Table/Table';
import { DeleteVehicle, EditVehicles, Vehicle, Pagination } from 'api/vehicle.api';
import { EditableCell } from './EditableCell';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getVehicle } from '@app/store/slices/vehiclesSlice';
import moment from 'moment';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

export interface VehicleCreate {
  vehicleid: string;
  name: string;
  hub_id: number;
  start: string;
  end: string;
  capacity: number;
  distance: number;
  work_time: number;
}

export interface VehicleUpdate extends VehicleCreate {}

export interface Vehicles extends VehicleUpdate {
  id: number;
  total_load?: number;
  total_distance?: number;
  total_time?: number;
  used?: number;
}

export const VehicleTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const tableData = useAppSelector((state) => state.vehicles);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(0);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const fetch = useCallback(
    (pagination: Pagination, sorter) => {
      dispatch(getVehicle({ pagination, sorter }));
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination, {});
  }, [fetch]);

  const handleTableChange: TableProps<Vehicle>['onChange'] = (pagination: Pagination, filters, sorter) => {
    fetch(pagination, sorter);
    cancel();
  };

  const isEditing = (record: Vehicle) => record.id === editingKey;

  const edit = (record: Partial<Vehicle> & { id: React.Key }) => {
    form.setFieldsValue({ vehicleid: '', name: '', hub_id: 0, start: '', end: '', capacity: 0, ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (id: React.Key) => {
    const row = (await form.validateFields()) as Vehicle;
    const rowid = id as number;
    await EditVehicles(rowid, {
      ...row,
      start: moment(row.start).format('HH:mm:ss'),
      end: moment(row.end).format('HH:mm:ss'),
    });
    setEditingKey(0);
    fetch(tableData.pagination, tableData.sorter);
  };

  const handleDeleteRow = async (rowId: number) => {
    await DeleteVehicle(rowId);
    fetch(tableData.pagination, tableData.sorter);
  };

  const columns = [
    {
      title: 'Vehicle ID',
      dataIndex: 'vehicleid',
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
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      width: '10%',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Start',
      dataIndex: 'start',
      width: '20%',
      editable: true,
      sorter: true,
      render: (text: string, record: Vehicle) => {
        return moment(text).format('HH:mm:ss');
      },
      inputType: 'time',
    },
    {
      title: 'End',
      dataIndex: 'end',
      width: '20%',
      editable: true,
      sorter: true,
      render: (text: string, record: Vehicle) => {
        return moment(text).format('HH:mm:ss');
      },
      inputType: 'time',
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      width: '10%',
      editable: true,
      sorter: true,
      inputType: 'number',
    },
    {
      title: 'Work Time',
      dataIndex: 'work_time',
      width: '10%',
      editable: true,
      sorter: true,
      inputType: 'number',
    },
    {
      title: 'Total Load',
      dataIndex: 'total_load',
      width: '10%',
      editable: false,
      sorter: true,
      inputType: 'number',
    },
    {
      title: 'Total Distance',
      dataIndex: 'total_distance',
      width: '10%',
      editable: false,
      sorter: true,
      inputType: 'number',
    },
    {
      title: 'Total Time',
      dataIndex: 'total_time',
      width: '10%',
      editable: false,
      sorter: true,
      inputType: 'number',
    },
    {
      title: 'Used',
      dataIndex: 'used',
      width: '10%',
      editable: false,
      sorter: true,
      inputType: 'text',
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '10%',
      render: (text: string, record: Vehicle) => {
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
      onCell: (record: Vehicle) => ({
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
          start: moment(record.start, 'HH:mm:ss'),
          end: moment(record.end, 'HH:mm:ss'),
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
