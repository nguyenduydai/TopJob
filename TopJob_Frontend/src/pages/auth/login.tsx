import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from 'config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';
import ahr from '../../assets/ahr.png';
import auser from '../../assets/auser.jpg';
const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const role = useAppSelector(state => state.account.user.role.id);
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");
    const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Màu nền mặc định
    const [name, setName] = useState('Đăng Nhập');
    const [fontSizeHr, setFontSizeHr] = useState(16);
    const [fontSizeCandidate, setFontSizCandidate] = useState(16);
    const [heightCandidate, setHeightCandidate] = useState(250);
    const [heightHr, setHeightHr] = useState(250);
    let user = params?.get("user");
    useEffect(() => {
        params = new URLSearchParams(location.search);
        user = params?.get("user");
        if (user==="candidate") {
            setName('Đăng Nhập Ứng viên');
            setBackgroundColor('#fcf4e6');
            setFontSizCandidate(22);
            setHeightCandidate(300);
        }
        if (user==="hr") {
            setName('Đăng Nhập Nhà Tuyển Dụng');
            setBackgroundColor('#beebf6');  
            setFontSizeHr(22); 
            setHeightHr(300);
        }
        console.log(user);
        console.log(location.search);
    }, [location.search])
    const handleClickUser = () => {
        setName('Đăng Nhập Ứng viên');
        setBackgroundColor('#fcf4e6');
        setFontSizCandidate(22);
        setFontSizeHr(16);
        setHeightCandidate(300);
        setHeightHr(250);
        params.set("user","candidate");
        const newUrl = `${location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    };
    const handleClickHr = () => {
        setName('Đăng Nhập Nhà Tuyển Dụng');
        setBackgroundColor('#beebf6');
        setFontSizeHr(22);
        setFontSizCandidate(16);
        setHeightHr(300);
        setHeightCandidate(250);
        params.set("user","hr");
        const newUrl = `${location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    };
    
    useEffect(() => {
        //đã login => redirect to '/'
        if (isAuthenticated) {
            // navigate('/');
            window.location.href = '/admin';
        }
    }, [])

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);
        let gotoHomePage='/';
        if(res?.data?.user?.role?.id=="2" ||res?.data?.user?.role?.id=="1" ){
            gotoHomePage='/admin';
        }
        
        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user))
            window.location.href = callback ? callback : gotoHomePage;
        } else {    
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };


    return (
        <div className={styles["login-page"]} style={{backgroundColor:`${backgroundColor}`}}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div  className={` ${styles["login-left"]}`}>
                        <div  className={` ${styles["user"]}`}  onClick={handleClickUser}>
                            <h3 style={{ fontSize:fontSizeCandidate} }>Ứng viên</h3>
                            <Divider/>
                            <img
                                width={300}
                                height={heightCandidate}
                                alt="example"
                                src={auser}
                            />
                        </div>
                        <div  className={` ${styles["hr"]}`}  onClick={handleClickHr}>
                            <h3 style={{ fontSize:fontSizeHr} }>Nhà tuyển dụng</h3>
                            <Divider/>
                            <img
                                width={300}
                                height={heightHr}
                                alt="example"
                                src={ahr}
                            />
                        </div>
                    </div>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}> {name} </h2>
                            <Divider />

                        </div>
                        <Form
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="username"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input placeholder='Nhập email tại đây ...' />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password placeholder='Nhập mật khẩu tại đây ...'/>
                            </Form.Item>

                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>   
                            </Form.Item>
                            <Divider>Nếu như</Divider>  
                            <p className="text text-normal">Chưa có tài khoản ứng viên ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
                          
                            <p style={{marginTop:16}} className="text text-normal">Chưa có tài khoản nhà tuyển dụng ?
                                <span>
                                    <Link to='/registerhr' > Đăng Ký Ngay </Link>
                                </span>
                            </p>
                            <Divider/>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;