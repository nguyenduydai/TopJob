import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IBlog } from "@/types/backend";
import { callFetchBlogById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton } from "antd";
import { EnvironmentOutlined, HeartOutlined } from "@ant-design/icons";


const ClientBlogDetailPage = (props: any) => {
    const [blogDetail, setBlogDetail] = useState<IBlog | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchBlogById(id);
                if (res?.data) {
                    setBlogDetail(res.data)
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
                    {blogDetail && blogDetail.id &&
                        <>
                            <Col span={24} md={24}>
                                <div className={styles["blog"]}>
                                    <div style={{ marginLeft:250 ,marginTop:30} }>
                                        <img 
                                            
                                            width={800}
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/blog/${blogDetail?.thumbnail}`}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col span={24} md={24}>
                                <h1 className={styles["header"]}>
                                    {blogDetail.title}
                                </h1>

                                <span className={styles["location"]}>
                                    <HeartOutlined style={{ color: '#ff0000' }} />&nbsp;{(blogDetail?.likeCount)}
                                </span>

                                <Divider />
                                {parse(blogDetail?.content ?? "")}
                            </Col>


                        </>
                    }
                </Row>
            }
        </div>
    )
}
export default ClientBlogDetailPage;