// GENERATED. DO NOT EDIT.
// Source: spec/bot/api.json
// Run: pnpm bot:generate

import type { SchemaNode } from "@leemour/cli-core/codegen"

export const definitions: Readonly<Record<string, SchemaNode>> = {
  Update: {
    type: "object",
    properties: {
      update_id: {
        type: "integer",
        format: "int64",
        description:
          "The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This identifier becomes especially handy if you're using webhooks, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially.",
      },
      message: {
        type: "ref",
        ref: "Message",
        description: "Optional. New incoming message of any kind - text, photo, sticker, etc.",
      },
      edited_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. New version of a message that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.",
      },
      channel_post: {
        type: "ref",
        ref: "Message",
        description: "Optional. New incoming channel post of any kind - text, photo, sticker, etc.",
      },
      edited_channel_post: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. New version of a channel post that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.",
      },
      business_connection: {
        type: "ref",
        ref: "BusinessConnection",
        description:
          "Optional. The bot was connected to or disconnected from a business account, or a user edited an existing connection with the bot",
      },
      business_message: {
        type: "ref",
        ref: "Message",
        description: "Optional. New message from a connected business account",
      },
      edited_business_message: {
        type: "ref",
        ref: "Message",
        description: "Optional. New version of a message from a connected business account",
      },
      deleted_business_messages: {
        type: "ref",
        ref: "BusinessMessagesDeleted",
        description: "Optional. Messages were deleted from a connected business account",
      },
      guest_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. New guest message. The bot can use the field Message.guest_query_id and the method answerGuestQuery to send a message in response.",
      },
      message_reaction: {
        type: "ref",
        ref: "MessageReactionUpdated",
        description:
          'Optional. A reaction to a message was changed by a user. The bot must be an administrator in the chat and must explicitly specify "message_reaction" in the list of allowed_updates to receive these updates. The update isn\'t received for reactions set by bots.',
      },
      message_reaction_count: {
        type: "ref",
        ref: "MessageReactionCountUpdated",
        description:
          'Optional. Reactions to a message with anonymous reactions were changed. The bot must be an administrator in the chat and must explicitly specify "message_reaction_count" in the list of allowed_updates to receive these updates. The updates are grouped and can be sent with delay up to a few minutes.',
      },
      inline_query: {
        type: "ref",
        ref: "InlineQuery",
        description: "Optional. New incoming inline query",
      },
      chosen_inline_result: {
        type: "ref",
        ref: "ChosenInlineResult",
        description:
          "Optional. The result of an inline query that was chosen by a user and sent to their chat partner. Please see our documentation on the feedback collecting for details on how to enable these updates for your bot.",
      },
      callback_query: {
        type: "ref",
        ref: "CallbackQuery",
        description: "Optional. New incoming callback query",
      },
      shipping_query: {
        type: "ref",
        ref: "ShippingQuery",
        description: "Optional. New incoming shipping query. Only for invoices with flexible price.",
      },
      pre_checkout_query: {
        type: "ref",
        ref: "PreCheckoutQuery",
        description: "Optional. New incoming pre-checkout query. Contains full information about checkout.",
      },
      purchased_paid_media: {
        type: "ref",
        ref: "PaidMediaPurchased",
        description:
          "Optional. A user purchased paid media with a non-empty payload sent by the bot in a non-channel chat",
      },
      poll: {
        type: "ref",
        ref: "Poll",
        description:
          "Optional. New poll state. Bots receive only updates about manually stopped polls and polls, which are sent by the bot.",
      },
      poll_answer: {
        type: "ref",
        ref: "PollAnswer",
        description:
          "Optional. A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself.",
      },
      my_chat_member: {
        type: "ref",
        ref: "ChatMemberUpdated",
        description:
          "Optional. The bot's chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user.",
      },
      chat_member: {
        type: "ref",
        ref: "ChatMemberUpdated",
        description:
          'Optional. A chat member\'s status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify "chat_member" in the list of allowed_updates to receive these updates.',
      },
      chat_join_request: {
        type: "ref",
        ref: "ChatJoinRequest",
        description:
          "Optional. A request to join the chat has been sent. The bot must have the can_invite_users administrator right in the chat to receive these updates.",
      },
      chat_boost: {
        type: "ref",
        ref: "ChatBoostUpdated",
        description:
          "Optional. A chat boost was added or changed. The bot must be an administrator in the chat to receive these updates.",
      },
      removed_chat_boost: {
        type: "ref",
        ref: "ChatBoostRemoved",
        description:
          "Optional. A boost was removed from a chat. The bot must be an administrator in the chat to receive these updates.",
      },
      managed_bot: {
        type: "ref",
        ref: "ManagedBotUpdated",
        description:
          "Optional. A new bot was created to be managed by the bot, or token or owner of a managed bot was changed",
      },
      subscription: {
        type: "ref",
        ref: "BotSubscriptionUpdated",
        description: "Optional. User payment subscription has changed",
      },
      stopped_message_generation: {
        type: "ref",
        ref: "MessageGenerationStopped",
        description: "Optional. A user asked the bot to stop the generation of a message",
      },
    },
    required: ["update_id"],
  },
  WebhookInfo: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "Webhook URL, may be empty if webhook is not set up",
      },
      has_custom_certificate: {
        type: "boolean",
        description: "True, if a custom certificate was provided for webhook certificate checks",
      },
      pending_update_count: {
        type: "integer",
        description: "Number of updates awaiting delivery",
      },
      ip_address: {
        type: "string",
        description: "Optional. Currently used webhook IP address",
      },
      last_error_date: {
        type: "integer",
        description:
          "Optional. Unix time for the most recent error that happened when trying to deliver an update via webhook",
      },
      last_error_message: {
        type: "string",
        description:
          "Optional. Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook",
      },
      last_synchronization_error_date: {
        type: "integer",
        description:
          "Optional. Unix time of the most recent error that happened when trying to synchronize available updates with Telegram datacenters",
      },
      max_connections: {
        type: "integer",
        description:
          "Optional. The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery",
      },
      allowed_updates: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "Optional. A list of update types the bot is subscribed to. Defaults to all update types except chat_member, message_reaction, and message_reaction_count.",
      },
    },
    required: ["url", "has_custom_certificate", "pending_update_count"],
  },
  User: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      is_bot: {
        type: "boolean",
        description: "True, if this user is a bot",
      },
      first_name: {
        type: "string",
        description: "User's or bot's first name",
      },
      last_name: {
        type: "string",
        description: "Optional. User's or bot's last name",
      },
      username: {
        type: "string",
        description: "Optional. User's or bot's username",
      },
      language_code: {
        type: "string",
        description: "Optional. IETF language tag of the user's language",
      },
      is_premium: {
        type: "boolean",
        description: "Optional. True, if this user is a Telegram Premium user",
      },
      added_to_attachment_menu: {
        type: "boolean",
        description: "Optional. True, if this user added the bot to the attachment menu",
      },
      can_join_groups: {
        type: "boolean",
        description: "Optional. True, if the bot can be invited to groups. Returned only in getMe.",
      },
      can_read_all_group_messages: {
        type: "boolean",
        description: "Optional. True, if privacy mode is disabled for the bot. Returned only in getMe.",
      },
      supports_guest_queries: {
        type: "boolean",
        description:
          "Optional. True, if the bot supports guest queries from chats it is not a member of. Returned only in getMe.",
      },
      supports_inline_queries: {
        type: "boolean",
        description: "Optional. True, if the bot supports inline queries. Returned only in getMe.",
      },
      can_connect_to_business: {
        type: "boolean",
        description:
          "Optional. True, if the bot can be connected to a user account to manage it. Returned only in getMe.",
      },
      has_main_web_app: {
        type: "boolean",
        description: "Optional. True, if the bot has a main Web App. Returned only in getMe.",
      },
      has_topics_enabled: {
        type: "boolean",
        description:
          "Optional. True, if the bot has forum topic mode enabled in private chats. Returned only in getMe.",
      },
      allows_users_to_create_topics: {
        type: "boolean",
        description:
          "Optional. True, if the bot allows users to create and delete topics in private chats. Returned only in getMe.",
      },
      can_manage_bots: {
        type: "boolean",
        description:
          "Optional. True, if other bots can be created to be controlled by the bot. Returned only in getMe.",
      },
      supports_join_request_queries: {
        type: "boolean",
        description:
          "Optional. True, if the bot supports join request queries and can be assigned to process them. Returned only in getMe.",
      },
    },
    required: ["id", "is_bot", "first_name"],
  },
  Chat: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      type: {
        type: "string",
        description: 'Type of the chat, can be either "private", "group", "supergroup" or "channel"',
      },
      title: {
        type: "string",
        description: "Optional. Title, for supergroups, channels and group chats",
      },
      username: {
        type: "string",
        description: "Optional. Username, for private chats, supergroups and channels if available",
      },
      first_name: {
        type: "string",
        description: "Optional. First name of the other party in a private chat",
      },
      last_name: {
        type: "string",
        description: "Optional. Last name of the other party in a private chat",
      },
      is_forum: {
        type: "boolean",
        description: "Optional. True, if the supergroup chat is a forum (has topics enabled)",
      },
      is_direct_messages: {
        type: "boolean",
        description: "Optional. True, if the chat is the direct messages chat of a channel",
      },
    },
    required: ["id", "type"],
  },
  ChatFullInfo: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      type: {
        type: "string",
        description: 'Type of the chat, can be either "private", "group", "supergroup" or "channel"',
      },
      title: {
        type: "string",
        description: "Optional. Title, for supergroups, channels and group chats",
      },
      username: {
        type: "string",
        description: "Optional. Username, for private chats, supergroups and channels if available",
      },
      first_name: {
        type: "string",
        description: "Optional. First name of the other party in a private chat",
      },
      last_name: {
        type: "string",
        description: "Optional. Last name of the other party in a private chat",
      },
      is_forum: {
        type: "boolean",
        description: "Optional. True, if the supergroup chat is a forum (has topics enabled)",
      },
      is_direct_messages: {
        type: "boolean",
        description: "Optional. True, if the chat is the direct messages chat of a channel",
      },
      accent_color_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the accent color for the chat name and backgrounds of the chat photo, reply header, and link preview. See accent colors for more details.",
      },
      max_reaction_count: {
        type: "integer",
        description: "The maximum number of reactions that can be set on a message in the chat",
      },
      photo: {
        type: "ref",
        ref: "ChatPhoto",
        description: "Optional. Chat photo",
      },
      active_usernames: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "Optional. If non-empty, the list of all active chat usernames; for private chats, supergroups and channels",
      },
      birthdate: {
        type: "ref",
        ref: "Birthdate",
        description: "Optional. For private chats, the date of birth of the user",
      },
      business_intro: {
        type: "ref",
        ref: "BusinessIntro",
        description: "Optional. For private chats with business accounts, the intro of the business",
      },
      business_location: {
        type: "ref",
        ref: "BusinessLocation",
        description: "Optional. For private chats with business accounts, the location of the business",
      },
      business_opening_hours: {
        type: "ref",
        ref: "BusinessOpeningHours",
        description: "Optional. For private chats with business accounts, the opening hours of the business",
      },
      personal_chat: {
        type: "ref",
        ref: "Chat",
        description: "Optional. For private chats, the personal channel of the user",
      },
      parent_chat: {
        type: "ref",
        ref: "Chat",
        description: "Optional. Information about the corresponding channel chat; for direct messages chats only",
      },
      available_reactions: {
        type: "array",
        items: {
          type: "ref",
          ref: "ReactionType",
        },
        description:
          "Optional. List of available reactions allowed in the chat. If omitted, then all emoji reactions are allowed.",
      },
      background_custom_emoji_id: {
        type: "string",
        description:
          "Optional. Custom emoji identifier of the emoji chosen by the chat for the reply header and link preview background",
      },
      profile_accent_color_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. Identifier of the accent color for the chat's profile background. See profile accent colors for more details.",
      },
      profile_background_custom_emoji_id: {
        type: "string",
        description: "Optional. Custom emoji identifier of the emoji chosen by the chat for its profile background",
      },
      emoji_status_custom_emoji_id: {
        type: "string",
        description:
          "Optional. Custom emoji identifier of the emoji status of the chat or the other party in a private chat",
      },
      emoji_status_expiration_date: {
        type: "integer",
        description:
          "Optional. Expiration date of the emoji status of the chat or the other party in a private chat, in Unix time, if any",
      },
      bio: {
        type: "string",
        description: "Optional. Bio of the other party in a private chat",
      },
      has_private_forwards: {
        type: "boolean",
        description:
          "Optional. True, if privacy settings of the other party in the private chat allows to use tg://user?id=<user_id> links only in chats with the user",
      },
      has_restricted_voice_and_video_messages: {
        type: "boolean",
        description:
          "Optional. True, if the privacy settings of the other party restrict sending voice and video note messages in the private chat",
      },
      join_to_send_messages: {
        type: "boolean",
        description: "Optional. True, if users need to join the supergroup before they can send messages",
      },
      join_by_request: {
        type: "boolean",
        description:
          "Optional. True, if all users directly joining the supergroup without using an invite link need to be approved by supergroup administrators",
      },
      description: {
        type: "string",
        description: "Optional. Description, for groups, supergroups and channel chats",
      },
      invite_link: {
        type: "string",
        description: "Optional. Primary invite link, for groups, supergroups and channel chats",
      },
      pinned_message: {
        type: "ref",
        ref: "Message",
        description: "Optional. The most recent pinned message (by sending date)",
      },
      permissions: {
        type: "ref",
        ref: "ChatPermissions",
        description: "Optional. Default chat member permissions, for groups and supergroups",
      },
      accepted_gift_types: {
        type: "ref",
        ref: "AcceptedGiftTypes",
        description:
          "Information about types of gifts that are accepted by the chat or by the corresponding user for private chats",
      },
      can_send_paid_media: {
        type: "boolean",
        description:
          "Optional. True, if paid media messages can be sent or forwarded to the channel chat. The field is available only for channel chats.",
      },
      slow_mode_delay: {
        type: "integer",
        description:
          "Optional. For supergroups, the minimum allowed delay between consecutive messages sent by each unprivileged user; in seconds",
      },
      unrestrict_boost_count: {
        type: "integer",
        description:
          "Optional. For supergroups, the minimum number of boosts that a non-administrator user needs to add in order to ignore slow mode and chat permissions",
      },
      message_auto_delete_time: {
        type: "integer",
        description:
          "Optional. The time after which all messages sent to the chat will be automatically deleted; in seconds",
      },
      has_aggressive_anti_spam_enabled: {
        type: "boolean",
        description:
          "Optional. True, if aggressive anti-spam checks are enabled in the supergroup. The field is only available to chat administrators.",
      },
      has_hidden_members: {
        type: "boolean",
        description:
          "Optional. True, if non-administrators can only get the list of bots and administrators in the chat",
      },
      has_protected_content: {
        type: "boolean",
        description: "Optional. True, if messages from the chat can't be forwarded to other chats",
      },
      has_visible_history: {
        type: "boolean",
        description:
          "Optional. True, if new chat members will have access to old messages; available only to chat administrators",
      },
      sticker_set_name: {
        type: "string",
        description: "Optional. For supergroups, name of the group sticker set",
      },
      can_set_sticker_set: {
        type: "boolean",
        description: "Optional. True, if the bot can change the group sticker set",
      },
      custom_emoji_sticker_set_name: {
        type: "string",
        description:
          "Optional. For supergroups, the name of the group's custom emoji sticker set. Custom emoji from this set can be used by all users and bots in the group.",
      },
      linked_chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.",
      },
      location: {
        type: "ref",
        ref: "ChatLocation",
        description: "Optional. For supergroups, the location to which the supergroup is connected",
      },
      rating: {
        type: "ref",
        ref: "UserRating",
        description: "Optional. For private chats, the rating of the user if any",
      },
      first_profile_audio: {
        type: "ref",
        ref: "Audio",
        description: "Optional. For private chats, the first audio added to the profile of the user",
      },
      unique_gift_colors: {
        type: "ref",
        ref: "UniqueGiftColors",
        description:
          "Optional. The color scheme based on a unique gift that must be used for the chat's name, message replies and link previews",
      },
      paid_message_star_count: {
        type: "integer",
        description: "Optional. The number of Telegram Stars a general user has to pay to send a message to the chat",
      },
      guard_bot: {
        type: "ref",
        ref: "User",
        description:
          "Optional. The bot that processes join request queries in the chat. The field is only available to chat administrators.",
      },
      community: {
        type: "ref",
        ref: "Community",
        description: "Optional. The Community to which the chat belongs",
      },
    },
    required: ["id", "type", "accent_color_id", "max_reaction_count", "accepted_gift_types"],
  },
  Message: {
    type: "object",
    properties: {
      message_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique message identifier inside this chat; 0 for ephemeral messages. In specific instances (e.g., a message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. Unique identifier of a message thread or forum topic to which the message belongs; for supergroups and private chats only",
      },
      direct_messages_topic: {
        type: "ref",
        ref: "DirectMessagesTopic",
        description: "Optional. Information about the direct messages chat topic that contains the message",
      },
      from: {
        type: "ref",
        ref: "User",
        description:
          "Optional. Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats.",
      },
      sender_chat: {
        type: "ref",
        ref: "Chat",
        description:
          "Optional. Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel's discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field from contains a fake sender user in non-channel chats.",
      },
      sender_boost_count: {
        type: "integer",
        description: "Optional. If the sender of the message boosted the chat, the number of boosts added by the user",
      },
      sender_business_bot: {
        type: "ref",
        ref: "User",
        description:
          "Optional. The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account.",
      },
      sender_tag: {
        type: "string",
        description: "Optional. Tag or custom title of the sender of the message; for supergroups only",
      },
      receiver_user: {
        type: "ref",
        ref: "User",
        description: "Optional. For ephemeral messages, the user who received the message",
      },
      ephemeral_message_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. For ephemeral messages, identifier of the ephemeral message inside this chat. The identifier may be reused for another ephemeral message after the message is deleted or expires.",
      },
      date: {
        type: "integer",
        description:
          "Date the message was sent in Unix time. It is always a positive number, representing a valid date.",
      },
      guest_query_id: {
        type: "string",
        description:
          "Optional. The unique identifier for the guest query. Use this identifier with the method answerGuestQuery to send a response message. If non-empty, the message belongs to the chat where the guest bot was summoned, which may not coincide with other existing bot chats sharing the same identifier.",
      },
      business_connection_id: {
        type: "string",
        description:
          "Optional. Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier.",
      },
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Chat the message belongs to",
      },
      forward_origin: {
        type: "ref",
        ref: "MessageOrigin",
        description: "Optional. Information about the original message for forwarded messages",
      },
      is_topic_message: {
        type: "boolean",
        description:
          "Optional. True, if the message is sent to a topic in a forum supergroup or a private chat with the bot",
      },
      is_automatic_forward: {
        type: "boolean",
        description:
          "Optional. True, if the message is a channel post that was automatically forwarded to the connected discussion group",
      },
      reply_to_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. For replies in the same chat and message thread, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply. If the message is a reply to an ephemeral message, then this field may be omitted.",
      },
      external_reply: {
        type: "ref",
        ref: "ExternalReplyInfo",
        description:
          "Optional. Information about the message that is being replied to, which may come from another chat or forum topic",
      },
      quote: {
        type: "ref",
        ref: "TextQuote",
        description: "Optional. For replies that quote part of the original message, the quoted part of the message",
      },
      reply_to_story: {
        type: "ref",
        ref: "Story",
        description: "Optional. For replies to a story, the original story",
      },
      reply_to_checklist_task_id: {
        type: "integer",
        format: "int64",
        description: "Optional. Identifier of the specific checklist task that is being replied to",
      },
      reply_to_poll_option_id: {
        type: "string",
        description: "Optional. Persistent identifier of the specific poll option that is being replied to",
      },
      via_bot: {
        type: "ref",
        ref: "User",
        description: "Optional. Bot through which the message was sent",
      },
      guest_bot_caller_user: {
        type: "ref",
        ref: "User",
        description:
          "Optional. For a message sent by a guest bot, this is the user whose original message triggered the bot's response",
      },
      guest_bot_caller_chat: {
        type: "ref",
        ref: "Chat",
        description:
          "Optional. For a message sent by a guest bot, this is the chat whose original message triggered the bot's response",
      },
      edit_date: {
        type: "integer",
        description: "Optional. Date the message was last edited in Unix time",
      },
      has_protected_content: {
        type: "boolean",
        description: "Optional. True, if the message can't be forwarded",
      },
      is_from_offline: {
        type: "boolean",
        description:
          "Optional. True, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message",
      },
      is_paid_post: {
        type: "boolean",
        description:
          "Optional. True, if the message is a paid post. Note that such posts must not be deleted for 24 hours to receive the payment and can't be edited.",
      },
      media_group_id: {
        type: "string",
        description:
          "Optional. The unique identifier inside this chat of a media message group this message belongs to",
      },
      author_signature: {
        type: "string",
        description:
          "Optional. Signature of the post author for messages in channels, or the custom title of an anonymous group administrator",
      },
      paid_star_count: {
        type: "integer",
        description: "Optional. The number of Telegram Stars that were paid by the sender of the message to send it",
      },
      text: {
        type: "string",
        description: "Optional. For text messages, the actual UTF-8 text of the message",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text",
      },
      link_preview_options: {
        type: "ref",
        ref: "LinkPreviewOptions",
        description:
          "Optional. Options used for link preview generation for the message, if it is a text message and link preview options were changed",
      },
      suggested_post_info: {
        type: "ref",
        ref: "SuggestedPostInfo",
        description:
          "Optional. Information about suggested post parameters if the message is a suggested post in a channel direct messages chat. If the message is an approved or declined suggested post, then it can't be edited.",
      },
      effect_id: {
        type: "string",
        description: "Optional. Unique identifier of the message effect added to the message",
      },
      rich_message: {
        type: "ref",
        ref: "RichMessage",
        description: "Optional. Message is a rich formatted message",
      },
      animation: {
        type: "ref",
        ref: "Animation",
        description:
          "Optional. Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set.",
      },
      audio: {
        type: "ref",
        ref: "Audio",
        description: "Optional. Message is an audio file, information about the file",
      },
      document: {
        type: "ref",
        ref: "Document",
        description: "Optional. Message is a general file, information about the file",
      },
      live_photo: {
        type: "ref",
        ref: "LivePhoto",
        description:
          "Optional. Message is a live photo, information about the live photo. For backward compatibility, when this field is set, the photo field will also be set.",
      },
      paid_media: {
        type: "ref",
        ref: "PaidMediaInfo",
        description: "Optional. Message contains paid media; information about the paid media",
      },
      photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Optional. Message is a photo, available sizes of the photo",
      },
      sticker: {
        type: "ref",
        ref: "Sticker",
        description: "Optional. Message is a sticker, information about the sticker",
      },
      story: {
        type: "ref",
        ref: "Story",
        description: "Optional. Message is a forwarded story",
      },
      video: {
        type: "ref",
        ref: "Video",
        description: "Optional. Message is a video, information about the video",
      },
      video_note: {
        type: "ref",
        ref: "VideoNote",
        description: "Optional. Message is a video note, information about the video message",
      },
      voice: {
        type: "ref",
        ref: "Voice",
        description: "Optional. Message is a voice message, information about the file",
      },
      caption: {
        type: "string",
        description: "Optional. Caption for the animation, audio, document, paid media, photo, video or voice",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. True, if the caption must be shown above the message media",
      },
      has_media_spoiler: {
        type: "boolean",
        description: "Optional. True, if the message media is covered by a spoiler animation",
      },
      checklist: {
        type: "ref",
        ref: "Checklist",
        description: "Optional. Message is a checklist",
      },
      contact: {
        type: "ref",
        ref: "Contact",
        description: "Optional. Message is a shared contact, information about the contact",
      },
      dice: {
        type: "ref",
        ref: "Dice",
        description: "Optional. Message is a dice with random value",
      },
      game: {
        type: "ref",
        ref: "Game",
        description:
          "Optional. Message is a game, information about the game. More about games: https://core.telegram.org/bots/api#games",
      },
      poll: {
        type: "ref",
        ref: "Poll",
        description: "Optional. Message is a native poll, information about the poll",
      },
      venue: {
        type: "ref",
        ref: "Venue",
        description:
          "Optional. Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set.",
      },
      location: {
        type: "ref",
        ref: "Location",
        description: "Optional. Message is a shared location, information about the location",
      },
      new_chat_members: {
        type: "array",
        items: {
          type: "ref",
          ref: "User",
        },
        description:
          "Optional. New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)",
      },
      left_chat_member: {
        type: "ref",
        ref: "User",
        description:
          "Optional. A member was removed from the group, information about them (this member may be the bot itself)",
      },
      chat_owner_left: {
        type: "ref",
        ref: "ChatOwnerLeft",
        description: "Optional. Service message: chat owner has left",
      },
      chat_owner_changed: {
        type: "ref",
        ref: "ChatOwnerChanged",
        description: "Optional. Service message: chat owner has changed",
      },
      new_chat_title: {
        type: "string",
        description: "Optional. A chat title was changed to this value",
      },
      new_chat_photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Optional. A chat photo was change to this value",
      },
      delete_chat_photo: {
        type: "boolean",
        description: "Optional. Service message: the chat photo was deleted",
      },
      group_chat_created: {
        type: "boolean",
        description: "Optional. Service message: the group has been created",
      },
      supergroup_chat_created: {
        type: "boolean",
        description:
          "Optional. Service message: the supergroup has been created. This field can't be received in a message coming through updates, because bot can't be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup.",
      },
      channel_chat_created: {
        type: "boolean",
        description:
          "Optional. Service message: the channel has been created. This field can't be received in a message coming through updates, because bot can't be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel.",
      },
      message_auto_delete_timer_changed: {
        type: "ref",
        ref: "MessageAutoDeleteTimerChanged",
        description: "Optional. Service message: auto-delete timer settings changed in the chat",
      },
      migrate_to_chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      migrate_from_chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      pinned_message: {
        type: "ref",
        ref: "MaybeInaccessibleMessage",
        description:
          "Optional. Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply.",
      },
      invoice: {
        type: "ref",
        ref: "Invoice",
        description:
          "Optional. Message is an invoice for a payment, information about the invoice. More about payments: https://core.telegram.org/bots/api#payments",
      },
      successful_payment: {
        type: "ref",
        ref: "SuccessfulPayment",
        description:
          "Optional. Message is a service message about a successful payment, information about the payment. More about payments: https://core.telegram.org/bots/api#payments",
      },
      refunded_payment: {
        type: "ref",
        ref: "RefundedPayment",
        description:
          "Optional. Message is a service message about a refunded payment, information about the payment. More about payments: https://core.telegram.org/bots/api#payments",
      },
      users_shared: {
        type: "ref",
        ref: "UsersShared",
        description: "Optional. Service message: users were shared with the bot",
      },
      chat_shared: {
        type: "ref",
        ref: "ChatShared",
        description: "Optional. Service message: a chat was shared with the bot",
      },
      gift: {
        type: "ref",
        ref: "GiftInfo",
        description: "Optional. Service message: a regular gift was sent or received",
      },
      unique_gift: {
        type: "ref",
        ref: "UniqueGiftInfo",
        description: "Optional. Service message: a unique gift was sent or received",
      },
      gift_upgrade_sent: {
        type: "ref",
        ref: "GiftInfo",
        description: "Optional. Service message: upgrade of a gift was purchased after the gift was sent",
      },
      connected_website: {
        type: "string",
        description:
          "Optional. The domain name of the website on which the user has logged in. More about Telegram Login: https://core.telegram.org/widgets/login",
      },
      write_access_allowed: {
        type: "ref",
        ref: "WriteAccessAllowed",
        description:
          "Optional. Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method requestWriteAccess",
      },
      passport_data: {
        type: "ref",
        ref: "PassportData",
        description: "Optional. Telegram Passport data",
      },
      proximity_alert_triggered: {
        type: "ref",
        ref: "ProximityAlertTriggered",
        description:
          "Optional. Service message: a user in the chat triggered another user's proximity alert while sharing Live Location",
      },
      boost_added: {
        type: "ref",
        ref: "ChatBoostAdded",
        description: "Optional. Service message: user boosted the chat",
      },
      chat_background_set: {
        type: "ref",
        ref: "ChatBackground",
        description: "Optional. Service message: chat background set",
      },
      checklist_tasks_done: {
        type: "ref",
        ref: "ChecklistTasksDone",
        description: "Optional. Service message: some tasks in a checklist were marked as done or not done",
      },
      checklist_tasks_added: {
        type: "ref",
        ref: "ChecklistTasksAdded",
        description: "Optional. Service message: tasks were added to a checklist",
      },
      community_chat_added: {
        type: "ref",
        ref: "CommunityChatAdded",
        description: "Optional. Service message: chat or bot added to a Community",
      },
      community_chat_joined: {
        type: "ref",
        ref: "CommunityChatJoined",
        description: "Optional. Service message: chat was joined by a user from a Community",
      },
      community_chat_removed: {
        type: "ref",
        ref: "CommunityChatRemoved",
        description: "Optional. Service message: chat or bot removed from a Community",
      },
      direct_message_price_changed: {
        type: "ref",
        ref: "DirectMessagePriceChanged",
        description:
          "Optional. Service message: the price for paid messages in the corresponding direct messages chat of a channel has changed",
      },
      forum_topic_created: {
        type: "ref",
        ref: "ForumTopicCreated",
        description: "Optional. Service message: forum topic created",
      },
      forum_topic_edited: {
        type: "ref",
        ref: "ForumTopicEdited",
        description: "Optional. Service message: forum topic edited",
      },
      forum_topic_closed: {
        type: "ref",
        ref: "ForumTopicClosed",
        description: "Optional. Service message: forum topic closed",
      },
      forum_topic_reopened: {
        type: "ref",
        ref: "ForumTopicReopened",
        description: "Optional. Service message: forum topic reopened",
      },
      general_forum_topic_hidden: {
        type: "ref",
        ref: "GeneralForumTopicHidden",
        description: "Optional. Service message: the 'General' forum topic hidden",
      },
      general_forum_topic_unhidden: {
        type: "ref",
        ref: "GeneralForumTopicUnhidden",
        description: "Optional. Service message: the 'General' forum topic unhidden",
      },
      giveaway_created: {
        type: "ref",
        ref: "GiveawayCreated",
        description: "Optional. Service message: a scheduled giveaway was created",
      },
      giveaway: {
        type: "ref",
        ref: "Giveaway",
        description: "Optional. The message is a scheduled giveaway message",
      },
      giveaway_winners: {
        type: "ref",
        ref: "GiveawayWinners",
        description: "Optional. A giveaway with public winners was completed",
      },
      giveaway_completed: {
        type: "ref",
        ref: "GiveawayCompleted",
        description: "Optional. Service message: a giveaway without public winners was completed",
      },
      managed_bot_created: {
        type: "ref",
        ref: "ManagedBotCreated",
        description: "Optional. Service message: user created a bot that will be managed by the current bot",
      },
      paid_message_price_changed: {
        type: "ref",
        ref: "PaidMessagePriceChanged",
        description: "Optional. Service message: the price for paid messages has changed in the chat",
      },
      poll_option_added: {
        type: "ref",
        ref: "PollOptionAdded",
        description: "Optional. Service message: answer option was added to a poll",
      },
      poll_option_deleted: {
        type: "ref",
        ref: "PollOptionDeleted",
        description: "Optional. Service message: answer option was deleted from a poll",
      },
      suggested_post_approved: {
        type: "ref",
        ref: "SuggestedPostApproved",
        description: "Optional. Service message: a suggested post was approved",
      },
      suggested_post_approval_failed: {
        type: "ref",
        ref: "SuggestedPostApprovalFailed",
        description: "Optional. Service message: approval of a suggested post has failed",
      },
      suggested_post_declined: {
        type: "ref",
        ref: "SuggestedPostDeclined",
        description: "Optional. Service message: a suggested post was declined",
      },
      suggested_post_paid: {
        type: "ref",
        ref: "SuggestedPostPaid",
        description: "Optional. Service message: payment for a suggested post was received",
      },
      suggested_post_refunded: {
        type: "ref",
        ref: "SuggestedPostRefunded",
        description: "Optional. Service message: payment for a suggested post was refunded",
      },
      video_chat_scheduled: {
        type: "ref",
        ref: "VideoChatScheduled",
        description: "Optional. Service message: video chat scheduled",
      },
      video_chat_started: {
        type: "ref",
        ref: "VideoChatStarted",
        description: "Optional. Service message: video chat started",
      },
      video_chat_ended: {
        type: "ref",
        ref: "VideoChatEnded",
        description: "Optional. Service message: video chat ended",
      },
      video_chat_participants_invited: {
        type: "ref",
        ref: "VideoChatParticipantsInvited",
        description: "Optional. Service message: new participants invited to a video chat",
      },
      web_app_data: {
        type: "ref",
        ref: "WebAppData",
        description: "Optional. Service message: data sent by a Web App",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description:
          "Optional. Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons.",
      },
    },
    required: ["message_id", "date", "chat"],
  },
  MessageId: {
    type: "object",
    properties: {
      message_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique message identifier. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.",
      },
    },
    required: ["message_id"],
  },
  InaccessibleMessage: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Chat the message belonged to",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Unique message identifier inside the chat",
      },
      date: {
        type: "integer",
        description: "Always 0. The field can be used to differentiate regular and inaccessible messages.",
      },
    },
    required: ["chat", "message_id", "date"],
  },
  MaybeInaccessibleMessage: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "Message",
      },
      {
        type: "ref",
        ref: "InaccessibleMessage",
      },
    ],
  },
  MessageEntity: {
    type: "object",
    properties: {
      type: {
        type: "string",
        description:
          'Type of the entity. Currently, can be "mention" (@username), "hashtag" (#hashtag or #hashtag@chatusername), "cashtag" ($USD or $USD@chatusername), "bot_command" (/start@jobs_bot), "url" (https://telegram.org), "email" (do-not-reply@telegram.org), "phone_number" (+1-212-555-0123), "bold" (bold text), "italic" (italic text), "underline" (underlined text), "strikethrough" (strikethrough text), "spoiler" (spoiler message), "blockquote" (block quotation), "expandable_blockquote" (collapsed-by-default block quotation), "code" (monowidth string), "pre" (monowidth block), "text_link" (for clickable text URLs), "text_mention" (for users without usernames), "custom_emoji" (for inline custom emoji stickers), or "date_time" (for formatted date and time).',
      },
      offset: {
        type: "integer",
        description: "Offset in UTF-16 code units to the start of the entity",
      },
      length: {
        type: "integer",
        description: "Length of the entity in UTF-16 code units",
      },
      url: {
        type: "string",
        description: 'Optional. For "text_link" only, URL that will be opened after user taps on the text',
      },
      user: {
        type: "ref",
        ref: "User",
        description: 'Optional. For "text_mention" only, the mentioned user',
      },
      language: {
        type: "string",
        description: 'Optional. For "pre" only, the programming language of the entity text',
      },
      custom_emoji_id: {
        type: "string",
        description:
          'Optional. For "custom_emoji" only, unique identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker.',
      },
      unix_time: {
        type: "integer",
        description: 'Optional. For "date_time" only, the Unix time associated with the entity',
      },
      date_time_format: {
        type: "string",
        description:
          'Optional. For "date_time" only, the string that defines the formatting of the date and time. See date-time entity formatting for more details.',
      },
    },
    required: ["type", "offset", "length"],
  },
  TextQuote: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "Text of the quoted part of a message that is replied to by the given message",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. Special entities that appear in the quote. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are kept in quotes.",
      },
      position: {
        type: "integer",
        description:
          "Approximate quote position in the original message in UTF-16 code units as specified by the sender",
      },
      is_manual: {
        type: "boolean",
        description:
          "Optional. True, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server.",
      },
    },
    required: ["text", "position"],
  },
  ExternalReplyInfo: {
    type: "object",
    properties: {
      origin: {
        type: "ref",
        ref: "MessageOrigin",
        description: "Origin of the message replied to by the given message",
      },
      chat: {
        type: "ref",
        ref: "Chat",
        description:
          "Optional. Chat the original message belongs to. Available only if the chat is a supergroup or a channel.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. Unique message identifier inside the original chat. Available only if the original chat is a supergroup or a channel.",
      },
      link_preview_options: {
        type: "ref",
        ref: "LinkPreviewOptions",
        description:
          "Optional. Options used for link preview generation for the original message, if it is a text message",
      },
      animation: {
        type: "ref",
        ref: "Animation",
        description: "Optional. Message is an animation, information about the animation",
      },
      audio: {
        type: "ref",
        ref: "Audio",
        description: "Optional. Message is an audio file, information about the file",
      },
      document: {
        type: "ref",
        ref: "Document",
        description: "Optional. Message is a general file, information about the file",
      },
      live_photo: {
        type: "ref",
        ref: "LivePhoto",
        description: "Optional. Message is a live photo, information about the live photo",
      },
      paid_media: {
        type: "ref",
        ref: "PaidMediaInfo",
        description: "Optional. Message contains paid media; information about the paid media",
      },
      photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Optional. Message is a photo, available sizes of the photo",
      },
      sticker: {
        type: "ref",
        ref: "Sticker",
        description: "Optional. Message is a sticker, information about the sticker",
      },
      story: {
        type: "ref",
        ref: "Story",
        description: "Optional. Message is a forwarded story",
      },
      video: {
        type: "ref",
        ref: "Video",
        description: "Optional. Message is a video, information about the video",
      },
      video_note: {
        type: "ref",
        ref: "VideoNote",
        description: "Optional. Message is a video note, information about the video message",
      },
      voice: {
        type: "ref",
        ref: "Voice",
        description: "Optional. Message is a voice message, information about the file",
      },
      has_media_spoiler: {
        type: "boolean",
        description: "Optional. True, if the message media is covered by a spoiler animation",
      },
      checklist: {
        type: "ref",
        ref: "Checklist",
        description: "Optional. Message is a checklist",
      },
      contact: {
        type: "ref",
        ref: "Contact",
        description: "Optional. Message is a shared contact, information about the contact",
      },
      dice: {
        type: "ref",
        ref: "Dice",
        description: "Optional. Message is a dice with random value",
      },
      game: {
        type: "ref",
        ref: "Game",
        description:
          "Optional. Message is a game, information about the game. More about games: https://core.telegram.org/bots/api#games",
      },
      giveaway: {
        type: "ref",
        ref: "Giveaway",
        description: "Optional. Message is a scheduled giveaway, information about the giveaway",
      },
      giveaway_winners: {
        type: "ref",
        ref: "GiveawayWinners",
        description: "Optional. A giveaway with public winners was completed",
      },
      invoice: {
        type: "ref",
        ref: "Invoice",
        description:
          "Optional. Message is an invoice for a payment, information about the invoice. More about payments: https://core.telegram.org/bots/api#payments",
      },
      location: {
        type: "ref",
        ref: "Location",
        description: "Optional. Message is a shared location, information about the location",
      },
      poll: {
        type: "ref",
        ref: "Poll",
        description: "Optional. Message is a native poll, information about the poll",
      },
      venue: {
        type: "ref",
        ref: "Venue",
        description: "Optional. Message is a venue, information about the venue",
      },
    },
    required: ["origin"],
  },
  ReplyParameters: {
    type: "object",
    properties: {
      message_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. Identifier of the message that will be replied to in the current chat, or in the chat chat_id if it is specified. Required if ephemeral_message_id isn't specified.",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Optional. If the message to be replied to is from a different chat, unique identifier for the chat or username of the bot, supergroup or channel in the format @username. Not supported for messages sent on behalf of a business account, messages from channel direct messages chats and ephemeral messages.",
      },
      ephemeral_message_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. Identifier of the incoming ephemeral message that will be replied to in the current chat. A reply to an ephemeral message must itself be an ephemeral message. An ephemeral message may only be replied to within 15 seconds of being sent. Required if message_id isn't specified.",
      },
      allow_sending_without_reply: {
        type: "boolean",
        description:
          "Optional. Pass True if the message should be sent even if the specified message to be replied to is not found. Always False for replies in another chat or forum topic, and sent ephemeral messages. Always True for messages sent on behalf of a business account.",
      },
      quote: {
        type: "string",
        description:
          "Optional. Quoted part of the message to be replied to; 0-1024 characters after entities parsing. The quote must be an exact substring of the message to be replied to, including bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities. The message will fail to send if the quote isn't found in the original message. Ignored for ephemeral messages.",
      },
      quote_parse_mode: {
        type: "string",
        description: "Optional. Mode for parsing entities in the quote. See formatting options for more details.",
      },
      quote_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. A JSON-serialized list of special entities that appear in the quote. It can be specified instead of quote_parse_mode.",
      },
      quote_position: {
        type: "integer",
        description: "Optional. Position of the quote in the original message in UTF-16 code units",
      },
      checklist_task_id: {
        type: "integer",
        format: "int64",
        description: "Optional. Identifier of the specific checklist task to be replied to",
      },
      poll_option_id: {
        type: "string",
        description: "Optional. Persistent identifier of the specific poll option to be replied to",
      },
    },
    required: [],
  },
  EphemeralMessageParameters: {
    type: "object",
    properties: {
      receiver_user_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the user who will receive the message. It is not guaranteed that the user will receive the message, especially if they are offline. See here for more details.",
      },
      callback_query_id: {
        type: "string",
        description: "Optional. Identifier of the callback query which triggered the message, if any",
      },
      replace_callback_query_message: {
        type: "boolean",
        description:
          "Optional. Pass True if the ephemeral message must be shown in place of the original message. Must be False for callback queries from ephemeral messages, which must be edited using regular editEphemeralMessage... methods.",
      },
    },
    required: ["receiver_user_id"],
  },
  MessageOrigin: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "MessageOriginUser",
      },
      {
        type: "ref",
        ref: "MessageOriginHiddenUser",
      },
      {
        type: "ref",
        ref: "MessageOriginChat",
      },
      {
        type: "ref",
        ref: "MessageOriginChannel",
      },
    ],
  },
  MessageOriginUser: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["user"],
        description: 'Type of the message origin, always "user"',
      },
      date: {
        type: "integer",
        description: "Date the message was sent originally in Unix time",
      },
      sender_user: {
        type: "ref",
        ref: "User",
        description: "User that sent the message originally",
      },
    },
    required: ["type", "date", "sender_user"],
  },
  MessageOriginHiddenUser: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["hidden_user"],
        description: 'Type of the message origin, always "hidden_user"',
      },
      date: {
        type: "integer",
        description: "Date the message was sent originally in Unix time",
      },
      sender_user_name: {
        type: "string",
        description: "Name of the user that sent the message originally",
      },
    },
    required: ["type", "date", "sender_user_name"],
  },
  MessageOriginChat: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["chat"],
        description: 'Type of the message origin, always "chat"',
      },
      date: {
        type: "integer",
        description: "Date the message was sent originally in Unix time",
      },
      sender_chat: {
        type: "ref",
        ref: "Chat",
        description: "Chat that sent the message originally",
      },
      author_signature: {
        type: "string",
        description:
          "Optional. For messages originally sent by an anonymous chat administrator, original message author signature",
      },
    },
    required: ["type", "date", "sender_chat"],
  },
  MessageOriginChannel: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["channel"],
        description: 'Type of the message origin, always "channel"',
      },
      date: {
        type: "integer",
        description: "Date the message was sent originally in Unix time",
      },
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Channel chat to which the message was originally sent",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Unique message identifier inside the chat",
      },
      author_signature: {
        type: "string",
        description: "Optional. Signature of the original post author",
      },
    },
    required: ["type", "date", "chat", "message_id"],
  },
  PhotoSize: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      width: {
        type: "integer",
        description: "Photo width",
      },
      height: {
        type: "integer",
        description: "Photo height",
      },
      file_size: {
        type: "integer",
        description: "Optional. File size in bytes",
      },
    },
    required: ["file_id", "file_unique_id", "width", "height"],
  },
  Animation: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      width: {
        type: "integer",
        description: "Video width as defined by the sender",
      },
      height: {
        type: "integer",
        description: "Video height as defined by the sender",
      },
      duration: {
        type: "integer",
        description: "Duration of the video in seconds as defined by the sender",
      },
      thumbnail: {
        type: "ref",
        ref: "PhotoSize",
        description: "Optional. Animation thumbnail as defined by the sender",
      },
      file_name: {
        type: "string",
        description: "Optional. Original animation filename as defined by the sender",
      },
      mime_type: {
        type: "string",
        description: "Optional. MIME type of the file as defined by the sender",
      },
      file_size: {
        type: "integer",
        description:
          "Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.",
      },
    },
    required: ["file_id", "file_unique_id", "width", "height", "duration"],
  },
  Audio: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      duration: {
        type: "integer",
        description: "Duration of the audio in seconds as defined by the sender",
      },
      performer: {
        type: "string",
        description: "Optional. Performer of the audio as defined by the sender or by audio tags",
      },
      title: {
        type: "string",
        description: "Optional. Title of the audio as defined by the sender or by audio tags",
      },
      file_name: {
        type: "string",
        description: "Optional. Original filename as defined by the sender",
      },
      mime_type: {
        type: "string",
        description: "Optional. MIME type of the file as defined by the sender",
      },
      file_size: {
        type: "integer",
        description:
          "Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.",
      },
      thumbnail: {
        type: "ref",
        ref: "PhotoSize",
        description: "Optional. Thumbnail of the album cover to which the music file belongs",
      },
    },
    required: ["file_id", "file_unique_id", "duration"],
  },
  Document: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      thumbnail: {
        type: "ref",
        ref: "PhotoSize",
        description: "Optional. Document thumbnail as defined by the sender",
      },
      file_name: {
        type: "string",
        description: "Optional. Original filename as defined by the sender",
      },
      mime_type: {
        type: "string",
        description: "Optional. MIME type of the file as defined by the sender",
      },
      file_size: {
        type: "integer",
        description:
          "Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.",
      },
    },
    required: ["file_id", "file_unique_id"],
  },
  LivePhoto: {
    type: "object",
    properties: {
      photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Optional. Available sizes of the corresponding static photo",
      },
      file_id: {
        type: "string",
        description: "Identifier for the video file which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for the video file which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      width: {
        type: "integer",
        description: "Video width as defined by the sender",
      },
      height: {
        type: "integer",
        description: "Video height as defined by the sender",
      },
      duration: {
        type: "integer",
        description: "Duration of the video in seconds as defined by the sender",
      },
      mime_type: {
        type: "string",
        description: "Optional. MIME type of the file as defined by the sender",
      },
      file_size: {
        type: "integer",
        description:
          "Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.",
      },
    },
    required: ["file_id", "file_unique_id", "width", "height", "duration"],
  },
  Story: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Chat that posted the story",
      },
      id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the story in the chat",
      },
    },
    required: ["chat", "id"],
  },
  VideoQuality: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      width: {
        type: "integer",
        description: "Video width",
      },
      height: {
        type: "integer",
        description: "Video height",
      },
      codec: {
        type: "string",
        description: 'Codec that was used to encode the video, for example, "h264", "h265", or "av01"',
      },
      file_size: {
        type: "integer",
        description:
          "Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.",
      },
    },
    required: ["file_id", "file_unique_id", "width", "height", "codec"],
  },
  Video: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      width: {
        type: "integer",
        description: "Video width as defined by the sender",
      },
      height: {
        type: "integer",
        description: "Video height as defined by the sender",
      },
      duration: {
        type: "integer",
        description: "Duration of the video in seconds as defined by the sender",
      },
      thumbnail: {
        type: "ref",
        ref: "PhotoSize",
        description: "Optional. Video thumbnail",
      },
      cover: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Optional. Available sizes of the cover of the video in the message",
      },
      start_timestamp: {
        type: "integer",
        description: "Optional. Timestamp in seconds from which the video will play in the message",
      },
      qualities: {
        type: "array",
        items: {
          type: "ref",
          ref: "VideoQuality",
        },
        description: "Optional. List of available qualities of the video",
      },
      file_name: {
        type: "string",
        description: "Optional. Original filename as defined by the sender",
      },
      mime_type: {
        type: "string",
        description: "Optional. MIME type of the file as defined by the sender",
      },
      file_size: {
        type: "integer",
        description:
          "Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.",
      },
    },
    required: ["file_id", "file_unique_id", "width", "height", "duration"],
  },
  VideoNote: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      length: {
        type: "integer",
        description: "Video width and height (diameter of the video message) as defined by the sender",
      },
      duration: {
        type: "integer",
        description: "Duration of the video in seconds as defined by the sender",
      },
      thumbnail: {
        type: "ref",
        ref: "PhotoSize",
        description: "Optional. Video thumbnail",
      },
      file_size: {
        type: "integer",
        description: "Optional. File size in bytes",
      },
    },
    required: ["file_id", "file_unique_id", "length", "duration"],
  },
  Voice: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      duration: {
        type: "integer",
        description: "Duration of the audio in seconds as defined by the sender",
      },
      mime_type: {
        type: "string",
        description: "Optional. MIME type of the file as defined by the sender",
      },
      file_size: {
        type: "integer",
        description:
          "Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.",
      },
    },
    required: ["file_id", "file_unique_id", "duration"],
  },
  PaidMediaInfo: {
    type: "object",
    properties: {
      star_count: {
        type: "integer",
        description: "The number of Telegram Stars that must be paid to buy access to the media",
      },
      paid_media: {
        type: "array",
        items: {
          type: "ref",
          ref: "PaidMedia",
        },
        description: "Information about the paid media",
      },
    },
    required: ["star_count", "paid_media"],
  },
  PaidMedia: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "PaidMediaLivePhoto",
      },
      {
        type: "ref",
        ref: "PaidMediaPhoto",
      },
      {
        type: "ref",
        ref: "PaidMediaPreview",
      },
      {
        type: "ref",
        ref: "PaidMediaVideo",
      },
    ],
  },
  PaidMediaLivePhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["live_photo"],
        description: 'Type of the paid media, always "live_photo"',
      },
      live_photo: {
        type: "ref",
        ref: "LivePhoto",
        description: "The photo",
      },
    },
    required: ["type", "live_photo"],
  },
  PaidMediaPhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["photo"],
        description: 'Type of the paid media, always "photo"',
      },
      photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "The photo",
      },
    },
    required: ["type", "photo"],
  },
  PaidMediaPreview: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["preview"],
        description: 'Type of the paid media, always "preview"',
      },
      width: {
        type: "integer",
        description: "Optional. Media width as defined by the sender",
      },
      height: {
        type: "integer",
        description: "Optional. Media height as defined by the sender",
      },
      duration: {
        type: "integer",
        description: "Optional. Duration of the media in seconds as defined by the sender",
      },
    },
    required: ["type"],
  },
  PaidMediaVideo: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["video"],
        description: 'Type of the paid media, always "video"',
      },
      video: {
        type: "ref",
        ref: "Video",
        description: "The video",
      },
    },
    required: ["type", "video"],
  },
  Contact: {
    type: "object",
    properties: {
      phone_number: {
        type: "string",
        description: "Contact's phone number",
      },
      first_name: {
        type: "string",
        description: "Contact's first name",
      },
      last_name: {
        type: "string",
        description: "Optional. Contact's last name",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. Contact's user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      vcard: {
        type: "string",
        description: "Optional. Additional data about the contact in the form of a vCard",
      },
    },
    required: ["phone_number", "first_name"],
  },
  Dice: {
    type: "object",
    properties: {
      emoji: {
        type: "string",
        description: "Emoji on which the dice throw animation is based",
      },
      value: {
        type: "integer",
        description:
          'Value of the dice, 1-6 for "🎲", "🎯" and "🎳" base emoji, 1-5 for "🏀" and "⚽" base emoji, 1-64 for "🎰" base emoji',
      },
    },
    required: ["emoji", "value"],
  },
  Link: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "URL of the link",
      },
    },
    required: ["url"],
  },
  PollMedia: {
    type: "object",
    properties: {
      animation: {
        type: "ref",
        ref: "Animation",
        description: "Optional. Media is an animation, information about the animation",
      },
      audio: {
        type: "ref",
        ref: "Audio",
        description:
          "Optional. Media is an audio file, information about the file; currently, can't be received in a poll option",
      },
      document: {
        type: "ref",
        ref: "Document",
        description:
          "Optional. Media is a general file, information about the file; currently, can't be received in a poll option",
      },
      link: {
        type: "ref",
        ref: "Link",
        description: "Optional. The HTTP link attached to the poll option",
      },
      live_photo: {
        type: "ref",
        ref: "LivePhoto",
        description: "Optional. Media is a live photo, information about the live photo",
      },
      location: {
        type: "ref",
        ref: "Location",
        description: "Optional. Media is a shared location, information about the location",
      },
      photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Optional. Media is a photo, available sizes of the photo",
      },
      sticker: {
        type: "ref",
        ref: "Sticker",
        description: "Optional. Media is a sticker, information about the sticker; currently, for poll options only",
      },
      venue: {
        type: "ref",
        ref: "Venue",
        description: "Optional. Media is a venue, information about the venue",
      },
      video: {
        type: "ref",
        ref: "Video",
        description: "Optional. Media is a video, information about the video",
      },
    },
    required: [],
  },
  InputPollMedia: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "InputMediaAnimation",
      },
      {
        type: "ref",
        ref: "InputMediaAudio",
      },
      {
        type: "ref",
        ref: "InputMediaDocument",
      },
      {
        type: "ref",
        ref: "InputMediaLivePhoto",
      },
      {
        type: "ref",
        ref: "InputMediaLocation",
      },
      {
        type: "ref",
        ref: "InputMediaPhoto",
      },
      {
        type: "ref",
        ref: "InputMediaVenue",
      },
      {
        type: "ref",
        ref: "InputMediaVideo",
      },
    ],
  },
  InputPollOptionMedia: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "InputMediaAnimation",
      },
      {
        type: "ref",
        ref: "InputMediaLink",
      },
      {
        type: "ref",
        ref: "InputMediaLivePhoto",
      },
      {
        type: "ref",
        ref: "InputMediaLocation",
      },
      {
        type: "ref",
        ref: "InputMediaPhoto",
      },
      {
        type: "ref",
        ref: "InputMediaSticker",
      },
      {
        type: "ref",
        ref: "InputMediaVenue",
      },
      {
        type: "ref",
        ref: "InputMediaVideo",
      },
    ],
  },
  PollOption: {
    type: "object",
    properties: {
      persistent_id: {
        type: "string",
        description: "Unique identifier of the option, persistent on option addition and deletion",
      },
      text: {
        type: "string",
        description: "Option text, 1-100 characters",
      },
      text_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. Special entities that appear in the option text. Currently, only custom emoji entities are allowed in poll option texts",
      },
      media: {
        type: "ref",
        ref: "PollMedia",
        description: "Optional. Media added to the poll option",
      },
      voter_count: {
        type: "integer",
        description: "Number of users who voted for this option; may be 0 if unknown",
      },
      added_by_user: {
        type: "ref",
        ref: "User",
        description:
          "Optional. User who added the option; omitted if the option wasn't added by a user after poll creation",
      },
      added_by_chat: {
        type: "ref",
        ref: "Chat",
        description:
          "Optional. Chat that added the option; omitted if the option wasn't added by a chat after poll creation",
      },
      addition_date: {
        type: "integer",
        description:
          "Optional. Point in time (Unix timestamp) when the option was added; omitted if the option existed in the original poll",
      },
    },
    required: ["persistent_id", "text", "voter_count"],
  },
  InputPollOption: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "Option text, 1-100 characters",
      },
      text_parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the text. See formatting options for more details. Currently, only custom emoji entities are allowed.",
      },
      text_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. A JSON-serialized list of special entities that appear in the poll option text. It can be specified instead of text_parse_mode.",
      },
      media: {
        type: "ref",
        ref: "InputPollOptionMedia",
        description: "Optional. Media added to the poll option",
      },
    },
    required: ["text"],
  },
  PollAnswer: {
    type: "object",
    properties: {
      poll_id: {
        type: "string",
        description: "Unique poll identifier",
      },
      voter_chat: {
        type: "ref",
        ref: "Chat",
        description: "Optional. The chat that changed the answer to the poll, if the voter is anonymous",
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Optional. The user that changed the answer to the poll, if the voter isn't anonymous",
      },
      option_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description: "0-based identifiers of chosen answer options. May be empty if the vote was retracted.",
      },
      option_persistent_ids: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Persistent identifiers of the chosen answer options. May be empty if the vote was retracted.",
      },
    },
    required: ["poll_id", "option_ids", "option_persistent_ids"],
  },
  Poll: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique poll identifier",
      },
      question: {
        type: "string",
        description: "Poll question, 1-300 characters",
      },
      question_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. Special entities that appear in the question. Currently, only custom emoji entities are allowed in poll questions",
      },
      options: {
        type: "array",
        items: {
          type: "ref",
          ref: "PollOption",
        },
        description: "List of poll options",
      },
      total_voter_count: {
        type: "integer",
        description: "Total number of users that voted in the poll",
      },
      is_closed: {
        type: "boolean",
        description: "True, if the poll is closed",
      },
      is_anonymous: {
        type: "boolean",
        description: "True, if the poll is anonymous",
      },
      type: {
        type: "string",
        description: 'Poll type, currently can be "regular" or "quiz"',
      },
      allows_multiple_answers: {
        type: "boolean",
        description: "True, if the poll allows multiple answers",
      },
      allows_revoting: {
        type: "boolean",
        description: "True, if the poll allows to change the chosen answer options",
      },
      members_only: {
        type: "boolean",
        description:
          "True if voting is limited to users who have been members of the chat where the poll was originally sent for more than 24 hours",
      },
      country_codes: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          'Optional. A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll. The country code "FT" is used for users with anonymous numbers. If omitted, then users from any country can participate in the poll.',
      },
      correct_option_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "Optional. Array of 0-based identifiers of the correct answer options. Available only for polls in quiz mode which are closed or were sent (not forwarded) by the bot or to the private chat with the bot.",
      },
      explanation: {
        type: "string",
        description:
          "Optional. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters",
      },
      explanation_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the explanation",
      },
      explanation_media: {
        type: "ref",
        ref: "PollMedia",
        description: "Optional. Media added to the quiz explanation",
      },
      open_period: {
        type: "integer",
        description: "Optional. Amount of time in seconds the poll will be active after creation",
      },
      close_date: {
        type: "integer",
        description: "Optional. Point in time (Unix timestamp) when the poll will be automatically closed",
      },
      description: {
        type: "string",
        description: "Optional. Description of the poll; for polls inside the Message object only",
      },
      description_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the description",
      },
      media: {
        type: "ref",
        ref: "PollMedia",
        description: "Optional. Media added to the poll description; for polls inside the Message object only",
      },
    },
    required: [
      "id",
      "question",
      "options",
      "total_voter_count",
      "is_closed",
      "is_anonymous",
      "type",
      "allows_multiple_answers",
      "allows_revoting",
      "members_only",
    ],
  },
  ChecklistTask: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the task",
      },
      text: {
        type: "string",
        description: "Text of the task",
      },
      text_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description: "Optional. Special entities that appear in the task text",
      },
      completed_by_user: {
        type: "ref",
        ref: "User",
        description: "Optional. User that completed the task; omitted if the task wasn't completed by a user",
      },
      completed_by_chat: {
        type: "ref",
        ref: "Chat",
        description: "Optional. Chat that completed the task; omitted if the task wasn't completed by a chat",
      },
      completion_date: {
        type: "integer",
        description:
          "Optional. Point in time (Unix timestamp) when the task was completed; 0 if the task wasn't completed",
      },
    },
    required: ["id", "text"],
  },
  Checklist: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the checklist",
      },
      title_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description: "Optional. Special entities that appear in the checklist title",
      },
      tasks: {
        type: "array",
        items: {
          type: "ref",
          ref: "ChecklistTask",
        },
        description: "List of tasks in the checklist",
      },
      others_can_add_tasks: {
        type: "boolean",
        description: "Optional. True, if users other than the creator of the list can add tasks to the list",
      },
      others_can_mark_tasks_as_done: {
        type: "boolean",
        description: "Optional. True, if users other than the creator of the list can mark tasks as done or not done",
      },
    },
    required: ["title", "tasks"],
  },
  InputChecklistTask: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier of the task; must be positive and unique among all task identifiers currently present in the checklist",
      },
      text: {
        type: "string",
        description: "Text of the task; 1-100 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Optional. Mode for parsing entities in the text. See formatting options for more details.",
      },
      text_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the text, which can be specified instead of parse_mode. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are allowed.",
      },
    },
    required: ["id", "text"],
  },
  InputChecklist: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the checklist; 1-255 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Optional. Mode for parsing entities in the title. See formatting options for more details.",
      },
      title_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the title, which can be specified instead of parse_mode. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are allowed.",
      },
      tasks: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputChecklistTask",
        },
        description: "List of 1-30 tasks in the checklist",
      },
      others_can_add_tasks: {
        type: "boolean",
        description: "Optional. Pass True if other users can add tasks to the checklist",
      },
      others_can_mark_tasks_as_done: {
        type: "boolean",
        description: "Optional. Pass True if other users can mark tasks as done or not done in the checklist",
      },
    },
    required: ["title", "tasks"],
  },
  Location: {
    type: "object",
    properties: {
      latitude: {
        type: "number",
        description: "Latitude as defined by the sender",
      },
      longitude: {
        type: "number",
        description: "Longitude as defined by the sender",
      },
      horizontal_accuracy: {
        type: "number",
        description: "Optional. The radius of uncertainty for the location, measured in meters; 0-1500",
      },
      live_period: {
        type: "integer",
        description:
          "Optional. Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only.",
      },
      heading: {
        type: "integer",
        description:
          "Optional. The direction in which user is moving, in degrees; 1-360. For active live locations only.",
      },
      proximity_alert_radius: {
        type: "integer",
        description:
          "Optional. The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only.",
      },
    },
    required: ["latitude", "longitude"],
  },
  Venue: {
    type: "object",
    properties: {
      location: {
        type: "ref",
        ref: "Location",
        description: "Venue location. Can't be a live location.",
      },
      title: {
        type: "string",
        description: "Name of the venue",
      },
      address: {
        type: "string",
        description: "Address of the venue",
      },
      foursquare_id: {
        type: "string",
        description: "Optional. Foursquare identifier of the venue",
      },
      foursquare_type: {
        type: "string",
        description:
          'Optional. Foursquare type of the venue. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)',
      },
      google_place_id: {
        type: "string",
        description: "Optional. Google Places identifier of the venue",
      },
      google_place_type: {
        type: "string",
        description: "Optional. Google Places type of the venue. (See supported types.)",
      },
    },
    required: ["location", "title", "address"],
  },
  WebAppData: {
    type: "object",
    properties: {
      data: {
        type: "string",
        description: "The data. Be aware that a bad client can send arbitrary data in this field.",
      },
      button_text: {
        type: "string",
        description:
          "Text of the web_app keyboard button from which the Web App was opened. Be aware that a bad client can send arbitrary data in this field.",
      },
    },
    required: ["data", "button_text"],
  },
  ProximityAlertTriggered: {
    type: "object",
    properties: {
      traveler: {
        type: "ref",
        ref: "User",
        description: "User that triggered the alert",
      },
      watcher: {
        type: "ref",
        ref: "User",
        description: "User that set the alert",
      },
      distance: {
        type: "integer",
        description: "The distance between the users",
      },
    },
    required: ["traveler", "watcher", "distance"],
  },
  MessageAutoDeleteTimerChanged: {
    type: "object",
    properties: {
      message_auto_delete_time: {
        type: "integer",
        description: "New auto-delete time for messages in the chat; in seconds",
      },
    },
    required: ["message_auto_delete_time"],
  },
  ManagedBotCreated: {
    type: "object",
    properties: {
      bot: {
        type: "ref",
        ref: "User",
        description: "Information about the bot. The bot's token can be fetched using the method getManagedBotToken.",
      },
    },
    required: ["bot"],
  },
  ManagedBotUpdated: {
    type: "object",
    properties: {
      user: {
        type: "ref",
        ref: "User",
        description: "User that created the bot",
      },
      bot: {
        type: "ref",
        ref: "User",
        description: "Information about the bot. Token of the bot can be fetched using the method getManagedBotToken.",
      },
    },
    required: ["user", "bot"],
  },
  BotSubscriptionUpdated: {
    type: "object",
    properties: {
      user: {
        type: "ref",
        ref: "User",
        description: "User who subscribed for payments toward the bot",
      },
      invoice_payload: {
        type: "string",
        description: "Bot-specified invoice payload",
      },
      state: {
        type: "string",
        description:
          'The new state of the subscription. Currently, it can be one of "canceled" if the user canceled the subscription, "active" if the user re-enabled a previously canceled subscription, or "failed" if payment for the subscription failed.',
      },
    },
    required: ["user", "invoice_payload", "state"],
  },
  MessageGenerationStopped: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Chat in which the message is generated",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description: "Optional. Unique identifier of the message thread in which the message is generated",
      },
      draft_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the message draft which was stopped",
      },
    },
    required: ["chat", "draft_id"],
  },
  PollOptionAdded: {
    type: "object",
    properties: {
      poll_message: {
        type: "ref",
        ref: "MaybeInaccessibleMessage",
        description:
          "Optional. Message containing the poll to which the option was added, if known. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.",
      },
      option_persistent_id: {
        type: "string",
        description: "Unique identifier of the added option",
      },
      option_text: {
        type: "string",
        description: "Option text",
      },
      option_text_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description: "Optional. Special entities that appear in the option_text",
      },
    },
    required: ["option_persistent_id", "option_text"],
  },
  PollOptionDeleted: {
    type: "object",
    properties: {
      poll_message: {
        type: "ref",
        ref: "MaybeInaccessibleMessage",
        description:
          "Optional. Message containing the poll from which the option was deleted, if known. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.",
      },
      option_persistent_id: {
        type: "string",
        description: "Unique identifier of the deleted option",
      },
      option_text: {
        type: "string",
        description: "Option text",
      },
      option_text_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description: "Optional. Special entities that appear in the option_text",
      },
    },
    required: ["option_persistent_id", "option_text"],
  },
  ChatBoostAdded: {
    type: "object",
    properties: {
      boost_count: {
        type: "integer",
        description: "Number of boosts added by the user",
      },
    },
    required: ["boost_count"],
  },
  BackgroundFill: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "BackgroundFillSolid",
      },
      {
        type: "ref",
        ref: "BackgroundFillGradient",
      },
      {
        type: "ref",
        ref: "BackgroundFillFreeformGradient",
      },
    ],
  },
  BackgroundFillSolid: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["solid"],
        description: 'Type of the background fill, always "solid"',
      },
      color: {
        type: "integer",
        description: "The color of the background fill in the RGB24 format",
      },
    },
    required: ["type", "color"],
  },
  BackgroundFillGradient: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["gradient"],
        description: 'Type of the background fill, always "gradient"',
      },
      top_color: {
        type: "integer",
        description: "Top color of the gradient in the RGB24 format",
      },
      bottom_color: {
        type: "integer",
        description: "Bottom color of the gradient in the RGB24 format",
      },
      rotation_angle: {
        type: "integer",
        description: "Clockwise rotation angle of the background fill in degrees; 0-359",
      },
    },
    required: ["type", "top_color", "bottom_color", "rotation_angle"],
  },
  BackgroundFillFreeformGradient: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["freeform_gradient"],
        description: 'Type of the background fill, always "freeform_gradient"',
      },
      colors: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "A list of the 3 or 4 base colors that are used to generate the freeform gradient in the RGB24 format",
      },
    },
    required: ["type", "colors"],
  },
  BackgroundType: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "BackgroundTypeFill",
      },
      {
        type: "ref",
        ref: "BackgroundTypeWallpaper",
      },
      {
        type: "ref",
        ref: "BackgroundTypePattern",
      },
      {
        type: "ref",
        ref: "BackgroundTypeChatTheme",
      },
    ],
  },
  BackgroundTypeFill: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["fill"],
        description: 'Type of the background, always "fill"',
      },
      fill: {
        type: "ref",
        ref: "BackgroundFill",
        description: "The background fill",
      },
      dark_theme_dimming: {
        type: "integer",
        description: "Dimming of the background in dark themes, as a percentage; 0-100",
      },
    },
    required: ["type", "fill", "dark_theme_dimming"],
  },
  BackgroundTypeWallpaper: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["wallpaper"],
        description: 'Type of the background, always "wallpaper"',
      },
      document: {
        type: "ref",
        ref: "Document",
        description: "Document with the wallpaper",
      },
      dark_theme_dimming: {
        type: "integer",
        description: "Dimming of the background in dark themes, as a percentage; 0-100",
      },
      is_blurred: {
        type: "boolean",
        description:
          "Optional. True, if the wallpaper is downscaled to fit in a 450x450 square and then box-blurred with radius 12",
      },
      is_moving: {
        type: "boolean",
        description: "Optional. True, if the background moves slightly when the device is tilted",
      },
    },
    required: ["type", "document", "dark_theme_dimming"],
  },
  BackgroundTypePattern: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["pattern"],
        description: 'Type of the background, always "pattern"',
      },
      document: {
        type: "ref",
        ref: "Document",
        description: "Document with the pattern",
      },
      fill: {
        type: "ref",
        ref: "BackgroundFill",
        description: "The background fill that is combined with the pattern",
      },
      intensity: {
        type: "integer",
        description: "Intensity of the pattern when it is shown above the filled background; 0-100",
      },
      is_inverted: {
        type: "boolean",
        description:
          "Optional. True, if the background fill must be applied only to the pattern itself. All other pixels are black in this case. For dark themes only.",
      },
      is_moving: {
        type: "boolean",
        description: "Optional. True, if the background moves slightly when the device is tilted",
      },
    },
    required: ["type", "document", "fill", "intensity"],
  },
  BackgroundTypeChatTheme: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["chat_theme"],
        description: 'Type of the background, always "chat_theme"',
      },
      theme_name: {
        type: "string",
        description: "Name of the chat theme, which is usually an emoji",
      },
    },
    required: ["type", "theme_name"],
  },
  ChatBackground: {
    type: "object",
    properties: {
      type: {
        type: "ref",
        ref: "BackgroundType",
        description: "Type of the background",
      },
    },
    required: ["type"],
  },
  ChecklistTasksDone: {
    type: "object",
    properties: {
      checklist_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. Message containing the checklist whose tasks were marked as done or not done. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.",
      },
      marked_as_done_task_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description: "Optional. Identifiers of the tasks that were marked as done",
      },
      marked_as_not_done_task_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description: "Optional. Identifiers of the tasks that were marked as not done",
      },
    },
    required: [],
  },
  ChecklistTasksAdded: {
    type: "object",
    properties: {
      checklist_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. Message containing the checklist to which the tasks were added. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.",
      },
      tasks: {
        type: "array",
        items: {
          type: "ref",
          ref: "ChecklistTask",
        },
        description: "List of tasks added to the checklist",
      },
    },
    required: ["tasks"],
  },
  CommunityChatAdded: {
    type: "object",
    properties: {
      community: {
        type: "ref",
        ref: "Community",
        description: "The new community to which the chat or the bot belongs",
      },
    },
    required: ["community"],
  },
  CommunityChatJoined: {
    type: "object",
    properties: {
      community: {
        type: "ref",
        ref: "Community",
        description: "The community from which the chat was joined",
      },
    },
    required: ["community"],
  },
  CommunityChatRemoved: {
    type: "object",
    properties: {},
    required: [],
  },
  ForumTopicCreated: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the topic",
      },
      icon_color: {
        type: "integer",
        description: "Color of the topic icon in RGB format",
      },
      icon_custom_emoji_id: {
        type: "string",
        description: "Optional. Unique identifier of the custom emoji shown as the topic icon",
      },
      is_name_implicit: {
        type: "boolean",
        description:
          "Optional. True, if the name of the topic wasn't specified explicitly by its creator and likely needs to be changed by the bot",
      },
    },
    required: ["name", "icon_color"],
  },
  ForumTopicClosed: {
    type: "object",
    properties: {},
    required: [],
  },
  ForumTopicEdited: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Optional. New name of the topic, if it was edited",
      },
      icon_custom_emoji_id: {
        type: "string",
        description:
          "Optional. New identifier of the custom emoji shown as the topic icon, if it was edited; an empty string if the icon was removed",
      },
    },
    required: [],
  },
  ForumTopicReopened: {
    type: "object",
    properties: {},
    required: [],
  },
  GeneralForumTopicHidden: {
    type: "object",
    properties: {},
    required: [],
  },
  GeneralForumTopicUnhidden: {
    type: "object",
    properties: {},
    required: [],
  },
  SharedUser: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the shared user. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so 64-bit integers or double-precision float types are safe for storing these identifiers. The bot may not have access to the user and could be unable to use this identifier, unless the user is already known to the bot by some other means.",
      },
      first_name: {
        type: "string",
        description: "Optional. First name of the user, if the name was requested by the bot",
      },
      last_name: {
        type: "string",
        description: "Optional. Last name of the user, if the name was requested by the bot",
      },
      username: {
        type: "string",
        description: "Optional. Username of the user, if the username was requested by the bot",
      },
      photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Optional. Available sizes of the chat photo, if the photo was requested by the bot",
      },
    },
    required: ["user_id"],
  },
  UsersShared: {
    type: "object",
    properties: {
      request_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the request",
      },
      users: {
        type: "array",
        items: {
          type: "ref",
          ref: "SharedUser",
        },
        description: "Information about users shared with the bot",
      },
    },
    required: ["request_id", "users"],
  },
  ChatShared: {
    type: "object",
    properties: {
      request_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the request",
      },
      chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the shared chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot may not have access to the chat and could be unable to use this identifier, unless the chat is already known to the bot by some other means.",
      },
      title: {
        type: "string",
        description: "Optional. Title of the chat, if the title was requested by the bot",
      },
      username: {
        type: "string",
        description: "Optional. Username of the chat, if the username was requested by the bot and available",
      },
      photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Optional. Available sizes of the chat photo, if the photo was requested by the bot",
      },
    },
    required: ["request_id", "chat_id"],
  },
  WriteAccessAllowed: {
    type: "object",
    properties: {
      from_request: {
        type: "boolean",
        description:
          "Optional. True, if the access was granted after the user accepted an explicit request from a Web App sent by the method requestWriteAccess",
      },
      web_app_name: {
        type: "string",
        description:
          "Optional. Name of the Web App, if the access was granted when the Web App was launched from a link",
      },
      from_attachment_menu: {
        type: "boolean",
        description: "Optional. True, if the access was granted when the bot was added to the attachment or side menu",
      },
    },
    required: [],
  },
  VideoChatScheduled: {
    type: "object",
    properties: {
      start_date: {
        type: "integer",
        description:
          "Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator",
      },
    },
    required: ["start_date"],
  },
  VideoChatStarted: {
    type: "object",
    properties: {},
    required: [],
  },
  VideoChatEnded: {
    type: "object",
    properties: {
      duration: {
        type: "integer",
        description: "Video chat duration in seconds",
      },
    },
    required: ["duration"],
  },
  VideoChatParticipantsInvited: {
    type: "object",
    properties: {
      users: {
        type: "array",
        items: {
          type: "ref",
          ref: "User",
        },
        description: "New members that were invited to the video chat",
      },
    },
    required: ["users"],
  },
  PaidMessagePriceChanged: {
    type: "object",
    properties: {
      paid_message_star_count: {
        type: "integer",
        description:
          "The new number of Telegram Stars that must be paid by non-administrator users of the supergroup chat for each sent message",
      },
    },
    required: ["paid_message_star_count"],
  },
  DirectMessagePriceChanged: {
    type: "object",
    properties: {
      are_direct_messages_enabled: {
        type: "boolean",
        description: "True, if direct messages are enabled for the channel chat; False otherwise",
      },
      direct_message_star_count: {
        type: "integer",
        description:
          "Optional. The new number of Telegram Stars that must be paid by users for each direct message sent to the channel. Does not apply to users who have been exempted by administrators. Defaults to 0.",
      },
    },
    required: ["are_direct_messages_enabled"],
  },
  SuggestedPostApproved: {
    type: "object",
    properties: {
      suggested_post_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.",
      },
      price: {
        type: "ref",
        ref: "SuggestedPostPrice",
        description: "Optional. Amount paid for the post",
      },
      send_date: {
        type: "integer",
        description: "Date when the post will be published",
      },
    },
    required: ["send_date"],
  },
  SuggestedPostApprovalFailed: {
    type: "object",
    properties: {
      suggested_post_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. Message containing the suggested post whose approval has failed. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.",
      },
      price: {
        type: "ref",
        ref: "SuggestedPostPrice",
        description: "Expected price of the post",
      },
    },
    required: ["price"],
  },
  SuggestedPostDeclined: {
    type: "object",
    properties: {
      suggested_post_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.",
      },
      comment: {
        type: "string",
        description: "Optional. Comment with which the post was declined",
      },
    },
    required: [],
  },
  SuggestedPostPaid: {
    type: "object",
    properties: {
      suggested_post_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.",
      },
      currency: {
        type: "string",
        description:
          'Currency in which the payment was made. Currently, one of "XTR" for Telegram Stars or "TON" for TON grams.',
      },
      amount: {
        type: "integer",
        description:
          "Optional. The amount of the currency that was received by the channel in nanograms; for payments in TON grams only",
      },
      star_amount: {
        type: "ref",
        ref: "StarAmount",
        description:
          "Optional. The amount of Telegram Stars that was received by the channel; for payments in Telegram Stars only",
      },
    },
    required: ["currency"],
  },
  SuggestedPostRefunded: {
    type: "object",
    properties: {
      suggested_post_message: {
        type: "ref",
        ref: "Message",
        description:
          "Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply.",
      },
      reason: {
        type: "string",
        description:
          'Reason for the refund. Currently, one of "post_deleted" if the post was deleted within 24 hours of being posted or removed from scheduled messages without being posted, or "payment_refunded" if the payer refunded their payment.',
      },
    },
    required: ["reason"],
  },
  GiveawayCreated: {
    type: "object",
    properties: {
      prize_star_count: {
        type: "integer",
        description:
          "Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only",
      },
    },
    required: [],
  },
  Giveaway: {
    type: "object",
    properties: {
      chats: {
        type: "array",
        items: {
          type: "ref",
          ref: "Chat",
        },
        description: "The list of chats which the user must join to participate in the giveaway",
      },
      winners_selection_date: {
        type: "integer",
        description: "Point in time (Unix timestamp) when winners of the giveaway will be selected",
      },
      winner_count: {
        type: "integer",
        description: "The number of users which are supposed to be selected as winners of the giveaway",
      },
      only_new_members: {
        type: "boolean",
        description:
          "Optional. True, if only users who join the chats after the giveaway started should be eligible to win",
      },
      has_public_winners: {
        type: "boolean",
        description: "Optional. True, if the list of giveaway winners will be visible to everyone",
      },
      prize_description: {
        type: "string",
        description: "Optional. Description of additional giveaway prize",
      },
      country_codes: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "Optional. A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways.",
      },
      prize_star_count: {
        type: "integer",
        description:
          "Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only",
      },
      premium_subscription_month_count: {
        type: "integer",
        description:
          "Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only",
      },
    },
    required: ["chats", "winners_selection_date", "winner_count"],
  },
  GiveawayWinners: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "The chat that created the giveaway",
      },
      giveaway_message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the message with the giveaway in the chat",
      },
      winners_selection_date: {
        type: "integer",
        description: "Point in time (Unix timestamp) when winners of the giveaway were selected",
      },
      winner_count: {
        type: "integer",
        description: "Total number of winners in the giveaway",
      },
      winners: {
        type: "array",
        items: {
          type: "ref",
          ref: "User",
        },
        description: "List of up to 100 winners of the giveaway",
      },
      additional_chat_count: {
        type: "integer",
        description:
          "Optional. The number of other chats the user had to join in order to be eligible for the giveaway",
      },
      prize_star_count: {
        type: "integer",
        description:
          "Optional. The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only",
      },
      premium_subscription_month_count: {
        type: "integer",
        description:
          "Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only",
      },
      unclaimed_prize_count: {
        type: "integer",
        description: "Optional. Number of undistributed prizes",
      },
      only_new_members: {
        type: "boolean",
        description:
          "Optional. True, if only users who had joined the chats after the giveaway started were eligible to win",
      },
      was_refunded: {
        type: "boolean",
        description: "Optional. True, if the giveaway was canceled because the payment for it was refunded",
      },
      prize_description: {
        type: "string",
        description: "Optional. Description of additional giveaway prize",
      },
    },
    required: ["chat", "giveaway_message_id", "winners_selection_date", "winner_count", "winners"],
  },
  GiveawayCompleted: {
    type: "object",
    properties: {
      winner_count: {
        type: "integer",
        description: "Number of winners in the giveaway",
      },
      unclaimed_prize_count: {
        type: "integer",
        description: "Optional. Number of undistributed prizes",
      },
      giveaway_message: {
        type: "ref",
        ref: "Message",
        description: "Optional. Message with the giveaway that was completed, if it wasn't deleted",
      },
      is_star_giveaway: {
        type: "boolean",
        description:
          "Optional. True, if the giveaway is a Telegram Star giveaway. Otherwise, currently, the giveaway is a Telegram Premium giveaway.",
      },
    },
    required: ["winner_count"],
  },
  LinkPreviewOptions: {
    type: "object",
    properties: {
      is_disabled: {
        type: "boolean",
        description: "Optional. True, if the link preview is disabled",
      },
      url: {
        type: "string",
        description:
          "Optional. URL to use for the link preview. If empty, then the first URL found in the message text will be used.",
      },
      prefer_small_media: {
        type: "boolean",
        description:
          "Optional. True, if the media in the link preview is supposed to be shrunk; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview",
      },
      prefer_large_media: {
        type: "boolean",
        description:
          "Optional. True, if the media in the link preview is supposed to be enlarged; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview",
      },
      show_above_text: {
        type: "boolean",
        description:
          "Optional. True, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text",
      },
    },
    required: [],
  },
  SuggestedPostPrice: {
    type: "object",
    properties: {
      currency: {
        type: "string",
        description:
          'Currency in which the post will be paid. Currently, must be one of "XTR" for Telegram Stars or "TON" for TON grams.',
      },
      amount: {
        type: "integer",
        description:
          "The amount of the currency that will be paid for the post in the smallest units of the currency, i.e. Telegram Stars or nanograms. Currently, price in Telegram Stars must be between 5 and 100000, and price in nanograms must be between 10000000 and 10000000000000.",
      },
    },
    required: ["currency", "amount"],
  },
  SuggestedPostInfo: {
    type: "object",
    properties: {
      state: {
        type: "string",
        description: 'State of the suggested post. Currently, it can be one of "pending", "approved", "declined".',
      },
      price: {
        type: "ref",
        ref: "SuggestedPostPrice",
        description: "Optional. Proposed price of the post. If the field is omitted, then the post is unpaid.",
      },
      send_date: {
        type: "integer",
        description:
          "Optional. Proposed send date of the post. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user or administrator who approves it.",
      },
    },
    required: ["state"],
  },
  SuggestedPostParameters: {
    type: "object",
    properties: {
      price: {
        type: "ref",
        ref: "SuggestedPostPrice",
        description: "Optional. Proposed price for the post. If the field is omitted, then the post is unpaid.",
      },
      send_date: {
        type: "integer",
        description:
          "Optional. Proposed send date of the post. If specified, then the date must be between 300 second and 2678400 seconds (30 days) in the future. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user who approves it.",
      },
    },
    required: [],
  },
  DirectMessagesTopic: {
    type: "object",
    properties: {
      topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier of the topic. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Optional. Information about the user that created the topic. Currently, it is always present.",
      },
    },
    required: ["topic_id"],
  },
  UserProfilePhotos: {
    type: "object",
    properties: {
      total_count: {
        type: "integer",
        description: "Total number of profile pictures the target user has",
      },
      photos: {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "ref",
            ref: "PhotoSize",
          },
        },
        description: "Requested profile pictures (in up to 4 sizes each)",
      },
    },
    required: ["total_count", "photos"],
  },
  UserProfileAudios: {
    type: "object",
    properties: {
      total_count: {
        type: "integer",
        description: "Total number of profile audios for the target user",
      },
      audios: {
        type: "array",
        items: {
          type: "ref",
          ref: "Audio",
        },
        description: "Requested profile audios",
      },
    },
    required: ["total_count", "audios"],
  },
  File: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      file_size: {
        type: "integer",
        description:
          "Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.",
      },
      file_path: {
        type: "string",
        description: "Optional. File path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file.",
      },
    },
    required: ["file_id", "file_unique_id"],
  },
  WebAppInfo: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description:
          "An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps",
      },
    },
    required: ["url"],
  },
  ReplyKeyboardMarkup: {
    type: "object",
    properties: {
      keyboard: {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "ref",
            ref: "KeyboardButton",
          },
        },
        description: "Array of button rows, each represented by an Array of KeyboardButton objects",
      },
      is_persistent: {
        type: "boolean",
        description:
          "Optional. Requests clients to always show the keyboard when the regular keyboard is hidden. Defaults to False, in which case the custom keyboard can be hidden and opened with a keyboard icon.",
      },
      resize_keyboard: {
        type: "boolean",
        description:
          "Optional. Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to False, in which case the custom keyboard is always of the same height as the app's standard keyboard.",
      },
      one_time_keyboard: {
        type: "boolean",
        description:
          "Optional. Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again. Defaults to False.",
      },
      input_field_placeholder: {
        type: "string",
        description:
          "Optional. The placeholder to be shown in the input field when the keyboard is active; 1-64 characters",
      },
      selective: {
        type: "boolean",
        description:
          "Optional. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message. Example: A user requests to change the bot's language, bot replies to the request with a keyboard to select the new language. Other users in the group don't see the keyboard.",
      },
      force_reply: {
        type: "boolean",
        description:
          "Optional. Pass True if the reply interface must be shown to the user, as if they had manually selected the bot's message and tapped 'Reply'",
      },
    },
    required: ["keyboard"],
  },
  KeyboardButton: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description:
          "Text of the button. If none of the fields other than text, icon_custom_emoji_id, and style are used, it will be sent as a message when the button is pressed.",
      },
      icon_custom_emoji_id: {
        type: "string",
        description:
          "Optional. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on Fragment or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription.",
      },
      style: {
        type: "string",
        description:
          'Optional. Style of the button. Must be one of "danger" (red), "success" (green) or "primary" (blue). If omitted, then an app-specific style is used.',
      },
      request_users: {
        type: "ref",
        ref: "KeyboardButtonRequestUsers",
        description:
          'Optional. If specified, pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a "users_shared" service message. Available in private chats only.',
      },
      request_chat: {
        type: "ref",
        ref: "KeyboardButtonRequestChat",
        description:
          'Optional. If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a "chat_shared" service message. Available in private chats only.',
      },
      request_managed_bot: {
        type: "ref",
        ref: "KeyboardButtonRequestManagedBot",
        description:
          "Optional. If specified, pressing the button will ask the user to create and share a bot that will be managed by the current bot. Available for bots that enabled management of other bots in the @BotFather Mini App. Available in private chats only.",
      },
      request_contact: {
        type: "boolean",
        description:
          "Optional. If True, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only.",
      },
      request_location: {
        type: "boolean",
        description:
          "Optional. If True, the user's current location will be sent when the button is pressed. Available in private chats only.",
      },
      request_poll: {
        type: "ref",
        ref: "KeyboardButtonPollType",
        description:
          "Optional. If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only.",
      },
      web_app: {
        type: "ref",
        ref: "WebAppInfo",
        description:
          'Optional. If specified, the described Web App will be launched when the button is pressed. The Web App will be able to send a "web_app_data" service message. Available in private chats only.',
      },
    },
    required: ["text"],
  },
  KeyboardButtonRequestUsers: {
    type: "object",
    properties: {
      request_id: {
        type: "integer",
        format: "int64",
        description:
          "Signed 32-bit identifier of the request that will be received back in the UsersShared object. Must be unique within the message.",
      },
      user_is_bot: {
        type: "boolean",
        description:
          "Optional. Pass True to request bots, pass False to request regular users. If not specified, no additional restrictions are applied.",
      },
      user_is_premium: {
        type: "boolean",
        description:
          "Optional. Pass True to request premium users, pass False to request non-premium users. If not specified, no additional restrictions are applied.",
      },
      max_quantity: {
        type: "integer",
        description: "Optional. The maximum number of users to be selected; 1-10. Defaults to 1.",
      },
      request_name: {
        type: "boolean",
        description: "Optional. Pass True to request the users' first and last names",
      },
      request_username: {
        type: "boolean",
        description: "Optional. Pass True to request the users' usernames",
      },
      request_photo: {
        type: "boolean",
        description: "Optional. Pass True to request the users' photos",
      },
    },
    required: ["request_id"],
  },
  KeyboardButtonRequestChat: {
    type: "object",
    properties: {
      request_id: {
        type: "integer",
        format: "int64",
        description:
          "Signed 32-bit identifier of the request, which will be received back in the ChatShared object. Must be unique within the message.",
      },
      chat_is_channel: {
        type: "boolean",
        description: "Pass True to request a channel chat, pass False to request a group or a supergroup chat",
      },
      chat_is_forum: {
        type: "boolean",
        description:
          "Optional. Pass True to request a forum supergroup, pass False to request a non-forum chat. If not specified, no additional restrictions are applied.",
      },
      chat_has_username: {
        type: "boolean",
        description:
          "Optional. Pass True to request a supergroup or a channel with a username, pass False to request a chat without a username. If not specified, no additional restrictions are applied.",
      },
      chat_is_created: {
        type: "boolean",
        description:
          "Optional. Pass True to request a chat owned by the user. Otherwise, no additional restrictions are applied.",
      },
      user_administrator_rights: {
        type: "ref",
        ref: "ChatAdministratorRights",
        description:
          "Optional. A JSON-serialized object listing the required administrator rights of the user in the chat. The rights must be a superset of bot_administrator_rights. If not specified, no additional restrictions are applied.",
      },
      bot_administrator_rights: {
        type: "ref",
        ref: "ChatAdministratorRights",
        description:
          "Optional. A JSON-serialized object listing the required administrator rights of the bot in the chat. The rights must be a subset of user_administrator_rights. If not specified, no additional restrictions are applied.",
      },
      bot_is_member: {
        type: "boolean",
        description:
          "Optional. Pass True to request a chat with the bot as a member. Otherwise, no additional restrictions are applied.",
      },
      request_title: {
        type: "boolean",
        description: "Optional. Pass True to request the chat's title",
      },
      request_username: {
        type: "boolean",
        description: "Optional. Pass True to request the chat's username",
      },
      request_photo: {
        type: "boolean",
        description: "Optional. Pass True to request the chat's photo",
      },
    },
    required: ["request_id", "chat_is_channel"],
  },
  KeyboardButtonRequestManagedBot: {
    type: "object",
    properties: {
      request_id: {
        type: "integer",
        format: "int64",
        description: "Signed 32-bit identifier of the request. Must be unique within the message.",
      },
      suggested_name: {
        type: "string",
        description: "Optional. Suggested name for the bot",
      },
      suggested_username: {
        type: "string",
        description: "Optional. Suggested username for the bot",
      },
    },
    required: ["request_id"],
  },
  KeyboardButtonPollType: {
    type: "object",
    properties: {
      type: {
        type: "string",
        description:
          "Optional. If quiz is passed, the user will be allowed to create only polls in the quiz mode. If regular is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of any type.",
      },
    },
    required: [],
  },
  ReplyKeyboardRemove: {
    type: "object",
    properties: {
      remove_keyboard: {
        type: "boolean",
        description:
          "Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use one_time_keyboard in ReplyKeyboardMarkup)",
      },
      selective: {
        type: "boolean",
        description:
          "Optional. Use this parameter if you want to remove the keyboard for specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message. Example: A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven't voted yet.",
      },
    },
    required: ["remove_keyboard"],
  },
  InlineKeyboardMarkup: {
    type: "object",
    properties: {
      inline_keyboard: {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "ref",
            ref: "InlineKeyboardButton",
          },
        },
        description: "Array of button rows, each represented by an Array of InlineKeyboardButton objects",
      },
      force_reply: {
        type: "boolean",
        description:
          "Optional. Pass True if the reply interface must be shown to the user, as if they had manually selected the bot's message and tapped 'Reply'. The value of the field can't be changed when the inline keyboard is edited.",
      },
    },
    required: ["inline_keyboard"],
  },
  InlineKeyboardButton: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "Label text on the button",
      },
      icon_custom_emoji_id: {
        type: "string",
        description:
          "Optional. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on Fragment or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription.",
      },
      style: {
        type: "string",
        description:
          'Optional. Style of the button. Must be one of "danger" (red), "success" (green) or "primary" (blue). If omitted, then an app-specific style is used.',
      },
      url: {
        type: "string",
        description:
          "Optional. HTTP or tg:// URL to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings.",
      },
      callback_data: {
        type: "string",
        description: "Optional. Data to be sent in a callback query to the bot when the button is pressed, 1-64 bytes",
      },
      web_app: {
        type: "ref",
        ref: "WebAppInfo",
        description:
          "Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a business account.",
      },
      login_url: {
        type: "ref",
        ref: "LoginUrl",
        description:
          "Optional. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget. Not supported for ephemeral messages.",
      },
      switch_inline_query: {
        type: "string",
        description:
          "Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a business account.",
      },
      switch_inline_query_current_chat: {
        type: "string",
        description:
          "Optional. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted. This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a business account.",
      },
      switch_inline_query_chosen_chat: {
        type: "ref",
        ref: "SwitchInlineQueryChosenChat",
        description:
          "Optional. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a business account.",
      },
      copy_text: {
        type: "ref",
        ref: "CopyTextButton",
        description: "Optional. Description of the button that copies the specified text to the clipboard",
      },
      callback_game: {
        type: "ref",
        ref: "CallbackGame",
        description:
          "Optional. Description of the game that will be launched when the user presses the button. NOTE: This type of button must always be the first button in the first row.",
      },
      pay: {
        type: "boolean",
        description:
          'Optional. Specify True, to send a Pay button. Substrings "⭐" and "XTR" in the buttons\'s text will be replaced with a Telegram Star icon. NOTE: This type of button must always be the first button in the first row and can only be used in invoice messages.',
      },
      disabled: {
        type: "ref",
        ref: "DisabledButton",
        description: "Optional. If set, then the button is disabled and does nothing",
      },
    },
    required: ["text"],
  },
  LoginUrl: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description:
          "An HTTPS URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in Receiving authorization data. NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in Checking authorization.",
      },
      forward_text: {
        type: "string",
        description: "Optional. New text of the button in forwarded messages",
      },
      bot_username: {
        type: "string",
        description:
          "Optional. Username of a bot, which will be used for user authorization; not supported in RichMessageButton. See Setting up a bot for more details. If not specified, the current bot's username will be assumed. The url's domain must be the same as the domain linked with the bot. See Linking your domain to the bot for more details.",
      },
      request_write_access: {
        type: "boolean",
        description: "Optional. Pass True to request the permission for your bot to send messages to the user",
      },
    },
    required: ["url"],
  },
  SwitchInlineQueryChosenChat: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "Optional. The default inline query to be inserted in the input field. If left empty, only the bot's username will be inserted.",
      },
      allow_user_chats: {
        type: "boolean",
        description: "Optional. True, if private chats with users can be chosen",
      },
      allow_bot_chats: {
        type: "boolean",
        description: "Optional. True, if private chats with bots can be chosen",
      },
      allow_group_chats: {
        type: "boolean",
        description: "Optional. True, if group and supergroup chats can be chosen",
      },
      allow_channel_chats: {
        type: "boolean",
        description: "Optional. True, if channel chats can be chosen",
      },
    },
    required: [],
  },
  CopyTextButton: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "The text to be copied to the clipboard; 1-256 characters",
      },
    },
    required: ["text"],
  },
  DisabledButton: {
    type: "object",
    properties: {},
    required: [],
  },
  CallbackQuery: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier for this query",
      },
      from: {
        type: "ref",
        ref: "User",
        description: "Sender",
      },
      message: {
        type: "ref",
        ref: "MaybeInaccessibleMessage",
        description: "Optional. Message sent by the bot with the callback button that originated the query",
      },
      inline_message_id: {
        type: "string",
        description: "Optional. Identifier of the message sent via the bot in inline mode, that originated the query",
      },
      chat_instance: {
        type: "string",
        description:
          "Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in games.",
      },
      data: {
        type: "string",
        description:
          "Optional. Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data.",
      },
      game_short_name: {
        type: "string",
        description: "Optional. Short name of a Game to be returned, serves as the unique identifier for the game",
      },
    },
    required: ["id", "from", "chat_instance"],
  },
  ForceReply: {
    type: "object",
    properties: {
      force_reply: {
        type: "boolean",
        description:
          "Shows reply interface to the user, as if they had manually selected the bot's message and tapped 'Reply'",
      },
      input_field_placeholder: {
        type: "string",
        description:
          "Optional. The placeholder to be shown in the input field when the reply is active; 1-64 characters",
      },
      selective: {
        type: "boolean",
        description:
          "Optional. Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message.",
      },
    },
    required: ["force_reply"],
  },
  Community: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for this community. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      name: {
        type: "string",
        description: "Name of the community",
      },
    },
    required: ["id", "name"],
  },
  ChatPhoto: {
    type: "object",
    properties: {
      small_file_id: {
        type: "string",
        description:
          "File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.",
      },
      small_file_unique_id: {
        type: "string",
        description:
          "Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      big_file_id: {
        type: "string",
        description:
          "File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.",
      },
      big_file_unique_id: {
        type: "string",
        description:
          "Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
    },
    required: ["small_file_id", "small_file_unique_id", "big_file_id", "big_file_unique_id"],
  },
  ChatInviteLink: {
    type: "object",
    properties: {
      invite_link: {
        type: "string",
        description:
          'The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with "...".',
      },
      creator: {
        type: "ref",
        ref: "User",
        description: "Creator of the link",
      },
      creates_join_request: {
        type: "boolean",
        description: "True, if users joining the chat via the link need to be approved by chat administrators",
      },
      is_primary: {
        type: "boolean",
        description: "True, if the link is primary",
      },
      is_revoked: {
        type: "boolean",
        description: "True, if the link is revoked",
      },
      name: {
        type: "string",
        description: "Optional. Invite link name",
      },
      expire_date: {
        type: "integer",
        description: "Optional. Point in time (Unix timestamp) when the link will expire or has been expired",
      },
      member_limit: {
        type: "integer",
        description:
          "Optional. The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999",
      },
      pending_join_request_count: {
        type: "integer",
        description: "Optional. Number of pending join requests created using this link",
      },
      subscription_period: {
        type: "integer",
        description: "Optional. The number of seconds the subscription will be active for before the next payment",
      },
      subscription_price: {
        type: "integer",
        description:
          "Optional. The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat using the link",
      },
    },
    required: ["invite_link", "creator", "creates_join_request", "is_primary", "is_revoked"],
  },
  ChatAdministratorRights: {
    type: "object",
    properties: {
      is_anonymous: {
        type: "boolean",
        description: "True, if the user's presence in the chat is hidden",
      },
      can_manage_chat: {
        type: "boolean",
        description:
          "True, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.",
      },
      can_delete_messages: {
        type: "boolean",
        description: "True, if the administrator can delete messages of other users",
      },
      can_manage_video_chats: {
        type: "boolean",
        description: "True, if the administrator can manage video chats",
      },
      can_restrict_members: {
        type: "boolean",
        description:
          "True, if the administrator can restrict, ban or unban chat members, or access supergroup statistics",
      },
      can_promote_members: {
        type: "boolean",
        description:
          "True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user)",
      },
      can_change_info: {
        type: "boolean",
        description: "True, if the user is allowed to change the chat title, photo and other settings",
      },
      can_invite_users: {
        type: "boolean",
        description: "True, if the user is allowed to invite new users to the chat",
      },
      can_post_stories: {
        type: "boolean",
        description: "True, if the administrator can post stories to the chat",
      },
      can_edit_stories: {
        type: "boolean",
        description:
          "True, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive",
      },
      can_delete_stories: {
        type: "boolean",
        description: "True, if the administrator can delete stories posted by other users",
      },
      can_post_messages: {
        type: "boolean",
        description:
          "Optional. True, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only",
      },
      can_edit_messages: {
        type: "boolean",
        description:
          "Optional. True, if the administrator can edit messages of other users and can pin messages; for channels only",
      },
      can_pin_messages: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to pin messages; for groups and supergroups only",
      },
      can_manage_topics: {
        type: "boolean",
        description:
          "Optional. True, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only",
      },
      can_manage_direct_messages: {
        type: "boolean",
        description:
          "Optional. True, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only",
      },
      can_manage_tags: {
        type: "boolean",
        description:
          "Optional. True, if the administrator can edit the tags of regular members; for groups and supergroups only",
      },
      can_send_welcome_messages: {
        type: "boolean",
        description:
          "True, if the administrator can manage chat welcome messages or directly send them in the case of bots",
      },
    },
    required: [
      "is_anonymous",
      "can_manage_chat",
      "can_delete_messages",
      "can_manage_video_chats",
      "can_restrict_members",
      "can_promote_members",
      "can_change_info",
      "can_invite_users",
      "can_post_stories",
      "can_edit_stories",
      "can_delete_stories",
      "can_send_welcome_messages",
    ],
  },
  ChatMemberUpdated: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Chat the user belongs to",
      },
      from: {
        type: "ref",
        ref: "User",
        description: "Performer of the action, which resulted in the change",
      },
      date: {
        type: "integer",
        description: "Date the change was done in Unix time",
      },
      old_chat_member: {
        type: "ref",
        ref: "ChatMember",
        description: "Previous information about the chat member",
      },
      new_chat_member: {
        type: "ref",
        ref: "ChatMember",
        description: "New information about the chat member",
      },
      invite_link: {
        type: "ref",
        ref: "ChatInviteLink",
        description:
          "Optional. Chat invite link, which was used by the user to join the chat; for joining by invite link events only",
      },
      via_join_request: {
        type: "boolean",
        description:
          "Optional. True, if the user joined the chat after sending a direct join request without using an invite link and being approved by an administrator",
      },
      via_chat_folder_invite_link: {
        type: "boolean",
        description: "Optional. True, if the user joined the chat via a chat folder invite link",
      },
    },
    required: ["chat", "from", "date", "old_chat_member", "new_chat_member"],
  },
  ChatMember: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "ChatMemberOwner",
      },
      {
        type: "ref",
        ref: "ChatMemberAdministrator",
      },
      {
        type: "ref",
        ref: "ChatMemberMember",
      },
      {
        type: "ref",
        ref: "ChatMemberRestricted",
      },
      {
        type: "ref",
        ref: "ChatMemberLeft",
      },
      {
        type: "ref",
        ref: "ChatMemberBanned",
      },
    ],
  },
  ChatMemberOwner: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["creator"],
        description: 'The member\'s status in the chat, always "creator"',
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Information about the user",
      },
      is_anonymous: {
        type: "boolean",
        description: "True, if the user's presence in the chat is hidden",
      },
      custom_title: {
        type: "string",
        description: "Optional. Custom title for this user",
      },
    },
    required: ["status", "user", "is_anonymous"],
  },
  ChatMemberAdministrator: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["administrator"],
        description: 'The member\'s status in the chat, always "administrator"',
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Information about the user",
      },
      can_be_edited: {
        type: "boolean",
        description: "True, if the bot is allowed to edit administrator privileges of that user",
      },
      is_anonymous: {
        type: "boolean",
        description: "True, if the user's presence in the chat is hidden",
      },
      can_manage_chat: {
        type: "boolean",
        description:
          "True, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.",
      },
      can_delete_messages: {
        type: "boolean",
        description: "True, if the administrator can delete messages of other users",
      },
      can_manage_video_chats: {
        type: "boolean",
        description: "True, if the administrator can manage video chats",
      },
      can_restrict_members: {
        type: "boolean",
        description:
          "True, if the administrator can restrict, ban or unban chat members, or access supergroup statistics",
      },
      can_promote_members: {
        type: "boolean",
        description:
          "True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user)",
      },
      can_change_info: {
        type: "boolean",
        description: "True, if the user is allowed to change the chat title, photo and other settings",
      },
      can_invite_users: {
        type: "boolean",
        description: "True, if the user is allowed to invite new users to the chat",
      },
      can_post_stories: {
        type: "boolean",
        description: "True, if the administrator can post stories to the chat",
      },
      can_edit_stories: {
        type: "boolean",
        description:
          "True, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive",
      },
      can_delete_stories: {
        type: "boolean",
        description: "True, if the administrator can delete stories posted by other users",
      },
      can_post_messages: {
        type: "boolean",
        description:
          "Optional. True, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only",
      },
      can_edit_messages: {
        type: "boolean",
        description:
          "Optional. True, if the administrator can edit messages of other users and can pin messages; for channels only",
      },
      can_pin_messages: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to pin messages; for groups and supergroups only",
      },
      can_manage_topics: {
        type: "boolean",
        description:
          "Optional. True, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only",
      },
      can_manage_direct_messages: {
        type: "boolean",
        description:
          "Optional. True, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only",
      },
      can_manage_tags: {
        type: "boolean",
        description:
          "Optional. True, if the administrator can edit the tags of regular members; for groups and supergroups only",
      },
      can_send_welcome_messages: {
        type: "boolean",
        description:
          "True, if the administrator can manage chat welcome messages or directly send them in the case of bots",
      },
      custom_title: {
        type: "string",
        description: "Optional. Custom title for this user",
      },
    },
    required: [
      "status",
      "user",
      "can_be_edited",
      "is_anonymous",
      "can_manage_chat",
      "can_delete_messages",
      "can_manage_video_chats",
      "can_restrict_members",
      "can_promote_members",
      "can_change_info",
      "can_invite_users",
      "can_post_stories",
      "can_edit_stories",
      "can_delete_stories",
      "can_send_welcome_messages",
    ],
  },
  ChatMemberMember: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["member"],
        description: 'The member\'s status in the chat, always "member"',
      },
      tag: {
        type: "string",
        description: "Optional. Tag of the member",
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Information about the user",
      },
      until_date: {
        type: "integer",
        description: "Optional. Date when the user's subscription will expire; Unix time",
      },
    },
    required: ["status", "user"],
  },
  ChatMemberRestricted: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["restricted"],
        description: 'The member\'s status in the chat, always "restricted"',
      },
      tag: {
        type: "string",
        description: "Optional. Tag of the member",
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Information about the user",
      },
      is_member: {
        type: "boolean",
        description: "True, if the user is a member of the chat at the moment of the request",
      },
      can_send_messages: {
        type: "boolean",
        description:
          "True, if the user is allowed to send text messages, rich messages, contacts, giveaways, giveaway winners, invoices, locations and venues",
      },
      can_send_audios: {
        type: "boolean",
        description: "True, if the user is allowed to send audios",
      },
      can_send_documents: {
        type: "boolean",
        description: "True, if the user is allowed to send documents",
      },
      can_send_photos: {
        type: "boolean",
        description: "True, if the user is allowed to send photos",
      },
      can_send_videos: {
        type: "boolean",
        description: "True, if the user is allowed to send videos",
      },
      can_send_video_notes: {
        type: "boolean",
        description: "True, if the user is allowed to send video notes",
      },
      can_send_voice_notes: {
        type: "boolean",
        description: "True, if the user is allowed to send voice notes",
      },
      can_send_polls: {
        type: "boolean",
        description: "True, if the user is allowed to send polls and checklists",
      },
      can_send_other_messages: {
        type: "boolean",
        description: "True, if the user is allowed to send animations, games, stickers and use inline bots",
      },
      can_add_web_page_previews: {
        type: "boolean",
        description: "True, if the user is allowed to add web page previews to their messages",
      },
      can_react_to_messages: {
        type: "boolean",
        description: "True, if the user is allowed to react to messages",
      },
      can_edit_tag: {
        type: "boolean",
        description: "True, if the user is allowed to edit their own tag",
      },
      can_change_info: {
        type: "boolean",
        description: "True, if the user is allowed to change the chat title, photo and other settings",
      },
      can_invite_users: {
        type: "boolean",
        description: "True, if the user is allowed to invite new users to the chat",
      },
      can_pin_messages: {
        type: "boolean",
        description: "True, if the user is allowed to pin messages",
      },
      can_manage_topics: {
        type: "boolean",
        description: "True, if the user is allowed to create forum topics",
      },
      until_date: {
        type: "integer",
        description:
          "Date when restrictions will be lifted for this user; Unix time. If 0, then the user is restricted forever.",
      },
    },
    required: [
      "status",
      "user",
      "is_member",
      "can_send_messages",
      "can_send_audios",
      "can_send_documents",
      "can_send_photos",
      "can_send_videos",
      "can_send_video_notes",
      "can_send_voice_notes",
      "can_send_polls",
      "can_send_other_messages",
      "can_add_web_page_previews",
      "can_react_to_messages",
      "can_edit_tag",
      "can_change_info",
      "can_invite_users",
      "can_pin_messages",
      "can_manage_topics",
      "until_date",
    ],
  },
  ChatMemberLeft: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["left"],
        description: 'The member\'s status in the chat, always "left"',
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Information about the user",
      },
    },
    required: ["status", "user"],
  },
  ChatMemberBanned: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["kicked"],
        description: 'The member\'s status in the chat, always "kicked"',
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Information about the user",
      },
      until_date: {
        type: "integer",
        description:
          "Date when restrictions will be lifted for this user; Unix time. If 0, then the user is banned forever.",
      },
    },
    required: ["status", "user", "until_date"],
  },
  ChatJoinRequest: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Chat to which the request was sent",
      },
      from: {
        type: "ref",
        ref: "User",
        description: "User that sent the join request",
      },
      user_chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of a private chat with the user who sent the join request. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot can use this identifier for 5 minutes to send messages until the join request is processed, assuming no other administrator contacted the user.",
      },
      date: {
        type: "integer",
        description: "Date the request was sent in Unix time",
      },
      bio: {
        type: "string",
        description: "Optional. Bio of the user",
      },
      invite_link: {
        type: "ref",
        ref: "ChatInviteLink",
        description: "Optional. Chat invite link that was used by the user to send the join request",
      },
      query_id: {
        type: "string",
        description:
          "Optional. Identifier of the join request query; for bots assigned to process join requests only. If present, then the bot must call sendChatJoinRequestWebApp or directly call answerChatJoinRequestQuery within 10 seconds.",
      },
    },
    required: ["chat", "from", "user_chat_id", "date"],
  },
  ChatPermissions: {
    type: "object",
    properties: {
      can_send_messages: {
        type: "boolean",
        description:
          "Optional. True, if the user is allowed to send text messages, rich messages, contacts, giveaways, giveaway winners, invoices, locations and venues",
      },
      can_send_audios: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to send audios",
      },
      can_send_documents: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to send documents",
      },
      can_send_photos: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to send photos",
      },
      can_send_videos: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to send videos",
      },
      can_send_video_notes: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to send video notes",
      },
      can_send_voice_notes: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to send voice notes",
      },
      can_send_polls: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to send polls and checklists",
      },
      can_send_other_messages: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to send animations, games, stickers and use inline bots",
      },
      can_add_web_page_previews: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to add web page previews to their messages",
      },
      can_react_to_messages: {
        type: "boolean",
        description:
          "Optional. True, if the user is allowed to react to messages. If omitted, defaults to the value of can_send_messages.",
      },
      can_edit_tag: {
        type: "boolean",
        description:
          "Optional. True, if the user is allowed to edit their own tag. If omitted, defaults to the value of can_pin_messages.",
      },
      can_change_info: {
        type: "boolean",
        description:
          "Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups.",
      },
      can_invite_users: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to invite new users to the chat",
      },
      can_pin_messages: {
        type: "boolean",
        description: "Optional. True, if the user is allowed to pin messages. Ignored in public supergroups.",
      },
      can_manage_topics: {
        type: "boolean",
        description:
          "Optional. True, if the user is allowed to create forum topics. If omitted, defaults to the value of can_pin_messages.",
      },
    },
    required: [],
  },
  Birthdate: {
    type: "object",
    properties: {
      day: {
        type: "integer",
        description: "Day of the user's birth; 1-31",
      },
      month: {
        type: "integer",
        description: "Month of the user's birth; 1-12",
      },
      year: {
        type: "integer",
        description: "Optional. Year of the user's birth",
      },
    },
    required: ["day", "month"],
  },
  BusinessIntro: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Optional. Title text of the business intro",
      },
      message: {
        type: "string",
        description: "Optional. Message text of the business intro",
      },
      sticker: {
        type: "ref",
        ref: "Sticker",
        description: "Optional. Sticker of the business intro",
      },
    },
    required: [],
  },
  BusinessLocation: {
    type: "object",
    properties: {
      address: {
        type: "string",
        description: "Address of the business",
      },
      location: {
        type: "ref",
        ref: "Location",
        description: "Optional. Location of the business",
      },
    },
    required: ["address"],
  },
  BusinessOpeningHoursInterval: {
    type: "object",
    properties: {
      opening_minute: {
        type: "integer",
        description:
          "The minute's sequence number in a week, starting on Monday, marking the start of the time interval during which the business is open; 0 - 7 * 24 * 60",
      },
      closing_minute: {
        type: "integer",
        description:
          "The minute's sequence number in a week, starting on Monday, marking the end of the time interval during which the business is open; 0 - 8 * 24 * 60",
      },
    },
    required: ["opening_minute", "closing_minute"],
  },
  BusinessOpeningHours: {
    type: "object",
    properties: {
      time_zone_name: {
        type: "string",
        description: "Unique name of the time zone for which the opening hours are defined",
      },
      opening_hours: {
        type: "array",
        items: {
          type: "ref",
          ref: "BusinessOpeningHoursInterval",
        },
        description: "List of time intervals describing business opening hours",
      },
    },
    required: ["time_zone_name", "opening_hours"],
  },
  UserRating: {
    type: "object",
    properties: {
      level: {
        type: "integer",
        description:
          "Current level of the user, indicating their reliability when purchasing digital goods and services. A higher level suggests a more trustworthy customer; a negative level is likely reason for concern.",
      },
      rating: {
        type: "integer",
        description: "Numerical value of the user's rating; the higher the rating, the better",
      },
      current_level_rating: {
        type: "integer",
        description: "The rating value required to get the current level",
      },
      next_level_rating: {
        type: "integer",
        description:
          "Optional. The rating value required to get to the next level; omitted if the maximum level was reached",
      },
    },
    required: ["level", "rating", "current_level_rating"],
  },
  StoryAreaPosition: {
    type: "object",
    properties: {
      x_percentage: {
        type: "number",
        description: "The abscissa of the area's center, as a percentage of the media width",
      },
      y_percentage: {
        type: "number",
        description: "The ordinate of the area's center, as a percentage of the media height",
      },
      width_percentage: {
        type: "number",
        description: "The width of the area's rectangle, as a percentage of the media width",
      },
      height_percentage: {
        type: "number",
        description: "The height of the area's rectangle, as a percentage of the media height",
      },
      rotation_angle: {
        type: "number",
        description: "The clockwise rotation angle of the rectangle, in degrees; 0-360",
      },
      corner_radius_percentage: {
        type: "number",
        description: "The radius of the rectangle corner rounding, as a percentage of the media width",
      },
    },
    required: [
      "x_percentage",
      "y_percentage",
      "width_percentage",
      "height_percentage",
      "rotation_angle",
      "corner_radius_percentage",
    ],
  },
  LocationAddress: {
    type: "object",
    properties: {
      country_code: {
        type: "string",
        description: "The two-letter ISO 3166-1 alpha-2 country code of the country where the location is located",
      },
      state: {
        type: "string",
        description: "Optional. State of the location",
      },
      city: {
        type: "string",
        description: "Optional. City of the location",
      },
      street: {
        type: "string",
        description: "Optional. Street address of the location",
      },
    },
    required: ["country_code"],
  },
  StoryAreaType: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "StoryAreaTypeLocation",
      },
      {
        type: "ref",
        ref: "StoryAreaTypeSuggestedReaction",
      },
      {
        type: "ref",
        ref: "StoryAreaTypeLink",
      },
      {
        type: "ref",
        ref: "StoryAreaTypeWeather",
      },
      {
        type: "ref",
        ref: "StoryAreaTypeUniqueGift",
      },
    ],
  },
  StoryAreaTypeLocation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["location"],
        description: 'Type of the area, always "location"',
      },
      latitude: {
        type: "number",
        description: "Location latitude in degrees",
      },
      longitude: {
        type: "number",
        description: "Location longitude in degrees",
      },
      address: {
        type: "ref",
        ref: "LocationAddress",
        description: "Optional. Address of the location",
      },
    },
    required: ["type", "latitude", "longitude"],
  },
  StoryAreaTypeSuggestedReaction: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["suggested_reaction"],
        description: 'Type of the area, always "suggested_reaction"',
      },
      reaction_type: {
        type: "ref",
        ref: "ReactionType",
        description: "Type of the reaction",
      },
      is_dark: {
        type: "boolean",
        description: "Optional. Pass True if the reaction area has a dark background",
      },
      is_flipped: {
        type: "boolean",
        description: "Optional. Pass True if reaction area corner is flipped",
      },
    },
    required: ["type", "reaction_type"],
  },
  StoryAreaTypeLink: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["link"],
        description: 'Type of the area, always "link"',
      },
      url: {
        type: "string",
        description: "HTTP or tg:// URL to be opened when the area is clicked",
      },
    },
    required: ["type", "url"],
  },
  StoryAreaTypeWeather: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["weather"],
        description: 'Type of the area, always "weather"',
      },
      temperature: {
        type: "number",
        description: "Temperature, in degree Celsius",
      },
      emoji: {
        type: "string",
        description: "Emoji representing the weather",
      },
      background_color: {
        type: "integer",
        description: "A color of the area background in the ARGB format",
      },
    },
    required: ["type", "temperature", "emoji", "background_color"],
  },
  StoryAreaTypeUniqueGift: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["unique_gift"],
        description: 'Type of the area, always "unique_gift"',
      },
      name: {
        type: "string",
        description: "Unique name of the gift",
      },
    },
    required: ["type", "name"],
  },
  StoryArea: {
    type: "object",
    properties: {
      position: {
        type: "ref",
        ref: "StoryAreaPosition",
        description: "Position of the area",
      },
      type: {
        type: "ref",
        ref: "StoryAreaType",
        description: "Type of the area",
      },
    },
    required: ["position", "type"],
  },
  ChatLocation: {
    type: "object",
    properties: {
      location: {
        type: "ref",
        ref: "Location",
        description: "The location to which the supergroup is connected. Can't be a live location.",
      },
      address: {
        type: "string",
        description: "Location address; 1-64 characters, as defined by the chat owner",
      },
    },
    required: ["location", "address"],
  },
  ReactionType: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "ReactionTypeEmoji",
      },
      {
        type: "ref",
        ref: "ReactionTypeCustomEmoji",
      },
      {
        type: "ref",
        ref: "ReactionTypePaid",
      },
    ],
  },
  ReactionTypeEmoji: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["emoji"],
        description: 'Type of the reaction, always "emoji"',
      },
      emoji: {
        type: "string",
        description:
          'Reaction emoji. Currently, it can be one of "❤", "👍", "👎", "🔥", "🥰", "👏", "😁", "🤔", "🤯", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏", "👌", "🕊", "🤡", "🥱", "🥴", "😍", "🐳", "❤‍🔥", "🌚", "🌭", "💯", "🤣", "⚡", "🍌", "🏆", "💔", "🤨", "😐", "🍓", "🍾", "💋", "🖕", "😈", "😴", "😭", "🤓", "👻", "👨‍💻", "👀", "🎃", "🙈", "😇", "😨", "🤝", "✍", "🤗", "🫡", "🎅", "🎄", "☃", "💅", "🤪", "🗿", "🆒", "💘", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷‍♂", "🤷", "🤷‍♀", "😡".',
      },
    },
    required: ["type", "emoji"],
  },
  ReactionTypeCustomEmoji: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["custom_emoji"],
        description: 'Type of the reaction, always "custom_emoji"',
      },
      custom_emoji_id: {
        type: "string",
        description: "Custom emoji identifier",
      },
    },
    required: ["type", "custom_emoji_id"],
  },
  ReactionTypePaid: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["paid"],
        description: 'Type of the reaction, always "paid"',
      },
    },
    required: ["type"],
  },
  ReactionCount: {
    type: "object",
    properties: {
      type: {
        type: "ref",
        ref: "ReactionType",
        description: "Type of the reaction",
      },
      total_count: {
        type: "integer",
        description: "Number of times the reaction was added",
      },
    },
    required: ["type", "total_count"],
  },
  MessageReactionUpdated: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "The chat containing the message the user reacted to",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the message inside the chat",
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Optional. The user that changed the reaction, if the user isn't anonymous",
      },
      actor_chat: {
        type: "ref",
        ref: "Chat",
        description: "Optional. The chat on behalf of which the reaction was changed, if the user is anonymous",
      },
      date: {
        type: "integer",
        description: "Date of the change in Unix time",
      },
      old_reaction: {
        type: "array",
        items: {
          type: "ref",
          ref: "ReactionType",
        },
        description: "Previous list of reaction types that were set by the user",
      },
      new_reaction: {
        type: "array",
        items: {
          type: "ref",
          ref: "ReactionType",
        },
        description: "New list of reaction types that have been set by the user",
      },
    },
    required: ["chat", "message_id", "date", "old_reaction", "new_reaction"],
  },
  MessageReactionCountUpdated: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "The chat containing the message",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Unique message identifier inside the chat",
      },
      date: {
        type: "integer",
        description: "Date of the change in Unix time",
      },
      reactions: {
        type: "array",
        items: {
          type: "ref",
          ref: "ReactionCount",
        },
        description: "List of reactions that are present on the message",
      },
    },
    required: ["chat", "message_id", "date", "reactions"],
  },
  ForumTopic: {
    type: "object",
    properties: {
      message_thread_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the forum topic",
      },
      name: {
        type: "string",
        description: "Name of the topic",
      },
      icon_color: {
        type: "integer",
        description: "Color of the topic icon in RGB format",
      },
      icon_custom_emoji_id: {
        type: "string",
        description: "Optional. Unique identifier of the custom emoji shown as the topic icon",
      },
      is_name_implicit: {
        type: "boolean",
        description:
          "Optional. True, if the name of the topic wasn't specified explicitly by its creator and likely needs to be changed by the bot",
      },
    },
    required: ["message_thread_id", "name", "icon_color"],
  },
  GiftBackground: {
    type: "object",
    properties: {
      center_color: {
        type: "integer",
        description: "Center color of the background in RGB format",
      },
      edge_color: {
        type: "integer",
        description: "Edge color of the background in RGB format",
      },
      text_color: {
        type: "integer",
        description: "Text color of the background in RGB format",
      },
    },
    required: ["center_color", "edge_color", "text_color"],
  },
  Gift: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier of the gift",
      },
      sticker: {
        type: "ref",
        ref: "Sticker",
        description: "The sticker that represents the gift",
      },
      star_count: {
        type: "integer",
        description: "The number of Telegram Stars that must be paid to send the sticker",
      },
      upgrade_star_count: {
        type: "integer",
        description: "Optional. The number of Telegram Stars that must be paid to upgrade the gift to a unique one",
      },
      is_premium: {
        type: "boolean",
        description: "Optional. True, if the gift can only be purchased by Telegram Premium subscribers",
      },
      has_colors: {
        type: "boolean",
        description: "Optional. True, if the gift can be used (after being upgraded) to customize a user's appearance",
      },
      total_count: {
        type: "integer",
        description:
          "Optional. The total number of gifts of this type that can be sent by all users; for limited gifts only",
      },
      remaining_count: {
        type: "integer",
        description:
          "Optional. The number of remaining gifts of this type that can be sent by all users; for limited gifts only",
      },
      personal_total_count: {
        type: "integer",
        description:
          "Optional. The total number of gifts of this type that can be sent by the bot; for limited gifts only",
      },
      personal_remaining_count: {
        type: "integer",
        description:
          "Optional. The number of remaining gifts of this type that can be sent by the bot; for limited gifts only",
      },
      background: {
        type: "ref",
        ref: "GiftBackground",
        description: "Optional. Background of the gift",
      },
      unique_gift_variant_count: {
        type: "integer",
        description: "Optional. The total number of different unique gifts that can be obtained by upgrading the gift",
      },
      publisher_chat: {
        type: "ref",
        ref: "Chat",
        description: "Optional. Information about the chat that published the gift",
      },
    },
    required: ["id", "sticker", "star_count"],
  },
  Gifts: {
    type: "object",
    properties: {
      gifts: {
        type: "array",
        items: {
          type: "ref",
          ref: "Gift",
        },
        description: "The list of gifts",
      },
    },
    required: ["gifts"],
  },
  UniqueGiftModel: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the model",
      },
      sticker: {
        type: "ref",
        ref: "Sticker",
        description: "The sticker that represents the unique gift",
      },
      rarity_per_mille: {
        type: "integer",
        description:
          "The number of unique gifts that receive this model for every 1000 gift upgrades. Always 0 for crafted gifts.",
      },
      rarity: {
        type: "string",
        description:
          'Optional. Rarity of the model if it is a crafted model. Currently, can be "uncommon", "rare", "epic", or "legendary".',
      },
    },
    required: ["name", "sticker", "rarity_per_mille"],
  },
  UniqueGiftSymbol: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the symbol",
      },
      sticker: {
        type: "ref",
        ref: "Sticker",
        description: "The sticker that represents the unique gift",
      },
      rarity_per_mille: {
        type: "integer",
        description: "The number of unique gifts that receive this model for every 1000 gifts upgraded",
      },
    },
    required: ["name", "sticker", "rarity_per_mille"],
  },
  UniqueGiftBackdropColors: {
    type: "object",
    properties: {
      center_color: {
        type: "integer",
        description: "The color in the center of the backdrop in RGB format",
      },
      edge_color: {
        type: "integer",
        description: "The color on the edges of the backdrop in RGB format",
      },
      symbol_color: {
        type: "integer",
        description: "The color to be applied to the symbol in RGB format",
      },
      text_color: {
        type: "integer",
        description: "The color for the text on the backdrop in RGB format",
      },
    },
    required: ["center_color", "edge_color", "symbol_color", "text_color"],
  },
  UniqueGiftBackdrop: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the backdrop",
      },
      colors: {
        type: "ref",
        ref: "UniqueGiftBackdropColors",
        description: "Colors of the backdrop",
      },
      rarity_per_mille: {
        type: "integer",
        description: "The number of unique gifts that receive this backdrop for every 1000 gifts upgraded",
      },
    },
    required: ["name", "colors", "rarity_per_mille"],
  },
  UniqueGiftColors: {
    type: "object",
    properties: {
      model_custom_emoji_id: {
        type: "string",
        description: "Custom emoji identifier of the unique gift's model",
      },
      symbol_custom_emoji_id: {
        type: "string",
        description: "Custom emoji identifier of the unique gift's symbol",
      },
      light_theme_main_color: {
        type: "integer",
        description: "Main color used in light themes; RGB format",
      },
      light_theme_other_colors: {
        type: "array",
        items: {
          type: "integer",
        },
        description: "List of 1-3 additional colors used in light themes; RGB format",
      },
      dark_theme_main_color: {
        type: "integer",
        description: "Main color used in dark themes; RGB format",
      },
      dark_theme_other_colors: {
        type: "array",
        items: {
          type: "integer",
        },
        description: "List of 1-3 additional colors used in dark themes; RGB format",
      },
    },
    required: [
      "model_custom_emoji_id",
      "symbol_custom_emoji_id",
      "light_theme_main_color",
      "light_theme_other_colors",
      "dark_theme_main_color",
      "dark_theme_other_colors",
    ],
  },
  UniqueGift: {
    type: "object",
    properties: {
      gift_id: {
        type: "string",
        description: "Identifier of the regular gift from which the gift was upgraded",
      },
      base_name: {
        type: "string",
        description: "Human-readable name of the regular gift from which this unique gift was upgraded",
      },
      name: {
        type: "string",
        description: "Unique name of the gift. This name can be used in https://t.me/nft/... links and story areas.",
      },
      number: {
        type: "integer",
        description: "Unique number of the upgraded gift among gifts upgraded from the same regular gift",
      },
      model: {
        type: "ref",
        ref: "UniqueGiftModel",
        description: "Model of the gift",
      },
      symbol: {
        type: "ref",
        ref: "UniqueGiftSymbol",
        description: "Symbol of the gift",
      },
      backdrop: {
        type: "ref",
        ref: "UniqueGiftBackdrop",
        description: "Backdrop of the gift",
      },
      is_premium: {
        type: "boolean",
        description:
          "Optional. True, if the original regular gift was exclusively purchaseable by Telegram Premium subscribers",
      },
      is_burned: {
        type: "boolean",
        description: "Optional. True, if the gift was used to craft another gift and isn't available anymore",
      },
      is_from_blockchain: {
        type: "boolean",
        description:
          "Optional. True, if the gift is assigned from the TON blockchain and can't be resold or transferred in Telegram",
      },
      colors: {
        type: "ref",
        ref: "UniqueGiftColors",
        description:
          "Optional. The color scheme that can be used by the gift's owner for the chat's name, replies to messages and link previews; for business account gifts and gifts that are currently on sale only",
      },
      publisher_chat: {
        type: "ref",
        ref: "Chat",
        description: "Optional. Information about the chat that published the gift",
      },
    },
    required: ["gift_id", "base_name", "name", "number", "model", "symbol", "backdrop"],
  },
  GiftInfo: {
    type: "object",
    properties: {
      gift: {
        type: "ref",
        ref: "Gift",
        description: "Information about the gift",
      },
      owned_gift_id: {
        type: "string",
        description:
          "Optional. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts",
      },
      convert_star_count: {
        type: "integer",
        description:
          "Optional. Number of Telegram Stars that can be claimed by the receiver by converting the gift; omitted if conversion to Telegram Stars is impossible",
      },
      prepaid_upgrade_star_count: {
        type: "integer",
        description: "Optional. Number of Telegram Stars that were prepaid for the ability to upgrade the gift",
      },
      is_upgrade_separate: {
        type: "boolean",
        description: "Optional. True, if the gift's upgrade was purchased after the gift was sent",
      },
      can_be_upgraded: {
        type: "boolean",
        description: "Optional. True, if the gift can be upgraded to a unique gift",
      },
      text: {
        type: "string",
        description: "Optional. Text of the message that was added to the gift",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description: "Optional. Special entities that appear in the text",
      },
      is_private: {
        type: "boolean",
        description:
          "Optional. True, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them",
      },
      unique_gift_number: {
        type: "integer",
        description:
          "Optional. Unique number reserved for this gift when upgraded. See the number field in UniqueGift.",
      },
    },
    required: ["gift"],
  },
  UniqueGiftInfo: {
    type: "object",
    properties: {
      gift: {
        type: "ref",
        ref: "UniqueGift",
        description: "Information about the gift",
      },
      origin: {
        type: "string",
        description:
          'Origin of the gift. Currently, either "upgrade" for gifts upgraded from regular gifts, "transfer" for gifts transferred from other users or channels, "resale" for gifts bought from other users, "gifted_upgrade" for upgrades purchased after the gift was sent, or "offer" for gifts bought or sold through gift purchase offers.',
      },
      text: {
        type: "string",
        description: "Optional. Text of the message that was added to the gift",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description: "Optional. Special entities that appear in the text",
      },
      is_private: {
        type: "boolean",
        description:
          "Optional. True, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them",
      },
      last_resale_currency: {
        type: "string",
        description:
          'Optional. For gifts bought from other users, the currency in which the payment for the gift was done. Currently, one of "XTR" for Telegram Stars or "TON" for TON grams.',
      },
      last_resale_amount: {
        type: "integer",
        description:
          "Optional. For gifts bought from other users, the price paid for the gift in either Telegram Stars or nanograms",
      },
      owned_gift_id: {
        type: "string",
        description:
          "Optional. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts",
      },
      transfer_star_count: {
        type: "integer",
        description:
          "Optional. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift",
      },
      next_transfer_date: {
        type: "integer",
        description:
          "Optional. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now.",
      },
    },
    required: ["gift", "origin"],
  },
  OwnedGift: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "OwnedGiftRegular",
      },
      {
        type: "ref",
        ref: "OwnedGiftUnique",
      },
    ],
  },
  OwnedGiftRegular: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["regular"],
        description: 'Type of the gift, always "regular"',
      },
      gift: {
        type: "ref",
        ref: "Gift",
        description: "Information about the regular gift",
      },
      owned_gift_id: {
        type: "string",
        description:
          "Optional. Unique identifier of the gift for the bot; for gifts received on behalf of business accounts only",
      },
      sender_user: {
        type: "ref",
        ref: "User",
        description: "Optional. Sender of the gift if it is a known user",
      },
      send_date: {
        type: "integer",
        description: "Date the gift was sent in Unix time",
      },
      text: {
        type: "string",
        description: "Optional. Text of the message that was added to the gift",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description: "Optional. Special entities that appear in the text",
      },
      is_private: {
        type: "boolean",
        description:
          "Optional. True, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them",
      },
      is_saved: {
        type: "boolean",
        description:
          "Optional. True, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only",
      },
      can_be_upgraded: {
        type: "boolean",
        description:
          "Optional. True, if the gift can be upgraded to a unique gift; for gifts received on behalf of business accounts only",
      },
      was_refunded: {
        type: "boolean",
        description: "Optional. True, if the gift was refunded and isn't available anymore",
      },
      convert_star_count: {
        type: "integer",
        description:
          "Optional. Number of Telegram Stars that can be claimed by the receiver instead of the gift; omitted if the gift cannot be converted to Telegram Stars; for gifts received on behalf of business accounts only",
      },
      prepaid_upgrade_star_count: {
        type: "integer",
        description: "Optional. Number of Telegram Stars that were paid for the ability to upgrade the gift",
      },
      is_upgrade_separate: {
        type: "boolean",
        description:
          "Optional. True, if the gift's upgrade was purchased after the gift was sent; for gifts received on behalf of business accounts only",
      },
      unique_gift_number: {
        type: "integer",
        description:
          "Optional. Unique number reserved for this gift when upgraded. See the number field in UniqueGift.",
      },
    },
    required: ["type", "gift", "send_date"],
  },
  OwnedGiftUnique: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["unique"],
        description: 'Type of the gift, always "unique"',
      },
      gift: {
        type: "ref",
        ref: "UniqueGift",
        description: "Information about the unique gift",
      },
      owned_gift_id: {
        type: "string",
        description:
          "Optional. Unique identifier of the received gift for the bot; for gifts received on behalf of business accounts only",
      },
      sender_user: {
        type: "ref",
        ref: "User",
        description: "Optional. Sender of the gift if it is a known user",
      },
      send_date: {
        type: "integer",
        description: "Date the gift was sent in Unix time",
      },
      is_saved: {
        type: "boolean",
        description:
          "Optional. True, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only",
      },
      can_be_transferred: {
        type: "boolean",
        description:
          "Optional. True, if the gift can be transferred to another owner; for gifts received on behalf of business accounts only",
      },
      transfer_star_count: {
        type: "integer",
        description:
          "Optional. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift",
      },
      next_transfer_date: {
        type: "integer",
        description:
          "Optional. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now.",
      },
    },
    required: ["type", "gift", "send_date"],
  },
  OwnedGifts: {
    type: "object",
    properties: {
      total_count: {
        type: "integer",
        description: "The total number of gifts owned by the user or the chat",
      },
      gifts: {
        type: "array",
        items: {
          type: "ref",
          ref: "OwnedGift",
        },
        description: "The list of gifts",
      },
      next_offset: {
        type: "string",
        description: "Optional. Offset for the next request. If empty, then there are no more results.",
      },
    },
    required: ["total_count", "gifts"],
  },
  BotAccessSettings: {
    type: "object",
    properties: {
      is_access_restricted: {
        type: "boolean",
        description: "True, if only selected users can access the bot. The bot's owner can always access it.",
      },
      added_users: {
        type: "array",
        items: {
          type: "ref",
          ref: "User",
        },
        description: "Optional. The list of other users who have access to the bot if the access is restricted",
      },
    },
    required: ["is_access_restricted"],
  },
  AcceptedGiftTypes: {
    type: "object",
    properties: {
      unlimited_gifts: {
        type: "boolean",
        description: "True, if unlimited regular gifts are accepted",
      },
      limited_gifts: {
        type: "boolean",
        description: "True, if limited regular gifts are accepted",
      },
      unique_gifts: {
        type: "boolean",
        description: "True, if unique gifts or gifts that can be upgraded to unique for free are accepted",
      },
      premium_subscription: {
        type: "boolean",
        description: "True, if a Telegram Premium subscription is accepted",
      },
      gifts_from_channels: {
        type: "boolean",
        description: "True, if transfers of unique gifts from channels are accepted",
      },
    },
    required: ["unlimited_gifts", "limited_gifts", "unique_gifts", "premium_subscription", "gifts_from_channels"],
  },
  StarAmount: {
    type: "object",
    properties: {
      amount: {
        type: "integer",
        description: "Integer amount of Telegram Stars, rounded to 0; can be negative",
      },
      nanostar_amount: {
        type: "integer",
        description:
          "Optional. The number of 1/1000000000 shares of Telegram Stars; from -999999999 to 999999999; can be negative if and only if amount is non-positive",
      },
    },
    required: ["amount"],
  },
  BotCommand: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description:
          "Text of the command; 1-32 characters. Can contain only lowercase English letters, digits and underscores.",
      },
      description: {
        type: "string",
        description: "Description of the command; 1-256 characters",
      },
      is_ephemeral: {
        type: "boolean",
        description:
          "Optional. True, if the command sends an ephemeral message, which can be seen only by the sender of the message and the bot",
      },
    },
    required: ["command", "description"],
  },
  BotCommandScope: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "BotCommandScopeDefault",
      },
      {
        type: "ref",
        ref: "BotCommandScopeAllPrivateChats",
      },
      {
        type: "ref",
        ref: "BotCommandScopeAllGroupChats",
      },
      {
        type: "ref",
        ref: "BotCommandScopeAllChatAdministrators",
      },
      {
        type: "ref",
        ref: "BotCommandScopeChat",
      },
      {
        type: "ref",
        ref: "BotCommandScopeChatAdministrators",
      },
      {
        type: "ref",
        ref: "BotCommandScopeChatMember",
      },
    ],
  },
  BotCommandScopeDefault: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["default"],
        description: "Scope type, must be default",
      },
    },
    required: ["type"],
  },
  BotCommandScopeAllPrivateChats: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["all_private_chats"],
        description: "Scope type, must be all_private_chats",
      },
    },
    required: ["type"],
  },
  BotCommandScopeAllGroupChats: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["all_group_chats"],
        description: "Scope type, must be all_group_chats",
      },
    },
    required: ["type"],
  },
  BotCommandScopeAllChatAdministrators: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["all_chat_administrators"],
        description: "Scope type, must be all_chat_administrators",
      },
    },
    required: ["type"],
  },
  BotCommandScopeChat: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["chat"],
        description: "Scope type, must be chat",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username. Channel direct messages chats and channel chats aren't supported.",
      },
    },
    required: ["type", "chat_id"],
  },
  BotCommandScopeChatAdministrators: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["chat_administrators"],
        description: "Scope type, must be chat_administrators",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username. Channel direct messages chats and channel chats aren't supported.",
      },
    },
    required: ["type", "chat_id"],
  },
  BotCommandScopeChatMember: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["chat_member"],
        description: "Scope type, must be chat_member",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username. Channel direct messages chats and channel chats aren't supported.",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
    },
    required: ["type", "chat_id", "user_id"],
  },
  BotName: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "The bot's name",
      },
    },
    required: ["name"],
  },
  BotDescription: {
    type: "object",
    properties: {
      description: {
        type: "string",
        description: "The bot's description",
      },
    },
    required: ["description"],
  },
  BotShortDescription: {
    type: "object",
    properties: {
      short_description: {
        type: "string",
        description: "The bot's short description",
      },
    },
    required: ["short_description"],
  },
  MenuButton: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "MenuButtonCommands",
      },
      {
        type: "ref",
        ref: "MenuButtonWebApp",
      },
      {
        type: "ref",
        ref: "MenuButtonDefault",
      },
    ],
  },
  MenuButtonCommands: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["commands"],
        description: "Type of the button, must be commands",
      },
    },
    required: ["type"],
  },
  MenuButtonWebApp: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["web_app"],
        description: "Type of the button, must be web_app",
      },
      text: {
        type: "string",
        description: "Text on the button",
      },
      web_app: {
        type: "ref",
        ref: "WebAppInfo",
        description:
          "Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Alternatively, a t.me link to a Web App of the bot can be specified in the object instead of the Web App's URL, in which case the Web App will be opened as if the user pressed the link.",
      },
    },
    required: ["type", "text", "web_app"],
  },
  MenuButtonDefault: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["default"],
        description: "Type of the button, must be default",
      },
    },
    required: ["type"],
  },
  ChatBoostSource: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "ChatBoostSourcePremium",
      },
      {
        type: "ref",
        ref: "ChatBoostSourceGiftCode",
      },
      {
        type: "ref",
        ref: "ChatBoostSourceGiveaway",
      },
    ],
  },
  ChatBoostSourcePremium: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["premium"],
        description: 'Source of the boost, always "premium"',
      },
      user: {
        type: "ref",
        ref: "User",
        description: "User that boosted the chat",
      },
    },
    required: ["source", "user"],
  },
  ChatBoostSourceGiftCode: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["gift_code"],
        description: 'Source of the boost, always "gift_code"',
      },
      user: {
        type: "ref",
        ref: "User",
        description: "User for which the gift code was created",
      },
    },
    required: ["source", "user"],
  },
  ChatBoostSourceGiveaway: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["giveaway"],
        description: 'Source of the boost, always "giveaway"',
      },
      giveaway_message_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of a message in the chat with the giveaway; the message could have been deleted already. May be 0 if the message isn't sent yet.",
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Optional. User that won the prize in the giveaway if any; for Telegram Premium giveaways only",
      },
      prize_star_count: {
        type: "integer",
        description:
          "Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only",
      },
      is_unclaimed: {
        type: "boolean",
        description: "Optional. True, if the giveaway was completed, but there was no user to win the prize",
      },
    },
    required: ["source", "giveaway_message_id"],
  },
  ChatBoost: {
    type: "object",
    properties: {
      boost_id: {
        type: "string",
        description: "Unique identifier of the boost",
      },
      add_date: {
        type: "integer",
        description: "Point in time (Unix timestamp) when the chat was boosted",
      },
      expiration_date: {
        type: "integer",
        description:
          "Point in time (Unix timestamp) when the boost will automatically expire, unless the booster's Telegram Premium subscription is prolonged",
      },
      source: {
        type: "ref",
        ref: "ChatBoostSource",
        description: "Source of the added boost",
      },
    },
    required: ["boost_id", "add_date", "expiration_date", "source"],
  },
  ChatBoostUpdated: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Chat which was boosted",
      },
      boost: {
        type: "ref",
        ref: "ChatBoost",
        description: "Information about the chat boost",
      },
    },
    required: ["chat", "boost"],
  },
  ChatBoostRemoved: {
    type: "object",
    properties: {
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Chat which was boosted",
      },
      boost_id: {
        type: "string",
        description: "Unique identifier of the boost",
      },
      remove_date: {
        type: "integer",
        description: "Point in time (Unix timestamp) when the boost was removed",
      },
      source: {
        type: "ref",
        ref: "ChatBoostSource",
        description: "Source of the removed boost",
      },
    },
    required: ["chat", "boost_id", "remove_date", "source"],
  },
  ChatOwnerLeft: {
    type: "object",
    properties: {
      new_owner: {
        type: "ref",
        ref: "User",
        description:
          "Optional. The user who will become the new owner of the chat if the previous owner does not return to the chat",
      },
    },
    required: [],
  },
  ChatOwnerChanged: {
    type: "object",
    properties: {
      new_owner: {
        type: "ref",
        ref: "User",
        description: "The new owner of the chat",
      },
    },
    required: ["new_owner"],
  },
  UserChatBoosts: {
    type: "object",
    properties: {
      boosts: {
        type: "array",
        items: {
          type: "ref",
          ref: "ChatBoost",
        },
        description: "The list of boosts added to the chat by the user",
      },
    },
    required: ["boosts"],
  },
  BusinessBotRights: {
    type: "object",
    properties: {
      can_reply: {
        type: "boolean",
        description:
          "Optional. True, if the bot can send and edit messages in the private chats that had incoming messages in the last 24 hours",
      },
      can_read_messages: {
        type: "boolean",
        description: "Optional. True, if the bot can mark incoming private messages as read",
      },
      can_delete_sent_messages: {
        type: "boolean",
        description: "Optional. True, if the bot can delete messages sent by the bot",
      },
      can_delete_all_messages: {
        type: "boolean",
        description: "Optional. True, if the bot can delete all private messages in managed chats",
      },
      can_edit_name: {
        type: "boolean",
        description: "Optional. True, if the bot can edit the first and last name of the business account",
      },
      can_edit_bio: {
        type: "boolean",
        description: "Optional. True, if the bot can edit the bio of the business account",
      },
      can_edit_profile_photo: {
        type: "boolean",
        description: "Optional. True, if the bot can edit the profile photo of the business account",
      },
      can_edit_username: {
        type: "boolean",
        description: "Optional. True, if the bot can edit the username of the business account",
      },
      can_change_gift_settings: {
        type: "boolean",
        description:
          "Optional. True, if the bot can change the privacy settings pertaining to gifts for the business account",
      },
      can_view_gifts_and_stars: {
        type: "boolean",
        description:
          "Optional. True, if the bot can view gifts and the amount of Telegram Stars owned by the business account",
      },
      can_convert_gifts_to_stars: {
        type: "boolean",
        description:
          "Optional. True, if the bot can convert regular gifts owned by the business account to Telegram Stars",
      },
      can_transfer_and_upgrade_gifts: {
        type: "boolean",
        description: "Optional. True, if the bot can transfer and upgrade gifts owned by the business account",
      },
      can_transfer_stars: {
        type: "boolean",
        description:
          "Optional. True, if the bot can transfer Telegram Stars received by the business account to its own account, or use them to upgrade and transfer gifts",
      },
      can_manage_stories: {
        type: "boolean",
        description: "Optional. True, if the bot can post, edit and delete stories on behalf of the business account",
      },
    },
    required: [],
  },
  BusinessConnection: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Business account user that created the business connection",
      },
      user_chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of a private chat with the user who created the business connection. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      date: {
        type: "integer",
        description: "Date the connection was established in Unix time",
      },
      rights: {
        type: "ref",
        ref: "BusinessBotRights",
        description: "Optional. Rights of the business bot",
      },
      is_enabled: {
        type: "boolean",
        description: "True, if the connection is active",
      },
    },
    required: ["id", "user", "user_chat_id", "date", "is_enabled"],
  },
  BusinessMessagesDeleted: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      chat: {
        type: "ref",
        ref: "Chat",
        description:
          "Information about a chat in the business account. The bot may not have access to the chat or the corresponding user.",
      },
      message_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description: "The list of identifiers of deleted messages in the chat of the business account",
      },
    },
    required: ["business_connection_id", "chat", "message_ids"],
  },
  SentWebAppMessage: {
    type: "object",
    properties: {
      inline_message_id: {
        type: "string",
        description:
          "Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message.",
      },
    },
    required: [],
  },
  SentGuestMessage: {
    type: "object",
    properties: {
      inline_message_id: {
        type: "string",
        description: "Identifier of the sent inline message",
      },
    },
    required: ["inline_message_id"],
  },
  PreparedInlineMessage: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier of the prepared message",
      },
      expiration_date: {
        type: "integer",
        description:
          "Expiration date of the prepared message, in Unix time. Expired prepared messages can no longer be used.",
      },
    },
    required: ["id", "expiration_date"],
  },
  PreparedKeyboardButton: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier of the keyboard button",
      },
    },
    required: ["id"],
  },
  ResponseParameters: {
    type: "object",
    properties: {
      migrate_to_chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.",
      },
      retry_after: {
        type: "integer",
        description:
          "Optional. In case of exceeding flood control, the number of seconds left to wait before the request can be repeated",
      },
    },
    required: [],
  },
  InputMedia: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "InputMediaAnimation",
      },
      {
        type: "ref",
        ref: "InputMediaAudio",
      },
      {
        type: "ref",
        ref: "InputMediaDocument",
      },
      {
        type: "ref",
        ref: "InputMediaLivePhoto",
      },
      {
        type: "ref",
        ref: "InputMediaPhoto",
      },
      {
        type: "ref",
        ref: "InputMediaVideo",
      },
    ],
  },
  InputMediaAnimation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["animation"],
        description: "Type of the media, must be animation",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      thumbnail: {
        type: "string",
        format: "file-reference",
        description:
          "Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the animation to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the animation caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      width: {
        type: "integer",
        description: "Optional. Animation width",
      },
      height: {
        type: "integer",
        description: "Optional. Animation height",
      },
      duration: {
        type: "integer",
        description: "Optional. Animation duration in seconds",
      },
      has_spoiler: {
        type: "boolean",
        description: "Optional. Pass True if the animation needs to be covered with a spoiler animation",
      },
    },
    required: ["type", "media"],
  },
  InputMediaAudio: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["audio"],
        description: "Type of the media, must be audio",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      thumbnail: {
        type: "string",
        format: "file-reference",
        description:
          "Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the audio to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the audio caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      duration: {
        type: "integer",
        description: "Optional. Duration of the audio in seconds",
      },
      performer: {
        type: "string",
        description: "Optional. Performer of the audio",
      },
      title: {
        type: "string",
        description: "Optional. Title of the audio",
      },
    },
    required: ["type", "media"],
  },
  InputMediaDocument: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["document"],
        description: "Type of the media, must be document",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      thumbnail: {
        type: "string",
        format: "file-reference",
        description:
          "Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the document to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the document caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      disable_content_type_detection: {
        type: "boolean",
        description:
          "Optional. Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always True, if the document is sent as part of an album.",
      },
    },
    required: ["type", "media"],
  },
  InputMediaLink: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["link"],
        description: "Type of the media, must be link",
      },
      url: {
        type: "string",
        description: "HTTP URL of the link",
      },
    },
    required: ["type", "url"],
  },
  InputMediaLivePhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["live_photo"],
        description: "Type of the media, must be live_photo",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'Video of the live photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported.',
      },
      photo: {
        type: "string",
        format: "file-reference",
        description:
          'The static photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported.',
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the live photo to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the live photo caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      has_spoiler: {
        type: "boolean",
        description: "Optional. Pass True if the live photo needs to be covered with a spoiler animation",
      },
    },
    required: ["type", "media", "photo"],
  },
  InputMediaLocation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["location"],
        description: "Type of the media, must be location",
      },
      latitude: {
        type: "number",
        description: "Latitude of the location",
      },
      longitude: {
        type: "number",
        description: "Longitude of the location",
      },
      horizontal_accuracy: {
        type: "number",
        description: "Optional. The radius of uncertainty for the location, measured in meters; 0-1500",
      },
    },
    required: ["type", "latitude", "longitude"],
  },
  InputMediaPhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["photo"],
        description: "Type of the media, must be photo",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the photo caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      has_spoiler: {
        type: "boolean",
        description: "Optional. Pass True if the photo needs to be covered with a spoiler animation",
      },
    },
    required: ["type", "media"],
  },
  InputMediaSticker: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["sticker"],
        description: "Type of the media, must be sticker",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a .WEBP sticker from the Internet, or pass "attach://<file_attach_name>" to upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      emoji: {
        type: "string",
        description: "Optional. Emoji associated with the sticker; only for just uploaded stickers",
      },
    },
    required: ["type", "media"],
  },
  InputMediaVenue: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["venue"],
        description: "Type of the media, must be venue",
      },
      latitude: {
        type: "number",
        description: "Latitude of the location",
      },
      longitude: {
        type: "number",
        description: "Longitude of the location",
      },
      title: {
        type: "string",
        description: "Name of the venue",
      },
      address: {
        type: "string",
        description: "Address of the venue",
      },
      foursquare_id: {
        type: "string",
        description: "Optional. Foursquare identifier of the venue",
      },
      foursquare_type: {
        type: "string",
        description:
          'Optional. Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)',
      },
      google_place_id: {
        type: "string",
        description: "Optional. Google Places identifier of the venue",
      },
      google_place_type: {
        type: "string",
        description: "Optional. Google Places type of the venue. (See supported types.)",
      },
    },
    required: ["type", "latitude", "longitude", "title", "address"],
  },
  InputMediaVideo: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["video"],
        description: "Type of the media, must be video",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      thumbnail: {
        type: "string",
        format: "file-reference",
        description:
          "Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      cover: {
        type: "string",
        format: "file-reference",
        description:
          'Optional. Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      start_timestamp: {
        type: "integer",
        description: "Optional. Start timestamp for the video in the message",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the video to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the video caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      width: {
        type: "integer",
        description: "Optional. Video width",
      },
      height: {
        type: "integer",
        description: "Optional. Video height",
      },
      duration: {
        type: "integer",
        description: "Optional. Video duration in seconds",
      },
      supports_streaming: {
        type: "boolean",
        description: "Optional. Pass True if the uploaded video is suitable for streaming",
      },
      has_spoiler: {
        type: "boolean",
        description: "Optional. Pass True if the video needs to be covered with a spoiler animation",
      },
    },
    required: ["type", "media"],
  },
  InputMediaVoiceNote: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["voice_note"],
        description: "Type of the media, must be voice_note",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the voice message to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      duration: {
        type: "integer",
        description: "Optional. Duration of the voice message in seconds",
      },
    },
    required: ["type", "media"],
  },
  InputFile: {
    type: "string",
    format: "binary",
  },
  InputPaidMedia: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "InputPaidMediaLivePhoto",
      },
      {
        type: "ref",
        ref: "InputPaidMediaPhoto",
      },
      {
        type: "ref",
        ref: "InputPaidMediaVideo",
      },
    ],
  },
  InputPaidMediaLivePhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["live_photo"],
        description: "Type of the media, must be live_photo",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'Video of the live photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported.',
      },
      photo: {
        type: "string",
        format: "file-reference",
        description:
          'The static photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported.',
      },
    },
    required: ["type", "media", "photo"],
  },
  InputPaidMediaPhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["photo"],
        description: "Type of the media, must be photo",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
    },
    required: ["type", "media"],
  },
  InputPaidMediaVideo: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["video"],
        description: "Type of the media, must be video",
      },
      media: {
        type: "string",
        format: "file-reference",
        description:
          'File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      thumbnail: {
        type: "string",
        format: "file-reference",
        description:
          "Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      cover: {
        type: "string",
        format: "file-reference",
        description:
          'Optional. Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      start_timestamp: {
        type: "integer",
        description: "Optional. Start timestamp for the video in the message",
      },
      width: {
        type: "integer",
        description: "Optional. Video width",
      },
      height: {
        type: "integer",
        description: "Optional. Video height",
      },
      duration: {
        type: "integer",
        description: "Optional. Video duration in seconds",
      },
      supports_streaming: {
        type: "boolean",
        description: "Optional. Pass True if the uploaded video is suitable for streaming",
      },
    },
    required: ["type", "media"],
  },
  InputProfilePhoto: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "InputProfilePhotoStatic",
      },
      {
        type: "ref",
        ref: "InputProfilePhotoAnimated",
      },
    ],
  },
  InputProfilePhotoStatic: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["static"],
        description: "Type of the profile photo, must be static",
      },
      photo: {
        type: "string",
        format: "file-reference",
        description:
          'The static profile photo. Profile photos can\'t be reused and can only be uploaded as a new file, so you can pass "attach://<file_attach_name>" if the photo was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
    },
    required: ["type", "photo"],
  },
  InputProfilePhotoAnimated: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["animated"],
        description: "Type of the profile photo, must be animated",
      },
      animation: {
        type: "string",
        format: "file-reference",
        description:
          'The animated profile photo. Profile photos can\'t be reused and can only be uploaded as a new file, so you can pass "attach://<file_attach_name>" if the photo was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      main_frame_timestamp: {
        type: "number",
        description:
          "Optional. Timestamp in seconds of the frame that will be used as the static profile photo. Defaults to 0.0.",
      },
    },
    required: ["type", "animation"],
  },
  InputStoryContent: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "InputStoryContentPhoto",
      },
      {
        type: "ref",
        ref: "InputStoryContentVideo",
      },
    ],
  },
  InputStoryContentPhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["photo"],
        description: "Type of the content, must be photo",
      },
      photo: {
        type: "string",
        format: "file-reference",
        description:
          'The photo to post as a story. The photo must be of the size 1080x1920 and must not exceed 10 MB. The photo can\'t be reused and can only be uploaded as a new file, so you can pass "attach://<file_attach_name>" if the photo was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
    },
    required: ["type", "photo"],
  },
  InputStoryContentVideo: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["video"],
        description: "Type of the content, must be video",
      },
      video: {
        type: "string",
        format: "file-reference",
        description:
          'The video to post as a story. The video must be of the size 720x1280, streamable, encoded with H.265 codec, with key frames added each second in the MPEG4 format, and must not exceed 30 MB. The video can\'t be reused and can only be uploaded as a new file, so you can pass "attach://<file_attach_name>" if the video was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      duration: {
        type: "number",
        description: "Optional. Precise duration of the video in seconds; 0-60",
      },
      cover_frame_timestamp: {
        type: "number",
        description:
          "Optional. Timestamp in seconds of the frame that will be used as the static cover for the story. Defaults to 0.0.",
      },
      is_animation: {
        type: "boolean",
        description: "Optional. Pass True if the video has no sound",
      },
    },
    required: ["type", "video"],
  },
  Sticker: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      type: {
        type: "string",
        description:
          'Type of the sticker, currently one of "regular", "mask", "custom_emoji". The type of the sticker is independent from its format, which is determined by the fields is_animated and is_video.',
      },
      width: {
        type: "integer",
        description: "Sticker width",
      },
      height: {
        type: "integer",
        description: "Sticker height",
      },
      is_animated: {
        type: "boolean",
        description: "True, if the sticker is animated",
      },
      is_video: {
        type: "boolean",
        description: "True, if the sticker is a video sticker",
      },
      thumbnail: {
        type: "ref",
        ref: "PhotoSize",
        description: "Optional. Sticker thumbnail in the .WEBP or .JPG format",
      },
      emoji: {
        type: "string",
        description: "Optional. Emoji associated with the sticker",
      },
      set_name: {
        type: "string",
        description: "Optional. Name of the sticker set to which the sticker belongs",
      },
      premium_animation: {
        type: "ref",
        ref: "File",
        description: "Optional. For premium regular stickers, premium animation for the sticker",
      },
      mask_position: {
        type: "ref",
        ref: "MaskPosition",
        description: "Optional. For mask stickers, the position where the mask should be placed",
      },
      custom_emoji_id: {
        type: "string",
        description: "Optional. For custom emoji stickers, unique identifier of the custom emoji",
      },
      needs_repainting: {
        type: "boolean",
        description:
          "Optional. True, if the sticker must be repainted to a text color in messages, the color of the Telegram Premium badge in emoji status, white color on chat photos, or another appropriate color in other places",
      },
      file_size: {
        type: "integer",
        description: "Optional. File size in bytes",
      },
    },
    required: ["file_id", "file_unique_id", "type", "width", "height", "is_animated", "is_video"],
  },
  StickerSet: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Sticker set name",
      },
      title: {
        type: "string",
        description: "Sticker set title",
      },
      sticker_type: {
        type: "string",
        description: 'Type of stickers in the set, currently one of "regular", "mask", "custom_emoji"',
      },
      stickers: {
        type: "array",
        items: {
          type: "ref",
          ref: "Sticker",
        },
        description: "List of all set stickers",
      },
      thumbnail: {
        type: "ref",
        ref: "PhotoSize",
        description: "Optional. Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format",
      },
    },
    required: ["name", "title", "sticker_type", "stickers"],
  },
  MaskPosition: {
    type: "object",
    properties: {
      point: {
        type: "string",
        description:
          'The part of the face relative to which the mask should be placed. One of "forehead", "eyes", "mouth", or "chin".',
      },
      x_shift: {
        type: "number",
        description:
          "Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position.",
      },
      y_shift: {
        type: "number",
        description:
          "Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position.",
      },
      scale: {
        type: "number",
        description: "Mask scaling coefficient. For example, 2.0 means double size.",
      },
    },
    required: ["point", "x_shift", "y_shift", "scale"],
  },
  InputSticker: {
    type: "object",
    properties: {
      sticker: {
        type: "string",
        format: "file-reference",
        description:
          'The added sticker. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new file using multipart/form-data under <file_attach_name> name. Animated and video stickers can\'t be uploaded via HTTP URL. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      format: {
        type: "string",
        description:
          'Format of the added sticker, must be one of "static" for a .WEBP or .PNG image, "animated" for a .TGS animation, "video" for a .WEBM video',
      },
      emoji_list: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of 1-20 emoji associated with the sticker",
      },
      mask_position: {
        type: "ref",
        ref: "MaskPosition",
        description: 'Optional. Position where the mask should be placed on faces. For "mask" stickers only.',
      },
      keywords: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          'Optional. List of 0-20 search keywords for the sticker with total length of up to 64 characters. For "regular" and "custom_emoji" stickers only.',
      },
    },
    required: ["sticker", "format", "emoji_list"],
  },
  RichMessage: {
    type: "object",
    properties: {
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "RichBlock",
        },
        description: "Content of the message",
      },
      is_rtl: {
        type: "boolean",
        description: "Optional. True, if the rich message must be shown right-to-left",
      },
    },
    required: ["blocks"],
  },
  InputRichMessage: {
    type: "object",
    properties: {
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputRichBlock",
        },
        description: "Optional. Content of the rich message to send described as a list of blocks",
      },
      html: {
        type: "string",
        description:
          "Optional. Content of the rich message to send described using HTML formatting. See rich message formatting options for more details. Use media field to specify the media used in the message.",
      },
      markdown: {
        type: "string",
        description:
          "Optional. Content of the rich message to send described using Markdown formatting. See rich message formatting options for more details. Use media field to specify the media used in the message.",
      },
      media: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputRichMessageMedia",
        },
        description:
          "Optional. List of media that are specified in the markdown or html fields using tg://photo?id=, tg://video?id=, tg://document?id=, and tg://audio?id= links",
      },
      is_rtl: {
        type: "boolean",
        description: "Optional. Pass True if the rich message must be shown right-to-left",
      },
      skip_entity_detection: {
        type: "boolean",
        description:
          "Optional. Pass True to skip automatic detection of entities (e.g., URLs, email addresses, username mentions, hashtags, cashtags, bot commands, or phone numbers) in the text",
      },
    },
    required: [],
  },
  InputRichMessageMedia: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description:
          "Unique identifier of the media used in a tg://photo?id=, tg://video?id=, tg://document?id=, or tg://audio?id= link. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed.",
      },
      media: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InputMediaAnimation",
          },
          {
            type: "ref",
            ref: "InputMediaAudio",
          },
          {
            type: "ref",
            ref: "InputMediaDocument",
          },
          {
            type: "ref",
            ref: "InputMediaPhoto",
          },
          {
            type: "ref",
            ref: "InputMediaVideo",
          },
          {
            type: "ref",
            ref: "InputMediaVoiceNote",
          },
        ],
        description: "The media to be sent. Everything except the media itself and its properties is ignored.",
      },
    },
    required: ["id", "media"],
  },
  RichMessageButton: {
    type: "object",
    properties: {
      text: {
        type: "ref",
        ref: "RichText",
        description:
          "Text of the button. May contain only plain text, RichTextCustomEmoji and RichTextDateTime entities.",
      },
      style: {
        type: "string",
        description:
          'Optional. Style of the button. Must be one of "danger", "success", "primary", or "link" (the button is shown as a regular link without borders). Apps may use theme-specific colors for the button background and text based on the style. The style "link" is allowed only for callback buttons.',
      },
      url: {
        type: "string",
        description:
          "Optional. HTTP or tg:// URL to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings.",
      },
      callback_data: {
        type: "string",
        description: "Optional. Data to be sent in a callback query to the bot when the button is pressed, 1-64 bytes",
      },
      web_app: {
        type: "ref",
        ref: "WebAppInfo",
        description:
          "Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a business account.",
      },
      login_url: {
        type: "ref",
        ref: "LoginUrl",
        description:
          "Optional. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget. Not supported for ephemeral messages.",
      },
      switch_inline_query: {
        type: "string",
        description:
          "Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a business account.",
      },
      switch_inline_query_current_chat: {
        type: "string",
        description:
          "Optional. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a business account.",
      },
      switch_inline_query_chosen_chat: {
        type: "ref",
        ref: "SwitchInlineQueryChosenChat",
        description:
          "Optional. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a business account.",
      },
      copy_text: {
        type: "ref",
        ref: "CopyTextButton",
        description: "Optional. A button that copies the specified text to the clipboard",
      },
      disabled: {
        type: "ref",
        ref: "DisabledButton",
        description: "Optional. If set, then the button is disabled and does nothing",
      },
    },
    required: ["text"],
  },
  RichText: {
    type: "union",
    of: [
      {
        type: "string",
      },
      {
        type: "array",
        items: {
          type: "ref",
          ref: "RichText",
        },
      },
      {
        type: "ref",
        ref: "RichTextBold",
      },
      {
        type: "ref",
        ref: "RichTextItalic",
      },
      {
        type: "ref",
        ref: "RichTextUnderline",
      },
      {
        type: "ref",
        ref: "RichTextStrikethrough",
      },
      {
        type: "ref",
        ref: "RichTextSpoiler",
      },
      {
        type: "ref",
        ref: "RichTextDateTime",
      },
      {
        type: "ref",
        ref: "RichTextTextMention",
      },
      {
        type: "ref",
        ref: "RichTextSubscript",
      },
      {
        type: "ref",
        ref: "RichTextSuperscript",
      },
      {
        type: "ref",
        ref: "RichTextMarked",
      },
      {
        type: "ref",
        ref: "RichTextCode",
      },
      {
        type: "ref",
        ref: "RichTextCustomEmoji",
      },
      {
        type: "ref",
        ref: "RichTextMathematicalExpression",
      },
      {
        type: "ref",
        ref: "RichTextUrl",
      },
      {
        type: "ref",
        ref: "RichTextEmailAddress",
      },
      {
        type: "ref",
        ref: "RichTextPhoneNumber",
      },
      {
        type: "ref",
        ref: "RichTextBankCardNumber",
      },
      {
        type: "ref",
        ref: "RichTextMention",
      },
      {
        type: "ref",
        ref: "RichTextHashtag",
      },
      {
        type: "ref",
        ref: "RichTextCashtag",
      },
      {
        type: "ref",
        ref: "RichTextBotCommand",
      },
      {
        type: "ref",
        ref: "RichTextButton",
      },
      {
        type: "ref",
        ref: "RichTextAnchor",
      },
      {
        type: "ref",
        ref: "RichTextAnchorLink",
      },
      {
        type: "ref",
        ref: "RichTextReference",
      },
      {
        type: "ref",
        ref: "RichTextReferenceLink",
      },
    ],
  },
  RichTextBold: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["bold"],
        description: 'Type of the rich text, always "bold"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
    },
    required: ["type", "text"],
  },
  RichTextItalic: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["italic"],
        description: 'Type of the rich text, always "italic"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
    },
    required: ["type", "text"],
  },
  RichTextUnderline: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["underline"],
        description: 'Type of the rich text, always "underline"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
    },
    required: ["type", "text"],
  },
  RichTextStrikethrough: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["strikethrough"],
        description: 'Type of the rich text, always "strikethrough"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
    },
    required: ["type", "text"],
  },
  RichTextSpoiler: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["spoiler"],
        description: 'Type of the rich text, always "spoiler"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
    },
    required: ["type", "text"],
  },
  RichTextDateTime: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["date_time"],
        description: 'Type of the rich text, always "date_time"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      unix_time: {
        type: "integer",
        description: "The Unix time associated with the entity",
      },
      date_time_format: {
        type: "string",
        description:
          "The string that defines the formatting of the date and time. See date-time entity formatting for more details.",
      },
    },
    required: ["type", "text", "unix_time", "date_time_format"],
  },
  RichTextTextMention: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["text_mention"],
        description: 'Type of the rich text, always "text_mention"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      user: {
        type: "ref",
        ref: "User",
        description: "The mentioned user",
      },
    },
    required: ["type", "text", "user"],
  },
  RichTextSubscript: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["subscript"],
        description: 'Type of the rich text, always "subscript"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
    },
    required: ["type", "text"],
  },
  RichTextSuperscript: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["superscript"],
        description: 'Type of the rich text, always "superscript"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
    },
    required: ["type", "text"],
  },
  RichTextMarked: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["marked"],
        description: 'Type of the rich text, always "marked"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
    },
    required: ["type", "text"],
  },
  RichTextCode: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["code"],
        description: 'Type of the rich text, always "code"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
    },
    required: ["type", "text"],
  },
  RichTextCustomEmoji: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["custom_emoji"],
        description: 'Type of the rich text, always "custom_emoji"',
      },
      custom_emoji_id: {
        type: "string",
        description:
          "Unique identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker.",
      },
      alternative_text: {
        type: "string",
        description: "Alternative emoji for the custom emoji",
      },
    },
    required: ["type", "custom_emoji_id", "alternative_text"],
  },
  RichTextMathematicalExpression: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["mathematical_expression"],
        description: 'Type of the rich text, always "mathematical_expression"',
      },
      expression: {
        type: "string",
        description: "The expression in LaTeX format",
      },
    },
    required: ["type", "expression"],
  },
  RichTextUrl: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["url"],
        description: 'Type of the rich text, always "url"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      url: {
        type: "string",
        description: "URL of the link",
      },
    },
    required: ["type", "text", "url"],
  },
  RichTextEmailAddress: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["email_address"],
        description: 'Type of the rich text, always "email_address"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      email_address: {
        type: "string",
        description: "The email address",
      },
    },
    required: ["type", "text", "email_address"],
  },
  RichTextPhoneNumber: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["phone_number"],
        description: 'Type of the rich text, always "phone_number"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      phone_number: {
        type: "string",
        description: "The phone number",
      },
    },
    required: ["type", "text", "phone_number"],
  },
  RichTextBankCardNumber: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["bank_card_number"],
        description: 'Type of the rich text, always "bank_card_number"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      bank_card_number: {
        type: "string",
        description: "The bank card number",
      },
    },
    required: ["type", "text", "bank_card_number"],
  },
  RichTextMention: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["mention"],
        description: 'Type of the rich text, always "mention"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      username: {
        type: "string",
        description: "The username",
      },
    },
    required: ["type", "text", "username"],
  },
  RichTextHashtag: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["hashtag"],
        description: 'Type of the rich text, always "hashtag"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      hashtag: {
        type: "string",
        description: "The hashtag",
      },
    },
    required: ["type", "text", "hashtag"],
  },
  RichTextCashtag: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["cashtag"],
        description: 'Type of the rich text, always "cashtag"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      cashtag: {
        type: "string",
        description: "The cashtag",
      },
    },
    required: ["type", "text", "cashtag"],
  },
  RichTextBotCommand: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["bot_command"],
        description: 'Type of the rich text, always "bot_command"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The text",
      },
      bot_command: {
        type: "string",
        description: "The bot command",
      },
    },
    required: ["type", "text", "bot_command"],
  },
  RichTextButton: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["button"],
        description: 'Type of the rich text, always "button"',
      },
      button: {
        type: "ref",
        ref: "RichMessageButton",
        description: "The button",
      },
    },
    required: ["type", "button"],
  },
  RichTextAnchor: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["anchor"],
        description: 'Type of the rich text, always "anchor"',
      },
      name: {
        type: "string",
        description: "The name of the anchor",
      },
    },
    required: ["type", "name"],
  },
  RichTextAnchorLink: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["anchor_link"],
        description: 'Type of the rich text, always "anchor_link"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The link text",
      },
      anchor_name: {
        type: "string",
        description:
          "The name of the anchor. If the name is empty, then the link brings back to the top of the message.",
      },
    },
    required: ["type", "text", "anchor_name"],
  },
  RichTextReference: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["reference"],
        description: 'Type of the rich text, always "reference"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the reference",
      },
      name: {
        type: "string",
        description: "The name of the reference",
      },
    },
    required: ["type", "text", "name"],
  },
  RichTextReferenceLink: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["reference_link"],
        description: 'Type of the rich text, always "reference_link"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "The link text",
      },
      reference_name: {
        type: "string",
        description: "The name of the reference",
      },
    },
    required: ["type", "text", "reference_name"],
  },
  RichBlockCaption: {
    type: "object",
    properties: {
      text: {
        type: "ref",
        ref: "RichText",
        description: "Block caption",
      },
      credit: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Block credit which corresponds to the HTML tag <cite>",
      },
    },
    required: ["text"],
  },
  RichBlockTableCell: {
    type: "object",
    properties: {
      text: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Text in the cell. If omitted, then the cell is invisible.",
      },
      is_header: {
        type: "boolean",
        description: "Optional. True, if the cell is a header cell",
      },
      colspan: {
        type: "integer",
        description: "Optional. The number of columns the cell spans if it is bigger than 1",
      },
      rowspan: {
        type: "integer",
        description: "Optional. The number of rows the cell spans if it is bigger than 1",
      },
      align: {
        type: "string",
        description: 'Horizontal cell content alignment. Currently, must be one of "left", "center", or "right".',
      },
      valign: {
        type: "string",
        description: 'Vertical cell content alignment. Currently, must be one of "top", "middle", or "bottom".',
      },
    },
    required: ["align", "valign"],
  },
  RichBlockListItem: {
    type: "object",
    properties: {
      label: {
        type: "string",
        description: "Label of the item",
      },
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "RichBlock",
        },
        description: "The content of the item",
      },
      has_checkbox: {
        type: "boolean",
        description: "Optional. True, if the item has a checkbox",
      },
      is_checked: {
        type: "boolean",
        description: "Optional. True, if the item has a checked checkbox",
      },
      value: {
        type: "integer",
        description: "Optional. For ordered lists, the numeric value of the item label",
      },
      type: {
        type: "string",
        description:
          'Optional. For ordered lists, the type of the item label; must be one of "a" for lowercase letters, "A" for uppercase letters, "i" for lowercase Roman numerals, "I" for uppercase Roman numerals, or "1" for decimal numbers',
      },
    },
    required: ["label", "blocks"],
  },
  RichBlock: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "RichBlockParagraph",
      },
      {
        type: "ref",
        ref: "RichBlockSectionHeading",
      },
      {
        type: "ref",
        ref: "RichBlockPreformatted",
      },
      {
        type: "ref",
        ref: "RichBlockFooter",
      },
      {
        type: "ref",
        ref: "RichBlockDivider",
      },
      {
        type: "ref",
        ref: "RichBlockMathematicalExpression",
      },
      {
        type: "ref",
        ref: "RichBlockAnchor",
      },
      {
        type: "ref",
        ref: "RichBlockList",
      },
      {
        type: "ref",
        ref: "RichBlockBlockQuotation",
      },
      {
        type: "ref",
        ref: "RichBlockExpandableBlockQuotation",
      },
      {
        type: "ref",
        ref: "RichBlockPullQuotation",
      },
      {
        type: "ref",
        ref: "RichBlockCollage",
      },
      {
        type: "ref",
        ref: "RichBlockSlideshow",
      },
      {
        type: "ref",
        ref: "RichBlockTable",
      },
      {
        type: "ref",
        ref: "RichBlockDetails",
      },
      {
        type: "ref",
        ref: "RichBlockMap",
      },
      {
        type: "ref",
        ref: "RichBlockButtons",
      },
      {
        type: "ref",
        ref: "RichBlockAnimation",
      },
      {
        type: "ref",
        ref: "RichBlockAudio",
      },
      {
        type: "ref",
        ref: "RichBlockDocument",
      },
      {
        type: "ref",
        ref: "RichBlockPhoto",
      },
      {
        type: "ref",
        ref: "RichBlockVideo",
      },
      {
        type: "ref",
        ref: "RichBlockVoiceNote",
      },
      {
        type: "ref",
        ref: "RichBlockThinking",
      },
    ],
  },
  RichBlockParagraph: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["paragraph"],
        description: 'Type of the block, always "paragraph"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
    },
    required: ["type", "text"],
  },
  RichBlockSectionHeading: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["heading"],
        description: 'Type of the block, always "heading"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
      size: {
        type: "integer",
        description: "Relative size of the text font; 1-6, 1 is the largest, 6 is the smallest",
      },
    },
    required: ["type", "text", "size"],
  },
  RichBlockPreformatted: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["pre"],
        description: 'Type of the block, always "pre"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
      language: {
        type: "string",
        description: "Optional. The programming language of the text",
      },
    },
    required: ["type", "text"],
  },
  RichBlockFooter: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["footer"],
        description: 'Type of the block, always "footer"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
    },
    required: ["type", "text"],
  },
  RichBlockDivider: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["divider"],
        description: 'Type of the block, always "divider"',
      },
    },
    required: ["type"],
  },
  RichBlockMathematicalExpression: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["mathematical_expression"],
        description: 'Type of the block, always "mathematical_expression"',
      },
      expression: {
        type: "string",
        description: "The mathematical expression in LaTeX format",
      },
    },
    required: ["type", "expression"],
  },
  RichBlockAnchor: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["anchor"],
        description: 'Type of the block, always "anchor"',
      },
      name: {
        type: "string",
        description: "The name of the anchor",
      },
    },
    required: ["type", "name"],
  },
  RichBlockList: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["list"],
        description: 'Type of the block, always "list"',
      },
      items: {
        type: "array",
        items: {
          type: "ref",
          ref: "RichBlockListItem",
        },
        description: "Items of the list",
      },
    },
    required: ["type", "items"],
  },
  RichBlockBlockQuotation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["blockquote"],
        description: 'Type of the block, always "blockquote"',
      },
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "RichBlock",
        },
        description: "Content of the block",
      },
      credit: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Credit of the block",
      },
    },
    required: ["type", "blocks"],
  },
  RichBlockExpandableBlockQuotation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["expandable_blockquote"],
        description: 'Type of the block, always "expandable_blockquote"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Content of the block",
      },
      credit: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Credit of the block",
      },
    },
    required: ["type", "text"],
  },
  RichBlockPullQuotation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["pullquote"],
        description: 'Type of the block, always "pullquote"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
      credit: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Credit of the block",
      },
    },
    required: ["type", "text"],
  },
  RichBlockCollage: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["collage"],
        description: 'Type of the block, always "collage"',
      },
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "RichBlock",
        },
        description: "Elements of the collage",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "blocks"],
  },
  RichBlockSlideshow: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["slideshow"],
        description: 'Type of the block, always "slideshow"',
      },
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "RichBlock",
        },
        description: "Elements of the slideshow",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "blocks"],
  },
  RichBlockTable: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["table"],
        description: 'Type of the block, always "table"',
      },
      cells: {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "ref",
            ref: "RichBlockTableCell",
          },
        },
        description: "Cells of the table",
      },
      is_bordered: {
        type: "boolean",
        description: "Optional. True, if the table has borders",
      },
      is_striped: {
        type: "boolean",
        description: "Optional. True, if the table is striped",
      },
      is_compact: {
        type: "boolean",
        description: "Optional. True, if table cells have smaller indents",
      },
      caption: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Caption of the table",
      },
    },
    required: ["type", "cells"],
  },
  RichBlockDetails: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["details"],
        description: 'Type of the block, always "details"',
      },
      summary: {
        type: "ref",
        ref: "RichText",
        description: "Always shown summary of the block",
      },
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "RichBlock",
        },
        description: "Content of the block",
      },
      is_open: {
        type: "boolean",
        description: "Optional. True, if the content of the block is visible by default",
      },
    },
    required: ["type", "summary", "blocks"],
  },
  RichBlockMap: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["map"],
        description: 'Type of the block, always "map"',
      },
      location: {
        type: "ref",
        ref: "Location",
        description: "Location of the center of the map",
      },
      zoom: {
        type: "integer",
        description: "Map zoom level",
      },
      width: {
        type: "integer",
        description: "Expected width of the map",
      },
      height: {
        type: "integer",
        description: "Expected height of the map",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "location", "zoom", "width", "height"],
  },
  RichBlockButtons: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["buttons"],
        description: 'Type of the block, always "buttons"',
      },
      buttons: {
        type: "array",
        items: {
          type: "ref",
          ref: "RichMessageButton",
        },
        description: "The buttons",
      },
      align: {
        type: "string",
        description:
          'Optional. Horizontal alignment of the buttons. Currently, must be one of "left", "center", or "right".',
      },
    },
    required: ["type", "buttons"],
  },
  RichBlockAnimation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["animation"],
        description: 'Type of the block, always "animation"',
      },
      animation: {
        type: "ref",
        ref: "Animation",
        description: "The animation",
      },
      has_spoiler: {
        type: "boolean",
        description: "Optional. True, if the media preview is covered by a spoiler animation",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "animation"],
  },
  RichBlockAudio: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["audio"],
        description: 'Type of the block, always "audio"',
      },
      audio: {
        type: "ref",
        ref: "Audio",
        description: "The audio",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "audio"],
  },
  RichBlockDocument: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["document"],
        description: 'Type of the block, always "document"',
      },
      document: {
        type: "ref",
        ref: "Document",
        description: "The document",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "document"],
  },
  RichBlockPhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["photo"],
        description: 'Type of the block, always "photo"',
      },
      photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Available sizes of the photo",
      },
      has_spoiler: {
        type: "boolean",
        description: "Optional. True, if the media preview is covered by a spoiler animation",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "photo"],
  },
  RichBlockVideo: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["video"],
        description: 'Type of the block, always "video"',
      },
      video: {
        type: "ref",
        ref: "Video",
        description: "The video",
      },
      has_spoiler: {
        type: "boolean",
        description: "Optional. True, if the media preview is covered by a spoiler animation",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "video"],
  },
  RichBlockVoiceNote: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["voice_note"],
        description: 'Type of the block, always "voice_note"',
      },
      voice_note: {
        type: "ref",
        ref: "Voice",
        description: "The voice note",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "voice_note"],
  },
  RichBlockThinking: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["thinking"],
        description: 'Type of the block, always "thinking"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description:
          "Text of the block. See https://t.me/addemoji/AIActions for examples of custom emoji that are recommended for usage in the block.",
      },
    },
    required: ["type", "text"],
  },
  InputRichBlockListItem: {
    type: "object",
    properties: {
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputRichBlock",
        },
        description: "The content of the item",
      },
      has_checkbox: {
        type: "boolean",
        description: "Optional. Pass True if the item has a checkbox",
      },
      is_checked: {
        type: "boolean",
        description: "Optional. Pass True if the item has a checked checkbox",
      },
      value: {
        type: "integer",
        description: "Optional. For ordered lists, the numeric value of the item label",
      },
      type: {
        type: "string",
        description:
          'Optional. For ordered lists, the type of the item label; must be one of "a" for lowercase letters, "A" for uppercase letters, "i" for lowercase Roman numerals, "I" for uppercase Roman numerals, or "1" for decimal numbers',
      },
    },
    required: ["blocks"],
  },
  InputRichBlock: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "InputRichBlockParagraph",
      },
      {
        type: "ref",
        ref: "InputRichBlockSectionHeading",
      },
      {
        type: "ref",
        ref: "InputRichBlockPreformatted",
      },
      {
        type: "ref",
        ref: "InputRichBlockFooter",
      },
      {
        type: "ref",
        ref: "InputRichBlockDivider",
      },
      {
        type: "ref",
        ref: "InputRichBlockMathematicalExpression",
      },
      {
        type: "ref",
        ref: "InputRichBlockAnchor",
      },
      {
        type: "ref",
        ref: "InputRichBlockList",
      },
      {
        type: "ref",
        ref: "InputRichBlockBlockQuotation",
      },
      {
        type: "ref",
        ref: "InputRichBlockExpandableBlockQuotation",
      },
      {
        type: "ref",
        ref: "InputRichBlockPullQuotation",
      },
      {
        type: "ref",
        ref: "InputRichBlockCollage",
      },
      {
        type: "ref",
        ref: "InputRichBlockSlideshow",
      },
      {
        type: "ref",
        ref: "InputRichBlockTable",
      },
      {
        type: "ref",
        ref: "InputRichBlockDetails",
      },
      {
        type: "ref",
        ref: "InputRichBlockMap",
      },
      {
        type: "ref",
        ref: "InputRichBlockButtons",
      },
      {
        type: "ref",
        ref: "InputRichBlockAnimation",
      },
      {
        type: "ref",
        ref: "InputRichBlockAudio",
      },
      {
        type: "ref",
        ref: "InputRichBlockDocument",
      },
      {
        type: "ref",
        ref: "InputRichBlockPhoto",
      },
      {
        type: "ref",
        ref: "InputRichBlockVideo",
      },
      {
        type: "ref",
        ref: "InputRichBlockVoiceNote",
      },
      {
        type: "ref",
        ref: "InputRichBlockThinking",
      },
    ],
  },
  InputRichBlockParagraph: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["paragraph"],
        description: 'Type of the block, always "paragraph"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
    },
    required: ["type", "text"],
  },
  InputRichBlockSectionHeading: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["heading"],
        description: 'Type of the block, always "heading"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
      size: {
        type: "integer",
        description: "Relative size of the text font; 1-6, 1 is the largest, 6 is the smallest",
      },
    },
    required: ["type", "text", "size"],
  },
  InputRichBlockPreformatted: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["pre"],
        description: 'Type of the block, always "pre"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
      language: {
        type: "string",
        description: "Optional. The programming language of the text",
      },
    },
    required: ["type", "text"],
  },
  InputRichBlockFooter: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["footer"],
        description: 'Type of the block, always "footer"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
    },
    required: ["type", "text"],
  },
  InputRichBlockDivider: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["divider"],
        description: 'Type of the block, always "divider"',
      },
    },
    required: ["type"],
  },
  InputRichBlockMathematicalExpression: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["mathematical_expression"],
        description: 'Type of the block, always "mathematical_expression"',
      },
      expression: {
        type: "string",
        description: "The mathematical expression in LaTeX format",
      },
    },
    required: ["type", "expression"],
  },
  InputRichBlockAnchor: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["anchor"],
        description: 'Type of the block, always "anchor"',
      },
      name: {
        type: "string",
        description: "The name of the anchor",
      },
    },
    required: ["type", "name"],
  },
  InputRichBlockList: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["list"],
        description: 'Type of the block, always "list"',
      },
      items: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputRichBlockListItem",
        },
        description: "Items of the list",
      },
    },
    required: ["type", "items"],
  },
  InputRichBlockBlockQuotation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["blockquote"],
        description: 'Type of the block, always "blockquote"',
      },
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputRichBlock",
        },
        description: "Content of the block",
      },
      credit: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Credit of the block",
      },
    },
    required: ["type", "blocks"],
  },
  InputRichBlockExpandableBlockQuotation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["expandable_blockquote"],
        description: 'Type of the block, always "expandable_blockquote"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Content of the block",
      },
      credit: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Credit of the block",
      },
    },
    required: ["type", "text"],
  },
  InputRichBlockPullQuotation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["pullquote"],
        description: 'Type of the block, always "pullquote"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description: "Text of the block",
      },
      credit: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Credit of the block",
      },
    },
    required: ["type", "text"],
  },
  InputRichBlockCollage: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["collage"],
        description: 'Type of the block, always "collage"',
      },
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputRichBlock",
        },
        description: "Elements of the collage",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "blocks"],
  },
  InputRichBlockSlideshow: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["slideshow"],
        description: 'Type of the block, always "slideshow"',
      },
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputRichBlock",
        },
        description: "Elements of the slideshow",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "blocks"],
  },
  InputRichBlockTable: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["table"],
        description: 'Type of the block, always "table"',
      },
      cells: {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "ref",
            ref: "RichBlockTableCell",
          },
        },
        description: "Cells of the table",
      },
      is_bordered: {
        type: "boolean",
        description: "Optional. Pass True if the table has borders",
      },
      is_striped: {
        type: "boolean",
        description: "Optional. Pass True if the table is striped",
      },
      is_compact: {
        type: "boolean",
        description: "Optional. Pass True if table cells must have smaller indents",
      },
      caption: {
        type: "ref",
        ref: "RichText",
        description: "Optional. Caption of the table",
      },
    },
    required: ["type", "cells"],
  },
  InputRichBlockDetails: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["details"],
        description: 'Type of the block, always "details"',
      },
      summary: {
        type: "ref",
        ref: "RichText",
        description: "Always shown summary of the block",
      },
      blocks: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputRichBlock",
        },
        description: "Content of the block",
      },
      is_open: {
        type: "boolean",
        description: "Optional. Pass True if the content of the block is visible by default",
      },
    },
    required: ["type", "summary", "blocks"],
  },
  InputRichBlockMap: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["map"],
        description: 'Type of the block, always "map"',
      },
      location: {
        type: "ref",
        ref: "Location",
        description: "Location of the center of the map",
      },
      zoom: {
        type: "integer",
        description: "Optional. Map zoom level; 0-24",
      },
      width: {
        type: "integer",
        description: "Optional. Map width; 0-10000",
      },
      height: {
        type: "integer",
        description: "Optional. Map height; 0-10000",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "location"],
  },
  InputRichBlockButtons: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["buttons"],
        description: 'Type of the block, always "buttons"',
      },
      buttons: {
        type: "array",
        items: {
          type: "ref",
          ref: "RichMessageButton",
        },
        description: "List of 1-8 buttons to send",
      },
      align: {
        type: "string",
        description:
          'Optional. Horizontal alignment of the buttons. Currently, must be one of "left", "center", or "right".',
      },
    },
    required: ["type", "buttons"],
  },
  InputRichBlockAnimation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["animation"],
        description: 'Type of the block, always "animation"',
      },
      animation: {
        type: "ref",
        ref: "InputMediaAnimation",
        description: "The animation. Caption is ignored.",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "animation"],
  },
  InputRichBlockAudio: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["audio"],
        description: 'Type of the block, always "audio"',
      },
      audio: {
        type: "ref",
        ref: "InputMediaAudio",
        description: "The audio. Caption is ignored.",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "audio"],
  },
  InputRichBlockDocument: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["document"],
        description: 'Type of the block, always "document"',
      },
      document: {
        type: "ref",
        ref: "InputMediaDocument",
        description: "The document. Caption is ignored.",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "document"],
  },
  InputRichBlockPhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["photo"],
        description: 'Type of the block, always "photo"',
      },
      photo: {
        type: "ref",
        ref: "InputMediaPhoto",
        description: "The photo. Caption is ignored.",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "photo"],
  },
  InputRichBlockVideo: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["video"],
        description: 'Type of the block, always "video"',
      },
      video: {
        type: "ref",
        ref: "InputMediaVideo",
        description: "The video. Caption is ignored.",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "video"],
  },
  InputRichBlockVoiceNote: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["voice_note"],
        description: 'Type of the block, always "voice_note"',
      },
      voice_note: {
        type: "ref",
        ref: "InputMediaVoiceNote",
        description: "The voice note. Caption is ignored.",
      },
      caption: {
        type: "ref",
        ref: "RichBlockCaption",
        description: "Optional. Caption of the block",
      },
    },
    required: ["type", "voice_note"],
  },
  InputRichBlockThinking: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["thinking"],
        description: 'Type of the block, always "thinking"',
      },
      text: {
        type: "ref",
        ref: "RichText",
        description:
          "Text of the block. See https://t.me/addemoji/AIActions for examples of custom emoji that are recommended for usage in the block.",
      },
    },
    required: ["type", "text"],
  },
  InlineQuery: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier for this query",
      },
      from: {
        type: "ref",
        ref: "User",
        description: "Sender",
      },
      query: {
        type: "string",
        description: "Text of the query (up to 256 characters)",
      },
      offset: {
        type: "string",
        description: "Offset of the results to be returned, can be controlled by the bot",
      },
      chat_type: {
        type: "string",
        description:
          'Optional. Type of the chat from which the inline query was sent. Can be either "sender" for a private chat with the inline query sender, "private", "group", "supergroup", or "channel". The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat.',
      },
      location: {
        type: "ref",
        ref: "Location",
        description: "Optional. Sender location, only for bots that request user location",
      },
    },
    required: ["id", "from", "query", "offset"],
  },
  InlineQueryResultsButton: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "Label text on the button",
      },
      web_app: {
        type: "ref",
        ref: "WebAppInfo",
        description:
          "Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to switch back to the inline mode using the method switchInlineQuery inside the Web App.",
      },
      start_parameter: {
        type: "string",
        description:
          "Optional. Deep-linking parameter for the /start message sent to the bot when a user presses the button. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed. Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities.",
      },
    },
    required: ["text"],
  },
  InlineQueryResult: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "InlineQueryResultCachedAudio",
      },
      {
        type: "ref",
        ref: "InlineQueryResultCachedDocument",
      },
      {
        type: "ref",
        ref: "InlineQueryResultCachedGif",
      },
      {
        type: "ref",
        ref: "InlineQueryResultCachedMpeg4Gif",
      },
      {
        type: "ref",
        ref: "InlineQueryResultCachedPhoto",
      },
      {
        type: "ref",
        ref: "InlineQueryResultCachedSticker",
      },
      {
        type: "ref",
        ref: "InlineQueryResultCachedVideo",
      },
      {
        type: "ref",
        ref: "InlineQueryResultCachedVoice",
      },
      {
        type: "ref",
        ref: "InlineQueryResultArticle",
      },
      {
        type: "ref",
        ref: "InlineQueryResultAudio",
      },
      {
        type: "ref",
        ref: "InlineQueryResultContact",
      },
      {
        type: "ref",
        ref: "InlineQueryResultGame",
      },
      {
        type: "ref",
        ref: "InlineQueryResultDocument",
      },
      {
        type: "ref",
        ref: "InlineQueryResultGif",
      },
      {
        type: "ref",
        ref: "InlineQueryResultLocation",
      },
      {
        type: "ref",
        ref: "InlineQueryResultMpeg4Gif",
      },
      {
        type: "ref",
        ref: "InlineQueryResultPhoto",
      },
      {
        type: "ref",
        ref: "InlineQueryResultVenue",
      },
      {
        type: "ref",
        ref: "InlineQueryResultVideo",
      },
      {
        type: "ref",
        ref: "InlineQueryResultVoice",
      },
    ],
  },
  InlineQueryResultArticle: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["article"],
        description: "Type of the result, must be article",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 Bytes",
      },
      title: {
        type: "string",
        description: "Title of the result",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Content of the message to be sent",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      url: {
        type: "string",
        description: "Optional. URL of the result",
      },
      description: {
        type: "string",
        description: "Optional. Short description of the result",
      },
      thumbnail_url: {
        type: "string",
        description: "Optional. Url of the thumbnail for the result",
      },
      thumbnail_width: {
        type: "integer",
        description: "Optional. Thumbnail width",
      },
      thumbnail_height: {
        type: "integer",
        description: "Optional. Thumbnail height",
      },
    },
    required: ["type", "id", "title", "input_message_content"],
  },
  InlineQueryResultPhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["photo"],
        description: "Type of the result, must be photo",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      photo_url: {
        type: "string",
        description: "A valid URL of the photo. Photo must be in JPEG format. Photo size must not exceed 5MB.",
      },
      thumbnail_url: {
        type: "string",
        description: "URL of the thumbnail for the photo",
      },
      photo_width: {
        type: "integer",
        description: "Optional. Width of the photo",
      },
      photo_height: {
        type: "integer",
        description: "Optional. Height of the photo",
      },
      title: {
        type: "string",
        description: "Optional. Title for the result",
      },
      description: {
        type: "string",
        description: "Optional. Short description of the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the photo caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the photo",
      },
    },
    required: ["type", "id", "photo_url", "thumbnail_url"],
  },
  InlineQueryResultGif: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["gif"],
        description: "Type of the result, must be gif",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      gif_url: {
        type: "string",
        description: "A valid URL for the GIF file",
      },
      gif_width: {
        type: "integer",
        description: "Optional. Width of the GIF",
      },
      gif_height: {
        type: "integer",
        description: "Optional. Height of the GIF",
      },
      gif_duration: {
        type: "integer",
        description: "Optional. Duration of the GIF in seconds",
      },
      thumbnail_url: {
        type: "string",
        description: "URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result",
      },
      thumbnail_mime_type: {
        type: "string",
        description:
          'Optional. MIME type of the thumbnail, must be one of "image/jpeg", "image/gif", or "video/mp4". Defaults to "image/jpeg".',
      },
      title: {
        type: "string",
        description: "Optional. Title for the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Optional. Mode for parsing entities in the caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the GIF animation",
      },
    },
    required: ["type", "id", "gif_url", "thumbnail_url"],
  },
  InlineQueryResultMpeg4Gif: {
    type: "object",
    properties: {
      type: {
        type: "string",
        description: "Type of the result, must be mpeg4_gif",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      mpeg4_url: {
        type: "string",
        description: "A valid URL for the MPEG4 file",
      },
      mpeg4_width: {
        type: "integer",
        description: "Optional. Video width",
      },
      mpeg4_height: {
        type: "integer",
        description: "Optional. Video height",
      },
      mpeg4_duration: {
        type: "integer",
        description: "Optional. Video duration in seconds",
      },
      thumbnail_url: {
        type: "string",
        description: "URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result",
      },
      thumbnail_mime_type: {
        type: "string",
        description:
          'Optional. MIME type of the thumbnail, must be one of "image/jpeg", "image/gif", or "video/mp4". Defaults to "image/jpeg".',
      },
      title: {
        type: "string",
        description: "Optional. Title for the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Optional. Mode for parsing entities in the caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the video animation",
      },
    },
    required: ["type", "id", "mpeg4_url", "thumbnail_url"],
  },
  InlineQueryResultVideo: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["video"],
        description: "Type of the result, must be video",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      video_url: {
        type: "string",
        description: "A valid URL for the embedded video player or video file",
      },
      mime_type: {
        type: "string",
        description: 'MIME type of the content of the video URL, "text/html" or "video/mp4"',
      },
      thumbnail_url: {
        type: "string",
        description: "URL of the thumbnail (JPEG only) for the video",
      },
      title: {
        type: "string",
        description: "Title for the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the video to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the video caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      video_width: {
        type: "integer",
        description: "Optional. Video width",
      },
      video_height: {
        type: "integer",
        description: "Optional. Video height",
      },
      video_duration: {
        type: "integer",
        description: "Optional. Video duration in seconds",
      },
      description: {
        type: "string",
        description: "Optional. Short description of the result",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description:
          "Optional. Content of the message to be sent instead of the video. This field is required if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video).",
      },
    },
    required: ["type", "id", "video_url", "mime_type", "thumbnail_url", "title"],
  },
  InlineQueryResultAudio: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["audio"],
        description: "Type of the result, must be audio",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      audio_url: {
        type: "string",
        description: "A valid URL for the audio file",
      },
      title: {
        type: "string",
        description: "Title",
      },
      caption: {
        type: "string",
        description: "Optional. Caption, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the audio caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      performer: {
        type: "string",
        description: "Optional. Performer",
      },
      audio_duration: {
        type: "integer",
        description: "Optional. Audio duration in seconds",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the audio",
      },
    },
    required: ["type", "id", "audio_url", "title"],
  },
  InlineQueryResultVoice: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["voice"],
        description: "Type of the result, must be voice",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      voice_url: {
        type: "string",
        description: "A valid URL for the voice recording",
      },
      title: {
        type: "string",
        description: "Recording title",
      },
      caption: {
        type: "string",
        description: "Optional. Caption, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      voice_duration: {
        type: "integer",
        description: "Optional. Recording duration in seconds",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the voice recording",
      },
    },
    required: ["type", "id", "voice_url", "title"],
  },
  InlineQueryResultDocument: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["document"],
        description: "Type of the result, must be document",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      title: {
        type: "string",
        description: "Title for the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the document to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the document caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      document_url: {
        type: "string",
        description: "A valid URL for the file",
      },
      mime_type: {
        type: "string",
        description: 'MIME type of the content of the file, either "application/pdf" or "application/zip"',
      },
      description: {
        type: "string",
        description: "Optional. Short description of the result",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the file",
      },
      thumbnail_url: {
        type: "string",
        description: "Optional. URL of the thumbnail (JPEG only) for the file",
      },
      thumbnail_width: {
        type: "integer",
        description: "Optional. Thumbnail width",
      },
      thumbnail_height: {
        type: "integer",
        description: "Optional. Thumbnail height",
      },
    },
    required: ["type", "id", "title", "document_url", "mime_type"],
  },
  InlineQueryResultLocation: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["location"],
        description: "Type of the result, must be location",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 Bytes",
      },
      latitude: {
        type: "number",
        description: "Location latitude in degrees",
      },
      longitude: {
        type: "number",
        description: "Location longitude in degrees",
      },
      title: {
        type: "string",
        description: "Location title",
      },
      horizontal_accuracy: {
        type: "number",
        description: "Optional. The radius of uncertainty for the location, measured in meters; 0-1500",
      },
      live_period: {
        type: "integer",
        description:
          "Optional. Period in seconds during which the location can be updated, must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely",
      },
      heading: {
        type: "integer",
        description:
          "Optional. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.",
      },
      proximity_alert_radius: {
        type: "integer",
        description:
          "Optional. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the location",
      },
      thumbnail_url: {
        type: "string",
        description: "Optional. Url of the thumbnail for the result",
      },
      thumbnail_width: {
        type: "integer",
        description: "Optional. Thumbnail width",
      },
      thumbnail_height: {
        type: "integer",
        description: "Optional. Thumbnail height",
      },
    },
    required: ["type", "id", "latitude", "longitude", "title"],
  },
  InlineQueryResultVenue: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["venue"],
        description: "Type of the result, must be venue",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 Bytes",
      },
      latitude: {
        type: "number",
        description: "Latitude of the venue location in degrees",
      },
      longitude: {
        type: "number",
        description: "Longitude of the venue location in degrees",
      },
      title: {
        type: "string",
        description: "Title of the venue",
      },
      address: {
        type: "string",
        description: "Address of the venue",
      },
      foursquare_id: {
        type: "string",
        description: "Optional. Foursquare identifier of the venue if known",
      },
      foursquare_type: {
        type: "string",
        description:
          'Optional. Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)',
      },
      google_place_id: {
        type: "string",
        description: "Optional. Google Places identifier of the venue",
      },
      google_place_type: {
        type: "string",
        description: "Optional. Google Places type of the venue. (See supported types.)",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the venue",
      },
      thumbnail_url: {
        type: "string",
        description: "Optional. Url of the thumbnail for the result",
      },
      thumbnail_width: {
        type: "integer",
        description: "Optional. Thumbnail width",
      },
      thumbnail_height: {
        type: "integer",
        description: "Optional. Thumbnail height",
      },
    },
    required: ["type", "id", "latitude", "longitude", "title", "address"],
  },
  InlineQueryResultContact: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["contact"],
        description: "Type of the result, must be contact",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 Bytes",
      },
      phone_number: {
        type: "string",
        description: "Contact's phone number",
      },
      first_name: {
        type: "string",
        description: "Contact's first name",
      },
      last_name: {
        type: "string",
        description: "Optional. Contact's last name",
      },
      vcard: {
        type: "string",
        description: "Optional. Additional data about the contact in the form of a vCard, 0-2048 bytes",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the contact",
      },
      thumbnail_url: {
        type: "string",
        description: "Optional. Url of the thumbnail for the result",
      },
      thumbnail_width: {
        type: "integer",
        description: "Optional. Thumbnail width",
      },
      thumbnail_height: {
        type: "integer",
        description: "Optional. Thumbnail height",
      },
    },
    required: ["type", "id", "phone_number", "first_name"],
  },
  InlineQueryResultGame: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["game"],
        description: "Type of the result, must be game",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      game_short_name: {
        type: "string",
        description: "Short name of the game",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
    },
    required: ["type", "id", "game_short_name"],
  },
  InlineQueryResultCachedPhoto: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["photo"],
        description: "Type of the result, must be photo",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      photo_file_id: {
        type: "string",
        description: "A valid file identifier of the photo",
      },
      title: {
        type: "string",
        description: "Optional. Title for the result",
      },
      description: {
        type: "string",
        description: "Optional. Short description of the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the photo caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the photo",
      },
    },
    required: ["type", "id", "photo_file_id"],
  },
  InlineQueryResultCachedGif: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["gif"],
        description: "Type of the result, must be gif",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      gif_file_id: {
        type: "string",
        description: "A valid file identifier for the GIF file",
      },
      title: {
        type: "string",
        description: "Optional. Title for the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Optional. Mode for parsing entities in the caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the GIF animation",
      },
    },
    required: ["type", "id", "gif_file_id"],
  },
  InlineQueryResultCachedMpeg4Gif: {
    type: "object",
    properties: {
      type: {
        type: "string",
        description: "Type of the result, must be mpeg4_gif",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      mpeg4_file_id: {
        type: "string",
        description: "A valid file identifier for the MPEG4 file",
      },
      title: {
        type: "string",
        description: "Optional. Title for the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Optional. Mode for parsing entities in the caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the video animation",
      },
    },
    required: ["type", "id", "mpeg4_file_id"],
  },
  InlineQueryResultCachedSticker: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["sticker"],
        description: "Type of the result, must be sticker",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      sticker_file_id: {
        type: "string",
        description: "A valid file identifier of the sticker",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the sticker",
      },
    },
    required: ["type", "id", "sticker_file_id"],
  },
  InlineQueryResultCachedDocument: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["document"],
        description: "Type of the result, must be document",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      title: {
        type: "string",
        description: "Title for the result",
      },
      document_file_id: {
        type: "string",
        description: "A valid file identifier for the file",
      },
      description: {
        type: "string",
        description: "Optional. Short description of the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the document to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the document caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the file",
      },
    },
    required: ["type", "id", "title", "document_file_id"],
  },
  InlineQueryResultCachedVideo: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["video"],
        description: "Type of the result, must be video",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      video_file_id: {
        type: "string",
        description: "A valid file identifier for the video file",
      },
      title: {
        type: "string",
        description: "Title for the result",
      },
      description: {
        type: "string",
        description: "Optional. Short description of the result",
      },
      caption: {
        type: "string",
        description: "Optional. Caption of the video to be sent, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the video caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Optional. Pass True if the caption must be shown above the message media",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the video",
      },
    },
    required: ["type", "id", "video_file_id", "title"],
  },
  InlineQueryResultCachedVoice: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["voice"],
        description: "Type of the result, must be voice",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      voice_file_id: {
        type: "string",
        description: "A valid file identifier for the voice message",
      },
      title: {
        type: "string",
        description: "Voice message title",
      },
      caption: {
        type: "string",
        description: "Optional. Caption, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the voice message",
      },
    },
    required: ["type", "id", "voice_file_id", "title"],
  },
  InlineQueryResultCachedAudio: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["audio"],
        description: "Type of the result, must be audio",
      },
      id: {
        type: "string",
        description: "Unique identifier for this result, 1-64 bytes",
      },
      audio_file_id: {
        type: "string",
        description: "A valid file identifier for the audio file",
      },
      caption: {
        type: "string",
        description: "Optional. Caption, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the audio caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "Optional. Inline keyboard attached to the message",
      },
      input_message_content: {
        type: "ref",
        ref: "InputMessageContent",
        description: "Optional. Content of the message to be sent instead of the audio",
      },
    },
    required: ["type", "id", "audio_file_id"],
  },
  InputMessageContent: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "InputTextMessageContent",
      },
      {
        type: "ref",
        ref: "InputRichMessageContent",
      },
      {
        type: "ref",
        ref: "InputLocationMessageContent",
      },
      {
        type: "ref",
        ref: "InputVenueMessageContent",
      },
      {
        type: "ref",
        ref: "InputContactMessageContent",
      },
      {
        type: "ref",
        ref: "InputInvoiceMessageContent",
      },
    ],
  },
  InputTextMessageContent: {
    type: "object",
    properties: {
      message_text: {
        type: "string",
        description: "Text of the message to be sent, 1-4096 characters",
      },
      parse_mode: {
        type: "string",
        description:
          "Optional. Mode for parsing entities in the message text. See formatting options for more details.",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "Optional. List of special entities that appear in message text, which can be specified instead of parse_mode",
      },
      link_preview_options: {
        type: "ref",
        ref: "LinkPreviewOptions",
        description: "Optional. Link preview generation options for the message",
      },
    },
    required: ["message_text"],
  },
  InputRichMessageContent: {
    type: "object",
    properties: {
      rich_message: {
        type: "ref",
        ref: "InputRichMessage",
        description: "The message to be sent. Only previously uploaded files may be used in the message.",
      },
    },
    required: ["rich_message"],
  },
  InputLocationMessageContent: {
    type: "object",
    properties: {
      latitude: {
        type: "number",
        description: "Latitude of the location in degrees",
      },
      longitude: {
        type: "number",
        description: "Longitude of the location in degrees",
      },
      horizontal_accuracy: {
        type: "number",
        description: "Optional. The radius of uncertainty for the location, measured in meters; 0-1500",
      },
      live_period: {
        type: "integer",
        description:
          "Optional. Period in seconds during which the location can be updated, must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely",
      },
      heading: {
        type: "integer",
        description:
          "Optional. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.",
      },
      proximity_alert_radius: {
        type: "integer",
        description:
          "Optional. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.",
      },
    },
    required: ["latitude", "longitude"],
  },
  InputVenueMessageContent: {
    type: "object",
    properties: {
      latitude: {
        type: "number",
        description: "Latitude of the venue in degrees",
      },
      longitude: {
        type: "number",
        description: "Longitude of the venue in degrees",
      },
      title: {
        type: "string",
        description: "Name of the venue",
      },
      address: {
        type: "string",
        description: "Address of the venue",
      },
      foursquare_id: {
        type: "string",
        description: "Optional. Foursquare identifier of the venue, if known",
      },
      foursquare_type: {
        type: "string",
        description:
          'Optional. Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)',
      },
      google_place_id: {
        type: "string",
        description: "Optional. Google Places identifier of the venue",
      },
      google_place_type: {
        type: "string",
        description: "Optional. Google Places type of the venue. (See supported types.)",
      },
    },
    required: ["latitude", "longitude", "title", "address"],
  },
  InputContactMessageContent: {
    type: "object",
    properties: {
      phone_number: {
        type: "string",
        description: "Contact's phone number",
      },
      first_name: {
        type: "string",
        description: "Contact's first name",
      },
      last_name: {
        type: "string",
        description: "Optional. Contact's last name",
      },
      vcard: {
        type: "string",
        description: "Optional. Additional data about the contact in the form of a vCard, 0-2048 bytes",
      },
    },
    required: ["phone_number", "first_name"],
  },
  InputInvoiceMessageContent: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Product name, 1-32 characters",
      },
      description: {
        type: "string",
        description: "Product description, 1-255 characters",
      },
      payload: {
        type: "string",
        description:
          "Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.",
      },
      provider_token: {
        type: "string",
        description:
          "Optional. Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.",
        sensitive: true,
      },
      currency: {
        type: "string",
        description:
          'Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars.',
      },
      prices: {
        type: "array",
        items: {
          type: "ref",
          ref: "LabeledPrice",
        },
        description:
          "Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.",
      },
      max_tip_amount: {
        type: "integer",
        description:
          "Optional. The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.",
      },
      suggested_tip_amounts: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "Optional. A JSON-serialized Array of suggested amounts of tip in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.",
      },
      provider_data: {
        type: "string",
        description:
          "Optional. A JSON-serialized object for data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider.",
      },
      photo_url: {
        type: "string",
        description:
          "Optional. URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.",
      },
      photo_size: {
        type: "integer",
        description: "Optional. Photo size in bytes",
      },
      photo_width: {
        type: "integer",
        description: "Optional. Photo width",
      },
      photo_height: {
        type: "integer",
        description: "Optional. Photo height",
      },
      need_name: {
        type: "boolean",
        description:
          "Optional. Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.",
      },
      need_phone_number: {
        type: "boolean",
        description:
          "Optional. Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.",
      },
      need_email: {
        type: "boolean",
        description:
          "Optional. Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.",
      },
      need_shipping_address: {
        type: "boolean",
        description:
          "Optional. Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.",
      },
      send_phone_number_to_provider: {
        type: "boolean",
        description:
          "Optional. Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.",
      },
      send_email_to_provider: {
        type: "boolean",
        description:
          "Optional. Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.",
      },
      is_flexible: {
        type: "boolean",
        description:
          "Optional. Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.",
      },
    },
    required: ["title", "description", "payload", "currency", "prices"],
  },
  ChosenInlineResult: {
    type: "object",
    properties: {
      result_id: {
        type: "string",
        description: "The unique identifier for the result that was chosen",
      },
      from: {
        type: "ref",
        ref: "User",
        description: "The user that chose the result",
      },
      location: {
        type: "ref",
        ref: "Location",
        description: "Optional. Sender location, only for bots that require user location",
      },
      inline_message_id: {
        type: "string",
        description:
          "Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. Will be also received in callback queries and can be used to edit the message.",
      },
      query: {
        type: "string",
        description: "The query that was used to obtain the result",
      },
    },
    required: ["result_id", "from", "query"],
  },
  LabeledPrice: {
    type: "object",
    properties: {
      label: {
        type: "string",
        description: "Portion label",
      },
      amount: {
        type: "integer",
        description:
          "Price of the product in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).",
      },
    },
    required: ["label", "amount"],
  },
  Invoice: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Product name",
      },
      description: {
        type: "string",
        description: "Product description",
      },
      start_parameter: {
        type: "string",
        description: "Unique bot deep-linking parameter that can be used to generate this invoice",
      },
      currency: {
        type: "string",
        description: 'Three-letter ISO 4217 currency code, or "XTR" for payments in Telegram Stars',
      },
      total_amount: {
        type: "integer",
        description:
          "Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).",
      },
    },
    required: ["title", "description", "start_parameter", "currency", "total_amount"],
  },
  ShippingAddress: {
    type: "object",
    properties: {
      country_code: {
        type: "string",
        description: "Two-letter ISO 3166-1 alpha-2 country code",
      },
      state: {
        type: "string",
        description: "State, if applicable",
      },
      city: {
        type: "string",
        description: "City",
      },
      street_line1: {
        type: "string",
        description: "First line for the address",
      },
      street_line2: {
        type: "string",
        description: "Second line for the address",
      },
      post_code: {
        type: "string",
        description: "Address post code",
      },
    },
    required: ["country_code", "state", "city", "street_line1", "street_line2", "post_code"],
  },
  OrderInfo: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Optional. User name",
      },
      phone_number: {
        type: "string",
        description: "Optional. User's phone number",
      },
      email: {
        type: "string",
        description: "Optional. User email",
      },
      shipping_address: {
        type: "ref",
        ref: "ShippingAddress",
        description: "Optional. User shipping address",
      },
    },
    required: [],
  },
  ShippingOption: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Shipping option identifier",
      },
      title: {
        type: "string",
        description: "Option title",
      },
      prices: {
        type: "array",
        items: {
          type: "ref",
          ref: "LabeledPrice",
        },
        description: "List of price portions",
      },
    },
    required: ["id", "title", "prices"],
  },
  SuccessfulPayment: {
    type: "object",
    properties: {
      currency: {
        type: "string",
        description: 'Three-letter ISO 4217 currency code, or "XTR" for payments in Telegram Stars',
      },
      total_amount: {
        type: "integer",
        description:
          "Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).",
      },
      invoice_payload: {
        type: "string",
        description: "Bot-specified invoice payload",
      },
      subscription_expiration_date: {
        type: "integer",
        description: "Optional. Expiration date of the subscription, in Unix time; for recurring payments only",
      },
      is_recurring: {
        type: "boolean",
        description: "Optional. True, if the payment is a recurring payment for a subscription",
      },
      is_first_recurring: {
        type: "boolean",
        description: "Optional. True, if the payment is the first payment for a subscription",
      },
      shipping_option_id: {
        type: "string",
        description: "Optional. Identifier of the shipping option chosen by the user",
      },
      order_info: {
        type: "ref",
        ref: "OrderInfo",
        description: "Optional. Order information provided by the user",
      },
      telegram_payment_charge_id: {
        type: "string",
        description: "Telegram payment identifier",
      },
      provider_payment_charge_id: {
        type: "string",
        description: "Provider payment identifier",
      },
    },
    required: [
      "currency",
      "total_amount",
      "invoice_payload",
      "telegram_payment_charge_id",
      "provider_payment_charge_id",
    ],
  },
  RefundedPayment: {
    type: "object",
    properties: {
      currency: {
        type: "string",
        description:
          'Three-letter ISO 4217 currency code, or "XTR" for payments in Telegram Stars. Currently, always "XTR".',
      },
      total_amount: {
        type: "integer",
        description:
          "Total refunded price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45, total_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).",
      },
      invoice_payload: {
        type: "string",
        description: "Bot-specified invoice payload",
      },
      telegram_payment_charge_id: {
        type: "string",
        description: "Telegram payment identifier",
      },
      provider_payment_charge_id: {
        type: "string",
        description: "Optional. Provider payment identifier",
      },
    },
    required: ["currency", "total_amount", "invoice_payload", "telegram_payment_charge_id"],
  },
  ShippingQuery: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique query identifier",
      },
      from: {
        type: "ref",
        ref: "User",
        description: "User who sent the query",
      },
      invoice_payload: {
        type: "string",
        description: "Bot-specified invoice payload",
      },
      shipping_address: {
        type: "ref",
        ref: "ShippingAddress",
        description: "User specified shipping address",
      },
    },
    required: ["id", "from", "invoice_payload", "shipping_address"],
  },
  PreCheckoutQuery: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique query identifier",
      },
      from: {
        type: "ref",
        ref: "User",
        description: "User who sent the query",
      },
      currency: {
        type: "string",
        description: 'Three-letter ISO 4217 currency code, or "XTR" for payments in Telegram Stars',
      },
      total_amount: {
        type: "integer",
        description:
          "Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).",
      },
      invoice_payload: {
        type: "string",
        description: "Bot-specified invoice payload",
      },
      shipping_option_id: {
        type: "string",
        description: "Optional. Identifier of the shipping option chosen by the user",
      },
      order_info: {
        type: "ref",
        ref: "OrderInfo",
        description: "Optional. Order information provided by the user",
      },
    },
    required: ["id", "from", "currency", "total_amount", "invoice_payload"],
  },
  PaidMediaPurchased: {
    type: "object",
    properties: {
      from: {
        type: "ref",
        ref: "User",
        description: "User who purchased the media",
      },
      paid_media_payload: {
        type: "string",
        description: "Bot-specified paid media payload",
      },
    },
    required: ["from", "paid_media_payload"],
  },
  RevenueWithdrawalState: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "RevenueWithdrawalStatePending",
      },
      {
        type: "ref",
        ref: "RevenueWithdrawalStateSucceeded",
      },
      {
        type: "ref",
        ref: "RevenueWithdrawalStateFailed",
      },
    ],
  },
  RevenueWithdrawalStatePending: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["pending"],
        description: 'Type of the state, always "pending"',
      },
    },
    required: ["type"],
  },
  RevenueWithdrawalStateSucceeded: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["succeeded"],
        description: 'Type of the state, always "succeeded"',
      },
      date: {
        type: "integer",
        description: "Date the withdrawal was completed in Unix time",
      },
      url: {
        type: "string",
        description: "An HTTPS URL that can be used to see transaction details",
      },
    },
    required: ["type", "date", "url"],
  },
  RevenueWithdrawalStateFailed: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["failed"],
        description: 'Type of the state, always "failed"',
      },
    },
    required: ["type"],
  },
  AffiliateInfo: {
    type: "object",
    properties: {
      affiliate_user: {
        type: "ref",
        ref: "User",
        description:
          "Optional. The bot or the user that received an affiliate commission if it was received by a bot or a user",
      },
      affiliate_chat: {
        type: "ref",
        ref: "Chat",
        description: "Optional. The chat that received an affiliate commission if it was received by a chat",
      },
      commission_per_mille: {
        type: "integer",
        description:
          "The number of Telegram Stars received by the affiliate for each 1000 Telegram Stars received by the bot from referred users",
      },
      amount: {
        type: "integer",
        description:
          "Integer amount of Telegram Stars received by the affiliate from the transaction, rounded to 0; can be negative for refunds",
      },
      nanostar_amount: {
        type: "integer",
        description:
          "Optional. The number of 1/1000000000 shares of Telegram Stars received by the affiliate; from -999999999 to 999999999; can be negative for refunds",
      },
    },
    required: ["commission_per_mille", "amount"],
  },
  TransactionPartner: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "TransactionPartnerUser",
      },
      {
        type: "ref",
        ref: "TransactionPartnerChat",
      },
      {
        type: "ref",
        ref: "TransactionPartnerAffiliateProgram",
      },
      {
        type: "ref",
        ref: "TransactionPartnerFragment",
      },
      {
        type: "ref",
        ref: "TransactionPartnerTelegramAds",
      },
      {
        type: "ref",
        ref: "TransactionPartnerTelegramApi",
      },
      {
        type: "ref",
        ref: "TransactionPartnerOther",
      },
    ],
  },
  TransactionPartnerUser: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["user"],
        description: 'Type of the transaction partner, always "user"',
      },
      transaction_type: {
        type: "string",
        description:
          'Type of the transaction, currently one of "invoice_payment" for payments via invoices, "paid_media_payment" for payments for paid media, "gift_purchase" for gifts sent by the bot, "premium_purchase" for Telegram Premium subscriptions gifted by the bot, "business_account_transfer" for direct transfers from managed business accounts',
      },
      user: {
        type: "ref",
        ref: "User",
        description: "Information about the user",
      },
      affiliate: {
        type: "ref",
        ref: "AffiliateInfo",
        description:
          'Optional. Information about the affiliate that received a commission via this transaction. Can be available only for "invoice_payment" and "paid_media_payment" transactions.',
      },
      invoice_payload: {
        type: "string",
        description:
          'Optional. Bot-specified invoice payload. Can be available only for "invoice_payment" transactions.',
      },
      subscription_period: {
        type: "integer",
        description:
          'Optional. The duration of the paid subscription. Can be available only for "invoice_payment" transactions.',
      },
      paid_media: {
        type: "array",
        items: {
          type: "ref",
          ref: "PaidMedia",
        },
        description:
          'Optional. Information about the paid media bought by the user; for "paid_media_payment" transactions only',
      },
      paid_media_payload: {
        type: "string",
        description:
          'Optional. Bot-specified paid media payload. Can be available only for "paid_media_payment" transactions.',
      },
      gift: {
        type: "ref",
        ref: "Gift",
        description: 'Optional. The gift sent to the user by the bot; for "gift_purchase" transactions only',
      },
      premium_subscription_duration: {
        type: "integer",
        description:
          'Optional. Number of months the gifted Telegram Premium subscription will be active for; for "premium_purchase" transactions only',
      },
    },
    required: ["type", "transaction_type", "user"],
  },
  TransactionPartnerChat: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["chat"],
        description: 'Type of the transaction partner, always "chat"',
      },
      chat: {
        type: "ref",
        ref: "Chat",
        description: "Information about the chat",
      },
      gift: {
        type: "ref",
        ref: "Gift",
        description: "Optional. The gift sent to the chat by the bot",
      },
    },
    required: ["type", "chat"],
  },
  TransactionPartnerAffiliateProgram: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["affiliate_program"],
        description: 'Type of the transaction partner, always "affiliate_program"',
      },
      sponsor_user: {
        type: "ref",
        ref: "User",
        description: "Optional. Information about the bot that sponsored the affiliate program",
      },
      commission_per_mille: {
        type: "integer",
        description:
          "The number of Telegram Stars received by the bot for each 1000 Telegram Stars received by the affiliate program sponsor from referred users",
      },
    },
    required: ["type", "commission_per_mille"],
  },
  TransactionPartnerFragment: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["fragment"],
        description: 'Type of the transaction partner, always "fragment"',
      },
      withdrawal_state: {
        type: "ref",
        ref: "RevenueWithdrawalState",
        description: "Optional. State of the transaction if the transaction is outgoing",
      },
    },
    required: ["type"],
  },
  TransactionPartnerTelegramAds: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["telegram_ads"],
        description: 'Type of the transaction partner, always "telegram_ads"',
      },
    },
    required: ["type"],
  },
  TransactionPartnerTelegramApi: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["telegram_api"],
        description: 'Type of the transaction partner, always "telegram_api"',
      },
      request_count: {
        type: "integer",
        description: "The number of successful requests that exceeded regular limits and were therefore billed",
      },
    },
    required: ["type", "request_count"],
  },
  TransactionPartnerOther: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["other"],
        description: 'Type of the transaction partner, always "other"',
      },
    },
    required: ["type"],
  },
  StarTransaction: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description:
          "Unique identifier of the transaction. Coincides with the identifier of the original transaction for refund transactions. Coincides with SuccessfulPayment.telegram_payment_charge_id for successful incoming payments from users.",
      },
      amount: {
        type: "integer",
        description: "Integer amount of Telegram Stars transferred by the transaction",
      },
      nanostar_amount: {
        type: "integer",
        description:
          "Optional. The number of 1/1000000000 shares of Telegram Stars transferred by the transaction; from 0 to 999999999",
      },
      date: {
        type: "integer",
        description: "Date the transaction was created in Unix time",
      },
      source: {
        type: "ref",
        ref: "TransactionPartner",
        description:
          "Optional. Source of an incoming transaction (e.g., a user purchasing goods or services, Fragment refunding a failed withdrawal). Only for incoming transactions.",
      },
      receiver: {
        type: "ref",
        ref: "TransactionPartner",
        description:
          "Optional. Receiver of an outgoing transaction (e.g., a user for a purchase refund, Fragment for a withdrawal). Only for outgoing transactions.",
      },
    },
    required: ["id", "amount", "date"],
  },
  StarTransactions: {
    type: "object",
    properties: {
      transactions: {
        type: "array",
        items: {
          type: "ref",
          ref: "StarTransaction",
        },
        description: "The list of transactions",
      },
    },
    required: ["transactions"],
  },
  PassportData: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "ref",
          ref: "EncryptedPassportElement",
        },
        description:
          "Array with information about documents and other Telegram Passport elements that was shared with the bot",
      },
      credentials: {
        type: "ref",
        ref: "EncryptedCredentials",
        description: "Encrypted credentials required to decrypt the data",
      },
    },
    required: ["data", "credentials"],
  },
  PassportFile: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "Identifier for this file, which can be used to download or reuse the file",
      },
      file_unique_id: {
        type: "string",
        description:
          "Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.",
      },
      file_size: {
        type: "integer",
        description: "File size in bytes",
      },
      file_date: {
        type: "integer",
        description: "Unix time when the file was uploaded",
      },
    },
    required: ["file_id", "file_unique_id", "file_size", "file_date"],
  },
  EncryptedPassportElement: {
    type: "object",
    properties: {
      type: {
        type: "string",
        description:
          'Element type. One of "personal_details", "passport", "driver_license", "identity_card", "internal_passport", "address", "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration", "phone_number", "email".',
      },
      data: {
        type: "string",
        description:
          'Optional. Base64-encoded encrypted Telegram Passport element data provided by the user; available only for "personal_details", "passport", "driver_license", "identity_card", "internal_passport" and "address" types. Can be decrypted and verified using the accompanying EncryptedCredentials.',
      },
      phone_number: {
        type: "string",
        description: 'Optional. User\'s verified phone number; available only for "phone_number" type',
      },
      email: {
        type: "string",
        description: 'Optional. User\'s verified email address; available only for "email" type',
      },
      files: {
        type: "array",
        items: {
          type: "ref",
          ref: "PassportFile",
        },
        description:
          'Optional. Array of encrypted files with documents provided by the user; available only for "utility_bill", "bank_statement", "rental_agreement", "passport_registration" and "temporary_registration" types. Files can be decrypted and verified using the accompanying EncryptedCredentials.',
      },
      front_side: {
        type: "ref",
        ref: "PassportFile",
        description:
          'Optional. Encrypted file with the front side of the document, provided by the user; available only for "passport", "driver_license", "identity_card" and "internal_passport". The file can be decrypted and verified using the accompanying EncryptedCredentials.',
      },
      reverse_side: {
        type: "ref",
        ref: "PassportFile",
        description:
          'Optional. Encrypted file with the reverse side of the document, provided by the user; available only for "driver_license" and "identity_card". The file can be decrypted and verified using the accompanying EncryptedCredentials.',
      },
      selfie: {
        type: "ref",
        ref: "PassportFile",
        description:
          'Optional. Encrypted file with the selfie of the user holding a document, provided by the user; available if requested for "passport", "driver_license", "identity_card" and "internal_passport". The file can be decrypted and verified using the accompanying EncryptedCredentials.',
      },
      translation: {
        type: "array",
        items: {
          type: "ref",
          ref: "PassportFile",
        },
        description:
          'Optional. Array of encrypted files with translated versions of documents provided by the user; available if requested for "passport", "driver_license", "identity_card", "internal_passport", "utility_bill", "bank_statement", "rental_agreement", "passport_registration" and "temporary_registration" types. Files can be decrypted and verified using the accompanying EncryptedCredentials.',
      },
      hash: {
        type: "string",
        description: "Base64-encoded element hash for using in PassportElementErrorUnspecified",
      },
    },
    required: ["type", "hash"],
  },
  EncryptedCredentials: {
    type: "object",
    properties: {
      data: {
        type: "string",
        description:
          "Base64-encoded encrypted JSON-serialized data with unique user's payload, data hashes and secrets required for EncryptedPassportElement decryption and authentication",
      },
      hash: {
        type: "string",
        description: "Base64-encoded data hash for data authentication",
      },
      secret: {
        type: "string",
        description: "Base64-encoded secret, encrypted with the bot's public RSA key, required for data decryption",
      },
    },
    required: ["data", "hash", "secret"],
  },
  PassportElementError: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "PassportElementErrorDataField",
      },
      {
        type: "ref",
        ref: "PassportElementErrorFrontSide",
      },
      {
        type: "ref",
        ref: "PassportElementErrorReverseSide",
      },
      {
        type: "ref",
        ref: "PassportElementErrorSelfie",
      },
      {
        type: "ref",
        ref: "PassportElementErrorFile",
      },
      {
        type: "ref",
        ref: "PassportElementErrorFiles",
      },
      {
        type: "ref",
        ref: "PassportElementErrorTranslationFile",
      },
      {
        type: "ref",
        ref: "PassportElementErrorTranslationFiles",
      },
      {
        type: "ref",
        ref: "PassportElementErrorUnspecified",
      },
    ],
  },
  PassportElementErrorDataField: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["data"],
        description: "Error source, must be data",
      },
      type: {
        type: "string",
        description:
          'The section of the user\'s Telegram Passport which has the error, one of "personal_details", "passport", "driver_license", "identity_card", "internal_passport", "address"',
      },
      field_name: {
        type: "string",
        description: "Name of the data field which has the error",
      },
      data_hash: {
        type: "string",
        description: "Base64-encoded data hash",
      },
      message: {
        type: "string",
        description: "Error message",
      },
    },
    required: ["source", "type", "field_name", "data_hash", "message"],
  },
  PassportElementErrorFrontSide: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["front_side"],
        description: "Error source, must be front_side",
      },
      type: {
        type: "string",
        description:
          'The section of the user\'s Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport"',
      },
      file_hash: {
        type: "string",
        description: "Base64-encoded hash of the file with the front side of the document",
      },
      message: {
        type: "string",
        description: "Error message",
      },
    },
    required: ["source", "type", "file_hash", "message"],
  },
  PassportElementErrorReverseSide: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["reverse_side"],
        description: "Error source, must be reverse_side",
      },
      type: {
        type: "string",
        description:
          'The section of the user\'s Telegram Passport which has the issue, one of "driver_license", "identity_card"',
      },
      file_hash: {
        type: "string",
        description: "Base64-encoded hash of the file with the reverse side of the document",
      },
      message: {
        type: "string",
        description: "Error message",
      },
    },
    required: ["source", "type", "file_hash", "message"],
  },
  PassportElementErrorSelfie: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["selfie"],
        description: "Error source, must be selfie",
      },
      type: {
        type: "string",
        description:
          'The section of the user\'s Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport"',
      },
      file_hash: {
        type: "string",
        description: "Base64-encoded hash of the file with the selfie",
      },
      message: {
        type: "string",
        description: "Error message",
      },
    },
    required: ["source", "type", "file_hash", "message"],
  },
  PassportElementErrorFile: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["file"],
        description: "Error source, must be file",
      },
      type: {
        type: "string",
        description:
          'The section of the user\'s Telegram Passport which has the issue, one of "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration"',
      },
      file_hash: {
        type: "string",
        description: "Base64-encoded file hash",
      },
      message: {
        type: "string",
        description: "Error message",
      },
    },
    required: ["source", "type", "file_hash", "message"],
  },
  PassportElementErrorFiles: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["files"],
        description: "Error source, must be files",
      },
      type: {
        type: "string",
        description:
          'The section of the user\'s Telegram Passport which has the issue, one of "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration"',
      },
      file_hashes: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of base64-encoded file hashes",
      },
      message: {
        type: "string",
        description: "Error message",
      },
    },
    required: ["source", "type", "file_hashes", "message"],
  },
  PassportElementErrorTranslationFile: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["translation_file"],
        description: "Error source, must be translation_file",
      },
      type: {
        type: "string",
        description:
          'Type of element of the user\'s Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport", "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration"',
      },
      file_hash: {
        type: "string",
        description: "Base64-encoded file hash",
      },
      message: {
        type: "string",
        description: "Error message",
      },
    },
    required: ["source", "type", "file_hash", "message"],
  },
  PassportElementErrorTranslationFiles: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["translation_files"],
        description: "Error source, must be translation_files",
      },
      type: {
        type: "string",
        description:
          'Type of element of the user\'s Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport", "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration"',
      },
      file_hashes: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of base64-encoded file hashes",
      },
      message: {
        type: "string",
        description: "Error message",
      },
    },
    required: ["source", "type", "file_hashes", "message"],
  },
  PassportElementErrorUnspecified: {
    type: "object",
    properties: {
      source: {
        type: "string",
        enum: ["unspecified"],
        description: "Error source, must be unspecified",
      },
      type: {
        type: "string",
        description: "Type of element of the user's Telegram Passport which has the issue",
      },
      element_hash: {
        type: "string",
        description: "Base64-encoded element hash",
      },
      message: {
        type: "string",
        description: "Error message",
      },
    },
    required: ["source", "type", "element_hash", "message"],
  },
  Game: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the game",
      },
      description: {
        type: "string",
        description: "Description of the game",
      },
      photo: {
        type: "array",
        items: {
          type: "ref",
          ref: "PhotoSize",
        },
        description: "Photo that will be displayed in the game message in chats",
      },
      text: {
        type: "string",
        description:
          "Optional. Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls setGameScore, or manually edited using editMessageText. 0-4096 characters.",
      },
      text_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description: "Optional. Special entities that appear in text, such as usernames, URLs, bot commands, etc.",
      },
      animation: {
        type: "ref",
        ref: "Animation",
        description: "Optional. Animation that will be displayed in the game message in chats. Upload via BotFather.",
      },
    },
    required: ["title", "description", "photo"],
  },
  CallbackGame: {
    type: "object",
    properties: {},
    required: [],
  },
  GameHighScore: {
    type: "object",
    properties: {
      position: {
        type: "integer",
        description: "Position in high score table for the game",
      },
      user: {
        type: "ref",
        ref: "User",
        description: "User",
      },
      score: {
        type: "integer",
        description: "Score",
      },
    },
    required: ["position", "user", "score"],
  },
  GetUpdatesRequest: {
    type: "object",
    properties: {
      offset: {
        type: "integer",
        description:
          "Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will be forgotten.",
      },
      limit: {
        type: "integer",
        description:
          "Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
      },
      timeout: {
        type: "integer",
        description:
          "Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.",
      },
      allowed_updates: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          'A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn\'t affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time.',
      },
    },
    required: [],
  },
  GetUpdatesResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "Update",
    },
  },
  SetWebhookRequest: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "HTTPS URL to send updates to. Use an empty string to remove webhook integration.",
      },
      certificate: {
        type: "string",
        format: "binary",
        description:
          "Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details.",
      },
      ip_address: {
        type: "string",
        description:
          "The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS",
      },
      max_connections: {
        type: "integer",
        description:
          "The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput.",
      },
      allowed_updates: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          'A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn\'t affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.',
      },
      drop_pending_updates: {
        type: "boolean",
        description: "Pass True to drop all pending updates",
      },
      secret_token: {
        type: "string",
        description:
          'A secret token to be sent in a header "X-Telegram-Bot-Api-Secret-Token" in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header is useful to ensure that the request comes from a webhook set by you.',
        sensitive: true,
      },
    },
    required: ["url"],
  },
  SetWebhookResponse: {
    type: "boolean",
  },
  DeleteWebhookRequest: {
    type: "object",
    properties: {
      drop_pending_updates: {
        type: "boolean",
        description: "Pass True to drop all pending updates",
      },
    },
    required: [],
  },
  DeleteWebhookResponse: {
    type: "boolean",
  },
  LogOutResponse: {
    type: "boolean",
  },
  CloseResponse: {
    type: "boolean",
  },
  SendMessageRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      text: {
        type: "string",
        description: "Text of the message to be sent, 1-4096 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the message text. See formatting options for more details.",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
      },
      link_preview_options: {
        type: "ref",
        ref: "LinkPreviewOptions",
        description: "Link preview generation options for the message",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "text"],
  },
  ForwardMessageRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat",
      },
      from_chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format @username)",
      },
      video_start_timestamp: {
        type: "integer",
        description: "New start timestamp for the forwarded video in the message",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the forwarded message from forwarding and saving",
      },
      message_effect_id: {
        type: "string",
        description:
          "Unique identifier of the message effect to be added to the message; only available when forwarding to private chats",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Message identifier in the chat specified in from_chat_id",
      },
    },
    required: ["chat_id", "from_chat_id", "message_id"],
  },
  ForwardMessagesRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat",
      },
      from_chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format @username)",
      },
      message_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to forward. The identifiers must be specified in a strictly increasing order.",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the messages silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the forwarded messages from forwarding and saving",
      },
    },
    required: ["chat_id", "from_chat_id", "message_ids"],
  },
  ForwardMessagesResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "MessageId",
    },
  },
  CopyMessageRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      from_chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format @username)",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Message identifier in the chat specified in from_chat_id",
      },
      video_start_timestamp: {
        type: "integer",
        description: "New start timestamp for the copied video in the message",
      },
      caption: {
        type: "string",
        description:
          "New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept.",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the new caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description:
          "Pass True if the caption must be shown above the message media. Ignored if a new caption isn't specified.",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description:
          "Unique identifier of the message effect to be added to the message; only available when copying to private chats",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "from_chat_id", "message_id"],
  },
  CopyMessagesRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat",
      },
      from_chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format @username)",
      },
      message_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to copy. The identifiers must be specified in a strictly increasing order.",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the messages silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent messages from forwarding and saving",
      },
      remove_caption: {
        type: "boolean",
        description: "Pass True to copy the messages without their captions",
      },
    },
    required: ["chat_id", "from_chat_id", "message_ids"],
  },
  CopyMessagesResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "MessageId",
    },
  },
  SendPhotoRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      photo: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      caption: {
        type: "string",
        description:
          "Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the photo caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Pass True if the caption must be shown above the message media",
      },
      has_spoiler: {
        type: "boolean",
        description: "Pass True if the photo needs to be covered with a spoiler animation",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "photo"],
  },
  SendLivePhotoRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      live_photo: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "Live photo video to send. The video must be no longer than 10 seconds and must not exceed 10 MB in size. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported.",
      },
      photo: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "The static photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported.",
      },
      caption: {
        type: "string",
        description:
          "Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the video caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Pass True if the caption must be shown above the message media",
      },
      has_spoiler: {
        type: "boolean",
        description: "Pass True if the video needs to be covered with a spoiler animation",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "live_photo", "photo"],
  },
  SendAudioRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      audio: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      caption: {
        type: "string",
        description: "Audio caption, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the audio caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      duration: {
        type: "integer",
        description: "Duration of the audio in seconds",
      },
      performer: {
        type: "string",
        description: "Performer",
      },
      title: {
        type: "string",
        description: "Track name",
      },
      thumbnail: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
            format: "file-reference",
          },
        ],
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "audio"],
  },
  SendDocumentRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      document: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      thumbnail: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
            format: "file-reference",
          },
        ],
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      caption: {
        type: "string",
        description:
          "Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the document caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      disable_content_type_detection: {
        type: "boolean",
        description:
          "Disables automatic server-side content type detection for files uploaded using multipart/form-data",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "document"],
  },
  SendVideoRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      video: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      duration: {
        type: "integer",
        description: "Duration of sent video in seconds",
      },
      width: {
        type: "integer",
        description: "Video width",
      },
      height: {
        type: "integer",
        description: "Video height",
      },
      thumbnail: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
            format: "file-reference",
          },
        ],
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      cover: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
            format: "file-reference",
          },
        ],
        description:
          'Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
      },
      start_timestamp: {
        type: "integer",
        description: "Start timestamp for the video in the message",
      },
      caption: {
        type: "string",
        description:
          "Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the video caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Pass True if the caption must be shown above the message media",
      },
      has_spoiler: {
        type: "boolean",
        description: "Pass True if the video needs to be covered with a spoiler animation",
      },
      supports_streaming: {
        type: "boolean",
        description: "Pass True if the uploaded video is suitable for streaming",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "video"],
  },
  SendAnimationRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      animation: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      duration: {
        type: "integer",
        description: "Duration of sent animation in seconds",
      },
      width: {
        type: "integer",
        description: "Animation width",
      },
      height: {
        type: "integer",
        description: "Animation height",
      },
      thumbnail: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
            format: "file-reference",
          },
        ],
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      caption: {
        type: "string",
        description:
          "Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the animation caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Pass True if the caption must be shown above the message media",
      },
      has_spoiler: {
        type: "boolean",
        description: "Pass True if the animation needs to be covered with a spoiler animation",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "animation"],
  },
  SendVoiceRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      voice: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      caption: {
        type: "string",
        description: "Voice message caption, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the voice message caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      duration: {
        type: "integer",
        description: "Duration of the voice message in seconds",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "voice"],
  },
  SendVideoNoteRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      video_note: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending video notes by a URL is currently unsupported.",
      },
      duration: {
        type: "integer",
        description: "Duration of sent video in seconds",
      },
      length: {
        type: "integer",
        description: "Video width and height, i.e. diameter of the video message",
      },
      thumbnail: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
            format: "file-reference",
          },
        ],
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "video_note"],
  },
  SendPaidMediaRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance.",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      star_count: {
        type: "integer",
        description: "The number of Telegram Stars that must be paid to buy access to the media; 1-25000",
      },
      media: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputPaidMedia",
        },
        description: "A JSON-serialized Array describing the media to be sent; up to 10 items",
      },
      payload: {
        type: "string",
        description:
          "Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes.",
      },
      caption: {
        type: "string",
        description: "Media caption, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the media caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description: "Pass True if the caption must be shown above the message media",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "star_count", "media"],
  },
  SendMediaGroupRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat",
      },
      media: {
        type: "union",
        of: [
          {
            type: "array",
            items: {
              type: "ref",
              ref: "InputMediaAudio",
            },
          },
          {
            type: "array",
            items: {
              type: "ref",
              ref: "InputMediaDocument",
            },
          },
          {
            type: "array",
            items: {
              type: "ref",
              ref: "InputMediaLivePhoto",
            },
          },
          {
            type: "array",
            items: {
              type: "ref",
              ref: "InputMediaPhoto",
            },
          },
          {
            type: "array",
            items: {
              type: "ref",
              ref: "InputMediaVideo",
            },
          },
        ],
        description: "A JSON-serialized Array describing messages to be sent, must include 2-10 items",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends messages silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent messages from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
    },
    required: ["chat_id", "media"],
  },
  SendMediaGroupResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "Message",
    },
  },
  SendLocationRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      latitude: {
        type: "number",
        description: "Latitude of the location",
      },
      longitude: {
        type: "number",
        description: "Longitude of the location",
      },
      horizontal_accuracy: {
        type: "number",
        description: "The radius of uncertainty for the location, measured in meters; 0-1500",
      },
      live_period: {
        type: "integer",
        description:
          "Period in seconds during which the location will be updated (see Live Locations), must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. Must be 0 for ephemeral messages.",
      },
      heading: {
        type: "integer",
        description:
          "For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.",
      },
      proximity_alert_radius: {
        type: "integer",
        description:
          "For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "latitude", "longitude"],
  },
  SendVenueRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      latitude: {
        type: "number",
        description: "Latitude of the venue",
      },
      longitude: {
        type: "number",
        description: "Longitude of the venue",
      },
      title: {
        type: "string",
        description: "Name of the venue",
      },
      address: {
        type: "string",
        description: "Address of the venue",
      },
      foursquare_id: {
        type: "string",
        description: "Foursquare identifier of the venue",
      },
      foursquare_type: {
        type: "string",
        description:
          'Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)',
      },
      google_place_id: {
        type: "string",
        description: "Google Places identifier of the venue",
      },
      google_place_type: {
        type: "string",
        description: "Google Places type of the venue. (See supported types.)",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "latitude", "longitude", "title", "address"],
  },
  SendContactRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      phone_number: {
        type: "string",
        description: "Contact's phone number",
      },
      first_name: {
        type: "string",
        description: "Contact's first name",
      },
      last_name: {
        type: "string",
        description: "Contact's last name",
      },
      vcard: {
        type: "string",
        description: "Additional data about the contact in the form of a vCard, 0-2048 bytes",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "phone_number", "first_name"],
  },
  SendPollRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. Polls can't be sent to channel direct messages chats.",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      question: {
        type: "string",
        description: "Poll question, 1-300 characters",
      },
      question_parse_mode: {
        type: "string",
        description:
          "Mode for parsing entities in the question. See formatting options for more details. Currently, only custom emoji entities are allowed.",
      },
      question_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of question_parse_mode.",
      },
      options: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputPollOption",
        },
        description: "A JSON-serialized list of 1-12 answer options",
      },
      is_anonymous: {
        type: "boolean",
        description: "True, if the poll needs to be anonymous, defaults to True",
      },
      type: {
        type: "string",
        description: 'Poll type, "quiz" or "regular", defaults to "regular"',
      },
      allows_multiple_answers: {
        type: "boolean",
        description: "Pass True if the poll allows multiple answers, defaults to False",
      },
      allows_revoting: {
        type: "boolean",
        description:
          "Pass True if the poll allows to change chosen answer options, defaults to False for quizzes and to True for regular polls",
      },
      shuffle_options: {
        type: "boolean",
        description: "Pass True if the poll options must be shown in random order",
      },
      allow_adding_options: {
        type: "boolean",
        description:
          "Pass True if answer options can be added to the poll after creation; not supported for anonymous polls and quizzes",
      },
      hide_results_until_closes: {
        type: "boolean",
        description: "Pass True if poll results must be shown only after the poll closes",
      },
      members_only: {
        type: "boolean",
        description:
          "Pass True if voting is limited to users who have been members of the chat where the poll is being sent for more than 24 hours; for channel chats only",
      },
      country_codes: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          'A JSON-serialized list of 0-12 two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll; for channel chats only. Use "FT" as a country code to allow users with anonymous numbers to vote. If omitted or empty, then users from any country can participate in the poll.',
      },
      correct_option_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "A JSON-serialized list of monotonically increasing 0-based identifiers of the correct answer options, required for polls in quiz mode",
      },
      explanation: {
        type: "string",
        description:
          "Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing",
      },
      explanation_parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the explanation. See formatting options for more details.",
      },
      explanation_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of explanation_parse_mode.",
      },
      explanation_media: {
        type: "ref",
        ref: "InputPollMedia",
        description: "Media added to the quiz explanation",
      },
      open_period: {
        type: "integer",
        description:
          "Amount of time in seconds the poll will be active after creation, 5-2628000. Can't be used together with close_date.",
      },
      close_date: {
        type: "integer",
        description:
          "Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 2628000 seconds in the future. Can't be used together with open_period.",
      },
      is_closed: {
        type: "boolean",
        description: "Pass True if the poll needs to be immediately closed. This can be useful for poll preview.",
      },
      description: {
        type: "string",
        description: "Description of the poll to be sent, 0-1024 characters after entities parsing",
      },
      description_parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the poll description. See formatting options for more details.",
      },
      description_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the poll description, which can be specified instead of description_parse_mode",
      },
      media: {
        type: "ref",
        ref: "InputPollMedia",
        description: "Media added to the poll description",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "question", "options"],
  },
  SendChecklistRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target bot in the format @username",
      },
      checklist: {
        type: "ref",
        ref: "InputChecklist",
        description: "A JSON-serialized object for the checklist to send",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "A JSON-serialized object for description of the message to reply to",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for an inline keyboard",
      },
    },
    required: ["business_connection_id", "chat_id", "checklist"],
  },
  SendDiceRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      emoji: {
        type: "string",
        description:
          'Emoji on which the dice throw animation is based. Currently, must be one of "🎲", "🎯", "🏀", "⚽", "🎳", or "🎰". Dice can have values 1-6 for "🎲", "🎯" and "🎳", values 1-5 for "🏀" and "⚽", and values 1-64 for "🎰". Defaults to "🎲".',
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id"],
  },
  SendMessageDraftRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target private chat",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target message thread",
      },
      draft_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation.",
      },
      text: {
        type: "string",
        description:
          'Text of the message to be sent, 0-4096 characters after entities parsing. Pass an empty text to show a "Thinking..." placeholder.',
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the message text. See formatting options for more details.",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
      },
      can_stop: {
        type: "boolean",
        description:
          'Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button.',
      },
      keep_on_stop: {
        type: "boolean",
        description:
          "Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message.",
      },
    },
    required: ["chat_id", "draft_id"],
  },
  SendMessageDraftResponse: {
    type: "boolean",
  },
  SendChatActionRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the action will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot or supergroup in the format @username. Channel chats and channel direct messages chats aren't supported.",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only",
      },
      action: {
        type: "string",
        description:
          "Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes.",
      },
    },
    required: ["chat_id", "action"],
  },
  SendChatActionResponse: {
    type: "boolean",
  },
  SetMessageReactionRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.",
      },
      reaction: {
        type: "array",
        items: {
          type: "ref",
          ref: "ReactionType",
        },
        description:
          "A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots.",
      },
      is_big: {
        type: "boolean",
        description: "Pass True to set the reaction with a big animation",
      },
    },
    required: ["chat_id", "message_id"],
  },
  SetMessageReactionResponse: {
    type: "boolean",
  },
  GetUserProfilePhotosRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      offset: {
        type: "integer",
        description: "Sequential number of the first photo to be returned. By default, all photos are returned.",
      },
      limit: {
        type: "integer",
        description: "Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
      },
    },
    required: ["user_id"],
  },
  GetUserProfileAudiosRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      offset: {
        type: "integer",
        description: "Sequential number of the first audio to be returned. By default, all audios are returned.",
      },
      limit: {
        type: "integer",
        description: "Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
      },
    },
    required: ["user_id"],
  },
  SetUserEmojiStatusRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      emoji_status_custom_emoji_id: {
        type: "string",
        description: "Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status.",
      },
      emoji_status_expiration_date: {
        type: "integer",
        description: "Expiration date of the emoji status, if any",
      },
    },
    required: ["user_id"],
  },
  SetUserEmojiStatusResponse: {
    type: "boolean",
  },
  GetFileRequest: {
    type: "object",
    properties: {
      file_id: {
        type: "string",
        description: "File identifier to get information about",
      },
    },
    required: ["file_id"],
  },
  BanChatMemberRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target group or username of the target supergroup or channel in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      until_date: {
        type: "integer",
        description:
          "Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.",
      },
      revoke_messages: {
        type: "boolean",
        description:
          "Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels.",
      },
    },
    required: ["chat_id", "user_id"],
  },
  BanChatMemberResponse: {
    type: "boolean",
  },
  UnbanChatMemberRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target group or username of the target supergroup or channel in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      only_if_banned: {
        type: "boolean",
        description: "Do nothing if the user is not banned",
      },
    },
    required: ["chat_id", "user_id"],
  },
  UnbanChatMemberResponse: {
    type: "boolean",
  },
  RestrictChatMemberRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      permissions: {
        type: "ref",
        ref: "ChatPermissions",
        description: "A JSON-serialized object for new user permissions",
      },
      use_independent_chat_permissions: {
        type: "boolean",
        description:
          "Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission.",
      },
      until_date: {
        type: "integer",
        description:
          "Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever.",
      },
    },
    required: ["chat_id", "user_id", "permissions"],
  },
  RestrictChatMemberResponse: {
    type: "boolean",
  },
  PromoteChatMemberRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      is_anonymous: {
        type: "boolean",
        description: "Pass True if the administrator's presence in the chat is hidden",
      },
      can_manage_chat: {
        type: "boolean",
        description:
          "Pass True if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.",
      },
      can_delete_messages: {
        type: "boolean",
        description: "Pass True if the administrator can delete messages of other users",
      },
      can_manage_video_chats: {
        type: "boolean",
        description: "Pass True if the administrator can manage video chats",
      },
      can_restrict_members: {
        type: "boolean",
        description:
          "Pass True if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to True for promotions of channel administrators.",
      },
      can_promote_members: {
        type: "boolean",
        description:
          "Pass True if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him)",
      },
      can_change_info: {
        type: "boolean",
        description: "Pass True if the administrator can change chat title, photo and other settings",
      },
      can_invite_users: {
        type: "boolean",
        description: "Pass True if the administrator can invite new users to the chat",
      },
      can_post_stories: {
        type: "boolean",
        description: "Pass True if the administrator can post stories to the chat",
      },
      can_edit_stories: {
        type: "boolean",
        description:
          "Pass True if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive",
      },
      can_delete_stories: {
        type: "boolean",
        description: "Pass True if the administrator can delete stories posted by other users",
      },
      can_post_messages: {
        type: "boolean",
        description:
          "Pass True if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only",
      },
      can_edit_messages: {
        type: "boolean",
        description:
          "Pass True if the administrator can edit messages of other users and can pin messages; for channels only",
      },
      can_pin_messages: {
        type: "boolean",
        description: "Pass True if the administrator can pin messages; for supergroups only",
      },
      can_manage_topics: {
        type: "boolean",
        description:
          "Pass True if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only",
      },
      can_manage_direct_messages: {
        type: "boolean",
        description:
          "Pass True if the administrator can manage direct messages within the channel and decline suggested posts; for channels only",
      },
      can_manage_tags: {
        type: "boolean",
        description:
          "Pass True if the administrator can edit the tags of regular members; for groups and supergroups only",
      },
      can_send_welcome_messages: {
        type: "boolean",
        description:
          "Pass True if the administrator can manage chat welcome messages or directly send them in the case of bots",
      },
    },
    required: ["chat_id", "user_id"],
  },
  PromoteChatMemberResponse: {
    type: "boolean",
  },
  SetChatAdministratorCustomTitleRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      custom_title: {
        type: "string",
        description: "New custom title for the administrator; 0-16 characters, emoji are not allowed",
      },
    },
    required: ["chat_id", "user_id", "custom_title"],
  },
  SetChatAdministratorCustomTitleResponse: {
    type: "boolean",
  },
  SetChatMemberTagRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      tag: {
        type: "string",
        description: "New tag for the member; 0-16 characters, emoji are not allowed",
      },
    },
    required: ["chat_id", "user_id"],
  },
  SetChatMemberTagResponse: {
    type: "boolean",
  },
  BanChatSenderChatRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      sender_chat_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target sender chat",
      },
    },
    required: ["chat_id", "sender_chat_id"],
  },
  BanChatSenderChatResponse: {
    type: "boolean",
  },
  UnbanChatSenderChatRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      sender_chat_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target sender chat",
      },
    },
    required: ["chat_id", "sender_chat_id"],
  },
  UnbanChatSenderChatResponse: {
    type: "boolean",
  },
  SetChatPermissionsRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      permissions: {
        type: "ref",
        ref: "ChatPermissions",
        description: "A JSON-serialized object for new default chat permissions",
      },
      use_independent_chat_permissions: {
        type: "boolean",
        description:
          "Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission.",
      },
    },
    required: ["chat_id", "permissions"],
  },
  SetChatPermissionsResponse: {
    type: "boolean",
  },
  ExportChatInviteLinkRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
    },
    required: ["chat_id"],
  },
  ExportChatInviteLinkResponse: {
    type: "string",
  },
  CreateChatInviteLinkRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      name: {
        type: "string",
        description: "Invite link name; 0-32 characters",
      },
      expire_date: {
        type: "integer",
        description: "Point in time (Unix timestamp) when the link will expire",
      },
      member_limit: {
        type: "integer",
        description:
          "The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999",
      },
      creates_join_request: {
        type: "boolean",
        description:
          "True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified.",
      },
    },
    required: ["chat_id"],
  },
  EditChatInviteLinkRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      invite_link: {
        type: "string",
        description: "The invite link to edit",
      },
      name: {
        type: "string",
        description: "Invite link name; 0-32 characters",
      },
      expire_date: {
        type: "integer",
        description: "Point in time (Unix timestamp) when the link will expire",
      },
      member_limit: {
        type: "integer",
        description:
          "The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999",
      },
      creates_join_request: {
        type: "boolean",
        description:
          "True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified.",
      },
    },
    required: ["chat_id", "invite_link"],
  },
  CreateChatSubscriptionInviteLinkRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target channel chat or username of the target channel in the format @username",
      },
      name: {
        type: "string",
        description: "Invite link name; 0-32 characters",
      },
      subscription_period: {
        type: "integer",
        description:
          "The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).",
      },
      subscription_price: {
        type: "integer",
        description:
          "The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000",
      },
    },
    required: ["chat_id", "subscription_period", "subscription_price"],
  },
  EditChatSubscriptionInviteLinkRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      invite_link: {
        type: "string",
        description: "The invite link to edit",
      },
      name: {
        type: "string",
        description: "Invite link name; 0-32 characters",
      },
    },
    required: ["chat_id", "invite_link"],
  },
  RevokeChatInviteLinkRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier of the target chat or username of the target channel in the format @username",
      },
      invite_link: {
        type: "string",
        description: "The invite link to revoke",
      },
    },
    required: ["chat_id", "invite_link"],
  },
  ApproveChatJoinRequestRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
    },
    required: ["chat_id", "user_id"],
  },
  ApproveChatJoinRequestResponse: {
    type: "boolean",
  },
  DeclineChatJoinRequestRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
    },
    required: ["chat_id", "user_id"],
  },
  DeclineChatJoinRequestResponse: {
    type: "boolean",
  },
  AnswerChatJoinRequestQueryRequest: {
    type: "object",
    properties: {
      chat_join_request_query_id: {
        type: "string",
        description: "Unique identifier of the join request query",
      },
      result: {
        type: "string",
        description:
          'Result of the query. Must be either "approve" to allow the user to join the chat, "decline" to disallow the user to join the chat, or "queue" to leave the decision to other administrators.',
      },
    },
    required: ["chat_join_request_query_id", "result"],
  },
  AnswerChatJoinRequestQueryResponse: {
    type: "boolean",
  },
  SendChatJoinRequestWebAppRequest: {
    type: "object",
    properties: {
      chat_join_request_query_id: {
        type: "string",
        description: "Unique identifier of the join request query",
      },
      web_app_url: {
        type: "string",
        description:
          "An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps",
      },
    },
    required: ["chat_join_request_query_id", "web_app_url"],
  },
  SendChatJoinRequestWebAppResponse: {
    type: "boolean",
  },
  SetChatPhotoRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      photo: {
        type: "string",
        format: "binary",
        description: "New chat photo, uploaded using multipart/form-data",
      },
    },
    required: ["chat_id", "photo"],
  },
  SetChatPhotoResponse: {
    type: "boolean",
  },
  DeleteChatPhotoRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
    },
    required: ["chat_id"],
  },
  DeleteChatPhotoResponse: {
    type: "boolean",
  },
  SetChatTitleRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      title: {
        type: "string",
        description: "New chat title, 1-128 characters",
      },
    },
    required: ["chat_id", "title"],
  },
  SetChatTitleResponse: {
    type: "boolean",
  },
  SetChatDescriptionRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      description: {
        type: "string",
        description: "New chat description, 0-255 characters",
      },
    },
    required: ["chat_id"],
  },
  SetChatDescriptionResponse: {
    type: "boolean",
  },
  PinChatMessageRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be pinned",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of a message to pin",
      },
      disable_notification: {
        type: "boolean",
        description:
          "Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats.",
      },
    },
    required: ["chat_id", "message_id"],
  },
  PinChatMessageResponse: {
    type: "boolean",
  },
  UnpinChatMessageRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be unpinned",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the message to unpin. Required if business_connection_id is specified. If not specified, the most recent pinned message (by sending date) will be unpinned.",
      },
    },
    required: ["chat_id"],
  },
  UnpinChatMessageResponse: {
    type: "boolean",
  },
  UnpinAllChatMessagesRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
    },
    required: ["chat_id"],
  },
  UnpinAllChatMessagesResponse: {
    type: "boolean",
  },
  LeaveChatRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username. Channel direct messages chats aren't supported; leave the corresponding channel instead.",
      },
    },
    required: ["chat_id"],
  },
  LeaveChatResponse: {
    type: "boolean",
  },
  GetChatRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username",
      },
    },
    required: ["chat_id"],
  },
  GetChatAdministratorsRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username",
      },
      return_bots: {
        type: "boolean",
        description:
          "Pass True to additionally receive all bots that are administrators of the chat. By default, bots other than the current bot are omitted.",
      },
    },
    required: ["chat_id"],
  },
  GetChatAdministratorsResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "ChatMember",
    },
  },
  GetChatMemberCountRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username",
      },
    },
    required: ["chat_id"],
  },
  GetChatMemberCountResponse: {
    type: "integer",
  },
  GetChatMemberRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
    },
    required: ["chat_id", "user_id"],
  },
  GetUserPersonalChatMessagesRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target user",
      },
      limit: {
        type: "integer",
        description: "The maximum number of messages to return; 1-20",
      },
    },
    required: ["user_id", "limit"],
  },
  GetUserPersonalChatMessagesResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "Message",
    },
  },
  SetChatStickerSetRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      sticker_set_name: {
        type: "string",
        description: "Name of the sticker set to be set as the group sticker set",
      },
    },
    required: ["chat_id", "sticker_set_name"],
  },
  SetChatStickerSetResponse: {
    type: "boolean",
  },
  DeleteChatStickerSetRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
    },
    required: ["chat_id"],
  },
  DeleteChatStickerSetResponse: {
    type: "boolean",
  },
  GetForumTopicIconStickersResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "Sticker",
    },
  },
  CreateForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      name: {
        type: "string",
        description: "Topic name, 1-128 characters",
      },
      icon_color: {
        type: "integer",
        description:
          "Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F).",
      },
      icon_custom_emoji_id: {
        type: "string",
        description:
          "Unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers.",
      },
    },
    required: ["chat_id", "name"],
  },
  EditForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target message thread of the forum topic",
      },
      name: {
        type: "string",
        description:
          "New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept.",
      },
      icon_custom_emoji_id: {
        type: "string",
        description:
          "New unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept.",
      },
    },
    required: ["chat_id", "message_thread_id"],
  },
  EditForumTopicResponse: {
    type: "boolean",
  },
  CloseForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target message thread of the forum topic",
      },
    },
    required: ["chat_id", "message_thread_id"],
  },
  CloseForumTopicResponse: {
    type: "boolean",
  },
  ReopenForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target message thread of the forum topic",
      },
    },
    required: ["chat_id", "message_thread_id"],
  },
  ReopenForumTopicResponse: {
    type: "boolean",
  },
  DeleteForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target message thread of the forum topic",
      },
    },
    required: ["chat_id", "message_thread_id"],
  },
  DeleteForumTopicResponse: {
    type: "boolean",
  },
  UnpinAllForumTopicMessagesRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target message thread of the forum topic",
      },
    },
    required: ["chat_id", "message_thread_id"],
  },
  UnpinAllForumTopicMessagesResponse: {
    type: "boolean",
  },
  EditGeneralForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      name: {
        type: "string",
        description: "New topic name, 1-128 characters",
      },
    },
    required: ["chat_id", "name"],
  },
  EditGeneralForumTopicResponse: {
    type: "boolean",
  },
  CloseGeneralForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
    },
    required: ["chat_id"],
  },
  CloseGeneralForumTopicResponse: {
    type: "boolean",
  },
  ReopenGeneralForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
    },
    required: ["chat_id"],
  },
  ReopenGeneralForumTopicResponse: {
    type: "boolean",
  },
  HideGeneralForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
    },
    required: ["chat_id"],
  },
  HideGeneralForumTopicResponse: {
    type: "boolean",
  },
  UnhideGeneralForumTopicRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
    },
    required: ["chat_id"],
  },
  UnhideGeneralForumTopicResponse: {
    type: "boolean",
  },
  UnpinAllGeneralForumTopicMessagesRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
    },
    required: ["chat_id"],
  },
  UnpinAllGeneralForumTopicMessagesResponse: {
    type: "boolean",
  },
  AnswerCallbackQueryRequest: {
    type: "object",
    properties: {
      callback_query_id: {
        type: "string",
        description: "Unique identifier for the query to be answered",
      },
      text: {
        type: "string",
        description: "Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters.",
      },
      show_alert: {
        type: "boolean",
        description:
          "If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to False.",
      },
      url: {
        type: "string",
        description:
          "URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @BotFather, specify the URL that opens your game - note that this will only work if the query comes from a callback_game button. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.",
      },
      cache_time: {
        type: "integer",
        description:
          "The maximum amount of time in seconds that the result of the callback query may be cached client-side. Defaults to 0.",
      },
    },
    required: ["callback_query_id"],
  },
  AnswerCallbackQueryResponse: {
    type: "boolean",
  },
  AnswerGuestQueryRequest: {
    type: "object",
    properties: {
      guest_query_id: {
        type: "string",
        description: "Unique identifier for the query to be answered",
      },
      result: {
        type: "ref",
        ref: "InlineQueryResult",
        description: "A JSON-serialized object describing the message to be sent",
      },
    },
    required: ["guest_query_id", "result"],
  },
  GetUserChatBoostsRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the chat or username of the channel in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
    },
    required: ["chat_id", "user_id"],
  },
  GetBusinessConnectionRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
    },
    required: ["business_connection_id"],
  },
  GetManagedBotTokenRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier of the managed bot whose token will be returned",
      },
    },
    required: ["user_id"],
  },
  GetManagedBotTokenResponse: {
    type: "string",
    sensitive: true,
  },
  ReplaceManagedBotTokenRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier of the managed bot whose token will be replaced",
      },
    },
    required: ["user_id"],
  },
  ReplaceManagedBotTokenResponse: {
    type: "string",
    sensitive: true,
  },
  GetManagedBotAccessSettingsRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier of the managed bot whose access settings will be returned",
      },
    },
    required: ["user_id"],
  },
  SetManagedBotAccessSettingsRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier of the managed bot whose access settings will be changed",
      },
      is_access_restricted: {
        type: "boolean",
        description: "Pass True if only selected users can access the bot. The bot's owner can always access it.",
      },
      added_user_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "A JSON-serialized list of up to 10 identifiers of users who will have access to the bot in addition to its owner. Ignored if is_access_restricted is False.",
      },
    },
    required: ["user_id", "is_access_restricted"],
  },
  SetManagedBotAccessSettingsResponse: {
    type: "boolean",
  },
  SetMyCommandsRequest: {
    type: "object",
    properties: {
      commands: {
        type: "array",
        items: {
          type: "ref",
          ref: "BotCommand",
        },
        description:
          "A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.",
      },
      scope: {
        type: "ref",
        ref: "BotCommandScope",
        description:
          "A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.",
      },
      language_code: {
        type: "string",
        description:
          "A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.",
      },
    },
    required: ["commands"],
  },
  SetMyCommandsResponse: {
    type: "boolean",
  },
  DeleteMyCommandsRequest: {
    type: "object",
    properties: {
      scope: {
        type: "ref",
        ref: "BotCommandScope",
        description:
          "A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.",
      },
      language_code: {
        type: "string",
        description:
          "A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.",
      },
    },
    required: [],
  },
  DeleteMyCommandsResponse: {
    type: "boolean",
  },
  GetMyCommandsRequest: {
    type: "object",
    properties: {
      scope: {
        type: "ref",
        ref: "BotCommandScope",
        description: "A JSON-serialized object, describing scope of users. Defaults to BotCommandScopeDefault.",
      },
      language_code: {
        type: "string",
        description: "A two-letter ISO 639-1 language code or an empty string",
      },
    },
    required: [],
  },
  GetMyCommandsResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "BotCommand",
    },
  },
  SetMyNameRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description:
          "New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language.",
      },
      language_code: {
        type: "string",
        description:
          "A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name.",
      },
    },
    required: [],
  },
  SetMyNameResponse: {
    type: "boolean",
  },
  GetMyNameRequest: {
    type: "object",
    properties: {
      language_code: {
        type: "string",
        description: "A two-letter ISO 639-1 language code or an empty string",
      },
    },
    required: [],
  },
  SetMyDescriptionRequest: {
    type: "object",
    properties: {
      description: {
        type: "string",
        description:
          "New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language.",
      },
      language_code: {
        type: "string",
        description:
          "A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description.",
      },
    },
    required: [],
  },
  SetMyDescriptionResponse: {
    type: "boolean",
  },
  GetMyDescriptionRequest: {
    type: "object",
    properties: {
      language_code: {
        type: "string",
        description: "A two-letter ISO 639-1 language code or an empty string",
      },
    },
    required: [],
  },
  SetMyShortDescriptionRequest: {
    type: "object",
    properties: {
      short_description: {
        type: "string",
        description:
          "New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language.",
      },
      language_code: {
        type: "string",
        description:
          "A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description.",
      },
    },
    required: [],
  },
  SetMyShortDescriptionResponse: {
    type: "boolean",
  },
  GetMyShortDescriptionRequest: {
    type: "object",
    properties: {
      language_code: {
        type: "string",
        description: "A two-letter ISO 639-1 language code or an empty string",
      },
    },
    required: [],
  },
  SetMyProfilePhotoRequest: {
    type: "object",
    properties: {
      photo: {
        type: "ref",
        ref: "InputProfilePhoto",
        description: "The new profile photo to set",
      },
    },
    required: ["photo"],
  },
  SetMyProfilePhotoResponse: {
    type: "boolean",
  },
  RemoveMyProfilePhotoResponse: {
    type: "boolean",
  },
  SetChatMenuButtonRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target private chat. If not specified, the bot's default menu button will be changed.",
      },
      menu_button: {
        type: "ref",
        ref: "MenuButton",
        description: "A JSON-serialized object for the bot's new menu button. Defaults to MenuButtonDefault.",
      },
    },
    required: [],
  },
  SetChatMenuButtonResponse: {
    type: "boolean",
  },
  GetChatMenuButtonRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target private chat. If not specified, the bot's default menu button will be returned.",
      },
    },
    required: [],
  },
  SetMyDefaultAdministratorRightsRequest: {
    type: "object",
    properties: {
      rights: {
        type: "ref",
        ref: "ChatAdministratorRights",
        description:
          "A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared.",
      },
      for_channels: {
        type: "boolean",
        description:
          "Pass True to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed.",
      },
    },
    required: [],
  },
  SetMyDefaultAdministratorRightsResponse: {
    type: "boolean",
  },
  GetMyDefaultAdministratorRightsRequest: {
    type: "object",
    properties: {
      for_channels: {
        type: "boolean",
        description:
          "Pass True to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned.",
      },
    },
    required: [],
  },
  SendGiftRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description:
          "Required if chat_id is not specified. Unique identifier of the target user who will receive the gift.",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Required if user_id is not specified. Unique identifier for the chat or username of the channel (in the format @username) that will receive the gift.",
      },
      gift_id: {
        type: "string",
        description: "Identifier of the gift; limited gifts can't be sent to channel chats",
      },
      pay_for_upgrade: {
        type: "boolean",
        description:
          "Pass True to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver",
      },
      text: {
        type: "string",
        description: "Text that will be shown along with the gift; 0-128 characters",
      },
      text_parse_mode: {
        type: "string",
        description:
          'Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
      },
      text_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          'A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
      },
    },
    required: ["gift_id"],
  },
  SendGiftResponse: {
    type: "boolean",
  },
  GiftPremiumSubscriptionRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user who will receive a Telegram Premium subscription",
      },
      month_count: {
        type: "integer",
        description:
          "Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12",
      },
      star_count: {
        type: "integer",
        description:
          "Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months",
      },
      text: {
        type: "string",
        description: "Text that will be shown along with the service message about the subscription; 0-128 characters",
      },
      text_parse_mode: {
        type: "string",
        description:
          'Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
      },
      text_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          'A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
      },
    },
    required: ["user_id", "month_count", "star_count"],
  },
  GiftPremiumSubscriptionResponse: {
    type: "boolean",
  },
  VerifyUserRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
      custom_description: {
        type: "string",
        description:
          "Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description.",
      },
    },
    required: ["user_id"],
  },
  VerifyUserResponse: {
    type: "boolean",
  },
  VerifyChatRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. Channel direct messages chats can't be verified.",
      },
      custom_description: {
        type: "string",
        description:
          "Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description.",
      },
    },
    required: ["chat_id"],
  },
  VerifyChatResponse: {
    type: "boolean",
  },
  RemoveUserVerificationRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user",
      },
    },
    required: ["user_id"],
  },
  RemoveUserVerificationResponse: {
    type: "boolean",
  },
  RemoveChatVerificationRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot or channel in the format @username",
      },
    },
    required: ["chat_id"],
  },
  RemoveChatVerificationResponse: {
    type: "boolean",
  },
  ReadBusinessMessageRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which to read the message",
      },
      chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the message to mark as read",
      },
    },
    required: ["business_connection_id", "chat_id", "message_id"],
  },
  ReadBusinessMessageResponse: {
    type: "boolean",
  },
  DeleteBusinessMessagesRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which to delete the messages",
      },
      message_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See deleteMessage for limitations on which messages can be deleted.",
      },
    },
    required: ["business_connection_id", "message_ids"],
  },
  DeleteBusinessMessagesResponse: {
    type: "boolean",
  },
  SetBusinessAccountNameRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      first_name: {
        type: "string",
        description: "The new value of the first name for the business account; 1-64 characters",
      },
      last_name: {
        type: "string",
        description: "The new value of the last name for the business account; 0-64 characters",
      },
    },
    required: ["business_connection_id", "first_name"],
  },
  SetBusinessAccountNameResponse: {
    type: "boolean",
  },
  SetBusinessAccountUsernameRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      username: {
        type: "string",
        description: "The new value of the username for the business account; 0-32 characters",
      },
    },
    required: ["business_connection_id"],
  },
  SetBusinessAccountUsernameResponse: {
    type: "boolean",
  },
  SetBusinessAccountBioRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      bio: {
        type: "string",
        description: "The new value of the bio for the business account; 0-140 characters",
      },
    },
    required: ["business_connection_id"],
  },
  SetBusinessAccountBioResponse: {
    type: "boolean",
  },
  SetBusinessAccountProfilePhotoRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      photo: {
        type: "ref",
        ref: "InputProfilePhoto",
        description: "The new profile photo to set",
      },
      is_public: {
        type: "boolean",
        description:
          "Pass True to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo.",
      },
    },
    required: ["business_connection_id", "photo"],
  },
  SetBusinessAccountProfilePhotoResponse: {
    type: "boolean",
  },
  RemoveBusinessAccountProfilePhotoRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      is_public: {
        type: "boolean",
        description:
          "Pass True to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo.",
      },
    },
    required: ["business_connection_id"],
  },
  RemoveBusinessAccountProfilePhotoResponse: {
    type: "boolean",
  },
  SetBusinessAccountGiftSettingsRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      show_gift_button: {
        type: "boolean",
        description:
          "Pass True if a button for sending a gift to the user or by the business account must always be shown in the input field",
      },
      accepted_gift_types: {
        type: "ref",
        ref: "AcceptedGiftTypes",
        description: "Types of gifts accepted by the business account",
      },
    },
    required: ["business_connection_id", "show_gift_button", "accepted_gift_types"],
  },
  SetBusinessAccountGiftSettingsResponse: {
    type: "boolean",
  },
  GetBusinessAccountStarBalanceRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
    },
    required: ["business_connection_id"],
  },
  TransferBusinessAccountStarsRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      star_count: {
        type: "integer",
        description: "Number of Telegram Stars to transfer; 1-10000",
      },
    },
    required: ["business_connection_id", "star_count"],
  },
  TransferBusinessAccountStarsResponse: {
    type: "boolean",
  },
  GetBusinessAccountGiftsRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      exclude_unsaved: {
        type: "boolean",
        description: "Pass True to exclude gifts that aren't saved to the account's profile page",
      },
      exclude_saved: {
        type: "boolean",
        description: "Pass True to exclude gifts that are saved to the account's profile page",
      },
      exclude_unlimited: {
        type: "boolean",
        description: "Pass True to exclude gifts that can be purchased an unlimited number of times",
      },
      exclude_limited_upgradable: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique",
      },
      exclude_limited_non_upgradable: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique",
      },
      exclude_unique: {
        type: "boolean",
        description: "Pass True to exclude unique gifts",
      },
      exclude_from_blockchain: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram",
      },
      sort_by_price: {
        type: "boolean",
        description:
          "Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.",
      },
      offset: {
        type: "string",
        description:
          "Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results",
      },
      limit: {
        type: "integer",
        description: "The maximum number of gifts to be returned; 1-100. Defaults to 100.",
      },
    },
    required: ["business_connection_id"],
  },
  GetUserGiftsRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the user",
      },
      exclude_unlimited: {
        type: "boolean",
        description: "Pass True to exclude gifts that can be purchased an unlimited number of times",
      },
      exclude_limited_upgradable: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique",
      },
      exclude_limited_non_upgradable: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique",
      },
      exclude_from_blockchain: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram",
      },
      exclude_unique: {
        type: "boolean",
        description: "Pass True to exclude unique gifts",
      },
      sort_by_price: {
        type: "boolean",
        description:
          "Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.",
      },
      offset: {
        type: "string",
        description:
          "Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results",
      },
      limit: {
        type: "integer",
        description: "The maximum number of gifts to be returned; 1-100. Defaults to 100.",
      },
    },
    required: ["user_id"],
  },
  GetChatGiftsRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
      },
      exclude_unsaved: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that aren't saved to the chat's profile page. Always True, unless the bot has the can_post_messages administrator right in the channel.",
      },
      exclude_saved: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that are saved to the chat's profile page. Always False, unless the bot has the can_post_messages administrator right in the channel.",
      },
      exclude_unlimited: {
        type: "boolean",
        description: "Pass True to exclude gifts that can be purchased an unlimited number of times",
      },
      exclude_limited_upgradable: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique",
      },
      exclude_limited_non_upgradable: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique",
      },
      exclude_from_blockchain: {
        type: "boolean",
        description:
          "Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram",
      },
      exclude_unique: {
        type: "boolean",
        description: "Pass True to exclude unique gifts",
      },
      sort_by_price: {
        type: "boolean",
        description:
          "Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.",
      },
      offset: {
        type: "string",
        description:
          "Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results",
      },
      limit: {
        type: "integer",
        description: "The maximum number of gifts to be returned; 1-100. Defaults to 100.",
      },
    },
    required: ["chat_id"],
  },
  ConvertGiftToStarsRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      owned_gift_id: {
        type: "string",
        description: "Unique identifier of the regular gift that should be converted to Telegram Stars",
      },
    },
    required: ["business_connection_id", "owned_gift_id"],
  },
  ConvertGiftToStarsResponse: {
    type: "boolean",
  },
  UpgradeGiftRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      owned_gift_id: {
        type: "string",
        description: "Unique identifier of the regular gift that should be upgraded to a unique one",
      },
      keep_original_details: {
        type: "boolean",
        description: "Pass True to keep the original gift text, sender and receiver in the upgraded gift",
      },
      star_count: {
        type: "integer",
        description:
          "The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If gift.prepaid_upgrade_star_count > 0, then pass 0, otherwise, the can_transfer_stars business bot right is required and gift.upgrade_star_count must be passed.",
      },
    },
    required: ["business_connection_id", "owned_gift_id"],
  },
  UpgradeGiftResponse: {
    type: "boolean",
  },
  TransferGiftRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      owned_gift_id: {
        type: "string",
        description: "Unique identifier of the regular gift that should be transferred",
      },
      new_owner_chat_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.",
      },
      star_count: {
        type: "integer",
        description:
          "The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the can_transfer_stars business bot right is required.",
      },
    },
    required: ["business_connection_id", "owned_gift_id", "new_owner_chat_id"],
  },
  TransferGiftResponse: {
    type: "boolean",
  },
  PostStoryRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      content: {
        type: "ref",
        ref: "InputStoryContent",
        description: "Content of the story",
      },
      active_period: {
        type: "integer",
        description:
          "Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400",
      },
      caption: {
        type: "string",
        description: "Caption of the story, 0-2048 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the story caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      areas: {
        type: "array",
        items: {
          type: "ref",
          ref: "StoryArea",
        },
        description: "A JSON-serialized list of clickable areas to be shown on the story",
      },
      post_to_chat_page: {
        type: "boolean",
        description: "Pass True to keep the story accessible after it expires",
      },
      protect_content: {
        type: "boolean",
        description: "Pass True if the content of the story must be protected from forwarding and screenshotting",
      },
    },
    required: ["business_connection_id", "content", "active_period"],
  },
  RepostStoryRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      from_chat_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the chat which posted the story that should be reposted",
      },
      from_story_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the story that should be reposted",
      },
      active_period: {
        type: "integer",
        description:
          "Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400",
      },
      post_to_chat_page: {
        type: "boolean",
        description: "Pass True to keep the story accessible after it expires",
      },
      protect_content: {
        type: "boolean",
        description: "Pass True if the content of the story must be protected from forwarding and screenshotting",
      },
    },
    required: ["business_connection_id", "from_chat_id", "from_story_id", "active_period"],
  },
  EditStoryRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      story_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the story to edit",
      },
      content: {
        type: "ref",
        ref: "InputStoryContent",
        description: "Content of the story",
      },
      caption: {
        type: "string",
        description: "Caption of the story, 0-2048 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the story caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      areas: {
        type: "array",
        items: {
          type: "ref",
          ref: "StoryArea",
        },
        description: "A JSON-serialized list of clickable areas to be shown on the story",
      },
    },
    required: ["business_connection_id", "story_id", "content"],
  },
  DeleteStoryRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection",
      },
      story_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the story to delete",
      },
    },
    required: ["business_connection_id", "story_id"],
  },
  DeleteStoryResponse: {
    type: "boolean",
  },
  AnswerWebAppQueryRequest: {
    type: "object",
    properties: {
      web_app_query_id: {
        type: "string",
        description: "Unique identifier for the query to be answered",
      },
      result: {
        type: "ref",
        ref: "InlineQueryResult",
        description: "A JSON-serialized object describing the message to be sent",
      },
    },
    required: ["web_app_query_id", "result"],
  },
  SavePreparedInlineMessageRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user that can use the prepared message",
      },
      result: {
        type: "ref",
        ref: "InlineQueryResult",
        description: "A JSON-serialized object describing the message to be sent",
      },
      allow_user_chats: {
        type: "boolean",
        description: "Pass True if the message can be sent to private chats with users",
      },
      allow_bot_chats: {
        type: "boolean",
        description: "Pass True if the message can be sent to private chats with bots",
      },
      allow_group_chats: {
        type: "boolean",
        description: "Pass True if the message can be sent to group and supergroup chats",
      },
      allow_channel_chats: {
        type: "boolean",
        description: "Pass True if the message can be sent to channel chats",
      },
    },
    required: ["user_id", "result"],
  },
  SavePreparedKeyboardButtonRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier of the target user that can use the button",
      },
      button: {
        type: "ref",
        ref: "KeyboardButton",
        description:
          "A JSON-serialized object describing the button to be saved. The button must be of the type request_users, request_chat, or request_managed_bot.",
      },
    },
    required: ["user_id", "button"],
  },
  EditMessageTextRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
      },
      inline_message_id: {
        type: "string",
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
      },
      text: {
        type: "string",
        description:
          "New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the message text. See formatting options for more details.",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
      },
      link_preview_options: {
        type: "ref",
        ref: "LinkPreviewOptions",
        description: "Link preview generation options for the message",
      },
      rich_message: {
        type: "ref",
        ref: "InputRichMessage",
        description:
          "New rich content of the message; required if text isn't specified. Direct upload of new files and explicit upload of files by a URL isn't supported when an inline message is edited.",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for an inline keyboard",
      },
    },
    required: [],
  },
  EditMessageTextResponse: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "Message",
      },
      {
        type: "boolean",
      },
    ],
  },
  EditMessageCaptionRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
      },
      inline_message_id: {
        type: "string",
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
      },
      caption: {
        type: "string",
        description: "New caption of the message, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the message caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description:
          "Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages.",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for an inline keyboard",
      },
    },
    required: [],
  },
  EditMessageCaptionResponse: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "Message",
      },
      {
        type: "boolean",
      },
    ],
  },
  EditMessageMediaRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
      },
      inline_message_id: {
        type: "string",
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
      },
      media: {
        type: "ref",
        ref: "InputMedia",
        description: "A JSON-serialized object for the new media content of the message",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for a new inline keyboard",
      },
    },
    required: ["media"],
  },
  EditMessageMediaResponse: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "Message",
      },
      {
        type: "boolean",
      },
    ],
  },
  EditMessageLiveLocationRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
      },
      inline_message_id: {
        type: "string",
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
      },
      latitude: {
        type: "number",
        description: "Latitude of new location",
      },
      longitude: {
        type: "number",
        description: "Longitude of new location",
      },
      live_period: {
        type: "integer",
        description:
          "New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current live_period by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then live_period remains unchanged.",
      },
      horizontal_accuracy: {
        type: "number",
        description: "The radius of uncertainty for the location, measured in meters; 0-1500",
      },
      heading: {
        type: "integer",
        description: "Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.",
      },
      proximity_alert_radius: {
        type: "integer",
        description:
          "The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for a new inline keyboard",
      },
    },
    required: ["latitude", "longitude"],
  },
  EditMessageLiveLocationResponse: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "Message",
      },
      {
        type: "boolean",
      },
    ],
  },
  StopMessageLiveLocationRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description:
          "Required if inline_message_id is not specified. Identifier of the message with live location to stop.",
      },
      inline_message_id: {
        type: "string",
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for a new inline keyboard",
      },
    },
    required: [],
  },
  StopMessageLiveLocationResponse: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "Message",
      },
      {
        type: "boolean",
      },
    ],
  },
  EditMessageChecklistRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description: "Unique identifier for the target chat or username of the target bot in the format @username",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target message",
      },
      checklist: {
        type: "ref",
        ref: "InputChecklist",
        description: "A JSON-serialized object for the new checklist",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for the new inline keyboard for the message",
      },
    },
    required: ["business_connection_id", "chat_id", "message_id", "checklist"],
  },
  EditMessageReplyMarkupRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
      },
      inline_message_id: {
        type: "string",
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for an inline keyboard",
      },
    },
    required: [],
  },
  EditMessageReplyMarkupResponse: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "Message",
      },
      {
        type: "boolean",
      },
    ],
  },
  StopPollRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the original message with the poll",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for a new message inline keyboard",
      },
    },
    required: ["chat_id", "message_id"],
  },
  EditEphemeralMessageTextRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      receiver_user_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the user who received the message",
      },
      ephemeral_message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the ephemeral message to edit",
      },
      text: {
        type: "string",
        description:
          "New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the message text. See formatting options for more details.",
      },
      entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
      },
      rich_message: {
        type: "ref",
        ref: "InputRichMessage",
        description: "New rich content of the message; required if text isn't specified",
      },
      link_preview_options: {
        type: "ref",
        ref: "LinkPreviewOptions",
        description: "Link preview generation options for the message",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for an inline keyboard",
      },
    },
    required: ["chat_id", "receiver_user_id", "ephemeral_message_id"],
  },
  EditEphemeralMessageTextResponse: {
    type: "boolean",
  },
  EditEphemeralMessageMediaRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      receiver_user_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the user who received the message",
      },
      ephemeral_message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the ephemeral message to edit",
      },
      media: {
        type: "ref",
        ref: "InputMedia",
        description: "A JSON-serialized object for the new media content of the message",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for an inline keyboard",
      },
    },
    required: ["chat_id", "receiver_user_id", "ephemeral_message_id", "media"],
  },
  EditEphemeralMessageMediaResponse: {
    type: "boolean",
  },
  EditEphemeralMessageCaptionRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      receiver_user_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the user who received the message",
      },
      ephemeral_message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the ephemeral message to edit",
      },
      caption: {
        type: "string",
        description: "New caption of the message, 0-1024 characters after entities parsing",
      },
      parse_mode: {
        type: "string",
        description: "Mode for parsing entities in the message caption. See formatting options for more details.",
      },
      caption_entities: {
        type: "array",
        items: {
          type: "ref",
          ref: "MessageEntity",
        },
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
      },
      show_caption_above_media: {
        type: "boolean",
        description:
          "Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages.",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for an inline keyboard",
      },
    },
    required: ["chat_id", "receiver_user_id", "ephemeral_message_id"],
  },
  EditEphemeralMessageCaptionResponse: {
    type: "boolean",
  },
  EditEphemeralMessageReplyMarkupRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      receiver_user_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the user who received the message",
      },
      ephemeral_message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the ephemeral message to edit",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description: "A JSON-serialized object for an inline keyboard",
      },
    },
    required: ["chat_id", "receiver_user_id", "ephemeral_message_id"],
  },
  EditEphemeralMessageReplyMarkupResponse: {
    type: "boolean",
  },
  ApproveSuggestedPostRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target direct messages chat",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of a suggested post message to approve",
      },
      send_date: {
        type: "integer",
        description:
          "Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future.",
      },
    },
    required: ["chat_id", "message_id"],
  },
  ApproveSuggestedPostResponse: {
    type: "boolean",
  },
  DeclineSuggestedPostRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target direct messages chat",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of a suggested post message to decline",
      },
      comment: {
        type: "string",
        description: "Comment for the creator of the suggested post; 0-128 characters",
      },
    },
    required: ["chat_id", "message_id"],
  },
  DeclineSuggestedPostResponse: {
    type: "boolean",
  },
  DeleteMessageRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the message to delete",
      },
    },
    required: ["chat_id", "message_id"],
  },
  DeleteMessageResponse: {
    type: "boolean",
  },
  DeleteMessagesRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_ids: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "A JSON-serialized list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted.",
      },
    },
    required: ["chat_id", "message_ids"],
  },
  DeleteMessagesResponse: {
    type: "boolean",
  },
  DeleteEphemeralMessageRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      receiver_user_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the user who received the message",
      },
      ephemeral_message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the ephemeral message to delete",
      },
    },
    required: ["chat_id", "receiver_user_id", "ephemeral_message_id"],
  },
  DeleteEphemeralMessageResponse: {
    type: "boolean",
  },
  DeleteMessageReactionRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the target message",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the user whose reaction will be removed, if the reaction was added by a user",
      },
      actor_chat_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the chat whose reaction will be removed, if the reaction was added by a chat",
      },
    },
    required: ["chat_id", "message_id"],
  },
  DeleteMessageReactionResponse: {
    type: "boolean",
  },
  DeleteAllMessageReactionsRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the user whose reactions will be removed, if the reactions were added by a user",
      },
      actor_chat_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the chat whose reactions will be removed, if the reactions were added by a chat",
      },
    },
    required: ["chat_id"],
  },
  DeleteAllMessageReactionsResponse: {
    type: "boolean",
  },
  SendStickerRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      sticker: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Video and animated stickers can't be sent via an HTTP URL.",
      },
      emoji: {
        type: "string",
        description: "Emoji associated with the sticker; only for just uploaded stickers",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "sticker"],
  },
  GetStickerSetRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the sticker set",
      },
    },
    required: ["name"],
  },
  GetCustomEmojiStickersRequest: {
    type: "object",
    properties: {
      custom_emoji_ids: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.",
      },
    },
    required: ["custom_emoji_ids"],
  },
  GetCustomEmojiStickersResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "Sticker",
    },
  },
  UploadStickerFileRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier of sticker file owner",
      },
      sticker: {
        type: "string",
        format: "binary",
        description:
          "A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See https://core.telegram.org/stickers for technical requirements. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
      },
      sticker_format: {
        type: "string",
        description: 'Format of the sticker, must be one of "static", "animated", "video"',
      },
    },
    required: ["user_id", "sticker", "sticker_format"],
  },
  CreateNewStickerSetRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier of created sticker set owner",
      },
      name: {
        type: "string",
        description:
          'Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can\'t contain consecutive underscores and must end in "_by_<bot_username>". <bot_username> is case insensitive. 1-64 characters.',
      },
      title: {
        type: "string",
        description: "Sticker set title, 1-64 characters",
      },
      stickers: {
        type: "array",
        items: {
          type: "ref",
          ref: "InputSticker",
        },
        description: "A JSON-serialized list of 1-50 initial stickers to be added to the sticker set",
      },
      sticker_type: {
        type: "string",
        description:
          'Type of stickers in the set, pass "regular", "mask", or "custom_emoji". By default, a regular sticker set is created.',
      },
      needs_repainting: {
        type: "boolean",
        description:
          "Pass True if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only",
      },
    },
    required: ["user_id", "name", "title", "stickers"],
  },
  CreateNewStickerSetResponse: {
    type: "boolean",
  },
  AddStickerToSetRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier of sticker set owner",
      },
      name: {
        type: "string",
        description: "Sticker set name",
      },
      sticker: {
        type: "ref",
        ref: "InputSticker",
        description:
          "A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed.",
      },
    },
    required: ["user_id", "name", "sticker"],
  },
  AddStickerToSetResponse: {
    type: "boolean",
  },
  SetStickerPositionInSetRequest: {
    type: "object",
    properties: {
      sticker: {
        type: "string",
        description: "File identifier of the sticker",
      },
      position: {
        type: "integer",
        description: "New sticker position in the set, zero-based",
      },
    },
    required: ["sticker", "position"],
  },
  SetStickerPositionInSetResponse: {
    type: "boolean",
  },
  DeleteStickerFromSetRequest: {
    type: "object",
    properties: {
      sticker: {
        type: "string",
        description: "File identifier of the sticker",
      },
    },
    required: ["sticker"],
  },
  DeleteStickerFromSetResponse: {
    type: "boolean",
  },
  ReplaceStickerInSetRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier of the sticker set owner",
      },
      name: {
        type: "string",
        description: "Sticker set name",
      },
      old_sticker: {
        type: "string",
        description: "File identifier of the replaced sticker",
      },
      sticker: {
        type: "ref",
        ref: "InputSticker",
        description:
          "A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.",
      },
    },
    required: ["user_id", "name", "old_sticker", "sticker"],
  },
  ReplaceStickerInSetResponse: {
    type: "boolean",
  },
  SetStickerEmojiListRequest: {
    type: "object",
    properties: {
      sticker: {
        type: "string",
        description: "File identifier of the sticker",
      },
      emoji_list: {
        type: "array",
        items: {
          type: "string",
        },
        description: "A JSON-serialized list of 1-20 emoji associated with the sticker",
      },
    },
    required: ["sticker", "emoji_list"],
  },
  SetStickerEmojiListResponse: {
    type: "boolean",
  },
  SetStickerKeywordsRequest: {
    type: "object",
    properties: {
      sticker: {
        type: "string",
        description: "File identifier of the sticker",
      },
      keywords: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters",
      },
    },
    required: ["sticker"],
  },
  SetStickerKeywordsResponse: {
    type: "boolean",
  },
  SetStickerMaskPositionRequest: {
    type: "object",
    properties: {
      sticker: {
        type: "string",
        description: "File identifier of the sticker",
      },
      mask_position: {
        type: "ref",
        ref: "MaskPosition",
        description:
          "A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position.",
      },
    },
    required: ["sticker"],
  },
  SetStickerMaskPositionResponse: {
    type: "boolean",
  },
  SetStickerSetTitleRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Sticker set name",
      },
      title: {
        type: "string",
        description: "Sticker set title, 1-64 characters",
      },
    },
    required: ["name", "title"],
  },
  SetStickerSetTitleResponse: {
    type: "boolean",
  },
  SetStickerSetThumbnailRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Sticker set name",
      },
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier of the sticker set owner",
      },
      thumbnail: {
        type: "union",
        of: [
          {
            type: "string",
            format: "binary",
          },
          {
            type: "string",
          },
        ],
        description:
          "A .WEBP or .PNG image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a .TGS animation with a thumbnail up to 32 kilobytes in size (see https://core.telegram.org/stickers#animation-requirements for animated sticker technical requirements), or a .WEBM video with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/stickers#video-requirements for video sticker technical requirements. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail.",
      },
      format: {
        type: "string",
        description:
          'Format of the thumbnail, must be one of "static" for a .WEBP or .PNG image, "animated" for a .TGS animation, or "video" for a .WEBM video',
      },
    },
    required: ["name", "user_id", "format"],
  },
  SetStickerSetThumbnailResponse: {
    type: "boolean",
  },
  SetCustomEmojiStickerSetThumbnailRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Sticker set name",
      },
      custom_emoji_id: {
        type: "string",
        description:
          "Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail",
      },
    },
    required: ["name"],
  },
  SetCustomEmojiStickerSetThumbnailResponse: {
    type: "boolean",
  },
  DeleteStickerSetRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Sticker set name",
      },
    },
    required: ["name"],
  },
  DeleteStickerSetResponse: {
    type: "boolean",
  },
  SendRichMessageRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description:
          "Unique identifier of the business connection on behalf of which the message will be sent. Bot can send rich messages on behalf of a business account only if the corresponding user can send rich messages.",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      ephemeral_message_parameters: {
        type: "ref",
        ref: "EphemeralMessageParameters",
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
      },
      rich_message: {
        type: "ref",
        ref: "InputRichMessage",
        description: "The message to be sent",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "union",
        of: [
          {
            type: "ref",
            ref: "InlineKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardMarkup",
          },
          {
            type: "ref",
            ref: "ReplyKeyboardRemove",
          },
          {
            type: "ref",
            ref: "ForceReply",
          },
        ],
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
      },
    },
    required: ["chat_id", "rich_message"],
  },
  SendRichMessageDraftRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target private chat",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description: "Unique identifier for the target message thread",
      },
      draft_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation.",
      },
      rich_message: {
        type: "ref",
        ref: "InputRichMessage",
        description:
          "The partial message to be streamed. Direct upload of new files and explicit upload of files by a URL isn't supported.",
      },
      can_stop: {
        type: "boolean",
        description:
          'Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button.',
      },
      keep_on_stop: {
        type: "boolean",
        description:
          "Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message.",
      },
    },
    required: ["chat_id", "draft_id", "rich_message"],
  },
  SendRichMessageDraftResponse: {
    type: "boolean",
  },
  AnswerInlineQueryRequest: {
    type: "object",
    properties: {
      inline_query_id: {
        type: "string",
        description: "Unique identifier for the answered query",
      },
      results: {
        type: "array",
        items: {
          type: "ref",
          ref: "InlineQueryResult",
        },
        description: "A JSON-serialized Array of results for the inline query",
      },
      cache_time: {
        type: "integer",
        description:
          "The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.",
      },
      is_personal: {
        type: "boolean",
        description:
          "Pass True if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query.",
      },
      next_offset: {
        type: "string",
        description:
          "Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes.",
      },
      button: {
        type: "ref",
        ref: "InlineQueryResultsButton",
        description: "A JSON-serialized object describing a button to be shown above inline query results",
      },
    },
    required: ["inline_query_id", "results"],
  },
  AnswerInlineQueryResponse: {
    type: "boolean",
  },
  SendInvoiceRequest: {
    type: "object",
    properties: {
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      direct_messages_topic_id: {
        type: "integer",
        format: "int64",
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
      },
      title: {
        type: "string",
        description: "Product name, 1-32 characters",
      },
      description: {
        type: "string",
        description: "Product description, 1-255 characters",
      },
      payload: {
        type: "string",
        description:
          "Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.",
      },
      provider_token: {
        type: "string",
        description:
          "Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.",
        sensitive: true,
      },
      currency: {
        type: "string",
        description:
          'Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars.',
      },
      prices: {
        type: "array",
        items: {
          type: "ref",
          ref: "LabeledPrice",
        },
        description:
          "Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.",
      },
      max_tip_amount: {
        type: "integer",
        description:
          "The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.",
      },
      suggested_tip_amounts: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.",
      },
      start_parameter: {
        type: "string",
        description:
          "Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter.",
      },
      provider_data: {
        type: "string",
        description:
          "JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.",
      },
      photo_url: {
        type: "string",
        description:
          "URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.",
      },
      photo_size: {
        type: "integer",
        description: "Photo size in bytes",
      },
      photo_width: {
        type: "integer",
        description: "Photo width",
      },
      photo_height: {
        type: "integer",
        description: "Photo height",
      },
      need_name: {
        type: "boolean",
        description:
          "Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.",
      },
      need_phone_number: {
        type: "boolean",
        description:
          "Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.",
      },
      need_email: {
        type: "boolean",
        description:
          "Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.",
      },
      need_shipping_address: {
        type: "boolean",
        description:
          "Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.",
      },
      send_phone_number_to_provider: {
        type: "boolean",
        description:
          "Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.",
      },
      send_email_to_provider: {
        type: "boolean",
        description:
          "Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.",
      },
      is_flexible: {
        type: "boolean",
        description:
          "Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      suggested_post_parameters: {
        type: "ref",
        ref: "SuggestedPostParameters",
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description:
          "A JSON-serialized object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button.",
      },
    },
    required: ["chat_id", "title", "description", "payload", "currency", "prices"],
  },
  CreateInvoiceLinkRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description:
          "Unique identifier of the business connection on behalf of which the link will be created. For payments in Telegram Stars only.",
      },
      title: {
        type: "string",
        description: "Product name, 1-32 characters",
      },
      description: {
        type: "string",
        description: "Product description, 1-255 characters",
      },
      payload: {
        type: "string",
        description:
          "Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.",
      },
      provider_token: {
        type: "string",
        description:
          "Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.",
        sensitive: true,
      },
      currency: {
        type: "string",
        description:
          'Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars.',
      },
      prices: {
        type: "array",
        items: {
          type: "ref",
          ref: "LabeledPrice",
        },
        description:
          "Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.",
      },
      subscription_period: {
        type: "integer",
        description:
          'The number of seconds the subscription will be active for before the next payment. The currency must be set to "XTR" (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars.',
      },
      max_tip_amount: {
        type: "integer",
        description:
          "The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.",
      },
      suggested_tip_amounts: {
        type: "array",
        items: {
          type: "integer",
        },
        description:
          "A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.",
      },
      provider_data: {
        type: "string",
        description:
          "JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.",
      },
      photo_url: {
        type: "string",
        description:
          "URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.",
      },
      photo_size: {
        type: "integer",
        description: "Photo size in bytes",
      },
      photo_width: {
        type: "integer",
        description: "Photo width",
      },
      photo_height: {
        type: "integer",
        description: "Photo height",
      },
      need_name: {
        type: "boolean",
        description:
          "Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.",
      },
      need_phone_number: {
        type: "boolean",
        description:
          "Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.",
      },
      need_email: {
        type: "boolean",
        description:
          "Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.",
      },
      need_shipping_address: {
        type: "boolean",
        description:
          "Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.",
      },
      send_phone_number_to_provider: {
        type: "boolean",
        description:
          "Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.",
      },
      send_email_to_provider: {
        type: "boolean",
        description:
          "Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.",
      },
      is_flexible: {
        type: "boolean",
        description:
          "Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.",
      },
    },
    required: ["title", "description", "payload", "currency", "prices"],
  },
  CreateInvoiceLinkResponse: {
    type: "string",
  },
  AnswerShippingQueryRequest: {
    type: "object",
    properties: {
      shipping_query_id: {
        type: "string",
        description: "Unique identifier for the query to be answered",
      },
      ok: {
        type: "boolean",
        description:
          "Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)",
      },
      shipping_options: {
        type: "array",
        items: {
          type: "ref",
          ref: "ShippingOption",
        },
        description: "Required if ok is True. A JSON-serialized Array of available shipping options.",
      },
      error_message: {
        type: "string",
        description:
          'Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable"). Telegram will display this message to the user.',
      },
    },
    required: ["shipping_query_id", "ok"],
  },
  AnswerShippingQueryResponse: {
    type: "boolean",
  },
  AnswerPreCheckoutQueryRequest: {
    type: "object",
    properties: {
      pre_checkout_query_id: {
        type: "string",
        description: "Unique identifier for the query to be answered",
      },
      ok: {
        type: "boolean",
        description:
          "Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.",
      },
      error_message: {
        type: "string",
        description:
          'Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user.',
      },
    },
    required: ["pre_checkout_query_id", "ok"],
  },
  AnswerPreCheckoutQueryResponse: {
    type: "boolean",
  },
  GetStarTransactionsRequest: {
    type: "object",
    properties: {
      offset: {
        type: "integer",
        description: "Number of transactions to skip in the response",
      },
      limit: {
        type: "integer",
        description:
          "The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
      },
    },
    required: [],
  },
  RefundStarPaymentRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the user whose payment will be refunded",
      },
      telegram_payment_charge_id: {
        type: "string",
        description: "Telegram payment identifier",
      },
    },
    required: ["user_id", "telegram_payment_charge_id"],
  },
  RefundStarPaymentResponse: {
    type: "boolean",
  },
  EditUserStarSubscriptionRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Identifier of the user whose subscription will be edited",
      },
      telegram_payment_charge_id: {
        type: "string",
        description: "Telegram payment identifier for the subscription",
      },
      is_canceled: {
        type: "boolean",
        description:
          "Pass True to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass False to allow the user to re-enable a subscription that was previously canceled by the bot.",
      },
    },
    required: ["user_id", "telegram_payment_charge_id", "is_canceled"],
  },
  EditUserStarSubscriptionResponse: {
    type: "boolean",
  },
  SetPassportDataErrorsRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier",
      },
      errors: {
        type: "array",
        items: {
          type: "ref",
          ref: "PassportElementError",
        },
        description: "A JSON-serialized Array describing the errors",
      },
    },
    required: ["user_id", "errors"],
  },
  SetPassportDataErrorsResponse: {
    type: "boolean",
  },
  SendGameRequest: {
    type: "object",
    properties: {
      business_connection_id: {
        type: "string",
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
      },
      chat_id: {
        type: "union",
        of: [
          {
            type: "integer",
            format: "int64",
          },
          {
            type: "string",
          },
        ],
        description:
          "Unique identifier for the target chat or username of the target bot in the format @username. Games can't be sent to channel direct messages chats and channel chats.",
      },
      message_thread_id: {
        type: "integer",
        format: "int64",
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
      },
      game_short_name: {
        type: "string",
        description:
          "Short name of the game, serves as the unique identifier for the game. Set up your games via @BotFather.",
      },
      disable_notification: {
        type: "boolean",
        description: "Sends the message silently. Users will receive a notification with no sound.",
      },
      protect_content: {
        type: "boolean",
        description: "Protects the contents of the sent message from forwarding and saving",
      },
      allow_paid_broadcast: {
        type: "boolean",
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
      },
      message_effect_id: {
        type: "string",
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
      },
      reply_parameters: {
        type: "ref",
        ref: "ReplyParameters",
        description: "Description of the message to reply to",
      },
      reply_markup: {
        type: "ref",
        ref: "InlineKeyboardMarkup",
        description:
          "A JSON-serialized object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game.",
      },
    },
    required: ["chat_id", "game_short_name"],
  },
  SetGameScoreRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "User identifier",
      },
      score: {
        type: "integer",
        description: "New score, must be non-negative",
      },
      force: {
        type: "boolean",
        description:
          "Pass True if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters.",
      },
      disable_edit_message: {
        type: "boolean",
        description:
          "Pass True if the game message should not be automatically edited to include the current scoreboard",
      },
      chat_id: {
        type: "integer",
        format: "int64",
        description: "Required if inline_message_id is not specified. Unique identifier for the target chat.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Required if inline_message_id is not specified. Identifier of the sent message.",
      },
      inline_message_id: {
        type: "string",
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
      },
    },
    required: ["user_id", "score"],
  },
  SetGameScoreResponse: {
    type: "union",
    of: [
      {
        type: "ref",
        ref: "Message",
      },
      {
        type: "boolean",
      },
    ],
  },
  GetGameHighScoresRequest: {
    type: "object",
    properties: {
      user_id: {
        type: "integer",
        format: "int64",
        description: "Target user id",
      },
      chat_id: {
        type: "integer",
        format: "int64",
        description: "Required if inline_message_id is not specified. Unique identifier for the target chat.",
      },
      message_id: {
        type: "integer",
        format: "int64",
        description: "Required if inline_message_id is not specified. Identifier of the sent message.",
      },
      inline_message_id: {
        type: "string",
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
      },
    },
    required: ["user_id"],
  },
  GetGameHighScoresResponse: {
    type: "array",
    items: {
      type: "ref",
      ref: "GameHighScore",
    },
  },
}
