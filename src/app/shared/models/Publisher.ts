export interface ServiceType {
    serviceTypeId: number;
    name: string;
    price: number;
    description: string;
}

export interface Publisher {
    publisherId: number;
    companyName: string;
    rating: number;
    logoUrl: string;
    description: string;
    location: string;
    contactEmail: string;
    phoneNumber: string;
    invited?: boolean;
    serviceTypes: ServiceType[];
}
