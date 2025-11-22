import Breadcrumb from "@/components/Common/Breadcrumb";
import BlogClient from "@/components/Blog/BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Page | PT. Inoventra Era Nusantara",
  description: "Solusi berbagai sektor dengan teknologi IoT - Artikel dan insight terbaru seputar teknologi, industri, dan pertanian",
};

// Hapus dynamic dan revalidate
// export const revalidate = 60;
// export const dynamic = 'force-dynamic';

const BlogPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Blog Grid"
        description="PT Inoventra Era Nusantara berfokus pada inovasi teknologi IoT untuk sektor industri dan pertanian di Indonesia. Temukan informasi terbaru dan solusi teknologi cerdas untuk mendukung transformasi digital."
      />
      
      <BlogClient />
    </>
  );
};

export default BlogPage;