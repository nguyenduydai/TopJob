import React, { useEffect, useState } from "react";
import { Modal, Form, Select, InputNumber, Switch, Button, Input, Col, Row, Checkbox, Slider, message, notification } from "antd";
import { ProFormSelect } from "@ant-design/pro-components";
import { callCreateJobRecommendation, callFetchAllSkill, callFetchJobRecommendation, callFetchUser, callUserById } from "@/config/api";
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
const SurveyModal = (props: IProps) => {
  const { openModal, setOpenModal,reload,setReload } = props;
  const [form] = Form.useForm();
  const [useProfile, setUseProfile] = useState(false);
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
    fetchUseProfile();
  }, []);
  const fetchUseProfile= async () => {
    const temp = await callUserById(user.id);
    form.setFieldValue("educationRequirement",temp?.data?.education);
    let experience=temp?.data?.experience;
    experience==="0"?form.setFieldValue("experienceRequirement",""):
    form.setFieldValue("experienceRequirement",experience?.replaceAll("YEARS","năm kinh nghiệm"));
    form.setFieldValue("ageRequirement",temp?.data?.age);
  }
  const handleFinish = async(values:any) => {              
    let arrSkills = [];
    if (typeof values?.skills?.[0] === 'object') {
        arrSkills = values?.skills?.map((item: any) => { return { id: item.value } });
    } else {
        arrSkills = values?.skills?.map((item: any) => { return { id: +item } });
    }
    let educationRequirement=values.educationRequirement;
    let experienceRequirement=values.experienceRequirement;
    let ageRequirement=values.ageRequirement
    if(!useProfile){
        educationRequirement='';
        educationRequirement='';
        ageRequirement=0;
    }
    const res=await callCreateJobRecommendation( arrSkills, values.location,values.salary,values.quality,values.level,
        values.jobEnvironment,educationRequirement,experienceRequirement,ageRequirement );
    if(res&&+res.statusCode===200){
        message.success("Thực hiện khảo sát thành công");
        setReload(true);
         setOpenModal(false);
    }else {
        notification.error({
            message: 'Có lỗi xảy ra',
            description: res.message
        });
    }
    form.resetFields();
    setUseProfile(false);
    fetchUseProfile();
  };
  const onCancel=()=>{
    setOpenModal(false);
    form.resetFields();
    setUseProfile(false);
    fetchUseProfile();
  }
  return (
    <Modal
      title="Khảo sát công việc mong muốn"
      open={openModal}
      onCancel={onCancel}
      footer={null}
    >
       <Form form={form} layout="vertical"  onFinish={handleFinish}>

        <Row gutter={16}>
            <Col span={12}>
                <ProFormSelect
                    name="skills"
                    label="Kỹ năng của bạn"
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
          <Col span={12}>
            <Form.Item label="Địa chỉ làm việc" name="location" rules={[{ required: true ,message: 'Vui lòng chọn địa chỉ!'}]}> 
            <Select placeholder="Chọn địa điểm">
                <Option value="HANOI">Hà Nội</Option>
                <Option value="HOCHIMINH">Hồ Chí Minh</Option>
                <Option value="DANANG">Đà Nẵng</Option>
                <Option value="OTHER">Khác</Option>
            </Select>
            </Form.Item>
          </Col>
      
          <Col span={12}>
            <Form.Item label="Trình độ của bạn" name="level" rules={[{ required: true ,message: 'Vui lòng chọn trình độ!'}]}> 
            <Select placeholder="Chọn cấp bậc">
                <Option value="INTERN">Intern</Option>
                <Option value="FRESHER">Fresher</Option>
                <Option value="JUNIOR">Junior</Option>
                <Option value="MIDDLE">Middle</Option>
                <Option value="SENIOR">Senior</Option>
                <Option value="OTHER">Other</Option>
            </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Môi trường làm việc" name="jobEnvironment" rules={[{ required: true ,message: 'Vui lòng chọn môi trường!'}]}> 
            <Select placeholder="Chọn môi trường">
                <Option value="OFFICE">Office</Option>
                <Option value="REMOTE">Remote</Option>
                <Option value="Freelance">Freelance</Option>
                <Option value="HYBRID">Hybrid</Option>
                <Option value="OTHER">Other</Option>
            </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mức lương kỳ vọng" name="salary">
              <Slider min={0} max={50} step={1} tooltip={{ formatter: value => `${value} triệu` }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="quality" valuePropName="checked" initialValue={false}>
              <Checkbox>Tôi quan tâm công việc tuyển số lượng lớn</Checkbox>
            </Form.Item>
          </Col>

          <Col span={24}>
                <Form.Item label="Bạn có đồng ý sử dụng dữ liệu cá nhân?">
                 <Switch checked={useProfile} onChange={setUseProfile} />
                 </Form.Item>
          </Col>

          {useProfile && (
            <>
              <Col span={24}>
                <Form.Item label="Trình độ học vấn" name="educationRequirement"> 
                <Select placeholder="Trình độ học vấn" disabled={true}>
                    <Option value="HIGH_SCHOOL">Trung học phổ thông</Option>
                    <Option value="BACHELOR">Đại học</Option>
                    <Option value="MASTER">Thạc sĩ</Option>
                    <Option value="OTHER">Khác</Option>
                </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tuổi" name="ageRequirement"> 
                <InputNumber min={18} style={{ width: '100%' }} disabled={true} />
                </Form.Item>

              </Col>
              <Col span={12}>
                <Form.Item label="Kinh nghiệm làm việc" name="experienceRequirement"> 
                <InputNumber  style={{ width: '100%' }} disabled={true}/>
                </Form.Item>
              </Col>
              
            </>
          )}
          <Col span={24}>
                 <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Gửi khảo sát
                    </Button>
                </Form.Item>
              </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SurveyModal;
