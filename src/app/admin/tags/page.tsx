"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/EmptyState";
import { MOCK_TAGS } from "@/mock/data";
import type { Tag as TagType } from "@/types";
import { toast } from "sonner";

export default function AdminTagsPage() {
  const [tags, setTags] = useState([...MOCK_TAGS]);
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<TagType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (editTarget) {
      setTags((prev) =>
        prev.map((t) => (t.id === editTarget.id ? { ...t, ...form } : t)),
      );
      toast.success("Tag updated");
    } else {
      const newTag: TagType = {
        id: `t${Date.now()}`,
        name: form.name.toLowerCase(),
        slug: form.name.toLowerCase().replace(/\s+/g, "-"),
        postCount: 0,
        createdAt: new Date().toISOString(),
      };
      setTags((prev) => [newTag, ...prev]);
      toast.success("Tag created");
    }
    setEditTarget(null);
    setIsOpen(false);
    setForm({ name: "", slug: "" });
  };

  const handleDelete = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
    toast.success("Tag deleted");
  };

  const openEdit = (tag: TagType) => {
    setEditTarget(tag);
    setForm({ name: tag.name, slug: tag.slug });
    setIsOpen(true);
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tags</h1>
          <p className="text-sm text-muted-foreground">
            {tags.length} tags total
          </p>
        </div>
        <Button
          onClick={() => {
            setEditTarget(null);
            setForm({ name: "", slug: "" });
            setIsOpen(true);
          }}
          className=" cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Tag
        </Button>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          {search && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearch("")}
              className=" cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No tags found"
            icon={<Tag className="w-8 h-8 text-muted-foreground/40" />}
          />
        ) : (
          <div className="p-5">
            {/* Tag cloud view */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filtered
                .sort((a, b) => b.postCount - a.postCount)
                .map((tag, idx) => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group flex items-center gap-1.5 border rounded-full px-3 py-1.5 bg-card hover:border-primary/40 transition-all"
                  >
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-medium">#{tag.name}</span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 h-4 ml-1"
                    >
                      {tag.postCount}
                    </Badge>
                    <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                      <button
                        onClick={() => openEdit(tag)}
                        className="p-0.5 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setDeleteId(tag.id)}
                        className="p-0.5 hover:text-danger transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Table view */}
            <div className="border-t pt-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                By Post Count
              </p>
              <div className="space-y-1">
                {[...filtered]
                  .sort((a, b) => b.postCount - a.postCount)
                  .slice(0, 10)
                  .map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-sm font-medium flex-1">
                        #{tag.name}
                      </span>
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${Math.min(100, (tag.postCount / 30) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right">
                        {tag.postCount} posts
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-pointer"
                          onClick={() => openEdit(tag)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-danger hover:bg-danger/10 cursor-pointer"
                          onClick={() => setDeleteId(tag.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Tag" : "New Tag"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Tag Name</Label>
              <Input
                placeholder="e.g. react"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    name: e.target.value.toLowerCase(),
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Lowercase, no spaces (use hyphens)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className=" cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className=" cursor-pointer">
              {editTarget ? "Save" : "Create Tag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this tag and remove it from all
              posts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger hover:bg-danger/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
