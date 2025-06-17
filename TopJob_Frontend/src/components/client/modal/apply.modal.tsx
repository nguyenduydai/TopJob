import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Divider, Modal, Row, Upload, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from 'antd/lib/locale/en_US';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { callCreateResume, callUploadSingleFile, callUserById } from "@/config/api";
import { useEffect, useState } from 'react';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, jobDetail } = props;
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [urlCV, setUrlCV] = useState<string>("");
    // useEffect(()=>{
    //     const fetchData = async () => {
    //         const res = await callUserById(user.id);
    //         console.log(res)
    //             if(res.data?.cv){
    //                 setUrlCV(res?.data?.cv);
    //                 const r = await callUploadSingleFile(res.data?.cv, "resume"); 
    //                 console.log(r)
    //             }
    //     }

    //     fetchData();
    // },[]);
    const navigate = useNavigate();

    const handleOkButton = async () => {
        if (!urlCV && isAuthenticated) {
            message.error("Vui lòng upload CV!");
            return;
        }

        if (!isAuthenticated) {
            setIsModalOpen(false);
            navigate(`/login?user=candidate&callback=${window.location.href}`)
        }
        else {
           
            if (jobDetail) {
                const res = await callCreateResume(urlCV, jobDetail?.id, user.email, user.id);
                if (res.data) {
                    notification.success({
                        message: 'Ứng tuyển thành công!',
                        description: "Cảm ơn bạn đã ứng tuyển! Nhà tuyển dụng sẽ sớm phản hồi đơn của bạn qua email.",
                        duration: 6,
                    });
                    //message.success("Ứng tuyển thành công!");
                    setIsModalOpen(false);
                } else { 
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            }
        }
    }

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        accept: "application/pdf,application/msword, .doc, .docx, .pdf",
        async customRequest({ file, onSuccess, onError }: any) {
            const res = await callUploadSingleFile(file, "resume");
            if (res && res.data) {
                setUrlCV(res.data.fileName);
                if (onSuccess) onSuccess('ok')
            } else {
                if (onError) {
                    setUrlCV("");
                    const error = new Error(res.message);
                    onError({ event: error });
                }
            }
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
            }
        },
    };


    return (
        <>
            <Modal title="Ứng Tuyển Công việc"
                open={isModalOpen}
                onOk={() => handleOkButton()}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                okText={isAuthenticated ? "Ứng Tuyển" : "Đăng Nhập Nhanh"}
                cancelButtonProps={
                    { style: { display: "none" } }
                }
                destroyOnClose={true}
            >
                <Divider />
                {isAuthenticated ?
                    <div>
                        <ConfigProvider locale={enUS}>
                            <ProForm
                                submitter={{
                                    render: () => <></>
                                }}
                            >
                                <Row gutter={[10, 10]}>
                                    <Col span={24}>
                                        <div>
                                            Bạn đang ứng tuyển công việc <b>{jobDetail?.name} </b>tại  <b>{jobDetail?.company?.name}</b>
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        <ProFormText
                                            fieldProps={{
                                                type: "email"
                                            }}
                                            label="Email :"
                                            name={"email"}
                                            labelAlign="right"
                                            disabled
                                            initialValue={user?.email}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <ProForm.Item
                                            label={"Upload file CV :"}
                                            rules={[{ required: true, message: 'Vui lòng upload file!' }]}
                                        >
                                            {/* {urlCV &&
                                                <div style={{color:'#a7a7a7',marginBottom:8,textAlign:'center'}}>
                                                    <span>{urlCV}</span><br/> &gt;&gt;&gt; &nbsp;
                                                    <a
                                                    href={`${import.meta.env.VITE_BACKEND_URL}/storage/cvuser/${urlCV}`}
                                                    target="_blank"
                                                    >Xem chi tiết</a>&nbsp; &lt;&lt;&lt;
                                                </div>

                                            } */}
                                            <Upload {...propsUpload}>
                                                <Button icon={<UploadOutlined />} style={{marginLeft:20}}>Tải lên CV của bạn ( Hỗ trợ *.doc, *.docx, *.pdf, and &lt; 5MB )</Button>
                                            </Upload>
                                        </ProForm.Item>
                                    </Col>
                                </Row>

                            </ProForm>
                        </ConfigProvider>
                    </div>
                    :
                    <div>
                        Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể "Ứng tuyển" bạn nhé -.-
                    </div>
                }
                <Divider />
            </Modal>
        </>
    )
}
export default ApplyModal;
