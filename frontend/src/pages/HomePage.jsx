import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { BookOpen, Rss, ArrowRight, Sparkles, Star } from "lucide-react";
import Footer from "../layout/Footer";
import BlogPostCard from "../blog/BlogPostCard";
import bgImg from "../assets/hero-section-bg3.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeaturedPosts,
  fetchRecentPosts,
  subscribeToNewsletter,
} from "../redux/blogSlice";

const HomePage = () => {
  const { featured, recent, loading, newsletterSuccess, newsletterError } =
    useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFeaturedPosts());
    dispatch(fetchRecentPosts());
    if (newsletterSuccess || newsletterError) {
      const timer = setTimeout(() => {}, 3000);
      setIsSubmitting(true);
      return () => {
        clearTimeout(timer);
        setIsSubmitting(false);
      };
    }
  }, [dispatch, newsletterSuccess, newsletterError]);

  const handleSubscribe = () => {
    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    dispatch(subscribeToNewsletter(email));
    setEmail("");
  };
  return (
    <div className="min-h-screen bg-offwhite flex flex-col font-inter">
      <Navbar />
      <section
        className=" text-pink-base py-20 px-4 sm:px-6 lg:px-8 shadow-inner"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "0.7",
        }}
      >
        <div className="container mx-auto text-center">
          <Sparkles className="mx-auto h-16 w-16 mb-4 text-pink-base" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight rounded-lg p-2 inline-block bg-opacity-10 backdrop-filter backdrop-blur-sm">
            Welcome to BlogBlaze
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Igniting minds with compelling stories, insightful articles, and
            cutting-edge ideas.
          </p>
          <a
            href="/posts"
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
            {loading ? (
              <p className="text-center col-span-full text-lg font-semibold text-blue-600">
                Loading...
              </p>
            ) : (
              featured.map((post) => (
                <BlogPostCard key={post._id} post={post} isFeatured={true} />
              ))
            )}
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
            {loading ? (
              <p className="text-center col-span-full text-lg font-semibold text-blue-600">
                Loading...
              </p>
            ) : (
              
              recent.map((post) => (
                <BlogPostCard key={post._id} post={post} isFeatured={false} />
              ))
            )}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSubscribe}
              className="px-6 py-3 bg-pink-base text-blue-base font-bold rounded-full shadow-md hover:bg-pink-light hover:text-blue-dark transition-colors duration-300 transform hover:scale-105 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
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
