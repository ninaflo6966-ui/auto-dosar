@'
export * from "./models/IdentityCard";
export * from "./models/Person";
export * from "./models/Company";

export * from "./parsers/IdentityParser";
export * from "./validators/IdentityValidator";
export * from "./services/IdentityService";
'@ | Set-Content -Encoding UTF8 "F:\auto-dosar\packages\adi-core\src\identity\index.ts"