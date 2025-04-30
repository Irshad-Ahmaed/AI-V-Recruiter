"use client";
import { useEffect } from "react";
import { useUser } from "./provider";
import { useRouter } from "next/navigation";
import { ArrowRight, Brain, Loader2Icon, Sparkles, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderComponent from "./_components/HeaderComponent";

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-10"><Loader2Icon className='size-4 space-x-2 animate-spin' /> Loading...</div>;
  }


  return (
    <div>
      <HeaderComponent/>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center space-y-8 max-w-3xl">
            {/* Hero Section */}
            <div className="relative inline-block">
              <Brain className="w-20 h-20 text-blue-600 mb-6 animate-pulse" />
              <Sparkles className="w-8 h-8 text-blue-400 absolute -top-2 -right-2 animate-bounce" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              AI-Powered Recruitment
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your hiring process with intelligent candidate matching and automated screening. Find the perfect talent faster than ever before.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
              {[
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Smart Matching",
                  description: "AI-powered algorithms match candidates to your exact requirements"
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: "Automated Screening",
                  description: "Intelligent resume parsing and candidate assessment"
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Talent Analytics",
                  description: "Deep insights into your candidate pool and hiring trends"
                }
              ].map((feature, index) => (
                <div key={index} className="p-6 rounded-xl bg-white shadow-lg border border-blue-300 hover:border-blue-200 hover:shadow-xl transform hover:scale-110 duration-500">
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[
                { value: "85%", label: "Time Saved" },
                { value: "3x", label: "Better Matches" },
                { value: "95%", label: "Accuracy Rate" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white group px-8 py-6 text-lg"
                onClick={() => router.push('/dashboard')} // Example navigation
              >
                Start Recruiting
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="mt-16 text-gray-500 text-sm">
              Trusted by leading companies worldwide
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}