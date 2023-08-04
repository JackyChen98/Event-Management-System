import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Input, DatePicker } from 'antd';
import { HeartTwoTone, UserOutlined } from '@ant-design/icons';
import Nav from './Nav';
import Sidebar from './Sidebar';
import dayjs from 'dayjs';
import config from '../config.json';

function Myprofile() {
  const token = localStorage.getItem('userId');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [value, setValue] = useState(2.5);
  const [userFollowedNames, setUserFollowedNames] = useState([]);

  useEffect(() => {
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

        const followedIds = JSON.parse(data.userFollowed);
        const usernames = [];
        for (const id of followedIds) {
          const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${id}`);
          const userData = await response.json();
          usernames.push(userData.userName);
        }
        setUserFollowedNames(usernames);
      } else {
        console.error('Error:', response.status);
      }
    };

    fetchData();
  }, []);

  const styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      gridTemplateColumns: 'auto 2fr 1fr',
      height: '100vh'
    },
    navbar: {
      gridRow: '1 / 2',
      gridColumn: '1 / 4',
    },
    sidebar: {
      gridRow: '2 / 3',
      gridColumn: '1 / 2',
    },
    mainContent: {
      gridRow: '2 / 3',
      gridColumn: '2 / 3',
    },
    secondaryContent: {
      gridRow: '2 / 3',
      gridColumn: '3 / 4',
      backgroundColor: 'lavender',
      border: '1px solid lightgray',
    },
    paraStyle: {
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
      width: '250px',
    },
    spanStyle: {
      border: '1px solid #d9d9d9',
      padding: '5px',
      backgroundColor: 'white',
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  } else {
    const userAvatar = user.userThumbnail ? (
      <Avatar src={user.userThumbnail} size={100} style={{ marginRight: 16, cursor: 'pointer' }} />
    ) : (
      <Avatar icon={<UserOutlined />} size={100} style={{ marginRight: 16, cursor: 'pointer' }} />
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
            <p style={styles.paraStyle}>Profile image</p>
            <p style={styles.paraStyle}>
              {userAvatar}
            </p>
            <p style={styles.paraStyle}>User name</p>
            <p style={styles.paraStyle}>
              <Input style={styles.inputStyle} type="text" value={user.userName} disabled />
            </p>
            <p style={styles.paraStyle}>Email</p>
            <p style={styles.paraStyle}>
              <Input style={styles.inputStyle} type="text" value={user.userEmail} disabled />
            </p>
            <p style={styles.paraStyle}>Birthday</p>
            <p style={styles.paraStyle}>
              <DatePicker defaultValue={dayjs(user.userBirthday)} disabled />
            </p>
            <p style={styles.paraStyle}>Postcode</p>
            <p style={styles.paraStyle}>
              <Input style={styles.inputStyle} type="text" value={user.userPostcode} disabled />
            </p>
          </div>
          <div style={styles.secondaryContent}>
            <h1 style={styles.h1Style}>Achievement</h1>
            <hr style={styles.hrStyle}></hr>
            
            <p style={styles.paraStyle}>You have got <span style={{color:'#E4470E', fontSize: '20px'}}>{user.userPoint}</span> loyalty points</p>
            <br />
            <p style={styles.paraStyle}>Your got so many likes!</p>
            <p style={styles.paraStyle}>
              <div style={{ display: 'inline-block' }}>
                <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: '24px' }} />
                <p style={{ display: 'inline', margin: '0', marginLeft: '20px', fontSize: '24px' }}>
                  {user.userReceivedLikes}
                </p>
              </div>
            </p>
            <p style={styles.paraStyle}>You have published <span style={{color:'#E4470E', fontSize: '20px'}}>{JSON.parse(user.userHoldActivityList).length}</span> events</p>
            <br />
            <p style={styles.paraStyle}>Followers: <span style={{color:'#E4470E', fontSize: '20px'}}>{userFollowedNames.length}</span> followers</p>
            <p style={styles.paraStyle}>{userFollowedNames.map((name, index) => (
              <span key={index}>
                {name}{index < userFollowedNames.length - 1 ? ', ' : ''}
              </span>
            ))}
            </p>
          </div>
        </div>
      </>
    );
  }
}

export default Myprofile;
