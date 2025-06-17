import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Divider, Modal, Row, Upload, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from 'antd/lib/locale/en_US';
import { AndroidOutlined, CrownOutlined, DiffOutlined, DollarOutlined, FieldTimeOutlined, FileSearchOutlined, FireOutlined, FundProjectionScreenOutlined, FundViewOutlined, LoadingOutlined, MoneyCollectOutlined, PoundCircleOutlined, QqOutlined, QrcodeOutlined, RocketOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { callCreateResume, callPaymentCreate, callUploadSingleFile, callUserById } from "@/config/api";
import { useEffect, useState } from 'react';
import styles from 'styles/admin.module.scss';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
}

const PaymentModal = (props: IProps) => {
    const { isModalOpen, setIsModalOpen } = props;
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);;
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [click1, setClick1] = useState(false);
    const [click2, setClick2] = useState(false);
       const [vip, setVip] = useState<string>('');
    // useEffect(()=>{
    //     const fetchData = async () => {
    //     const res = await callUserById(user.id);
    //         if(res.data?.cv){
    //             setUrlCV(res?.data?.cv);
    //         }
    //     }
    //     fetchData();
    // },[]);
     useEffect(() => {
            handleGetUser();
        }, [])
               const handleGetUser=async()=>{
                        const res=await callUserById(user.id);
                        console.log(user.id);
                        if(res?.data){
                            setVip(res.data?.typeVip);
                        }
                } 
    const handleOkButton = async () => {
        if(vip==="VIP 2"){
            notification.error({
                message: 'Tài khoản hiện tại của bạn là VIP 2',
                description: 'Tài khoản của bạn chưa hết hạn vip, bạn không cần nâng cấp thêm'
            });
        } else if(vip==="VIP 1" && query==='amount=2999000&orderInfo=vip1'){
            notification.error({
                message: 'Tài khoản hiện tại của bạn là VIP 1',
                description: 'Tài khoản của bạn chưa hết hạn vip, bạn không cần nâng cấp thêm'
            });
        }else{
            const res = await callPaymentCreate(query);
            if(res.data?.code=="ok"){
                message.success("Chuyển trang thanh toán thành công");
                window.location.href=res.data.paymentUrl;
            }
            else{
                message.error("Chuyển trang thanh toán thất bại");
            }
        }
    }
    const handleClickVip1=()=>{
        setClick1(!click1);
        if(click2===true)   setClick2(false);
        setQuery('amount=2999000&orderInfo=vip1');
    }

    const handleClickVip2=()=>{
        setClick2(!click2);
        if(click1===true)   setClick1(false);
        setQuery('amount=8999000&orderInfo=vip2');
    }

    return (
        <>
            <Modal title="Nâng câp tài khoản nhà tuyển dụng"
                open={isModalOpen}
                onOk={() => handleOkButton()}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                okText="Thanh toán"
                cancelButtonProps={
                    { style: { display: "none" } }
                }
                destroyOnClose={true}
                className={`${styles["payment-modal"]}`}
                width={"795px"}
            >
                <Divider />
       
                    <div style={{backgroundColor:'#f6703d', borderRadius:10,paddingLeft:10,paddingTop:20,paddingBottom:20}}> 
                            <ProForm
                                submitter={{
                                    render: () => <></>
                                }}
                            >   
                                <p > <AndroidOutlined /> Tài khoản hiện tại của bạn là : {vip}</p>
                                {vip==="VIP 0" ? 
                                <div ><QrcodeOutlined /> Quyền lợi:
                                   <p>Đăng trải nghiệm 1 công việc đầu tiên</p> 
                                </div>: vip==="VIP 1"? 
                                <div ><QrcodeOutlined /> Quyền lợi:
                                    <p>- 8 tin tuyển dụng mới mỗi năm</p>
                                    <p>- Đề xuất công việc ở danh sách việc làm cho ứng viên</p>
                                    <p>- Đề xuất công ty ở "Công ty tuyển dụng hàng đầu"</p>     
                                    <p>- Thời hạn : 1 năm</p>
                                </div> :
                                <div><QrcodeOutlined /> Quyền lợi:
                                    <p>- Không giới hạn tin tuyển dụng mới mỗi năm</p>
                                    <p>- Đề xuất công việc ở danh sách việc làm cho ứng viên</p>
                                    <p>- Đề xuất công ty ở "Công ty tuyển dụng hàng đầu"</p>
                                    <p>- Mở khóa chức năng tìm kiếm ứng viên tiềm năng</p>
                                    <p>- Thời hạn : 2 năm</p>
                                </div>
                                }
                                <p style={{color:'#fbebd2'}}><RocketOutlined /> Hãy nâng cấp tài khoản của bạn để được hưởng nhiều quyền lợi và hỗ trợ hơn !!!</p>
                                <p style={{color:'#fbebd2'}}><FireOutlined /> Khám phá các gói nâng cấp hấp dẫn:</p>
                                <Divider />
                                <Row gutter={[20, 20]}>

                                    <Col span={24} md={12}> 
                                        <div onClick={()=>handleClickVip1()}  className={`${styles["payment-content"]}  ${styles[`${click1 ? 'active' : ''}`]}`}>
                                            <h3 style={{textAlign:'center'}}>VIP 1 <CrownOutlined /></h3>
                                            <p><DiffOutlined /> 8 tin tuyển dụng mới mỗi năm</p>
                                            <p><FundViewOutlined /> Đề xuất công việc ở danh sách việc làm cho ứng viên</p>
                                            <p><FundProjectionScreenOutlined /> Đề xuất công ty ở "Công ty tuyển dụng hàng đầu"</p>
                                            <p><FieldTimeOutlined /> Thời hạn : 1 năm</p>
                                            <br/>
                                            <p style={{textAlign:'center'}}><DollarOutlined /> 2.999.000 VNĐ</p>    
                                        </div>
                                    </Col>
                                    <Col span={24} md={12}>
                                        <div onClick={()=>handleClickVip2()}   className={`${styles["payment-content"]}  ${styles[`${click2 ? 'active' : ''}`]}`}>
                                            <h3 style={{textAlign:'center'}}>VIP 2 <CrownOutlined /></h3>
                                            <p><DiffOutlined /> Không giới hạn tin tuyển dụng mới mỗi năm</p>
                                            <p><FundViewOutlined /> Đề xuất công việc ở danh sách việc làm cho ứng viên</p>
                                            <p><FundProjectionScreenOutlined /> Đề xuất công ty ở "Công ty tuyển dụng hàng đầu"</p>
                                            <p><FileSearchOutlined /> Mở khóa chức năng tìm kiếm ứng viên tiềm năng</p>
                                            <p><FieldTimeOutlined /> Thời hạn : 2 năm</p>
                                            <p style={{textAlign:'center'}}><DollarOutlined /> 8.999.000 VNĐ</p>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <p style={{textAlign:'center', marginTop:20,color:'#fbebd2'}}><LoadingOutlined /> Đừng bỏ lỡ cơ hội nâng cấp và tận hưởng những lợi ích tuyệt vời này! <LoadingOutlined /></p>
                            </ProForm>
                    </div>
            </Modal>
        </>
    )
}
export default PaymentModal;
