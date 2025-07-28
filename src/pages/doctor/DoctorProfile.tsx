import type React from "react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Edit2,
  Save,
  X,
  User,
  Mail,
  Stethoscope,
  Heart,
} from "lucide-react";
import BreadcrumbElement from "@/components/BreadcrumbElement";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(authUser?.bio || "");
  const [editedProfilePicture, setEditedProfilePicture] = useState(
    authUser?.profilePicture || ""
  );

  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20">
        <p className="text-muted-foreground text-lg font-medium">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    console.log("Saving profile:", {
      bio: editedBio,
      profilePicture: editedProfilePicture,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBio(authUser.bio || "");
    setEditedProfilePicture(authUser.profilePicture || "");
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditedProfilePicture(imageUrl);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = (role: string) => {
    return role === "doctor" ? (
      <Stethoscope className="h-4 w-4" />
    ) : (
      <Heart className="h-4 w-4" />
    );
  };

  const getRoleColor = (role: string) => {
    return role === "doctor"
      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
      : "bg-green-500/10 text-green-600 border-green-500/20";
  };

  const breadcrumbItems: { name: string; link: string }[] = [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <BreadcrumbElement
          items={breadcrumbItems}
          currentPage="Patient Details"
        />
        <div className="space-y-8 mt-4">
          {/* Header */}
          <div className="flex flex-col items-start justify-between bg-background/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-border/50 space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Profile
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your account information
              </p>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Profile Picture Card */}
            <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-36 w-36 ring-4 ring-border/50 transition-transform group-hover:scale-105">
                    <AvatarImage
                      src={
                        isEditing
                          ? editedProfilePicture
                          : authUser.profilePicture
                      }
                      alt={authUser.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-3xl font-semibold bg-muted/50">
                      {getInitials(authUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer transition-opacity hover:bg-black/70">
                      <Label
                        htmlFor="profile-upload"
                        className="cursor-pointer"
                      >
                        <Camera className="h-10 w-10 text-white/90" />
                        <Input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </Label>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <p className="text-sm text-muted-foreground text-center">
                    Click the camera icon to upload a new profile picture
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Profile Information Card */}
            <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your account details and role information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Info */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Name
                    </Label>
                    <Input
                      value={authUser.name}
                      disabled
                      className="bg-muted/50 border-border/50 text-foreground font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      value={authUser.email}
                      disabled
                      className="bg-muted/50 border-border/50 text-foreground font-medium"
                    />
                  </div>
                </div>

                {/* Role and Doctor ID */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Role & Account Type
                    </Label>
                    <div className="space-y-2">
                      <Badge
                        className={`px-3 py-1 font-medium border ${getRoleColor(
                          authUser.role
                        )}`}
                      >
                        {getRoleIcon(authUser.role)}
                        <span className="ml-1 capitalize">{authUser.role}</span>
                      </Badge>
                      <p className="text-sm text-muted-foreground capitalize">
                        {authUser.role} Account
                      </p>
                    </div>
                  </div>
                  {authUser.doctorId && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Doctor ID</Label>
                      <Input
                        value={authUser.doctorId}
                        disabled
                        className="bg-muted/50 border-border/50 text-foreground font-medium"
                      />
                    </div>
                  )}
                </div>

                <Separator className="bg-border/50" />

                {/* Bio Section */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      placeholder={`Tell us about yourself as a ${authUser.role}...`}
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="min-h-[140px] border-border/50 bg-background/50 text-foreground focus:ring-primary/50"
                    />
                  ) : (
                    <div className="min-h-[140px] p-4 border border-border/50 rounded-lg bg-muted/30 shadow-inner">
                      {authUser.bio ? (
                        <p className="text-sm leading-relaxed text-foreground">
                          {authUser.bio}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No bio added yet. Click "Edit Profile" to add one.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
