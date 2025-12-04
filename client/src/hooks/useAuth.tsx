
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/lib/supabase";

// type User = {
//   id: number;
//   username: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   isVendor: boolean;
// };

// type AuthContextType = {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: RegisterData) => Promise<void>;
//   logout: () => Promise<void>;
//   checkSession: () => Promise<void>;
// };

// type RegisterData = {
//   email: string;
//   password: string;
//   firstName?: string;
//   lastName?: string;
//   phone?:string;
// };

// type AuthProviderProps = {
//   children: ReactNode;
// };



// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const { toast } = useToast();

//   const checkSession = async (): Promise<void> => {
//     try {
//       const { data: { session }, error } = await supabase.auth.getSession();
//       if (error) throw error;
      
//       if (session?.user) {
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', session.user.id)
//           .single();
          
//         setUser(profile);
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Session check failed:", error);
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkSession();
    
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       checkSession();
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const login = async (email: string, password: string): Promise<void> => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
      
//       if (error) throw error;

//       if (data.user) {
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', data.user.id)
//           .single();
          
//         setUser(profile);
//         toast({
//           title: "Login successful",
//           description: `Welcome back, ${profile.username}!`,
//         });
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       toast({
//         title: "Login failed",
//         description: "Please check your credentials and try again.",
//         variant: "destructive",
//       });
//       throw error;
//     }
//   };

//   const register = async (userData: RegisterData): Promise<void> => {
//   try {
//     // 1️⃣ Sign up the user in Supabase Auth
//     const { data, error } = await supabase.auth.signUp({
//       email: userData.email,
//       password: userData.password,
//     });

//     if (error) throw error;

//     if (data.user) {
//       // 2️⃣ Prepare the profile object matching your table
//       const profile = {
//         id: data.user.id,
//         full_name: `${userData.firstName} ${userData.lastName}`,
//         email: userData.email,
//         role: 'customer', // set role based on your app logic
//         new_onboard: true,
//         phone:userData.phone
//       };

//       // 3️⃣ Insert the profile into the profiles table
//       const { error: profileError } = await supabase
//         .from('profiles')
//         .insert([profile]);

//       if (profileError) {
//         console.error("Profile insert error:", profileError);
//         toast({
//           title: "Registration partially successful",
//           description: "User created but failed to create profile.",
//           variant: "destructive",
//         });
//         throw profileError;
//       }

//       // 4️⃣ Optionally, automatically sign in the user to get session tokens
//       const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
//         email: userData.email,
//         password: userData.password,
//       });

//       if (sessionError) {
//         toast({
//           title: "Registration successful",
//           description: "User created but couldn't sign in automatically.",
//           variant: "warning",
//         });
//       }

//       // 5️⃣ Set local user state
//       setUser({
//         id: data.user.id,
//         full_name: profile.full_name,
//         email: profile.email,
//         role: profile.role,
//       });

//       toast({
//         title: "Registration successful",
//         description: `Welcome, ${userData.firstName}!`,
//       });
//     }
//   } catch (error) {
//     console.error("Registration failed:", error);
//     toast({
//       title: "Registration failed",
//       description: "Please check your information and try again.",
//       variant: "destructive",
//     });
//     throw error;
//   }
// };



//   const logout = async (): Promise<void> => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
      
//       setUser(null);
//       toast({
//         title: "Logged out",
//         description: "You have been successfully logged out.",
//       });
//     } catch (error) {
//       console.error("Logout failed:", error);
//       toast({
//         title: "Logout failed",
//         description: "There was an issue logging you out. Please try again.",
//         variant: "destructive",
//       });
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         isLoading,
//         login,
//         register,
//         logout,
//         checkSession,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  new_onboard: boolean;
  // Add other profile fields as needed
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
};

type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    is_default?: boolean;
    address_type?: string;
    name?: string;
    phone?: string;
    landmark?: string;
  };
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const checkSession = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession();
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        setUser(profile);
        toast({
          title: "Login successful",
          description: `Welcome back, ${profile.full_name || 'User'}!`,
        });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
  try {
    setIsLoading(true);
    
    // 1️⃣ Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User registration failed');

    // 2️⃣ Prepare the profile object
    const profile = {
      id: authData.user.id,
      full_name: `${userData.firstName} ${userData.lastName}`.trim(),
      email: userData.email,
      role: 'customer',
      new_onboard: true,
      phone: userData.phone || null,
    };

    // 3️⃣ Insert the profile into the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([profile]);

    if (profileError) {
      console.error("Profile insert error:", profileError);
      
      // Try to delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      throw new Error(profileError.message || "Failed to create user profile");
    }

    // 4️⃣ Create address if provided
    if (userData.address && userData.address.address_line1) {
      const addressData = {
        user_id: authData.user.id,
        name: userData.address.name || `${userData.firstName}'s Address`,
        address_type: userData.address.address_type || 'home',
        address_line1: userData.address.address_line1,
        address_line2: userData.address.address_line2 || null,
        city: userData.address.city || null,
        state: userData.address.state || null,
        postal_code: userData.address.postal_code || null,
        country: userData.address.country || 'India',
        phone: userData.address.phone || userData.phone || null,
        landmark: userData.address.landmark || null,
        is_default: userData.address.is_default !== false, // Default to true
        latitude: null,
        longitude: null,
      };

      const { error: addressError } = await supabase
        .from('user_addresses')
        .insert([addressData]);

      if (addressError) {
        console.warn("Address creation failed, but user was created:", addressError);
        // Don't fail registration if address creation fails
        toast({
          title: "Note",
          description: "User created, but address could not be saved. You can add it later.",
          variant: "warning",
        });
      }
    }

    // 5️⃣ Automatically sign in the user
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });

      if (sessionError) {
        console.warn("Auto-login failed:", sessionError);
        // Continue even if auto-login fails
      } else if (sessionData.user) {
        // Set user state if login successful
        setUser(profile);
      }
    } catch (loginError) {
      console.warn("Auto-login error:", loginError);
      // User will need to log in manually
    }

    toast({
      title: "Registration successful!",
      description: `Welcome to RENTXP, ${userData.firstName}!`,
    });

  } catch (error: any) {
    console.error("Registration failed:", error);
    toast({
      title: "Registration failed",
      description: error.message || "Please check your information and try again.",
      variant: "destructive",
    });
    throw error;
  } finally {
    setIsLoading(false);
  }
};

  // const register = async (userData: RegisterData): Promise<void> => {
  //   try {
  //     setIsLoading(true);
      
  //     // 1️⃣ Sign up the user in Supabase Auth
  //     const { data: authData, error: authError } = await supabase.auth.signUp({
  //       email: userData.email,
  //       password: userData.password,
  //       options: {
  //         data: {
  //           first_name: userData.firstName,
  //           last_name: userData.lastName,
  //           phone: userData.phone,
  //         },
  //       },
  //     });

  //     if (authError) throw authError;
  //     if (!authData.user) throw new Error('User registration failed');

  //     // 2️⃣ Prepare the profile object
  //     const profile = {
  //       id: authData.user.id,
  //       full_name: `${userData.firstName} ${userData.lastName}`.trim(),
  //       email: userData.email,
  //       role: 'customer',
  //       new_onboard: true,
  //       phone: userData.phone || null,
  //     };

  //     // 3️⃣ Insert the profile into the profiles table
  //     const { error: profileError } = await supabase
  //       .from('profiles')
  //       .insert([profile]);

  //     if (profileError) {
  //       console.error("Profile insert error:", profileError);
        
  //       // Try to delete the auth user if profile creation fails
  //       await supabase.auth.admin.deleteUser(authData.user.id);
        
  //       throw new Error(profileError.message || "Failed to create user profile");
  //     }

  //     // 4️⃣ Create address if provided
  //     if (userData.address && userData.address.address_line1) {
  //       const addressData = {
  //         user_id: authData.user.id,
  //         name: userData.address.name || `${userData.firstName}'s Address`,
  //         address_type: userData.address.address_type || 'home',
  //         address_line1: userData.address.address_line1,
  //         address_line2: userData.address.address_line2 || null,
  //         city: userData.address.city || null,
  //         state: userData.address.state || null,
  //         postal_code: userData.address.postal_code || null,
  //         country: userData.address.country || 'India',
  //         phone: userData.address.phone || userData.phone || null,
  //         landmark: userData.address.landmark || null,
  //         is_default: userData.address.is_default || true,
  //         latitude: null,
  //         longitude: null,
  //       };

  //       const { error: addressError } = await supabase
  //         .from('user_addresses')
  //         .insert([addressData]);

  //       if (addressError) {
  //         console.warn("Address creation failed, but user was created:", addressError);
  //         // Don't fail registration if address creation fails
  //         toast({
  //           title: "Note",
  //           description: "User created, but address could not be saved. You can add it later.",
  //           variant: "warning",
  //         });
  //       }
  //     }

  //     // 5️⃣ Automatically sign in the user
  //     const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
  //       email: userData.email,
  //       password: userData.password,
  //     });

  //     if (sessionError) {
  //       console.warn("Auto-login failed:", sessionError);
  //       // Continue even if auto-login fails
  //     }

  //     // 6️⃣ Set local user state
  //     setUser(profile);

  //     toast({
  //       title: "Registration successful!",
  //       description: `Welcome to RENTXP, ${userData.firstName}!`,
  //     });

  //   } catch (error: any) {
  //     console.error("Registration failed:", error);
  //     toast({
  //       title: "Registration failed",
  //       description: error.message || "Please check your information and try again.",
  //       variant: "destructive",
  //     });
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: error.message || "There was an issue logging you out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};