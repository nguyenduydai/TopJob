import { callFetchCompany } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { ICompany } from '@/types/backend';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';

interface IProps {
    showPagination?: boolean;
}

const CompanyCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=start,desc&sort=createdAt,asc");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompany();
    }, [current, pageSize, filter, sortQuery]);

    const fetchCompany = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchCompany(query);
        if (res && res.data) {
            setDisplayCompany(res.data.result);
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

    const handleViewDetailJob = (item: ICompany) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/company/${slug}?id=${item.id}`)
        }
    }

    return (
        <div className={`${styles["company-section"]}`}>
            <div className={styles["company-content"]}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <h2 className={styles["title"]}>Nhà Tuyển Dụng Nổi Bật</h2>
                                {!showPagination &&
                                    <Link to="company"  className={styles["getAll"]}>Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayCompany?.map(item => {
                            return (
                                <Col span={24} md={6} key={item.id}>
                                    <Card
                                        className={styles["card-job-card"]}
                                        onClick={() => handleViewDetailJob(item)}
                                        style={{ height: 350 }}
                                        hoverable
                                        cover={
                                            <div className={styles["card-customize"]} >
                                                <img
                                                    style={{ maxWidth: "200px" , borderRadius: 12}}
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.logo}`}
                                                />
                                            </div>
                                        }
                                    >
                                       
                                        <h3 style={{ textAlign: "center" }}>{item.name}</h3>
                                        <div style={{ textAlign: "center" }}><EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{item.address}</div>
                                    </Card>
                                </Col>
                            )
                        })}

                        {(!displayCompany || displayCompany && displayCompany.length === 0)
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

export default CompanyCard;