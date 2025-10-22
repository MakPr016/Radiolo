export default function FAQs() {
  const faqs = [
    {
      question: 'Is my data secure?',
      answer: 'We follow strict HIPAA (in guidelines) and work with bank-level encryption. Your medical data remains completely confidential.'
    },
    {
      question: 'What file formats do you support?',
      answer: 'We accept PDFs, JPEGs, PNGs, and most medical document formats, uploaded with confidence.'
    },
    {
      question: 'How accurate is the AI?',
      answer: 'Our AI has been trained on thousands of medical documents with over 95% accuracy rate.'
    },
    {
      question: 'Can I share reports?',
      answer: 'Yes. You can easily share insights with healthcare professionals through secure links.'
    },
    {
      question: 'What happens to my data?',
      answer: 'Data is permanently deleted after 30 days unless you choose to keep it in a record.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">FAQs</h2>
          <p className="text-lg text-gray-600">Common questions about our medical AI platform</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need more help?</h3>
          <p className="text-gray-600 mb-6">Our support team is ready to answer your questions</p>
          <button className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50">Contact</button>
        </div>
      </div>
    </section>
  );
}
