export interface PublisherEmployee {
    employeeId: number;
    publisherId: number;
    name: string;
    email: string;
    isAdmin: boolean;
    roles: PublisherEmployeeRole[];
  }

  export interface PublisherEmployeeRole {
      name: string;
      value: number;
  }
  
  
