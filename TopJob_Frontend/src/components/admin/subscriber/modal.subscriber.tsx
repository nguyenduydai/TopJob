import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Select, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateSubscriber, callFetchAllSkill, callFetchCompany, callFetchRole, callFetchSubscriberById, callUpdateSubscriber } from "@/config/api";
import { ISkill, ISubscribers } from "@/types/backend";
import { MonitorOutlined } from "@ant-design/icons";


interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ISubscribers | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}
const ModalSubscriber = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);
    const [form] = Form.useForm();
    useEffect(() => {
        const init = async () => {
            await fetchSkill();
                        // if (dataInit?.id) {
                        //     const res = await callFetchSubscriberById(dataInit?.id);
                        //     if (res && res.data) {
                        //         const arr =  res.data.skills.map((item: any) => {
                        //             return {
                        //                 label: item.name as string,
                        //                 value: item.id + "" as string
                        //             }
                        //         });
                        //         form.setFieldValue("skills", arr);
                        //         form.setFieldValue("email", res.data.email);
                        //         form.setFieldValue("name", res.data.name);
                        //     }
                        // }
        }
        init();
    }, [dataInit])
    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr = res?.data?.result?.map(item => {
                return {
                    label: item.name as string,
                    value: item.id + "" as string
                }
            }) ?? [];
            setOptionsSkills(arr);
        }
    }
    const submitSubscriber = async (valuesForm: any) => {
        const { skills,email,name } = valuesForm;
        const arr = skills?.map((item: any) => {
            if (item?.value) return { id: item.value };
            return { id: item }
        });
        if (!dataInit?.id) {
            //create subscriber
            const data = {
                email: email,
                name: name,
                skills: arr
            }

            const res = await callCreateSubscriber(data);
            if (res.data) {
                message.success("Cập nhật thông tin thành công");
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }


        } else {
            //update subscriber
            const res = await callUpdateSubscriber({
                id: dataInit?.id,
                email: email,
                name: name,
                skills: arr
            });
            if (res.data) {
                message.success("Cập nhật thông tin thành công");
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    }

    // Usage of DebounceSelect

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? "Cập nhật Subscriber" : "Tạo mới Subscriber"}</>}
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
                onFinish={submitSubscriber}
                initialValues={dataInit?.id ?
                    {
                        ...dataInit,
                        skills: dataInit?.skills.map((item: any) => {
                            return {
                                label: item.name as string,
                                value: item.id + "" as string
                            }
                        })
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
                                options={optionsSkills}
                            />
                        </Form.Item>
                    </Col>
\
                </Row>
            </ModalForm >
        </>
    )
}

export default ModalSubscriber;
