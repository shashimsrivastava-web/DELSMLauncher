'use client';

import dynamic from 'next/dynamic';

const RotatingDial = dynamic(() => import('@/components/rotating-dial'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 w-screen h-screen bg-[#07080c] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
    </div>
  ),
});

export default function Home() {
  return <RotatingDial />;
}

