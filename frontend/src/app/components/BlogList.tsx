import { useEffect } from 'react';
import { usePostStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { date_format } from '@/lib/date'

const BlogList = () => {
  const { posts, fetchPublishPosts } = usePostStore();
  const router = useRouter();

  useEffect(() => {
    fetchPublishPosts(); // Fetch posts when the component loads
  }, [fetchPublishPosts]);

  if (posts.length === 0) {
    return <div className="text-center py-10 text-gray-500">No posts available</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
          onClick={() => router.push(`/posts/${post.id}`)}
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={post.image || 'image_feature.jpg'} // Fallback to a default image
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-2 line-clamp-3">{post.content}</p>
            <p className="text-sm text-gray-400 mt-4">
              {date_format(post.date)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
