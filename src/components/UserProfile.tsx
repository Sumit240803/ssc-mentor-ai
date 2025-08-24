import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, LogOut } from 'lucide-react';

const UserProfile = () => {
  const { user, signOut, updateProfile } = useAuth();
  const { getProfile, uploadFile } = useSupabase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data, error } = await getProfile();
    if (data) {
      setProfile(data);
      setFullName(data.full_name || '');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = profile?.avatar_url;

      // Upload avatar if selected
      if (avatarFile) {
        const { data: uploadData, error: uploadError } = await uploadFile(
          avatarFile,
          'avatars',
          `${user?.id}/avatar.${avatarFile.name.split('.').pop()}`
        );

        if (uploadError) {
          toast({
            title: "Upload Failed",
            description: uploadError.message,
            variant: "destructive",
          });
          return;
        }

        if (uploadData && 'publicUrl' in uploadData) {
          avatarUrl = uploadData.publicUrl;
        }
      }

      // Update profile
      const { error } = await updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl,
      });

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        loadProfile(); // Reload profile data
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setAvatarFile(file);
    }
  };

  if (!user) return null;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage 
              src={avatarFile ? URL.createObjectURL(avatarFile) : profile?.avatar_url} 
              alt={profile?.full_name || user.email} 
            />
            <AvatarFallback className="text-lg">
              {(profile?.full_name || user.email || '').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Upload className="w-4 h-4" />
                <span>Change Avatar</span>
              </div>
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Max size: 5MB. Formats: JPG, PNG, GIF
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfile;