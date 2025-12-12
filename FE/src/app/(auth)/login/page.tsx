import Login_Header from '@/src/components/layout/Login_Header';
import LoginBanner from '@/src/features/auth/components/Login_Banner';
import {LoginForm} from '@/src/features/auth/components/Login_Form';


export default function LoginPage() {
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