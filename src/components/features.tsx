import { Card } from "@/components/ui/card";
import {
  patientManagementImage,
  digitalRecordsImage,
  patientCommunicationImage,
} from "@/assets/assets";

interface Feature {
  id: string;
  title: string;
  image: string;
  imagePosition: "left" | "right";
  benefits: string[];
}

const features: Feature[] = [
  {
    id: "patient-management",
    title: "Patient Management",
    image: patientManagementImage,
    imagePosition: "left",
    benefits: [
      "Keep your patients informed and engaged with timely updates, appointment reminders, and essential health information — all in one place.",
      "Organize and categorize your patient base to deliver tailored content and provide care that feels personal and proactive.",
      "Foster stronger relationships by regularly sharing health tips, follow-ups, and updates that build trust and long-term loyalty."
    ]
  },
  {
    id: "digital-records",
    title: "Digital Records",
    image: digitalRecordsImage,
    imagePosition: "right",
    benefits: [
      "Centralized medical records that give you quick access to patient history, prescriptions, and test results — all in one secure place.",
      "Powerful search functionality lets you instantly find the information you need, saving time during consultations and follow-ups.",
      "Data privacy and security at the core, ensuring all patient records are protected and compliant with healthcare standards."
    ]
  },
  
  {
    id: "patient-communication",
    title: "Patient Communication",
    image: patientCommunicationImage,
    imagePosition: "right",
    benefits: [
      "Communicate confidently with patients through a secure, HIPAA-compliant messaging system designed to protect sensitive information.",
      "Streamline consultations, follow-ups, and updates, all while maintaining full privacy and confidentiality.",
      "Enhance patient satisfaction and trust by offering a direct, secure channel for medical questions, clarifications, and support."
    ]
  }
];

interface FeatureItemProps {
  feature: Feature;
  index: number;
}

function FeatureItem({ feature, index }: FeatureItemProps) {
  
  return (
    <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-24 ${
      index % 2 === 1 ? "lg:flex-row-reverse" : ""
    }`}>
      {/* Image */}
      <div className="flex-shrink-0 rounded-md">
        <img
          className="h-48 sm:h-56 md:h-64 lg:h-72 w-auto object-contain rounded-md"
          src={feature.image}
          alt={`${feature.title} illustration`}
          loading="lazy"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 text-center lg:text-left">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          {feature.title}
        </h3>
        <ul className="space-y-3 text-gray-600 text-sm md:text-base leading-relaxed">
          {feature.benefits.map((benefit: string, benefitIndex: number) => (
            <li key={benefitIndex} className="flex items-start gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-12 md:py-20 bg-white">
      {/* Header */}
      <div className="flex justify-center mb-8 md:mb-16">
        <Card className="p-3 md:p-4 px-6 md:px-8 bg-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Features</h2>
        </Card>
      </div>

      {/* Features List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6 md:p-8 lg:p-12 bg-green-50 shadow-sm">
          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {features.map((feature: Feature, index: number) => (
              <FeatureItem 
                key={feature.id} 
                feature={feature} 
                index={index}
              />
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}