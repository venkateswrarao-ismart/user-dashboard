import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  RefreshCw, 
  User as UserIcon, 
  Settings, 
  Save, 
  Shield, 
  KeyRound 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const userProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const UserProfile = () => {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view your profile.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthLoading, isAuthenticated, navigate, toast]);

  // Fetch user details
  const { 
    data: userData, 
    isLoading: isUserLoading,
    refetch: refetchUser
  } = useQuery({
    queryKey: [`/api/users/${user?.id}`],
    enabled: isAuthenticated && !!user?.id,
  });

  // Profile form
  const profileForm = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (userData) {
      profileForm.reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
      });
    }
  }, [userData, profileForm]);

  const onProfileSubmit = async (data: z.infer<typeof userProfileSchema>) => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    try {
      await apiRequest("PUT", `/api/users/${user.id}`, data);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      refetchUser();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data: z.infer<typeof passwordChangeSchema>) => {
    if (!user?.id) return;
    
    setIsChangingPassword(true);
    try {
      await apiRequest("PUT", `/api/users/${user.id}/password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
      
      passwordForm.reset();
    } catch (error) {
      console.error("Failed to change password:", error);
      toast({
        title: "Password change failed",
        description: "There was an error changing your password. Please check your current password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isAuthLoading || isUserLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Helmet>
        <title>My Profile | MultiVendor Marketplace</title>
        <meta name="description" content="View and edit your profile information, change password, and manage your account settings." />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account information and contact details
                  </CardDescription>
                </CardHeader>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your first name" 
                                  {...field} 
                                  disabled={isUpdating}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your last name" 
                                  {...field} 
                                  disabled={isUpdating}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Your email address" 
                                {...field} 
                                disabled={isUpdating}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>Username</FormLabel>
                        <Input 
                          value={userData?.username || user.username} 
                          disabled 
                          className="bg-gray-50"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Your username cannot be changed.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-blue-600"
                        disabled={isUpdating || !profileForm.formState.isDirty}
                      >
                        {isUpdating ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
              
              {/* Account Management */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Vendor Status</h3>
                    <p className="text-gray-600 mb-2">
                      {user.isVendor ? 
                        "You are a registered vendor." : 
                        "You are currently a customer. Become a vendor to start selling products."}
                    </p>
                    {!user.isVendor && (
                      <Button 
                        variant="outline" 
                        className="text-primary border-primary"
                        onClick={() => navigate("/vendor/register")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Become a Vendor
                      </Button>
                    )}
                    {user.isVendor && (
                      <Button 
                        variant="outline" 
                        className="text-primary border-primary"
                        onClick={() => navigate("/vendor/dashboard")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Vendor Dashboard
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Delete Account</h3>
                    <p className="text-gray-600 mb-2">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <KeyRound className="mr-2 h-5 w-5 text-primary" />
                    <CardTitle>Change Password</CardTitle>
                  </div>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your current password" 
                                {...field} 
                                disabled={isChangingPassword}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter new password" 
                                {...field} 
                                disabled={isChangingPassword}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm new password" 
                                {...field} 
                                disabled={isChangingPassword}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-blue-600"
                        disabled={isChangingPassword}
                      >
                        {isChangingPassword ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
              
              {/* Security Settings */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-gray-600 mb-2">
                      Enhance your account security by enabling two-factor authentication.
                    </p>
                    <Button 
                      variant="outline" 
                      className="text-primary border-primary"
                      disabled
                    >
                      Enable Two-Factor Authentication
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      This feature is coming soon.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-medium mb-2">Login History</h3>
                    <p className="text-gray-600 mb-2">
                      View your recent login activity.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Login history is not currently available.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
