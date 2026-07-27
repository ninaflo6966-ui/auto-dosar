# AutoDosar AI – Domain UML v1.0

## 1. Scop

Acest document definește modelul de domeniu al platformei AutoDosar.

Modelul trebuie să reflecte realitatea administrativă a operațiunilor auto din România și să permită gestionarea tuturor categoriilor de vehicule.

## 2. Categorii de vehicule vizate

AutoDosar este proiectat pentru toate categoriile de vehicule, inclusiv:

- autoturisme;
- motociclete;
- mopede;
- autoutilitare;
- camioane;
- autobuze;
- remorci;
- semiremorci;
- tractoare;
- utilaje;
- vehicule speciale.

## 3. Principiu de modelare

AutoDosar nu modelează formulare.

AutoDosar modelează obiecte reale:

- persoane;
- companii;
- vehicule;
- documente;
- dosare;
- operațiuni;
- reguli;
- validări;
- plăți;
- notificări.

## 4. Entități principale

```mermaid
classDiagram

class User {
  +string id
  +string email
  +string phone
}

class Folder {
  +string id
  +Operation operation
  +FolderStatus status
  +number confidenceScore
}

class Operation {
  +OperationCategory category
  +OperationType type
}

class Person {
  +string id
  +string lastName
  +string firstName
  +string cnp
  +string address
}

class Company {
  +string id
  +string name
  +string cui
  +string registrationNumber
  +string address
}

class Vehicle {
  +string id
  +string vin
  +VehicleCategory category
  +string brand
  +string model
  +string civSeries
  +string registrationNumber
}

class Document {
  +string id
  +DocumentType type
  +DocumentSource source
  +DocumentStatus status
  +number confidence
}

class ValidationResult {
  +ValidationSeverity severity
  +string message
  +string field
}

class Payment {
  +string id
  +PaymentStatus status
  +number amount
}

class Notification {
  +string id
  +NotificationType type
  +NotificationStatus status
}

User "1" --> "*" Folder
Folder "1" --> "1" Operation
Folder "1" --> "*" Person
Folder "1" --> "*" Company
Folder "1" --> "1" Vehicle
Folder "1" --> "*" Document
Folder "1" --> "*" ValidationResult
Folder "1" --> "*" Payment
Folder "1" --> "*" Notification