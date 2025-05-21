import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { IJob, ITalentCandidate } from "@/types/backend";
import { callCreateTalentCandidateForJob, callFetchJobById, callFetchTalentCandidateForJob, callSendEmailTalentCandidate } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Button, Card, Col, Divider, Empty, message, notification, Pagination, Row, Skeleton, Spin, Tag } from "antd";
import { AimOutlined, BankOutlined, BarChartOutlined, DollarOutlined, EnvironmentOutlined, HistoryOutlined, OrderedListOutlined, StarOutlined } from "@ant-design/icons";
import { getEducationnName, getExperienceName, getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
import avata from '../../../assets/User_Avatar.png'

dayjs.extend(relativeTime)


const TalentCandidateForJob = (props: any) => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPagination, setShowPagination] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [displayCandidate, setDisplayCandidate] = useState<ITalentCandidate[] | null>(null);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=compatibilityScore,desc");
    const navigate = useNavigate();
    const [createFetch, setCreateFetch] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded((prev) => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Hiệu ứng cuộn mượt mà
            });
            return !prev;
        });
    } 
    const descriptionRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        fetchCandidate();
    }, [current, pageSize, filter, sortQuery,reload]);

    const fetchCandidate = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchTalentCandidateForJob(id,query);
        if (res && res.data) {
            setDisplayCandidate(res.data.result);
            setCreateFetch(false);
            setTotal(res.data.meta.total)
        }
        if(res&&res.data?.result.length===0)
            setCreateFetch(true);
        setIsLoading(false)
    }


    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }
    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchJobById(id);
                if (res?.data) {
                    setJobDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);
    const handleCreateCandidateForJob=async()=>{
        setIsLoading(true);
        const res=await callCreateTalentCandidateForJob(id);
        if(res&&+res.statusCode===200){
            message.success("Thực hiện khảo sát thành công");
            setReload(true);
        }else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }
        const handleSendEmail=async(id:string|number) =>{
            console.log(id);
            console.log(typeof(id));
            const res= await callSendEmailTalentCandidate(id);
              
             if (+res.statusCode===200) {
                message.success("Gửi email thông báo thành công!");
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {jobDetail && jobDetail.id &&
                        <>
                            <Col span={24} md={20}>
                                <div className={styles["header"]}>
                                    {jobDetail.name}
                                </div>
                                <Divider />
                                <div className={styles["skills"]} style={{textAlign:'center'}}>
                                    {jobDetail?.skills?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="gold" >
                                                {item.name}
                                            </Tag>
                                        )
                                    })}
                                </div>
                                <div style={{display:'flex',justifyContent:'space-around'}}>
                                    <div>
                                        <div className={styles["salary"]}>
                                            <DollarOutlined />
                                            <span>&nbsp;{(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                        </div>
                                        <div className={styles["location"]}>
                                            <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(jobDetail.location)}
                                        </div>
                                        <div>
                                            <HistoryOutlined /> {jobDetail.updatedAt ? dayjs(jobDetail.updatedAt).locale("en").fromNow() : dayjs(jobDetail.createdAt).locale("en").fromNow()}
                                        </div>  
                                    </div>
                                    <div>
                                        <div className={styles["salary"]}>
                                        <BarChartOutlined />
                                            <span>&nbsp;{jobDetail.level}</span>
                                        </div>
                                        <div className={styles["location"]}>
                                        <BankOutlined />
                                        <span>&nbsp;{jobDetail.jobEnvironment} </span>
                                        </div>
                                        <div>
                                        <AimOutlined /> <span>Số lượng tuyển: {jobDetail.quantity} </span>
                                        </div>  
                                    </div>
                                </div>
                             
                                
                               
                            </Col>

                            <Col span={24} md={4}>
                                <div className={styles["company"]}>
                                    <div>
                                        <img
                                            width={"200px"}
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company?.logo}`}
                                        />
                                    </div>
                                    <div>
                                        {jobDetail.company?.name}
                                    </div>
                                </div>
                            </Col>
  
                            
                        </>
                        
                    }
                </Row>
            }
            <div className={`${styles["card-job-section"]}`} style={{width:'100%',margin:0,padding:0}}>
            <div className={styles["job-content"]}  style={{width:'100%',margin:0,padding:0}}>
            {createFetch === true ? (
                <div>
                    <div>Công việc này chưa thực hiện tìm kiếm ứng viên</div>
                    <Button type='primary' onClick={() => handleCreateCandidateForJob()}>Tìm kiếm</Button>
                </div>
            ) : (
                <div style={{display:'flex',marginBottom:30}}> <h3>Danh sách ứng viên tiềm năng cho công việc này : </h3>
                     <Button type='primary' style={{marginLeft:570}}   onClick={() => handleCreateCandidateForJob()}>Tìm kiếm lại</Button>
                </div>
            )}
                
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>

                        {displayCandidate?.map(item => {
                            return (
                                <Col span={6} md={6} key={item.id} >
                                    <Card 
                                        className={styles["card-job-card"]}
                                        
                                        style={{ height: 156 }}
                                        hoverable
                                        cover={
                                            <div className={styles["card-customize"]} style={{ display:"flex" }}>
                                                <div>
                                                <img    
                                                    style={{ maxWidth:80,maxHeight:80, borderRadius: 12,marginTop:10,marginLeft:10} }
                                                    alt="example"
                                                    src={avata}
                                                />
                                                <div style={{textAlign:'center'}}>{(item.compatibilityScore* 10).toFixed(2)}/10&nbsp;<StarOutlined /></div>
                                                </div>
       
                                                <div style={{ width:'100%'}}>   
                                                    <h3 style={{ width:'100%',textAlign: "center" }}>{item.user?.name}</h3>
                                                    <div style={{ marginLeft:10}}>{item.user?.email}</div>
                                                    <div style={{ marginLeft:10}}>{item.user?.address}
                                                        <span style={{ marginLeft:20}}>{item.user?.age} tuổi</span>
                                                    </div>
                                                    <div style={{ marginLeft:10}}>{getEducationnName(item.user?.education)}
                                                        <span style={{ marginLeft:20}}>{getExperienceName(item.user?.experience)}</span>
                                                    </div>
                                                    <div className={styles['seeCV']}>  
                                                        &gt;&gt;&gt; &nbsp;<a href={`${import.meta.env.VITE_BACKEND_URL}/storage/cvuser/${item.user?.cv}`}
                                                        target="_blank"
                                                        >Xem CV</a>&nbsp; &lt;&lt;&lt;
                                                    </div>
                                                     <Button style={{marginLeft:30,marginTop:5}} type='primary' onClick={()=>handleSendEmail(item.id?item.id:'')}>Gửi thư mời</Button>
                                                </div>
                                            </div>
                                        }
                                    >
                                    </Card>
                                </Col>
                            )
                        })}

                        {(!displayCandidate || displayCandidate && displayCandidate.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                            
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
        </div>
    )
}
export default TalentCandidateForJob;