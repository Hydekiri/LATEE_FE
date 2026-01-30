import Image from "next/image";
import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/NavLanding";
import Testimonial from "@/src/components/layout/testimonial";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center overflow-x-hidden bg-white">
      {/* NAVBAR */}
      <Navbar page="Home" />

      {/* --- HERO SECTION --- */}
      <section className="w-full bg-linear-to-r from-[#1ba7d9] to-[#235697] text-white relative rounded-b-[60px] pt-[55px] pb-20 xl:pt-20 xl:pb-32 overflow-visible">
        <div className="w-[86%] max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 relative z-10">

          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center z-20 xl:pr-10">
            <button className="bg-white mb-6 xl:mb-10 text-[12px] xl:text-[18px] text-[#235697] w-fit px-6 py-2 rounded-xl font-inter font-semibold drop-shadow-lg">
              Never stop learning
            </button>

            <h1 className="text-[40px] leading-tight xl:text-[64px] font-bold font-lato-black-i mb-8 xl:mb-12 drop-shadow-sm">
              Develop your clinical reasoning skills with Latee!
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <button className="bg-[#01c4fe] px-8 py-3 xl:px-10 xl:py-4 text-[16px] xl:text-[20px] font-bold text-white rounded-xl shadow-md hover:bg-white hover:text-[#01c4fe] transition cursor-pointer">
                Explore Now!
              </button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                    <Image src="/images/reviewerlandingpage.png" alt="review" width={120} height={50} className="object-contain h-10 w-auto" />
                </div>
                <div className="flex flex-col">
                    <p className="text-yellow-400 text-sm xl:text-lg">★★★★★</p>
                    <p className="text-xs xl:text-sm font-light opacity-90">(150+ Reviews)</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE - DOCTOR */}
          <div className="relative mt-10 lg:mt-0 h-[600px] lg:h-auto flex justify-center lg:block">
              <div className="lg:absolute lg:bottom-[-80px] lg:right-[-20px] xl:right-0 xl:bottom-[-164px] z-10 pointer-events-none">
                  <Image
                      src="/images/landingDoc.png"
                      alt="doctor"
                      width={900}
                      height={900}
                      priority
                      className="w-auto h-[450px] lg:h-[650px] xl:h-[750px] object-contain drop-shadow-2xl"
                  />
              </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT WRAPPER --- */}
      <div className="w-[86%] mx-auto mt-24 xl:mt-40 flex flex-col gap-32 xl:gap-48 mb-32">

        {/* 1. WHAT WE OFFER */}
        {/* CẬP NHẬT: Grid 7/5 - Text chiếm 7 phần, Ảnh 5 phần. Đủ để đẩy ảnh sang phải nhưng vẫn to */}
        <section id="offer" className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 items-center">
          
          {/* Content: 7/12 (Tăng độ rộng cho chữ để đẩy ảnh ra xa trung tâm hơn) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-[#1ba7d9] font-medium text-lg xl:text-3xl mb-2">
              Do you want to develop your clinical reasoning skills?
            </h2>
            <h3 className="text-4xl xl:text-6xl font-semibold text-gray-900 mb-6">
              What We Offer ?
            </h3>
            <p className="text-lg xl:text-3xl text-gray-600 mb-4 leading-relaxed max-w-4xl">
              Latee helps you develop diagnostic thinking and clinical skills through realistic patient case simulations and intelligent AI feedback.
            </p>
            <p className="text-lg xl:text-3xl text-gray-600 leading-relaxed max-w-4xl">
              Discover a modern, interactive, and personalized approach to medical learning.
            </p>
          </div>

          {/* Image: 5/12 (Nhỏ hơn 6/12 một chút để nằm gọn về phía bên phải) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <Image
              src="/images/Robot1.png"
              alt="robot"
              width={800}
              height={800}
              // Chú ý: w-full để ảnh to hết cỡ cột 5/12, object-contain để giữ tỷ lệ
              className="w-full h-auto max-w-[500px] xl:max-w-full object-contain drop-shadow-xl translate-x-30"
            />
          </div>
        </section>

        {/* 2. WHAT WILL YOU GET (1/2 - 1/2) */}
        <section id="get" className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center">
          <div className="relative flex justify-center lg:justify-start w-full">
            <div className="relative w-full">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10 transform scale-90"></div>
                <Image
                src="/images/doctorwbg.png"
                alt="doctor standing"
                width={1200}
                height={1200}
                className="rounded-2xl w-full h-auto object-cover "
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
                    <a className="bg-[#1ba7d9] cursor-pointer text-white px-8 py-3 xl:px-10 xl:py-4 rounded-lg font-bold text-sm xl:text-lg shadow-md hover:bg-white hover:text-[#1ba7d9] border border-[#1ba7d9] transition">Start now</a>
                    <a className="border border-[#1ba7d9] cursor-pointer text-[#1ba7d9] px-8 py-3 xl:px-10 xl:py-4 rounded-lg font-bold text-sm xl:text-lg hover:bg-[#1ba7d9] hover:text-white transition">More info</a>
                </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
                <Image
                    src="/images/expertlandingpage.png"
                    alt="expert"
                    width={800}
                    height={800}
                    className="rounded-xl w-full h-auto object-cover"
                />
            </div>
        </section>

        {/* 4. HOW IT WORKS (7/12 - 5/12) */}
        <section id="how-it-works" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white">
            <div className="lg:col-span-7 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-linear from-blue-50 to-transparent opacity-70 -z-10 rounded-full"></div>
                <h3 className="text-4xl xl:text-5xl font-bold mb-8">
                    Here&apos;s how it <span className="text-[#1ba7d9]">works</span>
                </h3>
                <ul className="space-y-6">
                    {[
                        { icon: "/images/Profile.png", title: "Select a learning topic", desc: "Choose your learning topic — from internal medicine and surgery to complex clinical cases." },
                        { icon: "/images/calendericon.png", title: "Start simulation", desc: "Engage in interactive case simulations and make diagnostic decisions step by step." },
                        { icon: "/images/bi_laptop-fill.png", title: "Get feedback & improve", desc: "Receive insights from AI and mentors to refine and strengthen your diagnostic skills." }
                    ].map((item, idx) => (
                        <li key={idx} className="bg-white p-4 rounded-xl flex gap-4 shadow-md border border-gray-100 items-center max-w-2xl">
                            <div className="bg-[#1ba7d9] w-12 h-12 min-w-[48px] rounded-full flex items-center justify-center shadow-lg">
                                <Image src={item.icon} alt="icon" width={24} height={24} />
                            </div>
                            <div>
                                <p className="font-bold text-[#1ba7d9] text-xl">{item.title}</p>
                                <p className="text-gray-500 text-md">{item.desc}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
                <Image
                    src="/images/doctorhowitworks.png"
                    alt="how it works"
                    width={700}
                    height={600}
                    className="rounded-2xl w-full h-auto object-cover"
                />
            </div>
        </section>

      </div>
      {/* --- END CONTENT WRAPPER --- */}

      <Testimonial />
      <Footer />
    </main>
  );
}