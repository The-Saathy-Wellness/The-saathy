export class NotificationService {
  async createCheckIn(userId: string, message?: string) {
    return {
      id: `notification-${Date.now()}`,
      userId,
      type: "daily_check_in",
      message: message ?? "How are you feeling today?",
      status: "queued",
      createdAt: new Date().toISOString(),
    };
  }
}
