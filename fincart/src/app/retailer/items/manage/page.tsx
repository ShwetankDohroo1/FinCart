'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import api from '@/lib/api';

// Types
interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface FormData {
    name: string;
    description: string;
    price: number;
    image: FileList;
}

export default function ManageItemsPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm<FormData>();

    // Fetch items
    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await api.get('/items/retailer');
            setItems(res.data);
        } catch {
            toast.error('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Open form for add or edit
    const openForm = (item?: Item) => {
        if (item) {
            setEditId(item.id);
            setValue('name', item.name);
            setValue('description', item.description);
            setValue('price', item.price);
        }
        setShowForm(true);
    };

    // Close form and reset
    const closeForm = () => {
        reset();
        setEditId(null);
        setShowForm(false);
    };

    // Submit handler
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            if (editId) {
                await api.patch(`/items/${editId}`, {
                    name: data.name,
                    description: data.description,
                    price: data.price,
                });
                toast.success('Item updated');
            } else {
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('description', data.description);
                formData.append('price', String(data.price));
                if (data.image.length > 0) {
                    formData.append('image', data.image[0]);
                } else {
                    toast.error('Image is required');
                    return;
                }
                await api.post('/items', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Item added');
            }
            closeForm();
            fetchItems();
        } catch {
            toast.error('Operation failed');
        }
    };

    // Delete handler
    const onDelete = async (id: number) => {
        try {
            await api.delete(`/items/${id}`);
            toast.success('Item deleted');
            fetchItems();
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Your Items</h1>
                    <button
                        onClick={() => openForm()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-shadow hover:shadow-lg"
                    >
                        + Add Item
                    </button>
                </header>

                {/* Items Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <p className="col-span-full text-center text-gray-500">Loading items...</p>
                    ) : items.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">
                            No items found. Click "Add Item" to create one.
                        </p>
                    ) : (
                        items.map((item) => (
                            <motion.div
                                key={item.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden group"
                                whileHover={{ scale: 1.03 }}
                            >
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-48 w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                                        {item.name}
                                    </h3>
                                    <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
                                    <p className="mt-4 font-bold text-gray-800">${item.price}</p>
                                    <div className="mt-4 flex justify-end space-x-4">
                                        <button
                                            onClick={() => openForm(item)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Modal Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.form
                                onSubmit={handleSubmit(onSubmit)}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
                                initial={{ y: 50 }}
                                animate={{ y: 0 }}
                                exit={{ y: 50 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                    {editId ? 'Edit Item' : 'Add New Item'}
                                </h2>
                                <div className="space-y-4">
                                    <input
                                        {...register('name')}
                                        placeholder="Item Name"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                    <textarea
                                        {...register('description')}
                                        placeholder="Description"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                    <input
                                        type="number"
                                        {...register('price', { valueAsNumber: true })}
                                        placeholder="Price"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                    {!editId && (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...register('image')}
                                            className="w-full"
                                            required
                                        />
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                >
                                    {editId ? 'Update Item' : 'Add Item'}
                                </button>
                            </motion.form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
