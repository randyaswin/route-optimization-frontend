import React, { useState, useEffect, useCallback } from 'react';
import { Popconfirm, Form, Space, TableProps, Row, Col } from 'antd';
import { Table } from 'components/common/Table/Table';
import { DeleteVehicle, EditVehicles, Vehicle, Pagination } from 'api/vehicle.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getVehicle } from '@app/store/slices/vehiclesSlice';
import * as SMap from './table.styles';
import moment from 'moment';
import VehicleRow from './VehicleRow';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { AddForm } from '../Form/AddVehicleForm';
import { Switch } from '@app/components/common/Switch/Switch';
import { getOpenHub } from '@app/store/slices/hubsSlice';
import { useParams } from 'react-router-dom';

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

export interface VehicleUpdate extends VehicleCreate {
  active?: boolean;
}

export interface Vehicles extends VehicleUpdate {
  id: number;
  total_load?: number;
  total_distance?: number;
  total_time?: number;
  used?: number;
}

export const VehicleTable: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const tableData = useAppSelector((state) => state.vehicles);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(0);
  const [expandedRow, setExpandedRow] = useState(0);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const isEditing = (record: Vehicle) => record.id === editingKey;

  const edit = (record: Partial<Vehicle> & { id: React.Key }) => {
    form.setFieldsValue({ vehicleid: '', name: '', hub_id: 0, start: '', end: '', capacity: 0, ...record });
    setEditingKey(record.id);
  };

  const refreshTable = (id: string) => {
    dispatch(getOpenHub(id));
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const handleDeactivateRow = async (rowid: number, row: VehicleUpdate) => {
    await EditVehicles(rowid, {
      ...row,
      start: moment(row.start).format('HH:mm:ss'),
      end: moment(row.end).format('HH:mm:ss'),
    }).then(() => {
      refreshTable(id ? id : '');
    });
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
  };

  const handleDeleteRow = async (rowId: number) => {
    await DeleteVehicle(rowId).then(() => {
      refreshTable(id ? id : '');
    });
  };

  const columns = [
    {
      title: () => (
        <div>
          <Row>
            <Col span={8}>Vehicle</Col>
            <Col span={2} offset={14}>
              <PlusOutlined onClick={() => setIsAddModalVisible(true)} />
            </Col>
          </Row>
        </div>
      ),
      dataIndex: 'name',
      width: '20%',
      editable: true,
      sorter: false,
      inputType: 'text',
      render: (text: string, record: Vehicle) => {
        return (
          <Row>
            <Col span={4}>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Switch
                  size="small"
                  checked={record.active}
                  onChange={(r) => {
                    handleDeactivateRow(record.id, { ...record, active: r });
                  }}
                />
              </span>
            </Col>
            <Col span={18}> {text}</Col>
            <Col span={2}>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Popconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(record.id)}>
                  <DeleteFilled color="red" sizes="small" />
                </Popconfirm>
              </span>
            </Col>
          </Row>
        );
      },
    },
  ];

  return (
    <div style={{ height: '100%', maxHeight: '100%' }}>
      <AddForm isAddModalVisible={isAddModalVisible} setIsAddModalVisible={setIsAddModalVisible} />
      <Form form={form} component={false}>
        <SMap.sTable
          expandable={{
            rowExpandable: (record) => record.name !== 'Not Expandable',
            expandRowByClick: true,
            showExpandColumn: false,
            expandedRowKeys: [expandedRow],
            onExpand: (isExpanded, record) => setExpandedRow(isExpanded ? record.key : undefined),
          }}
          expandedRowRender={(record) => <VehicleRow row={record} />}
          dataSource={tableData.data.map((record) => ({
            ...record,
            key: record.id,
            start: moment(record.start, 'HH:mm:ss'),
            end: moment(record.end, 'HH:mm:ss'),
          }))}
          pagination={false}
          columns={columns}
          rowClassName="editable-row"
          loading={tableData.loading}
          scroll={{ y: '60vh' }}
        />
      </Form>
    </div>
  );
};
