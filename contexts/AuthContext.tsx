import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { Icon } from '../components/ui';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SupabaseNotConfigured: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-secondary p-4">
      <div className="w-full max-w-2xl p-8 text-center bg-card rounded-xl shadow-lg border border-destructive">
        <Icon name="TriangleAlert" className="mx-auto w-16 h-16 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Configuration Required</h1>
        <p className="mt-2 text-muted-foreground">
          Your Supabase credentials are not set up. Please open the project files and follow the instructions in:
        </p>
        <code className="block w-full p-3 mt-4 text-left bg-secondary rounded-md text-primary font-mono">
          lib/supabase.ts
        </code>
        <p className="mt-4 text-sm text-muted-foreground">
          You need to replace the placeholder values for <code className="text-xs">'YOUR_SUPABASE_URL'</code> and <code className="text-xs">'YOUR_SUPABASE_ANON_KEY'</code> with your actual project credentials from the Supabase dashboard.
        </p>
      </div>
    </div>
  );
  

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  if (!supabase) {
    return <SupabaseNotConfigured />;
  }

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};