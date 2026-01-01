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
import {
  Camera,
  Edit2,
  Save,
  X,
  User,
  Mail,
  Stethoscope,
  Heart,
  Shield,
  Download,
  CreditCard,
} from "lucide-react";
import BreadcrumbElement from "@/components/BreadcrumbElement";
import { CommonStore } from "@/store/CommonStore";
import { PatientStore, type PatientAllData } from "@/store/PatientStore";
import { downloadPatientDataPdf } from "@/utils/downloadPatientData";

const ProfilePage = () => {
  const { authUser, checkAuth } = useAuthStore();
  const { getAllYourData } = PatientStore();
  const { updateProfile } = CommonStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(authUser?.bio || "");
  const [editedProfilePicture, setEditedProfilePicture] = useState(
    authUser?.profilePicture || "",
  );
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );

  const getAllPatientData = () => {
    getAllYourData()
      .then((patientData) => {
        if (patientData) {
          downloadPatientDataPdf(patientData as unknown as PatientAllData);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch patient data:", error);
      });
  };

  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center pt-6 pb-6">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Required
            </h2>
            <p className="text-gray-600 text-center">
              Please log in to view your profile information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile(editedBio, profilePictureFile!).then(() => {
      checkAuth();
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBio(authUser.bio || "");
    setEditedProfilePicture(authUser.profilePicture || "");
    setProfilePictureFile(null);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditedProfilePicture(imageUrl);
      setProfilePictureFile(file);
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
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-purple-50 text-purple-700 border-purple-200";
  };

  const breadcrumbItems: { name: string; link: string }[] = [];

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto px-4 py-2 ">
        <BreadcrumbElement items={breadcrumbItems} currentPage="Profile" />

        {/* Header Section */}
        <div className="mb-8 mt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="w-full">
              <h1 className="text-4xl font-extrabold">Profile</h1>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant={"green"}
                  onClick={() => setIsEditing(true)}
                  className="text-white"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}

              {authUser?.role === "patient" && (
                <Button onClick={getAllPatientData} variant={"green"}>
                  <Download />
                  Download your data
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture & Basic Info */}
          <div className="space-y-6">
            {/* Profile Picture Card */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Profile Picture
                </CardTitle>
                <CardDescription>Update your profile image</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 ring-4 ring-gray-100 shadow-md">
                    <AvatarImage
                      src={
                        isEditing
                          ? editedProfilePicture
                          : authUser.profilePicture
                      }
                      alt={authUser.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-semibold bg-gray-100 text-gray-700">
                      {getInitials(authUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer transition-opacity hover:bg-black/70">
                      <Label
                        htmlFor="profile-upload"
                        className="cursor-pointer"
                      >
                        <Camera className="h-8 w-8 text-white" />
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
                  <p className="text-sm text-gray-600 text-center">
                    Click the camera icon to upload a new photo
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Full Name
                    </p>
                    <p className="text-sm text-gray-600">{authUser.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{authUser.email}</p>
                  </div>
                </div>

                {authUser?.role === "doctor" ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Plan</p>
                      <p className="text-sm text-gray-600">
                        {authUser.subscription?.plan}
                        {" | "}
                        {authUser?.subscription?.status}
                      </p>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {authUser.doctorId && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Professional ID
                      </p>
                      <p className="text-sm text-gray-600">
                        {authUser.doctorId}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your personal details and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      value={authUser.name}
                      disabled
                      className="bg-gray-50 border-gray-200 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      value={authUser.email}
                      disabled
                      className="bg-gray-50 border-gray-200 text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Account Type
                    </Label>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`px-3 py-1 font-medium ${getRoleColor(
                          authUser.role,
                        )}`}
                      >
                        {getRoleIcon(authUser.role)}
                        <span className="ml-2 capitalize">{authUser.role}</span>
                      </Badge>
                    </div>
                  </div>
                  {authUser.doctorId && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Professional ID
                      </Label>
                      <Input
                        value={authUser.doctorId}
                        disabled
                        className="bg-gray-50 border-gray-200 text-gray-900"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Professional Bio
                </CardTitle>
                {authUser.role === "doctor" ? (
                  <CardDescription>
                    Share your background, experience, and specializations
                  </CardDescription>
                ) : (
                  <CardDescription>Share your background</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-medium text-gray-700"
                  >
                    About You
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      placeholder={`Tell us about yourself as a ${authUser.role}...`}
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="min-h-[150px] border-gray-200 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  ) : (
                    <div className="min-h-[150px] p-4 border border-gray-200 rounded-lg bg-gray-50">
                      {authUser.bio ? (
                        <p className="text-sm leading-relaxed text-gray-900">
                          {authUser.bio}
                        </p>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <User className="h-8 w-8 text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500 font-medium">
                            No bio added yet
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Click "Edit Profile" to add your professional bio
                          </p>
                        </div>
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
