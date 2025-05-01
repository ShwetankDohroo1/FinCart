'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';

export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    allowedRoles: string[],
): React.FC<P> {
    const ComponentWithAuth: React.FC<P> = (props) => {
        const { user } = useUser();
        const router = useRouter();

        useEffect(() => {
            if (!user) {
                router.replace('/auth/signin');
            } else if (!allowedRoles.includes(user.role)) {
                router.replace('/');
            }
        }, [user, router]);

        return user && allowedRoles.includes(user.role)
            ? <WrappedComponent {...props} />
            : null;
    };

    return ComponentWithAuth;
}
