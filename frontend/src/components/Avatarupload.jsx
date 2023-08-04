import React, { useState } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import config from '../config.json';

const API_URL = `${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`;

const Avatarupload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem('userId');

  const handleUpload = async (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      let base64Image = reader.result;
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: token,
          userThumbnail: base64Image
        })
      });
      if (response.ok) {
        alert('Your Avatar has been updated');
        window.location.reload();
      } else {
        console.log('Update failed');
      }
    };
    setSelectedFile(null);
  };

  const handleFileChange = (file) => {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      if (file.size <= 48 * 1024) {
        setSelectedFile(file);
        handleUpload(file); // Start upload immediately after file is selected
      } else {
        alert('Please select an image smaller than 48KB.');
      }
    } else {
      alert('Please select a JPG or PNG image file.');
    }
    return false; // Prevent antd Upload from uploading the file
  };

  return (
    <div>
      <Upload
        fileList={selectedFile ? [selectedFile] : []}
        beforeUpload={handleFileChange}
        showUploadList={false} // Don't show upload list
      >
        <Button icon={<UploadOutlined />}>Select and Upload</Button>
      </Upload>
    </div>
  );
};

export default Avatarupload;
