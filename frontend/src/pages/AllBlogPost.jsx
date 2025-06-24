import React, { useState, useEffect, useMemo } from "react";
import { Search, Tag, ListFilter } from "lucide-react";
import Navbar from "../layout/Navbar";
import Spinner from "../component/common/Spinner";
import Footer from "../layout/Footer";
import BlogPostCard from "../blog/BlogPostCard";
import axios from "axios";

const AllPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/api/posts"); 
        setPosts(response.data);
      } catch (err) {
        setError("Failed to load blog posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(posts.map((post) => post.category));
    return ["All", ...Array.from(uniqueCategories).sort()];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

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
  }, [posts, selectedCategory, searchQuery]);

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
        <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-pink-base">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Category Filter */}
            <div className="w-full md:w-auto flex flex-col items-center md:items-start">
              <label
                htmlFor="category-select"
                className="text-blue-darker font-bold mb-2 flex items-center"
              >
                <ListFilter className="h-5 w-5 mr-2 text-blue-light" /> Filter
                by Category:
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

            {/* Search Bar */}
            <div className="w-full md:w-1/2 relative">
              <label htmlFor="search-input" className="sr-only">
                Search Posts
              </label>
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
