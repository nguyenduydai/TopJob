import { Divider } from 'antd';
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import videoHomepage from '../../assets/laiThuyen3.mp4'
import { MessageOutlined } from '@ant-design/icons';
import { message,notification } from 'antd';
const HomePage = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Hiệu ứng cuộn mượt mà
        });
    }
    const handleChatBox=()=>{
       // message.success('chức năng chat box chưa được thiết kế');
       notification.warning({
        message: 'Chức năng này chưa được thiết kế',
        description: 'chức năng chatbox sẽ có trong tương lai '
    });
    }
    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`}>
            <video autoPlay muted loop>
                <source src={videoHomepage}
                        type = "video/mp4"
                />
            </video>
            <div className={`${styles["content-in-video"]} `}>             
                <div className={`${styles["slogan"]} `}>
                    <div className={`${styles["slogan-content"]} `}>
                        "Tìm kiếm công việc định hình tương lai - Chủ động vươn mình ra khơi - Chèo lái con thuyền số phận"   
                    </div>
                </div>
                <h1 className={`${styles["highlight"]} `}>HÃY ĐỂ <br/>TOP JOB <br/>GIÚP BẠN<br/> !!!!!</h1>
                <div className={`${styles["search-content"]} `}  >
                    <SearchClient />
                </div>
            </div>

            <div className={`${styles["content-notin-video"]} `}>
                {/* <Divider /> */}
                <CompanyCard />
                <div style={{ margin: 50 }}></div>
                <Divider />
                <JobCard /> 
            </div>
            <button className={`${styles["chatbox"]} `}  onClick={() => handleChatBox()}><MessageOutlined /></button>
            <button className={`${styles["scroll-to-top"]} `}  onClick={() => scrollToTop()} >↑</button>

        </div>
    )
}

export default HomePage;