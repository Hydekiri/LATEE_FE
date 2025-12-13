import Image from 'next/image';

export default function Testimonial() {
    return (
        <section id="testimonial" className="w-full  mt-[120px] xl:mt-[224px] flex justify-center items-center">
            <div className="w-[90%] grid grid-cols-2 gap-[60px]">
                <div className="flex justify-start items-start flex-col text-start">
                    <h3 className="xl:text-[40px] font-inter font-semibold mb-2 text-[#1ba7d9]">
                        LATEE -- Learn, Analyze, Think, Evolve !
                    </h3>
                    <p className="text-gray-600 text-[24px] font-lato font-medium">
                        Transform the way you learn medicine !
                    </p>
                </div>

                <div className="bg-none rounded-2xl sm:rounded-3xl flex flex-row gap-6">
                    <div className="flex justify-start sm:justify-start">
                        <Image
                            src="/images/quote.png"
                            alt="quote"
                            width={120}
                            height={120}
                            className="w-10 xl:w-[49px] h-15 xl:h-[40px]"
                        />
                    </div>
                    <div className="flex-1 w-[442px] h-[326px]">
                        <div className="flex justify-start sm:justify-start mb-2 sm:mb-3 xl:mb-4 gap-0.5 gap-1 sm:gap-1">
                            <Image src="/images/star.png" alt="star" width={20} height={20} className="w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5" />
                            <Image src="/images/star.png" alt="star" width={20} height={20} className="w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5" />
                            <Image src="/images/star.png" alt="star" width={20} height={20} className="w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5" />
                            <Image src="/images/star.png" alt="star" width={20} height={20} className="w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5" />
                            <Image src="/images/star.png" alt="star" width={20} height={20} className="w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5" />
                        </div>
                        <p className="text-[#90a3b4] italic font-inter text-[16px] mb-2 sm:mb-4 xl:mb-6 text-left sm:text-left">
                            "Latee makes learning clinical reasoning more intuitive and effective. It keeps me motivated and helps me continuously improve."
                        </p>
                        <div className="flex items-center justify-start sm:justify-start xl:gap-[10px]">
                            <Image
                                src="/images/VirtualPatient/VP5.jpeg"
                                alt="student"
                                width={50}
                                height={50}
                                className="rounded-full w-[56px] h-[58px]"
                            />
                            <div className="text-left">
                                <p className="font-semibold text-[20px] font-inter lg:text-base">Thomas</p>
                                <p className="text-gray-500 font-lato text-[16px]">3rd year medical student</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}