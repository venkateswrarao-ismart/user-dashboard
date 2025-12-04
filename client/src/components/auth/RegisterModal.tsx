// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { X } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";

// type RegisterModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onShowLogin: () => void;
// };

// const registerSchema = z.object({
//   firstName: z.string().optional(),
//   phone: z.string().optional(),
//   lastName: z.string().optional(),
//   email: z.string().email("Please enter a valid email"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   confirmPassword: z.string(),
//   acceptTerms: z.boolean().refine(val => val === true, {
//     message: "You must accept the terms and conditions",
//   }),
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// const RegisterModal = ({ isOpen, onClose, onShowLogin }: RegisterModalProps) => {
//   const { register } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       acceptTerms: false,
//       phone:""
//     },
//   });

//   const onSubmit = async (values: RegisterFormValues) => {
//     setIsLoading(true);
//     try {
//       // Remove confirmPassword and acceptTerms from the data we send to the API
//       const { confirmPassword, acceptTerms, ...userData } = values;
//       await register(userData);
//       form.reset();
//       onClose();
//     } catch (error) {
//       console.error("Registration failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <div className="flex justify-between items-center">
//             <DialogTitle className="text-xl font-bold text-gray-800">Create Account</DialogTitle>
            
//           </div>
//           <DialogDescription>
//             Create a new account to start shopping on our marketplace.
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="firstName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>First Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="John" {...field} disabled={isLoading} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="lastName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Last Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Doe" {...field} disabled={isLoading} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
            
//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone</FormLabel>
//                   <FormControl>
//                     <Input type="tel" placeholder="+1 234 567 8900" {...field} disabled={isLoading} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input type="email" placeholder="john.doe@example.com" {...field} disabled={isLoading} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input type="password" placeholder="********" {...field} disabled={isLoading} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <FormField
//               control={form.control}
//               name="confirmPassword"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Confirm Password</FormLabel>
//                   <FormControl>
//                     <Input type="password" placeholder="********" {...field} disabled={isLoading} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <FormField
//               control={form.control}
//               name="acceptTerms"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                       disabled={isLoading}
//                     />
//                   </FormControl>
//                   <div className="space-y-1 leading-none">
//                     <FormLabel className="text-sm text-gray-600">
//                       I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
//                     </FormLabel>
//                     <FormMessage />
//                   </div>
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               className="w-full bg-primary hover:bg-blue-600"
//               disabled={isLoading}
//             >
//               {isLoading ? "Creating Account..." : "Create Account"}
//             </Button>
//           </form>
//         </Form>

//         <div className="text-center text-gray-600 pt-2">
//           Already have an account?{" "}
//           <button onClick={onShowLogin} className="text-primary hover:underline">
//             Sign In
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default RegisterModal;

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Home, 
  MapPin
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onShowLogin: () => void;
};

// Extended registration schema with address
// const registerSchema = z.object({
//   // Personal Info
//   firstName: z.string().min(2, "First name must be at least 2 characters"),
//   lastName: z.string().min(2, "Last name must be at least 2 characters"),
//   phone: z.string().min(10, "Phone must be at least 10 digits").max(15, "Phone must be at most 15 digits"),
//   email: z.string().email("Please enter a valid email"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   confirmPassword: z.string(),
  
//   // Address Info
//   addressLine1: z.string().min(5, "Address must be at least 5 characters").optional(),
//   addressLine2: z.string().optional(),
//   city: z.string().min(2, "City must be at least 2 characters").optional(),
//   state: z.string().min(2, "State must be at least 2 characters").optional(),
//   postalCode: z.string().min(3, "Postal code must be at least 3 characters").optional(),
//   country: z.string().min(2, "Country must be at least 2 characters").optional(),
  
//   acceptTerms: z.boolean().refine(val => val === true, {
//     message: "You must accept the terms and conditions",
//   }),
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// Update the registerSchema in RegisterModal.tsx
const registerSchema = z.object({
  // Personal Info
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15, "Phone must be at most 15 digits"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  
  // Address Info (all optional)
  addressName: z.string().optional(),
  addressType: z.string().optional().default("home"),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional().default("India"),
  landmark: z.string().optional(),
  setAsDefault: z.boolean().optional().default(false),
  
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterModal = ({ isOpen, onClose, onShowLogin }: RegisterModalProps) => {
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Prepare user data
      const { confirmPassword, acceptTerms, ...userData } = values;
      
      // Register user with Supabase Auth
      await register({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: {
          address_line1: userData.addressLine1,
          address_line2: userData.addressLine2,
          city: userData.city,
          state: userData.state,
          postal_code: userData.postalCode,
          country: userData.country,
          is_default: true,
          address_type: "home",
          name: `${userData.firstName}'s Address`,
        }
      });
      
      form.reset();
      onClose();
      
      toast({
        title: "Account Created!",
        description: "Welcome to RENTXP. You can now start shopping.",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    // Validate current tab before switching
    if (value === "address") {
      const personalFields = ['firstName', 'lastName', 'phone', 'email', 'password', 'confirmPassword'];
      const isValid = personalFields.every(field => {
        const fieldValue = form.getValues(field as keyof RegisterFormValues);
        const fieldError = form.getFieldState(field as keyof RegisterFormValues).error;
        return fieldValue && !fieldError;
      });
      
      if (!isValid) {
        form.trigger(personalFields as [keyof RegisterFormValues]);
        return;
      }
    }
    setActiveTab(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-gray-800">Create Account</DialogTitle>
          </div>
          <DialogDescription>
            Create a new account to start shopping on our marketplace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="address" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Address (Optional)
                </TabsTrigger>
              </TabsList>
              
              {/* Personal Info Tab */}
              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="+91 9876543210" 
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="john.doe@example.com" 
                          {...field} 
                          disabled={isLoading} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="********" 
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="********" 
                            {...field} 
                            disabled={isLoading} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button
                  type="button"
                  className="w-full mt-2"
                  onClick={() => handleTabChange("address")}
                >
                  Continue to Address
                </Button>
              </TabsContent>
              
              {/* Address Tab */}
              <TabsContent value="address" className="space-y-4 mt-4">
                <div className="text-sm text-gray-500 mb-4">
                  Adding an address is optional. You can add it later from your profile.
                </div>
                
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Street address, P.O. Box, etc." 
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
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Apartment, suite, unit, building, etc." 
                          {...field} 
                          disabled={isLoading} 
                        />
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
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} disabled={isLoading} />
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
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="110001" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setActiveTab("personal")}
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Terms and Conditions */}
            <div className="mt-6">
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-gray-600">
                        I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <div className="text-center text-gray-600 pt-4 border-t">
          Already have an account?{" "}
          <button onClick={onShowLogin} className="text-primary hover:underline font-medium">
            Sign In
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;