import { Card, CardContent } from "@/components/ui/card";
import {
  patientManagementImage,
  digitalRecordsImage,
  patientCommunicationImage,
} from "@/assets/assets";

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="flex justify-center">
        <Card className="p-4 px-8 bg-green-100 transition-shadow">
          <h1 className="text-2xl font-bold">Features</h1>
        </Card>
      </div>

      <div className="px-32 py-16">
        <Card className="p-8 bg-green-100">
          <div className="flex flex-col gap-16">
            <div className="flex justify-center gap-48">
              <img
                className="h-72 w-auto"
                src={patientManagementImage}
                alt=""
              />

              <CardContent className="flex flex-col gap-4 justify-center text-gray-600">
                <h1 className="text-2xl font-bold">Patient Management</h1>
                <p>
                  <ul className="flex gap-2 flex-col list-disc pl-5">
                    <li>
                      Keep your patients informed and engaged with timely
                      updates, appointment reminders, and essential health
                      information — all in one place.
                    </li>
                    <li>
                      Organize and categorize your patient base to deliver
                      tailored content and provide care that feels personal and
                      proactive.
                    </li>

                    <li>
                      Foster stronger relationships by regularly sharing health
                      tips, follow-ups, and updates that build trust and
                      long-term loyalty.
                    </li>
                  </ul>
                </p>
              </CardContent>
            </div>

            <div className="flex justify-center gap-48">
              <CardContent className="flex flex-col gap-4 justify-center text-gray-600">
                <h1 className="text-2xl font-bold">Digital Records</h1>
                <p>
                  <ul className="flex gap-2 flex-col list-disc pl-5">
                    <li>
                      Centralized medical records that give you quick access to
                      patient history, prescriptions, and test results — all in
                      one secure place.
                    </li>
                    <li>
                      Powerful search functionality lets you instantly find the
                      information you need, saving time during consultations and
                      follow-ups.
                    </li>

                    <li>
                      Data privacy and security at the core, ensuring all
                      patient records are protected and compliant with
                      healthcare standards.
                    </li>
                  </ul>
                </p>
              </CardContent>

              <img className="h-72 w-auto" src={digitalRecordsImage} alt="" />
            </div>

            <div className="flex justify-center gap-48">
              <img
                className="h-72 w-auto"
                src={patientManagementImage}
                alt=""
              />

              <CardContent className="flex flex-col gap-4 justify-center text-gray-600">
                <h1 className="text-2xl font-bold">Analytics & Reports</h1>
                <p>
                  <ul className="flex gap-2 flex-col list-disc pl-5">
                    <li>
                      Track your clinic’s performance with in-depth analytics,
                      helping you identify strengths, bottlenecks, and
                      opportunities for growth.
                    </li>
                    <li>
                      Measure patient outcomes over time to improve care
                      quality, enhance treatment strategies, and build stronger
                      trust with patients.
                    </li>

                    <li>
                      Gain visibility into revenue trends and optimize your
                      financial performance with clear, actionable insights.
                    </li>
                  </ul>
                </p>
              </CardContent>
            </div>

            <div className="flex justify-center gap-48">
              <CardContent className="flex flex-col gap-4 justify-center text-gray-600">
                <h1 className="text-2xl font-bold">Patient Communication</h1>
                <p>
                  <ul className="flex gap-2 flex-col list-disc pl-5">
                    <li>
                      Communicate confidently with patients through a secure,
                      HIPAA-compliant messaging system designed to protect
                      sensitive information.
                    </li>
                    <li>
                      Streamline consultations, follow-ups, and updates, all
                      while maintaining full privacy and confidentiality.
                    </li>

                    <li>
                      Enhance patient satisfaction and trust by offering a
                      direct, secure channel for medical questions,
                      clarifications, and support.
                    </li>
                  </ul>
                </p>
              </CardContent>

              <img
                className="h-72 w-auto"
                src={patientCommunicationImage}
                alt=""
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
