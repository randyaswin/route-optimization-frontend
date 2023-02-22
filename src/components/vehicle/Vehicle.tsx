import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Vehicle.styles';
import { Row } from 'antd';
import { TabPane, Tabs } from '@app/components/common/Tabs/Tabs';
import { VehicleMenu } from './VehicleMenu';
import { VehicleTable } from './Table/VehicleTable';

export const Vehicle: React.FC = () => {
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="vehicle-table" title={'Vehicle'} padding="1.25rem 1.25rem 0">
          <Row>
            <VehicleMenu />
          </Row>
          <Row>
            <br></br>
          </Row>
          <VehicleTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};
