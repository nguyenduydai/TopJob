import { callFetchJob ,callFetchJobByCompany} from '@/config/api';
import { convertSlug, getLevelName, getLocationName } from '@/config/utils';
import { IJob } from '@/types/backend';
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined, SlidersOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import { sfIn } from "spring-filter-query-builder";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


interface IProps {
    showPagination?: boolean;
    companyId?:string|null;
}

const JobCard = (props: IProps) => {
    const { showPagination = false,companyId=null } = props;

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=createdAt,desc&sort=start,desc");

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        fetchJob();
    }, [current, pageSize, filter, sortQuery, location]);

    const fetchJob = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        //check query string
        const queryLocation = searchParams.get("location");
        const queryLevel=searchParams.get("level")?.toUpperCase();;
        const querySkills = searchParams.get("skills")
        if (queryLocation || querySkills) {
            let q = "";
            if (queryLocation) {
                q = sfIn("location", queryLocation.split(",")).toString();
            }
            if (queryLevel) {
                q = queryLocation ?
                    q + " and " +  `${sfIn("level", queryLevel.split(","))}`
                    :  `${sfIn("level", queryLevel.split(","))}`;
            }
            if (querySkills) {
                q = queryLocation || queryLevel ?
                    q + " and " + `${sfIn("skills", querySkills.split(","))}`
                    : `${sfIn("skills", querySkills.split(","))}`;
            }
            console.log(q);
            query += `&filter=${encodeURIComponent(q)}`;
            console.log(query);
        }
        if(companyId===null){
            const res = await callFetchJob(query);
            console.log(res);
            if (res && res.data) {
                setDisplayJob(res.data.result);
                setTotal(res.data.meta.total)
            }
            setIsLoading(false);
        } else{
            const res = await callFetchJobByCompany(companyId,query);
            if (res && res.data) {
                setDisplayJob(res.data.result);
                setTotal(res.data.meta.total)
            }
            setIsLoading(false);
        }
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

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item.id}`)
    }

    return (
        <div className={`${styles["card-job-section"]}`} >
            <div className={`${styles["job-content"]}`}  >
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <h2 className={styles["title"]}> {companyId ?`Công ty hiện đang có ${total} công việc` :'Công Việc Mới Nhất'}</h2>
                                {!showPagination &&
                                    <Link to="job" className={styles["getAll"]}>Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayJob?.map(item => {
                            return (
                                <Col span={24} md={12} key={item.id}>
                                    <Card size="small" title={null} hoverable className={styles["card-job-card"]}
                                        onClick={() => handleViewDetailJob(item)}
                                    >
                                        <div className={styles["card-job-content"]}>
                                            <div className={styles["card-job-left"]}>
                                                <img
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.company?.logo}`}
                                                />
                                            </div>
                                            <div className={styles["card-job-right"]}>
                                                <div className={styles["job-title"]}>{item.name}</div>
                                                <div style={{display:'flex',justifyContent:'space-around',marginBottom:5,marginTop:3}}>
                                                <div> <SlidersOutlined style={{ color:'purple'}} />&nbsp;{getLevelName(item.level)}</div>
                                                    <div className={styles["job-location"]}><EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(item.location)}</div>
                                                    
                                                    <div><DollarOutlined style={{ color: 'orange' }} />&nbsp;{(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</div>
                                                </div>
                                                
                                                <div className={styles["job-updatedAt"]}>  <HistoryOutlined style={{ color:'red'}}/> {item.createdAt ? dayjs(item.createdAt).locale('en').fromNow() : dayjs(item.updatedAt).locale('en').fromNow()}</div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            )
                        })}


                        {(!displayJob || displayJob && displayJob.length === 0)
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
                        <div style={{ marginBottom: 40 }}></div>
                    </>}
                </Spin>
            </div>
        </div>
    )
}

export default JobCard;