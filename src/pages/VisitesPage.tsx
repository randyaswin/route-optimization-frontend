import React from 'react';
import { Visit } from '@app/components/visit/Visit';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

const VisitesPage: React.FC = () => {
  return (
    <>
      <PageTitle>Visites</PageTitle>
      <Visit />
    </>
  );
};

export default VisitesPage;
