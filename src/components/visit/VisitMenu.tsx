import React, { useState } from 'react';
import { Button, Modal, Upload } from 'antd';
import { UploadForm } from './Form/UploadForm';
import { AddForm } from './Form/AddForm';

export const VisitMenu: React.FC = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState<boolean>(false);

  return (
    <>
      <AddForm isAddModalVisible={isAddModalVisible} setIsAddModalVisible={setIsAddModalVisible} />
      <UploadForm isUploadModalVisible={isUploadModalVisible} setIsUploadModalVisible={setIsUploadModalVisible} />
      <Button type="default" onClick={() => setIsAddModalVisible(true)} name="add">
        Add
      </Button>
      <Button type="default" onClick={() => setIsUploadModalVisible(true)} name="upload">
        Upload
      </Button>
    </>
  );
};
