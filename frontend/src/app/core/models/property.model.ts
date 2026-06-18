export interface Property {

  _id?: string;

  title: string;

  description: string;

  price: number;

  city: string;

  country: string;

  propertyType: string;

  imageUrls: string[];

  owner?: any;
}