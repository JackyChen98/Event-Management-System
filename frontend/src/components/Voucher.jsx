import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { Table, message } from 'antd';
import Sidebar from './Sidebar';
import { FileOutlined } from '@ant-design/icons';
import config from '../config.json';
import { useNavigate } from 'react-router-dom';

function Voucher() {
  const navigate = useNavigate();
  const token = localStorage.getItem('userId');
  const [user, setUser] = useState(null);

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
        } else {
          console.error('Error:', response.status);
        }
      };
      fetchData();
    }
  }, []);

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
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
    },
  ].map(col => ({
    ...col,
    onHeaderCell: column => ({
      style: { backgroundColor: 'lavender' },
    }),
  }));

  const columnData = user && user.userVoucher ? [
    {
      key: '1',
      voucher: 'Jade',
      discount: '30% off',
      number: JSON.parse(user.userVoucher)["0.3"] || 0,
    },
    {
      key: '2',
      voucher: 'Golden',
      discount: "20% off",
      number: JSON.parse(user.userVoucher)["0.2"] || 0,
    },
    {
      key: '3',
      voucher: 'Sliver',
      discount: '10% off',
      number: JSON.parse(user.userVoucher)["0.1"] || 0,
    },
  ] : [];

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
    hrStyle: {
      color: 'gray',
      margin: '0 20px'
    },
    divStyle: {
      marginTop: '50px',
      marginLeft: '40px',
      marginRight: '100px'
    },
    h1Style: {
      marginLeft: '50px'
    }
  }

  return (
    <div style={styles.gridContainer}>
      <div style={styles.navbar}>
        <Nav />
      </div>
      <div style={styles.sidebar}>
        <Sidebar />
      </div>
      <div style={styles.mainContent}>
        <h1 style={styles.h1Style}>Voucher</h1>
        <hr style={styles.hrStyle} />
        <div style={styles.divStyle}>
          <Table columns={columns} dataSource={columnData} pagination={false} />
        </div>
      </div>
    </div>
  );
}

export default Voucher;
