import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { SubMenu, Item } = Menu;

const routes = [
  { path: '/profile', key: '1', parentKey: 'sub1' },
  { path: '/editinfo', key: '2', parentKey: 'sub1' },
  { path: '/resetpassword', key: '3', parentKey: 'sub1' },
  { path: '/userjoinedevents', key: '4', parentKey: 'sub2' },
  { path: '/usercreatedevents', key: '5', parentKey: 'sub2' },
  { path: '/voucher', key: 'sub4' },
  { path: '/message', key: 'sub5' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = routes.find(route => route.path === location.pathname)?.key;
  const activeParentKey = routes.find(route => route.key === activeKey)?.parentKey;

  const [openKeys, setOpenKeys] = useState([activeParentKey]);

  const onClick = ({ key }) => {
    const route = routes.find(r => r.key === key);
    route && navigate(route.path);
    const parentKey = routes.find(r => r.key === key)?.parentKey;

    if (!parentKey) {
      setOpenKeys([]);
    }
  };

  const onOpenChange = keys => {
    setOpenKeys(keys);
  };

  return (
    <Menu
      onClick={onClick}
      onOpenChange={onOpenChange} 
      style={{ width: 256 }}
      openKeys={openKeys} 
      mode="inline"
      selectedKeys={[activeKey]} 
    >
      <SubMenu key="sub1" icon={<UserOutlined />} title="Account">
        <Item key="1">Account info</Item>
        <Item key="2">Edit info</Item>
        <Item key="3">Reset password</Item>
      </SubMenu>
      <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Manage event">
        <Item key="4">Participated event</Item>
        <Item key="5">Created event</Item>
      </SubMenu>
      <Item key="sub4" icon={<MailOutlined />}>Voucher</Item>
      <Item key="sub5" icon={<MessageOutlined />}>Message</Item>
    </Menu>
  );
};

export default Sidebar;
