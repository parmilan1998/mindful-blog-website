import { BlogDataType } from "@/types";
import Image from "next/image";
import React from "react";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";

const BlogCard: React.FC<BlogDataType> = ({
  BlogImage,
  ProfileImage,
  name,
  timeAgo,
  title,
  description,
  author,
  postDate,
  slug,
  category,
}) => {
  return (
    <div className="rounded-xl border-[0.5px] border-gray-200 bg-white font-figtree transition-transform duration-300 hover:scale-105">
      <div>
        <Image
          src={BlogImage}
          alt="Blog Card Image"
          className=" rounded-t-xl w-full h-56 bg-cover"
        />
      </div>
      <div className="flex flex-col space-y-3 p-4">
        <div className="flex flex-row justify-between">
          <p className="font-figtree font-medium">{name}</p>
          <div className="flex flex-row gap-2 justify-center items-center">
            <CiClock2 size={24} />
            <span>{timeAgo}</span>
          </div>
        </div>
        <h1 className="mx-auto text-lg tracking-wide font-semibold leading-7 font-figtree">
          {title}
        </h1>
        <p className="mx-auto text-base h-18 font-normal tracking-wide text-gray-500 font-figtree leading-6">
          {description}
        </p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 justify-center items-center">
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-8 w-8 bg-cover rounded-full"
            />
            <p>{author}</p>
          </div>
          <div className="flex flex-row gap-2 justify-center items-center">
            <CiCalendarDate size={24} />
            <span>{postDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
