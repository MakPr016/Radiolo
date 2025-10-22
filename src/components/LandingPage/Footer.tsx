export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Radiolo health insights platform</h3>
            <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
            <div className="flex space-x-4 mt-4">
              <button className="px-4 py-2 bg-black text-white rounded-md text-sm">Start</button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm">Learn</button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>AI Analysis</li>
              <li>Security</li>
              <li>Insights</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Have a cookie</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Pricing</li>
              <li>Support</li>
              <li>Contact</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Link Three</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Link Slide</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex justify-between items-center text-sm text-gray-600">
          <p>© 2025 Radiolo. All rights reserved</p>
          <div className="flex space-x-4">
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
            <a href="#">Cookies</a>
          </div>
          <div className="flex space-x-4">
            {/* Social icons */}
            <a href="#" className="text-gray-600 hover:text-gray-900">𝕏</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">in</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">▶</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
