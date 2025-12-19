import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { placeholderSVG } from "@/assets/assets";
import { useNavigate } from "react-router-dom";
import { HomePageImage } from "@/assets/assets";

export default function Hero() {
  const navigator = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 to-teal-50 py-20 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center px-8 lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Streamline Your
              <span className="text-emerald-600"> Medical Practice</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Manage patients, appointments, and medical records with ease. Our
              comprehensive platform helps healthcare professionals provide
              better care while reducing administrative burden.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3"
                onClick={() => {
                  navigator("/auth");
                }}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {/*<Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>*/}
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="text-emerald-600 font-semibold">✓</span>
                <span className="ml-2">No setup fees</span>
              </div>
              <div className="flex items-center">
                <span className="text-emerald-600 font-semibold">✓</span>
                <span className="ml-2">HIPAA compliant</span>
              </div>
              <div className="flex items-center">
                <span className="text-emerald-600 font-semibold">✓</span>
                <span className="ml-2">24/7 support</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <img
                src={HomePageImage}
                alt="MedCare Pro Dashboard"
                className="w-auto h-auto rounded-lg"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-emerald-100 rounded-full p-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-full"></div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-teal-100 rounded-full p-6">
              <div className="w-6 h-6 bg-teal-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
