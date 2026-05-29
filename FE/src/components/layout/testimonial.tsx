import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';

export default function Testimonial() {
    return (
        <section id="testimonial" className="w-full mt-30 xl:mt-56] flex justify-center items-center">
            <div className="w-[90%] grid grid-cols-2 gap-15">

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
                        <svg 
                            className="w-10 xl:w-12.25 h-10 xl:h-10 text-[#1BA7D9] fill-current" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                    </div>
                    
                    <div className="flex-1 w-110.5 h-81.5">
                        <div className="flex justify-start sm:justify-start mb-2 sm:mb-3 xl:mb-4 gap-0.5 sm:gap-1">
                            {[...Array(5)].map((_, index) => (
                                <StarIcon 
                                    key={index} 
                                    className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 text-yellow-400" 
                                />
                            ))}
                        </div>
                        
                        <p className="text-gray-600 italic font-inter text-[16px] mb-2 sm:mb-4 xl:mb-6 text-left sm:text-left">
                            &rdquo;Latee makes learning clinical reasoning more intuitive and effective. It keeps me motivated and helps me continuously improve. &rdquo;
                        </p>
                        
                        <div className="flex items-center justify-start sm:justify-start xl:gap-2.5">
                            <Image
                                src="/images/VirtualPatient/VP5.jpeg"
                                alt="student"
                                width={50}
                                height={50}
                                className="rounded-full w-14 h-14.5 object-cover"
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