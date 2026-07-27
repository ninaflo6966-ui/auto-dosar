import { IdentityCard } from "./IdentityCard";

export interface Person {
  id?: string;

  lastName?: string;
  firstName?: string;

  cnp?: string;
  address?: string;

  email?: string;
  phone?: string;

  identityCard?: IdentityCard;
}