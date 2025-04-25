import BlogCard from "@/components/BlogCard";
import React from "react";
import Link from "next/link";
import { blogData } from "@/constants/BlogData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Mindful Blog Website",
  description:
    "Explore our latest blog posts on mindfulness, productivity, and personal growth.",
};

const BlogScreen = () => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 px-6 justify-center items-center">
      {blogData.map((item, index) => (
        <Link href={`blog/${item.slug}`} key={index}>
          <BlogCard {...item} data-aos="fade-up" data-aos-delay={index * 200} />
        </Link>
      ))}
    </div>
  );
};

export default BlogScreen;
