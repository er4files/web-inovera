import { getImagePath } from "@/lib/utils";
import { Brand } from "@/types/brand";

const getBrandsData = (): Brand[] => [
  {
    id: 1,
    name: "E-Store",
    href: "#",
    image: getImagePath("/images/brands/estore.svg"),
    imageLight: getImagePath("/images/brands/estore-light.svg"),
  },
  {
    id: 2,
    name: "EraDev-Solution",
    href: "#",
    image: getImagePath("/images/brands/eradev.svg"),
    imageLight: getImagePath("/images/brands/eradev-light.svg"),
  },
  {
    id: 3,
    name: "TOBOX-Teknologi Out of The Box",
    href: "#",
    image: getImagePath("/images/brands/tobox.svg"),
    imageLight: getImagePath("/images/brands/tobox-light.svg"),
  },
  {
    id: 4,
    name: "Inovera",
    href: "#",
    image: getImagePath("/images/brands/inoventra.svg"),
    imageLight: getImagePath("/images/brands/inoventra-light.svg"),
  },
];

export default getBrandsData;
