// import CTA from "@/components/cta";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Testimonials from "@/components/testimonials";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero/>
      <Features/>
      <Testimonials/>
      {/* <CTA/> */}
      <Footer/>
    </div>
  );
};

export default LandingPage;
