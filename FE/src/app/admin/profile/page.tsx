import UserPage from "@/src/features/admin/components/UserPage";
import { checkIsAdminLoggedIn, getCurrentUser } from "../../authFilterChain";
import { redirect } from 'next/navigation';
import ProfilePage from "@/src/features/admin/components/ProfilePage";

export default async function ProfilePagez() {
    const isAdminLoggedIn = await checkIsAdminLoggedIn();

    if (!isAdminLoggedIn) {
        console.log("Admin has not been logged in. Redirect to login page....");
        redirect('/admin');
    }

    const currentAdmin = await getCurrentUser();

    return (
        <ProfilePage adminId={currentAdmin?.userId || ''} adminName={currentAdmin?.username || ''} adminAvatarURL={currentAdmin?.avatarUrl || ''} />
    );
}