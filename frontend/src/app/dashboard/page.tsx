import { redirect } from 'next/navigation';

const DashboardPage = () => {
  redirect('/dashboard/posts');
};

export default DashboardPage;
