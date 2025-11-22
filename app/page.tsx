import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Video from "@/components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PT. Inoventra Era Nusantara - Innovating Indonesia's Future",
  description: "Transforming industries with cutting-edge IoT technology and solutions for a smarter tomorrow.",
  keywords: "IoT, Agriculture 4.0, Smart Farming, Technology Solutions, Innovation, Indonesia",
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Blog />
      <Brands />
      <AboutSectionTwo />
      <Video />
      <Features />
    </>
  );
}
