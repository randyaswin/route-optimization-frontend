import React from 'react';
import { HubTable } from './Table/HubTable';
import { useTranslation } from 'react-i18next';
import * as S from './Hub.styles';
import { HubMenu } from './HubMenu';
import { Row } from 'antd';
import { TabPane, Tabs } from '@app/components/common/Tabs/Tabs';
import HubMaps from './Map/HubMaps';

export const Hub: React.FC = () => {
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="hub-table" title={'Hub'} padding="1.25rem 1.25rem 0">
          <Tabs defaultActiveKey="table">
            <TabPane tab="Table" key="table">
              <Row>
                <HubMenu />
              </Row>
              <Row>
                <br></br>
              </Row>
              <HubTable />
            </TabPane>
            <TabPane tab="Map" key="map">
              <Row>
                <HubMenu />
              </Row>
              <Row>
                <br></br>
              </Row>
              <HubMaps />
            </TabPane>
          </Tabs>
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};
