import BlogCard from "@/components/BlogCard";
import React from "react";
import BlogImage1 from "../../assets/blog1-image1.png";
import BlogImage2 from "../../assets/blog1-image2.png";
import ProfileImage from "../../assets/profile.jpeg";

const blogData = [
  {
    BlogImage: BlogImage1,
    ProfileImage: ProfileImage,
    name: "Technology",
    timeAgo: "5 min ago",
    title: "The Future of AI: Trends to Watch in 2025",
    description:
      "Discover the latest advancements in artificial intelligence and what they mean for the future of tech.",
    author: "John Doe",
    postDate: "March 15, 2025",
  },
  {
    BlogImage: BlogImage2,
    ProfileImage: ProfileImage,
    name: "Lifestyle",
    timeAgo: "2 hours ago",
    title: "10 Daily Habits for a Healthier Mind and Body",
    description:
      "Improve your well-being with these simple yet effective daily habits.",
    author: "Jane Smith",
    postDate: "March 14, 2025",
  },
  {
    BlogImage: BlogImage1,
    ProfileImage: ProfileImage,
    name: "Finance",
    timeAgo: "1 day ago",
    title: "Smart Investing: How to Grow Your Wealth in 2025",
    description:
      "A beginner-friendly guide to making smart investment choices in today's market.",
    author: "Michael Carter",
    postDate: "March 13, 2025",
  },
  {
    BlogImage: BlogImage2,
    ProfileImage: ProfileImage,
    name: "Travel",
    timeAgo: "3 days ago",
    title: "Top 5 Underrated Travel Destinations for 2025",
    description:
      "Explore breathtaking locations that are off the beaten path and full of adventure.",
    author: "Emily Johnson",
    postDate: "March 10, 2025",
  },
  {
    BlogImage: BlogImage1,
    ProfileImage: ProfileImage,
    name: "Productivity",
    timeAgo: "1 week ago",
    title: "Mastering Time Management: Strategies for Success",
    description:
      "Learn practical tips to boost your productivity and manage your time more effectively.",
    author: "David Lee",
    postDate: "March 5, 2025",
  },
];

const BlogScreen = () => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 justify-center items-center">
      {blogData.map((item, index) => (
        <BlogCard key={index} {...item} data-aos="fade-up" />
      ))}
    </div>
  );
};

export default BlogScreen;
