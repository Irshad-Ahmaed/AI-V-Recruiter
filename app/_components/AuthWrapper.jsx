"use client";
import { Loader2Icon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../provider";

const AuthWrapper = ({ children }) => {
  const { user, loading } = useUser();
  const router = useRouter();
  const path = usePathname();
  const { interview_id } = useParams();

  useEffect(() => {
    if (loading) return;

    const publicRoutes = ['/', '/auth', `/interview/${interview_id}`];

    // Only protect known routes, not missing ones
    const isPublicRoute = publicRoutes.includes(path);
    const isProtected = !isPublicRoute;

    if (!user && isProtected) {
      router.replace("/"); 
    }
  }, [user, loading, router, path, interview_id]);


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