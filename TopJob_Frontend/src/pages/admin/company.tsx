import ModalCompany from "@/components/admin/company/modal.company";
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCompany } from "@/redux/slice/companySlide";
import { ICompany } from "@/types/backend";
import { CheckSquareOutlined, DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProCard, ProColumns, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Col, ConfigProvider, Form, Modal, Popconfirm, Row, Space, Upload, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { callCreateCompany, callDeleteCompany, callFetchCompanyById, callUpdateCompany, callUploadSingleFile } from "@/config/api";
import queryString from 'query-string';
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import ReactQuill from "react-quill";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
interface ICompanyForm {
    name: string;
    address: string;
    website:string
}

interface ICompanyLogo {
    name: string;
    uid: string;
    url?: string;
}
const CompanyPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ICompany | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.company.isFetching);
    const meta = useAppSelector(state => state.company.meta);
    const companies = useAppSelector(state => state.company.result);
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.account.user);
    const [isAdminNotHr, setIsAdminNotHr] = useState<boolean>(true);
    ////////////////
      const [dataBusinessLicense, setDataBusinessLicense] = useState<ICompanyLogo[]>([]);
        const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
        const [dataLogo, setDataLogo] = useState<ICompanyLogo[]>([]);
        const [previewOpen, setPreviewOpen] = useState(false);
        const [previewImage, setPreviewImage] = useState('');
        const [previewTitle, setPreviewTitle] = useState('');
    
        const [value, setValue] = useState<string>("");
        const [form] = Form.useForm();
        const submitCompany = async (valuesForm: ICompanyForm) => {
                const { name, address,website } = valuesForm;
                if (dataInit?.id) {
                    //update
                    const res = await callUpdateCompany(dataInit.id, name, address,website, value, dataLogo[0].name,dataBusinessLicense[0].name);
                    if (res.data) {
                        message.success("Cập nhật company thành công");
                        handleReset();
                        reloadTable();
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                        });
                    }
                } else {
                    if (dataLogo.length === 0) {
                        message.error('Vui lòng upload ảnh Logo')
                        return;
                    }
                    if (dataBusinessLicense.length === 0) {
                        message.error('Vui lòng upload ảnh Logo')
                        return;
                    }
                    //create
                    const res = await callCreateCompany(name, address,website, value, dataLogo[0].name,dataBusinessLicense[0].name);
                    if (res.data) {
                        message.success("Thêm mới company thành công");
                        handleReset();
                        reloadTable();
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                        });
                    }
                }
            }
        
            const handleReset = async () => {
                form.resetFields();
               // setValue("");
                setDataInit(null);
            }
        
            const handleRemoveFile = (file: any) => {
                setDataLogo([])
            }
        
            const handlePreview = async (file: any) => {
                if (!file.originFileObj) {
                    setPreviewImage(file.url);
                    setPreviewOpen(true);
                    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
                    return;
                }
                getBase64(file.originFileObj, (url: string) => {
                    setPreviewImage(url);
                    setPreviewOpen(true);
                    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
                });
            };
        
            const getBase64 = (img: any, callback: any) => {
                const reader = new FileReader();
                reader.addEventListener('load', () => callback(reader.result));
                reader.readAsDataURL(img);
            };
        
            const beforeUpload = (file: any) => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    message.error('You can only upload JPG/PNG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            };
        
            const handleChange = (info: any) => {
                if (info.file.status === 'uploading') {
                    setLoadingUpload(false);
                }
                if (info.file.status === 'done') {
                    setLoadingUpload(false);
                }
                if (info.file.status === 'error') {
                    setLoadingUpload(false);
                    message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
                }
            };
        
            const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
                const res = await callUploadSingleFile(file, "company");
                if (res && res.data) {
                    setDataLogo([{
                        name: res.data.fileName,
                        uid: uuidv4(),
                        url: `${import.meta.env.VITE_BACKEND_URL}/storage/company/${res.data.fileName}`,

                    }])
                    if (onSuccess) onSuccess('ok')
                } else {
                    if (onError) {
                        setDataLogo([])
                        const error = new Error(res.message);
                        onError({ event: error });
                    }
                }
            };
          const handleUploadFileBusinessLicense = async ({ file, onSuccess, onError }: any) => {
                const res = await callUploadSingleFile(file, "business");
                if (res && res.data) {
                    setDataBusinessLicense([{
                        name: res.data.fileName,
                        uid: uuidv4(),
                        url: `${import.meta.env.VITE_BACKEND_URL}/storage/business/${res.data.fileName}`,

                    }])
                    if (onSuccess) onSuccess('ok')
                } else {
                    if (onError) {
                        setDataBusinessLicense([])
                        const error = new Error(res.message);
                        onError({ event: error });
                    }
                }
            };      
        const handleRemoveFileBusinessLicense = (file: any) => {
            setDataBusinessLicense([])
        }
    useEffect(() => {
        const fetchCompanyUser = async (id: string | undefined) => {
            if(id){
                setIsAdminNotHr(false)
                const res = await callFetchCompanyById(id);
                if (res && res.data) {
                    console.log(res)
                    setDataInit(res.data);

                    form.setFieldsValue(res.data); // Cập nhật lại form!
                    if (res.data.logo) {
                        setDataLogo([
                            {
                                uid: uuidv4(),
                                name: res.data.logo,
                                url: `${import.meta.env.VITE_BACKEND_URL}/storage/company/${res.data.logo}`,
                            }
                        ]);
                    }
                    if (res.data.businessLicense) {
                        setDataBusinessLicense([
                            {
                                uid: uuidv4(),
                                name: res.data.businessLicense,
                                url: `${import.meta.env.VITE_BACKEND_URL}/storage/business/${res.data.businessLicense}`,
                            }
                        ]);
                    }
                    if (res.data && res.data?.description) {
                        setValue(res.data?.description);
                    }  
                     console.log(dataBusinessLicense)
                }else {
                    notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
                }
            }    
        }
        fetchCompanyUser(user.company?.id );
    }, [])

    const handleDeleteCompany = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteCompany(id);
            if (res && +res.statusCode === 200) {
                message.success('Xóa Company thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<ICompany>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.page - 1) * (meta.pageSize)}
                    </>)
            },
            hideInSearch: true,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            sorter: true,
        },

        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày sửa',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {

            title: 'Hành động', 
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    < Access
                        permission={ALL_PERMISSIONS.COMPANIES.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access >
                    <Access
                        permission={ALL_PERMISSIONS.COMPANIES.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa company"}
                            description={"Bạn có chắc chắn muốn xóa company này ?"}
                            onConfirm={() => handleDeleteCompany(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                        </span>
                        </Popconfirm>
                    </Access>
                </Space >
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }



        if (clone.name) q.filter = `${sfLike("name", clone.name)}`;
        if (clone.address) {
            q.filter = clone.name ?
                q.filter + " and " + `${sfLike("address", clone.address)}`
                : `${sfLike("address", clone.address)}`;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.address) {
            sortBy = sort.address === 'ascend' ? "sort=address,asc" : "sort=address,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }
    console.log(dataBusinessLicense);
    return (
        <>
            {isAdminNotHr === true ? 
            <div>
                <Access
                    permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}
                >
                    <DataTable<ICompany>
                        actionRef={tableRef}
                        headerTitle="Danh sách Công Ty"
                        rowKey="id"
                        loading={isFetching}
                        columns={columns}
                        dataSource={companies}
                        request={async (params, sort, filter): Promise<any> => {
                            const query = buildQuery(params, sort, filter);
                            dispatch(fetchCompany({ query }))
                        }}
                        scroll={{ x: true }}
                        pagination={
                            {
                                current: meta.page, 
                                pageSize: meta.pageSize,    
                                showSizeChanger: true,
                                total: meta.total,
                                showTotal: (total, range) => { return (<div style={{color:'#a7a7a7'}}>STT {range[0]} -&gt; {range[1]}</div>) }
                            }
                        }
                        rowSelection={false}
                        toolBarRender={(_action, _rows): any => {
                            return (
                                <Access
                                    permission={ALL_PERMISSIONS.COMPANIES.CREATE}
                                    hideChildren
                                >
                                    <Button
                                        icon={<PlusOutlined />}
                                        type="primary"
                                        onClick={() => setOpenModal(true)}
                                    >
                                        Thêm mới
                                    </Button>
                                </Access>
                            );
                        }}
                    />
                </Access>
                <ModalCompany
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reloadTable={reloadTable}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />
            </div >
            : 
            // <ModalCompany
            // openModal={openModal}
            // setOpenModal={setOpenModal}
            // reloadTable={reloadTable}
            // dataInit={dataInit}
            // setDataInit={setDataInit}
            // /> 
            <div>
                <h2 style={{textAlign:'center'}}>Thông tin công ty</h2>
                <ProForm
                    form={form}
                    onFinish={submitCompany}
                    initialValues={dataInit?.id ? dataInit : {}}
                    submitter={{
                    submitButtonProps: {
                        icon: <CheckSquareOutlined />
                    },
                    searchConfig: {
                        resetText: "Hủy",
                        submitText: "Cập nhât"
                    }
                    }}
                >
                    <Row gutter={16}>
                    <Col span={24}>
                        <ProFormText
                        label="Tên công ty"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                        placeholder="Nhập tên công ty"
                        />
                    </Col>

                    <Col span={12}>
                        <ProFormTextArea
                        label="Địa chỉ công ty"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                        placeholder="Nhập địa chỉ công ty"
                        fieldProps={{
                            autoSize: { minRows:2 }
                        }}
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormTextArea
                        label="Website công ty"
                        name="website"
                        rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                        placeholder="Nhập website công ty"
                        fieldProps={{
                            autoSize: { minRows: 2 }
                        }}
                        />
                    </Col>
            
                    <Col span={12}>
                        <Form.Item
                        labelCol={{ span: 24 }}
                        label="Ảnh Logo"
                        name="logo"
                        rules={[
                            {
                            required: true,
                            validator: () => {
                                if (dataLogo.length > 0) return Promise.resolve();
                                return Promise.reject("Vui lòng không bỏ trống");
                            }
                            }
                        ]}
                        >
                        <ConfigProvider locale={enUS}>
                            <Upload
                            name="logo"
                            listType="picture-card"
                            className="avatar-uploader"
                            maxCount={1}
                            multiple={false}
                            customRequest={handleUploadFileLogo}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            onRemove={handleRemoveFile}
                            onPreview={handlePreview}
                            fileList={dataLogo}
                            >
                            <div>
                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                            </Upload>
                        </ConfigProvider>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ảnh giấy chứng nhận đăng ký doanh nghiệp"
                                    name="businessLicense"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng không bỏ trống',
                                        validator: () => {
                                            if (dataLogo.length > 0) return Promise.resolve();
                                            else return Promise.reject(false);
                                        }
                                    }]}
                                >
                                    <ConfigProvider locale={enUS}>
                                        <Upload
                                            name="businessLicense"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}    
                                            multiple={false}
                                            customRequest={handleUploadFileBusinessLicense}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={ handleRemoveFileBusinessLicense}
                                            onPreview={handlePreview}
                                            fileList={dataBusinessLicense}
                                        >
                                            <div>
                                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>

                            </Col>
                    
                    <ProCard
                        title="Miêu tả"
                        headStyle={{ color: "#d81921" }}
                        style={{ marginBottom: 20 }}
                        headerBordered
                        size="small"
                        bordered
                    >
                        <Col span={24}>
                        <ReactQuill theme="snow" value={value} onChange={setValue} />
                        </Col>
                    </ProCard>
                    </Row>
                </ProForm>
                <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewOpen(false)}
                        style={{ zIndex: 1500 }}
                    >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>

        } 
        </>
        

        
    )
}

export default CompanyPage;