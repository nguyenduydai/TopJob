import { Button, Divider, Form, Input, Row, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser, IUserRegister } from '@/types/backend';
const { Option } = Select;
import auser from '../../assets/auser.png';


const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: IUserRegister) => {
        const {name, email, password, age, address } = values;
        let companyName=null;
        let companyAddress='';
        let phone='';
        let roleId=+3;
        let gender=null;
        setIsSubmit(true);
        const res = await callRegister(name,phone, email, password,companyName, companyAddress,roleId, +age, gender, address);
        setIsSubmit(false);
        if (res?.data) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login?user=candidate')
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
        <div className={styles["register-page"]} >

            <main className={styles.main} style={{backgroundColor:'#beebf6'}}>
                <div className={styles.container} >
                        <div  className={` ${styles["user-left"]}`}>
                            <h3>Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc</h3>
                            <h5>Tiếp cận 99,999+ tin tuyển dụng từ hàng nghìn doanh nghiệp uy tín tại Việt Nam</h5>
                            <img
                                width={600}
                                alt="example"
                                src={auser}
                            />
                        </div>
                    <section className={styles.wrapper} >

                        <div className={styles.heading} >
                            <h2 className={`${styles.text} ${styles["text-large"]}`} > Đăng Ký Tài Khoản Ứng Viên</h2>
                            < Divider />
                        </div>
                        < Form<IUserRegister>
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Họ tên"
                                name="name"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input  placeholder='Nhập họ tên ...'/>
                            </Form.Item>


                            <Form.Item
                                labelCol={{ span: 24 }
                                } //whole column
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input type='email'  placeholder='Nhập email ...' />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password  placeholder='Nhập mật khẩu ...' />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Tuổi"
                                name="age"
                            >
                                <Input type='number' placeholder='Nhập tuổi ...' />
                            </Form.Item>


                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Địa chỉ"
                                name="address"

                            >
                                <Input  placeholder='Nhập địa chỉ ...'/>
                            </Form.Item>

                            < Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit} >
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider> Nếu như </Divider>
                            <p className="text text-normal" > Đã có tài khoản ?
                                <span>
                                    <Link to='/login?user=candidate' > Đăng Nhập </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage;