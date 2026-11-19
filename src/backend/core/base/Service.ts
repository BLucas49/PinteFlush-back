import { RepositoryManager } from "../../db/RepositoryManager.js";

export abstract class AService {
  protected readonly rManager: RepositoryManager;
  constructor() {
    this.rManager = RepositoryManager.getInstance();
  }
}
