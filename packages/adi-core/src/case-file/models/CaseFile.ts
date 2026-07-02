import { Person } from "../../identity/models/Person";
import { Company } from "../../identity/models/Company";
import { ValidationResult } from "../../validation/models/ValidationResult";
import { Document } from "../../documents/models/Document";
import { Vehicle } from "../../vehicle/models/Vehicle";

export interface CaseFile {

    id: string;

    operation: string;

    status: string;

    persons: Person[];

    companies: Company[];

    vehicles: Vehicle[];

    documents: Document[];

    validation?: ValidationResult;

    createdAt: Date;

    updatedAt: Date;
}