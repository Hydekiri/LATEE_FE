import Image from "next/image";
import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/navbarlandingpage";
import Testimonial from "@/src/components/layout/testimonial";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center overflow-hidden">
      {/* NAVBAR */}
      <Navbar currentPage="home" />

      {/* Hero Section */}
      <section className="w-full mx-auto bg-gradient-to-r from-[#1ba7d9] to-[#235697] text-white  relative rounded-b-[60px] flex justify-center">
        <div className="w-[86%] grid grid-cols-1 sm:grid-cols-2 gap-12 xl:gap-[52px] xl:pb-0">

          {/* LEFT SECTION */}
          <div className="w-full h-auto mt-[55px] xl:mt-[83px]">
            <button className="bg-white mb-[32px] xl:mb-[52px] text-[12px] xl:text-[18px] text-[#235697] w-[150px] xl:w-[221px] max-h-[45px] h-[25px] xl:h-[45px] rounded-xl font-inter font-inter-semibold shadow">
              Never stop learning
            </button>

            <h1 className="text-[44px] mb-[32px] xl:mb-[66px] font-lato-black-i xl:text-[64px] font-bold leading-tight">
              Develop your clinical reasoning skills with Latee!
            </h1>

            <div className="flex items-center gap-4">
              <button className="bg-[#01c4fe] w-[150px] xl:w-[201px] h-[45px] xl:h-[68px] text-[16px] xl:text-[20px] font-lato-bold text-white p-1 xl:p-2 xl:p-4 rounded-xl font-semibold shadow-md hover:bg-white hover:text-[#01c4fe] transition cursor-pointer">
                Explore Now!
              </button>

              <div className="xl:w-[233px] xl:h-[52px] flex items-center gap-3 mt-0 xl:mt-1">
                <Image
                  src="/images/reviewerlandingpage.png"
                  alt="doctor"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-5 xl:w-[127px] xl:h-[52px]"
                />
                <div><p className="font-lato-r text-[8px] xl:text-[20px]">★★★★★</p> <p className="font-lato-r text-[8px] xl:text-[12px]">(150+ Reviews)</p></div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION — Hero image */}
          <div className="flex justify-center lg:mt-[40px] xl:mt-[59px] lg:pb-[25px] xl:pb-[39px] relative">
            <Image
              src="/images/doctor1withRectangle.png"
              alt="doctor"
              width={478}
              height={532}
              className="rounded-xl xl:w-full h-[400px] xl:h-[532px] pointer-events-none"
            />

            {/* BADGE — 250k Assisted Student */}
            <div className="absolute left-1/15 -translate-x-7/10 xl:-translate-x-3/4 -translate-y-45  xl:-translate-y-40 mt-[500px] xl:mt-[570px] bg-white text-[#595959] 
                  px-4 py-2 xl:px-6 xl:py-3 text-[12px] xl:text-[22px]
                  max-w-[300px] xl:w-[300px] xl:h-[100px]
                  rounded-xl shadow-xl font-bold flex items-center gap-7">
              <img src="/images/calendericon.png" alt="icon"
                className="bg-[#23bdee] w-6 xl:w-[50px] xl:h-[50px] p-3 rounded-xl"
              />
              <div><p className="font-inter-b text-[14px] xl:text-[24px]">250k</p> <p className="font-lato-r text-[14px] xl:text-[20px]">Assisted Student</p></div>
            </div>
          </div>

        </div>

      </section>


      {/* What We Offer */}
      <section id="offer" className="w-full mx-auto mt-[120px] xl:mt-[224px] flex justify-center">
        <div className="w-[86%] gap-[70px] grid grid-cols-2 xl:gap-[70px] items-start">
          <div className="">
            <h2 className="text-[14px] xl:text-[24px] text-[#1ba7d9] mb-2 font-lato-medium">
              Do you want to develop your clinical reasoning skills?
            </h2>

            <h3 className="text-[44px] xl:text-[64px] font-inter font-inter-semibold mb-6">
              What We Offer?
            </h3>

            <p className="text-[18px] xl:text-[28px] text-gray-600 mb-6 font-lato-r">
              Latee helps you develop diagnostic thinking and clinical skills through realistic patient case simulations and intelligent AI feedback.
            </p>

            <p className="text-[18px] xl:text-[28px] text-gray-600 font-lato-r">
              Discover a modern, interactive, and personalized approach to medical learning.
            </p>
          </div>

          <div className="flex justify-center xl:justify-start">
            <Image src="/images/Robot1.png" alt="robot" width={650} height={650} className="max-w-[100%] xl:max-w-[80%] w-250 h-55 xl:w-full xl:h-[445px]" />
          </div>
        </div>
      </section>


      {/* What You Get */}
      <section id="get" className="w-full mx-auto  mt-[120px] xl:mt-[224px] flex justify-center">
        <div className="w-[86%] grid grid-cols-2 gap-0">
          <div className="relative flex">
            <Image
              src="/images/doctorwbg.png"
              alt="doctor"
              width={650}
              height={650}
              className="rounded-xl ml-10 xl:ml-0 z-10 w-full h-auto"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] xl:text-[36px] font-inter-semibold">
              What Will You <span className="text-[#1ba7d9]">Get</span>?
            </h3>

            <div className="bg-[radial-gradient(circle,#c9f3ff_10%,#ffffff_80%)] xl:rounded-6xl">
              <h3 className="text-[14px] xl:text-[20px] xl:mb-5 text-gray-600 font-lato-medium">
                Enhance your diagnostic thinking through clinical simulations and a personalized learning journey.
              </h3>

              <ul className="space-y-6 xl:max-w-[95%]">
                {[
                  {
                    title: "Interactive case simulations",
                    desc: "Experience realistic clinical scenarios and receive detailed step-by-step diagnostic feedback"
                  },
                  {
                    title: "AI-powered feedback",
                    desc: "Get intelligent suggestions and insights from AI to enhance your clinical reasoning skills."
                  },
                  {
                    title: "Personalized Learning Path",
                    desc: "Follow a customized learning journey tailored to your progress and clinical performance."
                  }
                ].map((item, idx) => (
                  <li key={idx} className="bg-white p-1 xl:p-3 rounded-xl grid grid-cols-[auto_1fr] gap-3 max-w-[90%]">
                    <span className="bg-[#1ba7d9] text-white font-bold px-2 py-[3px] rounded-[8px] self-center">✔</span>
                    <div>
                      <p className="text-[10px] xl:text-[16px] font-lato-medium">{item.title}</p>
                      <p className="text-gray-500 font-lato-medium text-[8px] xl:text-[14px]">
                        <strong>· </strong>{item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* connect expert */}
      <section id="work" className="w-full mx-auto mt-[120px] xl:mt-[224px] flex justify-center">
        <div className="w-[86%] grid grid-cols-12 ">
          <div className="col-span-7 flex flex-col justify-start">
            <h3 className="text-[36px] xl:text-[48px] font-inter font-semibold mb-6">
              Experience interactive learning and connect with experts!
            </h3>

            <ul className="space-y-0">
              <li className="text-[16px] xl:text-[24px] text-[#6c6c6c] font-lato-r">
                Learn effectively with modules designed by medical experts.
              </li>
              <li className="text-[16px] xl:text-[24px] text-[#6c6c6c] font-lato-r">
                Latee offers realistic learning through simulated patient cases, AI-powered feedback, and expert guidance.
              </li>
            </ul>

            <div className="flex gap-[43px] mt-2 xl:mt-5 text-center items-center">
              <a className="bg-[#1ba7d9] w-[199px] h-[62px] text-[12px] xl:text-[16px] px-3 xl:px-[16px] py-2 xl:py-[10px] flex justify-center items-center rounded text-white hover:bg-white hover:text-[#1ba7d9] border border-[#1ba7d9]">
                Start now
              </a>
              <a className="border border-[#1ba7d9] w-[199px] h-[62px] text-[12px] xl:text-[16px] px-3 xl:px-[16px] py-2 xl:py-[10px] flex justify-center items-center rounded text-[#1ba7d9] hover:bg-[#1ba7d9] hover:text-white">
                More info
              </a>
            </div>
          </div>
          <div className="col-span-5">
            <Image src="/images/expertlandingpage.png" alt="expert" width={600} height={600} className="rounded-xl w-full h-autojustify-end" />
          </div>
        </div>
      </section>


      {/* How It Works */}
      <section id="work" className="w-full mx-auto mt-[120px] xl:mt-[224px] flex justify-center relative">
        <div className="w-[86%] grid grid-cols-2 gap-0 ">
          <div className="bg-[radial-gradient(circle,#c9f3ff_10%,#ffffff_90%)]">
            <h3 className="xl:text-[36px] font-inter-semibold mb-6">
              Here's how it <span className="text-[#1ba7d9]">works</span>
            </h3>

            <ul className="space-y-4">
              <li className="max-w-[90%] bg-white rounded-xl grid grid-cols-[auto_1fr] gap-3">
                <span className="text-white bg-[#1ba7d9] w-[45px] h-[45px] rounded-xl font-bold px-2 py-4 flex items-center justify-center self-center">
                  <Image src="/images/Profile.png" alt="icon" width={20} height={20} className="w-[18px] h-[23px]" />
                </span>

                <div>
                  <span className="font-medium block font-lato-medium xl:text-[16px] text-[#1ba7d9]">Select a learning topic</span>
                  <span className="font-medium text-gray-500 block font-lato-medium xl:text-[14px]">
                    Choose your learning topic — from internal medicine and surgery to complex clinical cases.
                  </span>
                </div>
              </li>
              <li className="max-w-[90%] bg-white rounded-xl grid grid-cols-[auto_1fr] gap-3">
                <span className="text-white bg-[#1ba7d9] w-[45px] h-[45px] rounded-xl font-bold px-2 py-4 flex items-center justify-center self-center">
                  <Image src="/images/calendericon.png" alt="icon" width={20} height={20} className="w-[18px] h-[23px]" />
                </span>

                <div>
                  <span className="font-medium block font-lato-medium xl:text-[16px] text-[#1ba7d9]">Start simulation</span>
                  <span className="font-medium text-gray-500 block font-lato-medium xl:text-[14px]">
                    Engage in interactive case simulations and make diagnostic decisions step by step.
                  </span>
                </div>
              </li>
              <li className="max-w-[90%] bg-white rounded-xl grid grid-cols-[auto_1fr] gap-3">
                <span className="text-white bg-[#1ba7d9] w-[45px] h-[45px] rounded-xl font-bold px-2 py-4 flex items-center justify-center self-center">
                  <Image src="/images/bi_laptop-fill.png" alt="icon" width={20} height={20} className="w-[18px] h-[23px]" />
                </span>

                <div>
                  <span className="font-medium block font-lato-medium xl:text-[16px] text-[#1ba7d9]">Get feedback & improve</span>
                  <span className="font-medium text-gray-500 block font-lato-medium xl:text-[14px]">
                    Receive insights from AI and mentors to refine and strengthen your diagnostic skills.
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex justify-end items-center">
            <Image src="/images/doctorhowitworks.png" alt="video" width={480} height={480} className="rounded-xl w-[504px] h-[414px]" />

          </div>
        </div>
      </section>

      {/* Testimonial */}
      <Testimonial />

      {/* FOOTER */}
      <Footer />

    </main >
  );
}