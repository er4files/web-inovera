import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | PT. Inoventra Era Nusantara",
  description: "Solusi berbagai sektor dengan teknologi IoT - Artikel dan insight terbaru seputar teknologi, industri, dan pertanian",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Page"
        description="Hubungi PT. Inoventra Era Nusantara untuk solusi teknologi IoT di sektor industri dan pertanian."
      />

      <Contact />
    </>
  );
};

export default ContactPage;