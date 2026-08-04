import {
  CreateCaseFileUseCase,
  InMemoryCaseFileRepository,
  InMemoryEventBus,
  RemoveDocumentUseCase,
  UpdateAnswerUseCase,
  UploadDocumentUseCase,
  createDefaultOperationRegistry,
} from "@autodosar/adi-core";

const globalRuntime = globalThis as typeof globalThis & {
  __autoDosarCaseRuntime?: ReturnType<typeof createRuntime>;
};

function createRuntime() {
  const repository = new InMemoryCaseFileRepository();
  const eventBus = new InMemoryEventBus();
  const operationRegistry = createDefaultOperationRegistry();

  return {
    repository,
    eventBus,
    operationRegistry,
    createCase: new CreateCaseFileUseCase({ repository, eventBus }),
    updateAnswers: new UpdateAnswerUseCase({ repository, eventBus, operationRegistry }),
    uploadDocument: new UploadDocumentUseCase({ repository, eventBus, operationRegistry }),
    removeDocument: new RemoveDocumentUseCase({ repository, eventBus, operationRegistry }),
  };
}

export const caseFileRuntime = globalRuntime.__autoDosarCaseRuntime ?? createRuntime();
if (process.env.NODE_ENV !== "production") globalRuntime.__autoDosarCaseRuntime = caseFileRuntime;
