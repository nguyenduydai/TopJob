import { Breadcrumb, Col, ConfigProvider, Divider, Form, Row, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import { FooterToolbar, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import styles from 'styles/admin.module.scss';
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { ICompanySelect } from "../user/modal.user";
import { useState, useEffect } from 'react';
import { callCreateJob, callFetchAllSkill, callFetchCompany, callFetchJobAdmin, callFetchJobById, callUpdateJob, callUserById } from "@/config/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from 'antd/lib/locale/en_US';
import { IJob, ISkill } from "@/types/backend";
import { useRef } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/en'; // hoặc 'en' tùy bạn
import { useAppSelector } from "@/redux/hooks";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale('en');
dayjs.extend(customParseFormat);
interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}

const ViewUpsertJob = (props: any) => {
    const [companies, setCompanies] = useState<ICompanySelect[]>([]);
    const [skills, setSkills] = useState<ISkillSelect[]>([]);

    const navigate = useNavigate();
    const [value, setValue] = useState<string>("");

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
    const [form] = Form.useForm();
    const inputRef = useRef<any>(null);
    const clearIconSelector = '.ant-picker-clear';
    const user = useAppSelector(state => state.account.user);
    const displayCompany=user?.role?.id=="1" ? false:true;
     const [totalJob, setTotalJob] = useState<number>(0);
     const [vip, setVip] = useState<string>('');
    useEffect(() => {
        fetchJob();
        handleGetUser();
    }, [])
        
        const fetchJob = async () => {
                const res = await callFetchJobAdmin('');
                if (res && res.data) {
                    setTotalJob(res.data.meta.total);
                }else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
        }
           const handleGetUser=async()=>{
                    const res=await callUserById(user.id);
                    console.log(user.id);
                    if(res?.data){
                        setVip(res.data?.typeVip);
                    }
            } 
    useEffect(() => {
        const init = async () => {
            const temp = await fetchSkillList();
            setSkills(temp);
            if(user?.role?.id!="1"){
                setCompanies([
                    {
                        label: user?.company?.name as string,
                        value: `${user.company?.id}` as string,
                        key:user?.company?.id 
                    }
                ])
            }
            if (id) {
                const res = await callFetchJobById(id);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    setValue(res.data.description);
                    setCompanies([
                        {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?.id}` as string,
                            key: res.data.company?.id
                        }
                    ])

                    //skills
                    const temp: any = res.data?.skills?.map((item: ISkill) => {
                        return {
                            label: item.name,
                            value: item.id,
                            key: item.id
                        }
                    })
                    form.setFieldsValue({
                        ...res.data,
                        startDate: dayjs(res.data.startDate, "YYYY-MM-DD hh:mm:ss"), // hoặc "YYYY-MM-DD" nếu định dạng là ISO
                        endDate: dayjs(res.data.endDate, "YYYY-MM-DD hh:mm:ss"), // hoặc "YYYY-MM-DD" nếu định dạng là ISO
                        company: {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?.id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?.id
                        },
                        skills: temp,
                       
                    })
                }
            }
        }
        init();
        return () => form.resetFields()
    }, [id])

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(`page=1&size=100&name ~ '${name}'`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: `${item.id}@#$${item.logo}` as string
                }
            })
            return temp;
        } else return [];
    }

    async function fetchSkillList(): Promise<ISkillSelect[]> {
        const res = await callFetchAllSkill(`page=1&size=100`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: `${item.id}` as string
                }
            })
            return temp;
        } else return [];
    }

    const onFinish = async (values: any) => {
        let companyHr=  {
            id: '',
            name: '',
        };
        if(!displayCompany){
            companyHr={
                id:user.company.id?user.company.id :'',
                name:user.company.name?user.company.name:''
            }
        }


        if (dataUpdate?.id) {
            //update
            const cp = values?.company?.value?.split('@#$');

            let arrSkills = [];
            if (typeof values?.skills?.[0] === 'object') {
                arrSkills = values?.skills?.map((item: any) => { return { id: item.value } });
            } else {
                arrSkills = values?.skills?.map((item: any) => { return { id: +item } });
            }
            console.log('chay voa day');
            
            const job = {
                name: values.name,
                skills: arrSkills,
                 company: cp ?{
                    id: cp[0],
                    name:  values?.company?.label 
                } : undefined,  
                
                
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                jobEnvironment:values.jobEnvironment,
                description: value,
                experienceRequirement:values.experienceRequirement,
                startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.startDate) ? dayjs(values.startDate, 'DD/MM/YYYY').toDate() : values.startDate,
                endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate) ? dayjs(values.endDate, 'DD/MM/YYYY').toDate() : values.endDate,
                active: values.active,
            }
            const res = await callUpdateJob(job, dataUpdate.id);
            if (res.data) {
                message.success("Cập nhật job thành công");
                navigate('/admin/job')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            if(  (totalJob>=1&&vip==="VIP 0") || (totalJob>=8&&vip==="VIP 1") ){
                notification.error({
                    message: 'Tài khoản bạn đã đăng số tin tuyển dụng tối đa',
                    description: "Hãy nâng cấp tài khoản để có thể đăng thêm tin tuyển dụng"
                });
            }else{
            //create
            const cp = values?.company?.value?.split('@#$');
            const arrSkills = values?.skills?.map((item: string) => { return { id: +item } });
            const job = {
                name: values.name,
                skills: arrSkills,
                company: cp ?{
                    id: cp[0],
                    name:  values?.company?.label 
                } : undefined,  
                
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                jobEnvironment:values.jobEnvironment,
                description: value,
                startDate: dayjs(values.startDate, 'DD/MM/YYYY').toDate(),
                endDate: dayjs(values.endDate, 'DD/MM/YYYY').toDate(),
                active: values.active,
                 experienceRequirement:values.experienceRequirement
            }
            const res = await callCreateJob(job);
            if (res.data) {
                message.success("Tạo mới job thành công");
                navigate('/admin/job')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
            }
           
        }
    }


    return (
        <div className={styles["upsert-job-container"]}>
            <h2>{dataUpdate?.id ?"Cập nhật công việc" :"Thêm công việc mới"}</h2>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to="/admin/job">Quản lý công việc</Link>,
                        },
                        {
                            title: <>{dataUpdate?.id ?"Cập nhật công việc" :"Thêm công việc mới"}</> ,
                        }
                    ]}
                />
                {user?.role?.id && user?.role?.id=='2' && <div style={{textAlign:'center',color:'#1677ff'}}>Bạn đã đăng {totalJob} tin tuyển dụng trong năm nay</div>}
            </div>
            <div >

                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={
                            {
                                searchConfig: {
                                    resetText: "Hủy",
                                    submitText: <>{dataUpdate?.id ? "Cập nhật Job" : "Tạo mới Job"}</>
                                },
                                onReset: () => navigate('/admin/job'),
                                render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                                submitButtonProps: {
                                    icon: <CheckSquareOutlined />
                                },
                            }
                        }
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={12}>

                                <ProFormText
                                    label="Tên Job"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Vui lòng không bỏ trống' },
                                    ]}
                                    placeholder="Nhập tên job"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="skills"
                                    label="Kỹ năng yêu cầu"
                                    options={skills}
                                    placeholder="Chọn kỹ năng"
                                    rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
                                    allowClear
                                    mode="multiple"
                                    fieldProps={{
                                        suffixIcon: null
                                    }}
                                />
                            </Col>

                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="location"
                                    label="Địa điểm"
                                    options={LOCATION_LIST.filter(item => item.value !== 'ALL')}
                                    placeholder="Nhập địa điểm"
                                    rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Mức lương"
                                    name="salary"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập mức lương"
                                    fieldProps={{
                                        addonAfter: " đ",
                                        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                        parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, '')
                                    }}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Số lượng"
                                    name="quantity"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập số lượng"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="level"
                                    label="Trình độ"
                                    valueEnum={{
                                        INTERN: 'INTERN',
                                        FRESHER: 'FRESHER',
                                        JUNIOR: 'JUNIOR',
                                        MIDDLE: 'MIDDLE',
                                        SENIOR: 'SENIOR',
                                    }}
                                    placeholder="Nhập trình độ"
                                    rules={[{ required: true, message: 'Vui lòng chọn level!' }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="jobEnvironment"
                                    label="Loại hình"
                                    valueEnum={{
                                        OFFICE: 'OFFICE',
                                        REMOTE: 'REMOTE',
                                        HYBRID: 'HYBRID',
                                        FREELANCE: 'FREELANCE',
                                        OTHER: 'OTHER',
                                    }}
                                    placeholder="Nhập loại hình"
                                    rules={[{ required: true, message: 'Vui lòng chọn loại hình!' }]}
                                />
                            </Col>


                        </Row>
                        <Row gutter={[20, 20]}>
                                <Col span={24} md={5}>
                                    <ProFormSelect
                                        name="experienceRequirement"
                                        label="Yêu cầu kinh nghiệm"
                                        valueEnum={{
                                            '0-2 YEARS': '0-2 năm kinh nghiệm',
                                            '1-3 YEARS': '1-3 năm kinh nghiệm',
                                            '2-4 YEARS': '2-4 năm kinh nghiệm',
                                            '3-5 YEARS': '3-5 năm kinh nghiệm',
                                            '4-6 YEARS': '4-6 năm kinh nghiệm',
                                            '5-8 YEARS': '5-8 năm kinh nghiệm'
                                        }}
                                        placeholder="Nhập yêu cầu kinh nghiệm"
                                        rules={[{ required: true, message: 'Vui lòng chọn yêu cầu kinh nghiệm!' }]}
                                    />
                                </Col>
                                                        {(dataUpdate?.id || !id) &&
                                <Col span={24} md={5}>
                                    <ProForm.Item
                                        name="company"
                                        label="Thuộc Công Ty"
                                        rules={[{ required: false, message: 'Vui lòng chọn company!' }]}
                                        
                                    >
                                        <DebounceSelect
                                            disabled={displayCompany}
                                            allowClear
                                            showSearch
                                            defaultValue={companies}
                                            value={companies}
                                            placeholder="Chọn công ty"
                                            fetchOptions={fetchCompanyList}
                                            onChange={(newValue: any) => {
                                                // if (newValue?.length === 0 || newValue?.length === 1) {
                                                //     setCompanies(newValue as ICompanySelect[]);
                                                // }
                                                form.setFieldsValue({ company: newValue });
                                                setCompanies(newValue as ICompanySelect[]);
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </ProForm.Item>

                                </Col>
                            }
                            <Col span={24} md={5}>
                                    <ProFormDatePicker 
                                    label="Ngày bắt đầu"
                                    name="startDate"
                                    //normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                    fieldProps={{
                                        format: 'DD/MM/YYYY',
                                        
                                    }}
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                                    placeholder="dd/mm/yyyy"
                                />
                            
                            </Col>
                            <Col span={24} md={5}>
                                <ProFormDatePicker
                                    label="Ngày kết thúc"
                                    name="endDate"
                                    //normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                    fieldProps={{
                                        format: 'DD/MM/YYYY',
                                        
                                    }}
                                    // width="auto"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                                    placeholder="dd/mm/yyyy"
                                />
                                
                            </Col>
                            <Col span={24} md={4}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="active"
                                    checkedChildren="ACTIVE"
                                    unCheckedChildren="INACTIVE"
                                    initialValue={true}
                                    fieldProps={{
                                        defaultChecked: true,
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <ProForm.Item
                                    name="description"
                                    label="Miêu tả job"
                                    rules={[{ required: true, message: 'Vui lòng nhập miêu tả job!' }]}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setValue}
                                    />
                                </ProForm.Item>
                            </Col>
                        </Row>
                        <Divider />
                    </ProForm>
                </ConfigProvider>

            </div>
        </div>
    )
}

export default ViewUpsertJob;