'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 as Spinner } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { decodeToken } from '@/lib/auth';
import { useUser } from '@/context/userContext';
import toast from 'react-hot-toast';

const formMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' },
};

type SignupData = {
    name: string;
    email: string;
    password: string;
    role: 'CUSTOMER' | 'RETAILER' | 'ADMIN';
};

export default function SignupPage() {
    const { register, handleSubmit } = useForm<SignupData>();
    const router = useRouter();
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<SignupData> = async (data) => {
        setLoading(true);
        const toastId = toast.loading('Creating account...');
        try {
            const res = await api.post('/auth/signup', data);
            const { access_token } = res.data;
            if (typeof access_token !== 'string') {
                throw new Error('Signup response did not include a valid token');
            }
            Cookies.set('token', access_token, { expires: 7 });
            const userData = decodeToken(access_token);
            if (!userData) {
                toast.error('Received invalid token from server');
                return;
            }
            setUser(userData);
            toast.success('Account created!', { id: toastId });
            router.push('/auth/signin');
        } 
        catch (e: any) {
            console.error(e);
            toast.error(e.response?.data?.message || 'Signup failed', { id: toastId });
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <motion.div {...formMotion} className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-3">
                            <Input {...register('name', { required: true })} placeholder="Name" />
                            <Input {...register('email', { required: true })} type="email" placeholder="Email" />
                            <Input {...register('password', { required: true })} type="password" placeholder="Password" />
                            <select
                                {...register('role')}
                                className="w-full border rounded p-2 focus:outline-none focus:ring"
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="RETAILER">Retailer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full mt-4 flex items-center justify-center" disabled={loading}>
                            {loading ? <Spinner className="animate-spin h-5 w-5" /> : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}