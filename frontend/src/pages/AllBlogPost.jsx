import React, { useState, useEffect, useMemo } from "react";
import { Search, Tag, ListFilter } from "lucide-react";
import NavBar from "../layout/Navbar";
import Spinner from "../component/common/Spinner";
import Footer from "../layout/Footer";
import BlogPostCard from "../blog/BlogPostCard";

const AllPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allDummyPosts = useMemo(
    () => [
      {
        id: 1,
        title: "Mastering React Hooks: A Deep Dive",
        excerpt:
          "Unlock the power of React Hooks with this comprehensive guide, covering useState, useEffect, and custom hooks for cleaner, more efficient code.",
        imageUrl:
          "https://placehold.co/600x400/blue-base/pink-base?text=React+Hooks",
        category: "Development",
        author: "Jane Doe",
        date: "May 10, 2025",
        tags: ["React", "Hooks", "JavaScript"],
      },
      {
        id: 2,
        title: "The Art of Storytelling in Blogging",
        excerpt:
          "Learn how to captivate your audience and make your blog posts unforgettable by weaving compelling narratives.",
        imageUrl:
          "https://placehold.co/600x400/pink-base/blue-base?text=Storytelling",
        category: "Writing",
        author: "John Smith",
        date: "April 28, 2025",
        tags: ["Writing", "Content Creation"],
      },
      {
        id: 3,
        title: "AI in Everyday Life: Future or Present?",
        excerpt:
          "Explore the fascinating world of Artificial Intelligence and its growing impact on our daily routines and future prospects.",
        imageUrl:
          "https://placehold.co/600x400/blue-base/pink-base?text=AI+Future",
        category: "Technology",
        author: "Alice Johnson",
        date: "April 15, 2025",
        tags: ["AI", "Future Tech"],
      },
      {
        id: 4,
        title: "CSS Grid vs. Flexbox: When to Use Which",
        excerpt:
          "A practical guide to help you decide between CSS Grid and Flexbox for your next web layout.",
        imageUrl:
          "https://placehold.co/400x250/pink-base/blue-base?text=CSS+Layout",
        category: "Web Design",
        author: "Michael Green",
        date: "June 05, 2025",
        tags: ["CSS", "Web Design"],
      },
      {
        id: 5,
        title: "Boosting Your Blog's SEO: A Beginner's Guide",
        excerpt:
          "Simple yet effective strategies to improve your blog's search engine ranking and attract more readers.",
        imageUrl:
          "https://placehold.co/400x250/blue-base/pink-base?text=SEO+Tips",
        category: "Marketing",
        author: "Sarah Brown",
        date: "May 30, 2025",
        tags: ["SEO", "Marketing"],
      },
      {
        id: 6,
        title: "Productivity Hacks for Remote Developers",
        excerpt:
          "Maximize your efficiency and maintain focus while working from home with these proven tips and tools.",
        imageUrl:
          "https://placehold.co/400x250/pink-base/blue-base?text=Remote+Work",
        category: "Productivity",
        author: "David Lee",
        date: "May 25, 2025",
        tags: ["Productivity", "Remote Work"],
      },
      {
        id: 7,
        title: "Understanding JavaScript Closures",
        excerpt:
          "Demystifying one of JavaScript's most powerful and often misunderstood concepts: closures.",
        imageUrl:
          "https://placehold.co/400x250/blue-base/pink-base?text=JS+Closures",
        category: "Development",
        author: "Emily White",
        date: "May 20, 2025",
        tags: ["JavaScript", "Development"],
      },
      {
        id: 8,
        title: "The Future of Web Development: Trends to Watch",
        excerpt:
          "Stay ahead of the curve with a look at the emerging trends shaping the future of web development.",
        imageUrl:
          "https://placehold.co/400x250/pink-base/blue-base?text=Web+Trends",
        category: "Development",
        author: "Alex Kim",
        date: "June 1, 2025",
        tags: ["Web Development", "Trends"],
      },
      {
        id: 9,
        title: "Tips for Creative Writing and Idea Generation",
        excerpt:
          "Unleash your inner wordsmith with effective techniques for brainstorming and crafting engaging narratives.",
        imageUrl:
          "https://placehold.co/400x250/blue-base/pink-base?text=Creative+Writing",
        category: "Writing",
        author: "Sophia Chen",
        date: "May 22, 2025",
        tags: ["Creative Writing", "Ideas"],
      },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchPosts = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPosts(allDummyPosts);
      } catch (err) {
        setError("Failed to load blog posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [allDummyPosts]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      allDummyPosts.map((post) => post.category)
    );
    return ["All", ...Array.from(uniqueCategories).sort()];
  }, [allDummyPosts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerCaseQuery) ||
          post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
          post.author.toLowerCase().includes(lowerCaseQuery) ||
          post.category.toLowerCase().includes(lowerCaseQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }
    return filtered;
  }, [posts, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
        <NavBar />
        <Spinner className="animate-spin h-16 w-16 text-blue-base" />
        <p className="mt-4 text-xl text-blue-darker">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
        <NavBar />
        <p className="text-red-600 text-xl font-semibold">{error}</p>
        <p className="text-blue-darker mt-2">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite font-inter">
      <NavBar />

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
                  placeholder="Search by title, author, category, or tag..."
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
