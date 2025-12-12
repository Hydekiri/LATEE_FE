import Link from 'next/link';
import Home_Header from '@/src/components/layout/Home_Header';
import Footer from '@/src/components/layout/Footer';
import { ArrowRight, BookOpen, Clock, BarChart } from 'lucide-react';

// Dữ liệu giả (Mock Data) danh sách các bài thực hành
const practiceCases = [
    {
        id: 'TH1872',
        title: 'Leg Swelling Evaluation',
        description: 'A 52-year-old female teacher comes to the clinic for evaluation of a recent health concern regarding leg swelling.',
        level: 'Level 1',
        duration: '45 mins',
        image: '/images/LVP1.jpeg' 
    },
    {
        id: 'CARD-002',
        title: 'Acute Chest Pain',
        description: 'A 65-year-old male presents with sudden onset substernal chest pain radiating to the left arm.',
        level: 'Level 2',
        duration: '30 mins',
        image: '/expert1.jpg'
    },
    {
        id: 'RESP-105',
        title: 'Chronic Cough',
        description: 'A 40-year-old male with a 3-month history of dry cough and shortness of breath upon exertion.',
        level: 'Level 1',
        duration: '40 mins',
        image: '/expert2.jpg'
    }
];

export default function PracticeListPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <Home_Header />

        {/* Hero Section nhỏ cho trang danh sách */}
        <div className="bg-[#235697] py-16 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Clinical Reasoning Practice</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Select a case below to begin your simulation session.
            </p>
        </div>

        {/* Main Content: Grid danh sách */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
            
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <BookOpen className="text-[#235697]"/> Available Cases
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceCases.map((item) => (
                <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                >
                {/* Card Header */}
                <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-100 text-[#235697] text-xs font-bold px-3 py-1 rounded-full">
                            #{item.id}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                            <Clock className="w-3 h-3" /> {item.duration}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {item.description}
                    </p>
                </div>

                {/* Card Footer Info */}
                <div className="px-6 py-2 flex items-center gap-2 text-sm text-gray-500">
                    <BarChart className="w-4 h-4 text-[#2AA8D8]" />
                    <span className="font-medium">{item.level}</span>
                </div>

                {/* Action Button */}
                <div className="mt-auto p-6 pt-4">
                    <Link 
                    href={`/practice/${item.id}`} 
                    className="group w-full flex items-center justify-center gap-2 bg-[#F0F9FF] text-[#235697] hover:bg-[#235697] hover:text-white py-3 rounded-lg font-bold transition-all"
                    >
                    Start Case 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </div>

        <Footer />
        </div>
    );
}