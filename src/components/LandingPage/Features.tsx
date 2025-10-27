import Image from "next/image";

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-20 bg-purple-100">
      <div className="bg-white rounded-3xl max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 mb-2">Radiolo</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why choose radiolo?
          </h2>
          <p className="text-lg text-gray-600">
            Advanced medical insights powered by cutting-edge artificial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-400 rounded-3xl p-8 md:p-10 relative overflow-hidden row-span-1 md:row-span-2">
            <div className="relative z-10 mb-8">
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                <span className="text-white text-sm">AI</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                AI-powered analysis
              </h3>
              <p className="text-white/90 mb-8 max-w-md">
                Advanced AI analyzes complex medical documents in seconds with precision.
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-white/90 text-gray-900 rounded-lg font-medium hover:bg-white transition-colors">
                  Button
                </button>
                <button className="px-6 py-2.5 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                  Button
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 h-3/4">
              <Image 
                src="/assets/phone-mockup.svg" 
                alt="AI Analysis Feature" 
                fill
                className="object-contain object-bottom-right"
              />
            </div>
          </div>

          <div className="bg-gray-400 rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="inline-block p-3 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Bank-level security
            </h3>
            <p className="text-white/90 mb-6">
              Protecting your medical data with military-grade encryption methods
            </p>
            <button className="px-6 py-2.5 bg-white/90 text-gray-900 rounded-lg font-medium hover:bg-white transition-colors flex items-center gap-2">
              Button
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="bg-gray-400 rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="inline-block p-3 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Multi-format support
            </h3>
            <p className="text-white/90 mb-6">
              Upload various medical documents seamlessly and securely.
            </p>
            <button className="px-6 py-2.5 bg-white/90 text-gray-900 rounded-lg font-medium hover:bg-white transition-colors flex items-center gap-2">
              Button
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="bg-gray-400 rounded-3xl p-8 md:p-10 relative overflow-hidden md:col-span-2">
            <div className="inline-block p-3 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Easy insights
            </h3>
            <p className="text-white/90 mb-6">
              Transform complex medical terminology into clear, understandable language for everyone.
            </p>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white/90 text-gray-900 rounded-lg font-medium hover:bg-white transition-colors">
                Learn more
              </button>
              <button className="px-6 py-2.5 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                Button
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
