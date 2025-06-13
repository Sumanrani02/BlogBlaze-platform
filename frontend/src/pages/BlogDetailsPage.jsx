import React, { useEffect, useState } from 'react';
import { User, Calendar, Tag, Share2, Facebook, Twitter, Linkedin, Copy, MessageSquare, Heart } from 'lucide-react'; 
import NavBar from '../layout/Navbar';
import Footer from '../layout/Footer';
import Spinner from '../component/common/Spinner';

const BlogDetailPage = () => {
  const [post, setPost] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false); 
  const dummyPost = {
    id: 1,
    title: "Mastering React Hooks: A Deep Dive into State and Effects",
    content: `
      <p class="mb-4 text-lg leading-relaxed">
        React Hooks revolutionized how we write React components, offering a way to use state and other React features without writing a class. This deep dive will cover the most fundamental hooks: <code>useState</code> and <code>useEffect</code>, and touch upon building custom hooks for reusability.
      </p>
      <h2 class="text-3xl font-semibold text-blue-darker mb-4">Understanding useState</h2>
      <p class="mb-4 text-lg leading-relaxed">
        <code>useState</code> is the simplest hook, allowing you to add React state to function components. It returns a pair: the current state value and a function that lets you update it. Consider this example:
      </p>
      <pre class="bg-blue-darker text-pink-light p-4 rounded-lg overflow-x-auto text-sm mb-6"><code>
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}
      </code></pre>
      <p class="mb-4 text-lg leading-relaxed">
        Every time the button is clicked, <code>setCount</code> updates the <code>count</code> state, and React re-renders the component.
      </p>
      <h2 class="text-3xl font-semibold text-blue-darker mb-4">Exploring useEffect</h2>
      <p class="mb-4 text-lg leading-relaxed">
        <code>useEffect</code> lets you perform side effects in function components. Data fetching, subscriptions, and manually changing the DOM are all examples of side effects. It takes a function that will be executed after every render, by default.
      </p>
      <pre class="bg-blue-darker text-pink-light p-4 rounded-lg overflow-x-auto text-sm mb-6"><code>
import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // This runs after every render
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(json => setData(json));

    // Cleanup function (optional)
    return () => {
      // Clean up subscriptions or clear timers here
    };
  }, []); // Empty dependency array means it runs once on mount and cleans up on unmount

  return (
    &lt;div&gt;
      {data ? &lt;p&gt;Data: {JSON.stringify(data)}&lt;/p&gt; : &lt;p&gt;Loading...&lt;/p&gt;}
    &lt;/div&gt;
  );
}
      </code></pre>
      <p class="mb-4 text-lg leading-relaxed">
        The second argument to <code>useEffect</code> is a dependency array. An empty array <code>[]</code> tells React to run the effect only once after the initial render and clean up when the component unmounts.
      </p>
      <h2 class="text-3xl font-semibold text-blue-darker mb-4">Custom Hooks for Reusability</h2>
      <p class="mb-4 text-lg leading-relaxed">
        Custom Hooks are JavaScript functions whose names start with "use" and that may call other Hooks. They allow you to extract reusable stateful logic from a component. For example, a <code>useForm</code> hook could manage form state and validation.
      </p>
      <pre class="bg-blue-darker text-pink-light p-4 rounded-lg overflow-x-auto text-sm mb-6"><code>
import { useState } from 'react';

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return { values, handleChange };
}
      </code></pre>
      <p class="mb-4 text-lg leading-relaxed">
        By embracing Hooks, your React components become more readable, reusable, and easier to test, leading to a more pleasant development experience.
      </p>
    `,
    imageUrl: "https://placehold.co/1200x600/blue-base/pink-base?text=React+Hooks+Deep+Dive",
    category: "Development",
    author: "Jane Doe",
    date: "May 10, 2025",
    tags: ["React", "Hooks", "JavaScript", "Frontend"],
    likes: 42,
    comments: [
      { id: 1, author: "Alice Smith", text: "Great explanation!", date: "May 11, 2025" },
      { id: 2, author: "Bob Johnson", text: "Very helpful for beginners.", date: "May 12, 2025" },
    ],
  };

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setError(null);
    const fetchPost = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setPost(dummyPost); // Set the dummy post
      } catch (err) {
        setError("Failed to load blog post. Please try again later.");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  // Function to copy current page URL to clipboard
  const handleCopyLink = () => {
    document.execCommand('copy'); // For clipboard access in iframe environment
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
        <NavBar/>
        <Spinner className="animate-spin h-16 w-16 text-blue-base" />
        <p className="mt-4 text-xl text-blue-darker">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
        <NavBar />
        <p className="text-red-600 text-xl font-semibold">{error}</p>
        <p className="text-blue-darker mt-2">Please refresh the page or try again later.</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
        <NavBar />
        <p className="text-blue-darker text-xl font-semibold">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite font-inter">
      <NavBar />

      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <article className="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-pink-base">
          {/* Post Image */}
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x600/offwhite/blue-darker?text=Blog+Image+Not+Found"; }}
          />

          {/* Post Header */}
          <header className="mb-8 border-b pb-6 border-pink-light">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-darker mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-blue-darker text-sm gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1 text-blue-light" />
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-blue-light" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1 text-blue-light" />
                <span className="text-blue-base bg-pink-base px-2 py-0.5 rounded-full text-xs font-semibold">
                  {post.category}
                </span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-pink-darker" fill="currentColor" />
                <span>{post.likes} Likes</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-blue-darker bg-pink-light px-3 py-1 rounded-full text-xs font-medium border border-pink-base">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Post Content - Using dangerouslySetInnerHTML for rich text */}
          <div
            className="prose prose-lg max-w-none text-blue-dark leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Social Share and Copy Link */}
          <div className="mt-10 pt-6 border-t border-pink-light flex flex-col sm:flex-row items-center justify-between gap-4">
            <h4 className="text-blue-base text-lg font-bold flex items-center">
              <Share2 className="h-5 w-5 mr-2" /> Share This Post:
            </h4>
            <div className="flex space-x-3">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-light text-white rounded-full hover:bg-blue-base transition-colors duration-200 shadow-md">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-lighter text-blue-darker rounded-full hover:bg-blue-light transition-colors duration-200 shadow-md">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-base text-white rounded-full hover:bg-blue-dark transition-colors duration-200 shadow-md">
                <Linkedin className="h-5 w-5" />
              </a>
              <button onClick={handleCopyLink} className="relative p-3 bg-green-base text-white rounded-full hover:bg-blue-light transition-colors duration-200 shadow-md">
                <Copy className="h-5 w-5" />
                {showCopiedMessage && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-dark text-pink-light text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 animate-fadeInOut">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <section className="mt-12 pt-8 border-t border-pink-base">
            <h3 className="text-3xl font-extrabold text-blue-darker mb-6 flex items-center">
              <MessageSquare className="h-7 w-7 mr-2 text-blue-light" /> Comments ({post.comments.length})
            </h3>
            <div className="space-y-6">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="bg-pink-light p-5 rounded-lg shadow-sm border border-pink-base">
                    <p className="font-semibold text-blue-base mb-1">{comment.author}</p>
                    <p className="text-blue-darker text-sm">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-2">{comment.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-blue-darker text-center text-lg py-4">No comments yet. Be the first to comment!</p>
              )}
            </div>

            {/* Comment Form - Placeholder for future functionality */}
            <div className="mt-8 pt-6 border-t border-pink-light">
              <h4 className="text-xl font-bold text-blue-base mb-4">Leave a Comment</h4>
              <form className="space-y-4">
                <div>
                  <label htmlFor="comment-name" className="sr-only">Your Name</label>
                  <input
                    type="text"
                    id="comment-name"
                    placeholder="Your Name (Optional)"
                    className="w-full p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light"
                  />
                </div>
                <div>
                  <label htmlFor="comment-text" className="sr-only">Your Comment</label>
                  <textarea
                    id="comment-text"
                    rows="5"
                    placeholder="Write your comment here..."
                    required
                    className="w-full p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light resize-y"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-base text-pink-base font-bold rounded-full shadow-md hover:bg-blue-dark transition-colors duration-300 transform hover:scale-105"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
