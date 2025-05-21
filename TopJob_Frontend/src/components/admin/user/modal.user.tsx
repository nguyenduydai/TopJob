import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchCompany, callFetchRole, callUpdateUser } from "@/config/api";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "./debouce.select";
import { userInfo } from "os";
import { getEducationnName, getExperienceName } from "@/config/utils";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [companies, setCompanies] = useState<ICompanySelect[]>([]);
    const [roles, setRoles] = useState<ICompanySelect[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        console.log("dataInit:", dataInit);

        if (dataInit?.id) {
            // form.setFieldsValue({
            //                 email: dataInit?.email,
            //                 password: dataInit?.password, 
            //                 name: dataInit?.name,
            //                 age: dataInit?.age,
            //                 gender: dataInit?.gender,
            //                 address: dataInit?.address,
                            
            //                 education: getEducationnName(dataInit?.education?dataInit.education:"") ,
            //                 experience: getExperienceName(dataInit?.experience?dataInit?.experience:"") ,
            //                 phone: dataInit?.phone,
                           
            //             role: dataInit?.role ? {
            //                 label:dataInit.role.name,
            //                 value: dataInit.role.id
            //             } : null,
            //             company: dataInit?.company ? {
            //                 label: dataInit.company.name,
            //                 value: dataInit.company.id
            //             } : null
            //         });
            if (dataInit.company) {
                setCompanies([{
                    label: dataInit.company.name,
                    value: dataInit.company.id,
                    key: dataInit.company.id,
                }])
                form.setFieldsValue({
                                        
                                       company: {
                                           label: dataInit.company.name as string,
                                           value: `${dataInit.company?.id}@#$${dataInit.company?.name}` as string,
                                           key: dataInit.company?.id
                                       },
    
                                      
                                   })
            }
            if (dataInit.role) {
                setRoles([
                    {
                        label: dataInit.role?.name,
                        value: dataInit.role?.id,
                        key: dataInit.role?.id,
                    }
                ])
            }
            form.setFieldsValue({active:dataInit.active});
        }
        console.log(dataInit)
    }, [dataInit]);

    const submitUser = async (valuesForm: any) => {
        const { name, email, password,  age, gender,address,education,experience,phone, role, company,active } = valuesForm;
        const cp = company?.value?.split('@#$');

        if (dataInit?.id) {
            //update
            const user = {
                id: dataInit.id,
                name,
                email,
                password,
                age,
                gender,
                address,
                education,
                experience,
                phone,
                role:roles[0]? { 
                    id: roles[0].value,
                    name: roles[0].label
                }:undefined,
                  company: cp ?{
                    id: cp[0],
                    name:  company?.label 
                } : undefined,  
                
                cv:'',
                typeVip:dataInit.typeVip,
                vipExpiry:dataInit.vipExpiry,
                active
            }
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa');
            console.log(user);
            const res = await callUpdateUser(user);
            if (res.data) {
                message.success("Cập nhật user thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const user = {
                name,
                email,
                password,
                age,
                gender,
                address,
                education,
                experience,
                phone,
                role: role? { 
                    id: role.value,
                    name: role.label
                }:undefined,
                  company: cp ?{
                    id: cp[0],
                    name:  company?.label 
                } : undefined,  
                
                cv:'',
                typeVip:"",
                vipExpiry:"",
                active
            }
            const res = await callCreateUser(user);
            if (res.data) {
                message.success("Thêm mới user thành công");
                handleReset();
                reloadTable();
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
        setCompanies([]);
        setRoles([]);
        setOpenModal(false);
    }

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item.id as string
                }
            })
            return temp;
        } else return [];
    }

    async function fetchRoleList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchRole(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item.id as string
                }
            })
            return temp;
        } else return [];
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? "Cập nhật User" : "Tạo mới User"}</>}
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
                initialValues={dataInit?dataInit:{}}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
            >
                <Row gutter={16}>
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
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText.Password
                            disabled={dataInit?.id ? true : false}
                            label="Password"
                            name="password"
                            rules={[{ required: dataInit?.id ? false : true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập password"
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên hiển thị"
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormText
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                { required: false, message: 'Vui lòng không bỏ trống' }
                            ]}
                            placeholder="Nhập số điện thoại"
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormDigit
                            label="Tuổi"
                            name="age"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập nhập tuổi"
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormSelect
                            name="gender"
                            label="Giới Tính"
                            valueEnum={{
                                MALE: 'Nam',
                                FEMALE: 'Nữ',
                                OTHER: 'Khác',
                            }}
                            placeholder="Chọn giới tính"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormSelect
                            name="education"
                            label="Trình độ giáo dục"
                            valueEnum={{
                                HIGH_SCHOOL: "High School",      // Trung học phổ thông
                                BACHELOR : "Bachelor's Degree",    // Cử nhân
                                MASTER : "Master's Degree",        // Thạc sĩ
                                OTHER:"OTHER"
                            }}
                            placeholder="Chọn trình độ giáo dục"
                            rules={[{ required: false, message: 'Vui lòng trình độ giáo dục' }]}
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormText
                            label="Kinh nghiệm"
                            name="experience"
                            
                            placeholder="Nhập kinh nghiệm"
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProForm.Item
                            name="role"
                            label="Vai trò"
                            //rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}

                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={roles}
                                value={roles}
                                placeholder="Chọn công vai trò"
                                fetchOptions={fetchRoleList}
                                onChange={(newValue: any) => {
                               
                                        setRoles(newValue as ICompanySelect[]);
                                        form.setFieldsValue({ role: newValue });
                                    
                                        
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProForm.Item
                            name="company"
                            label="Thuộc Công Ty"
                            //rules={[{ required: true, message: 'Vui lòng chọn company!' }]}
                        >
                                                               <DebounceSelect
                                                                       allowClear
                                                                       showSearch
                                                                       defaultValue={companies}
                                                                       value={companies}
                                                                       placeholder="Chọn công ty"
                                                                       fetchOptions={fetchCompanyList}
                                                                       onChange={(newValue: any) => {
                                                                          // if (newValue?.length === 0 || newValue?.length === 1) {
                                                                           form.setFieldsValue({ company: newValue });
                                                                           setCompanies(newValue as ICompanySelect[]);
                                                                            //}
                                                                       }}
                                                                       style={{ width: '100%' }}
                                                                   />
                        </ProForm.Item>
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormText
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập địa chỉ"
                        />
                    </Col>
                     <Col span={24} md={4}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="active"
                                    checkedChildren="ACTIVE"
                                    unCheckedChildren="INACTIVE"
                                    initialValue={dataInit?.active === true} // Chuyển đổi sang boolean
                                    fieldProps={{
                                        defaultChecked: true,
                                    }}
                                />
                            </Col>
                </Row>
            </ModalForm >
        </>
    )
}

export default ModalUser;
