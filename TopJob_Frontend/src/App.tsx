import { useEffect, useRef, useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import NotFound from 'components/share/not.found';
import Loading from 'components/share/loading';
import {  LoginPage } from 'pages/auth/login';
import RegisterPage from 'pages/auth/register';
import LayoutAdmin from 'components/admin/layout.admin';
import ProtectedRoute from 'components/share/protected-route.ts';
import Header from 'components/client/header.client';
import Footer from 'components/client/footer.client';
import HomePage from 'pages/home';
import styles from 'styles/app.module.scss';
import DashboardPage from './pages/admin/dashboard';
import CompanyPage from './pages/admin/company';
import PermissionPage from './pages/admin/permission';
import ResumePage from './pages/admin/resume';
import RolePage from './pages/admin/role';
import UserPage from './pages/admin/user';
import { fetchAccount } from './redux/slice/accountSlide';
import LayoutApp from './components/share/layout.app';
import ViewUpsertJob from './components/admin/job/upsert.job';
import ClientJobPage from './pages/job';
import ClientJobDetailPage from './pages/job/detail';
import ClientCompanyPage from './pages/company';
import ClientCompanyDetailPage from './pages/company/detail';
import JobTabs from './pages/admin/job/job.tabs';
import ClientBlogPage from './pages/blog';
import ClientRecommendPage from './pages/recommend';
import BlogPage from './pages/admin/blog';
import SubscriberPage from './pages/admin/subscriber';
import TalentCandidatePage from './pages/admin/talentcandidate';
import FooterComponent from 'components/client/footer.client';
import ClientBlogDetailPage from './pages/blog/detail';
import RegisterHrPage from './pages/auth/register.hr';
import TalentCandidateForJob from './components/admin/talentcandidate/talentCandidateForJob';
import AccountupgradePage from './pages/admin/accountupgrade';
import OAuth2RedirectHandler from './pages/auth/logincallback';
import HistoryPayment from './pages/admin/historyPayment';

const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [location]);

  return (
    <div className='layout-app' ref={rootRef}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles['content-app']}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <FooterComponent />
    </div>
  )
}

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);


  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount())
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: (<LayoutApp><LayoutClient /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "job", element: <ClientJobPage /> },
        { path: "job/:id", element: <ClientJobDetailPage /> },
        { path: "company", element: <ClientCompanyPage /> },
        { path: "company/:id", element: <ClientCompanyDetailPage /> },
        { path: "blog", element: <ClientBlogPage /> },
        { path: "blog/:id", element: <ClientBlogDetailPage /> },
        { path: "recommend", element: <ClientRecommendPage /> }
      ],
    },

    {
      path: "/admin",
      element: (<LayoutApp><LayoutAdmin /> </LayoutApp>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
        },
        {
          path: "company",
          element:
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
        },

        {
          path: "job",
          children: [
            {
              index: true,
              element: <ProtectedRoute><JobTabs /></ProtectedRoute>
            },
            {
              path: "upsert", element:
                <ProtectedRoute><ViewUpsertJob /></ProtectedRoute>
            }
          ]
        },
        {
          path: "resume",
          children: [
            {
              index: true,
              element: <ProtectedRoute> <ResumePage /></ProtectedRoute>
            },
            {
              path: "by-job",
              element:<ProtectedRoute><ResumePage /></ProtectedRoute>
            }
          ]
        },
        {
          path: "permission",
          element:
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
        },
        {
          path: "role",
          element:
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
        },
        {
          path: "blog",
          element:
            <ProtectedRoute>
              <BlogPage />
            </ProtectedRoute>
        },
        {
          path: "subscriber",
          element:
            <ProtectedRoute>
              <SubscriberPage />
            </ProtectedRoute>
        },
        {
          path: "talentcandidate",
          children: [
            {
              index: true,
              element: <ProtectedRoute><TalentCandidatePage/></ProtectedRoute>
            },
            {
              path: "forjob",
              element:<ProtectedRoute><TalentCandidateForJob /></ProtectedRoute>
            }
          ]
         
        },
        {
          path: "historypayment",
          element:
            <ProtectedRoute>
              <HistoryPayment />
            </ProtectedRoute>
        },
        {
          path: "accountupgrade",
          element:
            <ProtectedRoute>
              <AccountupgradePage />
            </ProtectedRoute>
        },
        
      ],
    },


    {
      path: "/login",
      element: <LoginPage />,
    },
    // {
    //   path: "/login/oauth2/facebook",
    //   element: <FacebookCallbackRoute />,
    // },
    {
      path: "/oauth2/redirect",
      element:<OAuth2RedirectHandler />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/registerhr",
      element: <RegisterHrPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}