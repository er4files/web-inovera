"use client";

import { useEffect, useState } from "react";
import { getAllBlogs, Blog } from "@/lib/supabase";
import BlogPagination from "./BlogPagination";

const BLOGS_PER_PAGE = 6;

const BlogClient = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getAllBlogs();
      setBlogs(data);
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="relative z-10 pb-[120px] pt-[120px]">
        <div className="container">
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-body-color">Memuat blog...</p>
          </div>
        </div>
      </section>
    );
  }

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const endIndex = startIndex + BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  return (
    <section className="relative z-10 pb-[120px] pt-[120px]">
      <div className="container">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto max-w-md">
              <div className="mb-6">
                <svg
                  className="mx-auto h-24 w-24 text-body-color opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">
                Belum Ada Blog
              </h3>
              <p className="text-base text-body-color">
                Blog akan segera hadir. Pantau terus untuk mendapatkan artikel dan insight terbaru!
              </p>
            </div>
          </div>
        ) : (
          <BlogPagination 
            blogs={currentBlogs}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Background Pattern */}
      <div className="absolute bottom-0 left-0 right-0 z-[-1] h-full w-full bg-[url(/images/video/shape.svg)] bg-cover bg-center bg-no-repeat"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[-2] h-full w-full bg-gradient-to-b from-white/50 via-transparent to-white/50 dark:from-dark/50 dark:via-transparent dark:to-dark/50"></div>
    </section>
  );
};

export default BlogClient;