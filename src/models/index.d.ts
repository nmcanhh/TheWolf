import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Product {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly image: string;
  readonly images: string[];
  readonly options?: string[];
  readonly avgRating: number;
  readonly ratings?: number;
  readonly price: number;
  readonly oldPrice?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Product>);
  static copyOf(source: Product, mutator: (draft: MutableModel<Product>) => MutableModel<Product> | void): Product;
}

export declare class CartProduct {
  readonly id: string;
  readonly userSub: string;
  readonly quantity: number;
  readonly option?: string;
  readonly productID: string;
  readonly product?: Product;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<CartProduct>);
  static copyOf(source: CartProduct, mutator: (draft: MutableModel<CartProduct>) => MutableModel<CartProduct> | void): CartProduct;
}