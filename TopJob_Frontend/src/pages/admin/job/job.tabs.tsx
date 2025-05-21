import { Button, Col, Divider, Row, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import JobPage from './job';
import SkillPage from './skill';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permissions';
import { useAppSelector } from '@/redux/hooks';
import JobPerMonthChart from '@/components/admin/chart/chart.jobPerMonth';
import JobPieChart from '@/components/admin/chart/chart.jobHaveResume';
import { FilePdfOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import axios from 'config/axios-customize';
import styles from 'styles/admin.module.scss';

const JobTabs = () => {
    const onChange = (key: string) => {
        // console.log(key);
    };
    const user = useAppSelector(state => state.account.user);
    // export job
    const handleExportJobReport = async () => {
        try {
            const response = await axios.get('/api/v1/reports/jobsbycompany', {
                responseType: 'blob', // Đặt kiểu phản hồi là 'blob' để nhận dữ liệu nhị phân
            });
            if (response) {
                const url = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'job_bycompany_report_' + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '') + '.pdf';
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
    const items: TabsProps['items'] = user.role.id=="1"?  
    [
       {
            key: '1',
            label: 'Quản lý công việc',
            children: <JobPage />,
        },
        
        {
            key: '2',
            label: 'Quản lý kỹ năng',
            children: <SkillPage />,
        },

    ]  :
    [
        {
            key: '1',
            label: 'Quản lý công việc',
            children: <JobPage />,
        }

    ];
    return (
        <div>
            {user?.company?.id && 
            <div >
                <Row  gutter={[10, 10]}>
                    <Col span={10}>
                        <JobPerMonthChart isChartForHr={true}/>
                    </Col>
                    <Col span={4} style={{display:'flex',justifyContent:'space-around', alignItems: 'center' }}>
                        <div className={styles["reportjob"]} onClick={()=>handleExportJobReport()}>
                            <p><VerticalAlignBottomOutlined /></p>
                            <p> Xuất<br/> báo<br/> cáo<br/> thống<br/> kê</p>
                            <p><FilePdfOutlined /></p>
                        </div>
                    </Col>
                    <Col span={10}>
                        <JobPieChart/>
                    </Col>
                </Row>
            </div>
            } 
            <Access
                permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE_ADMIN}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={onChange}
                />
            </Access>

          
        </div>
    );
}

export default JobTabs;