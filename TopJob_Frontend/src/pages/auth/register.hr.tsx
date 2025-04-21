import { Button, Checkbox, Col, Divider, Form, Input, Row, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser, IUserRegister } from '@/types/backend';
const { Option } = Select;
import ahr from '../../assets/ahr.png';

const RegisterHrPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: IUserRegister) => {
        if(checked) {
            const { name,phone, email, password, companyName,companyAddress } = values;
            let roleId=+2;
            let age=+0;
            let gender=null;
            let address='';
            setIsSubmit(true);
            const res = await callRegister(name, phone,email, password,companyName, companyAddress,roleId,age,gender,address );
            setIsSubmit(false);
            if (res?.data?.id) {
                message.success('Đăng ký tài khoản nhà tuyển dụng thành công!');
                navigate('/login?user=hr')
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description:
                        res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                })
            }
        }else{
            notification.error({
                message: "Có lỗi trong form",
                description:"bạn chưa đồng ý điều khoản",
                duration: 4
            })
        }
        
    };
    const [checked, setChecked] = useState(false);

    const onChange=() => {
        setChecked(!checked);
    };

    return ( 
        <div className={`${styles["register-page"]}  ${styles["register-page-hr"]}` }  >

            <main className={styles.main} >
                <div className={styles.container} >
                    <div  className={` ${styles["hr-left"]}`}>
                        <h4>Tuyển Dụng IT cùng TopJob: Tối Ưu Chi Phí, Tối Đa Hỗ Trợ</h4>
                        <h5>Chúng tôi có thể giúp bạn tiếp cận và tuyển dụng những ứng viên  giỏi nhất</h5>
                        <img
                            width={600}
                            alt="example"
                            src={ahr}
                        />


                    </div>
                    <section className={styles.wrapper} >
                        <div className={styles.heading} >
                            <h2 className={`${styles.text} ${styles["text-large"]}`}> Đăng Ký Tài Khoản Nhà Tuyển Dụng</h2>
                            < Divider />
                        </div>
                        < Form<IUserRegister>
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Row gutter={10}>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item 
                                    labelCol={{ span: 24 }} //whole column
                                    label="Họ tên"
                                    name="name"
                                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                                    >
                                    <Input placeholder='Nhập họ tên'/>
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }} //whole column
                                        label="Số điện thoại"
                                        name="phone"
                                        
                                    >
                                        <Input placeholder='Nhập số điện thoại'/>
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>       
                                    <Form.Item
                                        labelCol={{ span: 24 }
                                        } //whole column
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, message: 'Email không được để trống!' }]}
                                    >
                                        <Input type='email'  placeholder='Nhập email' />
                                    </Form.Item >
                                </Col>

                                <Col lg={12} md={12} sm={24} xs={24}>
                                
                                    <Form.Item
                                        labelCol={{ span: 24 }} //whole column
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                    >
                                        <Input.Password  placeholder='Nhập mật khẩu'/>
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }} //whole column
                                        label="Tên công ty"
                                        name="companyName"
                                        rules={[{ required: true, message: 'Tên công ty không được để trống!' }]}
                                    >
                                        <Input  placeholder='Nhập tên công ty'/>
                                    </Form.Item>
                                </Col>
                            
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }} //whole column
                                        label="Địa chỉ công ty"
                                        name="companyAddress"
                                    >
                                        <Input  placeholder='Nhập địa chỉ công ty'/>
                                    </Form.Item>
                                </Col>
                                <Col lg={24} md={24} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }} //whole column
                                        name="infor"
                                        label="Bạn biết đến chúng tôi thông qua đâu ? "
                                        
                                    >
                                        <Select
                                            allowClear
                                        >
                                            <Option value="Facebook">Facebook</Option>
                                            <Option value="LinkedIn">LinkedIn</Option>
                                            <Option value="Google">Google</Option>  
                                            <Option value="Newspaper">Newspaper</Option>
                                            <Option value="TikTok">TikTok</Option>
                                            <Option value="Others">Khác</Option>
                                        </Select>
                                    </Form.Item>
                                    </Col>
                                <Col lg={24} md={24} sm={24} xs={24}>
                                    <Checkbox checked={checked} onChange={onChange} style={{marginBottom:30}}>
                                    Bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của TopJob
                                    </Checkbox>  
                                </Col>
                                <Col lg={24} md={24} sm={24} xs={24}>
                                < Form.Item
                                    // wrapperCol={{ offset: 6, span: 16 }}
                                    >
                                        <Button type="primary" htmlType="submit" loading={isSubmit} >
                                            Đăng ký
                                        </Button>
                                    </Form.Item>
                                </Col>

                            </Row>    
                           
                            <Divider> Nếu như </Divider>
                            <p className="text text-normal" > Đã bạn có tài khoản ?
                                <span>
                                    <Link to='/login?user=hr' > Đăng Nhập </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default RegisterHrPage;