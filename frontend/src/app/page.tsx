"use client";

import BlogList from "@/components/BlogList";
import Footer from "@/components/Footer";

const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row xl:grid xl:grid-cols-2 items-center justify-between w-full px-8 sm:px-20 py-6 bg-white border border-gray-300">
      {/* Left Section */}
      <div className="flex flex-col">
        <a
          href="https://www.doppiotech.com/"
          className="text-sm text-blue-500 hover:underline flex items-center gap-1"
        >
          See Doppio website <span>↗</span>
        </a>
        <h1 className="text-2xl xl:text-3xl font-bold text-black mt-2">
          Insights from our team
        </h1>
        <p className="text-sm xl:text-md text-gray-600 max-w-[540px] mt-2">
          Gain valuable insights straight from our team of experts! Explore ideas, strategies, and perspectives that drive innovation and success
        </p>
      </div>

      {/* Right Section */}
      <div className="relative mt-4 w-full sm:mt-0">
        <input
          type="text"
          placeholder="search..."
          className="w-full sm:w-64 px-4 py-2 text-sm text-gray-700 border border-gray-300 pl-[36px] rounded-full focus:outline-none focus:ring focus:ring-blue-300"
        />
        <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>
    </div>
  );
};

const SideList = () => {
  const topics = [
    "Company",
    "Design",
    "Technology",
    "Artificial Intelligence",
    "Work",
  ];

  return (
    <div className="hidden xl:flex flex-col items-start gap-4 px-12 mt-12">
      {/* Title */}
      <h2 className="text-blue-600 text-md">Blog Topics</h2>
      {/* List */}
      <ul className="flex flex-col gap-3 text-gray-900">
        {topics.map((topic, index) => (
          <li
            key={index}
            className="cursor-pointer hover:underline hover:text-blue-500"
          >
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {  
  return (
    <div className="items-center justify-items-center xl:px-[10vw] xl:py-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Header />
        <div className="grid xl:grid-cols-4 xl:gap-24">
          <SideList />
          <BlogList />
        </div>
        <Footer />  
      </main>  
    </div>
  );
}
