import React from 'react';
import { Col, Row } from 'antd';
import { Card } from 'components/common/Card/Card';
import { PasswordForm } from './passwordForm/PasswordForm/PasswordForm';

export const SecuritySettings: React.FC = () => (
  <Card>
    <Row gutter={[30, 0]}>
      <Col xs={24} xl={10}>
        <PasswordForm />
      </Col>
    </Row>
  </Card>
);
