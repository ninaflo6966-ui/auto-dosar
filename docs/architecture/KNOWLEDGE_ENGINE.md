# Knowledge Engine 2.0

The Knowledge Engine is the read-only expert knowledge layer. It publishes validated knowledge packages and resolves operation requirements for a date, jurisdiction, variant and fact context. It does not decide case readiness and does not mutate the Digital Twin.

Flow: Package → Validator → Repository → Version selector → Operation resolver → Requirement resolver → Resolution.

The architecture keeps legal knowledge outside application control flow. Seed content is marked for legal review before production use.
