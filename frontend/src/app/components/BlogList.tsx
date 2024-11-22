import { useStore } from '@/lib/store';

const BlogList = () => {
  const { posts } = useStore();

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};

export default BlogList;
