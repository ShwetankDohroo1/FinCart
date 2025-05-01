'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#dbeafe] via-[#e0f2fe] to-[#f0fdfa] text-slate-800 transition-colors duration-500">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-t-transparent border-blue-300"></div>
          <p className="text-lg font-medium text-blue-900">Fincart is getting ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f0fdfa] via-[#e0f2fe] to-[#dbeafe] text-slate-800 px-6 text-center transition-colors duration-500">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm text-blue-800">
        Fincart
      </h1>
      <p className="text-base md:text-lg mb-6 max-w-xl text-blue-700">
        Your all-in-one platform to manage spending, track your cart, and handle retail smartly.
      </p>
      <button onClick={() => router.push('/auth/signin')} className="bg-blue-100 text-blue-800 font-medium px-6 py-3 rounded-full shadow hover:bg-blue-200 transition duration-300" >
        Get Started
      </button>
    </div>
  );
}
