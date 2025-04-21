import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    ApiOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AndroidOutlined,RedditOutlined,
    FormOutlined,ClusterOutlined,IdcardOutlined,
    DeploymentUnitOutlined,ReadOutlined,MonitorOutlined,RobotOutlined,
    LogoutOutlined,
    ContactsOutlined
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button ,Spin} from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { callLogout } from 'config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { ALL_PERMISSIONS } from '@/config/permissions';
import styles from '../../styles/admin.module.scss'
import ManageAccount from '../client/modal/manage.account'
const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const user = useAppSelector(state => state.account.user);
    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

    const permissions = useAppSelector(state => state.account.user.role.permissions);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isHr=useAppSelector(state => state.account.user.company?.id);
    useEffect(() => {
        const ACL_ENABLE = import.meta.env.VITE_ACL_ENABLE;
        if (permissions?.length || ACL_ENABLE === 'false') {

            const viewCompany = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.method
            )

            const viewUser = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )

            const viewJob = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.JOBS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method
            )
            const viewBlog = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.BLOGS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.BLOGS.GET_PAGINATE.method
            )

            const viewResume = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.method
            )

            const viewRole = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
            )

            const viewPermission = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )
            const viewTalentCandidate= (isHr ===undefined)?false:true;
            const full = [
                {
                    label: <Link to='/admin'>Trang chủ</Link>,
                    key: '/admin',
                    icon: <AppstoreOutlined />
                },
                ...(viewCompany || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/company'>Công ty</Link>,
                    key: '/admin/company',
                    icon: <ClusterOutlined />,
                }] : []),


                ...(viewJob || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/job'>Công việc</Link>,
                    key: '/admin/job',
                    icon: <FormOutlined />
                }] : []),
                ...(viewBlog || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/blog'>Tin tức</Link>,
                    key: '/admin/blog',
                    icon: <ReadOutlined />
                }] : []),
                ...(viewRole || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/subscriber'>Người đăng ký</Link>,
                    key: '/admin/subscriber',
                    icon: <IdcardOutlined />
                }] : []),
                ...(viewResume || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/resume'>Đơn ứng tuyển</Link>,
                    key: '/admin/resume',
                    icon: <IdcardOutlined />
                }] : []),
                ...(viewUser || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/user'>Người dùng</Link>,
                    key: '/admin/user',
                    icon: <UserOutlined />
                }] : []),
                ...(viewPermission || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/permission'>Quyền hạn</Link>,
                    key: '/admin/permission',
                    icon: <ApiOutlined />
                }] : []),
                ...(viewRole || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/role'>Vai trò</Link>,
                    key: '/admin/role',
                    icon: <DeploymentUnitOutlined />
                }] : []),

                ...(viewTalentCandidate || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/talentcandidate'>Tìm kiếm ứng viên</Link>,
                    key: '/admin/talentcandidate',
                    icon: <MonitorOutlined />
                }] : []),

            ];

            setMenuItems(full);
        }
    }, [permissions])
    useEffect(() => {
        setActiveMenu(location.pathname)
    }, [location])

    const handleLogout = async () => {
        console.log('chay vao day');
        setIsLoading(true);
        const res = await callLogout();
        if (res && +res.statusCode === 200) {
            setIsLoading(false);
            dispatch(setLogoutAction({}));
            message.success(`Đăng xuất thành công `);
            (isHr ===undefined) ? navigate('/login') : navigate('/login?user=hr');
            console.log('chay vao vong if');

        }
    }
 


    // if (isMobile) {
    //     items.push({
    //         label: <label
    //             style={{ cursor: 'pointer' }}
    //             onClick={() => handleLogout()}
    //         >Đăng xuất</label>,
    //         key: 'logout',
    //         icon: <LogoutOutlined />
    //     })
    // }

    const itemsDropdown = [
        {
            label: <label
            style={{ cursor: 'pointer' }}
            onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        // {
        //     label: <Link to={'/'}>Trang chủ</Link>,
        //     key: 'home',
        // },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];
   

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className={`${styles["layout-admin"]}` }
            >
                  
                {!isMobile ?
                    <Sider
                        // style={{width:500}}
                        className={`${styles["menu"]}`}
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}>
                        <div style={{ height: 32, margin: 16, textAlign: 'center', fontSize:18 }}>
                        <AndroidOutlined/>
                            {!collapsed && (
                                user.role?.name === "SUPER_ADMIN" 
                                ? <span>Quản trị viên</span> 
                                : <span>Nhà tuyển dụng</span>
                            )}
                        </div>
                        <Menu

                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                    :
                    <Menu
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                }

                <Layout>
                    {!isMobile &&
                        <div className='admin-header' style={{ display: "flex", justifyContent: "space-between", marginRight: 20 }}>
                            <Button
                                type="text"
                                icon={collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined)}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />

                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }}>
                                    Chào mừng bạn  {user?.name}
                                    <Avatar className={styles['avatar']}> 
                                                    {user?.role?.id == "1" ? ( 
                                                        <RobotOutlined />
                                                        
                                                    ) :  (
                                                        <RedditOutlined />
                                                    ) }
                                    </Avatar>

                                </Space>
                              
                            </Dropdown>
                        </div>
                    }
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                        {/* <Spin spinning={isLoading} tip="Loading..."></Spin> */}

                    </Content>
                    {/* <Footer style={{ padding: 10, textAlign: 'center' }}>
                        React Typescript series Nest.JS &copy; Hỏi Dân IT - Made with <HeartTwoTone />
                    </Footer> */}
                </Layout>
            </Layout>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    );
};

export default LayoutAdmin;