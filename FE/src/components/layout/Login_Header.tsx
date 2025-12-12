'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login_Header() {
  const router = useRouter();

  return (
    <header className="bg-linear-to-r from-[#235697] to-[#1BA7D9] w-full py-3 shadow-md">
      <div className="w-[90%] mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-3">
          <div className="relative w-30 h-10 sm:w-37.5 sm:h-12.5 lg:w-50 lg:h-16">
              <Image 
                src="/images/LATEE2.png" 
                alt="LATEE Logo" 
                fill
                sizes="(max-width: 768px) 150px, 200px"
                className="object-contain object-left" 
                priority
              />
          </div>
            
            
        </div>

        <button
          onClick={() => router.back()}
          className="
            border-2 border-white text-white 
            px-4 py-1.5 
            sm:px-6 sm:py-2 
            lg:px-8 lg:py-2 
            rounded-2xl font-semibold 
            hover:bg-white hover:text-[#235697] 
            transition duration-300 ease-in-out
            cursor-pointer
            text-sm sm:text-base lg:text-lg whitespace-nowrap
          "
        >
          &lt; Quay lại
        </button>
      </div>
    </header>
  );
}