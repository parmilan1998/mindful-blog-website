import { StaticImageData } from "next/image";

export interface BlogCardProps {
  BlogImage: StaticImageData;
  ProfileImage: StaticImageData;
  name: string;
  timeAgo: string;
  title: string;
  description: string;
  author: string;
  postDate: string;
}

export interface CategoryCardProps {
  categoryImage: StaticImageData;
  categoryName: string;
}
