"use client"
import { useEffect } from "react";
import { useUser } from "./provider";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.push('/dashboard');
    }

  }, [user, loading, router]);

  if (loading) {
    return <div className="p-10"><Loader2Icon className='size-4 space-x-2 animate-spin' /> Loading...</div>;
  }

  return (
    <div className="text-green-400">Welcome, {user?.name || ""}</div>
  );
}
