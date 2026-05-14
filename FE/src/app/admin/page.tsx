import Admin_Login_Header from '@/src/components/layout/Admin_Login_Header';
import LoginBanner from '@/src/features/auth/components/Login_Banner';
import { checkIsAdminLoggedIn} from '@/src/app/authFilterChain';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/src/features/auth/components/Admin_Login_Form';

export default async function LoginPage() {
    const isAdminLoggedIn: boolean = await checkIsAdminLoggedIn();

    if (isAdminLoggedIn) {
        console.log("Admin is already logged in, redirecting to dashboard...");
        redirect('/admin/dashboard');
    }
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header Login */}
            <Admin_Login_Header />

            {/* Content */}
            <div className="flex flex-1 w-full">
                <LoginBanner />
                <AdminLoginForm />
            </div>
        </div>
    );
}