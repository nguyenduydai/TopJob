import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany } from "@/types/backend";
import { callFetchCompanyById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import BlogCard from "@/components/client/card/blog.card";
import JobCard from "@/components/client/card/job.card";
import { useRef } from "react";

const ClientCompanyDetailPage = (props: any) => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_HEIGHT = 200;
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const descriptionRef = useRef<HTMLDivElement>(null);
    const toggleExpand = () => {
        setIsExpanded((prev) => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Hiệu ứng cuộn mượt mà
            });
            return !prev;
        });
    } 
    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchCompanyById(id);
                if (res?.data) {
                    setCompanyDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {companyDetail && companyDetail.id &&
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {companyDetail.name}
                                </div>

                                <div className={styles["location"]}>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(companyDetail?.address)}
                                </div>

                                <Divider />
                                    <div style={{ position: 'relative' }} ref={descriptionRef}>
                                        <div
                                            style={{
                                                maxHeight: isExpanded ? 'none' : MAX_HEIGHT,
                                                overflow: 'hidden',
                                                transition: 'max-height 0.3s ease',
                                            }}
                                        >
                                            {parse(companyDetail?.description ?? "")}
                                        </div>

                                        <div style={{ marginTop: 10 }}>
                                            <a onClick={toggleExpand} style={{ color: '#58aaab', cursor: 'pointer' }}>
                                                {isExpanded ? "Thu gọn mô tả ▲" : "Xem thêm mô tả ▼"}
                                            </a>
                                        </div>
                                    </div>
                            </Col>

                            <Col span={24} md={8}>
                                <div className={styles["company"]}>
                                    <div>
                                        <img
                                            width={200}
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${companyDetail?.logo}`}
                                        />
                                    </div>
                                    <div>
                                        {companyDetail?.name}
                                    </div>
                                </div>
                            </Col>
                            <Col span={24}>
                                <JobCard
                                    showPagination={true}
                                    companyId={id ? id:null }
                                />
                            </Col>
                        </>
                    }
                </Row>
            }
        </div>
    )
}
export default ClientCompanyDetailPage;