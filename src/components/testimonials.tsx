import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Family Medicine",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "MedCare Pro has transformed how I manage my practice. The patient scheduling system alone has saved me hours each week, and my patients love the communication features.",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "The digital records system is incredibly intuitive. I can access patient history instantly, and the security features give me complete peace of mind with HIPAA compliance.",
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "As a busy pediatrician, efficiency is crucial. MedCare Pro's automated reminders and streamlined workflows have improved both patient satisfaction and my practice's bottom line.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of doctors who have transformed their practice with
            MedCare Pro
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg bg-green-50">
              <CardContent className="p-8">
                <div className="flex items-center py-2">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src={testimonial.image || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.specialty}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
