'use client';

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Item = {
    id: number,
    name: string,
    description: string,
    price: number,
    image: string,
    owner: {
        name: string;
    };
};
export default function ItemPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm<{ search: string }>();
    const router = useRouter();

    const fetchItems = async (search?: string) => {
        try {
            setLoading(true);
            const res = await api.get('/items', {
                params: search ? { search } : {},
            });
            console.log(res.data);
            setItems(res.data);
        }
        catch (error) {
            console.error(error);
            toast.error('Failed to fetch items');
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const onSearch = (data: { search: string }) => {
        fetchItems(data.search);
        reset();
    };

    const addtocart = async (itemId: number) => {
        try {
            await api.post(`cart/add/${itemId}`);
            toast.success('Item Added to cart.');
        }
        catch {
            toast.error('Cannot add item to cart.');
        }
    }
    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">All Items</h1>
            <button onClick={() => router.push('/cart')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" >Cart!
            </button>
            <form className="flex justify-center mb-8 space-x-2" onSubmit={handleSubmit(onSearch)}>
                <input {...register('search')} placeholder="Search items..." className="border p-2 rounded w-1/2" />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Search
                </button>
            </form>
            {loading ? (
                <p className="text-center text-gray-600">Loading items...</p>
            ) : items.length === 0 ? (
                <p className="text-center text-gray-600">No items found.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded shadow-md">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="mb-4 h-48 w-full object-cover rounded"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            )}
                            <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                            <p className="text-gray-700 mb-2">{item.description}</p>
                            <p className="text-gray-900 font-semibold">₹{item.price}</p>
                            <p className="text-sm text-gray-500 mt-1">Added by: {item.owner.name}</p>
                            <button onClick={() => addtocart(item.id)} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full" >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}