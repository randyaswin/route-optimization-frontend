import React from 'react';
import { Hub } from '@app/components/hub/Hub';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

const HubsPage: React.FC = () => {
  return (
    <>
      <PageTitle>Hubs</PageTitle>
      <Hub />
    </>
  );
};

export default HubsPage;
