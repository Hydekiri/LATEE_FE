import BlogPageDetails from "@/src/features/blog/BlogPageDetails";
import { checkIsLearnerLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/src/config/env";
import { cookies } from "next/headers";
import { KnowledgeResource } from "@/src/types/knowledge-resources";

export default async function Page({ params, }: { params: Promise<{ id: string }>; }) {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }
    const { id } = await params;


    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${API_BASE_URL}/knowledgeresource/api/knowledge-resources/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
    });
    console.log("Fetch response:", res);

    if (!res.ok) throw new Error("Failed to fetch knowledge resource");
    const data = await res.json();

    const formatData: KnowledgeResource = {
        id: data.id,
        title: data.title,
        content: data.content,
        link: data.link,
        imageUrl: data.imageUrl,
        authorlist: data.authorList,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };

    return <BlogPageDetails data={formatData} />;
}