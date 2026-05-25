import UserPage from "@/src/features/admin/components/UserPage";
import { checkIsAdminLoggedIn, getCurrentUser } from "../../authFilterChain";
import { redirect } from 'next/navigation';

export default async function UsersPagez() {
    const isAdminLoggedIn = await checkIsAdminLoggedIn();

    if (!isAdminLoggedIn) {
        console.log("Admin has not been logged in. Redirect to login page....");
        redirect('/admin');
    }

    const currentAdmin = await getCurrentUser();

    return (
        <UserPage adminId={currentAdmin?.userId || ''} adminName={currentAdmin?.username || ''} adminAvatarURL={currentAdmin?.avatarUrl || ''}></UserPage>
    );
}