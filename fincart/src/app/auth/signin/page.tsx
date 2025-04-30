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

const motionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' },
};

type SigninData = {
    name: string;
    email: string;
    password: string;
};

export default function SigninPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<SigninData>();
    const router = useRouter();
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<SigninData> = async (data) => {
        setLoading(true);
        const toastId = toast.loading('Signing in...');
        try {
            const res = await api.post('/auth/signin', data);
            const { access_token } = res.data;
            Cookies.set('token', access_token, { expires: 7 });
            const userData = decodeToken(access_token);

            if (!userData) {
                toast.error('Invalid user data', { id: toastId });
                setLoading(false);
                return;
            }
            setUser(userData);
            toast.success('Welcome back!', { id: toastId });
            switch (userData.role) {
                case 'CUSTOMER':
                    router.push('/items');
                    break;
                case 'RETAILER':
                    router.push('/retailer/items/manage');
                    break;
                case 'ADMIN':
                    router.push('/admin/dashboard');
                    break;
                default:
                    router.push('/');
                    break;
            }
        }
        catch (e: any) {
            toast.error(e.response?.data?.message || 'Signin failed', { id: toastId });
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <motion.div {...motionVariants} className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Sign In</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-3">
                            <Input {...register('name', { required: 'Name is required' })} type="text" placeholder="Name"
                            />
                            {errors.name && <p className="text-red-500 text-sm motion-safe:animate-pulse">{errors.name.message}</p>}
                            <Input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email"
                            />
                            {errors.email && <p className="text-red-500 text-sm motion-safe:animate-pulse">{errors.email.message}</p>}
                            <Input {...register('password', { required: 'Password is required' })} type="password" placeholder="Password"
                            />
                            {errors.password && <p className="text-red-500 text-sm motion-safe:animate-pulse">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full mt-4 flex items-center justify-center" disabled={loading}>
                            {loading ? <Spinner className="animate-spin h-5 w-5" /> : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
