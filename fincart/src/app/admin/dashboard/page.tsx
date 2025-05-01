'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type User = {
    id: number;
    name: string;
    email: string;
};

type Item = {
    id: number;
    name: string;
    price: number;
    owner: { name: string };
};

export default function AdminDashboard() {
    const [customers, setCustomers] = useState<User[]>([]);
    const [retailers, setRetailers] = useState<User[]>([]);
    const [items, setItems] = useState<Item[]>([]);

    const fetchData = async () => {
        try {
            const [cust, ret, itm] = await Promise.all([
                api.get('/users/customers'),
                api.get('/users/retailers'),
                api.get('/items'),
            ]);
            console.log('Customers:', cust.data);
            console.log('Retailers:', ret.data);
            console.log('Items:', itm.data);
            setCustomers(cust.data);
            setRetailers(ret.data);
            setItems(itm.data);
        }
        catch {
            toast.error('Failed to load admin data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (id: number) => {
        try {
            await api.delete(`/users/${id}`);
            toast.success('User deleted');
            fetchData();
        }
        catch {
            toast.error('Delete failed');
        }
    };

    const handleDeleteItem = async (id: number) => {
        try {
            await api.delete(`/items/${id}`);
            toast.success('Item deleted');
            fetchData();
        }
        catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Admin Dashboard.</h1>

            <div className="grid gap-10 lg:grid-cols-3">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Customers.</h2>
                    {customers.length === 0 ? (
                        <p>No customers found.</p>
                    ) : (
                        customers.map((user) => (
                            <div key={user.id} className="bg-white p-3 mb-2 rounded shadow flex justify-between">
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">Delete!</button>
                            </div>
                        ))
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Retailers.</h2>
                    {retailers.length === 0 ? (
                        <p>No retailers found.</p>
                    ) : (
                        retailers.map((user) => (
                            <div key={user.id} className="bg-white p-3 mb-2 rounded shadow flex justify-between">
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">Delete!</button>
                            </div>
                        ))
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">All Items:-</h2>
                    {items.length === 0 ? (
                        <p>No items found.</p>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="bg-white p-3 mb-2 rounded shadow">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Price: ${item.price}</p>
                                <p className="text-sm text-gray-500">By: {item.owner.name}</p>
                                <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 mt-1">Delete</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
