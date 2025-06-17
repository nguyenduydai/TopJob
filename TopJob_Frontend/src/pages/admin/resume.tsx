import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IResume } from "@/types/backend";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Space, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { callDeleteResume, callFetchJobById, callFetchResume, callFetchResumeByJob } from "@/config/api";
import queryString from 'query-string';
import { fetchResume } from "@/redux/slice/resumeSlide";
import ViewDetailResume from "@/components/admin/resume/view.resume";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import { sfIn } from "spring-filter-query-builder";
import { AppstoreOutlined, DiffOutlined, DragOutlined, EditOutlined, FilePdfOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import JobCard from "@/components/client/card/job.card";
import axios from 'config/axios-customize';

const ResumePage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.resume.isFetching);
    const meta = useAppSelector(state => state.resume.meta);
    const r = useAppSelector(state => state.resume.result);
    const dispatch = useAppDispatch();
    const [resumes, setResumes] = useState<IResume[]>();
    const [dataInit, setDataInit] = useState<IResume | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const [jobName, setJobName] = useState('công ty');
    const user = useAppSelector(state => state.account.user);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(id);
        //reloadTable();
        //setResumes(r);
        if(id){
            const fetchResume=async()=>{
                if(id){
                    const res=await callFetchResumeByJob("",id);
                    if(res.data){
                        setResumes(res.data.result);
                    }else{
                        message.error("khoong lay duoc danh sach resume by job")
                    }
                }

            }
            fetchResume();
            const fechJobName=async()=>{
                if(id){
                    const res=await callFetchJobById(id);
                    if(res.data){
                        if (typeof res.data === 'string') {
                            setJobName(res.data); 
                        } else {
                            setJobName(res.data.name);
                        }
                    }else{
                        message.error("khoong lay duoc danh sach resume by job")
                    }
                }

            }
            fechJobName();
        }else{
            const fetchResume=async()=>{
                const res=await callFetchResume('');
                if(res.data){
                        setResumes(res.data.result);
                }else{
                        message.error("khoong lay duoc danh sach resume ")
                }
            }
            fetchResume();
        }
        
    }, [id,openViewDetail])
    const handleGetAll=()=>{
        setResumes(r);
        setJobName('công ty');
        navigate(`/admin/resume`);
    }
      // export resume
      const handleExportResumeReport = async () => {
        try {
            const response = await axios.get('/api/v1/reports/resumesbycompany', {
                responseType: 'blob', // Đặt kiểu phản hồi là 'blob' để nhận dữ liệu nhị phân
            });
            if (response) {
                const url = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resume_bycompany_report_' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') + '.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to export resume report. Status:', response.status);
            }
        } catch (error) {
            console.error('Error exporting resume report:', error);
        }
    };
    const handleDeleteResume = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteResume(id);
            if (res && res.data) {
                message.success('Xóa Resume thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IResume>[] = [
        {
            title: 'STT',
            dataIndex: 'id',
            width: 50,
            render: (text, record, index, action) => {
                return (
                    <a href="#" onClick={() => {
                        setOpenViewDetail(true);
                        setDataInit(record);
                    }}>
                        {record.id}
                    </a>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            width:150,
            sorter: true,
             render: (text, record, index, action) => {
                return (
                    <>{record.status==="PENDING"?'ĐANG CHỜ':
                       record.status==="REVIEWING"?'ĐANG XEM XÉT':
                       record.status==="APPROVED"?'ĐÃ PHÊ DUYỆT':
                       record.status==="REJECTED"?'ĐÃ TỪ CHỐI':""}</>
                )
            },
            
        },

        {
            title: 'Công việc',
            dataIndex: ["job", "name"],
            
        },
        {
            title: 'Công ty',
            dataIndex: "companyName",
            hideInSearch: true,
             width:100,
        },
        {
            title: 'Email ứng viên',
            dataIndex: "email",
            hideInSearch: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 160,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày sửa',
            dataIndex: 'updatedAt',
            width: 160,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Xem CV',
            dataIndex: "",
             width:80,
            render(value, record, index) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
            hideInSearch: true,
        },
        {

            title: 'Chỉnh sửa',
            hideInSearch: true,
            width: 80,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            color: '#ffa500',
                        }}
                        type=""
                        onClick={() => {
                            setOpenViewDetail(true);
                            setDataInit(entity);
                        }}
                    />

                    {/* <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa resume"}
                        description={"Bạn có chắc chắn muốn xóa resume này ?"}
                        onConfirm={() => handleDeleteResume(entity.id)}
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
                    </Popconfirm> */}
                </Space>
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };

        if (clone?.status?.length) {
            clone.filter = sfIn("status", clone.status).toString();
            delete clone.status;
        }

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.status) {
            sortBy = sort.status === 'ascend' ? "sort=status,asc" : "sort=status,desc";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        // temp += "&populate=companyId,jobId&fields=companyId.id, companyId.name, companyId.logo, jobId.id, jobId.name";
        return temp;
    }

    return (
        <div>

            <Access
                permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}
            >
                <DataTable<IResume>
                    actionRef={tableRef}
                    headerTitle={`Danh sách các đơn ứng tuyển của ${jobName}`}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={resumes}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchResume({ query }))
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
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <></>
                        );
                    }}
                />
            </Access>
            <ViewDetailResume
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
            {user?.company?.id && 
                <div>
                    <Button type='primary' onClick={()=>handleGetAll()}><AppstoreOutlined /> Xem tất cả đơn ứng tuyển <DiffOutlined /></Button>
                    <Button  style={{marginLeft:35,marginTop:20}} onClick={()=>handleExportResumeReport()} type="primary" ><VerticalAlignBottomOutlined /> Xuất báo cáo thống kê <FilePdfOutlined /></Button>
                </div>
            }

        </div >
    )
}

export default ResumePage;