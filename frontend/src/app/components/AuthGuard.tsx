// components/withAuth.tsx
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuthGuard = (WrappedComponent: any) => {
  return (props: any) => {
    const { getUser, setToken } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('doppio_u_token')
      if(token == null){
        router.replace('/auth/login');
      }else{
        getUser(token).then(user => {
            if(user != undefined){
              setToken(token)
              return null
            }else{
              localStorage.removeItem('doppio_u_token')
              router.replace('/auth/login');
            }
        }).catch(error => {
          console.log(error)
          localStorage.removeItem('doppio_u_token')
          router.replace('/auth/login');
        })
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuthGuard;
