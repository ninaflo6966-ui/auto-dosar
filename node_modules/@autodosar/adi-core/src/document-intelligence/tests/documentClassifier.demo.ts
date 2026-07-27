import { RuleBasedDocumentClassifier } from "../classifier/RuleBasedDocumentClassifier";

const classifier = new RuleBasedDocumentClassifier();

const samples = [
  `
  ROMANIA
  CARTE DE IDENTITATE
  CNP 1900512123451
  NUME POPESCU
  `,
  `
  CARTEA DE IDENTITATE A VEHICULULUI
  VIN VF1ABC12345678901
  DACIA LOGAN
  `,
  `
  POLITA RCA
  ASIGURARE OBLIGATORIE
  ASIGURAT ION POPESCU
  `,
  `
  CONTRACT DE ÎNSTRĂINARE-DOBÂNDIRE
  ITL-054
  `,
];

for (const sample of samples) {
  const result = classifier.classify(sample);
  console.log(JSON.stringify(result, null, 2));
}