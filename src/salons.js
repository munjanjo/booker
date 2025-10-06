import missylogo from "./assets/missy.png";

import novitadalogo from "./assets/novitada.jpg";

const salons = [
  {
    id: "Missy",
    name: "Missy Hair & Beauty",
    location: "Put Radoševca 13, Split",
    logo: missylogo,
    services: [
      {
        name: "Feniranje",
        duration: "20 mins",
        description: "Brzo feniranje kose. Quick blow-dry.",
        price: "€10",
      },
      {
        name: "ŠIŠANJE",
        duration: "30mins",
        description: "Šišanje kose po želji. Haircut as per your request.",
        price: "€20",
      },
    ],
    professionals: [
      {
        id: "m1",
        name: "Ana",
        role: "Frizerka",
        photo: "https://via.placeholder.com/150", // kasnije možeš staviti pravu sliku
      },
      {
        id: "m2",
        name: "Petra",
        role: "Makeup Artist",
        photo: "https://via.placeholder.com/150",
      },
      {
        id: "m",
        name: "Any professional",
      },
    ],
  },
  {
    id: "Novitada",
    name: "Barbershop Novitada",
    location: "Put duilova 45, Split",
    logo: novitadalogo,
    professionals: [
      {
        id: "m",
        name: "Any professional",
      },
      {
        id: "n1",
        name: "Marko",
        role: "Barber",
        photo: "https://via.placeholder.com/150",
      },
      {
        id: "n2",
        name: "Ivan",
        role: "Barber",
        photo: "https://via.placeholder.com/150",
      },
    ],
    services: [
      {
        name: "FADE ŠIŠANJE",
        duration: "40 mins",
        description:
          "Moderno šišanje s fade-om (taper, niski, srednji ili visoki). Modern haircut with a fade.",
        price: "€20",
      },
      {
        name: "ŠIŠANJE + TRETMAN BRADE",
        duration: "1 hr, 10 mins",
        description:
          "Klasično ili fade šišanje + uređivanje brade (vrući ručnici, vapozon, masažer).",
        price: "€35",
      },
      {
        name: "BUZZ FADE",
        duration: "30 mins",
        description:
          "Šišanje na jednu dužinu s fade-om. One length on top with fade.",
        price: "€18",
      },
      {
        name: "KLASIČNO ŠIŠANJE",
        duration: "40 mins",
        description: "Klasično muško šišanje bez fade-a.",
        price: "€20",
      },
    ],
  },
];

export default salons;
