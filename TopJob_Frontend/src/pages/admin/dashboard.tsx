import { Button, Card, Col, Divider, message, Modal, Result, Row, Statistic } from "antd";
import CountUp from 'react-countup';
import videoHomeHrpage from '../../assets/video-homepage.mp4';
import styles from 'styles/admin.module.scss';
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { callFetchCompany, callFetchCompanyById, callFetchJob, callFetchResume, callFetchUser } from "@/config/api";
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
import { useLocation, useNavigate } from "react-router-dom";
import PaymentModal from "@/components/admin/accountupgrade/modal.payment";
import axios from 'config/axios-customize';
import { FilePdfOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import JobPerMonthChart from "@/components/admin/chart/chart.jobPerMonth";
import TopCompaniesByJobsChart from "@/components/admin/chart/chart.topCompanyByJob";

const DashboardPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [openResultSuccess, setOpenResultSuccess] = useState<boolean>(false);
    const [openResultFail, setOpenResultFail] = useState<boolean>(false);
    const [valueJob, setValueJob] = useState<number|undefined>(0);
    const [valueCompany, setValueCompany] = useState<number|undefined>(0);
    const [valueResume, setValueResume] = useState<number|undefined>(0);
    const [valueUser, setValueUser] = useState<number|undefined>(0);
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let payment = params?.get("payment");
    //const [isChartForHr, setIsChartForHr] = useState<boolean>(false);
    useEffect(() => {
        const existingScript = document.querySelector(
          'script[src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"]'
        );
    
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
          script.async = true;
          document.body.appendChild(script);
        }
    }, []);
    useEffect(()=>{
        const getTotal=async()=>{
            const res1=await callFetchJob("");
            if(res1.statusCode===200)
                setValueJob(res1.data?.meta.total);
            const res2=await callFetchCompany("");
            if(res2.statusCode===200)
                setValueCompany(res2.data?.meta.total);
            const res3=await callFetchResume("");
            if(res3.statusCode===200)
                setValueResume(res3.data?.meta.total);
            const res4=await callFetchUser("");
            if(res4.statusCode===200)
                setValueUser(res4.data?.meta.total);
        }
        getTotal();
    },[])
    useEffect(() => {
        if(payment==="success"){
            setOpenResultSuccess(true);
            navigate('/admin');
        }

        if(payment==="failure"){
            setOpenResultFail(true);
             navigate('/admin');
        }

    },[])
    const navigate = useNavigate();
    const gotoJob=()=>{
        navigate('/admin/job/upsert');
    }
    const gotoPayment=()=>{
        setIsModalOpen(true);
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

    // export job
    const handleExportJobReport = async () => {
        try {
            const response = await axios.get('/api/v1/reports/jobs', {
                responseType: 'blob', // Đặt kiểu phản hồi là 'blob' để nhận dữ liệu nhị phân
            });
            if (response) {
                const url = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'job_report_' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') + '.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to export job report. Status:', response.status);
            }
        } catch (error) {
            console.error('Error exporting job report:', error);
        }
    };
    // export resume
    const handleExportResumeReport = async () => {
        try {
            const response = await axios.get('/api/v1/reports/resumes', {
                responseType: 'blob', // Đặt kiểu phản hồi là 'blob' để nhận dữ liệu nhị phân
            });
            if (response) {
                const url = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resume_report_' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') + '.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to export resume report. Status:', response.status);
            }
        } catch (error) {
            console.error('Error exporting resume report:', error);
        }
    };
     // export user
     const handleExportUserReport = async () => {
        try {
            const response = await axios.get('/api/v1/reports/users', {
                responseType: 'blob', // Đặt kiểu phản hồi là 'blob' để nhận dữ liệu nhị phân
            });
            if (response) {
                const url = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'user_report_' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') + '.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to export user report. Status:', response.status);
            }
        } catch (error) {
            console.error('Error exporting user report:', error);
        }
    };
     // export company
     const handleExportCompanyReport = async () => {
        try {
            const response = await axios.get('/api/v1/reports/companies', {
                responseType: 'blob', // Đặt kiểu phản hồi là 'blob' để nhận dữ liệu nhị phân
            });
            if (response) {
                const url = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'company_report_' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') + '.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to export company report. Status:', response.status);
            }
        } catch (error) {
            console.error('Error exporting company report:', error);
        }
    };
    return (
        <>
            {isAdminNotHr === true ?   
            <>
                <Row gutter={[30, 16]}>
                    <Divider>Biểu đồ phân tích thống kê</Divider>
                    <Col span={24} md={12}>
                    <JobPerMonthChart isChartForHr={false}/>
                    </Col>
                    <Col span={24} md={12}>
                    <TopCompaniesByJobsChart/>
                    </Col>
                    <Divider>Xuất báo cáo thống kê</Divider>
                    <Col span={24} md={6} style={{textAlign:'center'}}>
                        <Card title="Quản lý công ty" bordered={false} >
                            <Statistic
                                title="Tổng số công ty"
                                value={valueCompany}
                                formatter={formatter}
                            />
                            <Button style={{marginTop:15}} onClick={()=>handleExportCompanyReport()} type="primary" ><VerticalAlignBottomOutlined /> Xuất báo cáo thống kê <FilePdfOutlined /></Button>
                        </Card>
                    </Col>
                    <Col span={24} md={6} style={{textAlign:'center'}}>
                        <Card title="Quản lý công việc" bordered={false} >
                            <Statistic
                                title="Tổng số công việc"
                                value={valueJob}
                                formatter={formatter}
                            />
                             <Button style={{marginTop:15}} onClick={()=>handleExportJobReport()} type="primary" ><VerticalAlignBottomOutlined /> Xuất báo cáo thống kê <FilePdfOutlined /></Button>
                        </Card>
                    </Col>
                    <Col span={24} md={6} style={{textAlign:'center'}}>
                        <Card title="Quản lý đơn ứng tuyển" bordered={false} >
                            <Statistic
                                title="Tổng số đơn ứng tuyển"
                                value={valueResume}
                                formatter={formatter}
                            />
                             <Button  style={{marginTop:15}} onClick={()=>handleExportResumeReport()} type="primary" ><VerticalAlignBottomOutlined /> Xuất báo cáo thống kê <FilePdfOutlined /></Button>
                        </Card>
                    </Col>
                    <Col span={24} md={6} style={{textAlign:'center'}}>
                        <Card title="Quản lý người dùng" bordered={false} >
                            <Statistic
                                title="Tổng số người dùng"
                                value={valueUser}
                                formatter={formatter}
                            />
                             <Button style={{marginTop:15}} onClick={()=>handleExportUserReport()} type="primary" ><VerticalAlignBottomOutlined /> Xuất báo cáo thống kê <FilePdfOutlined /></Button>
                        </Card>
                    </Col>
                
                </Row>
               
            </>:
                 <div className={`${styles["dashboard"]}`}>     
                   <img src={a8} alt="left" style={{ width: 200, height: 675, objectFit: 'cover', borderRadius: 8 }} />
                    <div className={`${styles["dashboard-center"]}`}>
                        <div className={`${styles["dashboard-header"]}`}>
                            <span onClick={()=>gotoJob()}>Đăng tin tuyển dụng ngay</span> 
                            
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
                        <div className={`${styles["dashboard-header"]}`} >  

                            <span onClick={()=>gotoPayment()} style={{marginTop:30}}>Nâng cấp tài khoản</span>
       
                        </div>
                    </div>
                    <img src={a9} alt="right" style={{ width: 200, height: 675, objectFit: 'cover', borderRadius: 8 }} />

                    <PaymentModal
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                    />
                    <Modal
                        open={openResultSuccess}
                        footer={null}
                        onCancel={() => setOpenResultSuccess(false)}
                    >
                        <Result 
                            status="success"
                            title="Thanh toán thành công!"
                            subTitle="Cảm ơn bạn đã sử dụng dịch vụ."
                            extra={[
                                <Button type="primary" onClick={() => setOpenResultSuccess(false)}>Về trang chủ</Button>,
                            ]}
                        />
                    </Modal>
                    <Modal
                        open={openResultFail}
                        footer={null}
                        onCancel={() => setOpenResultFail(false)}
                    >
                        <Result 
                            status='error'
                            title="Thanh toán thất bại!"
                            subTitle="Hãy thực hiện lại thanh toán."
                            extra={[
                                <Button type="primary" onClick={() => setOpenResultFail(false)}>Về trang chủ</Button>,
                            ]}
                        />
                    </Modal>
                    <df-messenger
                        intent="WELCOME"
                        chat-title="ChatboxTopJob"
                        agent-id="6e1f1452-3771-4ddb-9481-35a9abf02c76"
                        language-code="vi"
                    ></df-messenger>
               </div>
               
        }

       </>
       
    )
}

export default DashboardPage;