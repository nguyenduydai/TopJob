import ModalBlog from "@/components/admin/blog/modal.blog";
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBlog } from "@/redux/slice/blogSlide";
import { IBlog } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { callDeleteBlog, callFetchBlogById } from "@/config/api";
import queryString from 'query-string';
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";

const BlogPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IBlog | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.blog.isFetching);
    const meta = useAppSelector(state => state.blog.meta);
    const blogs = useAppSelector(state => state.blog.result);
    const dispatch = useAppDispatch();
    
    const handleDeleteBlog = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteBlog(id);
            if (res && +res.statusCode === 200) {
                message.success('Xóa Blog thành công');
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

    const columns: ProColumns<IBlog>[] = [
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
            title: 'Tiêu đề',
            dataIndex: 'title',
            sorter: true,
        },
        {
            title: 'Lượt thích',
            dataIndex: 'likeCount',
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
                        permission={ALL_PERMISSIONS.BLOGS.UPDATE}
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
                        permission={ALL_PERMISSIONS.BLOGS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa blog"}
                            description={"Bạn có chắc chắn muốn xóa blog này ?"}
                            onConfirm={() => handleDeleteBlog(entity.id)}
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



        if (clone.title) q.filter = `${sfLike("title", clone.title)}`;
        if (clone.likeCount) {
            q.filter = clone.name ?
                q.filter + " and " + `${sfLike("likeCount", clone.likeCount)}`
                : `${sfLike("likeCount", clone.likeCount)}`;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.title) {
            sortBy = sort.title === 'ascend' ? "sort=title,asc" : "sort=title,desc";
        }
        if (sort && sort.likeCount) {
            sortBy = sort.likeCount === 'ascend' ? "sort=likeCount,asc" : "sort=likeCount,desc";
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
                    permission={ALL_PERMISSIONS.BLOGS.GET_PAGINATE}
                >
                    <DataTable<IBlog>
                        actionRef={tableRef}
                        headerTitle="Danh sách tin tức"
                        rowKey="id"
                        loading={isFetching}
                        columns={columns}
                        dataSource={blogs}
                        request={async (params, sort, filter): Promise<any> => {
                            const query = buildQuery(params, sort, filter);
                            dispatch(fetchBlog({ query }))
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
                                    permission={ALL_PERMISSIONS.BLOGS.CREATE}
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
                <ModalBlog
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

export default BlogPage;