import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { AimOutlined, DollarOutlined, EnvironmentOutlined, HistoryOutlined, LaptopOutlined, ScheduleOutlined, SlidersOutlined } from "@ant-design/icons";
import { getEnvironmentName, getLevelName, getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
dayjs.extend(relativeTime)


const ClientJobDetailPage = (props: any) => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

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

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]} ${styles["modal-infor-detail"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {jobDetail && jobDetail.id &&
                        <>
                            <Col span={24} md={16} style={{marginLeft:100}}>
                                <div className={styles["header"]}>
                                    {jobDetail.name}
                                </div>
                                <div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles["btn-apply"]}
                                    >Ứng tuyển ngay</button>
                                </div>
                                <Divider />
                                <div className={styles["skills"]} style={{textAlign:'center',fontSize:16}}><AimOutlined  style={{ color:'blue' }} /> &nbsp;&nbsp;
                                    {jobDetail?.skills?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="gold" >
                                                {item.name}
                                            </Tag>
                                        )
                                    })}
                                </div>
                                <div style={{display:'flex', justifyContent:'space-around',fontSize:16}}>
                                    <div className={styles["salary"]}>
                                        <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(jobDetail.location)}
                                    </div>
                                    <div className={styles["salary"]}>
                                        <SlidersOutlined style={{ color:'purple'}} />&nbsp;{getLevelName(jobDetail.level)}
                                    </div>
                                </div>
                                <div style={{display:'flex', justifyContent:'space-around',fontSize:16}}>
                                    <div className={styles["salary"]}>
            
                                        <ScheduleOutlined style={{ color:'palevioletred'}} />&nbsp;{jobDetail.experienceRequirement?.replaceAll('YEARS','năm kinh nghiệm')}
                                    </div>
                                    <div className={styles["salary"]}>
                                        <LaptopOutlined style={{ color:'navy'}} />&nbsp;{getEnvironmentName(jobDetail.jobEnvironment)}
                                    </div>
                                </div>

                                <div style={{display:'flex', justifyContent:'space-around',fontSize:16}}>
                                    <div className={styles["salary"]}>
                                        <DollarOutlined style={{ color: 'orange' }}/>
                                        <span>&nbsp;{(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                    </div>
                                    <div className={styles["salary"]}>
                                        <HistoryOutlined style={{ color:'red'}}/> {jobDetail.updatedAt ? dayjs(jobDetail.updatedAt).locale("en").fromNow() : dayjs(jobDetail.createdAt).locale("en").fromNow()}
                                    </div>
                                </div>
                                <Divider />
                                {parse(jobDetail.description)}
                            </Col>

                            <Col span={24} md={6}>
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
                            <Divider/>
                        </>
                        
                    }
                </Row>
            }
            <ApplyModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                jobDetail={jobDetail}
            />
        </div>
    )
}
export default ClientJobDetailPage;