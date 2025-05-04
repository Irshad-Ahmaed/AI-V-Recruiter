"use client";
import { UserDetailContext } from '@/context/UserDetailContext';
import { supabase } from '@/services/supabase-client';
import React, { useContext, useEffect, useState } from 'react';

const Provider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // 👈 Add loading state

    useEffect(() => {
        const CreateNewUser = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                setUser(null);
                setLoading(false);
                return;
            }

            let { data: Users, error } = await supabase
                .from('Users')
                .select('*')
                .eq('email', user.email);

            if (error) {
                console.error('Error While fetching User', error);
                setLoading(false);
                return;
            }

            // Create user if no user found:
            if (Users?.length === 0) {
                if (!user.email || !user.user_metadata?.name) {
                    setLoading(false);
                    return;
                }

                const { data: newUser, error: insertError } = await supabase.from('Users').insert([
                    {
                        name: user.user_metadata.name,
                        userName: user.user_metadata.name,
                        email: user.email,
                        picture: user.user_metadata.picture,
                    },
                ]).select();

                if (insertError) {
                    console.error('Error creating new user', insertError);
                }

                setUser(newUser?.[0] || null);
            } else {
                setUser(Users[0]);
            }

            setLoading(false); // ✅ Done loading
        };

        CreateNewUser();
    }, []);

    return (
        <UserDetailContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserDetailContext.Provider>
    );
};

export default Provider;

export const useUser = () => {
    const context = useContext(UserDetailContext);
    return context;
};