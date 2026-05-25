"use client";

import { MapPin, Phone, Clock, Mail, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-[#2D2D2D] text-white py-12 px-6 text-sm">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Logo & Slogan */}
                <div className="col-span-1 md:col-span-2">
                    <div className="mb-6">
                        <p className="text-gray-400 mb-1">Transform the way you learn</p>
                        <p className="font-bold text-white">
                            <span className="font-extrabold">LATEE</span> now !
                        </p>
                    </div>

                    <div className="space-y-4 text-gray-400">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 mt-1" />
                            <p>
                                Address:
                                <br />HCMUT, HCM City, Viet Nam
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4" />
                            <p>Tel: +0934810290</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4" />
                            <p>Response hours: 8 to 20</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4" />
                            <p>Email: hung.nguyenthydekir@hcmut.edu.vn</p>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Google</span>G</a>
                        <a href="#" className="text-gray-400 hover:text-white"><Twitter className="w-4 h-4" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Instagram className="w-4 h-4" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="w-4 h-4" /></a>
                    </div>
                </div>

                {/* Columns */}
                <div>
                    <h4 className="font-bold mb-6">Company</h4>
                    <ul className="space-y-3 text-gray-400">
                        <li><a href="#" className="hover:text-white">About</a></li>
                        <li><a href="#" className="hover:text-white">How it Works</a></li>
                        <li><a href="#" className="hover:text-white">Term</a></li>
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6">More</h4>
                    <ul className="space-y-3 text-gray-400">
                        <li><a href="#" className="hover:text-white">Blog</a></li>
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                    </ul>
                </div>
            </div>

            <div className="text-center text-gray-500 mt-16 text-xs">
                Lavender Teeducation
            </div>
        </footer>
    );
}
