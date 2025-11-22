"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  getAllBlogs, 
  deleteBlog, 
  deleteImage, 
  createBlog, 
  updateBlog, 
  getBlogById, 
  uploadImage, 
  Blog,
  isAuthenticated,
  updateActivityTimestamp,
  logoutUser,
  getAuthUser
} from "@/lib/supabase";
import Image from "next/image";

type ViewMode = "dashboard" | "create" | "edit";

const AdminPage = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const BLOGS_PER_PAGE = 5;
  
  const [formData, setFormData] = useState({
    title: "",
    paragraph: "",
    content: "",
    category: "",
    tags: "",
  });
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signin");
    } else {
      setIsCheckingAuth(false);
      updateActivityTimestamp();
    }
  }, [router]);

  // Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    if (isCheckingAuth) return;

    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        alert("Session timeout. Silakan login kembali.");
        router.push("/signin");
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isCheckingAuth, router]);

  // Update activity timestamp on any user interaction
  useEffect(() => {
    if (isCheckingAuth) return;

    const updateActivity = () => {
      if (isAuthenticated()) {
        updateActivityTimestamp();
      }
    };

    // Track various user activities
    window.addEventListener("click", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("scroll", updateActivity);
    window.addEventListener("mousemove", updateActivity);

    return () => {
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("mousemove", updateActivity);
    };
  }, [isCheckingAuth]);

  useEffect(() => {
    if (!isCheckingAuth) {
      loadBlogs();
    }
  }, [isCheckingAuth]);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      logoutUser();
      router.push("/signin");
    }
  };

  const loadBlogs = async () => {
    setIsLoading(true);
    const data = await getAllBlogs();
    setBlogs(data);
    setIsLoading(false);
  };

  // Pagination calculations
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const endIndex = startIndex + BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      paragraph: "",
      content: "",
      category: "",
      tags: "",
    });
    setCurrentImageUrl(null);
    setImageFile(null);
    setImagePreview("");
    setEditingBlogId(null);
  };

  const handleCreateNew = () => {
    resetForm();
    setViewMode("create");
  };

  const handleEdit = async (id: string) => {
    const blog = await getBlogById(id);
    if (blog) {
      setFormData({
        title: blog.title,
        paragraph: blog.paragraph,
        content: blog.content,
        category: blog.category || "",
        tags: blog.tags.join(", "),
      });
      setCurrentImageUrl(blog.image_url);
      if (blog.image_url) {
        setImagePreview(blog.image_url);
      }
      setEditingBlogId(id);
      setViewMode("edit");
    } else {
      alert("Blog tidak ditemukan");
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm("Apakah Anda yakin ingin menghapus blog ini?")) {
      return;
    }

    try {
      if (imageUrl) {
        await deleteImage(imageUrl);
      }

      const success = await deleteBlog(id);
      
      if (success) {
        alert("Blog berhasil dihapus");
        if (currentBlogs.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        loadBlogs();
      } else {
        alert("Gagal menghapus blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = currentImageUrl;
      
      if (imageFile) {
        if (viewMode === "edit" && currentImageUrl) {
          await deleteImage(currentImageUrl);
        }
        
        const newImageUrl = await uploadImage(imageFile);
        if (!newImageUrl) {
          alert("Gagal mengupload gambar");
          setIsSubmitting(false);
          return;
        }
        imageUrl = newImageUrl;
      }

      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      if (viewMode === "create") {
        const newBlog = await createBlog({
          title: formData.title,
          paragraph: formData.paragraph,
          content: formData.content,
          image_url: imageUrl,
          tags: tagsArray,
          category: formData.category,
          publish_date: new Date().toISOString(),
        });

        if (newBlog) {
          alert("Blog berhasil dipublish!");
          resetForm();
          setViewMode("dashboard");
          setCurrentPage(1);
          loadBlogs();
        } else {
          alert("Gagal membuat blog");
        }
      } else if (viewMode === "edit" && editingBlogId) {
        const updatedBlog = await updateBlog(editingBlogId, {
          title: formData.title,
          paragraph: formData.paragraph,
          content: formData.content,
          image_url: imageUrl,
          tags: tagsArray,
          category: formData.category,
        });

        if (updatedBlog) {
          alert("Blog berhasil diupdate!");
          resetForm();
          setViewMode("dashboard");
          loadBlogs();
        } else {
          alert("Gagal mengupdate blog");
        }
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setViewMode("dashboard");
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="text-center py-20">
            <p className="text-lg text-body-color">Checking authentication...</p>
          </div>
        </div>
      </section>
    );
  }

  // Dashboard View
  if (viewMode === "dashboard") {
    const authUser = getAuthUser();
    
    return (
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Blog Management Dashboard
              </h1>
              <p className="mt-2 text-sm text-body-color">
                Total {blogs.length} blog{blogs.length !== 1 ? 's' : ''} | Logged in as: <span className="font-semibold text-primary">{authUser?.username}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateNew}
                className="rounded-sm bg-primary px-6 py-3 text-base font-medium text-white duration-300 hover:bg-primary/90"
              >
                + Create New Blog
              </button>
              <button
                onClick={handleLogout}
                className="rounded-sm bg-red-500 px-6 py-3 text-base font-medium text-white duration-300 hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-lg text-body-color">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-body-color mb-4">Belum ada blog tersedia.</p>
              <button
                onClick={handleCreateNew}
                className="inline-block rounded-sm bg-primary px-6 py-3 text-base font-medium text-white duration-300 hover:bg-primary/90"
              >
                Create First Blog
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
                <table className="w-full table-auto">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Image</th>
                      <th className="px-4 py-3 text-left">Title</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">Tags</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBlogs.map((blog, index) => (
                      <tr
                        key={blog.id}
                        className={`${
                          index % 2 === 0 ? "bg-white dark:bg-dark" : "bg-gray-50 dark:bg-dark-2"
                        } border-b border-body-color border-opacity-10`}
                      >
                        <td className="px-4 py-3">
                          {blog.image_url ? (
                            <div className="relative h-16 w-24">
                              <Image
                                src={blog.image_url}
                                alt={blog.title}
                                fill
                                className="rounded object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-16 w-24 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                              <span className="text-xs text-body-color">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-dark dark:text-white line-clamp-2">
                            {blog.title}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block rounded bg-primary/10 px-3 py-1 text-sm text-primary">
                            {blog.category || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="inline-block rounded bg-body-color/10 px-2 py-1 text-xs text-body-color"
                              >
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className="inline-block rounded bg-body-color/10 px-2 py-1 text-xs text-body-color">
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-body-color">
                          {new Date(blog.publish_date).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <a
                              href={`/blog-details/${blog.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                            >
                              View
                            </a>
                            <button
                              onClick={() => handleEdit(blog.id)}
                              className="rounded bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id, blog.image_url)}
                              className="rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                        currentPage === 1
                          ? "cursor-not-allowed border-stroke bg-gray-2 text-body-color opacity-50 dark:border-dark-3 dark:bg-dark-2"
                          : "border-primary bg-white text-primary hover:bg-primary hover:text-white dark:border-primary dark:bg-dark dark:hover:bg-primary"
                      }`}
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
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex h-10 min-w-[40px] items-center justify-center rounded-md border px-3 transition ${
                          currentPage === page
                            ? "border-primary bg-primary text-white"
                            : "border-stroke bg-white text-body-color hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:bg-dark dark:text-body-color dark:hover:border-primary dark:hover:bg-primary"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                        currentPage === totalPages
                          ? "cursor-not-allowed border-stroke bg-gray-2 text-body-color opacity-50 dark:border-dark-3 dark:bg-dark-2"
                          : "border-primary bg-white text-primary hover:bg-primary hover:text-white dark:border-primary dark:bg-dark dark:hover:bg-primary"
                      }`}
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
                    </button>
                  </div>

                  <p className="text-center text-sm text-body-color mt-4">
                    Menampilkan {startIndex + 1} - {Math.min(endIndex, blogs.length)} dari {blogs.length} blog
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  }

  // Create/Edit Form View
  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[800px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-black dark:text-white sm:text-3xl text-center">
                  {viewMode === "create" ? "Upload Blog Content" : "Edit Blog Content"}
                  
                </h3>
              </div>
              <p className="mb-11 text-center text-base font-medium text-body-color">
                {viewMode === "create" 
                  ? "Upload your blog content for PT Inoventra Era Nusantara."
                  : "Update your blog content for PT Inoventra Era Nusantara."}
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label
                    htmlFor="title"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul blog"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="category"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="IoT">IoT</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Technology">Technology</option>
                    <option value="Industry">Industry</option>
                    <option value="Smart City">Smart City</option>
                  </select>
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="paragraph"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    Short Description *
                  </label>
                  <textarea
                    name="paragraph"
                    id="paragraph"
                    required
                    rows={3}
                    value={formData.paragraph}
                    onChange={handleInputChange}
                    placeholder="Deskripsi singkat blog (akan muncul di preview)"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  ></textarea>
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="content"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    Blog Content *
                  </label>
                  <textarea
                    name="content"
                    id="content"
                    required
                    rows={10}
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Konten lengkap blog (support HTML)"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  ></textarea>
                  <p className="mt-2 text-xs text-body-color">
                    Tip: Gunakan HTML untuk formatting (contoh: &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;)
                  </p>
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="tags"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Pisahkan dengan koma (contoh: IoT, Pertanian, Teknologi)"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="image"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    {viewMode === "create" ? "Upload Image" : "Upload New Image (opsional)"}
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm text-body-color">
                        {imageFile ? "Preview gambar baru:" : "Gambar saat ini:"}
                      </p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-48 w-full rounded object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="shadow-submit dark:shadow-submit-dark flex flex-1 items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting 
                      ? (viewMode === "create" ? "Publishing..." : "Updating...") 
                      : (viewMode === "create" ? "Publish Blog" : "Update Blog")}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex flex-1 items-center justify-center rounded-sm bg-gray-500 px-9 py-4 text-base font-medium text-white duration-300 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;