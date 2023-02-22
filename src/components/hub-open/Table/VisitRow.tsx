import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import React, { Component, useCallback, useEffect, useState } from 'react';

import { Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Descriptions, Form, Row, TimePicker } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { Button } from '@app/components/common/buttons/Button/Button';
import * as SMap from './table.styles';
import moment from 'moment';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { Input } from '@app/components/common/inputs/Input/Input';
import { render } from 'react-dom';
import { AddVisit, EditVisites } from '@app/api/visit.api';
import { notificationController } from '@app/controllers/notificationController';
import { getVisit } from '@app/store/slices/visitesSlice';
import { getOpenHub } from '@app/store/slices/hubsSlice';
import { useParams } from 'react-router-dom';

const TIME_FORMAT = 'HH:mm:ss';

interface VisitCreate {
  id: number;
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
  [propName: string]: any;
}

const VisitRow: React.FC<any> = ({ row }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<VisitCreate>({
    ...row,
    open: moment(row.open, TIME_FORMAT),
    close: moment(row.close, TIME_FORMAT),
  });
  const tableData = useAppSelector((state) => state.visites);

  const refreshTable = () => {
    dispatch(getOpenHub(id ? id : ''));
  };

  const columns = [
    {
      title: 'Visit ID',
      dataIndex: 'visitid',
      editable: true,
      inputType: 'text',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      inputType: 'text',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      editable: true,
      inputType: 'text',
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Open',
      dataIndex: 'open',
      editable: true,
      inputType: 'time',
      render: (value: any) => {
        return moment(value).format('HH:mm:ss');
      },
    },
    {
      title: 'Close',
      dataIndex: 'close',
      editable: true,
      inputType: 'time',
      render: (value: any) => {
        return moment(value).format('HH:mm:ss');
      },
    },
    {
      title: 'Service Time',
      dataIndex: 'service_time',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Demand',
      dataIndex: 'demand',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Vehicle ID',
      dataIndex: 'vehicle_id',
      editable: false,
      inputType: 'number',
    },
    {
      title: 'Datang',
      dataIndex: 'datang',
      editable: false,
      inputType: 'time',
      render: (value: any) => {
        const val = moment(value).format('HH:mm:ss');
        return val === 'Invalid date' ? '' : val;
      },
    },
    {
      title: 'Berangkat',
      dataIndex: 'berangkat',
      editable: false,
      inputType: 'time',
      render: (value: any) => {
        const val = moment(value).format('HH:mm:ss');
        return val === 'Invalid date' ? '' : val;
      },
    },
    {
      title: 'Driving Distance',
      dataIndex: 'driving_distance',
      editable: false,
      inputType: 'number',
    },
    {
      title: 'Driving Time',
      dataIndex: 'driving_time',
      editable: false,
      inputType: 'number',
    },
    {
      title: 'Sequence Sales',
      dataIndex: 'sequence_sales',
      editable: false,
      inputType: 'number',
    },
  ];

  const onSave = async (values = {}) => {
    setEditing(false);
    EditVisites(fields.id, {
      ...fields,
      hub_id: id ? parseInt(id) : 0,
      open: moment(fields.open).format(TIME_FORMAT),
      close: moment(fields.close).format(TIME_FORMAT),
    })
      .then((res) => {
        notificationController.success({
          message: 'success',
          description: `Success update Visit ID ${fields.visitid}`,
        });
        refreshTable();
      })
      .catch((err) => {
        notificationController.error({ message: 'error', description: 'failed Add New Visit' });
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...fields,
      hub_id: id ? parseInt(id) : 0,
      open: moment(fields.open, TIME_FORMAT),
      close: moment(fields.close, TIME_FORMAT),
    });
  }, [form, fields]);

  return (
    <Form
      form={form}
      component={false}
      onFieldsChange={(_, allFields) => {
        setFields({ ...fields, [Array.isArray(_[0].name) ? _[0].name[0] : '']: _[0].value });
      }}
    >
      <SMap.sDescription bordered size="small" column={1}>
        {columns.map((col) => {
          if (!col.editable) {
            return (
              <SMap.sDescription.Item label={col.title}>
                <>{col.render ? col.render(fields[col.dataIndex]) : fields[col.dataIndex]}</>
              </SMap.sDescription.Item>
            );
          } else {
            return (
              <>
                {editing ? (
                  <SMap.sDescription.Item label={col.dataIndex}>
                    <Form.Item name={col.dataIndex} style={{ margin: 0 }}>
                      {col.inputType === 'number' ? (
                        <InputNumber />
                      ) : col.inputType === 'time' ? (
                        <TimePicker />
                      ) : (
                        <Input />
                      )}
                    </Form.Item>
                  </SMap.sDescription.Item>
                ) : (
                  <SMap.sDescription.Item label={col.dataIndex}>
                    <>{col.render ? col.render(fields[col.dataIndex]) : fields[col.dataIndex]}</>
                  </SMap.sDescription.Item>
                )}
              </>
            );
          }
        })}
      </SMap.sDescription>
      {editing ? (
        <Row>
          <SMap.EditButton type="text" onClick={onSave}>
            Save
          </SMap.EditButton>
          <SMap.EditButton type="text" onClick={() => setEditing(false)}>
            Cancel
          </SMap.EditButton>
        </Row>
      ) : (
        <SMap.EditButton type="text" onClick={() => setEditing(true)}>
          Edit
        </SMap.EditButton>
      )}
    </Form>
  );
};

export default VisitRow;
