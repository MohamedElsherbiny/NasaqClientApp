export type PublisherService = 'design' | 'publishing' | 'auditing';

// export interface Publisher {
//   id: string;
//   name: string;
//   companyName: string;
//   description: string;
//   services: PublisherService[];
//   serviceTypes: PublisherServiceType[];
//   logo?: string;
//   website?: string;
//   email: string;
//   phone: string;
//   rating: number;
//   avatar: string;
//   invited?: boolean;
// }

export interface PublisherServiceType {
  serviceTypeId: number;
  name: string;
  description: string;
  price: number;
}