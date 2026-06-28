"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Trash2,
  Search,
  FolderPlus,
  Grid3X3,
  List,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_MEDIA } from "@/mock/data";
import { formatBytes, formatDate } from "@/lib/utils";
import type { MediaFile } from "@/types";
import { toast } from "sonner";

export default function AdminMediaPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [files, setFiles] = useState(MOCK_MEDIA);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelected(null);
    toast.success("File deleted");
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground">{files.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className=" cursor-pointer">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button size="sm" className=" cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Upload Drop Zone */}
      <div className="border-2 border-dashed rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
        <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-semibold">Click to upload</span> or
          drag and drop files
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          PNG, JPG, GIF, WebP, SVG up to 10MB
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-1 border rounded-lg p-0.5">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            className="h-7 w-7 cursor-pointer"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className="h-7 w-7 cursor-pointer"
            onClick={() => setViewMode("list")}
          >
            <List className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map((file, idx) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              className="group relative aspect-square rounded-xl overflow-hidden border cursor-pointer hover:border-primary/40 transition-all"
              onClick={() => setSelected(file)}
            >
              <img
                src={file.thumbnailUrl ?? file.url}
                alt={file.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 text-[10px]"
                >
                  View
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white truncate">{file.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-2xl overflow-hidden">
          <div className="divide-y divide-border/60">
            {filtered.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={file.thumbnailUrl ?? file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)} ·{" "}
                    {formatDate(file.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    title="Copy URL"
                    onClick={() => toast.success("URL copied")}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-danger hover:bg-danger/10 cursor-pointer"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm truncate">
              {selected?.name}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={selected.url}
                  alt={selected.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{selected.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">
                    {formatBytes(selected.size)}
                  </span>
                </div>
                {selected.width && selected.height && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span className="font-medium">
                      {selected.width}×{selected.height}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded</span>
                  <span className="font-medium">
                    {formatDate(selected.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(selected.url);
                    toast.success("URL copied!");
                  }}
                >
                  Copy URL
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className=" cursor-pointer"
                  onClick={() => handleDelete(selected.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
