'use Client';

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { withAuth } from "@/lib/withAuth";

type Item = {
    id: number,
    name: string,
    price: number,
    description: string,
    image?: string
};
function CartPage(){
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        api.get('/cart').then((res)=> setItems(res.data.items)).catch(()=> toast.error('Failed to load cart')).finally(()=> setLoading(false));
    },[]);
    const removeItem = async(itemId: number) => {
        try{
            await api.delete(`/cart/remove/${itemId}`);
            toast.success('Item removed.');
            setItems(items.filter((i)=>i.id !== itemId));
        }
        catch{
            toast.error('Cant remove item for some reason.');
        }
    }
    return(
        
    );
}