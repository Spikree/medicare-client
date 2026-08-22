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
  Pencil,
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
import PageHeader from "@/components/PageHeader";
import { CommonStore } from "@/store/CommonStore";
import { PatientStore, type PatientAllData } from "@/store/PatientStore";
import { downloadPatientDataPdf } from "@/utils/downloadPatientData";

/** One labelled fact in the account summary panel. */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-muted/40 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm">{value}</p>
      </div>
    </div>
  );
}

const ProfilePage = () => {
  const { authUser, checkAuth } = useAuthStore();
  const { getAllYourData } = PatientStore();
  const { updateProfile } = CommonStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(authUser?.bio || "");
  const [editedProfilePicture, setEditedProfilePicture] = useState(
    authUser?.profilePicture || ""
  );
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm p-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted">
            <Shield className="h-5 w-5 text-muted-foreground" />
          </span>
          <h2 className="mt-4 text-base font-semibold">Access required</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Please sign in to view your profile information.
          </p>
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const isDoctor = authUser.role === "doctor";
  const breadcrumbItems: { name: string; link: string }[] = [];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <BreadcrumbElement items={breadcrumbItems} currentPage="Profile" />

        <PageHeader
          title="Profile"
          description="Your account details and how you appear to others."
          actions={
            <>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save />
                    Save changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Pencil />
                  Edit profile
                </Button>
              )}

              {authUser.role === "patient" && (
                <Button variant="outline" onClick={getAllPatientData}>
                  <Download />
                  Download my data
                </Button>
              )}
            </>
          }
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Profile picture</CardTitle>
              <CardDescription>How you appear across MedCare.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-28 w-28 ring-1 ring-border">
                  <AvatarImage
                    src={
                      isEditing ? editedProfilePicture : authUser.profilePicture
                    }
                    alt={authUser.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl">
                    {getInitials(authUser.name)}
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <Label
                    htmlFor="profile-upload"
                    className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-foreground/55 opacity-0 transition-opacity hover:opacity-100"
                  >
                    <Camera className="h-7 w-7 text-background" />
                    <span className="sr-only">Upload a new photo</span>
                    <Input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </Label>
                )}
              </div>

              {isEditing && (
                <p className="text-center text-xs text-muted-foreground">
                  Hover the photo and click the camera to upload a new one.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={User} label="Full name" value={authUser.name} />
              <InfoRow icon={Mail} label="Email" value={authUser.email} />

              {isDoctor && (
                <InfoRow
                  icon={CreditCard}
                  label="Plan"
                  value={
                    <>
                      {authUser.subscription?.plan ?? "—"}
                      {authUser.subscription?.status
                        ? ` · ${authUser.subscription.status}`
                        : ""}
                    </>
                  }
                />
              )}

              {authUser.doctorId && (
                <InfoRow
                  icon={Shield}
                  label="Professional ID"
                  value={authUser.doctorId}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>
                Name and email are managed by your account and can&rsquo;t be
                edited here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full name</Label>
                  <Input id="profile-name" value={authUser.name} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email address</Label>
                  <Input id="profile-email" value={authUser.email} disabled />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Account type</Label>
                  <div>
                    <Badge variant={isDoctor ? "brand" : "info"}>
                      {isDoctor ? (
                        <Stethoscope className="h-3 w-3" />
                      ) : (
                        <Heart className="h-3 w-3" />
                      )}
                      <span className="capitalize">{authUser.role}</span>
                    </Badge>
                  </div>
                </div>

                {authUser.doctorId && (
                  <div className="space-y-2">
                    <Label htmlFor="profile-doctor-id">Professional ID</Label>
                    <Input
                      id="profile-doctor-id"
                      value={authUser.doctorId}
                      disabled
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{isDoctor ? "Professional bio" : "About you"}</CardTitle>
              <CardDescription>
                {isDoctor
                  ? "Your background, experience, and specialisations. Patients can see this."
                  : "A short background your care team can see."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder={`Tell us about yourself as a ${authUser.role}…`}
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="min-h-[160px] resize-none"
                  />
                </div>
              ) : authUser.bio ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {authUser.bio}
                </p>
              ) : (
                <div className="rounded-md border border-dashed border-border px-6 py-10 text-center">
                  <p className="text-sm font-medium">No bio added yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose &ldquo;Edit profile&rdquo; to add one.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
