export type Session = {
  id: string;
  userAgent: string | null;
  expiresAt: Date;
  createdAt: Date;
  lastSeenAt: Date;
  isCurrent: boolean;
};
