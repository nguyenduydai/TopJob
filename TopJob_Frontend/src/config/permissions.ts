export const ALL_PERMISSIONS = {
    COMPANIES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/companies', module: "COMPANIES" },
        CREATE: { method: "POST", apiPath: '/api/v1/companies', module: "COMPANIES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/companies', module: "COMPANIES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/companies/{id}', module: "COMPANIES" },
    },
    JOBS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/jobs', module: "JOBS" },
        GET_PAGINATE_ADMIN: { method: "GET", apiPath: '/api/v1/jobsadmin', module: "JOBS" },
        CREATE: { method: "POST", apiPath: '/api/v1/jobs', module: "JOBS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/jobs', module: "JOBS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/jobs/{id}', module: "JOBS" },
    },
    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/{id}', module: "PERMISSIONS" },
    },
    RESUMES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/resumes', module: "RESUMES" },
        CREATE: { method: "POST", apiPath: '/api/v1/resumes', module: "RESUMES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/resumes', module: "RESUMES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/resumes/{id}', module: "RESUMES" },
    },
    ROLES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
        CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/roles', module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles/{id}', module: "ROLES" },
    },
    USERS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/users', module: "USERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/users/{id}', module: "USERS" },
        GET_BYID: { method: "GET", apiPath: '/api/v1/users/{id}', module: "USERS" },
    },
    BLOGS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/blogs', module: "BLOGS" },
        CREATE: { method: "POST", apiPath: '/api/v1/blogs', module: "BLOGS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/blogs', module: "BLOGS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/blogs/{id}', module: "BLOGS" },
    }, 
    SUBSCRIBERS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/subscribers', module: "SUBSCRIBERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/subscribers', module: "SUBSCRIBERS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/subscribers', module: "SUBSCRIBERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/subscribers/{id}', module: "SUBSCRIBERS" },
    },
    TALENTCANDIDATE: {
        GET_PAGINATE_FOR_JOB: { method: "GET", apiPath: '/api/v1/talentcandidate/{id}', module: "TALENTCANDIDATE" },
        CREATE_FOR_JOB: { method: "POST", apiPath: '/api/v1/talentcandidate/{id}', module: "TALENTCANDIDATE" },
        GET_PAGINATE_FOR_COMPANY: { method: "GET", apiPath: '/api/v1/talentcandidate', module: "TALENTCANDIDATE" },
        CREATE_FOR_COMPANY: { method: "POST", apiPath: '/api/v1/talentcandidate', module: "TALENTCANDIDATE" },
    },
    PAYMENTHISTORY: {
        GET_PAGINATE_PAYMENTHISTORY: { method: "GET", apiPath: '/api/v1/payment-history', module: "PAYMENTHISTORY" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/payment-history/{id}', module: "PAYMENTHISTORY" },
        GET_PAYMENTHISTORY_BYID: { method: "GET", apiPath: '/api/v1/payment-history/{id}', module: "PAYMENTHISTORY" }
    },
}

export const ALL_MODULES = {
    COMPANIES: 'COMPANIES',
    FILES: 'FILES',
    JOBS: 'JOBS',
    PERMISSIONS: 'PERMISSIONS',
    RESUMES: 'RESUMES',
    ROLES: 'ROLES',
    USERS: 'USERS',
    SUBSCRIBERS: 'SUBSCRIBERS',
    BLOGS:'BLOGS',
    TALENTCANDIDATE:'TALENTCANDIDATE',
    PAYMENTHISTORY:'PAYMENTHISTORY'
}
