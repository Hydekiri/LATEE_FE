import BlogFeature from "@/src/features/blog/page";
import { checkIsLoggedInAndRedirectToLogin } from "../../authFilterChain";

export default async function BlogPage() {
    const checkIsLoggedInAndRedirectToLoginResult = await checkIsLoggedInAndRedirectToLogin();

    return <BlogFeature />;
}