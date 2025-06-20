export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IModelPaginate<T> {
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: T[]
}

export interface IAccount {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: {
            id: string;
            name: string;
            permissions: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
        company:{
            id: string;
            name: string;
        }
    }
}

export interface IGetAccount extends Omit<IAccount, "access_token"> { }

export interface ICompany {
    id?: string;
    name?: string;
    address?: string;
    logo: string;
    description?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    website?:string;
    businessLicense:string;
    start:number
}

export interface ISkill {
    id?: string;
    name?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IChangePassword {
    oldPassword:string;
    newPassword:string;
}
export interface IString {
    infor:string;
}
export interface IPayment {
    code:string;
    message:string;
    paymentUrl:string;
}
export interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    age: number;
    gender: string;
    address: string;
    education: string;
    experience: string;
    phone: string;
    role?: {
        id: string;
        name: string;
    }

    company?: {
        id: string;
        name: string;
    }
    cv:string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    typeVip:string;
    vipExpiry:string;
    //avatar:string
    active:boolean;
}


export interface IJob {
    id?: string;
    name: string;
    skills: ISkill[];
    company?: {
        id: string;
        name: string;
        logo?: string;
    }
    location: string;
    salary: number;
    quantity: number;
    level: string;
    description: string;
    startDate: Date;
    endDate: Date;
    active: boolean;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    jobEnvironment:string;
    experienceRequirement?:string;
}

export interface IResume {
    id?: string;
    email: string;
    userId: string;
    url: string;
    status: string;
    company: string | {
        id: string;
        name: string;
        logo: string;
    };
    job: string | {
        id: string;
        name: string;
    };
    history?: {
        status: string;
        updatedAt: Date;
        updatedBy: { id: string; email: string }
    }[]
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPermission {
    id?: string;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

}
export interface IBlog {
    id?: string;
    title?: string;
    likeCount?:int ;
    content?: string;
    thumbnail?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    updatedBy?: string;
    user?: {
        id: string;
        name: string;
    }
}

export interface IRole {
    id?: string;
    name: string;
    description: string;
    active: boolean;
    permissions: IPermission[] | string[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISubscribers {
    id?: string;
    name?: string;
    email?: string;
    skills: string[];
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}
export interface IUserRegister {
    name: string;
    email: string;
    password?: string;
    age: number;
    gender: string;
    address: string;
    companyName: string;
    companyAddress: string;
    phone: string;
    roleId:int;
    businessLicense:string;
}
export interface IRecommendation {
    id?: string;
    user:{
        id: string;
        name:string;
        email: string;
    } 
    job:IJob ,
    matchScore:number;
    createdAt?:string
}
export interface ITalentCandidate {
    id?: string;
    user:IUser,
    company:ICompany,
    compatibilityScore:number;
    
    skills:ISkill[];
    multiplierSkills:number;

    address:string;
    multiplierAddress;

    education:string;
    multiplierEducation:number;

    age:string;
    multiplierAge:number;

    experience:string;
    multiplierExperience:number;

    activity:boolean;
    multiplierActivity:number;

    gender:string;
    multiplierGender:number;
}
export interface IResPaymentDTO {
    id:string;
    paymentAt: string;
    userName:string;
    typeVip:string;
    status:string;
    companyName:string;
    price: number;
}
export interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
  blog: { id:string; title:string};
  likeCount: number;
  replies: CommentItem[]; // Danh sách phản hồi
}