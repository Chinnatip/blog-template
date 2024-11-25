"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'
import { Post } from '@/lib/store'
import { api } from '@/lib/api';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { readCounter } from '@/lib/reading'
import { date_is } from '@/lib/date'

const PostDetail = () => {
    const params = useParams()
    const { id } = params
    const router = useRouter()

    const [post, setPost] = useState<Post | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
        try {
            if (id) {
            const response = await api.get(`/posts/${id}`);
            const { id: idx ,author, title, content, image, published, updatedAt } = response.data;

            setPost({
                id: idx,
                title,
                content,
                image: image || '/image_feature.jpg', // Fallback to default image
                date: updatedAt,
                published,
                contentCount: content.length, 
                author: author?.name
            });
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading...</div>;
    }

    if (!post) {
        return (
        <div className="text-center py-10 text-red-500">
            Post not found. <button className="text-blue-500 underline" onClick={() => router.push('/')}>Go back</button>
        </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-4 xl:py-10 px-4">
            <div className="rounded-md shadow-lg overflow-hidden bg-white">
                <img
                    src={typeof post.image == 'string' ? post.image : ''}
                    alt={post.title}
                    className="w-full h-[360px] object-cover"
                />
                <div className='bg-gray-100 py-5 px-4 xl:p-8'>
                    <h1 className="text-2xl xl:text-3xl font-bold text-gray-800">{post.title}</h1>
                    <p className='space-x-2 xl:space-x-4 xl:my-1'>
                        <span className='text-gray-500 text-sm'>{date_is(post.date)}</span>
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{readCounter(post.contentCount)} min read</span>
                    </p>
                </div>
                <div className="p-5 xl:p-8">
                    <div className=" text-gray-700">
                        <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        className="markdown-body"
                        >
                        {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
            <div className='text-center'>
                <button
                    className="mt-6 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition duration-300"
                    onClick={() => router.push('/')}
                >
                    Back to Blog List
                </button>
            </div>
        </div>
    );
};

export default PostDetail;
