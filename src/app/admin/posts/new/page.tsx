"use client";

import { Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MOCK_CATEGORIES, MOCK_TAGS } from "@/mock/data";
import QuillEditor from "@/components/editor/QuillEditor";
import { TitleSlugCard } from "@/components/admin/post/Titleslugcard";
import { ExcerptCard } from "@/components/admin/post/Excerptcard";
import { FeaturedImageCard } from "@/components/admin/post/Featuredimagecard";
import { AuthorCard } from "@/components/admin/post/Authorcard";
import { CategoryCard } from "@/components/admin/post/Categorycard";
import { TagsCard } from "@/components/admin/post/Tagscard";
import { ScheduleCard } from "@/components/admin/post/Schedulecard";
import { OptionsCard } from "@/components/admin/post/Optionscard";
import { PostFormHeader } from "@/components/admin/post/Postformheader";
import { SeoCard } from "@/components/admin/post/Seocard";
import { AUTHORS, useCreatePostForm } from "@/hooks/use-create-posts";

export default function AdminCreatePostPage() {
  const {
    register,
    control,
    errors,
    isSubmitting,
    selectedTagIds,
    toggleTag,
    removeTag,
    featuredImagePreview,
    handleImageSelect,
    removeImage,
    wordCount,
    readingTime,
    isScheduled,
    handleTitleChange,
    handleContentChange,
    saveDraft,
    publish,
  } = useCreatePostForm();

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 max-w-6xl"
      >
        <PostFormHeader
          isSubmitting={isSubmitting}
          isScheduled={isScheduled}
          wordCount={wordCount}
          readingTime={readingTime}
          onSaveDraft={saveDraft}
          onPublish={publish}
        />

        {/* Draft/Publish are triggered explicitly from the header, so native
            form submission (e.g. Enter inside a text field) is disabled to
            avoid a second, ambiguous submit path. */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
            {/* ── Main ─────────────────────────────────────── */}
            <div className="space-y-4">
              <TitleSlugCard
                control={control}
                register={register}
                errors={errors}
                onTitleChange={handleTitleChange}
              />

              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <QuillEditor
                    value={field.value}
                    onChange={handleContentChange}
                  />
                )}
              />
              {errors.content && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.content.message}
                </p>
              )}

              <ExcerptCard register={register} errors={errors} />
            </div>

            {/* ── Sidebar ──────────────────────────────────── */}
            <div className="space-y-4">
              <FeaturedImageCard
                preview={featuredImagePreview}
                onSelect={handleImageSelect}
                onRemove={removeImage}
              />
              <AuthorCard control={control} authors={AUTHORS} />
              <CategoryCard
                control={control}
                categories={MOCK_CATEGORIES}
                error={errors.categoryId?.message}
              />
              <TagsCard
                allTags={MOCK_TAGS}
                selectedTagIds={selectedTagIds}
                onToggle={toggleTag}
                onRemove={removeTag}
              />
              <ScheduleCard
                register={register}
                error={errors.scheduledAt?.message}
              />
              <OptionsCard control={control} />
              <SeoCard register={register} />
            </div>
          </div>
        </form>
      </motion.div>
    </TooltipProvider>
  );
}
