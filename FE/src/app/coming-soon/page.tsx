import Login_Header from '@/src/components/layout/Login_Header';
import Link from 'next/link';
// import { checkIsLoggedInAndRemembered, getCurrentUser } from '@/src/app/authFilterChain';
// import { redirect } from 'next/navigation';

export default async function RequireLoginPage() {
    
    // const isLoggedInAndRemembered = await checkIsLoggedInAndRemembered();
    // const currentUser = await getCurrentUser();
    // if (isLoggedInAndRemembered) {
    //     if (currentUser?.role.toLowerCase() === 'expert') {
    //         redirect('/expert');
    //     } else if (currentUser?.role.toLowerCase() === 'learner') {
    //         redirect('/home');
    //     }
    // }
    // ----------------------------------------------------------------------

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <Login_Header />

            {/* Content: Require Login */}
            <div className="flex flex-1 flex-col items-center justify-center w-full px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Vui lòng đăng nhập
                </h1>
                
                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl">
                    Mời bạn đăng nhập vào hệ thống để có thể xem nội dung của trang này.
                </p>
                
                {/* Nút chuyển sang trang Login */}
                <Link 
                    href="/login" 
                    className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-[#235697] border border-transparent rounded-lg shadow-sm hover:bg-[#1BA7D9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    Đăng nhập ngay
                </Link>
            </div>
        </div>
    );
}