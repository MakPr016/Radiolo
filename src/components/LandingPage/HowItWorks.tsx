import { Upload, Box, Lightbulb, ChevronRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      label: 'Process',
      title: 'Upload your report',
      description: 'Drag and drop any medical document directly into our secure platform.'
    },
    {
      icon: Box,
      title: 'AI analysis',
      description: 'Our intelligent system processes your document instantly.'
    },
    {
      icon: Box,
      title: 'Get insights',
      description: 'Receive clear, actionable health information in moments.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 mb-2">Radiolo</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple. Fast. Secure.
          </h2>
          <p className="text-lg text-gray-600">
            Three steps to understanding your medical reports
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={index} 
                className="bg-gray-400 rounded-2xl p-8 md:p-10 text-white"
              >
                {index === 0 && (
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                    <span className="text-white text-sm">{step.label}</span>
                  </div>
                )}
                
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-xl mb-6">
                  <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-white/90 mb-6">
                  {step.description}
                </p>
                
                <button className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                  Button
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
