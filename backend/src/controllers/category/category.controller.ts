import { Types } from "mongoose";
import Category from "../../models/category.model";
import { categorySchema, updateCategorySchema } from "./category.schema";
import { Request, Response } from "express";

export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    const result = categorySchema.safeParse({
      ...req.body,
      image: req.file?.path,
    });

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid Date",
        errors: result.error.flatten(),
      });
    }

    const { name, slug, image, description, status } = result.data;

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists. Please try with a different name.",
      });
    }

    const newCategory = await Category.create({
      name,
      slug,
      image,
      description,
      status,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
    console.log(error);
  }
};

export const getAllCategoryHandler = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
    console.log(error);
  }
};

export const getCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
    console.log(error);
  }
};
export const updateCategoryHandler = async (req: Request, res: Response) => {
  try {
    const result = updateCategorySchema.safeParse({
      ...req.body,
      image: req.file?.path,
    });

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: result.error.flatten(),
      });
    }

    const { id, name, slug, description, status, image } = result.data;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid Category ID or missing" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const existingCategory = await Category.findOne({
      _id: { $ne: id },
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists. Please try with a different name.",
      });
    }

    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (description) category.description = description;
    if (status) category.status = status;
    if (image) category.image = image;

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
    console.log(error);
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error });
    console.log(error);
  }
};
