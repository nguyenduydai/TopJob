import { useState, useEffect } from 'react';
import { ContactsOutlined, FireOutlined, LogoutOutlined, MenuFoldOutlined,SmileOutlined,RedditOutlined,RobotOutlined,
     ReadOutlined,HomeOutlined,FormOutlined,AuditOutlined,ClusterOutlined, KubernetesOutlined} from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from 'antd';
import { Menu, ConfigProvider } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState('home');
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={'/job'}>Công Việc IT</Link>,
            key: '/job',
            icon:<FormOutlined />,
        },
        {
            label: <Link to={'/company'}>Top Công ty IT</Link>,
            key: '/company',
            icon: <ClusterOutlined />,
        },
        {
            label: <Link to={'/blog'}>Tin tức IT</Link>,
            key: '/blog',
            icon: <ReadOutlined />,
        },
        {
            label: <Link to={'/recommend'}>Tìm công việc phù hợp</Link>,
            key: '/recommend',
            icon: <AuditOutlined />,
        }
    ];



    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        // ...(user.role?.permissions?.length ? [{
        //     label: <Link
        //         to={"/admin"}
        //     >Trang Quản Trị</Link>,
        //     key: 'admin',
        //     icon: <FireOutlined />
        // },] : []),

        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ?
                        <div style={{ display: "flex", gap: 30 }}>
                            <div className={styles['brand']} >
                                <KubernetesOutlined   onClick={() => navigate('/')} title='Duy Dai' /> <span className={styles['title']} onClick={() => navigate('/')} title='Duy Dai'>TOP JOB</span>
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#fff',
                                            colorBgContainer: '#222831',
                                            colorText: '#a7a7a7',
                                        },
                                    }}
                                >
                                    <Menu style={{width:800}}
                                        // onClick={onClick}
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                    />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <div  className={styles['extra-login']}>
                                            <Link className={styles['extra-login-hr']}  to={'/login?user=hr'}>Bạn là nhà tuyển dụng?</Link>
                                            <Link to={'/login?user=candidate'}>Đăng Nhập</Link>
                                        </div>
                                        :
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                            <Space style={{ cursor: "pointer" }}>
                                                <span>Xin chào {user?.name}</span>
                                                {/* <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar> */}
                                               
                                                <Avatar className={styles['avatar']}> 
                                                    {user?.role?.id == "1" ? ( 
                                                        <RobotOutlined />
                                                        
                                                    ) : user?.company?.id ? (
                                                        <RedditOutlined />
                                                    ) : (
                                                        <SmileOutlined />
                                                    )}
                                                </Avatar>
                                            </Space>
                                        </Dropdown>
                                    }

                                </div>

                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']}>
                            <span>Your APP</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    }
                </div>
            </div>
            <Drawer title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    )
};

export default Header;