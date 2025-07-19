import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import Navbar from "../layout/Navbar";
import Spinner from "../component/common/Spinner";
import Footer from "../layout/Footer";
import BlogPostCard from "../blog/BlogPostCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs, clearError } from "../redux/blogSlice";

const AllPostsPage = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set((blogs || []).map((post) => post.category));
    return ["All", ...Array.from(uniqueCategories).sort()];
  }, [blogs]);

  const filteredPosts = useMemo(() => {
    let filtered = blogs || [];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (post) => (post.category || "") === selectedCategory
      );
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((post) => {
        const title = (post.title || "").toLowerCase();
        const excerpt = (post.excerpt || "").toLowerCase();
        const category = (post.category || "").toLowerCase();
        const tags = Array.isArray(post.tags)
          ? post.tags.map((tag) => (tag || "").toLowerCase())
          : [];

        return (
          title.includes(lowerCaseQuery) ||
          excerpt.includes(lowerCaseQuery) ||
          category.includes(lowerCaseQuery) ||
          tags.some((tag) => tag.includes(lowerCaseQuery))
        );
      });
    }
    return filtered;
  }, [blogs, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <Spinner className="animate-spin h-16 w-16 text-blue-base" />
          <p className="mt-4 text-xl text-blue-darker">Loading posts...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <p className="text-red-600 text-xl font-semibold">{error}</p>
          <p className="text-blue-darker mt-2">
            Please refresh the page or try again later.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite font-inter">
      <Navbar />

      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Filter and Search Section */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-10 border border-pink-base">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Search Bar */}
            <div className="w-full md:w-1/2 relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-light" />
                </div>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search by title, category, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
                />
              </div>
            </div>
            {/* Category Filter */}
            <div className="w-full md:w-auto flex items-center justify-center md:justify-start gap-x-4">
              <label
                htmlFor="category-select"
                className="text-blue-darker font-medium"
              >
                Filter By Category
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light cursor-pointer shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-2xl text-blue-darker font-semibold">
              No posts found matching your criteria.
            </p>
            <p className="text-blue-darker mt-2">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AllPostsPage;
