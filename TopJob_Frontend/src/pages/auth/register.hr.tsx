import { Button, Checkbox, Col, ConfigProvider, Divider, Form, Input, Modal, Row, Select, Upload, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister, callUploadSingleFile } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser, IUserRegister } from '@/types/backend';
const { Option } = Select;
import ahr from '../../assets/ahr.jpg';
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
interface IBusinessLicense {
    name: string;
    uid: string;
    url?: string;
}
const RegisterHrPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    //modal animation
    const [animation, setAnimation] = useState<string>('open');
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataBusinessLicense, setDataBusinessLicense] = useState<IBusinessLicense[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [form] = Form.useForm();
    const onFinish = async (values: IUserRegister) => {
        if(checked) {
             if (dataBusinessLicense.length === 0) {    

                        message.error('Vui lòng upload ảnh giấy chứng nhận đăng ký doanh nghiệp');
                    return;
             }
            const { name,phone, email, password, companyName,companyAddress } = values;
            let roleId=+2;
            let age=+0;
            let gender=null;
            let address='';
            let typeVip='VIP 0'
            setIsSubmit(true);
            let active=false;
            const res = await callRegister(name, phone,email, password,companyName, companyAddress,roleId,age,gender,address,typeVip,dataBusinessLicense[0].name,active );
            setIsSubmit(false);
            if (res?.data) {
                message.success('Đăng ký tài khoản nhà tuyển dụng thành công! \n Hãy chờ quản trị viên xác thực tài khoản của bạn ');
                
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
   const handleRemoveFile = (file: any) => {
        setDataBusinessLicense([])
    }

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể upload file JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Hình ảnh phải nhỏ hơn 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };
    
    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };
const handleUploadFileBusinessLicense = async ({ file, onSuccess, onError }: any) => {
    try {
        const res = await callUploadSingleFile(file, "business");
        console.log(res);
        if (res && res.data) {
            setDataBusinessLicense([{
                name: res.data.fileName,
                uid: uuidv4(),
                url: `${import.meta.env.VITE_BACKEND_URL}/storage/business/${res.data.fileName}`,

            }]);
             console.log(dataBusinessLicense);
            if (onSuccess) onSuccess('ok');
        } else {
            throw new Error(res.message);
        }
    } catch (error:any) {
        setDataBusinessLicense([]);
        if (onError) {
            onError({ event: error });
        }
        message.error(error.message || "Đã có lỗi xảy ra khi upload file.");
    }
};
    // const handleUploadFileBusinessLicense = async ({ file, onSuccess, onError }: any) => {
    //     const res = await callUploadSingleFile(file, "businessLicense");
    //     if (res && res.data) {
    //         setDataBusinessLicense([{
    //             name: res.data.fileName,
    //             uid: uuidv4()
    //         }])
    //         if (onSuccess) onSuccess('ok')
    //     } else {
    //         if (onError) {
    //             setDataBusinessLicense([])
    //             const error = new Error(res.message);
    //             onError({ event: error });
    //         }
    //     }
    // };
    const handleReset = async () => {
        form.resetFields();

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 400))

        setAnimation('open')
    }
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
                            <Row gutter={[10,0]}>
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
                                        rules={[{ required: true, message: 'Địa chỉ công ty không được để trống!' }]}
                                    >
                                        <Input  placeholder='Nhập địa chỉ công ty'/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Ảnh giấy chứng nhận đăng ký doanh nghiệp"
                                        name="businessLicense"
                                        rules={[{
                                        required: true,
                                        message: 'Vui lòng không bỏ trống',
                                        validator: () => {
                                            if (dataBusinessLicense.length > 0) return Promise.resolve();
                                            else return Promise.reject(false);
                                        }
                                    }]}
                                    >
                                        <ConfigProvider locale={enUS}>
                                            <Upload
                                                name="businessLicense"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                maxCount={1}
                                                multiple={false}
                                                customRequest={handleUploadFileBusinessLicense}
                                                beforeUpload={beforeUpload}
                                                onChange={handleChange}
                                                onRemove={(file) => handleRemoveFile(file)}
                                                onPreview={handlePreview}
                                                fileList={dataBusinessLicense}
                                            >
                                                <div>
                                                    {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                            </Upload>
                                        </ConfigProvider>
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
                            <Modal
                                open={previewOpen}
                                title={previewTitle}
                                footer={null}
                                onCancel={() => setPreviewOpen(false)}
                                style={{ zIndex: 1500 }}
                            >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
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