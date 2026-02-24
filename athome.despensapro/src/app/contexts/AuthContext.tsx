import { createContext, useContext, useEffect, useState } from "react";
import { createClient, Session, User } from "@supabase/supabase-js";
import { projectId, publicAnonKey, functionName } from "/utils/supabase/info";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  ensureDemoUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Use Supabase Auth directly instead of Edge Function
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        // In development, this will send a confirmation email
        // For production, configure email settings in Supabase dashboard
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    
    if (error) {
      throw error;
    }
    
    // If email confirmation is disabled, user will be automatically logged in
    // Otherwise, they need to confirm their email
    if (data.user && !data.session) {
      // Email confirmation required
      throw new Error("Verifique seu email para confirmar o cadastro");
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };
  
  const ensureDemoUser = async () => {
    try {
      console.log("[Auth] Ensuring demo user exists...");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/${functionName}/create-demo-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (response.ok) {
        console.log("[Auth] Demo user is ready");
      } else {
        console.error("[Auth] Failed to ensure demo user:", await response.text());
      }
    } catch (error) {
      console.error("[Auth] Error ensuring demo user:", error);
      // Don't throw - this is a background operation
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    ensureDemoUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export supabase client for use in other parts of the app
export { supabase };