import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Fixed import
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home, 
  MapPin, 
  Trash2, 
  Edit, 
  Plus, 
  CheckCircle, 
  Save,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Address type definition
type Address = {
  id: string;
  user_id: string;
  address_type: string;
  is_default: boolean;
  name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  landmark: string | null;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
};

// Form validation schema
const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address_type: z.string().default("home"),
  address_line1: z.string().min(5, "Address must be at least 5 characters"),
  address_line2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postal_code: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(2, "Country must be at least 2 characters").default("India"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  landmark: z.string().optional(),
  is_default: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const UserAddresses = () => {
  const navigate = useNavigate(); // Correct hook
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Initialize form
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      address_type: "home",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      phone: "",
      landmark: "",
      is_default: false,
    },
  });

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    fetchAddresses();
  }, [user, isAuthenticated, navigate]);

  // Handle form submission
  const onSubmit = async (values: AddressFormValues) => {
    if (!user) return;

    try {
      // If setting as default, unset other defaults first
      if (values.is_default) {
        const { error: updateError } = await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .eq('is_default', true);

        if (updateError) throw updateError;
      }

      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('user_addresses')
          .update({
            ...values,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAddress.id)
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        // Create new address
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            ...values,
            user_id: user.id,
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }

      // Reset and refresh
      form.reset();
      setEditingAddress(null);
      setIsDialogOpen(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
    }
  };

  // Handle delete address
  const handleDelete = async (addressId: string) => {
    if (!user) return;

    try {
      setIsDeleting(addressId);
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
      
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle set as default
  const handleSetDefault = async (addressId: string) => {
    if (!user) return;

    try {
      // Start a transaction: unset all defaults, then set the selected one
      const { error: unsetError } = await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);

      if (unsetError) throw unsetError;

      const { error: setError } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (setError) throw setError;

      toast({
        title: "Success",
        description: "Default address updated",
      });
      
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: "Error",
        description: "Failed to set default address",
        variant: "destructive",
      });
    }
  };

  // Handle edit address
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.reset({
      name: address.name || "",
      address_type: address.address_type || "home",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "India",
      phone: address.phone || "",
      landmark: address.landmark || "",
      is_default: address.is_default || false,
    });
    setIsDialogOpen(true);
  };

  // Get address type icon
  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <MapPin className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Manage Addresses | RENTXP</title>
        <meta name="description" content="Manage your delivery addresses" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
              <p className="text-gray-600">Manage your delivery addresses</p>
            </div>
            <Button 
              onClick={() => {
                setEditingAddress(null);
                form.reset({
                  name: "",
                  address_type: "home",
                  address_line1: "",
                  address_line2: "",
                  city: "",
                  state: "",
                  postal_code: "",
                  country: "India",
                  phone: "",
                  landmark: "",
                  is_default: false,
                });
                setIsDialogOpen(true);
              }}
              className="bg-primary hover:bg-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : addresses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                  <p className="text-gray-500 mb-6">Add an address to get started with your orders</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-primary hover:bg-blue-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <Card 
                  key={address.id} 
                  className={`relative ${address.is_default ? 'border-primary border-2' : ''}`}
                >
                  {address.is_default && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Default
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getAddressTypeIcon(address.address_type)}
                        <span className="ml-2 text-sm font-medium capitalize">
                          {address.address_type}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{address.name || 'Untitled Address'}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{address.address_line1}</p>
                      {address.address_line2 && <p>{address.address_line2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p>{address.country}</p>
                      {address.landmark && <p>Landmark: {address.landmark}</p>}
                      {address.phone && <p>Phone: {address.phone}</p>}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(address)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      
                      {!address.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      disabled={isDeleting === address.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {isDeleting === address.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {editingAddress 
                ? 'Update your address details' 
                : 'Add a new delivery address for your orders'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Home, Office, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="110001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address_line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1 *</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address, P.O. Box, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landmark (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nearby landmark for easy delivery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Set as default address
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        This will be your primary delivery address
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingAddress(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-blue-600">
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAddresses;