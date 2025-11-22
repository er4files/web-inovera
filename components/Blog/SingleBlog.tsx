// ============================================
// FILE 2: components/Blog/SingleBlog.tsx
// ============================================
import { Blog } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import SharePost from "@/components/Blog/SharePost";

const SingleBlog = ({ blog }: { blog: Blog }) => {
  const { id, title, image_url, paragraph, tags, publish_date } = blog;

  // Format tanggal dan waktu (hanya jam dan menit)
  const formattedDate = new Date(publish_date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false, // Menggunakan format 24 jam
  });

  return (
    <div className="group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
      <Link
        href={`/blog-details/${id}`}
        className="relative block aspect-[37/22] w-full overflow-hidden"
      >
        {image_url ? (
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
            <span className="text-body-color">No Image</span>
          </div>
        )}
        {tags.length > 0 && (
          <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white transition-transform duration-300 group-hover:scale-105">
            {tags[0]}
          </span>
        )}
      </Link>
      
      <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
        <h3>
          <Link
            href={`/blog-details/${id}`}
            className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl transition-colors duration-300"
          >
            {title}
          </Link>
        </h3>
        
        <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10 line-clamp-3">
          {paragraph}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="inline-block">
            <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
              Tanggal Publikasi
            </h4>
            <p className="text-xs text-body-color">{formattedDate}</p>
          </div>
          
          <div className="mb-5">
                      
                      <div className="flex items-center sm:justify-end">
                        <SharePost />
                      </div>
                    </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
