import Image from "next/image";
import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/NavLanding";
import Testimonial from "@/src/components/layout/testimonial";
import { checkIsLoggedInAndRemembered } from '@/src/app/authFilterChain';
import { redirect } from 'next/navigation';
import Link from "next/dist/client/link";
import { UserCircleIcon, CalendarDaysIcon, ComputerDesktopIcon } from "@heroicons/react/24/solid";


export const metadata = {
  title: "Latee | Enhance Your Clinical Reasoning Skills",
  description: "Latee helps medical students and experts develop diagnostic thinking through realistic patient case simulations and AI-powered feedback.",
};


export default async function Home() {

  const isLoggedInAndRemembered = await checkIsLoggedInAndRemembered();

  if (isLoggedInAndRemembered) {
    redirect('/home');
  }

  return (
    <main className="w-full flex flex-col items-center overflow-x-hidden bg-white">
      {/* NAVBAR */}
      <Navbar page="Home" />

      {/* --- HERO SECTION --- */}
      <section className="w-full bg-linear-to-r from-[#1ba7d9] to-[#235697] text-white relative rounded-b-[60px] pt-13.75 pb-20 xl:pt-20 xl:pb-32 overflow-visible">
        <div className="w-[86%] max-w-360 mx-auto grid grid-cols-1 lg:grid-cols-2 relative z-10">

          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center z-20 xl:pr-10">
            <button className="bg-white mb-6 xl:mb-10 text-[12px] xl:text-[18px] text-[#235697] w-fit px-6 py-2 rounded-xl font-inter font-semibold drop-shadow-lg">
              Never stop learning
            </button>

            <h1 className="text-[40px] leading-tight xl:text-[64px] font-bold font-lato-black-i mb-8 xl:mb-12 drop-shadow-sm">
              Develop your clinical reasoning skills with Latee!
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/login"
                className="bg-[#23c0f9] px-8 py-3 xl:px-10 xl:py-4 text-[16px] xl:text-[20px] font-bold text-white rounded-xl shadow-md hover:bg-white hover:text-[#1BA7D9] transition cursor-pointer"
              >
                Explore Now!
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <Image src="/images/reviewerlandingpage.webp" alt="review" width={120} height={50} className="object-contain h-10 w-auto" />
                </div>
                <div className="flex flex-col">
                  <p className="text-yellow-400 text-sm xl:text-lg">★★★★★</p>
                  <p className="text-xs xl:text-sm font-light opacity-90">(150+ Reviews)</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE - DOCTOR */}
          <div className="hidden md:flex relative mt-10 lg:mt-0 justify-center lg:block">
            <div className="lg:absolute lg:bottom-[-100px] lg:right-[-20px] xl:right-0 xl:bottom-[-164px] z-10 pointer-events-none">
              <Image
                src="/images/LandingDOC.webp"
                alt="doctor"
                width={900}
                height={900}
                priority
                fetchPriority="high"
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 700px"
                className="
                  w-auto
                  h-100
                  md:h-112.5
                  lg:h-137.5
                  xl:h-187.5
                  object-contain
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER --- */}
      <div className="w-[86%] mx-auto mt-24 xl:mt-40 flex flex-col gap-32 xl:gap-48 mb-32">

        <section
          id="offer"
          className="
    grid
    grid-cols-1
    lg:grid-cols-[1.2fr_0.8fr]
    gap-6
    xl:gap-10
    items-center
  "
        >
          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center max-w-212.5">
            <h2 className="text-[#1ba7d9] font-medium text-lg xl:text-3xl mb-3">
              Do you want to develop your clinical reasoning skills?
            </h2>

            <h3 className="text-4xl xl:text-5xl font-semibold text-gray-900 mb-8 leading-tight">
              What We Offer ?
            </h3>

            <div className="space-y-6">
              <p className="text-lg xl:text-2xl text-gray-600 leading-relaxed">
                Latee helps you develop diagnostic thinking and
                clinical skills through realistic patient case
                simulations and intelligent AI feedback.
              </p>

              <p className="text-lg xl:text-2xl text-gray-600 leading-relaxed">
                Discover a modern, interactive, and personalized
                approach to medical learning.
              </p>
            </div>

            {/* FEATURES */}
            <div className="flex flex-wrap gap-4 mt-10">
              <div className="bg-[#e8f8fd] text-[#1ba7d9] px-5 py-3 rounded-2xl font-semibold text-sm xl:text-base">
                AI Feedback
              </div>

              <div className="bg-[#e8f8fd] text-[#1ba7d9] px-5 py-3 rounded-2xl font-semibold text-sm xl:text-base">
                Clinical Simulation
              </div>

              <div className="bg-[#e8f8fd] text-[#1ba7d9] px-5 py-3 rounded-2xl font-semibold text-sm xl:text-base">
                Personalized Learning
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:flex items-center justify-center lg:justify-start relative">

            {/* Glow */}
            <div className="absolute w-100 h-100 bg-blue-100 blur-3xl opacity-40 rounded-full"></div>

            <Image
              src="/images/Robot1.webp"
              alt="robot"
              width={900}
              height={900}
              quality={82}
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 35vw, 550px"
              className="relative z-10 w-full h-auto max-w-[320px] lg:max-w-105 xl:max-w-125 object-contain drop-shadow-2xl"
            />
          </div>
        </section>

        {/* 2. WHAT WILL YOU GET (1/2 - 1/2) */}
        <section id="get" className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center">

          <div className="hidden md:flex relative justify-center lg:justify-start w-full">
            <div className="relative w-full max-w-md lg:max-w-none mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10 transform scale-90"></div>
              <Image
                src="/images/doctorwbg.png"
                alt="doctor standing"
                width={1200}
                height={1200}
                className="rounded-2xl w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-3xl xl:text-5xl font-bold text-gray-900">
              What Will You <span className="text-[#1ba7d9]">Get</span> ?
            </h3>

            <div className="bg-linear-to-br from-[#e0f7fa] to-white p-6 xl:p-10 rounded-[40px] shadow-sm border border-blue-50">
              <p className="text-lg xl:text-xl text-gray-700 font-medium mb-8">
                Enhance your diagnostic thinking through clinical simulations and a personalized learning journey.
              </p>
              <ul className="space-y-6">
                {[
                  { title: "Interactive case simulations", desc: "Experience realistic clinical scenarios and receive detailed step-by-step diagnostic feedback" },
                  { title: "AI-powered feedback", desc: "Get intelligent suggestions and insights from AI to enhance your clinical reasoning skills." },
                  { title: "Personalized Learning Path", desc: "Follow a customized learning journey tailored to your progress and clinical performance." }
                ].map((item, idx) => (
                  <li key={idx} className="bg-white p-4 rounded-2xl flex gap-4 shadow-sm items-start">
                    <span className="bg-[#1ba7d9] text-white text-xs font-bold px-2 py-1 rounded-md mt-1">✔</span>
                    <div>
                      <p className="text-base xl:text-lg font-bold text-gray-900">{item.title}</p>
                      <p className="text-sm xl:text-base text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. EXPERIENCE / EXPERT (7/12 - 5/12) */}
        <section id="work" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col justify-start pr-0 lg:pr-10">
            <h3 className="text-3xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Experience interactive learning and connect with experts !
            </h3>
            <ul className="space-y-4 mb-8">
              <li className="text-lg xl:text-3xl text-gray-600 font-light">
                • Learn effectively with modules designed by medical experts.
              </li>
              <li className="text-lg xl:text-3xl text-gray-600 font-light">
                • Latee offers a realistic learning experience through simulated patient cases, AI-powered feedback, and expert guidance.
              </li>
            </ul>
            <div className="flex gap-4 sm:gap-6">
              <Link
                href="/coming-soon"
                aria-label="Login to see more info"
                className="bg-[#1ba7d9] cursor-pointer text-white px-8 py-3 xl:px-10 xl:py-4 rounded-lg font-bold text-sm xl:text-lg shadow-md hover:bg-white hover:text-[#1ba7d9] border border-[#1ba7d9] transition"
              >
                Start now
              </Link>
              <Link
                href="/coming-soon"
                aria-label="Login to see more info"
                className="border border-[#1ba7d9] cursor-pointer text-[#1ba7d9] px-8 py-3 xl:px-10 xl:py-4 rounded-lg font-bold text-sm xl:text-lg hover:bg-[#1ba7d9] hover:text-white transition"
              >
                Expert Details
              </Link>
            </div>
          </div>

          <div className="hidden md:flex lg:col-span-5 justify-center lg:justify-end w-full">
            <Image
              src="/images/expertlandingpage.webp"
              alt="expert"
              width={800}
              height={800}
              className="rounded-xl w-full max-w-md lg:max-w-none h-auto object-cover mx-auto lg:mx-0"
            />
          </div>
        </section>

        {/* 4. HOW IT WORKS (7/12 - 5/12) */}
        <section
          id="how-it-works"
          className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-centerbg-white"
        >
          {/* LEFT IMAGE */}
          <div className="hidden md:flex lg:col-span-5 justify-center lg:justify-start w-full">
            <Image
              src="/images/doctorhowitworks.webp"
              alt="how it works"
              width={700}
              height={600}
              quality={85}
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 40vw, 500px"
              className="rounded-3xl w-full max-w-md lg:max-w-lg h-auto object-cover mx-autolg:mx-0 drop-shadow-2xl"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-7 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-linear from-blue-50 to-transparent opacity-70 -z-10 rounded-full"></div>

            <h3 className="text-4xl xl:text-5xl font-bold mb-8">
              Here&apos;s how it{" "}
              <span className="text-[#1ba7d9]">works</span>
            </h3>

            <ul className="space-y-6">
              {[
                {
                  icon: UserCircleIcon,
                  title: "Select a learning topic",
                  desc: "Choose your learning topic — from internal medicine and surgery to complex clinical cases."
                },
                {
                  icon: CalendarDaysIcon,
                  title: "Start simulation",
                  desc: "Engage in interactive case simulations and make diagnostic decisions step by step."
                },
                {
                  icon: ComputerDesktopIcon,
                  title: "Get feedback & improve",
                  desc: "Receive insights from AI and mentors to refine and strengthen your diagnostic skills."
                }
              ].map((item, idx) => {
                const Icon = item.icon;

                return (
                  <li
                    key={idx}
                    className=" bg-white p-5 rounded-2xl flex gap-4 shadow-md border border-gray-100 items-start hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="bg-[#1ba7d9] w-14 h-14 min-w-14 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div>
                      <p className="font-bold text-[#1ba7d9] text-xl mb-1">
                        {item.title}
                      </p>

                      <p className="text-gray-500 text-md leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      <Testimonial />
      <Footer />
    </main>
  );
}