export type Product = {
    id: number;
    slug: string;
    title: string;
    price: string;
    tags: string[];
    cover: string;
};

export const PRODUCTS: Product[] = [
    { id:1, slug: 'logo-mini', title: 'Logo Mini', price: '$120', tags: ['Logos'], cover: '/placeholder/p1.jpg' },
    { id:1, slug: 'streamer-package-x', title: 'Streamer Package X', price: '$260', tags: ['Stream Package'], cover: '/placeholder/p2.jpg' },
    { id:1, slug: 'overlay-set', title: 'Overlay Set', price: '$80', tags: ['Overlays'], cover: '/placeholder/p3.jpg' },
];