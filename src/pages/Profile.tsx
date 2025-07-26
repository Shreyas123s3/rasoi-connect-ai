
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Building, MapPin, Phone, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  business_name?: string;
  location?: string;
  role: 'vendor' | 'supplier';
  phone?: string;
  about?: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          business_name: profile.business_name,
          location: profile.location,
          role: profile.role,
          phone: profile.phone,
          about: profile.about,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
    } catch (err) {
      console.error('Error updating profile:', err);
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
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <div className="text-2xl font-bold">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <div className="text-2xl font-bold">Profile not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-black mb-4">
              MY <span className="text-[#59D35D]">PROFILE</span>
            </h1>
            <p className="text-xl text-gray-700">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Info Card */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <User className="h-6 w-6 text-[#59D35D]" />
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#59D35D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 font-semibold">Email</p>
                  <p className="font-bold text-black">{profile.email}</p>
                </div>
                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleSignOut}
                    variant="destructive"
                    className="w-full font-bold"
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <div className="md:col-span-2">
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-black">
                    <Settings className="h-6 w-6 text-[#59D35D]" />
                    Edit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name" className="text-sm font-bold">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profile.full_name || ''}
                          onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                          placeholder="Enter your full name"
                          className="font-semibold"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role" className="text-sm font-bold">Account Type</Label>
                        <Select value={profile.role} onValueChange={(value: 'vendor' | 'supplier') => setProfile({...profile, role: value})}>
                          <SelectTrigger className="font-semibold">
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
                      <Label htmlFor="business_name" className="text-sm font-bold flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Business Name
                      </Label>
                      <Input
                        id="business_name"
                        value={profile.business_name || ''}
                        onChange={(e) => setProfile({...profile, business_name: e.target.value})}
                        placeholder="Enter your business name"
                        className="font-semibold"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location" className="text-sm font-bold flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={profile.location || ''}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          placeholder="Enter your location"
                          className="font-semibold"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-bold flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Mobile Number
                        </Label>
                        <Input
                          id="phone"
                          value={profile.phone || ''}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          placeholder="Enter your mobile number"
                          className="font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="about" className="text-sm font-bold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        About
                      </Label>
                      <Textarea
                        id="about"
                        value={profile.about || ''}
                        onChange={(e) => setProfile({...profile, about: e.target.value})}
                        placeholder="Tell us about yourself and your business..."
                        rows={4}
                        className="font-semibold resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold text-lg py-3"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
