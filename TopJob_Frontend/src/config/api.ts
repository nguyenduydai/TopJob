import { IBackendRes, ICompany, IAccount, IUser, IModelPaginate, IGetAccount, IJob, IResume, IPermission, IRole, ISkill, ISubscribers, IChangePassword, IString, IBlog, IRecommendation, ITalentCandidate, IPayment, IResPaymentDTO, CommentItem } from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
// export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string) => {
//     return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address })
// }
export const callRegister = (name: string,phone:string, email: string, password: string|undefined, companyName: string|null,companyAddress:string,roleId:number, age: number, gender: string|null, address: string,typeVip:string|null,businessLicense:string|null,active:boolean) => {
    //return axios.post<IBackendRes<string>>('/api/v1/auth/register', { name,phone, email, password, companyName, companyAddress, roleId,age,gender,address })
    try {
        const res = axios.post<IBackendRes<string>>('/api/v1/auth/register', { name,phone, email, password, companyName, companyAddress, roleId,age,gender,address,typeVip,businessLicense });
        return res;
    } catch (error: any) {
        // Luôn trả về format tương tự res
        return error.response?.data || { statusCode: 500, message: "Unknown error" };
    }
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}




/**
 * 
Module Company
 */
export const callCreateCompany = (name: string, address: string,website:string, description: string, logo: string|null,businessLicense:string|null) => {
    return axios.post<IBackendRes<ICompany>>('/api/v1/companies', { name, address,website, description, logo,businessLicense })
}

export const callUpdateCompany = (id: string, name: string, address: string,website:string, description: string, logo: string|null,businessLicense:string|null) => {
    return axios.put<IBackendRes<ICompany>>(`/api/v1/companies`, { id, name, address,website, description, logo ,businessLicense})
}

export const callDeleteCompany = (id: string) => {
    return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}

export const callFetchCompany = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICompany>>>(`/api/v1/companies?${query}`);
}

export const callFetchCompanyById = (id: string) => {
    return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}

/**
 * 
Module Skill
 */
export const callCreateSkill = (name: string) => {
    return axios.post<IBackendRes<ISkill>>('/api/v1/skills', { name })
}

export const callUpdateSkill = (id: string, name: string) => {
    return axios.put<IBackendRes<ISkill>>(`/api/v1/skills`, { id, name })
}

export const callDeleteSkill = (id: string) => {
    return axios.delete<IBackendRes<ISkill>>(`/api/v1/skills/${id}`);
}

export const callFetchAllSkill = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISkill>>>(`/api/v1/skills?${query}`);
}



/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callUpdateUser = (user: IUser) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}
export const callUserById = (id: string) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}
export const callChangePasswordUser = (password: IChangePassword) => {
    return axios.put<IBackendRes<IString>>(`/api/v1/users/changepassword`, { ...password })
}
/**
 * 
Module Job
 */
export const callCreateJob = (job: IJob) => {
    return axios.post<IBackendRes<IJob>>('/api/v1/jobs', { ...job })
}

export const callUpdateJob = (job: IJob, id: string) => {
    return axios.put<IBackendRes<IJob>>(`/api/v1/jobs`, { id, ...job })
}

export const callDeleteJob = (id: string) => {
    return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

export const callFetchJob = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`);
}

export const callFetchJobById = (id: string) => {
    return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}
export const callFetchJobAdmin = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs/jobsadmin?${query}`);
}
export const callFetchJobByCompany = (companyId:string,query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs/jobsbycompany/${companyId}?${query}`);
}

/**
 * 
Module Resume
 */
export const callCreateResume = (url: string, jobId: any, email: string, userId: string | number) => {
    return axios.post<IBackendRes<IResume>>('/api/v1/resumes', {
        email, url,
        status: "PENDING",
        user: {
            "id": userId
        },
        job: {
            "id": jobId
        }
    })
}

export const callUpdateResumeStatus = (id: any, status: string) => {
    return axios.put<IBackendRes<IResume>>(`/api/v1/resumes`, { id, status })
}

export const callDeleteResume = (id: string) => {
    return axios.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResume = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes?${query}`);
}

