import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type VendorRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const vendorRegisterSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessEmail: z.string().email("Please enter a valid email"),
  businessPhone: z.string().min(10, "Please enter a valid phone number"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type VendorRegisterFormValues = z.infer<typeof vendorRegisterSchema>;

const VendorRegisterModal = ({ isOpen, onClose }: VendorRegisterModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<VendorRegisterFormValues>({
    resolver: zodResolver(vendorRegisterSchema),
    defaultValues: {
      businessName: "",
      businessEmail: "",
      businessPhone: "",
      category: "",
      description: "",
    },
  });

  const onSubmit = async (values: VendorRegisterFormValues) => {
    setIsLoading(true);
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account first.",
        variant: "destructive",
      });
      setIsLoading(false);
      onClose();
      return;
    }
    
    try {
      await apiRequest("POST", "/api/shop-owner-registrations", values);
      
      toast({
        title: "Vendor registration successful",
        description: "Your vendor application has been submitted for approval.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      console.error("Vendor registration failed:", error);
      toast({
        title: "Registration failed",
        description: "There was an error submitting your vendor application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-gray-800">Become a Vendor</DialogTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogDescription>
            Fill out the form below to apply as a vendor on our marketplace.
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="text-center py-4">
            <p className="mb-4 text-gray-600">You need to be signed in to register as a vendor.</p>
            <Button 
              className="bg-primary hover:bg-blue-600" 
              onClick={onClose}
            >
              Sign In First
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your Business Name" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="business@example.com" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 123-456-7890" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                        <SelectItem value="home-decor">Home & Decor</SelectItem>
                        <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                        <SelectItem value="food">Food & Beverages</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe your business and the products you plan to sell" 
                        className="resize-none" 
                        rows={4}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Submitting Application..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VendorRegisterModal;
