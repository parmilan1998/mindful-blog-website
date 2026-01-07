import { StaticImageData } from "next/image";

export interface CategoryCardProps {
  categoryImage: StaticImageData | string;
  categoryName: string;
}

export interface BlogDataType {
  id: number;
  BlogImage: StaticImageData | string;
  ProfileImage: StaticImageData | string;
  name: string;
  timeAgo: string;
  title: string;
  description: string;
  author: string;
  postDate: string;
  slug: string;
  category: string;
}
