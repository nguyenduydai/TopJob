import React, { useEffect, useState } from "react";
import { Modal, Form, Select, InputNumber, Switch, Button, Input, Col, Row, Checkbox, Slider, message, notification } from "antd";
import { ProFormSelect } from "@ant-design/pro-components";
import { callCreateJobRecommendation, callCreateTalentCandidateForCompany, callFetchAllSkill, callFetchJobRecommendation, callFetchUser, callUserById } from "@/config/api";
import { useAppSelector } from "@/redux/hooks";

const { Option } = Select;
interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reload:boolean;
    setReload: (v: boolean) => void;
}
const CandidateModal = (props: IProps) => {
  const { openModal, setOpenModal,reload,setReload } = props;
  const [form] = Form.useForm();
  const [skills, setSkills] = useState<ISkillSelect[]>([]);
  const user = useAppSelector(state => state.account.user);
  async function fetchSkillList(): Promise<ISkillSelect[]> {
          const res = await callFetchAllSkill(`page=1&size=100`);
          if (res && res.data) {
              const list = res.data.result;
              const temp = list.map(item => {
                  return {
                      label: item.name as string,
                      value: `${item.id}` as string
                  }
              })
              return temp;
          } else return [];
    }
  
  useEffect(() => {
    const fetchSkill = async () => {
        const temp = await fetchSkillList();
        setSkills(temp);
    }
    fetchSkill();
  }, []);
 
  const handleFinish = async(values:any) => {              
    let arrSkills = [];
    if (typeof values?.skills?.[0] === 'object') {
        arrSkills = values?.skills?.map((item: any) => { return { id: item.value } });
    } else {
        arrSkills = values?.skills?.map((item: any) => { return { id: +item } });
    }
    let minAge=values.minAge? values.minAge:18;
    let maxAge=values.maxAge? values.maxAge:38;
    let age=`${minAge}-${maxAge}`;
    const res=await callCreateTalentCandidateForCompany( values.address,arrSkills, values.education,age,values.experience,values.activity );
    console.log(values.address,arrSkills, values.education,age,values.experience,values.activity );
    if(res&&+res.statusCode===200){
        message.success("Thực hiện khảo sát thành công");
        setReload(true);
    }else {
        notification.error({
            message: 'Có lỗi xảy ra',
            description: res.message
        });
    }
    form.resetFields();;
  };
  const onCancel=()=>{
    setOpenModal(false);
    form.resetFields();
  }
  return (
    <Modal
      title="Khảo sát tìm kiếm ứng viên tiềm năng mong muốn"
      open={openModal}
      onCancel={onCancel}
      footer={null}
    >
       <Form form={form} layout="vertical"  onFinish={handleFinish}>

        <Row gutter={16}>
            <Col span={24}>
                <ProFormSelect
                    name="skills"
                    label="Kỹ năng ứng viên"
                    options={skills}
                    placeholder="Chọn kỹ năng"
                    rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
                    allowClear
                    mode="multiple"
                    fieldProps={{
                        suffixIcon: null
                }}
                />
            </Col>
          <Col span={24}>
            <Form.Item label="Địa chỉ ứng viên" name="address" rules={[{ required: true ,message: 'Vui lòng chọn địa chỉ!'}]}> 
            <Select placeholder="Chọn địa điểm">
                <Option value="Hà Nội">Hà Nội</Option>
                <Option value="Hồ chí Minh">Hồ Chí Minh</Option>
                <Option value="Đà Nẵng">Đà Nẵng</Option>
                <Option value="Bắc Giang">Bắc Giang</Option>
                <Option value="Hải Phòng">Hải Phòng</Option>
                <Option value="Nam Định">Nam Định</Option>
                <Option value="Ninh Bình">Ninh Bình</Option>
                <Option value="Bến Tre">Bến Tre</Option>
                <Option value="OTHER">Khác</Option>
            </Select>
            </Form.Item>
          </Col>
            <Col span={24}>
                <Form.Item label="Trình độ học vấn" name="education"> 
                <Select placeholder="Trình độ học vấn" >
                    <Option value="HIGH_SCHOOL">Trung học phổ thông</Option>
                    <Option value="BACHELOR">Đại học</Option>
                    <Option value="MASTER">Thạc sĩ</Option>
                    <Option value="OTHER">Khác</Option>
                </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Tuổi tối thiểu" name="minAge"> 
                <InputNumber defaultValue={18} min={18} style={{ width: '100%' }} />
                </Form.Item>

            </Col>
            <Col span={12}>
                <Form.Item label="Tuổi tối đa" name="maxAge"> 
                <InputNumber defaultValue={38} min={18} style={{ width: '100%' }}/>
                </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Kinh nghiệm làm việc" name="experience"> 
                <Select placeholder="Kinh nghiệm làm việc" >
                    <Option value="0-1 YEARS">0-1 năm kinh nghiệm</Option>
                    <Option value="1-2 YEARS">1-3 năm kinh nghiệm</Option>
                    <Option value="2-4 YEARS">2-4 năm kinh nghiệm</Option>
                    <Option value="3-5 YEARS">3-5 năm kinh nghiệm</Option>
                    <Option value="4-6 YEARS">4-6 năm kinh nghiệm</Option>
                    <Option value="0">Khác</Option>
                </Select>
                </Form.Item>
            </Col>
            <Col span={24}>
            <Form.Item name="activity" valuePropName="checked" initialValue={false}>
              <Checkbox>Mức độ hoạt động gần đây (cập nhật CV, ứng tuyển công việc, đăng ký skills)</Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
                 <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Tìm kiếm
                    </Button>
                </Form.Item>
              </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CandidateModal;
