import VendorRegisterModal from "@/components/auth/VendorRegisterModal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    <section className=" ">
    
    </section>
  );
};

export default VendorRegistrationCTA;
