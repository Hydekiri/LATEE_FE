"use client";

import Image from "next/image";
import { useState } from "react";

export default function SearchBar() {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        console.log("Search text:", query);
    };

    return (
        <section className="w-[86%] flex flex-col items-center">
            <div className="w-full bg-white py-2 xl:py-2 rounded-[5px] xl:rounded-[8px]">

                {/* Container 97% căn giữa */}
                <div className="w-[97%] mx-auto flex items-center">

                    {/* ICON + INPUT */}
                    <div className="flex items-center flex-1">
                        {/* icon trái */}
                        <Image
                            src="/images/searchicon.png"
                            alt="searchicon"
                            width={24}
                            height={24}
                            className="w-4 h-4 xl:w-[23px] xl:h-[23px]"
                        />

                        {/* input tự chiếm phần còn lại */}
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 ml-3 py-1 font-lato-r text-[20px] border-none outline-none"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                    </div>

                    {/* BUTTON SEARCH bên phải */}
                    <div
                        onClick={handleSearch}
                        className="ml-4 flex-shrink-0 flex items-center justify-center
                        w-[120px] xl:w-[207px] h-[45px] xl:h-[55px]
                        bg-gradient-to-r from-[#235697] to-[#1ba7d9]
                        text-[14px] xl:text-[20px] text-white
                        px-4 py-1 rounded-[5px] cursor-pointer
                        font-inter-semibold"
                    >
                        Search
                    </div>
                </div>
            </div>
        </section>
    );
}
