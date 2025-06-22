import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">MedCare Pro</h3>
            <p className="text-gray-300 mb-6">
              Empowering healthcare professionals with innovative practice management solutions.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-emerald-400 cursor-pointer" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-emerald-400 cursor-pointer" />
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-emerald-400 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Training
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-emerald-400" />
                <span>1-800-MEDCARE</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-emerald-400" />
                <span>support@medcarepro.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-emerald-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 MedCare Pro. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}
