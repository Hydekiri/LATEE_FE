'use client';
import { ChevronRight, Loader2 } from 'lucide-react';
import { BlogCard } from "@/src/features/blog/components/BlogCard";
import { BlogPagination } from "@/src/features/blog/components/BlogPagination";
import { useMemo, useState } from 'react';
import { KnowledgeResource } from '@/src/types/knowledge-resources';

export const BlogList = ({ blogs, loading }: { blogs: KnowledgeResource[], loading: boolean }) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(3);

    const current =
        useMemo(() => {
            const start = (page - 1) * pageSize;
            return blogs.slice(start, start + pageSize);
        }, [page, blogs, pageSize]);

    if (loading) {

        return (

            <div className="col-span-12 lg:col-span-8 flex flex-col gap-16">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl">
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-700" />

                    <span className="text-sm font-medium text-neutral-700">
                        Loading blogs...
                    </span>
                </div>
            </div>
        );


    }

    return (
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <span className="hover:text-[#235697] cursor-pointer transition-colors">Blog</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#235697]">Clinical Knowledge Resources</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-300">Page {page}</span>
            </div>

            {/* List */}
            <div className="flex flex-col gap-20">
                {current.map((item: KnowledgeResource) => (
                    <BlogCard key={item.id} post={item} />
                ))}
            </div>

            {/* Pagination */}
            <BlogPagination
                page={page}
                total={blogs.length}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
            />
        </div>
    );
};