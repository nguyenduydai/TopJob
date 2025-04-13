import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Divider, Modal, Row, Upload, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from 'antd/lib/locale/en_US';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { callCreateResume, callUploadSingleFile } from "@/config/api";
import { useEffect, useState } from 'react';



const ClientRecommendPage = () => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const handleOkButton = async () => {
        setIsModalOpen(false);
        navigate(`/login?callback=${window.location.href}`)
    }
    useEffect(() => {
        isAuthenticated?setIsModalOpen(false):setIsModalOpen(true);
    }, [])
    return (
        <>
                {isAuthenticated ?
                    <div>
                        //todo
                    </div>
                    :
                    <div>
                        <Modal title="Hỗ trợ tìm kiếm công việc phù hợp"
                            open={isModalOpen}
                            onOk={() => handleOkButton()}
                            onCancel={() => setIsModalOpen(false)}
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
