import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import { BankOutlined, LikeOutlined, SketchOutlined } from '@ant-design/icons';
import { Menu, Spin, Space, Table, Button, notification, Image, message } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import VoucherPic from './Getvoucher.jpg';
import BirthdayPic from './Birthday.jpg'
import config from '../config.json';

function getItem(label, key, icon, onClick) {
  return {
    key,
    icon,
    label,
    onClick,
  };
}

function GetVoucher() {
  const token = localStorage.getItem('userId');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showHiddenText, setShowHiddenText] = useState(false);
  const [messageApi, contextHolder] = message.useMessage()

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

          const today = new Date();
          const userBirthday = new Date(data.userBirthday);
          if (today.getMonth() === userBirthday.getMonth() && today.getDate() === userBirthday.getDate()) {
            notification.success({
              message: 'Happy Birthday!',
              description: 'As a birthday gift, you can redeem vouchers for half the price today!',
            });
          }

        } else {
          console.error('Error:', response.status);
        }
      };
      fetchData();
    }

  }, []);

  const items = [
    getItem('Redeem', '1', <BankOutlined />, () => navigate('/getvoucher')),
    getItem('Puzzle', '2', <LikeOutlined />, () => navigate('/game')),
  ];

  const onClick = (e) => {
    const item = items.find((i) => i.key === e.key);
    item && item.onClick && item.onClick();
  };

  const handleMoreClick = () => {
    setShowHiddenText(!showHiddenText);
  };

  const handleRedeem = async (record) => {

    const cost = isUserBirthday() ? record.cost / 2 : record.cost;

    if (user.userPoint < cost) {
      messageApi.open({
        type: 'warning',
        content: 'no enough points',
      });
      return;
    }
    const updatedUserPoints = user.userPoint - cost;
    let updatedUserVoucher = JSON.parse(user.userVoucher || '{}');

    switch (record.key) {
      case '1':
        updatedUserVoucher["0.3"] = (updatedUserVoucher["0.3"] || 0) + 1;
        break;
      case '2':
        updatedUserVoucher["0.2"] = (updatedUserVoucher["0.2"] || 0) + 1;
        break;
      case '3':
        updatedUserVoucher["0.1"] = (updatedUserVoucher["0.1"] || 0) + 1;
        break;
      default:
        break;
    }
    const updatedUser = {
      ...user,
      userPoint: updatedUserPoints,
      userVoucher: JSON.stringify(updatedUserVoucher),
    };
    const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: token,
        userPoint: updatedUserPoints,
        userVoucher: updatedUser.userVoucher,
      }),
    });
    if (response.ok) {
      setUser(updatedUser);
      messageApi.open({
        type: 'success',
        content: 'Successfully redeemed voucher',
      });
    } else {
      console.error('Error:', response.status);
    }
  };

  const isUserBirthday = () => {
    const today = new Date();
    const userBirthday = new Date(user.userBirthday);
    return today.getMonth() === userBirthday.getMonth() && today.getDate() === userBirthday.getDate();
  };

  const columns = [
    {
      title: 'Voucher',
      dataIndex: 'voucher',
      key: 'voucher',
      render: text => <><FileOutlined /> {text}</>
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Loyal Points Cost',
      dataIndex: 'cost',
      key: 'cost',
      render: cost => isUserBirthday() ? <><del>{cost}</del> {cost / 2}</> : cost,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {contextHolder}
          <Button onClick={() => handleRedeem(record)}>Redeem</Button>
        </Space>
      ),
    },
  ].map(col => ({
    ...col,
    onHeaderCell: column => ({
      style: { backgroundColor: 'lavender' },
    }),
  }));

  const columnData = [
    {
      key: '1',
      voucher: 'Jade',
      discount: '30% off',
      cost: 300,
    },
    {
      key: '2',
      voucher: 'Golden',
      discount: "20% off",
      cost: 200,
    },
    {
      key: '3',
      voucher: 'Sliver',
      discount: '10% off',
      cost: 100,
    },
  ];


  const styles = {
    mainContainer: {
      display: 'flex',
      height: '100vh',
    },
    menu: {
      flex: 0.6,
      fontSize: '20px'
    },
    menuContainer: {
      margin: '0 0 0 150px'
    },
    contentContainer: {
      flex: 3,
      display: 'flex',
      flexDirection: 'column',
    },
    upperPart: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '30px',
    },
    lowerPart: {
      flex: 3,
    },
    moreLink: {
      color: 'blue',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    h1: {
      margin: '0 0 20px 160px',
    },
    p: {
      margin: '0 0 20px 160px',
    },
    hidep: {
      margin: '10px 0 0 160px',
      fontSize: '12px',
      color: 'grey',
    },
    loyaltyPointsContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    loyaltyPointsText: {
      margin: '0 10px 0 160px',
    },
    icon: {
      fontSize: '30px',
      marginRight: '10px',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      margin: '20px 10px 0 160px',
    },
    iconText: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    greyLine: {
      width: '100%',
      borderTop: '1px solid lightgrey',
      margin: '0 200px 0 180px'
    },
    tableContainer: {
      margin: '0px 100px 20px 200px',
    },
  };

  if (!user) {
    return <div><Spin /></div>;
  } else {
    return (
      <>
        <Nav />
        <div style={styles.mainContainer}>
          <div style={styles.contentContainer}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Image src={isUserBirthday() ? BirthdayPic : VoucherPic} height={450} width={1350} />
            </div>
            <br />
            <div style={styles.menuContainer}>
              <Menu onClick={onClick} mode="horizontal" items={items} style={styles.menu} />
            </div>
            <div style={styles.upperPart}>
              <h1 style={styles.h1}>Get a massive discount!</h1>
              <p style={styles.p}>
                Redeem your Loyalty Points for massive discounts and cheaper access to your favourite events
              </p>
              <div style={styles.loyaltyPointsContainer}>
                <p style={styles.loyaltyPointsText}>My loyalty points</p>
                <a style={styles.moreLink} onClick={handleMoreClick}>
                  {showHiddenText ? 'Less' : 'More'}
                </a>
              </div>
              {showHiddenText && (
                <p style={styles.hidep}>
                  You can earn loyalty points by creating events; every person who attends an event will give you 1 point,
                  and every like you receive for your event will give you 10 points.
                </p>
              )}
              <div style={styles.iconContainer}>
                <SketchOutlined style={styles.icon} />
                <p style={styles.iconText}>{user.userPoint}</p>
              </div>
              <hr style={styles.greyLine} />
            </div>
            <div style={styles.lowerPart}>
              <div style={styles.tableContainer}>
                <Table columns={columns} dataSource={columnData} pagination={false} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default GetVoucher;
