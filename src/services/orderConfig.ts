// ─── Types ───────────────────────────────────────────────────────────────────

export type ProductType = 'cake' | 'cupcakes' | 'cookies';
export type CakeSize = 'small' | 'medium' | 'large';
export type CakeBase = 'vanilla' | 'chocolate' | 'lemon';
export type VanillaFilling = 'cream' | 'raspberry' | 'strawberry' | 'caramel';
export type ChocolateFilling = 'ganache' | 'hazelnut' | 'cherry' | 'orange';
export type LemonFilling = 'lemon-curd' | 'blueberry' | 'elderflower';
export type Fruit = 'strawberries' | 'raspberries' | 'blueberries' | 'mixed' | 'none';

export interface OrderConfig {
  productType: ProductType | null;
  size: CakeSize | null;
  base: CakeBase | null;
  filling: string | null;
  fruit: Fruit | null;
  decorationNotes: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

// ─── Option Metadata ──────────────────────────────────────────────────────────

export const PRODUCT_TYPES: { id: ProductType; label: string; description: string; emoji: string }[] = [
  { id: 'cake',     label: 'Cake',     description: 'A layered celebration cake, fully customised',  emoji: '🎂' },
  { id: 'cupcakes', label: 'Cupcakes', description: 'Individual cupcakes, perfect for any occasion', emoji: '🧁' },
  { id: 'cookies',  label: 'Cookies',  description: 'Handcrafted cookies, beautifully decorated',    emoji: '🍪' },
];

// Sizes for cakes
export const SIZES: { id: CakeSize; label: string; serves: string; basePrice: number }[] = [
  { id: 'small',  label: 'Petite',  serves: '4–6 pers.',   basePrice: 35 },
  { id: 'medium', label: 'Classic', serves: '8–10 pers.',  basePrice: 55 },
  { id: 'large',  label: 'Grand',   serves: '12–16 pers.', basePrice: 80 },
];

// Quantities for cupcakes / cookies
export const CUPCAKE_QUANTITIES: { id: CakeSize; label: string; qty: string; basePrice: number }[] = [
  { id: 'small',  label: 'Box of 6',  qty: '6 cupcakes',  basePrice: 22 },
  { id: 'medium', label: 'Box of 12', qty: '12 cupcakes', basePrice: 40 },
  { id: 'large',  label: 'Box of 24', qty: '24 cupcakes', basePrice: 75 },
];

export const COOKIE_QUANTITIES: { id: CakeSize; label: string; qty: string; basePrice: number }[] = [
  { id: 'small',  label: 'Box of 12', qty: '12 cookies', basePrice: 18 },
  { id: 'medium', label: 'Box of 24', qty: '24 cookies', basePrice: 32 },
  { id: 'large',  label: 'Box of 48', qty: '48 cookies', basePrice: 58 },
];

export const BASES: { id: CakeBase; label: string; description: string; emoji: string }[] = [
  { id: 'vanilla',   label: 'Vanilla',   description: 'Light sponge with Madagascar vanilla',  emoji: '🍦' },
  { id: 'chocolate', label: 'Chocolate', description: 'Rich dark chocolate ganache sponge',    emoji: '🍫' },
  { id: 'lemon',     label: 'Lemon',     description: 'Zesty citrus with a buttery crumb',     emoji: '🍋' },
];

export const FILLINGS: Record<CakeBase, { id: string; label: string; price: number }[]> = {
  vanilla: [
    { id: 'cream',      label: 'Whipped Cream',      price: 0 },
    { id: 'raspberry',  label: 'Raspberry Jam',       price: 3 },
    { id: 'strawberry', label: 'Strawberry Compote',  price: 3 },
    { id: 'caramel',    label: 'Salted Caramel',      price: 5 },
  ],
  chocolate: [
    { id: 'ganache',   label: 'Dark Ganache',         price: 0 },
    { id: 'hazelnut',  label: 'Hazelnut Praline',     price: 5 },
    { id: 'cherry',    label: 'Morello Cherry',       price: 4 },
    { id: 'orange',    label: 'Orange Zest Cream',    price: 3 },
  ],
  lemon: [
    { id: 'lemon-curd',   label: 'Lemon Curd',        price: 0 },
    { id: 'blueberry',    label: 'Blueberry Compote', price: 4 },
    { id: 'elderflower',  label: 'Elderflower Cream', price: 5 },
  ],
};

export const FRUITS: { id: Fruit; label: string; price: number }[] = [
  { id: 'none',         label: 'No Fruit',      price: 0 },
  { id: 'strawberries', label: 'Strawberries',  price: 6 },
  { id: 'raspberries',  label: 'Raspberries',   price: 6 },
  { id: 'blueberries',  label: 'Blueberries',   price: 5 },
  { id: 'mixed',        label: 'Mixed Berries', price: 8 },
];

// ─── Pricing ──────────────────────────────────────────────────────────────────

export function calculatePrice(config: OrderConfig): number {
  let total = 0;

  if (config.productType === 'cupcakes' && config.size) {
    const q = CUPCAKE_QUANTITIES.find(q => q.id === config.size);
    if (q) total += q.basePrice;
  } else if (config.productType === 'cookies' && config.size) {
    const q = COOKIE_QUANTITIES.find(q => q.id === config.size);
    if (q) total += q.basePrice;
  } else if (config.size) {
    const sizeObj = SIZES.find(s => s.id === config.size);
    if (sizeObj) total += sizeObj.basePrice;
  }

  if (config.base && config.filling) {
    const fillingObj = FILLINGS[config.base]?.find(f => f.id === config.filling);
    if (fillingObj) total += fillingObj.price;
  }

  if (config.fruit) {
    const fruitObj = FRUITS.find(f => f.id === config.fruit);
    if (fruitObj) total += fruitObj.price;
  }

  return total;
}