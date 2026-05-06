import Login_Header from '@/src/components/layout/Login_Header';
import LoginBanner from '@/src/features/auth/components/Login_Banner';
import { LoginForm } from '@/src/features/auth/components/Login_Form';
import { checkIsLoggedInAndRemembered } from '@/src/app/authFilterChain';
import { redirect } from 'next/navigation';

export default async function LoginPage() {

    const isLoggedInAndRemembered = await checkIsLoggedInAndRemembered();

    if (isLoggedInAndRemembered) {
        redirect('/home');
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header Login */}
            <Login_Header />

            {/* Content */}
            <div className="flex flex-1 w-full">
                <LoginBanner />
                <LoginForm />
            </div>
        </div>
    );
}