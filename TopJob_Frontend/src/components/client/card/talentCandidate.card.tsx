import { callFetchAllBlog, callFetchTalentCandidateForCompany } from '@/config/api';
import { convertSlug, getEducationnName, getExperienceName } from '@/config/utils';
import { IBlog, ITalentCandidate, IUser } from '@/types/backend';
import { HeartOutlined, StarOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import avata from '../../../assets/User_Avatar.png'

interface IProps {
    showPagination?: boolean;
    reload:boolean;
    setReload: (v: boolean) => void;
}

const TalentCandidateCard = (props: IProps) => {
    const { showPagination = false,reload,setReload } = props;

    const [displayCandidate, setDisplayCandidate] = useState<ITalentCandidate[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=compatibilityScore,desc");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCandidate();
    }, [current, pageSize, filter, sortQuery]);

    const fetchCandidate = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchTalentCandidateForCompany(query);
        if (res && res.data) {
            setDisplayCandidate(res.data.result);
            setTotal(res.data.meta.total)
        }
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

    const handleViewDetailBlog = (item: ITalentCandidate) => {
        // if (item.title) {
        //     const slug = convertSlug(item.title);
        //     navigate(`/blog/${slug}?id=${item.id}`)
        // }
    }

    return (
        <div className={`${styles["card-job-section"]}`} style={{width:'100%',margin:0,padding:0}}>
            <div className={styles["job-content"]}  style={{width:'100%',margin:0,padding:0}}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[15, 10]}>

                        {displayCandidate?.map(item => {
                            return (
                                <Col span={6} md={6} key={item.id} >
                                    <Card 
                                        className={styles["card-job-card"]}
                                        onClick={() => handleViewDetailBlog(item)}
                                        style={{ height: 123 }}
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
    )
}

export default TalentCandidateCard;