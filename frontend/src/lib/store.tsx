import { create } from 'zustand';
import { produce } from "immer"
import { api } from '@/lib/api'

import { Parameters, ParametersKey } from '../interface/model'
import toast from 'react-hot-toast';
import axios from 'axios'


interface Post {
    id: number;
    title: string;
    content: string;
}
  
interface State {
    posts: Post[];
    addPost: (post: Post) => void;
    fetchPosts: () => void;
}

export const useStore = create<State>((set, get) => ({
    posts: [],
    fetchPosts: async () => {
        const response = await api.get('/posts');
        set(produce((state: State) => { 
            state.posts = response.data
        }))
    },

    addPost: (post: Post) => 
        set(produce((state: State) => { 
            state.posts.push(post) 
        })
    ),
}))