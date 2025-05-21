
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IJob, ISkill } from "@/types/backend";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, QuestionCircleOutlined, ZoomInOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { callCreateTalentCandidateForCompany, callDeleteJob, callFetchAllSkill, callFetchJobAdmin, callFetchTalentCandidateForCompany, callUserById } from "@/config/api";
import queryString from 'query-string';
import {  useNavigate } from "react-router-dom";
//import { fetchJob } from "@/redux/slice/jobSlide";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfIn } from "spring-filter-query-builder";
import { Console } from "console";
import styles from 'styles/client.module.scss';
import CandidateModal from "@/components/client/modal/candidate.modal";
import TalentCandidateCard from "@/components/client/card/talentCandidate.card";
import PaymentModal from "@/components/admin/accountupgrade/modal.payment";
import { Modal, Form, Select, InputNumber, Switch, Button, Input, Col, Row, Checkbox, Slider, message, notification, Radio, Tag, Space } from "antd";
import { Absolute } from "spring-filter-query-builder/dist/types/functions";

const { Option } = Select;
interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}
interface IReqCandidate {
    address:string;
    skills:ISkill[];
    education: string;
    age: string;
    experience:string;
    activity:boolean;
    gender:string;
    multiplierSkills:number;
    multiplierAddress:number;
    multiplierEducation:number;
    multiplierAge:number;
    multiplierExperience:number;
    multiplierActivity:number;
    multiplierGender:number;
}
const TalentCandidatePage = () => {
    const tableRef = useRef<ActionType>();
    const meta = useAppSelector(state => state.job.meta);
    //const jobs = useAppSelector(state => state.job.result);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [jobs,setJobs]=useState<IJob[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [query, setQuery] = useState('');
    const user = useAppSelector(state => state.account.user);
    const title="Ứng viên tiềm năng cho từng công việc";
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [reload, setReload] = useState(false);
    const [isModalPopconfirmOpen, setIsModalPopconfirmOpen] = useState<boolean>(false);
    const [isModalForJob, setIsModalForJob] = useState<boolean>(false);
    const [isModalOpenVip,setIsModalOpenVip]=useState<boolean>(false);
    const [isModalOpen,setIsModalOpen]=useState<boolean>(false);
    const [isModalOpenJob,setIsModalOpenJob]=useState<boolean>(false);
    const [vip, setVip] = useState("");
    const [form] = Form.useForm();
    const [skills, setSkills] = useState<ISkillSelect[]>([]);
    useEffect(()=>{
        const handleGetUser=async()=>{
            const res=await callUserById(user.id);
            if(res?.data){
                setVip(res?.data?.typeVip)
            }
            if(res?.data?.typeVip!=="VIP 2"){
                setIsModalOpenVip(true);
            }
        } 
        handleGetUser();
    },[])
    useEffect(() => {
            //fetchJob(query);
            fetchTalentCandidate();

    }, [reload])
    const fetchTalentCandidate=async()=>{
            const temp = await fetchSkillList();
            setSkills(temp);
            const res=await callFetchTalentCandidateForCompany('');
            if(res.data?.result){
                const ageRangeString = res.data.result[0].age; 
                const ageRangeArray = ageRangeString.split('-').map(Number); 
                form.setFieldsValue({ education: res.data.result[0].education,gender:res.data.result[0].gender,
                    address:res.data.result[0].address,experience:res.data.result[0].experience,
                    activity:res.data.result[0].activity,
                    ageRange:ageRangeArray,
                     multiplierSkills:res.data.result[0].multiplierSkills,
                     multiplierAddress:res.data.result[0].multiplierAddress,
                     multiplierEducation:res.data.result[0].multiplierEducation,
                     multiplierAge:res.data.result[0].multiplierAge,
                     multiplierExperience:res.data.result[0].multiplierExperience,
                     multiplierActivity:res.data.result[0].multiplierActivity,
                     multiplierGender:res.data.result[0].multiplierGender,
                 }); 
                 const list =res.data.result[0].skills;
                 const temp = list.map(item => {
                  return {
                      label: item.name as string,
                      value: `${item.id}` as string
                  }
                }) 
                form.setFieldValue("skills", temp);
            }
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
  
    const handleOkButton=()=>{
        setIsModalOpen(true);
    }
      const handleOkButtonJob=()=>{
        setIsModalOpenJob(true);
    }
    const handleCancelButton=()=>{
        setIsModalOpenVip(false);
        navigate("/admin");
    }
 
    const fetchJob = async (query: string) => {
            setIsLoading(true);
            const res = await callFetchJobAdmin(query);
            if (res && res.data) {
                setJobs(res.data.result);
            }else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
            setIsLoading(false);
    }
    const reloadTable = () => {
        tableRef?.current?.reload();
    }
    const columns: ProColumns<IJob>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.page - 1) * (meta.pageSize)}
                    </>)
            },
            hideInSearch: true,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Công ty',
            dataIndex: ["company", "name"],
            sorter: true,
            hideInSearch: true,
        },
       
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render(dom, entity, index, action, schema) {
                return <>
                    <Tag color={entity.active ? "lime" : "red"} >
                        {entity.active ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                </>
            },
            hideInSearch: true,
        },
{
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 150,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {

            title: 'Tìm ứng viên tiềm năng cho công việc này',
            hideInSearch: true,
            width: 170,
            render: (_value, entity, _index, _action) => (
                <Space>
                    < Access
                        permission={ALL_PERMISSIONS.JOBS.UPDATE}
                        hideChildren
                    >
                        <span onClick={() => {
                                navigate(`/admin/talentcandidate/forjob?id=${entity.id}`)
                            }}>
                        <ZoomInOutlined 
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                        /> Tìm kiếm
                        </span>
                       
                    </Access >
                    {/* <Access
                        permission={ALL_PERMISSIONS.JOBS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa job"}
                            description={"Bạn có chắc chắn muốn xóa job này ?"}
                            onConfirm={() => handleDeleteJob(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access> */}
                </Space >
            ),

        },
    ];
    const buildQuery = (params: any, sort: any, filter: any) => {

        const clone = { ...params };
        let parts = [];
        if (clone.name) parts.push(`name ~ '${clone.name}'`);
        if (clone.salary) parts.push(`salary ~ '${clone.salary}'`);
        if (clone?.level?.length) {
            parts.push(`${sfIn("level", clone.level).toString()}`);
        }

        clone.filter = parts.join(' and ');
        if (!clone.filter) delete clone.filter;

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;
        delete clone.name;
        delete clone.salary;
        delete clone.level;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        const fields = ["name", "salary", "createdAt", "updatedAt"];
        if (sort) {
            for (const field of fields) {
                if (sort[field]) {
                    sortBy = `sort=${field},${sort[field] === 'ascend' ? 'asc' : 'desc'}`;
                    break;  // Remove this if you want to handle multiple sort parameters
                }
            }
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

  const handleClickFind=()=>{
    setIsModalOpenJob(true);
  }
  useEffect(() => {
    const fetchSkill = async () => {
        const temp = await fetchSkillList();
        setSkills(temp);
    }
    fetchSkill();
  }, []);
const handleFinish = async(values:any) => {              
    let arrSkills = [];
    if (typeof values?.skills?.[0] === 'object') {
        arrSkills = values?.skills?.map((item: any) => { return { id: item.value } });
    } else {
        arrSkills = values?.skills?.map((item: any) => { return { id: +item } });
    }
    let ageSelect=`${values.ageRange[0]}-${values.ageRange[1]}`;
    const multiplierSkills=parseFloat(values.multiplierSkills||"3.0");
    const multiplierAddress=parseFloat(values.multiplierAddress||"1.0");
    const multiplierEducation=parseFloat(values.multiplierEducation||"1.5");
    const multiplierAge=parseFloat(values.multiplierAge||"1.0");
    const multiplierExperience=parseFloat(values.multiplierExperience||"1.5");
    const multiplierActivity=parseFloat(values.multiplierActivity||"1.0");
    const multiplierGender=parseFloat(values.multiplierGender||"1.0");
    if(multiplierSkills+multiplierAddress+multiplierEducation+multiplierAge+multiplierExperience+multiplierActivity+multiplierGender!==10){
        console.log(multiplierSkills+multiplierAddress+multiplierEducation+multiplierAge+multiplierExperience+multiplierActivity+multiplierGender);
            notification.error({
            message: 'Có lỗi xảy ra',
            description: "Tổng trọng số phải bằng 10"
        });
    }else{
        const req= {
            address:values.address,
            skills:arrSkills,
            education:  values.education,
            age: ageSelect,
            experience:values.experience,
            activity:values.activity,
            gender:values.gender,
            multiplierSkills:multiplierSkills,
            multiplierAddress:multiplierAddress,
            multiplierEducation:multiplierEducation,
            multiplierAge:multiplierAge,
            multiplierExperience:multiplierExperience,
            multiplierActivity:multiplierActivity,
            multiplierGender:multiplierGender
        }
        console.log(req);
        const res=await callCreateTalentCandidateForCompany( req );

        if(res&&+res.statusCode===200){
            message.success("Thực hiện khảo sát thành công");
            setReload(true);
            setOpenModal(false);
        }else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
        form.resetFields();
    };
    }

   
    const options = [];
    for (let i = 0; i <= 20; i++) {
            options.push((i * 0.5).toFixed(1)); // Tạo các số từ 0.0 đến 10.0
    }
    const onSliderChange = (value:any) => {
        form.setFieldsValue({ ageRange: value });
    };
    return (
        <>
         {vip==="VIP 2" &&(
            <>
         
            <div>
                <h3>Phiếu thông tin khảo sát</h3>
                <Form form={form} layout="vertical"  onFinish={handleFinish}>

                    <Row gutter={10}>
                        <Col span={22}>
                            <ProFormSelect
                                name="skills"
                                label="Kỹ năng ứng viên"
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
                        <Col span={2}>
                            <Form.Item
                                label="Trọng số"
                                name="multiplierSkills"
                              //  rules={[{ required: true, message: 'Vui lòng chọn số!' }]}
                            >
                                <Select defaultValue="3.0"> {/* Giá trị mặc định */}
                                    {options.map((value) => (
                                        <Option key={value} value={value}>
                                            {value}
                                        </Option>
                                    ))}
                                </Select>
                        </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item label="Trình độ học vấn" name="education" 
                             rules={[{ required: true, message: 'Vui lòng chọn Trình độ học vấn!' }]}> 
                            <Select placeholder="Trình độ học vấn" >
                                <Option value="HIGH_SCHOOL">Trung học phổ thông</Option>
                                <Option value="BACHELOR">Đại học</Option>
                                <Option value="MASTER">Thạc sĩ</Option>
                                <Option value="OTHER">Khác</Option>
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item
                                label="Trọng số"
                                name="multiplierEducation"
                              //  rules={[{ required: true, message: 'Vui lòng chọn số!' }]}
                            >
                                <Select defaultValue="1.5"> {/* Giá trị mặc định */}
                                    {options.map((value) => (
                                        <Option key={value} value={value}>
                                            {value}
                                        </Option>
                                    ))}
                                </Select>
                        </Form.Item>
                        </Col>
                        <Col span={6}>
                        <Form.Item label="Kinh nghiệm làm việc" name="experience"
                                rules={[{ required: true, message: 'Vui lòng chọn Kinh nghiệm làm việc!' }]} > 
                            <Select placeholder="Kinh nghiệm làm việc" >
                                <Option value="0-1 YEARS">0-1 năm kinh nghiệm</Option>
                                <Option value="1-2 YEARS">1-3 năm kinh nghiệm</Option>
                                <Option value="2-4 YEARS">2-4 năm kinh nghiệm</Option>
                                <Option value="3-5 YEARS">3-5 năm kinh nghiệm</Option>
                                <Option value="4-6 YEARS">4-6 năm kinh nghiệm</Option>
                                <Option value="OTHER">Khác</Option>
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item
                                label="Trọng số"
                                name="multiplierExperience"
                               // rules={[{ required: true, message: 'Vui lòng chọn số!' }]}
                            >
                                <Select defaultValue="1.5"> {/* Giá trị mặc định */}
                                    {options.map((value) => (
                                        <Option key={value} value={value}>
                                            {value}
                                        </Option>
                                    ))}
                                </Select>
                        </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Địa chỉ ứng viên" name="address" rules={[{ required: true ,message: 'Vui lòng chọn địa chỉ!'}]}> 
                            <Select placeholder="Chọn địa điểm">
                                <Option value="Hà Nội">Hà Nội</Option>
                                <Option value="Hồ chí Minh">Hồ Chí Minh</Option>
                                <Option value="Đà Nẵng">Đà Nẵng</Option>
                                <Option value="Bắc Giang">Bắc Giang</Option>
                                <Option value="Hải Phòng">Hải Phòng</Option>
                                <Option value="Nam Định">Nam Định</Option>
                                <Option value="Ninh Bình">Ninh Bình</Option>
                                <Option value="Bến Tre">Bến Tre</Option>
                                <Option value="OTHER">Khác</Option>
                            </Select>
                            </Form.Item>
                        </Col>
                           <Col span={2}>
                            <Form.Item
                                label="Trọng số"
                                name="multiplierAddress"
                                //rules={[{ required: true, message: 'Vui lòng chọn số!' }]}
                            >
                                <Select defaultValue="1.0"> {/* Giá trị mặc định */}
                                    {options.map((value) => (
                                        <Option key={value} value={value}>
                                            {value}
                                        </Option>
                                    ))}
                                </Select>
                        </Form.Item>
                        </Col>
                         <Col span={6}>
                            <Form.Item label="Chọn khoảng tuổi" name="ageRange"
                            rules={[{ required: true, message: 'Vui lòng chọn khoảng tuổi!' }]} >
                                <Slider
                                    range
                                    //defaultValue={[18, 38]}
                                    min={0}
                                    max={100}
                                    //marks={{ 0: '0', 100: '100' }}
                                    //tooltipVisible 
                                    onChange={onSliderChange} 
                                    
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item
                                label="Trọng số"
                                name="multiplierAge"
                            >
                                <Select defaultValue="1.0"> 
                                    {options.map((value) => (
                                        <Option key={value} value={value}>
                                            {value}
                                        </Option>
                                    ))}
                                </Select>
                        </Form.Item>
                        </Col>
                        <Col span={6}>
                           <Form.Item
                                label="Giới tính"
                                name="gender"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            >
                                <Radio.Group>
                                    <Radio value="MALE">Nam</Radio>
                                    <Radio value="FEMALE">Nữ</Radio>
                                    <Radio value="OTHER">Khác</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                         <Col span={2}>
                            <Form.Item
                                label="Trọng số"
                                name="multiplierGender"
                                //rules={[{ required: true, message: 'Vui lòng chọn số!' }]}
                            >
                                <Select defaultValue="1.0"> {/* Giá trị mặc định */}
                                    {options.map((value) => (
                                        <Option key={value} value={value}>
                                            {value}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="activity" valuePropName="checked" initialValue={false}>
                            <Checkbox>Mức độ hoạt động gần đây (cập nhật CV, ứng tuyển công việc, đăng ký skills)</Checkbox>
                        </Form.Item>
                        </Col>
                           <Col span={2}>
                            <Form.Item
                                label="Trọng số"
                                name="multiplierActivity"
                               // rules={[{ required: true, message: 'Vui lòng chọn số!' }]}
                            >
                                <Select defaultValue="1.0"> {/* Giá trị mặc định */}
                                    {options.map((value) => (
                                        <Option key={value} value={value}>
                                            {value}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                    <Col span={24}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Tìm kiếm
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div style={{backgroundColor:'#fff'}}>

                <h3 style={{marginLeft:20,lineHeight:3}}>Ứng viên tiềm năng theo tiêu chí công ty</h3>
                <div  style={{ marginTop: 20,marginLeft:20 }}>
  
                            <TalentCandidateCard
                                showPagination={true}
                                reload={reload}
                                setReload={setReload}
                            />

                </div>
                
                            
            </div>
            <Button style={{marginTop:20}} type="primary" onClick={()=>handleClickFind()}>Tìm ứng viên tiềm năng theo từng công việc</Button>
            <Modal title="Danh sách công việc trong công ty"
                    open={isModalOpenJob}
                    onOk={() => handleOkButtonJob()}
                    onCancel={() => setIsModalOpenJob(false)}
                    maskClosable={false}
                    okText="Đóng"
                    cancelButtonProps={
                        { style: { display: "none" } }
                    }
                    destroyOnClose={true}
                    className={`${styles["payment-modal"]}`}
                    width={"750px"}
                >
                    <div>
                        <Access
                            permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE_ADMIN}
                        >
                            <DataTable<IJob>
                            
                                headerTitle={title}
                                rowKey="id"
                                loading={isLoading}
                                columns={columns}
                                dataSource={jobs}
                                request={async (params, sort, filter): Promise<any> => {
                                    const queryy = buildQuery(params, sort, filter);
                                    setQuery(queryy);
                                    fetchJob(queryy)
                                }}
                                scroll={{ x: true }}
                                pagination={
                                    {
                                        current: meta.page,
                                        pageSize: meta.pageSize,
                                        showSizeChanger: true,
                                        total: meta.total,
                                        showTotal: (total, range) => { return (<div style={{color:'#a7a7a7'}}>STT {range[0]} -&gt; {range[1]}</div>) }
                                    }
                                }
                                rowSelection={false}
                                search={false}
                            />
                        </Access>
                    </div >
                </Modal>
            </>
         )
         }  
            <Modal title="Tài khoản chưa thực hiện được chức năng này"
                        open={isModalOpenVip}
                        onOk={() => handleOkButton()}
                        onCancel={() => handleCancelButton() }
                        maskClosable={false}
                        okText="Nâng cấp tài khoản ngay"
                        cancelButtonProps={
                            { style: { display: "none" } }
                        }
                        destroyOnClose={true}
            >
                <div>
                    Tài khoản của bạn chưa đủ điều kiện để thực hiện chức năng này !!!
                    <br/>Hãy nâng cấp tài khoản lên VIP 2
                </div>
            </Modal>
            <PaymentModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </>
       
       
    )
}

export default TalentCandidatePage;