import UserPage from "@/src/features/admin/components/UserPage";
import { checkIsAdminLoggedIn, getCurrentUser } from "@/src/app/authFilterChain";
import { redirect } from 'next/navigation';


export const metadata = {
    title: "Latee | Admin Users",
    description: "Welcome to Latee. A smarter way to practice clinical decision-making.",
};
export default async function UsersPage() {
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