"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Save,
  Globe,
  Loader2,
  Upload,
  Tag,
  FolderOpen,
  Settings,
  X,
  Image,
  Bold,
  Italic,
  Code,
  List,
  Link2,
  Hash,
  Quote,
  Minus,
  ArrowLeft,
  Plus,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_CATEGORIES, MOCK_TAGS, MOCK_USERS } from "@/mock/data";
import { slugify, estimateReadingTime, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/common/Breadcrumb";
import { useRouter } from "next/navigation";
import { postService } from "@/services/post-service";
import Link from "next/link";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug is required"),
  excerpt: z
    .string()
    .min(20, "Excerpt must be at least 20 characters")
    .max(300),
  content: z.string().min(50, "Content must be at least 50 characters"),
  categoryId: z.string().min(1, "Select a category"),
  authorId: z.string().min(1, "Select an author"),
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  isFeatured: z.boolean(),
  isTrending: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const TOOLBAR = [
  { icon: Bold, label: "Bold", insert: "**bold**" },
  { icon: Italic, label: "Italic", insert: "*italic*" },
  { icon: Hash, label: "Heading", insert: "\n## Heading\n" },
  { icon: Quote, label: "Quote", insert: "\n> Blockquote\n" },
  { icon: Code, label: "Code", insert: "`code`" },
  { icon: List, label: "List", insert: "\n- Item\n- Item\n" },
  { icon: Link2, label: "Link", insert: "[text](url)" },
  { icon: Image, label: "Image", insert: "![alt](url)" },
  { icon: Minus, label: "Divider", insert: "\n---\n" },
];

const authors = MOCK_USERS.filter(
  (u) => u.role === "admin" || u.role === "editor" || u.role === "author",
);

export default function AdminCreatePostPage() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // @ts-ignore
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      categoryId: "",
      authorId: MOCK_USERS[0].id,
      status: "draft",
      isFeatured: false,
      isTrending: false,
    },
  });

  const contentValue = watch("content");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("title", e.target.value);
    setValue("slug", slugify(e.target.value));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("content", e.target.value);
    setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length);
  };

  const insertMarkdown = (text: string) => {
    const el = document.getElementById(
      "admin-create-content",
    ) as HTMLTextAreaElement;
    if (!el) return;
    const start = el.selectionStart;
    const updated =
      el.value.slice(0, start) + text + el.value.slice(el.selectionEnd);
    setValue("content", updated);
    el.focus();
    setTimeout(
      () => el.setSelectionRange(start + text.length, start + text.length),
      0,
    );
  };

  const onSubmit = async (data: FormData) => {
    try {
      const category = MOCK_CATEGORIES.find((c) => c.id === data.categoryId);
      const author = MOCK_USERS.find((u) => u.id === data.authorId);
      const tags = MOCK_TAGS.filter((t) => selectedTags.includes(t.id));
      const payload = {
        ...data,
        category: category!,
        author: author!,
        tags,
        readingTime: estimateReadingTime(data.content),
        publishedAt:
          data.status === "published" ? new Date().toISOString() : undefined,
      };
      const result = await postService.createPost(payload);
      if (result.success) {
        toast.success("Post created!");
        router.push("/admin/posts");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 max-w-6xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <PageBreadcrumb
              items={[
                { label: "Posts", href: "/admin/posts" },
                { label: "New Post" },
              ]}
              className="mb-2"
            />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Create New Post</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Admin · Full publishing control
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className=" cursor-pointer"
            >
              <Link href="/admin/posts">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Cancel
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setValue("status", "draft");
                handleSubmit(onSubmit)();
              }}
              disabled={isSubmitting}
              className=" cursor-pointer"
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Draft
            </Button>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-40 text-sm">
                    <Globe className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Save as Draft</SelectItem>
                    <SelectItem value="published">Publish Now</SelectItem>
                    <SelectItem value="scheduled">Schedule</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className=" cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
            {/* ── Main ─────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Title */}
              <div className="bg-card border rounded-2xl p-5 space-y-3">
                <div>
                  <Input
                    {...register("title")}
                    onChange={handleTitleChange}
                    placeholder="Post title…"
                    className="text-2xl font-bold h-auto py-3 px-0 border-0 border-b rounded-none focus-visible:ring-0 placeholder:text-muted-foreground/40 bg-transparent"
                  />
                  {errors.title && (
                    <p className="text-xs text-danger mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium shrink-0">
                    Slug:
                  </span>
                  <div className="flex-1 flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1">
                    <span className="text-muted-foreground/60">
                      devpulse.io/blog/
                    </span>
                    <Input
                      {...register("slug")}
                      className="h-5 text-xs font-mono text-primary border-0 p-0 focus-visible:ring-0 bg-transparent flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="bg-card border rounded-2xl overflow-hidden">
                <Tabs defaultValue="write" className="flex flex-col">
                  <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/30">
                    <TabsList className="h-7 bg-transparent p-0 gap-1">
                      <TabsTrigger value="write" className="h-7 px-3 text-xs">
                        ✏️ Write
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="h-7 px-3 text-xs">
                        👁 Preview
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-0.5">
                      {TOOLBAR.map(({ icon: Icon, label, insert }) => (
                        <Tooltip key={label}>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer"
                              onClick={() => insertMarkdown(insert)}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="text-xs">
                            {label}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{wordCount} words</span>
                      <span>
                        ~{estimateReadingTime(contentValue || "")} min read
                      </span>
                    </div>
                  </div>
                  <TabsContent value="write" className="m-0">
                    <Textarea
                      id="admin-create-content"
                      {...register("content")}
                      onChange={handleContentChange}
                      placeholder="Write in Markdown…"
                      className="min-h-[480px] font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0 p-5 leading-relaxed"
                    />
                    {errors.content && (
                      <p className="text-xs text-danger px-5 pb-3">
                        {errors.content.message}
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="preview" className="m-0">
                    <div className="min-h-[480px] p-5 blog-prose">
                      {contentValue ? (
                        contentValue.split("\n").map((line, idx) => {
                          if (line.startsWith("# "))
                            return <h1 key={idx}>{line.slice(2)}</h1>;
                          if (line.startsWith("## "))
                            return <h2 key={idx}>{line.slice(3)}</h2>;
                          if (line.startsWith("> "))
                            return (
                              <blockquote key={idx}>{line.slice(2)}</blockquote>
                            );
                          if (line.trim() === "") return <br key={idx} />;
                          return <p key={idx}>{line}</p>;
                        })
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Start writing to preview…
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Excerpt */}
              <div className="bg-card border rounded-2xl p-5 space-y-2">
                <Label className="font-semibold">
                  Excerpt
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (shown in card previews)
                  </span>
                </Label>
                <Textarea
                  {...register("excerpt")}
                  placeholder="Brief description of the post…"
                  className="resize-none h-20 text-sm"
                />
                {errors.excerpt && (
                  <p className="text-xs text-danger">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>
            </div>

            {/* ── Sidebar ──────────────────────────────────── */}
            <div className="space-y-4">
              {/* Featured Image */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Image className="w-4 h-4 text-primary" /> Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed rounded-xl p-5 text-center hover:border-primary/50 hover:bg-primary/3 transition-all group">
                      <Upload className="w-7 h-7 text-muted-foreground/40 mx-auto mb-2 group-hover:text-primary transition-colors" />
                      <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        Click to upload
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        PNG, JPG, WebP · max 5 MB
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </CardContent>
              </Card>

              {/* Author (admin-only feature) */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Author
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="authorId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select author…" />
                        </SelectTrigger>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              <span className="flex items-center gap-2">
                                <Avatar size="sm">
                                  <AvatarImage src={author.avatar} />
                                  <AvatarFallback>
                                    {getInitials(author.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{author.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Category */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-primary" /> Category *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={errors.categoryId ? "border-danger" : ""}
                        >
                          <SelectValue placeholder="Choose category…" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <span className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.categoryId && (
                    <p className="text-xs text-danger mt-1">
                      {errors.categoryId.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" /> Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTags.map((id) => {
                        const tag = MOCK_TAGS.find((t) => t.id === id);
                        return tag ? (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="text-xs gap-1 pl-2.5"
                          >
                            #{tag.name}
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedTags((p) =>
                                  p.filter((t) => t !== id),
                                )
                              }
                              className=" cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {MOCK_TAGS.filter((t) => !selectedTags.includes(t.id)).map(
                      (tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => setSelectedTags((p) => [...p, tag.id])}
                          className="text-xs px-2 py-0.5 cursor-pointer border rounded-full text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
                        >
                          #{tag.name}
                        </button>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input type="datetime-local" className="text-sm" />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Leave blank to publish immediately
                  </p>
                </CardContent>
              </Card>

              {/* Options */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" /> Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm">Featured</Label>
                          <p className="text-xs text-muted-foreground">
                            Homepage hero
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                  <Separator />
                  <Controller
                    name="isTrending"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm">Trending</Label>
                          <p className="text-xs text-muted-foreground">
                            Boost feeds
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SEO */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      SEO Title
                    </Label>
                    <Input
                      {...register("seoTitle")}
                      placeholder="Defaults to post title"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Meta Description
                    </Label>
                    <Textarea
                      {...register("seoDescription")}
                      placeholder="Defaults to excerpt"
                      className="resize-none h-16 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </TooltipProvider>
  );
}
