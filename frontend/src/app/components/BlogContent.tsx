import { Post } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { date_is } from '@/lib/date'
import { readCounter } from '@/lib/reading'

const Content = ({ post }:{ post: Post }) => {
    const router = useRouter();
    return (
      <div 
        onClick={() => router.push(`/posts/${post.id}`)}
        className='grid xl:grid-cols-4 gap-8 mb-[18px] xl:mb-[54px] bg-white cursor-pointer transition-all duration-500 rounded-lg ease-in-out hover:border hover:bg-white hover:shadow-xl p-6'>
        <div className="col-span-3 flex flex-col gap-2">  
          <div className="text-sm text-blue-500">{date_is(post.date)}</div>

          <img
            src={post.image || 'image_feature.jpg'} // Fallback to a default image
            alt={post.title}
            className="xl:hidden rounded-lg mb-1 w-full h-full object-cover"
          />

          <h1 className="cursor-pointer text-lg xl:text-2xl font-bold leading-tight text-black hover:underline">
            {post.title}
          </h1>
  
          <p className="text-sm xl:text-md text-gray-600">
            {post.content} ...
          </p>
  
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-100 border ">Tools</span>
            <span>By {post.author}</span>
            <span>•</span>
            <span>{readCounter(post.contentCount)} min read</span>
          </div>
        </div>
        <div className='hidden xl:block relative overflow-hidden'>
          <img
            src={post.image || 'image_feature.jpg'} // Fallback to a default image
            alt={post.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </div>
      
    );
};

export default Content