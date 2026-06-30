/**
 * ПРИМЕР: где держать Zustand
 *
 * Бизнес-стейт → features/<name>/model/
 * Глобальный UI (тема, sidebar) → можно здесь в shared/lib/, если не привязан к фиче.
 *
 * См. пример store в src/features/_examples/with-zustand/model/example.store.ts
 */

export {};

// Куда это идёт в архитектуре:
// shared/lib/ — только инфраструктура без бизнес-логики фич.
