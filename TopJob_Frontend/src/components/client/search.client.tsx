import { Button, Col, Form, Row, Select, notification } from 'antd';
import { EnvironmentOutlined, MonitorOutlined, SlidersOutlined } from '@ant-design/icons';
import { LEVEL_LIST, LOCATION_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const SearchClient = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const optionsLocations = LOCATION_LIST;
    const optionsLevels = LEVEL_LIST;
    const [form] = Form.useForm();
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (location.search) {
            const queryLocation = searchParams.get("location");
            const queryLevel = searchParams.get("level");
            const querySkills = searchParams.get("skills");
            if (queryLocation) {
                form.setFieldValue("location", queryLocation.split(","))
            }
            if (queryLevel) {
                form.setFieldValue("level", queryLevel.split(","))
            }
            if (querySkills) {
                form.setFieldValue("skills", querySkills.split(","))
            }
        }
    }, [location.search])

    useEffect(() => {
        fetchSkill();
    }, [])

    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr = res?.data?.result?.map(item => {
                return {
                    label: item.name as string,
                    value: item.id + "" as string
                }
            }) ?? [];
            setOptionsSkills(arr);
        }
    }

    const onFinish = async (values: any) => {
        let query = "";
        if (values?.location?.length) {
            query = `location=${values?.location?.join(",")}`;
        }
        if (values?.level?.length) {
            query = values.location?.length ? query + `&level=${values?.level?.join(",")}`
                :`level=${values?.level?.join(",")}`;
        }
        if (values?.skills?.length) {
            query = values.location?.length||values.level?.length ? query + `&skills=${values?.skills?.join(",")}`
                :`skills=${values?.skills?.join(",")}`;
        }
        console.log(query);
        if (!query) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: "Vui lòng chọn tiêu chí để tìm kiếm..."
            });
            return;
        }
        navigate(`/job?${query}`);
    }

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={
                {
                    render: () => <></>
                }
            }
        >
            <Row gutter={[20, 20]}>
                <Col span={24}><h2 style={{color:'#d1d1d1'}}>Công Việc IT Cho Bạn</h2></Col>
                <Col span={24} md={12}>
                    <ProForm.Item
                        name="skills"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={null}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <MonitorOutlined /> Tìm theo kỹ năng...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsSkills}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <ProForm.Item
                        name="level"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={null}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <SlidersOutlined /> Trình độ...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsLevels}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <ProForm.Item
                        name="location"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={null}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <EnvironmentOutlined /> Địa điểm...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsLocations}
                        />
                    </ProForm.Item>
                </Col>
                
                <Col span={12} md={4}>
                    <Button type='primary' onClick={() => form.submit()}>Tìm kiếm</Button>
                </Col>
            </Row>
        </ProForm>
    )
}
export default SearchClient;