import Image from "next/image";

export default function Features() {
  return (
    <section className="py-20 px-20 bg-purple-100">
      <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 mb-2">Radiolo</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why choose radiolo?</h2>
          <p className="text-lg text-gray-600">Advanced medical insights powered by cutting-edge artificial intelligence</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Feature cards */}
          <div className="bg-gray-200 rounded-lg p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">AI-powered analysis</h3>
              <p className="text-white mb-6">Advanced AI that can understand and analyze medical reports</p>
              <div className="flex space-x-4">
                <button className="px-6 py-2 bg-white text-gray-900 rounded-md">Button</button>
                <button className="px-6 py-2 border border-white text-white rounded-md">Button</button>
              </div>
            </div>
            <div className="absolute bottom-0 right-0">
              <Image src="/phone-feature.png" alt="Feature" width={200} height={400} />
            </div>
          </div>

          <div className="bg-gray-200 rounded-lg p-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Bank-level security</h3>
            <p className="text-white mb-6">Your data is encrypted and secure</p>
            <button className="px-6 py-2 bg-white text-gray-900 rounded-md">Button</button>
          </div>

          <div className="bg-gray-200 rounded-lg p-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl">🌐</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Multi-format support</h3>
            <p className="text-white mb-6">Upload PDFs, images, and more</p>
            <button className="px-6 py-2 bg-white text-gray-900 rounded-md">Button</button>
          </div>

          <div className="bg-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Easy insights</h3>
            <p className="text-white mb-6">Get actionable insights in seconds</p>
            <button className="px-6 py-2 bg-white text-gray-900 rounded-md">Button</button>
          </div>
        </div>
      </div>
    </section>
  );
}
