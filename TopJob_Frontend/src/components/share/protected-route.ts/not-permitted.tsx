import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotPermitted = () => {
    const navigate = useNavigate();
    return (
        <Result
            status="403"
            title="Truy cập bị từ chối"
            subTitle="Xin lỗi, bạn không có quyền hạn (permission) truy cập thông tin này"
            extra={<Button type="primary"
                onClick={() => navigate('/')}
            >Back Home</Button>}
        />
    )
};

export default NotPermitted;