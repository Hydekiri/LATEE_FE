'use client';
import { ChevronRight } from 'lucide-react';
import { BlogCard } from "@/src/features/blog/components/BlogCard";
import { BlogPagination } from "@/src/features/blog/components/BlogPagination";
import { BLOG_DATA } from '@/src/data/blogData';

export const BlogList = () => {
    return (
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <span className="hover:text-[#235697] cursor-pointer transition-colors">Blog</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#235697]">Clinical Care</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-300">Page 1</span>
            </div>

            {/* List */}
            <div className="flex flex-col gap-20">
                {BLOG_DATA.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>

            {/* Pagination */}
            <BlogPagination />
        </div>
    );
};