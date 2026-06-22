"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  Eye,
  Heart,
  Bookmark,
  Share2,
  AtSign,
  Link2,
  ArrowLeft,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogCard } from "@/components/cards";
import { MOCK_COMMENTS } from "@/mock/data";
import {
  formatDate,
  formatRelativeDate,
  formatNumber,
  getInitials,
} from "@/lib/utils";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { postService } from "@/services/post-service";
import Link from "next/link";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postService.getPost(slug!),
    enabled: !!slug,
  });

  const { data: related } = useQuery({
    queryKey: ["posts", "related", post?.id, post?.category.id],
    queryFn: () => postService.getRelatedPosts(post!.id, post!.category.id),
    enabled: !!post,
  });

  const comments = MOCK_COMMENTS.filter(
    (c) => c.postId === post?.id && c.status === "approved",
  );

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title ?? "";
    if (platform === "twitter")
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      );
    if (platform === "linkedin")
      window.open(`https://linkedin.com/sharing/share-offsite/?url=${url}`);
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-2">Article not found</h1>
        <p className="text-muted-foreground mb-6">
          This post may have been moved or deleted.
        </p>
        <Button onClick={() => router.push("/blog")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back href Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 py-10">
          {/* Main content */}
          <article className="min-w-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/categories/${post.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {post.category.name}
              </Link>
            </nav>

            {/* Category + status */}
            <div className="flex items-center gap-2 mb-4">
              <Link href={`/categories/${post.category.slug}`}>
                <Badge
                  className="text-xs font-semibold"
                  style={{
                    backgroundColor: `${post.category.color}20`,
                    color: post.category.color,
                    borderColor: `${post.category.color}30`,
                  }}
                >
                  {post.category.name}
                </Badge>
              </Link>
              {post.isFeatured && (
                <Badge className="bg-warning/15 text-warning-foreground border-warning/20 text-xs">
                  ⭐ Featured
                </Badge>
              )}
              {post.isTrending && (
                <Badge className="bg-danger/15 text-danger border-danger/20 text-xs">
                  🔥 Trending
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b">
              <div className="flex items-center gap-3">
                <Link href={`/authors/${post.author.id}`}>
                  <Avatar>
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link
                    href={`/authors/${post.author.id}`}
                    className="text-sm font-semibold hover:text-primary transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </span>
                    <span>·</span>
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {formatNumber(post.viewCount)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  {formatNumber(post.likeCount)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  {post.commentCount}
                </span>
              </div>
            </div>

            {/* Featured image */}
            {post.featuredImage && (
              <div className="rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Content */}
            <div className="blog-prose max-w-none">
              {post.content.split("\n").map((line, idx) => {
                if (line.startsWith("# "))
                  return <h1 key={idx}>{line.slice(2)}</h1>;
                if (line.startsWith("## "))
                  return <h2 key={idx}>{line.slice(3)}</h2>;
                if (line.startsWith("### "))
                  return <h3 key={idx}>{line.slice(4)}</h3>;
                if (line.startsWith("> "))
                  return <blockquote key={idx}>{line.slice(2)}</blockquote>;
                if (line.startsWith("```"))
                  return (
                    <div
                      key={idx}
                      className="my-4 p-4 bg-muted rounded-xl font-mono text-sm"
                    />
                  );
                if (line.trim() === "") return <br key={idx} />;
                return <p key={idx}>{line}</p>;
              })}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                  <Badge
                    variant="outline"
                    className="text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t">
              <span className="text-sm font-medium text-muted-foreground">
                Share:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("twitter")}
              >
                <AtSign className="w-4 h-4 mr-1.5" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("linkedin")}
              >
                <Link2 className="w-4 h-4 mr-1.5" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("copy")}
              >
                <Link2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Author bio */}
            <div className="mt-10 p-6 bg-card border rounded-2xl">
              <div className="flex items-start gap-4">
                <Link href={`/authors/${post.author.id}`}>
                  <Avatar size="lg">
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/authors/${post.author.id}`}
                    className="font-bold hover:text-primary transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <p className="text-xs text-primary font-medium mt-0.5 capitalize">
                    {post.author.role}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {post.author.bio}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-muted-foreground">
                      {post.author.postCount} articles
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(post.author.followerCount)} followers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            {comments.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-6">
                  Comments ({comments.length})
                </h2>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 p-4 bg-card border rounded-xl"
                    >
                      <Avatar size="sm">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>
                          {getInitials(comment.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="text-xs text-muted-foreground hover:text-danger flex items-center gap-1 transition-colors">
                            <Heart className="w-3 h-3" /> {comment.likeCount}
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related */}
            {related && related.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {related.map((p, idx) => (
                    <BlogCard key={p.id} post={p} index={idx} />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <div className="bg-card border rounded-2xl p-5">
                <h3 className="text-sm font-bold mb-3">Table of Contents</h3>
                <nav className="space-y-1.5">
                  {post.content
                    .split("\n")
                    .filter((line) => line.startsWith("## "))
                    .map((line, idx) => (
                      <a
                        key={idx}
                        href={`#${line.slice(3).toLowerCase().replace(/\s+/g, "-")}`}
                        className="block text-xs text-muted-foreground hover:text-primary transition-colors py-0.5"
                      >
                        {line.slice(3)}
                      </a>
                    ))}
                </nav>
              </div>

              {/* Actions */}
              <div className="bg-card border rounded-2xl p-5 space-y-2">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  size="sm"
                  onClick={() => toast.info("Bookmark saved!")}
                >
                  <Bookmark className="w-4 h-4" />
                  Bookmark
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  size="sm"
                  onClick={() => toast.info("Liked!")}
                >
                  <Heart className="w-4 h-4" />
                  Like ({formatNumber(post.likeCount)})
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  size="sm"
                  onClick={() => handleShare("copy")}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Tags */}
              <div className="bg-card border rounded-2xl p-5">
                <h3 className="text-sm font-bold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Link key={tag.id} href={`/tags/${tag.slug}`}>
                      <Badge
                        variant="outline"
                        className="text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        #{tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
