export interface PublisherEmployee {
    employeeId: number;
    publisherId: number;
    name: string;
    email: string;
    isAdmin: boolean;
    roles: PublisherEmployeeRole[];
    avatar: string;
  }

  export interface PublisherEmployeeRole {
      name: string;
      value: number;
  }
  
  
