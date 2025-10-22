export default function HowItWorks() {
  const steps = [
    {
      icon: '📤',
      title: 'Upload your report',
      description: 'Drag and drop your medical document into our secure platform'
    },
    {
      icon: '🤖',
      title: 'AI analysis',
      description: 'Our intelligent system processes your document instantly'
    },
    {
      icon: '📊',
      title: 'Get insights',
      description: 'Receive clear, actionable health insights and recommendations'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 mb-2">Radiolo</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple. Fast. Secure.</h2>
          <p className="text-lg text-gray-600">Three steps to understanding your medical reports</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-200 rounded-lg p-8">
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white mb-6">{step.description}</p>
              <button className="px-6 py-2 bg-white text-gray-900 rounded-md">Button</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
