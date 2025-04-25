"use client";

import { blogData } from "@/constants/BlogData";
import { Metadata } from "next";
import { useParams } from "next/navigation";
import React from "react";

const SingleBlog = () => {
  const { slug } = useParams();
  const singleBlogData = blogData.filter((blog) => blog.slug === slug);

  console.log("====================================");
  console.log(singleBlogData);
  console.log("====================================");

  return (
    <div>
      <h1>Blog Title</h1>
      <p>Blog content goes here...</p>
    </div>
  );
};

export default SingleBlog;
