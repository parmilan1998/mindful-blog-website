import { CategoryCardProps } from "@/types";
import Image from "next/image";
import React from "react";

const CategoryCard: React.FC<CategoryCardProps> = ({
  categoryName,
  categoryImage,
}) => {
  return (
    <div className="flex flex-col bg-white border-[0.5px] border-gray-200 rounded-lg transition-transform hover:scale-105">
      <Image
        src={categoryImage}
        alt={categoryName}
        className="bg-cover w-full h-80 object-cover rounded-t-lg transition-all duration-300"
      />

      <h1 className="text-xl h-16  flex justify-center items-center text-center py-2 font-bold font-lora cursor-pointer text-black hover:text-indigo-800 transition ease-in duration-300">
        {categoryName}
      </h1>
    </div>
  );
};

export default CategoryCard;
