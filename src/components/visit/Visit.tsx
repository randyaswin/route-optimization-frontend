import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Visit.styles';
import { Row } from 'antd';
import { TabPane, Tabs } from '@app/components/common/Tabs/Tabs';
import VisitMaps from './Map/VisitMaps';
import { VisitMenu } from './VisitMenu';
import { VisitTable } from './Table/VisitTable';

export const Visit: React.FC = () => {
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="visit-table" title={'Visit'} padding="1.25rem 1.25rem 0">
          <Tabs defaultActiveKey="table">
            <TabPane tab="Table" key="table">
              <Row>
                <VisitMenu />
              </Row>
              <Row>
                <br></br>
              </Row>
              <VisitTable />
            </TabPane>
            <TabPane tab="Map" key="map">
              <Row>
                <VisitMenu />
              </Row>
              <Row>
                <br></br>
              </Row>
              <VisitMaps />
            </TabPane>
          </Tabs>
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};
