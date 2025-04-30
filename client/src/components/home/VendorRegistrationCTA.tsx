import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import VendorRegisterModal from "@/components/auth/VendorRegisterModal";

const vendorFormSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessEmail: z.string().email("Please enter a valid email"),
  businessPhone: z.string().min(10, "Please enter a valid phone number"),
  category: z.string().min(1, "Please select a category"),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

const VendorRegistrationCTA = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      businessName: "",
      businessEmail: "",
      businessPhone: "",
      category: "",
    },
  });
  
  const onSubmit = async (values: VendorFormValues) => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }
    
    setIsLoading(true);
    try {
      // Need to add a description field which is required by the API
      const payload = {
        ...values,
        description: `${values.businessName} - a new vendor in the ${values.category} category.`,
      };
      
      await apiRequest("POST", "/api/shop-owner-registrations", payload);
      
      toast({
        title: "Application submitted",
        description: "Your vendor application has been submitted for review.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Failed to submit vendor application:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLoginThenRegister = () => {
    setIsModalOpen(true);
  };
  
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Start Selling on Our Marketplace</h2>
            <p className="text-lg mb-6 text-blue-100">Join thousands of successful vendors and reach millions of customers worldwide.</p>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center">
                <CheckCircle className="mr-3 text-blue-200 h-5 w-5" />
                <span>Easy setup and store management</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 text-blue-200 h-5 w-5" />
                <span>Access to millions of potential customers</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 text-blue-200 h-5 w-5" />
                <span>Secure payment processing</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 text-blue-200 h-5 w-5" />
                <span>Comprehensive seller dashboard</span>
              </li>
            </ul>
            <Button 
              className="inline-block bg-white text-primary hover:bg-gray-100 transition px-8 py-6 rounded-lg font-medium text-lg"
              onClick={handleLoginThenRegister}
            >
              Become a Vendor
            </Button>
          </div>
          <div className="md:w-5/12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-800 font-bold text-xl mb-4">Vendor Application</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Business Name</FormLabel>
                        <FormControl>
                          <Input 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800" 
                            placeholder="Your Business Name"
                            {...field}
                            disabled={isLoading}
                          />
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
                        <FormLabel className="text-gray-700">Business Email</FormLabel>
                        <FormControl>
                          <Input 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
                            type="email"
                            placeholder="business@example.com"
                            {...field}
                            disabled={isLoading}
                          />
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
                        <FormLabel className="text-gray-700">Business Phone</FormLabel>
                        <FormControl>
                          <Input 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
                            placeholder="123-456-7890"
                            {...field}
                            disabled={isLoading}
                          />
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
                        <FormLabel className="text-gray-700">Business Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800">
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
                  
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      
      <VendorRegisterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default VendorRegistrationCTA;
