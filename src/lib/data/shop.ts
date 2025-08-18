export type Product = {
  title: string;
  slug: string;
  price: string; // "$260.00"
  cover: string; // image path or URL
  tags: string[];
};

export const PRODUCTS: Product[] = [
  {
    title: "Logo Pack A",
    slug: "logo-pack-a",
    price: "$260.00",
    cover: "/images/p1.jpg",
    tags: ["Logos"]
  },
  {
    title: "Stream Overlay",
    slug: "overlay-01",
    price: "$180.00",
    cover: "/images/p2.jpg",
    tags: ["Overlays", "Stream Packs"]
  },
  {
    title: "Logo Pack B",
    slug: "logo-pack-b",
    price: "$320.00",
    cover: "/images/p3.jpg",
    tags: ["Logos"]
  }
];
