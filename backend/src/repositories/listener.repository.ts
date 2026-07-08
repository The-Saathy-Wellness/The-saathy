import { inMemoryStore } from "./inMemoryStore";

export class ListenerRepository {
  async findAvailable(language?: string, topic?: string) {
    const normalizedLanguage = language?.toLowerCase();
    const normalizedTopic = topic?.toLowerCase();

    return inMemoryStore.listListeners().filter((listener) => {
      const languageMatch =
        !normalizedLanguage ||
        listener.languages.some((item) => item.toLowerCase() === normalizedLanguage);
      const topicMatch =
        !normalizedTopic ||
        listener.specialties.some((item) => item.toLowerCase().includes(normalizedTopic));
      return listener.available && languageMatch && topicMatch;
    });
  }
}
