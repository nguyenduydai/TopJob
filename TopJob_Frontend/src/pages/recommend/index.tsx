import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Divider, Modal, Popconfirm, Row, Upload, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from 'antd/lib/locale/en_US';
import { EditOutlined, InfoCircleOutlined, QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { callCreateResume, callFetchJobRecommendation, callUploadSingleFile } from "@/config/api";
import { useEffect, useState } from 'react';
import SurveyModal from "@/components/client/modal/survey.modal";
import JobRecommendationCard from "@/components/client/card/jobRecommendation.card";

import styles from 'styles/client.module.scss';


const ClientRecommendPage = () => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const navigate = useNavigate();
    const [isModalToLoginOpen, setIsModalToLoginOpen] = useState<boolean>(false);
    const [isModalPopconfirmOpen, setIsModalPopconfirmOpen] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [reload, setReload] = useState(false);
    const handleOkButton = async () => {
        setIsModalToLoginOpen(false);
        navigate(`/login/?user=candidate&callback=${window.location.href}`)
        //navigate('/login');
    }
    useEffect(() => {
        isAuthenticated?setIsModalToLoginOpen(false):setIsModalToLoginOpen(true);
        if(isAuthenticated){
            fetchJobRecommen();
        }
    }, [])
    const fetchJobRecommen=async()=>{
        const res=await callFetchJobRecommendation('');
        console.log(res.data?.result);
        if(res&&res.data?.result.length===0){

            setIsModalPopconfirmOpen(true);
        }
    }

    return (
    <>
        {isAuthenticated ? 
            <div ><div className={`${styles["container"]} ${styles["modal-infor"]} `} >
                <div style={{paddingTop:20}}></div>
                {isModalPopconfirmOpen ?
                        <div className={`${styles["recommendation"]}`}  >
                            <h3> <InfoCircleOutlined /> Bạn chưa thực hiện khảo sát</h3>
                            <div><QuestionCircleOutlined /> Bạn có muốn thực hiện khảo sát để tìm công việc phù hợp ?</div>
                            <Button type="primary" onClick={()=>setOpenModal(true)}> <EditOutlined/>Thực hiện ngay</Button>
                        </div> :
                        <div className={`${styles["recommendation"]}`}  >
                            {/* <h3> <InfoCircleOutlined /> Bạn chưa thực hiện khảo sát</h3> */}
                            <div><QuestionCircleOutlined /> Bạn có muốn thực hiện bài khảo sát mới ?</div>
                            <Button type="primary" onClick={()=>setOpenModal(true)}> <EditOutlined/>Thực hiện ngay</Button>
                        </div>
                }

                    <div className={styles["container"]} style={{ marginTop: 20 }}>
                    <Row gutter={[20, 20]}>

                        <Col span={24}>
                            <JobRecommendationCard
                                showPagination={true}
                                reload={reload}
                                setReload={setReload}
                            />
                        </Col>
                    </Row>
                </div>
                <SurveyModal 
                 openModal={openModal}
                 setOpenModal={setOpenModal}
                 reload={reload}
                 setReload={setReload}
                />
                </div>
            </div>
            
                :
            <div>
                <Modal title="Hỗ trợ tìm kiếm công việc phù hợp"
                            open={isModalToLoginOpen}
                            onOk={() => handleOkButton()}
                            onCancel={() => setIsModalToLoginOpen(false)}
                            maskClosable={false}
                            okText={"Đăng Nhập Nhanh"}
                            cancelButtonProps={
                                { style: { display: "none" } }
                            }
                            destroyOnClose={true}
                        >     
                            Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để sử dụng tính năng -.-
                </Modal>
            </div>
        }
    </>
    )
}
export default ClientRecommendPage;
