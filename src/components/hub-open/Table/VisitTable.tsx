import React, { useState, useEffect, useCallback } from 'react';
import { Popconfirm, Form, Space, TableProps, Row } from 'antd';
import { Table } from 'components/common/Table/Table';
import { DeleteVisit, EditVisites, Visit, Pagination } from 'api/visit.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import * as SMap from './table.styles';
import { getVisit } from '@app/store/slices/visitesSlice';
import moment from 'moment';
import Icon from '@ant-design/icons/lib/components/Icon';
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import Input from 'antd/lib/input/Input';
import { HubOptions } from '@app/components/hub/Form/Options/hubOptions';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { DeleteFilled, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Panel } from '@app/components/common/Collapse/Collapse';
import { registerCoordinateSystem } from 'echarts';
import VisitRow from './VisitRow';
import Col from 'antd/es/grid/col';
import { AddForm } from '../Form/AddVisitForm';
import { Switch } from '@app/components/common/Switch/Switch';
import { useParams } from 'react-router-dom';
import { getOpenHub } from '@app/store/slices/hubsSlice';

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

export interface VisitUpdate extends VisitCreate {
  active?: boolean;
}

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
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const tableData = useAppSelector((state) => state.visites);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(0);
  const [expandedRow, setExpandedRow] = useState(0);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const isEditing = (record: Visit) => record.id === editingKey;

  const edit = (record: Partial<Visit> & { id: React.Key }) => {
    form.setFieldsValue({ name: '', open: '', close: '', latitude: '', longitude: '', address: '', ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const refreshTable = (id: string) => {
    dispatch(getOpenHub(id));
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
  };

  const handleDeactivateRow = async (rowid: number, row: VisitUpdate) => {
    await EditVisites(rowid, {
      ...row,
      open: moment(row.open).format('HH:mm:ss'),
      close: moment(row.close).format('HH:mm:ss'),
    }).then(() => {
      refreshTable(id ? id : '');
    });
  };

  const handleDeleteRow = async (rowId: number) => {
    await DeleteVisit(rowId);
    refreshTable(id ? id : '');
  };

  const columns = [
    {
      title: () => (
        <div>
          <Row>
            <Col span={8}>Visit</Col>
            <Col span={2} offset={14}>
              <PlusOutlined onClick={() => setIsAddModalVisible(true)} />
            </Col>
          </Row>
        </div>
      ),
      dataIndex: 'name',
      width: '5%',
      editable: true,
      inputType: 'text',
      render: (text: string, record: Visit) => {
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
          showSorterTooltip={false}
          expandable={{
            rowExpandable: (record) => record.name !== 'Not Expandable',
            expandRowByClick: true,
            showExpandColumn: false,
            expandedRowKeys: [expandedRow],
            onExpand: (isExpanded, record) => setExpandedRow(isExpanded ? record.key : undefined),
          }}
          expandedRowRender={(record) => <VisitRow row={record} />}
          dataSource={tableData.data.map((record) => ({
            ...record,
            key: record.id,
            open: moment(record.open, 'HH:mm:ss'),
            close: moment(record.close, 'HH:mm:ss'),
          }))}
          pagination={false}
          columns={columns}
          rowClassName="editable-row"
          loading={tableData.loading}
          scroll={{ y: '65vh' }}
        />
      </Form>
    </div>
  );
};
