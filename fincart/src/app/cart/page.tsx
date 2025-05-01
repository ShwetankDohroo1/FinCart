'use client';

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { withAuth } from "@/lib/withAuth";
export default withAuth(CartPage, ['CUSTOMER']);
type Item = {
    id: number,
    name: string,
    price: number,
    description: string,
    image?: string,
    quantity: number,
};
function CartPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            const parsed = res.data.items.map((entry: any) => ({
                id: entry.item.id,
                name: entry.item.name,
                description: entry.item.description,
                price: entry.item.price,
                image: entry.item.image,
                quantity: entry.quantity,
            }));
            setItems(parsed);
        }
        catch {
            toast.error('Failed to load cart');
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);
    const addItem = async (itemId: number) => {
        // Optimistically update the cart
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );

        try {
            await api.post(`/cart/add/${itemId}`);
            fetchCart(); // Re-fetch cart after the successful action
        } catch {
            toast.error('Failed to add item.');
            fetchCart(); // Re-fetch to reset any changes in case of failure
        }
    };
    const removeItem = async (itemId: number) => {
        // Optimistically update the cart
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );

        try {
            await api.delete(`/cart/remove/${itemId}`);
            toast.success('Item removed.');
            fetchCart(); // Re-fetch after the action
        } catch {
            toast.error('Failed to remove item.');
            fetchCart(); // Re-fetch to reset any changes in case of failure
        }
    };
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <nav className="bg-white shadow mb-6 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                    Cart
                </h2>
                <a href="/items" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Go to Items</a>
            </nav>
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

            {loading ? (
                <p>Loading...</p>
            ) : items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-4 mb-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold">{item.name}</h2>
                                    <p className="text-sm text-gray-700">{item.description}</p>
                                    <p className="text-sm text-gray-900 font-semibold">₹{item.price}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Quantity: {item.quantity} × ₹{item.price} = ₹{item.price * item.quantity}
                                    </p>
                                    <div className="flex space-x-2 mt-2">
                                        <button onClick={() => removeItem(item.id)} className="px-3 py-1 bg-red-500 text-white rounded">–</button>
                                        <button onClick={() => addItem(item.id)} className="px-3 py-1 bg-green-500 text-white rounded">+</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-4 rounded shadow text-right">
                        <p className="text-lg font-semibold">Total: ₹{total}</p>
                    </div>
                </>
            )}
        </div>
    );
}