'use client'

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const leftCardY = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const rightCard1Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const rightCard2Y = useTransform(scrollYProgress, [0, 1], [0, -200]);

    return (
        <section
            ref={sectionRef}
            className="bg-gradient-to-b from-white to-purple-100 py-40 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Understand your medical<br />reports with AI
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Get instant insights from medical reports with bank-level security<br />
                        and full legal compliance.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button className="px-8 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium">
                            Start
                        </button>
                        <button className="px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">
                            Watch
                        </button>
                    </div>
                </div>

                <div className="relative flex justify-center items-center min-h-[800px]">
                    <motion.div
                        style={{ y: leftCardY }}
                        className="absolute left-[5%] top-[15%] bg-white rounded-2xl shadow-xl p-6 w-[280px] hidden lg:block"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700">Score</h3>
                            <select className="text-xs border border-gray-200 rounded px-2 py-1">
                                <option>Monthly</option>
                            </select>
                        </div>
                        <div className="flex space-x-2 items-end h-40">
                            {[
                                { height: 45, color: 'bg-red-100' },
                                { height: 70, color: 'bg-red-500' },
                                { height: 85, color: 'bg-red-500' },
                                { height: 95, color: 'bg-red-500' },
                                { height: 60, color: 'bg-red-500' },
                                { height: 75, color: 'bg-red-500' },
                                { height: 50, color: 'bg-red-100' },
                                { height: 90, color: 'bg-red-500' }
                            ].map((bar, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 ${bar.color} rounded-t-full transition-all duration-300`}
                                    style={{ height: `${bar.height}%` }}
                                ></div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="z-10">
                        <Image
                            src="phone-mockup.svg"
                            alt="Radiolo App"
                            width={400}
                            height={800}
                        />
                    </div>

                    <div className="absolute right-[5%] top-[10%] space-y-6 hidden lg:block">
                        <motion.div
                            style={{ y: rightCard1Y }}
                            className="bg-white rounded-2xl shadow-xl p-5 w-[300px]"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex-shrink-0 overflow-hidden">
                                    <img
                                        src="user_float.png"
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 mb-1">
                                        &quot;The AI explained my lab results clearly&quot;
                                    </p>
                                    <p className="text-xs text-gray-500">Sofia the First, 32</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ y: rightCard2Y }}
                            className="bg-white rounded-2xl shadow-xl p-6 w-[280px]"
                        >
                            <h3 className="text-sm font-semibold text-gray-700 mb-6">Score</h3>
                            <div className="flex justify-center">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="8"
                                            strokeDasharray="251.2"
                                            strokeDashoffset="67.8"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-gray-900">73%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
