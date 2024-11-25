import { create } from 'zustand';
import { produce } from "immer"
import { api, iapi } from '@/lib/api'

// import toast from 'react-hot-toast';

export interface Post {
    id: number;
    title: string;
    content: string;
    contentCount?: number;
    date: Date;
    image?: string;
    published: boolean;
    author: string
}

export interface PageInfo {
    totalPosts: number
    totalPages: number
    currentPage: number
}
  
export interface PostCreate {
    title: string;
    content: string;
    authorId: number
    image?: string
}

export interface PostEdit {
    title: string;
    content: string;
    published: boolean
    image?: string
}

export interface User {
    id: number;
    name: string;
    email: string;
    adminRole: boolean
    date: Date
}

export interface UserInfo {
    totalUsers: number
    totalPages: number
    currentPage: number
}

export interface UserCreate {
    name: string
    email: string
    password: string
    adminRole: boolean
}

export interface UserEdit {
    name: string
    email: string
    adminRole: boolean
}

export interface MenuState {
    menubar: boolean;
    toggleMenu: () => void;
}

export interface PostState {
    posts: Post[];
    pageInfo?: PageInfo | undefined;
    createPost: (post: PostCreate) => void;
    deletePost: (id: number) => void;
    updatePost: (id: number, post: PostEdit) => void;
    fetchPostById: (id: number) =>  Promise<Post> ;
    fetchPublishPosts: () => void;
    fetchPosts: ({ page, user_id }: { page?: number, user_id?: number }) => void;
    togglePublish: (id: number, currentStatus: boolean) => void;
    uploadImage:(file: File) => Promise<string | undefined>
}

export interface UserState {
    users: User[];
    userInfo?: UserInfo | undefined;
    createUser: (user: UserCreate, token: string) => void;
    deleteUser: (id: number, token: string) => void;
    updateUser: (id: number, post: UserEdit, token: string) => void;
    fetchUserById: (id: number, token: string) =>  Promise<User> ;
    toggleAdmin: (id: number, currentStatus: boolean, token: string) => void;
    fetchUsers: ({ page, token }: { page?: number, token: string }) => void;
}

interface AuthState {
    user: User | null;
    token: string | null;
    login: (email: string, password: string, router: any) => Promise<string | undefined>;
    register: (name: string, email: string, password: string, router: any) => Promise<void>;
    logout: (router: any) => void;
    getUser: (token: string) => Promise<User | undefined>;
    setUser: ( user: any) => void;
    setToken: ( token: string ) => void
}

export const useMenuStore = create<MenuState>((set) => ({
    menubar: false,
    toggleMenu() {
        set(produce((state: MenuState) => {
            state.menubar = !state.menubar
        }))
    }
}))

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setUser: (user: User) => {
        set(produce((state: AuthState) => {
            state.user = user
        }))
    },
    setToken: (token: string) => {
        set(produce((state: AuthState) => {
            state.token = token
        }))
    },
    getUser: async (token: string) => {
        const meResponse = await api.get('/auth/me',{ headers: { Authorization: `Bearer ${token}` }},)
        const { user } = meResponse.data
        return user
    },
    login: async (email, password, router) => {
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
            router.push('/')
        }
        return token
    },
    register: async (name, email, password, router) => {
        await api.post('/auth/register', { name, email, password });
        router.push('/')
    },
    logout: (router) => {
        localStorage.removeItem('doppio_u_token')
        set(produce((state: AuthState) => {
            state.user = null
            state.token = null
        }))
        router.push('/')
    }
}));

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    fetchUserById: async (id: number, token: string) => {
        const response = await api.get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` }});
        const user: User = response.data
        return user
    },
    fetchUsers: async ({ page, token }) => {
        const response = await api.get(`/users/page/${page}`, { headers: { Authorization: `Bearer ${token}` }});
        set(produce((state: UserState) => {
            const { users, ...userInfo } = response.data
            state.userInfo = userInfo
            state.users = users.map((user: any) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              date: user.updatedAt,
              adminRole: user.adminRole
            }));
        }));
    },
    toggleAdmin: async (id: number, currentStatus: boolean, token: string) => {
        const newStatus = !currentStatus;
        await api.put(`/users/${id}`, { adminRole: newStatus }, { headers: { Authorization: `Bearer ${token}` }});
        set(produce((state: UserState) => {
            state.users = state.users.map((user) =>
                user.id === id ? { ...user, adminRole: newStatus } : user
            )
        }));
    },
    updateUser: async (id: number, user: UserEdit, token: string) => {
        const  { name, email, adminRole } = user
        await api.put(`/users/${id}`, { name, email, adminRole  }, { headers: { Authorization: `Bearer ${token}` }})
    },
    deleteUser: async (id: number, token: string) => {
        await api.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` }});
        const { users } = get()
        set(produce((state: UserState) => {
            state.users = users.filter(user => user.id != id)
        }));
    },
    createUser: async (post: UserCreate, token: string) => {
        const { name, email, password, adminRole } = post
        await api.post(`/users`, { name, email, password, adminRole }, { headers: { Authorization: `Bearer ${token}` }})
    }
}))

export const usePostStore = create<PostState>((set, get) => ({
    posts: [],
    fetchPostById: async (id: number) => {
        const response = await api.get(`/posts/${id}`);
        const post: Post = response.data
        return post
    },
    fetchPosts: async ({ page, user_id }) => {
        const response = await api.get(`/posts/page/${page}?authorId=${user_id}`);
        set(produce((state: PostState) => {
            const { posts, ...pageInfo } = response.data
            state.pageInfo = pageInfo
            state.posts = posts.map((post: any) => ({
              id: post.id,
              title: post.title,
              content: post.content.slice(0, 240), // Use first 150 characters as description
              image: post.image || null, // Assuming `coverImage` exists in API
              date: post.updatedAt,
              published: post.published,
              author: post.author
            }));
        }));
    },
    fetchPublishPosts: async () => {
        const response = await api.get('/posts/publish/page');
        set(produce((state: PostState) => {
            state.posts = response.data.posts.map((post: any) => ({
              id: post.id,
              title: post.title,
              contentCount: post.content.length,
              content: post.content.slice(0, 240), // Use first 150 characters as description
              image: post.image || null, // Assuming `coverImage` exists in API
              date: post.updatedAt,
              published: post.published,
              author: post.author.name
            }));
        }));
    },
    togglePublish: async (id: number, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        await api.put(`/posts/${id}`, { published: newStatus }); // อัปเดตสถานะใน backend
        set(produce((state: PostState) => {
            state.posts = state.posts.map((post) =>
                post.id === id ? { ...post, published: newStatus } : post
            )
        }));
    },
    updatePost: async (id: number, post: PostEdit) => {
        const  { title, content, published, image } = post
        await api.put(`/posts/${id}`, { title, content, published, image  })
    },
    deletePost: async (id: number) => {
        await api.delete(`/posts/${id}`);
        const { posts } = get()
        set(produce((state: PostState) => {
            state.posts = posts.filter(post => post.id != id)
        }));
    },
    createPost: async (post: PostCreate) => {
        const { title, content, authorId, image } = post
        await api.post(`/posts`, { title, content, authorId, image })
    },
    uploadImage: async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            console.log('FormData entries >>>', Array.from(formData.entries()));
            const response = await iapi.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.data?.imageUrl) {
                const imageUrl: string = response.data.imageUrl;
                return imageUrl
            }
            throw new Error("Image upload failed");
        }catch(error){
            console.error("Image upload error:", error);
            throw new Error("Image upload failed");
        }
    } 
}))