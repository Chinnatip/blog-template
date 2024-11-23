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

interface AuthState {
    user: { id: number; name: string; email: string } | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data
        set(produce((state: AuthState) => { 
            state.user = user,
            state.token = token
        }))
    },
    register: async (name, email, password) => {
      await api.post('/auth/register', { name, email, password });
    },
    logout: () => {
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