import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Select, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateSubscriber, callFetchAllSkill, callFetchCompany, callFetchRole, callFetchSubscriberById, callUpdateSubscriber } from "@/config/api";
import { IResPaymentDTO, ISkill, ISubscribers } from "@/types/backend";
import { MonitorOutlined } from "@ant-design/icons";


interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IResPaymentDTO | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}
const ModalPaymentHistory = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    }

    // Usage of DebounceSelect


    return (
        <>
            <ModalForm
                title="Lịch sử giao dịch"
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={handleReset}
                initialValues={dataInit?.id ?
                    {
                        ...dataInit,
                    } :{}
                }
            >
                <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập tên"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                            ]}
                            placeholder="Nhập email"
                        />
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label={"Kỹ năng"}
                            name={"skills"}
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}

                        >
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> Tìm theo kỹ năng...
                                    </>
                                }
                                optionLabelProp="label"
                               // options={optionsSkills}
                            />
                        </Form.Item>
                    </Col>
\
                </Row>
            </ModalForm >
        </>
    )
}

export default ModalPaymentHistory;
