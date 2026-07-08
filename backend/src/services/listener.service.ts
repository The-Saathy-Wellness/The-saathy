import { ListenerRepository } from "../repositories/listener.repository";
import { matchListenerSchema } from "../validators/listener.validators";

export class ListenerService {
  constructor(private readonly listeners = new ListenerRepository()) {}

  async match(input: typeof matchListenerSchema._type) {
    const matches = await this.listeners.findAvailable(input.language, input.topic);
    return {
      matches,
      fallback:
        matches.length === 0
          ? "No exact listener match is available right now. Offer AI support and queue a callback."
          : undefined,
    };
  }
}
