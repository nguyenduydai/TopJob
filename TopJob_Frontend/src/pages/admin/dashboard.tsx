import { Button, Card, Col, Row, Statistic } from "antd";
import CountUp from 'react-countup';
import videoHomeHrpage from '../../assets/video-homepage.mp4';
import styles from 'styles/admin.module.scss';
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { callFetchCompanyById } from "@/config/api";

const DashboardPage = () => {
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
            <div>
                
                <div className={`${styles["videoDashboard"]}`}>
                    <video autoPlay muted loop>
                        <source src={videoHomeHrpage}
                                type = "video/mp4"  
                        />
                    </video>
                    <Button  className={`${styles["buttonDashboard"]}`}>Nâng cấp tài khoản để thực hiện nhiều tính năng hơn</Button>
                </div>
            </div>
        }

       </>
       
    )
}

export default DashboardPage;