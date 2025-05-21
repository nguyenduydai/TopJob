import { Divider } from 'antd';
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import videoHomepage from '../../assets/laiThuyen3.mp4'
import { MessageOutlined, UpCircleOutlined, UpSquareOutlined } from '@ant-design/icons';
import { message,notification } from 'antd';
import BlogCard from '@/components/client/card/blog.card';
import { useEffect } from 'react';

const HomePage = () => {
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
                <div style={{ marginTop:172 }}></div>
                <Divider />
                <JobCard /> 
                <Divider />
                <CompanyCard />
                <Divider />
                <Divider />
                <BlogCard/>
                
            </div>
            <button className={`${styles["scroll-to-top"]} `}  onClick={() => scrollToTop()} ><UpSquareOutlined style={{color:'#ef6c00'}}/></button>
            
            <df-messenger
            intent="WELCOME"
            chat-title="ChatboxTopJob"
            agent-id="6e1f1452-3771-4ddb-9481-35a9abf02c76"
            language-code="vi"
            ></df-messenger>
        </div>
    )
}


export default HomePage;