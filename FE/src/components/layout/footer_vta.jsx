import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full bg-[#333333] text-white py-6 xl:py-10 mt-10 xl:mt-20 flex justify-center items center">
            <div className="w-[90%] grid grid-cols-3 gap-4 xl:gap-20 text-left">
                {/* Cột 1 */}
                <div className="flex grid grid-cols-1 justify-start gap-[20px]">
                    <h2 className="lg:text-[20px] font-medium font-inter">
                        LATEE
                    </h2>

                    <p className="text-white/80 text-[20px] font-inter font-medium">
                        Transform the way you learn medicine!
                    </p>

                    <div className="">
                        <Image
                            src="/images/Location.png"
                            alt="location"
                            width={20}
                            height={20}
                            className="inline-block mr-1 sm:mr-1.5 xl:mr-2 w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5 lg:w-[20px] lg:h-[20px]"
                        />
                        <span className="text-white/80 text-[8px] font-raleway font-medium xl:text-[14px]">
                            Address: HCMUT, HCM City, Viet Nam
                        </span>
                    </div>

                    <div className="">
                        <Image
                            src="/images/Call.png"
                            alt="phone"
                            width={20}
                            height={20}
                            className="inline-block mr-1 sm:mr-1.5 xl:mr-2 w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5 lg:w-[20px] lg:h-[20px]"
                        />
                        <span className="text-white/80 text-[8px] font-raleway font-medium xl:text-[14px]">
                            Tel : 0934870910
                        </span>
                    </div>

                    <div className="">
                        <Image
                            src="/images/Time Circle.png"
                            alt="time"
                            width={20}
                            height={20}
                            className="inline-block mr-1 sm:mr-1.5 xl:mr-2 w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5 lg:w-[20px] lg:h-[20px]"
                        />
                        <span className="text-white/80 text-[8px] font-raleway font-medium xl:text-[14px]">
                            Response hours: 8 to 20
                        </span>
                    </div>

                    <div>
                        <Image
                            src="/images/email.png"
                            alt="email"
                            width={20}
                            height={20}
                            className="inline-block mr-1 sm:mr-1.5 xl:mr-2 w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5 lg:w-[20px] lg:h-[20px]"
                        />
                        <span className="text-white/80 text-[8px] font-raleway font-medium xl:text-[14px] break-all">
                            Email: tu.nguyenhydekiri@hcmut.edu.vn
                        </span>
                    </div>
                </div>

                {/* Cột 2 */}
                <div className="">
                    <h3 className="font-bold mb-2 sm:mb-2.5 xl:mb-3 text-[16px]">
                        Company
                    </h3>
                    <ul className="space-y-1 xl:space-y-5 text-white/80 text-[8px] xl:text-[16px] font-raleway font-medium">
                        <li><a href="#offer" className="hover:text-white">About</a></li>
                        <li><a href="#get" className="hover:text-white">How it Works</a></li>
                        <li><a href="#work" className="hover:text-white">Term</a></li>
                        <li><a href="#testimonial" className="hover:text-white">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Cột 3 */}
                <div className="space-y-5">
                    <h3 className="font-bold mb-2 sm:mb-2.5 xl:mb-3 xl:text-[16px]">
                        More
                    </h3>
                    <p className="text-white/80 text-[8px] xl:text-[16px]">
                        Blog
                    </p>
                    <p className="text-white/80 text-[8px] xl:text-[16px]">
                        About us
                    </p>
                </div>

                <div></div>

                <p className="text-center text-white/70 mt-6 sm:mt-8 xl:mt-10 text-[10px] sm:text-xs xl:text-sm">
                    © 2025 LAVENDER TEEDUCATION.
                </p>
            </div>
        </footer>
    );
}