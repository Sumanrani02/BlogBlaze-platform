import React from "react";
import Navbar from "../layout/Navbar";
import { BookOpen, Rss, ArrowRight, Sparkles, Star } from "lucide-react";
import Footer from "../layout/Footer";
import BlogPostCard from "../blog/BlogPostCard";

const HomePage = () => {
  const featuredPosts = [
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
    },
  ];

  const recentPosts = [
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
    },
  ];

  return (
    <div className="min-h-screen bg-offwhite flex flex-col font-inter">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-base to-blue-dark text-pink-base py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="container mx-auto text-center">
          <Sparkles className="mx-auto h-16 w-16 mb-4 text-pink-base" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight rounded-lg p-2 inline-block bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm">
            Welcome to BlogBlaze
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Igniting minds with compelling stories, insightful articles, and
            cutting-edge ideas.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center px-8 py-4 bg-pink-base text-blue-base text-lg font-bold rounded-full shadow-lg hover:bg-pink-light hover:text-blue-dark transition-all duration-300 transform hover:scale-105"
          >
            Start Reading <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pink-light">
        <div className="container mx-auto">
          <h2 className="text-4xl font-extrabold text-blue-base mb-10 text-center flex items-center justify-center">
            <Star className="h-9 w-9 mr-3 text-pink-darker" /> Featured Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} isFeatured={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-offwhite">
        <div className="container mx-auto">
          <h2 className="text-4xl font-extrabold text-blue-base mb-10 text-center flex items-center justify-center">
            <BookOpen className="h-9 w-9 mr-3 text-green-base" /> Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} isFeatured={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Call to Action Section */}
      <section className="bg-blue-base py-16 px-4 sm:px-6 lg:px-8 text-pink-base shadow-xl">
        <div className="container mx-auto text-center max-w-2xl">
          <Rss className="mx-auto h-12 w-12 mb-4 text-pink-base" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Join Our Community
          </h2>
          <p className="text-lg sm:text-xl opacity-90 mb-8">
            Subscribe to our newsletter for the latest updates, exclusive
            content, and insights delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-full border border-pink-darker text-blue-darker w-full sm:w-2/3 focus:ring-2 focus:ring-blue-light focus:outline-none shadow-inner"
            />
            <button className="px-6 py-3 bg-pink-base text-blue-base font-bold rounded-full shadow-md hover:bg-pink-light hover:text-blue-dark transition-colors duration-300 transform hover:scale-105 w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
