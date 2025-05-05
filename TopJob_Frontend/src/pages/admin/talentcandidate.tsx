
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Modal, Popconfirm, Space, Tag, message, notification } from "antd";
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { callDeleteJob, callFetchJobAdmin, callFetchTalentCandidateForCompany } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
//import { fetchJob } from "@/redux/slice/jobSlide";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfIn } from "spring-filter-query-builder";
import { Console } from "console";
import styles from 'styles/client.module.scss';
import CandidateModal from "@/components/client/modal/candidate.modal";
import TalentCandidateCard from "@/components/client/card/talentCandidate.card";

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
    useEffect(() => {
        fetchJob(query);
        fetchTalentCandidate();
    }, [])
    const fetchTalentCandidate=async()=>{
            const res=await callFetchTalentCandidateForCompany('');
            console.log(res.data?.result);
            if(res&&res.data?.result.length===0)
            setIsModalPopconfirmOpen(true);
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
            title: 'Mức lương',
            dataIndex: 'salary',
            sorter: true,
            render(dom, entity, index, action, schema) {
                const str = "" + entity.salary;
                return <>{str?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</>
            },
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

            title: 'Tìm ứng viên tiềm năng cho công việc này',
            hideInSearch: true,
            width: 120,
            render: (_value, entity, _index, _action) => (
                <Space>
                    < Access
                        permission={ALL_PERMISSIONS.JOBS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                navigate(`/admin/talentcandidate/forjob?id=${entity.id}`)
                            }}
                        />
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

    return (
        <>
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
            <div style={{backgroundColor:'#fff'}}>

                    <h3 style={{position:'absolute',marginTop:30,marginLeft:20,fontWeight:500}}>Ứng viên tiềm năng theo tiêu chí công ty</h3>
                    {isModalPopconfirmOpen ?
                        <div className={styles["recommendation"]} >
                            <h3> <InfoCircleOutlined /> Bạn chưa thực hiện khảo sát</h3>
                            <div><QuestionCircleOutlined /> Bạn có muốn thực hiện khảo sát để tìm ứng viên phù hợp ?</div>
                            <Button type="primary" onClick={()=>setOpenModal(true)}> <EditOutlined/>Thực hiện ngay</Button>
                        </div> :
                        <div className={styles["recommendation"]}>
                            <div><QuestionCircleOutlined /> Bạn có muốn thực hiện bài khảo sát mới ?</div>
                            <Button type="primary" onClick={()=>setOpenModal(true)}> <EditOutlined/>Thực hiện ngay</Button>
                        </div>
                    }
 

                <div className={styles["container"]} style={{ marginTop: 20 }}>
  
                            <TalentCandidateCard
                                showPagination={true}
                                reload={reload}
                                setReload={setReload}
                            />
                </div>

                <CandidateModal 
                 openModal={openModal}
                 setOpenModal={setOpenModal}
                 reload={reload}
                 setReload={setReload}
                />

            </div>
        </>

    )
}

export default TalentCandidatePage;