import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Hub } from '@app/components/hub-open/Hub';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { getHub, getOpenHub } from '@app/store/slices/hubsSlice';
import { Form } from 'antd';
import { Pagination } from '@app/api/hub.api';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

const HubOpenPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const hubData = useAppSelector((state) => state.hubs);
  const visitesData = useAppSelector((state) => state.visites);
  const vehicleData = useAppSelector((state) => state.vehicles);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(0);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const fetch = useCallback(
    (id: string) => {
      dispatch(getOpenHub(id));
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(id ? id : '');
  }, [fetch]);

  return (
    <>
      <PageTitle>{hubData.data.length > 0 ? hubData.data[0].name : 'Hub'}</PageTitle>
      <Hub />
    </>
  );
};

export default HubOpenPage;
