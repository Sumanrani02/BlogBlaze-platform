import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BlogPostCard = ({ post, isFeatured = false }) => {
  const { _id, title, excerpt, image, category, author, date } = post;
  
  console.log("Post image URL:", image);

  const cardClasses = isFeatured
    ? "bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border-2 border-pink-base"
    : "flex flex-col sm:flex-row bg-white rounded-xl shadow-md overflow-hidden transform hover:translate-y-[-5px] transition-transform duration-300 border border-pink-base";

  const imageClasses = isFeatured
    ? "w-full h-56 object-cover"
    : "w-full sm:w-2/5 h-48 sm:h-auto object-cover";

  const contentContainerClasses = isFeatured
    ? "p-6"
    : "p-6 sm:p-5 flex flex-col justify-between w-full sm:w-3/5";

  const titleClasses = isFeatured
    ? "text-2xl font-bold text-blue-base mb-3 leading-snug"
    : "text-xl font-bold text-blue-base mb-2 leading-snug";

  const excerptClasses = isFeatured
    ? "text-blue-darker text-base mb-4 line-clamp-3"
    : "text-blue-darker text-sm line-clamp-2";

  const linkClasses = isFeatured
    ? "mt-6 inline-flex items-center text-blue-base font-semibold hover:text-blue-light transition-colors duration-200"
    : "mt-4 inline-flex items-center text-blue-base font-medium hover:text-blue-light transition-colors duration-200";

  return (
    <div className={`${cardClasses} font-inter`}>
      <img
        src={image}
        alt={title}
        className={imageClasses}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = isFeatured
            ? "https://placehold.co/600x400/offwhite/blue-darker?text=Image+Not+Found"
            : "https://placehold.co/400x250/offwhite/blue-darker?text=Image+Not+Found";
        }}
      />
      <div className={contentContainerClasses}>
        <div>
          <span
            className={`text-sm font-semibold text-blue-base bg-pink-base px-3 py-1 rounded-full mb-3 inline-block ${
              isFeatured ? "" : "text-xs px-2 py-1"
            }`}
          >
            {category}
          </span>
          <h3 className={titleClasses}>{title}</h3>
          <p className={excerptClasses}>{excerpt}</p>
        </div>
        <div
          className={`flex justify-between items-center text-gray-500 mt-4 ${
            isFeatured ? "text-sm" : "text-xs"
          }`}
        >
          <span>By {author?.username || "Unknown"}</span>
          <span>{date}</span>
        </div>
        <Link
            to={`/posts/${_id}`}
          className={linkClasses}
        >
          Read More{" "}
          <ArrowRight
            className={`ml-1 ${isFeatured ? "h-4 w-4" : "h-3 w-3"}`}
          />
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;
