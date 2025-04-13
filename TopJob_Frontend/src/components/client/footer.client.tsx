
import { Layout, Row, Col, Divider, Typography, Space, Grid, Button, Input } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  KubernetesOutlined
} from '@ant-design/icons';
import styles from '@/styles/client.module.scss';


const { Footer } = Layout;
const { Text,  Title } = Typography;
const { useBreakpoint } = Grid;
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
const FooterComponent = () => {
  const screens = useBreakpoint(); // Kiểm tra responsive
      const navigate = useNavigate();
  
  return (
    <Footer
    className={styles["footer-section"]} >
      <Row gutter={[24, 24]}>
        {/* Column 1: Logo + Mô tả */}
        <Col xs={24} sm={12} md={6}>
            <div className={styles['brand']} >
            <KubernetesOutlined   onClick={() => navigate('/')} title='Duy Dai' /> <span className={styles['title']} onClick={() => navigate('/')} title='Duy Dai'>TOP JOB</span>
            </div>
          <Text style={{ color: '#aaa', display: 'block', marginTop: 16 }}>
          HÃY ĐỂ TOP JOB GIÚP BẠN !!!!!
          </Text><br/>FOLLOW US<br/>
          <Space size="middle" style={{ marginTop: 16 }}>
            <Link to="/"><FacebookOutlined style={{ color: '#fff', fontSize: 20 }} /></Link>
            <Link to="job"><TwitterOutlined style={{ color: '#fff', fontSize: 20 }} /></Link>
            <Link to="company"><InstagramOutlined style={{ color: '#fff', fontSize: 20 }} /></Link>
            <Link to="blog"><LinkedinOutlined style={{ color: '#fff', fontSize: 20 }} /></Link>
          </Space>
        </Col>

        {/* Column 2: Liên kết nhanh */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: '#fff' }}>Liên kết</Title>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="/" style={{ color: '#aaa', margin: '4px 0' }}>Trang chủ</Link>
            <Link to="job" style={{ color: '#aaa', margin: '4px 0' }}>Việc làm</Link>
            <Link to="company" style={{ color: '#aaa', margin: '4px 0' }}>Công ty</Link>
            <Link to="blog" style={{ color: '#aaa', margin: '4px 0' }}>Tin tức</Link>
          </div>
        </Col>

        {/* Column 3: Thông tin liên hệ */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: '#fff' }}>Liên hệ</Title>
          <Space direction="vertical" size={8}>
            <Text style={{ color: '#aaa' }}>
              <EnvironmentOutlined /> Minh Khai, Bắc Từ Liêm, Hà Nội
            </Text>
            <Text style={{ color: '#aaa' }}>
              <PhoneOutlined /> +84 86 552 888
            </Text>
            <Text style={{ color: '#aaa' }}>
              <MailOutlined /> nguyenduydai5588@gmail.com
            </Text>
            <Text style={{ color: '#aaa' }}>
              <ClockCircleOutlined /> 8:00 - 17:00 (T2-T6)
            </Text>
          </Space>
        </Col>

        {/* Column 4: Đăng ký nhận tin */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: '#fff' }}>Nhận bản tin</Title>
          <Text style={{ color: '#aaa', marginBottom: 16 }}>
            Đăng ký để nhận thông báo mới nhất.
          </Text><br/> <br/> 
          <Space.Compact style={{ width: '90%' }}>
            <Input placeholder="Nhập email của bạn" />
            <Button type="dashed" style={{ color: '#ffffff',background:'#aaa' }}>Gửi</Button>
          </Space.Compact>
        </Col>
      </Row>

      <Divider style={{ borderColor: '#444', margin: '24px 0' }} />

      {/* Copyright */}
      <Row justify="center">
        <Text style={{ color: '#aaa' }}>
          ---© {new Date().toLocaleDateString()} - TOPJOB - Hãy để chúng tôi giúp bạn ©--- 
        </Text>
      </Row>
    </Footer>
  );
};

export default FooterComponent;