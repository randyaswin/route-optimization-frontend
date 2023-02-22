import React, { useState, useEffect, useCallback } from 'react';
import { Popconfirm, Form, Space, TableProps } from 'antd';
import { Table } from 'components/common/Table/Table';
import { DeleteHub, EditHubs, Hub, Pagination } from 'api/hub.api';
import { EditableCell } from './EditableCell';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getHub } from '@app/store/slices/hubsSlice';
import moment from 'moment';
import { Link } from 'react-router-dom';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

export const HubTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const tableData = useAppSelector((state) => state.hubs);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(0);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const fetch = useCallback(
    (pagination: Pagination, sorter) => {
      dispatch(getHub({ pagination, sorter }));
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination, {});
  }, [fetch]);

  const handleTableChange: TableProps<Hub>['onChange'] = (pagination: Pagination, filters, sorter) => {
    fetch(pagination, sorter);
    cancel();
  };

  const isEditing = (record: Hub) => record.id === editingKey;

  const edit = (record: Partial<Hub> & { id: React.Key }) => {
    form.setFieldsValue({ name: '', open: '', close: '', latitude: '', longitude: '', address: '', ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (id: React.Key) => {
    const row = (await form.validateFields()) as Hub;
    const rowid = id as number;
    await EditHubs(rowid, {
      ...row,
      open: moment(row.open).format('HH:mm:ss'),
      close: moment(row.close).format('HH:mm:ss'),
    });
    setEditingKey(0);
    fetch(tableData.pagination, tableData.sorter);
  };

  const handleDeleteRow = async (rowId: number) => {
    await DeleteHub(rowId);
    fetch(tableData.pagination, tableData.sorter);
  };

  const columns = [
    {
      title: 'Hub ID',
      dataIndex: 'hubid',
      width: '5%',
      editable: true,
      sorter: true,
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
      width: '20%',
      editable: true,
      sorter: true,
    },
    {
      title: t('common.address'),
      dataIndex: 'address',
      width: '25%',
      editable: true,
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
      width: '10%',
      editable: true,
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      width: '10%',
      editable: true,
    },
    {
      title: 'Open',
      dataIndex: 'open',
      width: '10%',
      editable: true,
      sorter: true,
      render: (text: string, record: Hub) => {
        return moment(text).format('HH:mm:ss');
      },
    },
    {
      title: 'Close',
      dataIndex: 'close',
      width: '10%',
      editable: true,
      sorter: true,
      render: (text: string, record: Hub) => {
        return moment(text).format('HH:mm:ss');
      },
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '10%',
      render: (text: string, record: Hub) => {
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
                <Button type="primary" disabled={editingKey !== 0} onClick={() => edit(record)}>
                  <Link to={`/hub/${record.id}`}>Open</Link>
                </Button>
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
      onCell: (record: Hub) => ({
        record,
        inputType: ['latitude', 'longitude'].includes(col.dataIndex)
          ? 'number'
          : ['open', 'close'].includes(col.dataIndex)
          ? 'time'
          : 'text',
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
