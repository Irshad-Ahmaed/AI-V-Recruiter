"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabase-client";
import { Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const InterviewerProfile = () => {
    const [profile, setProfile] = useState({
        userName: "",
        email: "",
        profileImage: "/user.png",
        bio: "",
        domains: "",
        experienceYears: "",
        companies: "",
        linkedin: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    const { user, setUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setProfile({
                userName: user?.userName || "",
                email: user?.email,
                profileImage: user?.picture || "/user.png",
                bio: user?.bio || "",
                domains: user?.domain || "",
                experienceYears: user?.yearOfInterviewExp || "",
                companies: user?.companyName || "",
                linkedin: user?.linkedinUrl || "",
            });
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const preview = URL.createObjectURL(file);
            setProfile({ ...profile, profileImage: preview });
        }
    };

    const saveDetails = async () => {
        try {
            setLoading(true);
            let uploadedImageUrl = profile.profileImage;

            // Upload image if a new file was selected
            if (selectedFile) {
                const filePath = `avatars/${user?.id}-${Date.now()}-${selectedFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from("profile-images")
                    .upload(filePath, selectedFile, {
                        cacheControl: "3600",
                        upsert: true,
                    });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase
                    .storage
                    .from("profile-images")
                    .getPublicUrl(filePath);

                uploadedImageUrl = publicUrlData.publicUrl;
            }

            const { data, error } = await supabase
                .from('Users')
                .update({
                    userName: profile?.userName,
                    picture: uploadedImageUrl,
                    bio: profile?.bio,
                    domain: profile?.domains,
                    yearOfInterviewExp: profile?.experienceYears,
                    companyName: profile?.companies,
                    linkedinUrl: profile?.linkedin
                })
                .eq('email', user?.email)
                .select();

            if (error) {
                console.log(error);
                toast.error("Something want wrong");
            }

            setUser({
                ...user,
                userName: profile?.userName || "",
                picture: uploadedImageUrl || "/user.png",
                bio: profile?.bio || "",
                domain: profile?.domains || "",
                yearOfInterviewExp: profile?.experienceYears || "",
                companyName: profile?.companies || "",
                linkedinUrl: profile?.linkedin || ""
            });

            toast.success("Profile updated");
        } catch (error) {
            console.log(error);
            toast.error("Internal server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 w-full h-fit mt-5 p-6 rounded-xl space-y-6">
            <h2 className="text-2xl font-semibold">Your Profile</h2>

            {/* Profile Image Upload */}
            <div className="flex flex-col lg:flex-row items-start gap-4">
                {/* Profile Image Section */}
                <div className="w-full lg:w-60 flex-shrink-0 flex items-center justify-center">
                    <div className="relative">
                        <img
                            src={profile.profileImage}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover bg-gray-100"
                        />
                        <div className="absolute top-2 right-[-10px]">
                            <label className="cursor-pointer flex items-center justify-center bg-white border rounded-full p-1 hover:bg-gray-100">
                                <Pencil className="size-4 text-gray-700" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
                    <div className="flex-1">
                        <label className="block font-medium">User Name</label>
                        <input
                            type="text"
                            value={profile.userName}
                            onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block font-medium">Email</label>
                        <input
                            type="text"
                            value={profile.email}
                            disabled
                            className="border p-2 rounded-lg w-full bg-gray-100 text-gray-500"
                        />
                    </div>
                </div>
            </div>


            {/* Bio */}
            <div>
                <label className="block font-medium">Professional Summary / Bio</label>
                <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="border p-2 rounded w-full h-24 md:h-28 lg:h-36"
                />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-5 w-full">
                {/* Specialized Domains */}
                <div className="w-full">
                    <label className="font-medium">Specialized Domains</label>
                    <input
                        type="text"
                        value={profile.domains}
                        onChange={(e) => setProfile({ ...profile, domains: e.target.value })}
                        placeholder="e.g., Frontend, Backend, System Design"
                        className="border p-2 rounded-lg w-full"
                    />
                </div>

                {/* Years of Interview Experience */}
                <div className="w-full">
                    <label className="font-medium">Years of Interview Experience</label>
                    <input
                        type="number"
                        value={profile.experienceYears}
                        onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                </div>
            </div>

            <div className="w-full flex flex-col md:flex-row items-center gap-5">
                {/* Company / Past Companies */}
                <div className="w-full">
                    <label className="font-medium">Company / Past Companies</label>
                    <input
                        type="text"
                        value={profile.companies}
                        onChange={(e) => setProfile({ ...profile, companies: e.target.value })}
                        placeholder="e.g., Google, Amazon, etc."
                        className="border p-2 rounded-lg w-full"
                    />
                </div>

                {/* LinkedIn */}
                <div className="w-full">
                    <label className="font-medium">LinkedIn Profile</label>
                    <input
                        type="url"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/your-profile"
                        className="border p-2 rounded-lg w-full"
                    />
                </div>
            </div>

            <div className="w-full flex items-center justify-end">
                <Button onClick={() => saveDetails()} className={'flex items-center gap-2'}>
                    {loading && <Loader2 className="size-4 animate-spin" />} Save Changes
                </Button>
            </div>
        </div>
    );
};

export default InterviewerProfile;