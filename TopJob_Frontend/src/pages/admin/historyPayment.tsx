
import ModalCompany from "@/components/admin/company/modal.company";
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCompany } from "@/redux/slice/companySlide";
import { ICompany, IResPaymentDTO, ISubscribers } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { callDeleteCompany, callDeletePaymentHistory, callDeleteSubscriber, callFetchAllPaymentHistory, callFetchAllSkill, callFetchCompanyById, callsendEmailJob } from "@/config/api";
import queryString from 'query-string';
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import { fetchSubscriber } from "@/redux/slice/subscriberSlide";
import ModalSubscriber from "@/components/admin/subscriber/modal.subscriber";


const PaymentHistoryPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IResPaymentDTO | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.subscriber.isFetching);
    const meta = useAppSelector(state => state.subscriber.meta);
    const dispatch = useAppDispatch();
    const [paymentHistory, setPaymentHistory] = useState<IResPaymentDTO[]>();
    useEffect( ()=>{   
        const fetchAll=async()=>{
            const res=await callFetchAllPaymentHistory('');
            if(res.data){
                setPaymentHistory(res.data.result);
            }else{
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
        fetchAll();
    } ,[paymentHistory])
    

    const handleDeletePaymentHistory = async (id: string | undefined) => {
        if (id) {
            const res = await callDeletePaymentHistory(id);
            if (res && +res.statusCode === 200) {
                message.success('Xóa lịch sử giao dịch này thành công');
                setPaymentHistory([]);
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
   

    const columns: ProColumns<IResPaymentDTO>[] = [
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
            title: 'Nhà tuyển dụng',
            dataIndex: 'userName',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Công ty',
            dataIndex: 'companyName',
            sorter: true,
        },
        {
            title: 'Loại vip',
            dataIndex: 'typeVip',
            sorter: true,        


        },
        {
            title: 'Số tiền',
            dataIndex: 'price',
            sorter: true,        
             render(dom, entity, index, action, schema) {
                const str = "" + entity.price;
                return <>{str?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</>
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 220,
            sorter: true,        
               render(dom, entity, index, action, schema) {
                const str =entity.status==="payment success"?"chuyển khoản thành công":"chuyển khoản thất bại" ;
                return <>{str}</>
            },

        },
        {
            title: 'Ngày tạo',
            dataIndex: 'paymentAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.paymentAt ? dayjs(record.paymentAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
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
                    <Access
                        permission={ALL_PERMISSIONS.PAYMENTHISTORY.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa lịch sử giao dịch"}
                            description={"Bạn có chắc chắn muốn xóa lịch sử giao dịch này ?"}
                            onConfirm={() => handleDeletePaymentHistory(entity.id)}
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
                    <DataTable<IResPaymentDTO>
                        actionRef={tableRef}
                        headerTitle="Danh sách lịch sử giao dịch"
                        rowKey="id"
                        loading={isFetching}
                        columns={columns}
                        dataSource={paymentHistory}
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
                                showTotal: (total, range) => { return (<div style={{color:'#a7a7a7'}}>STT {range[0]} -&gt; {range[1]}</div>) }
                            }
                        }
                        rowSelection={false}
                        toolBarRender={(_action, _rows): any => {
                            return (
                                // <Access
                                //     permission={ALL_PERMISSIONS.SUBSCRIBERS.CREATE}
                                //     hideChildren
                                // >
                                //     <Button
                                //         icon={<PlusOutlined />}
                                //         type="primary"
                                //         onClick={() => setOpenModal(true)}
                                //     >
                                //         Thêm mới
                                //     </Button>
                                // </Access>
                                <></>
                            );
                        }}
                    />

                </Access>
                {/* <ModalSubscriber
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reloadTable={reloadTable}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                /> */}
            </div >
        </>
        

        
    )
}

export default PaymentHistoryPage;