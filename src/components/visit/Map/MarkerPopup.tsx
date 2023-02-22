import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import React, { Component, useCallback, useEffect, useState } from 'react';

import { Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Descriptions, Form, Row, TimePicker } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { Button } from '@app/components/common/buttons/Button/Button';
import * as SMap from './maps.styles';
import moment from 'moment';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { Input } from '@app/components/common/inputs/Input/Input';
import { render } from 'react-dom';
import { AddVisit, EditVisites } from '@app/api/visit.api';
import { notificationController } from '@app/controllers/notificationController';
import { getVisit } from '@app/store/slices/visitesSlice';

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

const MarkerPopup: React.FC<any> = ({ row }) => {
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
    const { pagination, sorter } = tableData;
    dispatch(getVisit({ pagination, sorter }));
  };

  const columns = [
    {
      title: 'Visit ID',
      dataIndex: 'visitid',
      editable: true,
      inputType: 'text',
    },
    {
      title: 'Hub ID',
      dataIndex: 'hub_id',
      editable: true,
      inputType: 'number',
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
      <Marker
        key={fields.id}
        position={[fields.latitude, fields.longitude]}
        title={fields.name}
        draggable={editing}
        eventHandlers={{
          click: (e) => {
            console.log('marker clicked', e, fields);
          },
          dragend: (e) => {
            form.setFieldsValue({ latitude: e.target.getLatLng().lat, longitude: e.target.getLatLng().lng });
            console.log('marker dragend', e.target, e.target.getLatLng(), fields);
            setFields({ ...fields, latitude: e.target.getLatLng().lat, longitude: e.target.getLatLng().lng });
            setFields({ ...fields, latitude: e.target.getLatLng().lat, longitude: e.target.getLatLng().lng });
            console.log(fields);
          },
        }}
      >
        <SMap.StyledPop maxWidth={300} maxHeight={350} autoClose={false}>
          <Descriptions title={fields.name} bordered size="small" column={1}>
            {columns.map((col) => {
              if (!col.editable) {
                return (
                  <Descriptions.Item label={col.title}>
                    <>{col.render ? col.render(fields[col.dataIndex]) : fields[col.dataIndex]}</>
                  </Descriptions.Item>
                );
              } else {
                return (
                  <>
                    {editing ? (
                      <Descriptions.Item label={col.dataIndex}>
                        <Form.Item name={col.dataIndex} style={{ margin: 0 }}>
                          {col.inputType === 'number' ? (
                            <InputNumber />
                          ) : col.inputType === 'time' ? (
                            <TimePicker />
                          ) : (
                            <Input />
                          )}
                        </Form.Item>
                      </Descriptions.Item>
                    ) : (
                      <Descriptions.Item label={col.dataIndex}>
                        <>{col.render ? col.render(fields[col.dataIndex]) : fields[col.dataIndex]}</>
                      </Descriptions.Item>
                    )}
                  </>
                );
              }
            })}
          </Descriptions>
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
        </SMap.StyledPop>
      </Marker>
    </Form>
  );
};

export default MarkerPopup;
