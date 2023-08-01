import React, { useState, useEffect } from 'react';
import { Input, DatePicker, Spin, Button, Avatar, message } from 'antd';
import Nav from './Nav';
import Sidebar from './Sidebar';
import dayjs from 'dayjs';
import config from '../config.json';
import { UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';

const API_URL = `${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`;

function Editinfo() {
  const navigate = useNavigate();
  const token = localStorage.getItem('userId')
  const [user, setUser] = useState(null);
  const [inputFields, setInputFields] = useState({ userName: '', userEmail: '', userPostcode: '', userBirthday: '' });
  const [previewImg, setPreviewImg] = useState('');
  const [userImg, setUserImg] = useState('');


  //get the information form database
  useEffect(() => {
    if (!token) {
      message.error('To access the requested content, please log in with your credentials.')
      navigate('/')
    }
    else {
      const fetchData = async () => {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setUserImg(data.userThumbnail)
          setInputFields({ userName: data.userName, userEmail: data.userEmail, userPostcode: data.userPostcode, userBirthday: data.userBirthday });
        } else {
          console.error('Error:', response.status);
        }
      };
      fetchData();
    }
  }, []);

  //handle input
  const handleInputChange = (event, field) => {
    setInputFields({ ...inputFields, [field]: event.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    previewImage(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setUserImg(compressedBase64);
      };
    };

    reader.readAsDataURL(file);
  };

  const previewImage = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setPreviewImg(imageUrl);
  };

  const handleFormSubmit = async () => {
    if (inputFields.userPostcode.toString().length !== 4) {
      message.error('Postcode must be exactly four digits.')
    }
    else {
      let formData = {
        "userId": token,
        "userName": inputFields.userName,
        "userThumbnail": userImg,
        "userPostcode": inputFields.userPostcode,
        "userBirthday": inputFields.userBirthday,
      };

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        message.success('Your information has been updated', () => {
          window.location.reload();
        });
      } else {
        message.error("Update failed");
      }
    }
  };


  const styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      gridTemplateColumns: 'auto 2fr', // Updated column template
      height: '100vh'
    },
    navbar: {
      gridRow: '1 / 2',
      gridColumn: '1 / 4',
      // Styles for the navbar
    },
    sidebar: {
      gridRow: '2 / 3',
      gridColumn: '1 / 2',
      // Styles for the sidebar
    },
    mainContent: {
      gridRow: '2 / 3',
      gridColumn: '2 / 3',
      // Styles for the main content area
    },
    secondaryContent: {
      gridRow: '2 / 3',
      gridColumn: '3 / 4',
      backgroundColor: 'lavender',
      border: '1px solid lightgray',
      // Styles for the secondary content area
    },
    paraStyle: {
      //textAlign: 'center',
      marginLeft: "50px"
    },
    iconStyle: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    hrStyle: {
      marginLeft: "20px",
      marginRight: "20px",
      color: "#808080"
    },
    h1Style: {
      marginLeft: "30px"
    },
    inputStyle: {
      width: '150px',
    },
    spanStyle: {
      border: '1px solid #d9d9d9',
      padding: '5px',
      backgroundColor: 'white',
    }
  };

  if (!user) {
    return <div><Spin /></div>;
  } else {
    const userAvatar = userImg ? (
      <Avatar src={userImg} size={200} style={{ marginRight: 16, cursor: 'pointer' }} />
    ) : (
      <Avatar icon={<UserOutlined />} size={200} style={{ marginRight: 16, cursor: 'pointer' }} />
    );
    return (
      <>
        <div style={styles.gridContainer}>
          <div style={styles.navbar}>
            <Nav />
          </div>
          <div style={styles.sidebar}>
            <Sidebar />
          </div>
          <div style={styles.mainContent}>
            <h1 style={styles.h1Style}>Account information</h1>
            <hr style={styles.hrStyle} />
            <p style={styles.paraStyle}>Upload your profile photo</p>
            <p style={styles.paraStyle}>
              {userAvatar}
              <br />
              <Input
                accept="image/*"
                type="file"
                style={{ width: '200px' }}
                onChange={handleImageChange}
              />
            </p>
            <p style={styles.paraStyle}>User name</p>
            <p style={styles.paraStyle}>
              <Input style={styles.inputStyle} type="text" value={inputFields.userName} onChange={(e) => handleInputChange(e, 'userName')} />
            </p>
            <p style={styles.paraStyle}>Email</p>
            <p style={styles.paraStyle}>
              <Input style={styles.inputStyle} type="text" value={inputFields.userEmail} disabled />
            </p>
            <p style={styles.paraStyle}>Birthday</p>
            <p style={styles.paraStyle}>
              <DatePicker style={styles.inputStyle} value={inputFields.userBirthday ? dayjs(inputFields.userBirthday) : null} format={'YYYY-MM-DD'} disabled />
            </p>
            <p style={styles.paraStyle}>Postcode</p>
            <p style={styles.paraStyle}>
              <Input style={styles.inputStyle} type="text" value={inputFields.userPostcode} onChange={(e) => handleInputChange(e, 'userPostcode')} />
            </p>
            <Button type="primary" onClick={handleFormSubmit} style={{ marginLeft: 250 }}>Submit</Button>
          </div>
        </div>
      </>
    );
  }
}

export default Editinfo;
