import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { 
  User, 
  Mail, 
  Calendar,
  Edit,
  Save,
  X,
  Upload,
  Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { uploadFile, getProfile } = useSupabase();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    avatar_url: ""
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await getProfile();
      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || user?.email || "",
          avatar_url: data.avatar_url || ""
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose an image smaller than 2MB.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await uploadFile(file, 'avatars', `${user?.id}/avatar`);
      if (error) throw error;

      if (data && 'publicUrl' in data) {
        setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
        toast({
          title: "Avatar uploaded",
          description: "Your avatar has been uploaded successfully."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-card">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback className="text-xl">
                      {profile.full_name ? getInitials(profile.full_name) : <User className="w-8 h-8" />}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {profile.full_name || "Student"}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {profile.email}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {user?.created_at ? formatDate(user.created_at) : 'Recently'}</span>
                </div>
              </div>
            </Card>

            {/* Account Info */}
            <Card className="p-6 border-0 shadow-card mt-6">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Account Security
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email Verified</span>
                  <span className="text-secondary font-medium">✓ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Two-Factor Auth</span>
                  <span className="text-muted-foreground">Not enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="text-muted-foreground">Today</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-0 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Personal Information
                </h3>
                {!isEditing ? (
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        loadProfile(); // Reset changes
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed here. Contact support if needed.
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Profile Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use your real name to help others identify you</li>
                      <li>• Upload a clear profile picture (max 2MB)</li>
                      <li>• Keep your information up to date</li>
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            {/* Study Stats */}
            <Card className="p-6 border-0 shadow-card mt-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Study Statistics
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">156</div>
                  <div className="text-sm text-muted-foreground">Study Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">43</div>
                  <div className="text-sm text-muted-foreground">Lectures Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">12</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;