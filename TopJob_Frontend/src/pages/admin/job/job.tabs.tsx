import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import JobPage from './job';
import SkillPage from './skill';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permissions';
import { useAppSelector } from '@/redux/hooks';

const JobTabs = () => {
    const onChange = (key: string) => {
        // console.log(key);
    };
    const user = useAppSelector(state => state.account.user);
    
    const items: TabsProps['items'] = user.role.id=="1"?  
    [
       {
            key: '1',
            label: 'Quản lý công việc',
            children: <JobPage />,
        },
        
        {
            key: '2',
            label: 'Quản lý kỹ năng',
            children: <SkillPage />,
        },

    ]  :
    [
        {
            key: '1',
            label: 'Quản lý công việc',
            children: <JobPage />,
        }

    ];
    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE_ADMIN}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={onChange}
                />
            </Access>
        </div>
    );
}

export default JobTabs;