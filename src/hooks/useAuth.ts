import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";

interface UseAuthOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export const useAuth = () => {
  const { data: session, status } = useSession();
  
  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user
  };
};

export default useAuth;
