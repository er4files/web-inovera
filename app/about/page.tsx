import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page | PT. Inoventra Era Nusantara",
  description: "Solusi berbagai sektor dengan teknologi IoT - Artikel dan insight terbaru seputar teknologi, industri, dan pertanian",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
  pageName="Tentang Kami"
  description="Perusahaan yang fokus pada pengembangan solusi teknologi IoT untuk transformasi digital Indonesia, terutama di sektor pertanian dan industri."
/>

      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
