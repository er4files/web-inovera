import { getAllBlogs } from "@/lib/supabase";

export default async function blogData() {
  const blogs = await getAllBlogs();
  return blogs;
}