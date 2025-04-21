import ModalCompany from "@/components/admin/company/modal.company";
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCompany } from "@/redux/slice/companySlide";
import { ICompany, ISubscribers } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { callDeleteCompany, callDeleteSubscriber, callFetchAllSkill, callFetchCompanyById, callsendEmailJob } from "@/config/api";
import queryString from 'query-string';
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import { fetchSubscriber } from "@/redux/slice/subscriberSlide";
import ModalSubscriber from "@/components/admin/subscriber/modal.subscriber";


const SubscriberPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ISubscribers | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.subscriber.isFetching);
    const meta = useAppSelector(state => state.subscriber.meta);
    const Subscribers = useAppSelector(state => state.subscriber.result);
    const dispatch = useAppDispatch();

    

    const handleDeleteSubscriber = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteSubscriber(id);
            if (res && +res.statusCode === 200) {
                message.success('Xóa Subscriber thành công');
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
    const handleSendEmail=async()=>{
        const res = await callsendEmailJob();
                    if (+res.statusCode===200) {
                        message.success('Gửi email đến ứng viên thành công');
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                    });
        }

    }

    const columns: ProColumns<ISubscribers>[] = [
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
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Số kỹ năng',
            dataIndex: 'skills',
            sorter: true,
            render: (text, record) => {
                return (
                    <>
                        {record.skills.length}
                    </>
                );
            },
            hideInSearch: true,

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
                        permission={ALL_PERMISSIONS.SUBSCRIBERS.UPDATE}
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
                        permission={ALL_PERMISSIONS.SUBSCRIBERS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa Subscriber"}
                            description={"Bạn có chắc chắn muốn xóa Subscriber này ?"}
                            onConfirm={() => handleDeleteSubscriber(entity.id)}
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
        if (clone.email) {
            q.filter = clone.name ?
                q.filter + " and " + `${sfLike("email", clone.email)}`
                : `${sfLike("email", clone.email)}`;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.email) {
            sortBy = sort.email === 'ascend' ? "sort=email,asc" : "sort=email,desc";
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

    return (
        <>
            <div>
                <Access
                    permission={ALL_PERMISSIONS.SUBSCRIBERS.GET_PAGINATE}
                >
                    <DataTable<ISubscribers>
                        actionRef={tableRef}
                        headerTitle="Danh sách ứng viên đăng ký nhận công việc theo kỹ năng"
                        rowKey="id"
                        loading={isFetching}
                        columns={columns}
                        dataSource={Subscribers}
                        request={async (params, sort, filter): Promise<any> => {
                            const query = buildQuery(params, sort, filter);
                            dispatch(fetchSubscriber({ query }))
                        }}
                        scroll={{ x: true }}
                        pagination={
                            {
                                current: meta.page,
                                pageSize: meta.pageSize,
                                showSizeChanger: true,
                                total: meta.total,
                                showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                            }
                        }
                        rowSelection={false}
                        toolBarRender={(_action, _rows): any => {
                            return (
                                <Access
                                    permission={ALL_PERMISSIONS.SUBSCRIBERS.CREATE}
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
                    <Button style={{marginTop:30}} type="primary" onClick={()=>handleSendEmail()}>Gửi email đến ứng viên</Button>
                </Access>
                <ModalSubscriber
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reloadTable={reloadTable}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />
            </div >
        </>
        

        
    )
}

export default SubscriberPage;