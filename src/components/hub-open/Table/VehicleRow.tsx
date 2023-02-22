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
import { AddVehicle, EditVehicles } from '@app/api/vehicle.api';
import { notificationController } from '@app/controllers/notificationController';
import { getVehicle } from '@app/store/slices/vehiclesSlice';
import { getOpenHub } from '@app/store/slices/hubsSlice';
import { useParams } from 'react-router-dom';

const TIME_FORMAT = 'HH:mm:ss';

interface VehicleCreate {
  vehicleid: string;
  name: string;
  hub_id: number;
  start: string;
  end: string;
  capacity: number;
  distance: number;
  work_time: number;
  [propName: string]: any;
}

const VehicleRow: React.FC<any> = ({ row }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<VehicleCreate>({
    ...row,
    start: moment(row.start, TIME_FORMAT),
    end: moment(row.end, TIME_FORMAT),
  });
  const tableData = useAppSelector((state) => state.vehicles);

  const refreshTable = () => {
    dispatch(getOpenHub(id ? id : ''));
  };

  const columns = [
    {
      title: 'Vehicle ID',
      dataIndex: 'vehicleid',
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
      title: 'Capacity',
      dataIndex: 'capacity',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Start',
      dataIndex: 'start',
      editable: true,
      inputType: 'time',
      render: (value: any) => {
        return moment(value).format('HH:mm:ss');
      },
    },
    {
      title: 'End',
      dataIndex: 'end',
      editable: true,
      inputType: 'time',
      render: (value: any) => {
        return moment(value).format('HH:mm:ss');
      },
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Work Time',
      dataIndex: 'work_time',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Total Load',
      dataIndex: 'total_load',
      editable: false,
      inputType: 'number',
    },
    {
      title: 'Total Distance',
      dataIndex: 'total_distance',
      editable: false,
      inputType: 'number',
    },
    {
      title: 'Total Time',
      dataIndex: 'total_time',
      editable: false,
      inputType: 'number',
    },
    {
      title: 'Used',
      dataIndex: 'used',
      editable: false,
      inputType: 'text',
    },
  ];

  const onSave = async (values = {}) => {
    setEditing(false);
    EditVehicles(fields.id, {
      ...fields,
      hub_id: id ? parseInt(id) : 0,
      start: moment(fields.start).format(TIME_FORMAT),
      end: moment(fields.end).format(TIME_FORMAT),
    })
      .then((res) => {
        notificationController.success({
          message: 'success',
          description: `Success update Vehicle ID ${fields.vehicleid}`,
        });
        refreshTable();
      })
      .catch((err) => {
        notificationController.error({ message: 'error', description: 'failed Add New Vehicle' });
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...fields,
      hub_id: id ? parseInt(id) : 0,
      start: moment(fields.start, TIME_FORMAT),
      end: moment(fields.end, TIME_FORMAT),
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

export default VehicleRow;
