import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Hub.styles';
import { Col, Row } from 'antd';
import { TabPane, Tabs } from '@app/components/common/Tabs/Tabs';
import Maps from './Map/Maps';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { VisitTable } from './Table/VisitTable';
import { VehicleTable } from './Table/VehicleTable';

export const Hub: React.FC = () => {
  const hubData = useAppSelector((state) => state.hubs);
  const [activeKey, setActiveKey] = React.useState('visit');
  return (
    <>
      <S.TablesWrapper>
        <S.Card
          id="hub-table"
          title={hubData.data.length > 0 ? hubData.data[0].name : 'Hub'}
          padding="1.25rem 1.25rem 1.25rem 1.25rem"
        >
          <Tabs defaultActiveKey="table" onChange={(r) => setActiveKey(r)}>
            <TabPane tab="Visit" key="visit"></TabPane>
            <TabPane tab="Vehicle" key="vehicle"></TabPane>
            <TabPane tab="Result" key="result"></TabPane>
            <TabPane tab="Configurations" key="configurations"></TabPane>
          </Tabs>
          <Row gutter={[16, 8]}>
            <Col span={6}>
              {activeKey == 'visit' ? <VisitTable /> : activeKey == 'vehicle' ? <VehicleTable /> : <></>}
            </Col>
            <Col span={18}>
              <Maps />
            </Col>
          </Row>
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};
