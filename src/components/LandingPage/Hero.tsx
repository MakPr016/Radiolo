import Image from 'next/image';

export default function Hero() {
    return (
        <section className="bg-gradient-to-b from-white to-purple-100 py-40">
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

                <div className="relative flex justify-center items-center">
                    <div className="absolute left-0 top-1/4 bg-white rounded-lg shadow-lg p-6 hidden lg:block">
                        <h3 className="text-sm font-semibold mb-4">Score</h3>
                        <div className="flex space-x-2 items-end h-32">
                            {[40, 60, 80, 50, 90, 70, 85].map((height, i) => (
                                <div key={i} className="w-8 bg-red-500 rounded-t" style={{ height: `${height}%` }}></div>
                            ))}
                        </div>
                    </div>

                    <div className="z-10">
                        <Image src="/assets/phone-mockup.svg" alt="Radiolo App" width={400} height={800} />
                    </div>

                    <div className="absolute right-0 top-1/4 space-y-4 hidden lg:block">
                        <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
                            <div className="flex items-center mb-2">
                                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                                <div>
                                    <p className="text-sm font-semibold">Al has changed my life</p>
                                    <p className="text-xs text-gray-500">By Tom M.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-sm font-semibold mb-4">Score</h3>
                            <div className="flex justify-center">
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="283" strokeDashoffset="70" transform="rotate(-90 50 50)" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold">73%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
