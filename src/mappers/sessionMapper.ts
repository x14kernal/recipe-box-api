import type { UserSession } from '../generated/prisma/client.js';
import type { Session } from '../types/session.js';

type DbSession = UserSession;

export function mapSession(session: DbSession, isCurrent = false): Session {
  return {
    id: session.id,
    userAgent: session.user_agent,
    expiresAt: session.expires_at,
    createdAt: session.created_at,
    lastSeenAt: session.last_seen_at,
    isCurrent,
  };
}
