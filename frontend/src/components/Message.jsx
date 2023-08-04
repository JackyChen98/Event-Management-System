import React, { useState, useEffect } from 'react';
import { Card, Spin, Button } from 'antd';
import { MessageOutlined, MessageTwoTone } from '@ant-design/icons'
import Nav from './Nav';
import Sidebar from './Sidebar';
import config from '../config.json';

const { Meta } = Card;

const Message = () => {
  const token = localStorage.getItem('userId');
  const [user, setUser] = useState(null);
  const [userNames, setUserNames] = useState({}); // New state for usernames

  const styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      gridTemplateColumns: 'auto 2fr',
      height: '100vh'
    },
    navbar: {
      gridRow: '1 / 2',
      gridColumn: '1 / 3',
    },
    sidebar: {
      gridRow: '2 / 3',
      gridColumn: '1 / 2',
    },
    mainContent: {
      gridRow: '2 / 3',
      gridColumn: '2 / 3',
    },
    cardContainer: { 
      display: 'flex', 
      flexDirection: 'column', 
      width: 'calc(100% - 400px)', 
      margin: '0 auto', 
      overflowY: 'auto' 
    },
    card: { width: '100%', marginTop: 16 },
    hrstyle:{ margin: '20px 20px 30px 20px' },
    h1style: { margin: '20px 50px 30px 50px' },
    buttonstyle: { margin: '0 0 0 1000px' }
  };

  const getUsername = async (holderId) => {
    const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${holderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.userName;
    } else {
      console.error('Error:', response.status);
    }
  };

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
      const userNewsList = JSON.parse(data.userNewsList);
      for (const news of userNewsList) {
        const userName = await getUsername(news.holderId);
        setUserNames(userNames => ({...userNames, [news.holderId]: userName}));
      }
    } else {
      console.error('Error:', response.status);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAllAsRead = async () => {
    const userNewsList = JSON.parse(user.userNewsList);
    let updatedNewsList = userNewsList.map(news => ({...news, status: true}));
    updatedNewsList = JSON.stringify(updatedNewsList)

    let response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "userId": token,
        "userNewsList": updatedNewsList
      })
    });

    if(response.ok) {
      setUser(prevState => ({...prevState, userNewsList: updatedNewsList}));
    }
  }

  if (!user) {
    return <div><Spin /></div>;
  } else {
    const userNewsList = JSON.parse(user.userNewsList);
    return (
      <div>
        <div style={styles.gridContainer}>
          <div style={styles.navbar}>
            <Nav />
          </div>
          <div style={styles.sidebar}>
            <Sidebar />
          </div>
          <div style={styles.mainContent}>
            <h1 style={styles.h1style}>Message</h1>
            <hr style={styles.hrstyle}/>
            <Button style={styles.buttonstyle} onClick={markAllAsRead}>Read All</Button>
            <div style={styles.cardContainer}>
              {userNewsList.slice().sort((a, b) => a.status === "false" ? -1 : 1).map((news, index) => (
                <Card key={index} style={styles.card}>
                  <Meta
                    title={userNames[news.holderId]} // Changed to username
                    description={news.message}
                  />
                  <p>{new Date(news.time.slice(0,10)).toLocaleDateString('en-GB')}</p>
                  {news.status == "false" 
                    ? <><MessageOutlined style={{ color: 'red' }} /> Unread</>
                    : <><MessageOutlined /> Read</>}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Message;
