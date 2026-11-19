import { AService } from "./Service.js";

export abstract class AController {
  protected abstract readonly service: AService;
}
