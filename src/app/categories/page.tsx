import CategoryCard from "@/components/CategoryCard";
import React from "react";
import Category1 from "../../assets/categories-image1.png";
import Category2 from "../../assets/categories-image3.png";

const categories = [
  { id: 1, categoryName: "Technology", categoryImage: Category1 },
  { id: 2, categoryName: "Health & Wellness", categoryImage: Category2 },
  { id: 3, categoryName: "Finance", categoryImage: Category1 },
  { id: 4, categoryName: "Lifestyle", categoryImage: Category2 },
  { id: 5, categoryName: "Travel", categoryImage: Category1 },
  { id: 6, categoryName: "Education", categoryImage: Category2 },
  { id: 7, categoryName: "Food & Cooking", categoryImage: Category1 },
  { id: 8, categoryName: "Productivity", categoryImage: Category2 },
];

const CategoryScreen = () => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 justify-center items-center">
      {categories.map((category, index) => (
        <CategoryCard key={index} {...category} />
      ))}
    </div>
  );
};

export default CategoryScreen;
