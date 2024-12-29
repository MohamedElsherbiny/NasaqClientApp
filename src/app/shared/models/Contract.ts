import { BookRequest } from "./BookRequest";
import { ContractStatus } from "./ContractStatus";

export interface Contract {
    contractId: number;
    requestId: number;
    request: BookRequest;
    status: ContractStatus;
    contractStatus: string;
    includePublisherServices: boolean;
    contractFiles: ContractFile[];
}

export interface ContractFile {
    contractFileId: number;
    file: number;
    fileName: string;
    version: string;
    createdDate: Date;
    createdBy: string;
}