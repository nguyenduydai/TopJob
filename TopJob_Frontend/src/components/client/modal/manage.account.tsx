import { Button, Col, Form, Input, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume, ISubscribers } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callChangePasswordUser, callCreateSubscriber, callFetchAllSkill, callFetchResumeByUser, callGetSubscriberSkills, callUpdateSubscriber } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MonitorOutlined,CheckSquareOutlined } from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";
import { IUser } from "@/types/backend";
import { callCreateUser, callFetchCompany, callFetchRole, callUpdateUser,callUserById } from "@/config/api";
import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText ,FooterToolbar} from "@ant-design/pro-components";
import { DebounceSelect } from "@/components/admin/user/debouce.select";
import { useNavigate } from "react-router-dom";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data.result as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công ty',
            dataIndex: "companyName",

        },
        {
            title: 'Tên công việc',
            dataIndex: ["job", "name"],

        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
            render(value, record, index) {
                let displayValue;
                switch (value) {
                    case 'PENDING':
                        displayValue = 'ĐANG CHỜ';
                        break;
                    case 'REVIEWING':
                        displayValue = 'ĐANG XEM XÉT';
                        break;
                    case 'APPROVED':
                        displayValue = 'ĐƯỢC CHẤP NHẬN';
                        break;
                    case 'REJECTED':
                        displayValue = 'BỊ TỪ CHỐI';
                        break;
                    default:
                        displayValue = value; 
                }
                return (
                    <>
                        {displayValue}
                    </>
                );
            },
        },
        {
            title: 'Ngày ứng tuyển',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: 'CV',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <h3>Nhật ký ứng tuyển</h3>
            <br/>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

/////////////////////////////////////
export interface ISelect {
    label: string;
    value: string;
    key?: string;
}
interface UserUpdateInfoProps {
    onCancel?: () => void; // Nhận prop callback từ parent
}
const UserUpdateInfo = ({ onCancel }: UserUpdateInfoProps) => {
    const [dataInit,setDataInit]=useState<IUser | null>(null);
    const user = useAppSelector(state => state.account.user);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notReset,setNotReset]= useState<boolean>(false);
    const [candidate,setCandidate]= useState<boolean>(true);
useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const res = await callUserById(user.id);
        setDataInit(res.data || null);
        
        // Set giá trị trực tiếp vào Form KHÔNG dùng state trung gian
        form.setFieldsValue({
                email: res.data?.email,
                password: res.data?.password, 
                name: res.data?.name,
                age: res.data?.age,
                gender: res.data?.gender,
                address: res.data?.address,
                education: res.data?.education,
                experience: res.data?.experience,
                phone: res.data?.phone,
            role: res.data?.role ? {
                label: res.data.role.name,
                value: res.data.role.id
            } : null,
            company: res.data?.company ? {
                label: res.data.company.name,
                value: res.data.company.id
            } : null
        });
        setIsLoading(false);
        if(res.data?.role?.id=='1'||res.data?.role?.id=='2') setCandidate(false)
    };
        fetchData();
    }, [user.id,notReset]);
    const handleCancel = () => {
        setNotReset(!notReset);
        if (onCancel) onCancel(); // Gọi callback chuyển tab
    };

        const submitUser = async (valuesForm: any) => {
            const { name, email, password,  age, gender,address,education,experience,phone, role, company } = valuesForm;
            if (dataInit?.id) {
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
                    role: role? { 
                        id: role.value,
                        name: role.label 
                    }:undefined,
                    company: company?{
                        id: company.value,
                        name: company.label
                    }:undefined
                }
                const res = await callUpdateUser(user);
                if (res.data) {
                    message.success("Cập nhật user thành công");
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            } 
        }
    
        // Usage of DebounceSelect
        async function fetchCompanyList(name: string): Promise<ISelect[]> {
            const res = await callFetchCompany(`page=1&size=100&name=/${name}/i`);
            if (res && res.data) {
                const list = res.data.result;
                const temp = list.map(item => {
                    return {
                        label: item.name as string,
                        value: item.id as string,
                        key:item.id as string
                    }
                })
                return temp;
            } else {
                {
                        notification.error({
                            message: 'Có lỗi xảy ra load companies',
                            description: res.message
                        });
                        return [];
                }
            }
        }
    
    async function fetchRoleList(name: string): Promise<ISelect[]> {
        const res = await callFetchRole(`page=1&size=100&name=/${name}/i`);
            if (res && res.data) {
                const list = res.data.result;
                const temp = list.map(item => {
                    return {
                        label: item.name as string,
                        value: item.id as string,
                        //key:item.id as string
                    }
                })
                return temp;
        } else {
            {
                    notification.error({
                        message: 'Có lỗi xảy ra load roles',
                        description: res.message
                    });
                    return [];
            }
        }
    }
    return (
        <>
            <h3>Thông tin cá nhân người dùng</h3>
            <br/>
            <ProForm
                form={form}
                onFinish={submitUser}
                submitter={
                    {
                        searchConfig: {
                            resetText: "Cập nhật mật khẩu",
                            submitText: "Cập nhật thông tin"
                        },
                        onReset: handleCancel,
                        submitButtonProps: {
                            icon: <CheckSquareOutlined />
                        },
                    }
                }               
                scrollToFirstError={true}
                loading={isLoading}
            >
                <Row gutter={20}>
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
                            rules={[{ required: false, message: 'Vui lòng không bỏ trống' }]}
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
                            rules={[{ required: false, message: 'Vui lòng chọn giới tính!' }]}
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormSelect
                            name="education"
                            label="Trình độ giáo dục"
                            valueEnum={{
                                HIGH_SCHOOL: "Trung học phổ thông",      // Trung học phổ thông
                                BACHELOR : "Cử nhân",    // Cử nhân
                                MASTER : "Thạc sĩ",        // Thạc sĩ
                                OTHER:"Khác"
                            }}
                            placeholder="Chọn trình độ giáo dục"
                            rules={[{ required: false, message: 'Vui lòng trình độ giáo dục' }]}
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormSelect
                           label="Kinh nghiệm"
                            name="experience"
                            valueEnum={{
                                '0 YEAR': "dưới 1 năm kinh nghiệm",     
                                '1 YEAR': "1 năm kinh nghiệm",
                                '2 YEAR': "2 năm kinh nghiệm",
                                '3 YEAR': "3 năm kinh nghiệm",
                                '4 YEAR': "4 năm kinh nghiệm",
                                '5 YEAR': "5 năm kinh nghiệm",
                                '6 YEAR': "6 năm kinh nghiệm",
                                '7 YEAR': "7 năm kinh nghiệm",
                                '8 YEAR': "8 năm kinh nghiệm",
                                '9 YEAR': "9 năm kinh nghiệm",
                                '10 YEAR': "10 năm kinh nghiệm",       
                            }}
                            placeholder="Nhập kinh nghiệm"
                            rules={[{ required: false, message: 'Vui lòng trình độ giáo dục' }]}
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormText
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: false, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập địa chỉ"
                        />
                    </Col>
                    {(!candidate) && (
                        <>
                        <Col lg={8} md={8} sm={24} xs={24}>
                            <ProForm.Item
                                name="role"
                                label="Vai trò"
                            >
                                <DebounceSelect
                                disabled={true}
                                    allowClear
                                    showSearch
                                    //defaultValue={roles[0]}
                                    value={form.getFieldValue('role')} 
                                    placeholder="USER"
                                    fetchOptions={fetchRoleList}
                                    onChange={(newValue: any) => {
                                        form.setFieldsValue({ role: newValue })
                                    }}
                                    style={{ width: '100%' }}
                                />  
                            </ProForm.Item>
                        </Col>
                        <Col lg={8} md={8} sm={24} xs={24} >
                            <ProForm.Item
                                name="company"
                                label="Thuộc Công Ty"
                            >
                                <DebounceSelect
                                    disabled={true}
                                    allowClear
                                    showSearch
                                    //defaultValue={companies[0]}
                                    value={form.getFieldValue('company')} 
                                    placeholder="Không thuộc công ty nào"
                                    fetchOptions={fetchCompanyList}
                                    onChange={(newValue: any) => {
                                        form.setFieldsValue({ company: newValue })
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>
                        </Col>
                        </>
                    )}
                  
                </Row>
            </ProForm>
    </>
    )
}

const ChangePassword = (props: any) => {
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
        const {oldPassword,newPassword} = values;
        const password={oldPassword,newPassword};
        const res = await callChangePasswordUser(password);
        console.log('Response:', res); // <-- Debug ở đây

        if (+res.statusCode===200) {
            message.success("Thay đổi mật khẩu thành công");
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    return (
        <>
            <h3>Thay đổi mật khẩu người dùng</h3>
            <br/>
            <Form
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        {/* <ProFormText
                            label="Mật khẩu cũ"
                            name={"oldPassword"}
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập mật khẩu cũ"
                        /> */}
                        <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu cũ"
                                name={"oldPassword"}
                                rules={[{ required: true, message: 'Mật khẩu cũ không được để trống!' }]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu cũ" />
                        </Form.Item>

                    </Col>
                    <Col span={24}>
                        <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu mới"
                                name={"newPassword"}
                                rules={[{ required: true, message: 'Mật khẩu mới không được để trống!' }]}
                        >
                                <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>

                    </Col>
                    <Col span={24}>
                        <Button onClick={() => form.submit()}>Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
const JobByEmail = (props: any) => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);

    useEffect(() => {
        const init = async () => {
            if(user?.email)  form.setFieldValue("email",user.email);
            await fetchSkill();
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                setSubscriber(res.data);
                const d = res.data.skills;
                const emaill=res.data.email;
                const arr = d.map((item: any) => {
                    return {
                        label: item.name as string,
                        value: item.id + "" as string
                    }
                });
                form.setFieldValue("skills", arr);
                form.setFieldValue("email",emaill);
            }
        }
        init();
    }, [])

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

    const onFinish = async (values: any) => {
        const { skills,email } = values;
        const arr = skills?.map((item: any) => {

            if (item?.value) return { id: item.value };
            return { id: item }
        });
        if (!subscriber?.id) {
            //create subscriber
            const data = {
                email: email,
                name: user.name,
                skills: arr
            }

            const res = await callCreateSubscriber(data);
            if (res.data) {
                message.success("Cập nhật thông tin thành công");
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }


        } else {
            //update subscriber
            const res = await callUpdateSubscriber({
                id: subscriber?.id,
                email: email,
                name: user.name,
                skills: arr
            });
            if (res.data) {
                message.success("Cập nhật thông tin thành công");
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }


    }

    return (
        <>
            <h3>Đăng ký kỹ năng để nhận công việc mới qua email hàng tuần</h3>
            <br/>
            <Form
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={[20, 30]}>
                    <Col span={24}>
                        <ProFormText
                            label="Email nhận thông báo công việc mới"
                            name={"email"}
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                            ]}
                            
                            disabled
                        />
                        <span style={{color:'#a7a7a7',marginLeft:80}}>Nếu muốn thay đổi email nhận thông báo hãy cập nhật email ở phần "Cập nhật thông tin"</span>
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
                    <Col span={24}>
                        <Button onClick={() => form.submit()}>Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;
    const [activeTab, setActiveTab] = useState('user-update-info'); // State quản lý tab hiện tại
    const user = useAppSelector(state => state.account.user);

    const items: TabsProps['items'] = [
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo  onCancel={() => setActiveTab('user-password')}  />,
        },
        {
            key: 'user-resume',
            label: `Các đơn đã ứng tuyển`,
            children: <UserResume />,
        },
        {
            key: 'email-by-skills',
            label: `Nhận Jobs qua Email`,
            children: <JobByEmail />,
        },

        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children:  <ChangePassword />,
        },
    ];
    const itemsadmin: TabsProps['items'] = [
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo  onCancel={() => setActiveTab('user-password')}  />,
        },

        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children:  <ChangePassword />,
        },
    ];

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-update-info"
                        //items={items}
                        items={(user.role?.id=='1' || user.role?.id=='2') ? itemsadmin: items}
                        activeKey={activeTab} // Kiểm soát tab hiện tại
                        onChange={(key) => setActiveTab(key)} // Cập nhật khi chuyển tab thủ công
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;