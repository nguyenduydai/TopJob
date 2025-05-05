import SearchClient from '@/components/client/search.client';
import { Col, Divider, Row } from 'antd';
import styles from 'styles/client.module.scss';
import JobCard from '@/components/client/card/job.card';

const ClientJobPage = (props: any) => {
    return (
        <div className={`${styles["container"]} ${styles["modal-infor"]}`} >
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <div style={{marginTop:30,marginLeft:110}}>
                    <SearchClient />
                    </div>
                </Col>
                {/* <Divider /> */}

                <Col span={24}>
                    <JobCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientJobPage;