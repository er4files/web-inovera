"use client";

import SingleBlog from "./SingleBlog";
import { Blog } from "@/lib/supabase";

interface BlogPaginationProps {
  blogs: Blog[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // Tambahkan ini
}

const BlogPagination = ({ blogs, currentPage, totalPages, onPageChange }: BlogPaginationProps) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="-mx-4 flex flex-wrap justify-center">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
          >
            <SingleBlog blog={blog} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`rounded-md px-4 py-2 ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default BlogPagination;