
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building, MapPin, Phone, FileText, LogOut, LogIn } from 'lucide-react';

interface ProfileData {
  full_name: string;
  business_name: string;
  location: string;
  role: 'vendor' | 'supplier';
  phone: string;
  about: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    business_name: '',
    location: '',
    role: 'vendor',
    phone: '',
    about: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
        return;
      }

      console.log('Profile data fetched:', data);
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          business_name: data.business_name || '',
          location: data.location || '',
          role: data.role || 'vendor',
          phone: data.phone || '',
          about: '' // Keep empty since this field doesn't exist in database yet
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      console.log('Saving profile data:', profileData);
      // Exclude the 'about' field since it doesn't exist in the database
      const { about, ...profileDataWithoutAbout } = profileData;
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...profileDataWithoutAbout,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: `Failed to update profile: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Profile updated successfully:', data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon via-lemon/50 to-wisteria/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-2 border-wisteria/30">
          <CardContent className="text-center p-8">
            <LogIn className="mx-auto mb-4 h-16 w-16 text-wisteria" />
            <h2 className="text-2xl font-black text-black mb-2">Profile Access</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your profile</p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="w-full bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon via-lemon/50 to-wisteria/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wisteria mx-auto mb-4"></div>
          <p className="text-black font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lemon via-lemon/50 to-wisteria/30">
      <div className="max-w-2xl mx-auto p-4 min-h-screen">
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-wisteria/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-black text-black flex items-center justify-center gap-2">
              <User className="h-8 w-8" />
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Display */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-gray-600" />
                <Label className="text-sm font-bold text-gray-600">Email</Label>
              </div>
              <p className="text-black font-semibold">{user.email}</p>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name" className="text-sm font-bold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="font-semibold border-wisteria/30"
                />
              </div>

              <div>
                <Label htmlFor="business_name" className="text-sm font-bold flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Business Name
                </Label>
                <Input
                  id="business_name"
                  value={profileData.business_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, business_name: e.target.value }))}
                  placeholder="Enter your business name"
                  className="font-semibold border-wisteria/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter your location"
                  className="font-semibold border-wisteria/30"
                />
              </div>

              <div>
                <Label className="text-sm font-bold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Role
                </Label>
                <Select value={profileData.role} onValueChange={(value: 'vendor' | 'supplier') => setProfileData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="font-semibold border-wisteria/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-bold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Mobile Number
              </Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your mobile number"
                className="font-semibold border-wisteria/30"
              />
            </div>

            <div>
              <Label htmlFor="about" className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                About (Coming Soon)
              </Label>
              <Textarea
                id="about"
                value={profileData.about}
                onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                placeholder="Tell us about yourself... (This field will be saved once database is updated)"
                className="font-semibold border-wisteria/30 min-h-[100px]"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">This field is temporarily disabled until the database schema is updated.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center gap-2 border-2 border-wisteria/30 text-wisteria hover:bg-wisteria hover:text-white font-bold"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
