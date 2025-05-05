import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IBlog } from "@/types/backend";
import { callFetchBlogById, callUpdateBlog, callUpdateLikeBlog } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, message, notification, Row, Skeleton } from "antd";
import { EnvironmentOutlined, HeartOutlined } from "@ant-design/icons";
import { set } from "lodash";


const ClientBlogDetailPage = (props: any) => {
    const [blogDetail, setBlogDetail] = useState<IBlog | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState(0);
    const [like, setLike] = useState<boolean>(false);
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const handleLike=async()=>{ 
        setLike(!like);
        let likeCurr=likeCount;
        (!like)? likeCurr++:likeCurr--;
        console.log(likeCurr,likeCount);
        const res = await callUpdateLikeBlog(blogDetail?.id,likeCurr);
        if (res?.data) {
            setLikeCount(res.data.likeCount);
        (!like) ? message.success('Thích bài viết thành công') : message.success('Đã hủy thích bài viết');
        }else{
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }
    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchBlogById(id);
                if (res?.data) {
                    setBlogDetail(res.data)
                    setLikeCount(res.data.likeCount);
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
                                    <div style={{ marginLeft:350 ,marginTop:30} }>
                                        <img 
                                            
                                            width={800}
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/blog/${blogDetail?.thumbnail}`}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col span={24} md={21} style={{marginLeft:100,marginRight:100,marginBottom:50}}>
                                <h1 className={styles["header"]}>
                                    {blogDetail.title}
                                </h1>

                                <span className={styles["location"]} onClick={()=>handleLike()} style={{fontSize:18,display:'flex', justifyContent: 'flex-end' ,cursor:'pointer'}}>
                                   Lượt thích :&nbsp; {likeCount} &nbsp; <HeartOutlined style={{ fontSize:20, fontWeight:900,color: like ? "#ff0000" : "#000000" }} />
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