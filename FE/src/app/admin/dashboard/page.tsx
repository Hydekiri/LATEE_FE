import DashboardPage from "@/src/features/admin/components/DashboardPage";
import { checkIsAdminLoggedIn, getCurrentUser } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";


export const dynamic = "force-dynamic";
export const metadata = {
    title: "Latee | Admin Dashboard",
    description: "Welcome to Latee. A smarter way to practice clinical decision-making.",
};
export default async function AdminDashboardPage() {
    const isAdminLoggedIn = await checkIsAdminLoggedIn();

    if (!isAdminLoggedIn) {
        console.log("Admin has not been logged in. Redirect to login page....");
        redirect('/admin');
    }

    const currentAdmin = await getCurrentUser();

    return (
        <div>
            <DashboardPage adminId={currentAdmin?.userId || ''} adminName={currentAdmin?.username || ''} adminAvatarURL={currentAdmin?.avatarUrl || ''} />
        </div>
    );
}