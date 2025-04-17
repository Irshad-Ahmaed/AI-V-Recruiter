"use client";
import { Loader2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../provider";
import { toast } from "sonner";

const AuthWrapper = ({ children }) => {
  const { user, loading } = useUser();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (loading) return;
    
    if (!user && path !== '/auth') {
      toast.error("Please Login");
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="p-10 flex items-center gap-2">
        <Loader2Icon className="size-4 animate-spin" />
        Loading...
      </div>
    );
  }

  return children;
};

export default AuthWrapper;