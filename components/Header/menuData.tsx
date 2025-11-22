import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Tentang Kami",
    path: "/about",
    newTab: false,
  },
  {
    id: 33,
    title: "Blog",
    path: "/blog",
    newTab: false,
  },
  {
    id: 3,
    title: "Kontak Kami",
    path: "/contact",
    newTab: false,
  },
  {
    id: 4,
    title: "Layanan",
    newTab: false,
    submenu: [
      {
        id: 43,
        title: "E-Store",
        path: "/error",
        newTab: false,
      },
      {
        id: 44,
        title: "TOBOX - Solusi IoT",
        path: "/error",
        newTab: false,
      },
      {
        id: 41,
        title: "EraDev Solution",
        path: "/error",
        newTab: false,
      },
    ],
  },
];

export default menuData;
