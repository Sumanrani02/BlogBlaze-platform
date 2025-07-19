import React, { useState } from "react";
import { Plus, Tag, List, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import RichTextEditor from "../blog/RichTextEditor";
import Spinner from "../component/common/Spinner";
import Footer from "../layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, clearError, clearSuccess } from "../redux/blogSlice";

const CreateBlogPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector(
    (state) => state.blogs
  );
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFeaturedImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearError());
    dispatch(clearSuccess());

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content.trim() || content.trim() === "<p><br></p>") {
      toast.error("Content is required");
      return;
    }

    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }

    try {
      let blogData;

      if (featuredImage) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("content", content);
        formData.append("category", category.trim());
        formData.append(
          "tags",
          tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
            .join(",")
        );
        formData.append("featuredImage", featuredImage);

        blogData = formData;
      } 
     
      const result = await dispatch(createBlog(blogData));

      if (createBlog.fulfilled.match(result)) {
        toast.success("Blog post published successfully!");

        setTitle("");
        setCategory("");
        setTags("");
        setContent("");
        setFeaturedImage(null);
        setImagePreview(null);

        setTimeout(() => {
          navigate("/posts");
        }, 1500);
      } else {
        toast.error(result.payload || "Failed to create blog post");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("An unexpected error occurred while creating the blog post.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-offwhite font-inter">
      <Navbar />

      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-5xl font-extrabold text-blue-darker mb-10 text-center leading-tight">
          <Plus className="inline-block h-12 w-12 mr-3 text-green-base" />{" "}
          Create New Blog Post
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-pink-base">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
          {successMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <CheckCircle className="inline-block h-5 w-5 mr-2" />
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-blue-darker text-lg font-bold mb-2"
              >
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog post title"
                className="w-full p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
                required
                disabled={loading}
              />
            </div>

            {/* Category Input */}
            <div>
              <label
                htmlFor="category"
                className="block text-blue-darker text-lg font-bold mb-2"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <List className="h-5 w-5 text-blue-light" />
                </div>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Development, Lifestyle, Technology"
                  className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label
                htmlFor="tags"
                className="block text-blue-darker text-lg font-bold mb-2"
              >
                Tags (Comma-separated)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 mr-2 text-blue-light" />
                </div>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., react, javascript, frontend, hooks"
                  className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Featured Image Upload */}
            <div>
              <label
                htmlFor="featuredImage"
                className="block text-blue-darker text-lg font-bold mb-2"
              >
                Featured Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="featuredImage"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-blue-darker file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-light file:text-offwhite
                  hover:file:bg-blue-base hover:file:text-pink-base transition-colors duration-200
                  cursor-pointer disabled:opacity-50"
                required
                disabled={loading}
              />
              {imagePreview && (
                <div className="mt-4 border border-pink-base rounded-md overflow-hidden shadow-sm">
                  <p className="text-sm text-blue-darker px-4 py-2 bg-pink-light">
                    Image Preview:
                  </p>
                  <img
                    src={imagePreview}
                    alt="Featured Image Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Rich Text Editor for Content */}
            <div>
              <label
                htmlFor="blogContent"
                className="block text-blue-darker text-lg font-bold mb-2"
              >
                Blog Content <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your blog post content here..."
                readOnly={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-blue-base bg-pink-base hover:bg-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-dark transition-all duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <Spinner className="h-6 w-6 text-blue-base" />
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" /> Publish Blog
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateBlogPost;
