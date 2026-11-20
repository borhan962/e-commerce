export interface IProduct {
  _id: string;
  id?: string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  originalPrice?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  category: {
    _id?: string;
    name: string;
    slug?: string;
  };
  imageCover: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  quantity?: number;
  inStock?: boolean;
}

