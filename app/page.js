"use client"
import { useEffect } from "react";
import { useUser } from "./provider";
import { useRouter } from "next/navigation";

export default function Home() {
  const {user} = useUser();
  const router = useRouter();

  useEffect(()=>{
    if(user){
      router.push('/dashboard');
    } else{
      router.push('/auth');
    }
  }, [user]);

  return (
    <div className="text-green-400">Welcome, {user?.name || ""}</div>
  );
}
