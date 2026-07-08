import { AccessToken } from "livekit-server-sdk";
import { env } from "../config/env";
import { AppError } from "../exceptions/AppError";
import { callTokenSchema } from "../validators/listener.validators";

export class CallService {
  async createLiveKitToken(input: typeof callTokenSchema._type) {
    if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET || !env.LIVEKIT_URL) {
      throw new AppError(503, "LIVEKIT_NOT_CONFIGURED", "LiveKit credentials are missing");
    }

    const token = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity: input.participantName,
    });

    token.addGrant({
      room: input.roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    return {
      url: env.LIVEKIT_URL,
      token: await token.toJwt(),
      roomName: input.roomName,
    };
  }
}
