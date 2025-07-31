import { callFetchAllBlog } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { IBlog } from '@/types/backend';
import { HeartOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
interface IProps {
    showPagination?: boolean;
}

const BlogCard = (props: IProps) => {
    const { showPagination = false } = props;
    const [displayBlog, setDisplayBlog] = useState<IBlog[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=likeCount,desc");
    const navigate = useNavigate();
    useEffect(() => {
        fetchBlog();
    }, [current, pageSize, filter, sortQuery]);

    const fetchBlog = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchAllBlog(query);
        if (res && res.data) {
            setDisplayBlog(res.data.result);
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

    const handleViewDetailBlog = (item: IBlog) => {
        if (item.title) {
            const slug = convertSlug(item.title);
            navigate(`/blog/${slug}?id=${item.id}`)
        }
    }

    return (
        <div className={`${styles["card-job-section"]}`}>
            <div className={styles["job-content"]}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>  
                                <h2  className={styles["card-blog-title"]}>Tin Tức Công Nghệ Được Yêu Thích Nhất</h2>
                                {!showPagination &&
                                    <Link to="blog"  className={styles["getAll"]} style={{ marginBottom:30, marginTop:50 }}>Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayBlog?.map(item => {
                            return (
                                <Col span={24} md={24} key={item.id} >
                                    <Card 
                                        className={styles["card-job-card"]}
                                        onClick={() => handleViewDetailBlog(item)}
                                        style={{ height: 132 }}
                                        hoverable
                                        cover={
                                            <div className={styles["card-customize"]} style={{ display:"flex" }}>
                                                <img
                                                    style={{ maxWidth:165,maxHeight:165, borderRadius: 12,marginTop:8,marginLeft:8} }
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/blog/${item?.thumbnail}`}
                                                />
                                                <div>   
                                                    <h3 style={{ textAlign: "center" }}>{item.title}</h3>
                                                    <div style={{ marginLeft:10}}>{parse(item.content?.substring(0,500).concat("...")?? "")}</div>
                                                    <div style={{ textAlign: "center", marginTop:10}}>Lượt thích : {item.likeCount} <HeartOutlined/></div>
                                                </div>
                                            </div>
                                        }
                                    >
                                    </Card>
                                </Col>
                            )
                        })}

                        {(!displayBlog || displayBlog && displayBlog.length === 0)
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
                            <div style={{ marginBottom: 80 }}></div>
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
    )
}

export default BlogCard;