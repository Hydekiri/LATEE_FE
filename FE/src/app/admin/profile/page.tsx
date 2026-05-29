import { checkIsAdminLoggedIn, getCurrentUser } from "@/src/app/authFilterChain";
import { redirect } from 'next/navigation';
import ProfilePage from "@/src/features/admin/components/ProfilePage";


export const metadata = {
    title: "Latee | Admin Profile",
    description: "Welcome to Latee. A smarter way to practice clinical decision-making.",
};
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