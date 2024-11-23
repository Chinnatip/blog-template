import { create } from 'zustand';
import { produce } from "immer"
import { api } from '@/lib/api'

// import toast from 'react-hot-toast';

interface Post {
    id: number;
    title: string;
    content: string;
}
  
interface PostState {
    posts: Post[];
    addPost: (post: Post) => void;
    fetchPosts: () => void;
}

interface User {
    id: number;
    name: string;
    email: string
}

interface AuthState {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<string | undefined>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    getUser: (token: string) => Promise<User | undefined>;
    setUser: ( user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setUser: (user: User) => {
        set(produce((state: AuthState) => {
            state.user = user
        }))
    },
    getUser: async (token: string) => {
        const meResponse = await api.get('/auth/me',{ headers: { Authorization: `Bearer ${token}` }},)
        const { user } = meResponse.data
        return user
    },
    login: async (email, password) => {
        const loginResponse = await api.post('/auth/login', { email, password });
        const { token } = loginResponse.data
        const meResponse = await api.get('/auth/me',{ headers: { Authorization: `Bearer ${token}` }},)
        const { user } = meResponse.data
        set(produce((state: AuthState) => { 
            state.user = user,
            state.token = token
        }))
        if(typeof token == 'string'){
            localStorage.setItem('doppio_u_token', token)
        }
        return token
    },
    register: async (name, email, password) => {
      await api.post('/auth/register', { name, email, password });
    },
    logout: () => {
        localStorage.removeItem('doppio_u_token')
        set(produce((state: AuthState) => {
            state.user = null
            state.token = null
        }))
    }
}));

export const useStore = create<PostState>((set) => ({
    posts: [],
    fetchPosts: async () => {
        const response = await api.get('/posts');
        set(produce((state: PostState) => { 
            state.posts = response.data
        }))
    },
    addPost: (post: Post) => 
        set(produce((state: PostState) => { 
            state.posts.push(post) 
        })
    ),
}))