export const callFetchResumeById = (id: string) => {
    return axios.get<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResumeByUser = () => {
    return axios.post<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes/by-user`);
}
export const callFetchResumeByJob = (query: string,id: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes/by-job/${id}?${query}`);
}

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.put<IBackendRes<IPermission>>(`/api/v1/permissions`, { id, ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles`, { id, ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

/**
 * 
Module Subscribers
 */
export const callCreateSubscriber = (subs: ISubscribers) => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers', { ...subs })
}

export const callGetSubscriberSkills = () => {
    return axios.get<IBackendRes<ISubscribers>>('/api/v1/subscribers/by-user')
}

export const callUpdateSubscriber = (subs: ISubscribers) => {
    return axios.put<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, { ...subs })
}

export const callDeleteSubscriber = (id: string) => {
    return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

export const callFetchSubscriber = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(`/api/v1/subscribers?${query}`);
}

export const callFetchSubscriberById = (id: string) => {
    return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

/**
 * 
Module Blogs
 */

export const callCreateBlog =(title: string, likeCount: number, content: string, thumbnail: string|null)  => {
    return axios.post<IBackendRes<IBlog>>('/api/v1/blogs',{ title, likeCount, content, thumbnail })
}


export const callUpdateBlog  = (id: string, title: string, likeCount: number, content: string, thumbnail: string|null)  => {
    return axios.put<IBackendRes<IBlog>>(`/api/v1/blogs`, { id,title, likeCount, content, thumbnail })
}
export const callUpdateLikeBlog  = (id: string|undefined, likeCount: number)  => {
    return axios.put<IBackendRes<IBlog>>(`/api/v1/blogs`, { id, likeCount})
}


export const callDeleteBlog  = (id: string) => {
    return axios.delete<IBackendRes<IBlog>>(`/api/v1/blogs/${id}`);
}

export const callFetchAllBlog  = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IBlog>>>(`/api/v1/blogs?${query}`);
}

export const callFetchBlogById = (id: string) => {
    return axios.get<IBackendRes<IBlog>>(`/api/v1/blogs/${id}`);
}

/**
 * 
Module Email
 */

export const callsendEmailJob =()  => {
    return axios.get<IBackendRes<IString>>('/api/v1/email/job');
}
export const callsendEmailResume =(id: string)  => {
    return axios.get<IBackendRes<IString>>(`/api/v1/email/resume/${id}`);
}
export const callSendEmailTalentCandidate=(id: string|number)  => {
    return axios.get<IBackendRes<IString>>(`/api/v1/email/talent/${id}`);
}
/**
 * 
Module Job Recommendation
 */
export const callCreateJobRecommendation =(skills:ISkill[],location: string,salary: number, quality: boolean, level:string,
    jobEnvironment: string,educationRequirement: string, experienceRequirement:string,ageRequirement: number)  => {
    return axios.post<IBackendRes<IString>>('/api/v1/jobrecommendation',{skills,location,salary,quality,level,jobEnvironment,educationRequirement,experienceRequirement,ageRequirement});
}
export const callFetchJobRecommendation =(query: string)  => {
    return axios.get<IBackendRes<IModelPaginate<IRecommendation>>>(`/api/v1/jobrecommendation?${query}`);
}

/**
 * 
Module Talent Candidate
 */
export const callCreateTalentCandidateForJob =(id:string|null)  => {
    return axios.post<IBackendRes<IString>>(`/api/v1/talentcandidate/${id}`);
}
export const callFetchTalentCandidateForJob =(id:string|null,query: string)  => {
    return axios.get<IBackendRes<IModelPaginate<ITalentCandidate>>>(`/api/v1/talentcandidate/${id}?${query}`);
}

interface IReqCandidate {
    address:string;
    skills:ISkill[];
    education: string;
    age: string;
    experience:string;
    activity:boolean;
    gender:string;
    multiplierSkills:number;
    multiplierAddress:number;
    multiplierEducation:number;
    multiplierAge:number;
    multiplierExperience:number;
    multiplierActivity:number;
multiplierGender:number;
}
export const callCreateTalentCandidateForCompany =(req : IReqCandidate)  => {
    return axios.post<IBackendRes<IString>>('/api/v1/talentcandidate',{...req});
}
export const callFetchTalentCandidateForCompany =(query: string)  => {
    return axios.get<IBackendRes<IModelPaginate<ITalentCandidate>>>(`/api/v1/talentcandidate?${query}`);
}
/**
 * 
Module Payment
 */
export const callPaymentCreate =(query: string)  => {
    return axios.get<IBackendRes<IPayment>>(`/api/v1/payments/create?${query}`);
}
export const callPaymentReturn =(query: string)  => {
    return axios.get<IBackendRes<IPayment>>(`/api/v1/payments/return?${query}`);
}
/**
 * 
Module Payment History
 */
export const callDeletePaymentHistory  = (id: string) => {
    return axios.delete<IBackendRes<IString>>(`/api/v1/payment-history/${id}`);
}

export const callFetchAllPaymentHistory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResPaymentDTO>>>(`/api/v1/payment-history?${query}`);
}

export const callFetchPaymentHistoryById = (id: string) => {
    return axios.get<IBackendRes<IResPaymentDTO>>(`/api/v1/payment-history/${id}`);
}
/**
 * 
Module login social 
 */
export interface IFacebookLoginResponse {
    authorizationUrl: string;
  }
export const callLoginFacebook = () => {
    return axios.get<IBackendRes<IFacebookLoginResponse>>('/api/v1/auth/login/facebook')
}
export const callLoginFacebookCallBack = (code:string) => {
    return axios.get<IBackendRes<IAccount>>(`/api/v1/login/oauth2/facebook?code=${code}`)
}

/**
 * 
Module export file pdf 
 */
// export const callExportJobReport = () => {
//     return axios.get<>('/api/v1/reports/jobs')
// }
interface IDataItemJob {
    month: string;
    applicationCount: number;
}
interface IDataItemJobResume {
    withApplications: number;
    withoutApplications: number;
    total:number
} 
export const callFetchjobpermonth = () => {
    return axios.get<IBackendRes<Array<IDataItemJob>>>('/api/v1/jobs/jobpermonth')
}
export const callFetchjobpermonthForHr = () => {
    return axios.get<IBackendRes<Array<IDataItemJob>>>('/api/v1/jobs/jobpermonthforhr')
}
export const callFetchJobHaveResumeForHr = () => {
    return axios.get<IBackendRes<IDataItemJobResume>>('/api/v1/jobs/jobhaveresumeforhr')
}
interface IDataItemCompany {
    companyName: string;
    jobCount: number;
}

export const callFetchTopCompanyByJob = () => {
    return axios.get<IBackendRes<Array<IDataItemCompany>>>('/api/v1/companies/topcompaniesbyjobs')
}

/**
 * 
Module comment
 */
export const callCreateComment = (blogId:string|null,userId:string|null,content:string,parentId:string|null) => {
    return axios.post<IBackendRes<CommentItem>>('/api/v1/comments',{blogId,userId,content,parentId});
}
export const callFetchCommentsByBlog = (blogId:string|null) => {
    return axios.get<IBackendRes<CommentItem[]>>(`/api/v1/comments/blog/${blogId}`);
}
export const callUpdateLikeComment = (commentId:string|null) => {
    return axios.put<IBackendRes<CommentItem>>(`/api/v1/comments/like/${commentId}`);
}