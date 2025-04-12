"use client";
import { UserDetailContext } from '@/context/UserDetailContext';
import { supabase } from '@/services/supabase-client';
import React, { useContext, useEffect, useState } from 'react';

const Provider = ({ children }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        CreateNewUser();
    }, []);

    const CreateNewUser = () => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            // Check if User already exists
            let { data: Users, error } = await supabase.from('Users').select('*').eq('email', user?.email);
            if(error){
                console.error('Error While fetching User', error);
                return;
            }

            // Creating the New User
            if (Users?.length === 0) {
                if(!user.email || !user.user_metadata?.name) return;

                if (user) {
                    const { data, error } = await supabase.from('Users')
                        .insert([
                            {
                                name: user?.user_metadata?.name,
                                email: user?.email,
                                picture: user?.user_metadata?.picture
                            }
                        ]);

                    setUser(data);
                    return;
                }
            }

            setUser(Users[0]);
        });
    };

    return (
        <UserDetailContext.Provider value={{ user, setUser }}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    );
};

export default Provider;

export const useUser = () => {
    const context = useContext(UserDetailContext);
    return context;
}; 