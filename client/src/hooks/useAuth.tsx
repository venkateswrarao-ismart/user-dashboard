
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type User = {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isVendor: boolean;
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
  firstName?: string;
  lastName?: string;
  phone?:string;
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
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        setUser(profile);
        toast({
          title: "Login successful",
          description: `Welcome back, ${profile.username}!`,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
  try {
    // 1️⃣ Sign up the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw error;

    if (data.user) {
      // 2️⃣ Prepare the profile object matching your table
      const profile = {
        id: data.user.id,
        full_name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: 'customer', // set role based on your app logic
        new_onboard: true,
        phone:userData.phone
      };

      // 3️⃣ Insert the profile into the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profile]);

      if (profileError) {
        console.error("Profile insert error:", profileError);
        toast({
          title: "Registration partially successful",
          description: "User created but failed to create profile.",
          variant: "destructive",
        });
        throw profileError;
      }

      // 4️⃣ Optionally, automatically sign in the user to get session tokens
      const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });

      if (sessionError) {
        toast({
          title: "Registration successful",
          description: "User created but couldn't sign in automatically.",
          variant: "warning",
        });
      }

      // 5️⃣ Set local user state
      setUser({
        id: data.user.id,
        full_name: profile.full_name,
        email: profile.email,
        role: profile.role,
      });

      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.firstName}!`,
      });
    }
  } catch (error) {
    console.error("Registration failed:", error);
    toast({
      title: "Registration failed",
      description: "Please check your information and try again.",
      variant: "destructive",
    });
    throw error;
  }
};


  // const register = async (userData: RegisterData): Promise<void> => {
  //   try {
  //     const { data, error } = await supabase.auth.signUp({
  //       email: userData.email,
  //       password: userData.password,
  //     });
      
  //     if (error) throw error;

  //     if (data.user) {
  //       const profile = {
  //         id: data.user.id,
  //         username: userData.username,
  //         email: userData.email,
  //         firstName: userData.firstName,
  //         lastName: userData.lastName,
  //         isVendor: false,
  //       };
        
  //       const { error: profileError } = await supabase
  //         .from('profiles')
  //         .insert([profile]);
          
  //       if (profileError) throw profileError;
        
  //       setUser(profile);
  //       toast({
  //         title: "Registration successful",
  //         description: `Welcome, ${profile.username}!`,
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

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging you out. Please try again.",
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
