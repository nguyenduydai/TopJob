import { Button, Card, Col, Divider, Row, Statistic } from "antd";
import CountUp from 'react-countup';
import videoHomeHrpage from '../../assets/video-homepage.mp4';
import styles from 'styles/admin.module.scss';
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { callFetchCompanyById } from "@/config/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import a1 from '../../assets/layoutadmin1.jpg';
import a2 from '../../assets/layoutadmin2.jpg';
import a3 from '../../assets/layoutadmin7.jpg';
import a4 from '../../assets/layoutadmin4.jpg';
import a5 from '../../assets/layoutadmin5.jpg';
import a8 from '../../assets/layoutadmin8.jpg';
import a9 from '../../assets/layoutadmin9.jpg';
import { useNavigate } from "react-router-dom";
const DashboardPage = () => {
    const navigate = useNavigate();
    const gotoJob=()=>{
        navigate('/admin/job/upsert');
    }
    const gotoCompany=()=>{
        navigate('/admin/company');
    }
    const gotoResume=()=>{
        navigate('/admin/resume');
    }
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
      };
      const images = [a5,a1,a2,a4,a3];
    const formatter = (value: number | string) => {
        return (
            <CountUp end={Number(value)} separator="," />
        );
    };
    const user = useAppSelector(state => state.account.user);
    
    const [isAdminNotHr, setIsAdminNotHr] = useState<boolean>(true);
    useEffect(() => {
        (user.company?.id) ? setIsAdminNotHr(false) :setIsAdminNotHr(true) 
    }, [])
    return (
        <>
            {isAdminNotHr === true ?   
            <>
                <Row gutter={[30, 30]}>
                    <Col span={24} md={8}>
                        <Card title="Manage Companies" bordered={false} >
                            <Statistic
                                title="Active Companies"
                                value={23456}
                                formatter={formatter}
                            />

                        </Card>
                    </Col>
                    <Col span={24} md={8}>
                        <Card title="Manage Jobs" bordered={false} >
                            <Statistic
                                title="Active Jobs"
                                value={35678}
                                formatter={formatter}
                            />
                        </Card>
                    </Col>
                    <Col span={24} md={8}>
                        <Card title="Manage Blogs" bordered={false} >
                            <Statistic
                                title="Active Blogs"
                                value={23567}
                                formatter={formatter}
                            />
                        </Card>
                    </Col>
                    <Col span={24} md={8}>
                        <Card title="Manage Users" bordered={false} >
                            <Statistic
                                title="Active Users"
                                value={432733}
                                formatter={formatter}
                            />

                        </Card>
                    </Col>
                    <Col span={24} md={8}>
                        <Card title="Manage Resumes" bordered={false} >
                            <Statistic
                                title="Active Resumes"
                                value={997273}
                                formatter={formatter}
                            />
                        </Card>
                    </Col>
                    <Col span={24} md={8}>
                        <Card title="Manage Subscribers" bordered={false} >
                            <Statistic
                                title="Active Subscribers"
                                value={203482}
                                formatter={formatter}
                            />
                        </Card>
                    </Col>
                    <Col span={24} md={8}>
                        <Card title="Manage Skills" bordered={false} >
                            <Statistic
                                title="Active Skills"
                                value={1650}
                                formatter={formatter}
                            />

                        </Card>
                    </Col>
                    <Col span={24} md={8}>
                        <Card title="Manage Permissions" bordered={false} >
                            <Statistic
                                title="Active Permissions"
                                value={6260}   
                                formatter={formatter}
                            />
                        </Card>
                    </Col>
                    <Col span={24} md={8}>
                        <Card title="Manage Roles" bordered={false} >
                            <Statistic
                                title="Active Roles"
                                value={5630}
                                formatter={formatter}
                            />
                        </Card>
                    </Col>
                </Row>
                <Button type="primary" style={{marginLeft:1135,marginTop:30}} >Xuất báo cáo thống kê</Button>
            </>:
                 <div className={`${styles["dashboard"]}`}>     
                   <img src={a8} alt="left" style={{ width: 200, height: 675, objectFit: 'cover', borderRadius: 8 }} />
                    <div className={`${styles["dashboard-center"]}`}>
                        <div className={`${styles["dashboard-header"]}`}>
                            <span onClick={()=>gotoJob()}>Đăng tin tuyển dụng ngay</span> 
                            <span onClick={()=>gotoCompany()}>Cập nhật hồ sơ công ty</span>
                            <span onClick={()=>gotoResume()}>Xem các đơn ứng tuyển</span>   
                        </div>
                        <Divider/>
                        <Slider {...settings}>
                        {images.map((img, index) => (
                            <div key={index}>
                            <img
                                src={img}
                                alt={`slide-${index}`}
                                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                            />   
                            </div>
                        ))}
                        </Slider>
                        <div className={`${styles["dashboard-footer"]}`}>Tìm kiếm ứng viên xuất sắc, phát triển doanh nghiệp bền vững</div>
                    </div>
                    <img src={a9} alt="right" style={{ width: 200, height: 675, objectFit: 'cover', borderRadius: 8 }} />

                    
               </div>
        }

       </>
       
    )
}

export default DashboardPage;