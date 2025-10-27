import { ShieldCheck  } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl"><ShieldCheck /></span>
          </div>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to transform your health insights?</h2>
        <p className="text-lg text-gray-600 mb-8">Join the medical AI revolution with zero risk and complete privacy</p>
        <div className="flex justify-center space-x-4">
          <button className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 font-medium">Start</button>
          <button className="px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">Watch</button>
        </div>
      </div>
    </section>
  );
}
