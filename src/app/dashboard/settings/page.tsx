"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Camera,
  Save,
  Loader2,
  AtSign,
  Code2,
  Link2 as LinkedinIcon,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { userService } from "@/services/client/user-service";

const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(300).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  twitterHandle: z.string().optional(),
  githubHandle: z.string().optional(),
  linkedinHandle: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function UserProfilePage() {
  const { user, updateUser } = useAuth();

  const profileForm = useForm<ProfileData>({
    // @ts-ignore
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      bio: user?.bio ?? "",
      website: user?.website ?? "",
      location: user?.location ?? "",
      twitterHandle: user?.twitterHandle ?? "",
      githubHandle: user?.githubHandle ?? "",
      linkedinHandle: user?.linkedinHandle ?? "",
    },
  });

  const passwordForm = useForm<PasswordData>({
    // @ts-ignore
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileData) => {
    if (!user) return;
    await userService.updateUser(user.id, data);
    updateUser(data);
    toast.success("Profile updated successfully!");
  };

  const onPasswordSubmit = async (_data: PasswordData) => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Password changed successfully!");
    passwordForm.reset();
  };

  return (
    <div className="space-y-6 page-enter max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <div>
          {" "}
          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-6"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar size="lg" className="w-16 h-16">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-lg">
                          {user ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        className="absolute -bottom-1 -right-1 w-6 h-6 cursor-pointer rounded-full bg-primary text-white flex items-center justify-center"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs h-7 cursor-pointer"
                      >
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Full Name</Label>
                      <Input {...profileForm.register("name")} />
                      {profileForm.formState.errors.name && (
                        <p className="text-xs text-danger">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Location</Label>
                      <Input
                        {...profileForm.register("location")}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Bio</Label>
                    <Textarea
                      {...profileForm.register("bio")}
                      placeholder="Tell your readers about yourself…"
                      className="resize-none h-24"
                    />
                    <p className="text-xs text-muted-foreground">
                      {profileForm.watch("bio")?.length ?? 0}/300 characters
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        {...profileForm.register("website")}
                        placeholder="https://yoursite.com"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-sm mb-4">
                      Social Profiles
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <AtSign className="w-4 h-4 text-muted-foreground shrink-0" />
                        <Input
                          {...profileForm.register("twitterHandle")}
                          placeholder="username (without @)"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Code2 className="w-4 h-4 text-muted-foreground shrink-0" />
                        <Input
                          {...profileForm.register("githubHandle")}
                          placeholder="github username"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <LinkedinIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <Input
                          {...profileForm.register("linkedinHandle")}
                          placeholder="linkedin username"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={profileForm.formState.isSubmitting}
                      className=" cursor-pointer"
                    >
                      {profileForm.formState.isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Password Tab */}
          <TabsContent value="password" className="mt-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Change Password</CardTitle>
                <CardDescription>
                  Use a strong, unique password for your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      {...passwordForm.register("currentPassword")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      {...passwordForm.register("newPassword")}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-xs text-danger">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-danger">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={passwordForm.formState.isSubmitting}
                    className=" cursor-pointer"
                  >
                    {passwordForm.formState.isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "New comments on your posts",
                    description: "Get notified when someone comments",
                    key: "comments",
                  },
                  {
                    label: "New followers",
                    description: "When someone follows your profile",
                    key: "follows",
                  },
                  {
                    label: "Post likes",
                    description: "When your post receives likes",
                    key: "likes",
                  },
                  {
                    label: "Mentions",
                    description: "When you are mentioned",
                    key: "mentions",
                  },
                  {
                    label: "Newsletter",
                    description: "Weekly digest of top content",
                    key: "newsletter",
                  },
                  {
                    label: "Product updates",
                    description: "BlogMint feature announcements",
                    key: "updates",
                  },
                ].map(({ label, description, key }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <Switch defaultChecked={key !== "updates"} />
                  </div>
                ))}
                <div className="pt-2">
                  <Button size="sm" className=" cursor-pointer">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="mt-6">
            <Card className="rounded-2xl border-danger/30">
              <CardHeader>
                <CardTitle className="text-base text-danger">
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions — proceed with caution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-danger/20 rounded-xl bg-danger/5">
                  <div>
                    <p className="font-medium text-sm">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete your account and all your data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className=" cursor-pointer"
                  >
                    Delete Account
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Export Data</p>
                    <p className="text-xs text-muted-foreground">
                      Download a copy of all your data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className=" cursor-pointer"
                  >
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
