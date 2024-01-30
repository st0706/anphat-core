import FAQSection from "@/components/homepage/FAQSection";
import FeatureSection from "@/components/homepage/FeatureSection";
import HeroSection from "@/components/homepage/HeroSection";
import { PageFooter } from "@/components/homepage/PageFooter";
import PageHeader from "@/components/homepage/PageHeader";
import PricingSection from "@/components/homepage/PricingSection";
import env from "@/lib/env";

const Home = () => {
  // Redirect to login page if landing page is disabled
  if (env.hideLandingPage) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true
      }
    };
  }

  return (
    <>
      <PageHeader />
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <FAQSection />
      <PageFooter />
    </>
  );
};

export default Home;
