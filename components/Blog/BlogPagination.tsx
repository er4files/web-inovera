// ============================================
// FILE: components/Blog/BlogPagination.tsx
// ============================================
"use client";

import { Blog } from "@/lib/supabase";
import SingleBlog from "./SingleBlog";
import Link from "next/link";

interface BlogPaginationProps {
  blogs: Blog[];
  currentPage: number;
  totalPages: number;
}

const BlogPagination = ({ blogs, currentPage, totalPages }: BlogPaginationProps) => {
  return (
    <>
      <div className="-mx-4 flex flex-wrap justify-center">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3 mb-10"
          >
            <SingleBlog blog={blog} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {/* Previous Button */}
          <Link
            href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : "#"}
            className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
              currentPage === 1
                ? "cursor-not-allowed border-stroke bg-gray-2 text-body-color opacity-50 dark:border-dark-3 dark:bg-dark-2"
                : "border-primary bg-white text-primary hover:bg-primary hover:text-white dark:border-primary dark:bg-dark dark:hover:bg-primary"
            }`}
            onClick={(e) => currentPage === 1 && e.preventDefault()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/blog?page=${page}`}
              className={`flex h-10 min-w-[40px] items-center justify-center rounded-md border px-3 transition ${
                currentPage === page
                  ? "border-primary bg-primary text-white"
                  : "border-stroke bg-white text-body-color hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:bg-dark dark:text-body-color dark:hover:border-primary dark:hover:bg-primary"
              }`}
            >
              {page}
            </Link>
          ))}

          {/* Next Button */}
          <Link
            href={currentPage < totalPages ? `/blog?page=${currentPage + 1}` : "#"}
            className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
              currentPage === totalPages
                ? "cursor-not-allowed border-stroke bg-gray-2 text-body-color opacity-50 dark:border-dark-3 dark:bg-dark-2"
                : "border-primary bg-white text-primary hover:bg-primary hover:text-white dark:border-primary dark:bg-dark dark:hover:bg-primary"
            }`}
            onClick={(e) => currentPage === totalPages && e.preventDefault()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      )}

      {/* Pagination Info */}
      {totalPages > 1 && (
        <p className="text-center text-sm text-body-color mt-6">
          Halaman {currentPage} dari {totalPages}
        </p>
      )}
    </>
  );
};

export default BlogPagination;
