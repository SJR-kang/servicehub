const { prisma } = require("./db");

function assertRolePair(currentUser, otherUser) {
  const currentRole = String(currentUser?.role || "").toUpperCase();
  const otherRole = String(otherUser?.role || "").toUpperCase();
  const valid =
    (currentRole === "SEEKER" && otherRole === "PROVIDER") ||
    (currentRole === "PROVIDER" && otherRole === "SEEKER");
  return valid;
}

function getOtherParticipant(conversation, sessionSub) {
  return conversation.seekerId === sessionSub ? conversation.provider : conversation.seeker;
}

function getUnreadCount(conversation, sessionSub) {
  const lastReadAt = conversation.seekerId === sessionSub ? conversation.seekerLastReadAt : conversation.providerLastReadAt;
  const lastReadDate = lastReadAt ? new Date(lastReadAt) : null;
  return (conversation.messages || []).filter((message) => {
    if (message.senderId === sessionSub) return false;
    if (!lastReadDate) return true;
    return new Date(message.createdAt) > lastReadDate;
  }).length;
}

function serializeConversation(conversation, sessionSub) {
  const otherParticipant = getOtherParticipant(conversation, sessionSub);
  const lastMessage = (conversation.messages || [])[0] || null;

  return {
    id: conversation.id,
    kind: conversation.kind,
    requestId: conversation.requestId || null,
    lastMessageAt: conversation.lastMessageAt,
    unreadCount: getUnreadCount(conversation, sessionSub),
    otherParticipant: otherParticipant
      ? {
          id: otherParticipant.id,
          name: otherParticipant.name,
          email: otherParticipant.email,
          role: otherParticipant.role,
        }
      : null,
    request: conversation.request
      ? {
          id: conversation.request.id,
          requestCode: conversation.request.requestCode,
          serviceName: conversation.request.serviceName,
        }
      : null,
    lastMessage: lastMessage
      ? {
          id: lastMessage.id,
          body: lastMessage.body,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId,
        }
      : null,
  };
}

function serializeMessage(message) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    senderName: message.sender?.name || "User",
    body: message.body,
    createdAt: message.createdAt,
  };
}

async function getConversationForUser(conversationId, sessionSub) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      seeker: { select: { id: true, name: true, email: true, role: true } },
      provider: { select: { id: true, name: true, email: true, role: true } },
      request: { select: { id: true, requestCode: true, serviceName: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!conversation) return null;
  if (conversation.seekerId !== sessionSub && conversation.providerId !== sessionSub) return null;
  return conversation;
}

async function markConversationRead(conversationId, sessionSub) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { id: true, seekerId: true, providerId: true },
  });
  if (!conversation) return null;
  if (conversation.seekerId !== sessionSub && conversation.providerId !== sessionSub) return null;
  const now = new Date();
  const data = conversation.seekerId === sessionSub ? { seekerLastReadAt: now } : { providerLastReadAt: now };
  return prisma.conversation.update({
    where: { id: conversationId },
    data,
  });
}

module.exports = {
  assertRolePair,
  getConversationForUser,
  markConversationRead,
  serializeConversation,
  serializeMessage,
};
