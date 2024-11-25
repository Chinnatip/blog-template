import { useEffect } from 'react';
import { usePostStore } from '@/lib/store';
import BlogContent from '@/components/BlogContent'

const BlogList = () => {
  const { posts, fetchPublishPosts } = usePostStore();

  useEffect(() => {
    fetchPublishPosts(); // Fetch posts when the component loads
  }, [fetchPublishPosts]);

  if (posts.length === 0) {
    return <div className="text-center py-10 text-gray-500">No posts available</div>;
  }

  return (
    <div className="col-span-3 px-4 xl:p-6">
      {posts.map((post) => (
        <BlogContent key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
