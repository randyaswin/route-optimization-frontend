import React from 'react';
import { Vehicle } from '@app/components/vehicle/Vehicle';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

const VehiclesPage: React.FC = () => {
  return (
    <>
      <PageTitle>Vehicles</PageTitle>
      <Vehicle />
    </>
  );
};

export default VehiclesPage;
