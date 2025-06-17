import { Input, Button, List, message, Tooltip, notification } from 'antd';
// import { Comment } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CommentItem } from '@/types/backend';
import { useAppSelector } from '@/redux/hooks';
import { callCreateComment, callFetchCommentsByBlog, callUpdateLikeComment } from '@/config/api';
const { Text } = Typography;

import {  Space ,Avatar, Typography } from "antd";

import { MessageOutlined } from "@ant-design/icons";
import avatarUser from '../../assets/User_Avatar.png'
const { TextArea } = Input;
interface IProps {
    blogId:string|null;
}
const CommentSection = (props:IProps) => {
  const { blogId = null } = props;

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const user = useAppSelector(state => state.account.user);
      
  const fetchComments = async () => {
        const res = await callFetchCommentsByBlog(blogId);
        if(res.data)
            setComments(res.data);
  };
  useEffect(() => {
    fetchComments();
  }, [blogId]);
  
    console.log(comments);

  const handleSubmit = async () => {
    if (!content.trim()) 
        notification.error({
                        message: 'Có lỗi xảy ra',
                        description: 'Nội dung không được để trống'
                    }); 
    setLoading(true);
    const res=await callCreateComment(blogId,user.id,content, null) ;

    if(res.data){
        message.success('Đăng bình luận thành công');
        setContent('');
        fetchComments();
    }else{
         notification.error({
                        message: 'Có lỗi xảy ra',
                        description:res.message ? res.message :'Bạn hãy đăng nhập để có thể bình luận bài viết'
                    }); 
    }
      setLoading(false);
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) 
        notification.error({
                        message: 'Có lỗi xảy ra',
                        description: 'Nội dung phản hồi không được để trống'
                    }); 
    setLoading(true);
    const res=await callCreateComment(blogId,user.id,replyContent, parentId) ;

    if(res.data){
        message.success('Đăng bình luận thành công');
        setReplyContent('');
        setReplyTo(null);
        fetchComments();
    }else{
         notification.error({
                        message: 'Có lỗi xảy ra',
                        description:res.message
                    }); 
    }
    setLoading(false);
  };

  const handleLike = async (commentId: string) => {
    const res=await callUpdateLikeComment(commentId) ;
    if(res.data){
        message.success('Thích bình luận thành công');
        setReplyContent('');
        setReplyTo(null);
        fetchComments();
    }else{
         notification.error({
                        message: 'Có lỗi xảy ra',
                        description:res.message
                    }); 
    }
  };

const renderCommentItem = (comment: CommentItem) => (
  <div key={comment.id}>
    <CommentItemUI
      author={comment.user.name}
      content={comment.content}
      likeCount={comment.likeCount}
      datetime={<Tooltip title={comment.createdAt}>{new Date(comment.createdAt).toLocaleString()}</Tooltip>}
      onLike={() => handleLike(comment.id)}
      onReply={() => setReplyTo(comment.id)}
    />

    {/* Nếu người dùng đang reply vào comment này */}
    {replyTo === comment.id && (
      <div style={{ marginLeft: 48, marginBottom: 16 }}>
        <TextArea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          rows={2}
          placeholder="Nhập phản hồi..."
        />
        <Button onClick={() => handleReply(comment.id)} type="primary" size="small" style={{ marginTop: 8 }}>
          Gửi phản hồi
        </Button>
      </div>
    )}

    {/* Hiển thị phản hồi con */}
    {comment.replies?.map((reply) => (
      <div style={{ marginLeft: 32 }}>
        {renderCommentItem(reply)}
      </div>
    ))}
  </div>
);


  return (
    <div >
      <div style={{marginBottom:15,fontSize:20,fontWeight:700}}>Bình luận</div>
      {comments.length!==0?
      <List
        //header="Bình luận"
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={renderCommentItem}
      />
      :
      <></>
      }
      <TextArea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nhập bình luận..."
      />
      <Button
        loading={loading}
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: 8 }}
      >
        Gửi bình luận
      </Button>
    </div>
  );
};

export default CommentSection;



const CommentItemUI = ({
  author,
  content,
  likeCount,
  datetime,
  onLike,
  onReply,
}: {
  author: string;
  content: string;
  likeCount:number;
  datetime: React.ReactNode;
  onLike?: () => void;
  onReply?: () => void;
}) => {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      <Avatar src={avatarUser} />
      <div>
        <Text strong>{author}</Text>
        <div>{content}</div>
        <Space style={{ marginTop: 4 }}>
          <Button type="text" size="small" icon={<LikeOutlined />} onClick={onLike}>
            {likeCount} Thích
          </Button>
          <Button type="text" size="small" icon={<MessageOutlined />} onClick={onReply}>
            Phản hồi
          </Button>
          <Text type="secondary" style={{ fontSize: 12 }}>{datetime}</Text>
        </Space>
      </div>
    </div>
  );
};

