'use client';
import Image from 'next/image';
import Link from "next/link";
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { KnowledgeResource } from '@/src/types/knowledge-resources';

export const BlogCard = ({
    post
}: { post: KnowledgeResource }) => {

    return (
        <Link href={`/blog/${post.id}`}>
            <article className="group animate-fadeIn">
                <div className="relative h-120 w-full mb-6 overflow-hidden rounded-lg shadow-lg transition-all group-hover:shadow-2xl">
                    <Image
                        src={post.imageUrl || "/images/das2.jpeg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5 bg-blue-50 text-[#235697] px-3 py-1 rounded-lg font-bold">
                            <Users className="w-4 h-4" />
                            <span>Authors</span>
                        </div>
                        <p className="line-clamp-1 italic">{post.authorlist}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 text-[#1BA7D9]" />
                        <span>Published: {post.createdAt}</span>
                    </div>
                    <h2 className="text-[#0E2A46] text-2xl font-bold leading-snug group-hover:text-[#235697] transition-colors">
                        {post.title}
                    </h2>
                    <button className="mt-2 w-fit flex items-center gap-2 bg-[#235697] hover:bg-[#1a3f6e] text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md active:scale-95 text-sm">
                        Read more
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </article>
        </Link >
    );
};