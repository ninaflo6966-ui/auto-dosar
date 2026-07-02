export interface Vehicle {
  id: string;

  vin?: string;
  registrationNumber?: string;

  brand?: string;
  model?: string;
  category?: string;

  civSeries?: string;

  createdAt?: Date;
  updatedAt?: Date;
}