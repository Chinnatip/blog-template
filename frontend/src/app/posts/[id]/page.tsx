"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api';
import { date_format } from '@/lib/date'

const PostDetail = () => {
    const params = useParams()
    const { id } = params
    const router = useRouter()

    const [post, setPost] = useState<{
        title: string;
        content: string;
        image: string | null;
        date: string;
    } | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
        try {
            if (id) {
            const response = await api.get(`/posts/${id}`);
            const { title, content, coverImage, updatedAt } = response.data;

            setPost({
                title,
                content,
                image: coverImage || '/image_feature.jpg', // Fallback to default image
                date: date_format(updatedAt)
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
        <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="rounded-lg shadow-lg overflow-hidden bg-white">
            <img
            src={typeof post.image == 'string' ? post.image : ''}
            alt={post.title}
            className="w-full h-64 object-cover"
            />
            <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
            <p className="text-sm text-gray-400 mt-2">{post.date}</p>
            <div className="mt-4 text-gray-700 space-y-4">
                {post.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
                ))}
            </div>
            </div>
        </div>
        <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            onClick={() => router.push('/')}
        >
            Back to Blog List
        </button>
        </div>
    );
};

export default PostDetail;
