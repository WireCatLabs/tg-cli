// GENERATED. DO NOT EDIT.
// Source: spec/bot/api.json
// Run: pnpm bot:generate

export type Update = {
  /** The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This identifier becomes especially handy if you're using webhooks, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially. */
  update_id: string
  /** Optional. New incoming message of any kind - text, photo, sticker, etc. */
  message?: Message
  /** Optional. New version of a message that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot. */
  edited_message?: Message
  /** Optional. New incoming channel post of any kind - text, photo, sticker, etc. */
  channel_post?: Message
  /** Optional. New version of a channel post that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot. */
  edited_channel_post?: Message
  /** Optional. The bot was connected to or disconnected from a business account, or a user edited an existing connection with the bot */
  business_connection?: BusinessConnection
  /** Optional. New message from a connected business account */
  business_message?: Message
  /** Optional. New version of a message from a connected business account */
  edited_business_message?: Message
  /** Optional. Messages were deleted from a connected business account */
  deleted_business_messages?: BusinessMessagesDeleted
  /** Optional. New guest message. The bot can use the field Message.guest_query_id and the method answerGuestQuery to send a message in response. */
  guest_message?: Message
  /** Optional. A reaction to a message was changed by a user. The bot must be an administrator in the chat and must explicitly specify "message_reaction" in the list of allowed_updates to receive these updates. The update isn't received for reactions set by bots. */
  message_reaction?: MessageReactionUpdated
  /** Optional. Reactions to a message with anonymous reactions were changed. The bot must be an administrator in the chat and must explicitly specify "message_reaction_count" in the list of allowed_updates to receive these updates. The updates are grouped and can be sent with delay up to a few minutes. */
  message_reaction_count?: MessageReactionCountUpdated
  /** Optional. New incoming inline query */
  inline_query?: InlineQuery
  /** Optional. The result of an inline query that was chosen by a user and sent to their chat partner. Please see our documentation on the feedback collecting for details on how to enable these updates for your bot. */
  chosen_inline_result?: ChosenInlineResult
  /** Optional. New incoming callback query */
  callback_query?: CallbackQuery
  /** Optional. New incoming shipping query. Only for invoices with flexible price. */
  shipping_query?: ShippingQuery
  /** Optional. New incoming pre-checkout query. Contains full information about checkout. */
  pre_checkout_query?: PreCheckoutQuery
  /** Optional. A user purchased paid media with a non-empty payload sent by the bot in a non-channel chat */
  purchased_paid_media?: PaidMediaPurchased
  /** Optional. New poll state. Bots receive only updates about manually stopped polls and polls, which are sent by the bot. */
  poll?: Poll
  /** Optional. A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself. */
  poll_answer?: PollAnswer
  /** Optional. The bot's chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user. */
  my_chat_member?: ChatMemberUpdated
  /** Optional. A chat member's status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify "chat_member" in the list of allowed_updates to receive these updates. */
  chat_member?: ChatMemberUpdated
  /** Optional. A request to join the chat has been sent. The bot must have the can_invite_users administrator right in the chat to receive these updates. */
  chat_join_request?: ChatJoinRequest
  /** Optional. A chat boost was added or changed. The bot must be an administrator in the chat to receive these updates. */
  chat_boost?: ChatBoostUpdated
  /** Optional. A boost was removed from a chat. The bot must be an administrator in the chat to receive these updates. */
  removed_chat_boost?: ChatBoostRemoved
  /** Optional. A new bot was created to be managed by the bot, or token or owner of a managed bot was changed */
  managed_bot?: ManagedBotUpdated
  /** Optional. User payment subscription has changed */
  subscription?: BotSubscriptionUpdated
  /** Optional. A user asked the bot to stop the generation of a message */
  stopped_message_generation?: MessageGenerationStopped
}

export type WebhookInfo = {
  /** Webhook URL, may be empty if webhook is not set up */
  url: string
  /** True, if a custom certificate was provided for webhook certificate checks */
  has_custom_certificate: boolean
  /** Number of updates awaiting delivery */
  pending_update_count: number
  /** Optional. Currently used webhook IP address */
  ip_address?: string
  /** Optional. Unix time for the most recent error that happened when trying to deliver an update via webhook */
  last_error_date?: number
  /** Optional. Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook */
  last_error_message?: string
  /** Optional. Unix time of the most recent error that happened when trying to synchronize available updates with Telegram datacenters */
  last_synchronization_error_date?: number
  /** Optional. The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery */
  max_connections?: number
  /** Optional. A list of update types the bot is subscribed to. Defaults to all update types except chat_member, message_reaction, and message_reaction_count. */
  allowed_updates?: Array<string>
}

export type User = {
  /** Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. */
  id: string
  /** True, if this user is a bot */
  is_bot: boolean
  /** User's or bot's first name */
  first_name: string
  /** Optional. User's or bot's last name */
  last_name?: string
  /** Optional. User's or bot's username */
  username?: string
  /** Optional. IETF language tag of the user's language */
  language_code?: string
  /** Optional. True, if this user is a Telegram Premium user */
  is_premium?: boolean
  /** Optional. True, if this user added the bot to the attachment menu */
  added_to_attachment_menu?: boolean
  /** Optional. True, if the bot can be invited to groups. Returned only in getMe. */
  can_join_groups?: boolean
  /** Optional. True, if privacy mode is disabled for the bot. Returned only in getMe. */
  can_read_all_group_messages?: boolean
  /** Optional. True, if the bot supports guest queries from chats it is not a member of. Returned only in getMe. */
  supports_guest_queries?: boolean
  /** Optional. True, if the bot supports inline queries. Returned only in getMe. */
  supports_inline_queries?: boolean
  /** Optional. True, if the bot can be connected to a user account to manage it. Returned only in getMe. */
  can_connect_to_business?: boolean
  /** Optional. True, if the bot has a main Web App. Returned only in getMe. */
  has_main_web_app?: boolean
  /** Optional. True, if the bot has forum topic mode enabled in private chats. Returned only in getMe. */
  has_topics_enabled?: boolean
  /** Optional. True, if the bot allows users to create and delete topics in private chats. Returned only in getMe. */
  allows_users_to_create_topics?: boolean
  /** Optional. True, if other bots can be created to be controlled by the bot. Returned only in getMe. */
  can_manage_bots?: boolean
  /** Optional. True, if the bot supports join request queries and can be assigned to process them. Returned only in getMe. */
  supports_join_request_queries?: boolean
}

export type Chat = {
  /** Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
  id: string
  /** Type of the chat, can be either "private", "group", "supergroup" or "channel" */
  type: string
  /** Optional. Title, for supergroups, channels and group chats */
  title?: string
  /** Optional. Username, for private chats, supergroups and channels if available */
  username?: string
  /** Optional. First name of the other party in a private chat */
  first_name?: string
  /** Optional. Last name of the other party in a private chat */
  last_name?: string
  /** Optional. True, if the supergroup chat is a forum (has topics enabled) */
  is_forum?: boolean
  /** Optional. True, if the chat is the direct messages chat of a channel */
  is_direct_messages?: boolean
}

export type ChatFullInfo = {
  /** Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
  id: string
  /** Type of the chat, can be either "private", "group", "supergroup" or "channel" */
  type: string
  /** Optional. Title, for supergroups, channels and group chats */
  title?: string
  /** Optional. Username, for private chats, supergroups and channels if available */
  username?: string
  /** Optional. First name of the other party in a private chat */
  first_name?: string
  /** Optional. Last name of the other party in a private chat */
  last_name?: string
  /** Optional. True, if the supergroup chat is a forum (has topics enabled) */
  is_forum?: boolean
  /** Optional. True, if the chat is the direct messages chat of a channel */
  is_direct_messages?: boolean
  /** Identifier of the accent color for the chat name and backgrounds of the chat photo, reply header, and link preview. See accent colors for more details. */
  accent_color_id: string
  /** The maximum number of reactions that can be set on a message in the chat */
  max_reaction_count: number
  /** Optional. Chat photo */
  photo?: ChatPhoto
  /** Optional. If non-empty, the list of all active chat usernames; for private chats, supergroups and channels */
  active_usernames?: Array<string>
  /** Optional. For private chats, the date of birth of the user */
  birthdate?: Birthdate
  /** Optional. For private chats with business accounts, the intro of the business */
  business_intro?: BusinessIntro
  /** Optional. For private chats with business accounts, the location of the business */
  business_location?: BusinessLocation
  /** Optional. For private chats with business accounts, the opening hours of the business */
  business_opening_hours?: BusinessOpeningHours
  /** Optional. For private chats, the personal channel of the user */
  personal_chat?: Chat
  /** Optional. Information about the corresponding channel chat; for direct messages chats only */
  parent_chat?: Chat
  /** Optional. List of available reactions allowed in the chat. If omitted, then all emoji reactions are allowed. */
  available_reactions?: Array<ReactionType>
  /** Optional. Custom emoji identifier of the emoji chosen by the chat for the reply header and link preview background */
  background_custom_emoji_id?: string
  /** Optional. Identifier of the accent color for the chat's profile background. See profile accent colors for more details. */
  profile_accent_color_id?: string
  /** Optional. Custom emoji identifier of the emoji chosen by the chat for its profile background */
  profile_background_custom_emoji_id?: string
  /** Optional. Custom emoji identifier of the emoji status of the chat or the other party in a private chat */
  emoji_status_custom_emoji_id?: string
  /** Optional. Expiration date of the emoji status of the chat or the other party in a private chat, in Unix time, if any */
  emoji_status_expiration_date?: number
  /** Optional. Bio of the other party in a private chat */
  bio?: string
  /** Optional. True, if privacy settings of the other party in the private chat allows to use tg://user?id=<user_id> links only in chats with the user */
  has_private_forwards?: boolean
  /** Optional. True, if the privacy settings of the other party restrict sending voice and video note messages in the private chat */
  has_restricted_voice_and_video_messages?: boolean
  /** Optional. True, if users need to join the supergroup before they can send messages */
  join_to_send_messages?: boolean
  /** Optional. True, if all users directly joining the supergroup without using an invite link need to be approved by supergroup administrators */
  join_by_request?: boolean
  /** Optional. Description, for groups, supergroups and channel chats */
  description?: string
  /** Optional. Primary invite link, for groups, supergroups and channel chats */
  invite_link?: string
  /** Optional. The most recent pinned message (by sending date) */
  pinned_message?: Message
  /** Optional. Default chat member permissions, for groups and supergroups */
  permissions?: ChatPermissions
  /** Information about types of gifts that are accepted by the chat or by the corresponding user for private chats */
  accepted_gift_types: AcceptedGiftTypes
  /** Optional. True, if paid media messages can be sent or forwarded to the channel chat. The field is available only for channel chats. */
  can_send_paid_media?: boolean
  /** Optional. For supergroups, the minimum allowed delay between consecutive messages sent by each unprivileged user; in seconds */
  slow_mode_delay?: number
  /** Optional. For supergroups, the minimum number of boosts that a non-administrator user needs to add in order to ignore slow mode and chat permissions */
  unrestrict_boost_count?: number
  /** Optional. The time after which all messages sent to the chat will be automatically deleted; in seconds */
  message_auto_delete_time?: number
  /** Optional. True, if aggressive anti-spam checks are enabled in the supergroup. The field is only available to chat administrators. */
  has_aggressive_anti_spam_enabled?: boolean
  /** Optional. True, if non-administrators can only get the list of bots and administrators in the chat */
  has_hidden_members?: boolean
  /** Optional. True, if messages from the chat can't be forwarded to other chats */
  has_protected_content?: boolean
  /** Optional. True, if new chat members will have access to old messages; available only to chat administrators */
  has_visible_history?: boolean
  /** Optional. For supergroups, name of the group sticker set */
  sticker_set_name?: string
  /** Optional. True, if the bot can change the group sticker set */
  can_set_sticker_set?: boolean
  /** Optional. For supergroups, the name of the group's custom emoji sticker set. Custom emoji from this set can be used by all users and bots in the group. */
  custom_emoji_sticker_set_name?: string
  /** Optional. Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier. */
  linked_chat_id?: string
  /** Optional. For supergroups, the location to which the supergroup is connected */
  location?: ChatLocation
  /** Optional. For private chats, the rating of the user if any */
  rating?: UserRating
  /** Optional. For private chats, the first audio added to the profile of the user */
  first_profile_audio?: Audio
  /** Optional. The color scheme based on a unique gift that must be used for the chat's name, message replies and link previews */
  unique_gift_colors?: UniqueGiftColors
  /** Optional. The number of Telegram Stars a general user has to pay to send a message to the chat */
  paid_message_star_count?: number
  /** Optional. The bot that processes join request queries in the chat. The field is only available to chat administrators. */
  guard_bot?: User
  /** Optional. The Community to which the chat belongs */
  community?: Community
}

export type Message = {
  /** Unique message identifier inside this chat; 0 for ephemeral messages. In specific instances (e.g., a message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent. */
  message_id: string
  /** Optional. Unique identifier of a message thread or forum topic to which the message belongs; for supergroups and private chats only */
  message_thread_id?: string
  /** Optional. Information about the direct messages chat topic that contains the message */
  direct_messages_topic?: DirectMessagesTopic
  /** Optional. Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats. */
  from?: User
  /** Optional. Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel's discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field from contains a fake sender user in non-channel chats. */
  sender_chat?: Chat
  /** Optional. If the sender of the message boosted the chat, the number of boosts added by the user */
  sender_boost_count?: number
  /** Optional. The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account. */
  sender_business_bot?: User
  /** Optional. Tag or custom title of the sender of the message; for supergroups only */
  sender_tag?: string
  /** Optional. For ephemeral messages, the user who received the message */
  receiver_user?: User
  /** Optional. For ephemeral messages, identifier of the ephemeral message inside this chat. The identifier may be reused for another ephemeral message after the message is deleted or expires. */
  ephemeral_message_id?: string
  /** Date the message was sent in Unix time. It is always a positive number, representing a valid date. */
  date: number
  /** Optional. The unique identifier for the guest query. Use this identifier with the method answerGuestQuery to send a response message. If non-empty, the message belongs to the chat where the guest bot was summoned, which may not coincide with other existing bot chats sharing the same identifier. */
  guest_query_id?: string
  /** Optional. Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier. */
  business_connection_id?: string
  /** Chat the message belongs to */
  chat: Chat
  /** Optional. Information about the original message for forwarded messages */
  forward_origin?: MessageOrigin
  /** Optional. True, if the message is sent to a topic in a forum supergroup or a private chat with the bot */
  is_topic_message?: boolean
  /** Optional. True, if the message is a channel post that was automatically forwarded to the connected discussion group */
  is_automatic_forward?: boolean
  /** Optional. For replies in the same chat and message thread, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply. If the message is a reply to an ephemeral message, then this field may be omitted. */
  reply_to_message?: Message
  /** Optional. Information about the message that is being replied to, which may come from another chat or forum topic */
  external_reply?: ExternalReplyInfo
  /** Optional. For replies that quote part of the original message, the quoted part of the message */
  quote?: TextQuote
  /** Optional. For replies to a story, the original story */
  reply_to_story?: Story
  /** Optional. Identifier of the specific checklist task that is being replied to */
  reply_to_checklist_task_id?: string
  /** Optional. Persistent identifier of the specific poll option that is being replied to */
  reply_to_poll_option_id?: string
  /** Optional. Bot through which the message was sent */
  via_bot?: User
  /** Optional. For a message sent by a guest bot, this is the user whose original message triggered the bot's response */
  guest_bot_caller_user?: User
  /** Optional. For a message sent by a guest bot, this is the chat whose original message triggered the bot's response */
  guest_bot_caller_chat?: Chat
  /** Optional. Date the message was last edited in Unix time */
  edit_date?: number
  /** Optional. True, if the message can't be forwarded */
  has_protected_content?: boolean
  /** Optional. True, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message */
  is_from_offline?: boolean
  /** Optional. True, if the message is a paid post. Note that such posts must not be deleted for 24 hours to receive the payment and can't be edited. */
  is_paid_post?: boolean
  /** Optional. The unique identifier inside this chat of a media message group this message belongs to */
  media_group_id?: string
  /** Optional. Signature of the post author for messages in channels, or the custom title of an anonymous group administrator */
  author_signature?: string
  /** Optional. The number of Telegram Stars that were paid by the sender of the message to send it */
  paid_star_count?: number
  /** Optional. For text messages, the actual UTF-8 text of the message */
  text?: string
  /** Optional. For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text */
  entities?: Array<MessageEntity>
  /** Optional. Options used for link preview generation for the message, if it is a text message and link preview options were changed */
  link_preview_options?: LinkPreviewOptions
  /** Optional. Information about suggested post parameters if the message is a suggested post in a channel direct messages chat. If the message is an approved or declined suggested post, then it can't be edited. */
  suggested_post_info?: SuggestedPostInfo
  /** Optional. Unique identifier of the message effect added to the message */
  effect_id?: string
  /** Optional. Message is a rich formatted message */
  rich_message?: RichMessage
  /** Optional. Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set. */
  animation?: Animation
  /** Optional. Message is an audio file, information about the file */
  audio?: Audio
  /** Optional. Message is a general file, information about the file */
  document?: Document
  /** Optional. Message is a live photo, information about the live photo. For backward compatibility, when this field is set, the photo field will also be set. */
  live_photo?: LivePhoto
  /** Optional. Message contains paid media; information about the paid media */
  paid_media?: PaidMediaInfo
  /** Optional. Message is a photo, available sizes of the photo */
  photo?: Array<PhotoSize>
  /** Optional. Message is a sticker, information about the sticker */
  sticker?: Sticker
  /** Optional. Message is a forwarded story */
  story?: Story
  /** Optional. Message is a video, information about the video */
  video?: Video
  /** Optional. Message is a video note, information about the video message */
  video_note?: VideoNote
  /** Optional. Message is a voice message, information about the file */
  voice?: Voice
  /** Optional. Caption for the animation, audio, document, paid media, photo, video or voice */
  caption?: string
  /** Optional. For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption */
  caption_entities?: Array<MessageEntity>
  /** Optional. True, if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. True, if the message media is covered by a spoiler animation */
  has_media_spoiler?: boolean
  /** Optional. Message is a checklist */
  checklist?: Checklist
  /** Optional. Message is a shared contact, information about the contact */
  contact?: Contact
  /** Optional. Message is a dice with random value */
  dice?: Dice
  /** Optional. Message is a game, information about the game. More about games: https://core.telegram.org/bots/api#games */
  game?: Game
  /** Optional. Message is a native poll, information about the poll */
  poll?: Poll
  /** Optional. Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set. */
  venue?: Venue
  /** Optional. Message is a shared location, information about the location */
  location?: Location
  /** Optional. New members that were added to the group or supergroup and information about them (the bot itself may be one of these members) */
  new_chat_members?: Array<User>
  /** Optional. A member was removed from the group, information about them (this member may be the bot itself) */
  left_chat_member?: User
  /** Optional. Service message: chat owner has left */
  chat_owner_left?: ChatOwnerLeft
  /** Optional. Service message: chat owner has changed */
  chat_owner_changed?: ChatOwnerChanged
  /** Optional. A chat title was changed to this value */
  new_chat_title?: string
  /** Optional. A chat photo was change to this value */
  new_chat_photo?: Array<PhotoSize>
  /** Optional. Service message: the chat photo was deleted */
  delete_chat_photo?: boolean
  /** Optional. Service message: the group has been created */
  group_chat_created?: boolean
  /** Optional. Service message: the supergroup has been created. This field can't be received in a message coming through updates, because bot can't be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup. */
  supergroup_chat_created?: boolean
  /** Optional. Service message: the channel has been created. This field can't be received in a message coming through updates, because bot can't be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel. */
  channel_chat_created?: boolean
  /** Optional. Service message: auto-delete timer settings changed in the chat */
  message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged
  /** Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
  migrate_to_chat_id?: string
  /** Optional. The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
  migrate_from_chat_id?: string
  /** Optional. Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply. */
  pinned_message?: MaybeInaccessibleMessage
  /** Optional. Message is an invoice for a payment, information about the invoice. More about payments: https://core.telegram.org/bots/api#payments */
  invoice?: Invoice
  /** Optional. Message is a service message about a successful payment, information about the payment. More about payments: https://core.telegram.org/bots/api#payments */
  successful_payment?: SuccessfulPayment
  /** Optional. Message is a service message about a refunded payment, information about the payment. More about payments: https://core.telegram.org/bots/api#payments */
  refunded_payment?: RefundedPayment
  /** Optional. Service message: users were shared with the bot */
  users_shared?: UsersShared
  /** Optional. Service message: a chat was shared with the bot */
  chat_shared?: ChatShared
  /** Optional. Service message: a regular gift was sent or received */
  gift?: GiftInfo
  /** Optional. Service message: a unique gift was sent or received */
  unique_gift?: UniqueGiftInfo
  /** Optional. Service message: upgrade of a gift was purchased after the gift was sent */
  gift_upgrade_sent?: GiftInfo
  /** Optional. The domain name of the website on which the user has logged in. More about Telegram Login: https://core.telegram.org/widgets/login */
  connected_website?: string
  /** Optional. Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method requestWriteAccess */
  write_access_allowed?: WriteAccessAllowed
  /** Optional. Telegram Passport data */
  passport_data?: PassportData
  /** Optional. Service message: a user in the chat triggered another user's proximity alert while sharing Live Location */
  proximity_alert_triggered?: ProximityAlertTriggered
  /** Optional. Service message: user boosted the chat */
  boost_added?: ChatBoostAdded
  /** Optional. Service message: chat background set */
  chat_background_set?: ChatBackground
  /** Optional. Service message: some tasks in a checklist were marked as done or not done */
  checklist_tasks_done?: ChecklistTasksDone
  /** Optional. Service message: tasks were added to a checklist */
  checklist_tasks_added?: ChecklistTasksAdded
  /** Optional. Service message: chat or bot added to a Community */
  community_chat_added?: CommunityChatAdded
  /** Optional. Service message: chat was joined by a user from a Community */
  community_chat_joined?: CommunityChatJoined
  /** Optional. Service message: chat or bot removed from a Community */
  community_chat_removed?: CommunityChatRemoved
  /** Optional. Service message: the price for paid messages in the corresponding direct messages chat of a channel has changed */
  direct_message_price_changed?: DirectMessagePriceChanged
  /** Optional. Service message: forum topic created */
  forum_topic_created?: ForumTopicCreated
  /** Optional. Service message: forum topic edited */
  forum_topic_edited?: ForumTopicEdited
  /** Optional. Service message: forum topic closed */
  forum_topic_closed?: ForumTopicClosed
  /** Optional. Service message: forum topic reopened */
  forum_topic_reopened?: ForumTopicReopened
  /** Optional. Service message: the 'General' forum topic hidden */
  general_forum_topic_hidden?: GeneralForumTopicHidden
  /** Optional. Service message: the 'General' forum topic unhidden */
  general_forum_topic_unhidden?: GeneralForumTopicUnhidden
  /** Optional. Service message: a scheduled giveaway was created */
  giveaway_created?: GiveawayCreated
  /** Optional. The message is a scheduled giveaway message */
  giveaway?: Giveaway
  /** Optional. A giveaway with public winners was completed */
  giveaway_winners?: GiveawayWinners
  /** Optional. Service message: a giveaway without public winners was completed */
  giveaway_completed?: GiveawayCompleted
  /** Optional. Service message: user created a bot that will be managed by the current bot */
  managed_bot_created?: ManagedBotCreated
  /** Optional. Service message: the price for paid messages has changed in the chat */
  paid_message_price_changed?: PaidMessagePriceChanged
  /** Optional. Service message: answer option was added to a poll */
  poll_option_added?: PollOptionAdded
  /** Optional. Service message: answer option was deleted from a poll */
  poll_option_deleted?: PollOptionDeleted
  /** Optional. Service message: a suggested post was approved */
  suggested_post_approved?: SuggestedPostApproved
  /** Optional. Service message: approval of a suggested post has failed */
  suggested_post_approval_failed?: SuggestedPostApprovalFailed
  /** Optional. Service message: a suggested post was declined */
  suggested_post_declined?: SuggestedPostDeclined
  /** Optional. Service message: payment for a suggested post was received */
  suggested_post_paid?: SuggestedPostPaid
  /** Optional. Service message: payment for a suggested post was refunded */
  suggested_post_refunded?: SuggestedPostRefunded
  /** Optional. Service message: video chat scheduled */
  video_chat_scheduled?: VideoChatScheduled
  /** Optional. Service message: video chat started */
  video_chat_started?: VideoChatStarted
  /** Optional. Service message: video chat ended */
  video_chat_ended?: VideoChatEnded
  /** Optional. Service message: new participants invited to a video chat */
  video_chat_participants_invited?: VideoChatParticipantsInvited
  /** Optional. Service message: data sent by a Web App */
  web_app_data?: WebAppData
  /** Optional. Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons. */
  reply_markup?: InlineKeyboardMarkup
}

export type MessageId = {
  /** Unique message identifier. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent. */
  message_id: string
}

export type InaccessibleMessage = {
  /** Chat the message belonged to */
  chat: Chat
  /** Unique message identifier inside the chat */
  message_id: string
  /** Always 0. The field can be used to differentiate regular and inaccessible messages. */
  date: number
}

export type MaybeInaccessibleMessage = Message | InaccessibleMessage

export type MessageEntity = {
  /** Type of the entity. Currently, can be "mention" (@username), "hashtag" (#hashtag or #hashtag@chatusername), "cashtag" ($USD or $USD@chatusername), "bot_command" (/start@jobs_bot), "url" (https://telegram.org), "email" (do-not-reply@telegram.org), "phone_number" (+1-212-555-0123), "bold" (bold text), "italic" (italic text), "underline" (underlined text), "strikethrough" (strikethrough text), "spoiler" (spoiler message), "blockquote" (block quotation), "expandable_blockquote" (collapsed-by-default block quotation), "code" (monowidth string), "pre" (monowidth block), "text_link" (for clickable text URLs), "text_mention" (for users without usernames), "custom_emoji" (for inline custom emoji stickers), or "date_time" (for formatted date and time). */
  type: string
  /** Offset in UTF-16 code units to the start of the entity */
  offset: number
  /** Length of the entity in UTF-16 code units */
  length: number
  /** Optional. For "text_link" only, URL that will be opened after user taps on the text */
  url?: string
  /** Optional. For "text_mention" only, the mentioned user */
  user?: User
  /** Optional. For "pre" only, the programming language of the entity text */
  language?: string
  /** Optional. For "custom_emoji" only, unique identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker. */
  custom_emoji_id?: string
  /** Optional. For "date_time" only, the Unix time associated with the entity */
  unix_time?: number
  /** Optional. For "date_time" only, the string that defines the formatting of the date and time. See date-time entity formatting for more details. */
  date_time_format?: string
}

export type TextQuote = {
  /** Text of the quoted part of a message that is replied to by the given message */
  text: string
  /** Optional. Special entities that appear in the quote. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are kept in quotes. */
  entities?: Array<MessageEntity>
  /** Approximate quote position in the original message in UTF-16 code units as specified by the sender */
  position: number
  /** Optional. True, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server. */
  is_manual?: boolean
}

export type ExternalReplyInfo = {
  /** Origin of the message replied to by the given message */
  origin: MessageOrigin
  /** Optional. Chat the original message belongs to. Available only if the chat is a supergroup or a channel. */
  chat?: Chat
  /** Optional. Unique message identifier inside the original chat. Available only if the original chat is a supergroup or a channel. */
  message_id?: string
  /** Optional. Options used for link preview generation for the original message, if it is a text message */
  link_preview_options?: LinkPreviewOptions
  /** Optional. Message is an animation, information about the animation */
  animation?: Animation
  /** Optional. Message is an audio file, information about the file */
  audio?: Audio
  /** Optional. Message is a general file, information about the file */
  document?: Document
  /** Optional. Message is a live photo, information about the live photo */
  live_photo?: LivePhoto
  /** Optional. Message contains paid media; information about the paid media */
  paid_media?: PaidMediaInfo
  /** Optional. Message is a photo, available sizes of the photo */
  photo?: Array<PhotoSize>
  /** Optional. Message is a sticker, information about the sticker */
  sticker?: Sticker
  /** Optional. Message is a forwarded story */
  story?: Story
  /** Optional. Message is a video, information about the video */
  video?: Video
  /** Optional. Message is a video note, information about the video message */
  video_note?: VideoNote
  /** Optional. Message is a voice message, information about the file */
  voice?: Voice
  /** Optional. True, if the message media is covered by a spoiler animation */
  has_media_spoiler?: boolean
  /** Optional. Message is a checklist */
  checklist?: Checklist
  /** Optional. Message is a shared contact, information about the contact */
  contact?: Contact
  /** Optional. Message is a dice with random value */
  dice?: Dice
  /** Optional. Message is a game, information about the game. More about games: https://core.telegram.org/bots/api#games */
  game?: Game
  /** Optional. Message is a scheduled giveaway, information about the giveaway */
  giveaway?: Giveaway
  /** Optional. A giveaway with public winners was completed */
  giveaway_winners?: GiveawayWinners
  /** Optional. Message is an invoice for a payment, information about the invoice. More about payments: https://core.telegram.org/bots/api#payments */
  invoice?: Invoice
  /** Optional. Message is a shared location, information about the location */
  location?: Location
  /** Optional. Message is a native poll, information about the poll */
  poll?: Poll
  /** Optional. Message is a venue, information about the venue */
  venue?: Venue
}

export type ReplyParameters = {
  /** Optional. Identifier of the message that will be replied to in the current chat, or in the chat chat_id if it is specified. Required if ephemeral_message_id isn't specified. */
  message_id?: string
  /** Optional. If the message to be replied to is from a different chat, unique identifier for the chat or username of the bot, supergroup or channel in the format @username. Not supported for messages sent on behalf of a business account, messages from channel direct messages chats and ephemeral messages. */
  chat_id?: string | string
  /** Optional. Identifier of the incoming ephemeral message that will be replied to in the current chat. A reply to an ephemeral message must itself be an ephemeral message. An ephemeral message may only be replied to within 15 seconds of being sent. Required if message_id isn't specified. */
  ephemeral_message_id?: string
  /** Optional. Pass True if the message should be sent even if the specified message to be replied to is not found. Always False for replies in another chat or forum topic, and sent ephemeral messages. Always True for messages sent on behalf of a business account. */
  allow_sending_without_reply?: boolean
  /** Optional. Quoted part of the message to be replied to; 0-1024 characters after entities parsing. The quote must be an exact substring of the message to be replied to, including bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities. The message will fail to send if the quote isn't found in the original message. Ignored for ephemeral messages. */
  quote?: string
  /** Optional. Mode for parsing entities in the quote. See formatting options for more details. */
  quote_parse_mode?: string
  /** Optional. A JSON-serialized list of special entities that appear in the quote. It can be specified instead of quote_parse_mode. */
  quote_entities?: Array<MessageEntity>
  /** Optional. Position of the quote in the original message in UTF-16 code units */
  quote_position?: number
  /** Optional. Identifier of the specific checklist task to be replied to */
  checklist_task_id?: string
  /** Optional. Persistent identifier of the specific poll option to be replied to */
  poll_option_id?: string
}

export type EphemeralMessageParameters = {
  /** Identifier of the user who will receive the message. It is not guaranteed that the user will receive the message, especially if they are offline. See here for more details. */
  receiver_user_id: string
  /** Optional. Identifier of the callback query which triggered the message, if any */
  callback_query_id?: string
  /** Optional. Pass True if the ephemeral message must be shown in place of the original message. Must be False for callback queries from ephemeral messages, which must be edited using regular editEphemeralMessage... methods. */
  replace_callback_query_message?: boolean
}

export type MessageOrigin = MessageOriginUser | MessageOriginHiddenUser | MessageOriginChat | MessageOriginChannel

export type MessageOriginUser = {
  /** Type of the message origin, always "user" */
  type: "user"
  /** Date the message was sent originally in Unix time */
  date: number
  /** User that sent the message originally */
  sender_user: User
}

export type MessageOriginHiddenUser = {
  /** Type of the message origin, always "hidden_user" */
  type: "hidden_user"
  /** Date the message was sent originally in Unix time */
  date: number
  /** Name of the user that sent the message originally */
  sender_user_name: string
}

export type MessageOriginChat = {
  /** Type of the message origin, always "chat" */
  type: "chat"
  /** Date the message was sent originally in Unix time */
  date: number
  /** Chat that sent the message originally */
  sender_chat: Chat
  /** Optional. For messages originally sent by an anonymous chat administrator, original message author signature */
  author_signature?: string
}

export type MessageOriginChannel = {
  /** Type of the message origin, always "channel" */
  type: "channel"
  /** Date the message was sent originally in Unix time */
  date: number
  /** Channel chat to which the message was originally sent */
  chat: Chat
  /** Unique message identifier inside the chat */
  message_id: string
  /** Optional. Signature of the original post author */
  author_signature?: string
}

export type PhotoSize = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Photo width */
  width: number
  /** Photo height */
  height: number
  /** Optional. File size in bytes */
  file_size?: number
}

export type Animation = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Video width as defined by the sender */
  width: number
  /** Video height as defined by the sender */
  height: number
  /** Duration of the video in seconds as defined by the sender */
  duration: number
  /** Optional. Animation thumbnail as defined by the sender */
  thumbnail?: PhotoSize
  /** Optional. Original animation filename as defined by the sender */
  file_name?: string
  /** Optional. MIME type of the file as defined by the sender */
  mime_type?: string
  /** Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
  file_size?: number
}

export type Audio = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Duration of the audio in seconds as defined by the sender */
  duration: number
  /** Optional. Performer of the audio as defined by the sender or by audio tags */
  performer?: string
  /** Optional. Title of the audio as defined by the sender or by audio tags */
  title?: string
  /** Optional. Original filename as defined by the sender */
  file_name?: string
  /** Optional. MIME type of the file as defined by the sender */
  mime_type?: string
  /** Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
  file_size?: number
  /** Optional. Thumbnail of the album cover to which the music file belongs */
  thumbnail?: PhotoSize
}

export type Document = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Optional. Document thumbnail as defined by the sender */
  thumbnail?: PhotoSize
  /** Optional. Original filename as defined by the sender */
  file_name?: string
  /** Optional. MIME type of the file as defined by the sender */
  mime_type?: string
  /** Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
  file_size?: number
}

export type LivePhoto = {
  /** Optional. Available sizes of the corresponding static photo */
  photo?: Array<PhotoSize>
  /** Identifier for the video file which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for the video file which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Video width as defined by the sender */
  width: number
  /** Video height as defined by the sender */
  height: number
  /** Duration of the video in seconds as defined by the sender */
  duration: number
  /** Optional. MIME type of the file as defined by the sender */
  mime_type?: string
  /** Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
  file_size?: number
}

export type Story = {
  /** Chat that posted the story */
  chat: Chat
  /** Unique identifier for the story in the chat */
  id: string
}

export type VideoQuality = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Video width */
  width: number
  /** Video height */
  height: number
  /** Codec that was used to encode the video, for example, "h264", "h265", or "av01" */
  codec: string
  /** Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
  file_size?: number
}

export type Video = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Video width as defined by the sender */
  width: number
  /** Video height as defined by the sender */
  height: number
  /** Duration of the video in seconds as defined by the sender */
  duration: number
  /** Optional. Video thumbnail */
  thumbnail?: PhotoSize
  /** Optional. Available sizes of the cover of the video in the message */
  cover?: Array<PhotoSize>
  /** Optional. Timestamp in seconds from which the video will play in the message */
  start_timestamp?: number
  /** Optional. List of available qualities of the video */
  qualities?: Array<VideoQuality>
  /** Optional. Original filename as defined by the sender */
  file_name?: string
  /** Optional. MIME type of the file as defined by the sender */
  mime_type?: string
  /** Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
  file_size?: number
}

export type VideoNote = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Video width and height (diameter of the video message) as defined by the sender */
  length: number
  /** Duration of the video in seconds as defined by the sender */
  duration: number
  /** Optional. Video thumbnail */
  thumbnail?: PhotoSize
  /** Optional. File size in bytes */
  file_size?: number
}

export type Voice = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Duration of the audio in seconds as defined by the sender */
  duration: number
  /** Optional. MIME type of the file as defined by the sender */
  mime_type?: string
  /** Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
  file_size?: number
}

export type PaidMediaInfo = {
  /** The number of Telegram Stars that must be paid to buy access to the media */
  star_count: number
  /** Information about the paid media */
  paid_media: Array<PaidMedia>
}

export type PaidMedia = PaidMediaLivePhoto | PaidMediaPhoto | PaidMediaPreview | PaidMediaVideo

export type PaidMediaLivePhoto = {
  /** Type of the paid media, always "live_photo" */
  type: "live_photo"
  /** The photo */
  live_photo: LivePhoto
}

export type PaidMediaPhoto = {
  /** Type of the paid media, always "photo" */
  type: "photo"
  /** The photo */
  photo: Array<PhotoSize>
}

export type PaidMediaPreview = {
  /** Type of the paid media, always "preview" */
  type: "preview"
  /** Optional. Media width as defined by the sender */
  width?: number
  /** Optional. Media height as defined by the sender */
  height?: number
  /** Optional. Duration of the media in seconds as defined by the sender */
  duration?: number
}

export type PaidMediaVideo = {
  /** Type of the paid media, always "video" */
  type: "video"
  /** The video */
  video: Video
}

export type Contact = {
  /** Contact's phone number */
  phone_number: string
  /** Contact's first name */
  first_name: string
  /** Optional. Contact's last name */
  last_name?: string
  /** Optional. Contact's user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. */
  user_id?: string
  /** Optional. Additional data about the contact in the form of a vCard */
  vcard?: string
}

export type Dice = {
  /** Emoji on which the dice throw animation is based */
  emoji: string
  /** Value of the dice, 1-6 for "🎲", "🎯" and "🎳" base emoji, 1-5 for "🏀" and "⚽" base emoji, 1-64 for "🎰" base emoji */
  value: number
}

export type Link = {
  /** URL of the link */
  url: string
}

export type PollMedia = {
  /** Optional. Media is an animation, information about the animation */
  animation?: Animation
  /** Optional. Media is an audio file, information about the file; currently, can't be received in a poll option */
  audio?: Audio
  /** Optional. Media is a general file, information about the file; currently, can't be received in a poll option */
  document?: Document
  /** Optional. The HTTP link attached to the poll option */
  link?: Link
  /** Optional. Media is a live photo, information about the live photo */
  live_photo?: LivePhoto
  /** Optional. Media is a shared location, information about the location */
  location?: Location
  /** Optional. Media is a photo, available sizes of the photo */
  photo?: Array<PhotoSize>
  /** Optional. Media is a sticker, information about the sticker; currently, for poll options only */
  sticker?: Sticker
  /** Optional. Media is a venue, information about the venue */
  venue?: Venue
  /** Optional. Media is a video, information about the video */
  video?: Video
}

export type InputPollMedia =
  | InputMediaAnimation
  | InputMediaAudio
  | InputMediaDocument
  | InputMediaLivePhoto
  | InputMediaLocation
  | InputMediaPhoto
  | InputMediaVenue
  | InputMediaVideo

export type InputPollOptionMedia =
  | InputMediaAnimation
  | InputMediaLink
  | InputMediaLivePhoto
  | InputMediaLocation
  | InputMediaPhoto
  | InputMediaSticker
  | InputMediaVenue
  | InputMediaVideo

export type PollOption = {
  /** Unique identifier of the option, persistent on option addition and deletion */
  persistent_id: string
  /** Option text, 1-100 characters */
  text: string
  /** Optional. Special entities that appear in the option text. Currently, only custom emoji entities are allowed in poll option texts */
  text_entities?: Array<MessageEntity>
  /** Optional. Media added to the poll option */
  media?: PollMedia
  /** Number of users who voted for this option; may be 0 if unknown */
  voter_count: number
  /** Optional. User who added the option; omitted if the option wasn't added by a user after poll creation */
  added_by_user?: User
  /** Optional. Chat that added the option; omitted if the option wasn't added by a chat after poll creation */
  added_by_chat?: Chat
  /** Optional. Point in time (Unix timestamp) when the option was added; omitted if the option existed in the original poll */
  addition_date?: number
}

export type InputPollOption = {
  /** Option text, 1-100 characters */
  text: string
  /** Optional. Mode for parsing entities in the text. See formatting options for more details. Currently, only custom emoji entities are allowed. */
  text_parse_mode?: string
  /** Optional. A JSON-serialized list of special entities that appear in the poll option text. It can be specified instead of text_parse_mode. */
  text_entities?: Array<MessageEntity>
  /** Optional. Media added to the poll option */
  media?: InputPollOptionMedia
}

export type PollAnswer = {
  /** Unique poll identifier */
  poll_id: string
  /** Optional. The chat that changed the answer to the poll, if the voter is anonymous */
  voter_chat?: Chat
  /** Optional. The user that changed the answer to the poll, if the voter isn't anonymous */
  user?: User
  /** 0-based identifiers of chosen answer options. May be empty if the vote was retracted. */
  option_ids: Array<number>
  /** Persistent identifiers of the chosen answer options. May be empty if the vote was retracted. */
  option_persistent_ids: Array<string>
}

export type Poll = {
  /** Unique poll identifier */
  id: string
  /** Poll question, 1-300 characters */
  question: string
  /** Optional. Special entities that appear in the question. Currently, only custom emoji entities are allowed in poll questions */
  question_entities?: Array<MessageEntity>
  /** List of poll options */
  options: Array<PollOption>
  /** Total number of users that voted in the poll */
  total_voter_count: number
  /** True, if the poll is closed */
  is_closed: boolean
  /** True, if the poll is anonymous */
  is_anonymous: boolean
  /** Poll type, currently can be "regular" or "quiz" */
  type: string
  /** True, if the poll allows multiple answers */
  allows_multiple_answers: boolean
  /** True, if the poll allows to change the chosen answer options */
  allows_revoting: boolean
  /** True if voting is limited to users who have been members of the chat where the poll was originally sent for more than 24 hours */
  members_only: boolean
  /** Optional. A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll. The country code "FT" is used for users with anonymous numbers. If omitted, then users from any country can participate in the poll. */
  country_codes?: Array<string>
  /** Optional. Array of 0-based identifiers of the correct answer options. Available only for polls in quiz mode which are closed or were sent (not forwarded) by the bot or to the private chat with the bot. */
  correct_option_ids?: Array<number>
  /** Optional. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters */
  explanation?: string
  /** Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the explanation */
  explanation_entities?: Array<MessageEntity>
  /** Optional. Media added to the quiz explanation */
  explanation_media?: PollMedia
  /** Optional. Amount of time in seconds the poll will be active after creation */
  open_period?: number
  /** Optional. Point in time (Unix timestamp) when the poll will be automatically closed */
  close_date?: number
  /** Optional. Description of the poll; for polls inside the Message object only */
  description?: string
  /** Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the description */
  description_entities?: Array<MessageEntity>
  /** Optional. Media added to the poll description; for polls inside the Message object only */
  media?: PollMedia
}

export type ChecklistTask = {
  /** Unique identifier of the task */
  id: string
  /** Text of the task */
  text: string
  /** Optional. Special entities that appear in the task text */
  text_entities?: Array<MessageEntity>
  /** Optional. User that completed the task; omitted if the task wasn't completed by a user */
  completed_by_user?: User
  /** Optional. Chat that completed the task; omitted if the task wasn't completed by a chat */
  completed_by_chat?: Chat
  /** Optional. Point in time (Unix timestamp) when the task was completed; 0 if the task wasn't completed */
  completion_date?: number
}

export type Checklist = {
  /** Title of the checklist */
  title: string
  /** Optional. Special entities that appear in the checklist title */
  title_entities?: Array<MessageEntity>
  /** List of tasks in the checklist */
  tasks: Array<ChecklistTask>
  /** Optional. True, if users other than the creator of the list can add tasks to the list */
  others_can_add_tasks?: boolean
  /** Optional. True, if users other than the creator of the list can mark tasks as done or not done */
  others_can_mark_tasks_as_done?: boolean
}

export type InputChecklistTask = {
  /** Unique identifier of the task; must be positive and unique among all task identifiers currently present in the checklist */
  id: string
  /** Text of the task; 1-100 characters after entities parsing */
  text: string
  /** Optional. Mode for parsing entities in the text. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the text, which can be specified instead of parse_mode. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are allowed. */
  text_entities?: Array<MessageEntity>
}

export type InputChecklist = {
  /** Title of the checklist; 1-255 characters after entities parsing */
  title: string
  /** Optional. Mode for parsing entities in the title. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the title, which can be specified instead of parse_mode. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are allowed. */
  title_entities?: Array<MessageEntity>
  /** List of 1-30 tasks in the checklist */
  tasks: Array<InputChecklistTask>
  /** Optional. Pass True if other users can add tasks to the checklist */
  others_can_add_tasks?: boolean
  /** Optional. Pass True if other users can mark tasks as done or not done in the checklist */
  others_can_mark_tasks_as_done?: boolean
}

export type Location = {
  /** Latitude as defined by the sender */
  latitude: number
  /** Longitude as defined by the sender */
  longitude: number
  /** Optional. The radius of uncertainty for the location, measured in meters; 0-1500 */
  horizontal_accuracy?: number
  /** Optional. Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only. */
  live_period?: number
  /** Optional. The direction in which user is moving, in degrees; 1-360. For active live locations only. */
  heading?: number
  /** Optional. The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only. */
  proximity_alert_radius?: number
}

export type Venue = {
  /** Venue location. Can't be a live location. */
  location: Location
  /** Name of the venue */
  title: string
  /** Address of the venue */
  address: string
  /** Optional. Foursquare identifier of the venue */
  foursquare_id?: string
  /** Optional. Foursquare type of the venue. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".) */
  foursquare_type?: string
  /** Optional. Google Places identifier of the venue */
  google_place_id?: string
  /** Optional. Google Places type of the venue. (See supported types.) */
  google_place_type?: string
}

export type WebAppData = {
  /** The data. Be aware that a bad client can send arbitrary data in this field. */
  data: string
  /** Text of the web_app keyboard button from which the Web App was opened. Be aware that a bad client can send arbitrary data in this field. */
  button_text: string
}

export type ProximityAlertTriggered = {
  /** User that triggered the alert */
  traveler: User
  /** User that set the alert */
  watcher: User
  /** The distance between the users */
  distance: number
}

export type MessageAutoDeleteTimerChanged = {
  /** New auto-delete time for messages in the chat; in seconds */
  message_auto_delete_time: number
}

export type ManagedBotCreated = {
  /** Information about the bot. The bot's token can be fetched using the method getManagedBotToken. */
  bot: User
}

export type ManagedBotUpdated = {
  /** User that created the bot */
  user: User
  /** Information about the bot. Token of the bot can be fetched using the method getManagedBotToken. */
  bot: User
}

export type BotSubscriptionUpdated = {
  /** User who subscribed for payments toward the bot */
  user: User
  /** Bot-specified invoice payload */
  invoice_payload: string
  /** The new state of the subscription. Currently, it can be one of "canceled" if the user canceled the subscription, "active" if the user re-enabled a previously canceled subscription, or "failed" if payment for the subscription failed. */
  state: string
}

export type MessageGenerationStopped = {
  /** Chat in which the message is generated */
  chat: Chat
  /** Optional. Unique identifier of the message thread in which the message is generated */
  message_thread_id?: string
  /** Unique identifier of the message draft which was stopped */
  draft_id: string
}

export type PollOptionAdded = {
  /** Optional. Message containing the poll to which the option was added, if known. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply. */
  poll_message?: MaybeInaccessibleMessage
  /** Unique identifier of the added option */
  option_persistent_id: string
  /** Option text */
  option_text: string
  /** Optional. Special entities that appear in the option_text */
  option_text_entities?: Array<MessageEntity>
}

export type PollOptionDeleted = {
  /** Optional. Message containing the poll from which the option was deleted, if known. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply. */
  poll_message?: MaybeInaccessibleMessage
  /** Unique identifier of the deleted option */
  option_persistent_id: string
  /** Option text */
  option_text: string
  /** Optional. Special entities that appear in the option_text */
  option_text_entities?: Array<MessageEntity>
}

export type ChatBoostAdded = {
  /** Number of boosts added by the user */
  boost_count: number
}

export type BackgroundFill = BackgroundFillSolid | BackgroundFillGradient | BackgroundFillFreeformGradient

export type BackgroundFillSolid = {
  /** Type of the background fill, always "solid" */
  type: "solid"
  /** The color of the background fill in the RGB24 format */
  color: number
}

export type BackgroundFillGradient = {
  /** Type of the background fill, always "gradient" */
  type: "gradient"
  /** Top color of the gradient in the RGB24 format */
  top_color: number
  /** Bottom color of the gradient in the RGB24 format */
  bottom_color: number
  /** Clockwise rotation angle of the background fill in degrees; 0-359 */
  rotation_angle: number
}

export type BackgroundFillFreeformGradient = {
  /** Type of the background fill, always "freeform_gradient" */
  type: "freeform_gradient"
  /** A list of the 3 or 4 base colors that are used to generate the freeform gradient in the RGB24 format */
  colors: Array<number>
}

export type BackgroundType =
  | BackgroundTypeFill
  | BackgroundTypeWallpaper
  | BackgroundTypePattern
  | BackgroundTypeChatTheme

export type BackgroundTypeFill = {
  /** Type of the background, always "fill" */
  type: "fill"
  /** The background fill */
  fill: BackgroundFill
  /** Dimming of the background in dark themes, as a percentage; 0-100 */
  dark_theme_dimming: number
}

export type BackgroundTypeWallpaper = {
  /** Type of the background, always "wallpaper" */
  type: "wallpaper"
  /** Document with the wallpaper */
  document: Document
  /** Dimming of the background in dark themes, as a percentage; 0-100 */
  dark_theme_dimming: number
  /** Optional. True, if the wallpaper is downscaled to fit in a 450x450 square and then box-blurred with radius 12 */
  is_blurred?: boolean
  /** Optional. True, if the background moves slightly when the device is tilted */
  is_moving?: boolean
}

export type BackgroundTypePattern = {
  /** Type of the background, always "pattern" */
  type: "pattern"
  /** Document with the pattern */
  document: Document
  /** The background fill that is combined with the pattern */
  fill: BackgroundFill
  /** Intensity of the pattern when it is shown above the filled background; 0-100 */
  intensity: number
  /** Optional. True, if the background fill must be applied only to the pattern itself. All other pixels are black in this case. For dark themes only. */
  is_inverted?: boolean
  /** Optional. True, if the background moves slightly when the device is tilted */
  is_moving?: boolean
}

export type BackgroundTypeChatTheme = {
  /** Type of the background, always "chat_theme" */
  type: "chat_theme"
  /** Name of the chat theme, which is usually an emoji */
  theme_name: string
}

export type ChatBackground = {
  /** Type of the background */
  type: BackgroundType
}

export type ChecklistTasksDone = {
  /** Optional. Message containing the checklist whose tasks were marked as done or not done. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply. */
  checklist_message?: Message
  /** Optional. Identifiers of the tasks that were marked as done */
  marked_as_done_task_ids?: Array<number>
  /** Optional. Identifiers of the tasks that were marked as not done */
  marked_as_not_done_task_ids?: Array<number>
}

export type ChecklistTasksAdded = {
  /** Optional. Message containing the checklist to which the tasks were added. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply. */
  checklist_message?: Message
  /** List of tasks added to the checklist */
  tasks: Array<ChecklistTask>
}

export type CommunityChatAdded = {
  /** The new community to which the chat or the bot belongs */
  community: Community
}

export type CommunityChatJoined = {
  /** The community from which the chat was joined */
  community: Community
}

export type CommunityChatRemoved = Record<string, unknown>

export type ForumTopicCreated = {
  /** Name of the topic */
  name: string
  /** Color of the topic icon in RGB format */
  icon_color: number
  /** Optional. Unique identifier of the custom emoji shown as the topic icon */
  icon_custom_emoji_id?: string
  /** Optional. True, if the name of the topic wasn't specified explicitly by its creator and likely needs to be changed by the bot */
  is_name_implicit?: boolean
}

export type ForumTopicClosed = Record<string, unknown>

export type ForumTopicEdited = {
  /** Optional. New name of the topic, if it was edited */
  name?: string
  /** Optional. New identifier of the custom emoji shown as the topic icon, if it was edited; an empty string if the icon was removed */
  icon_custom_emoji_id?: string
}

export type ForumTopicReopened = Record<string, unknown>

export type GeneralForumTopicHidden = Record<string, unknown>

export type GeneralForumTopicUnhidden = Record<string, unknown>

export type SharedUser = {
  /** Identifier of the shared user. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so 64-bit integers or double-precision float types are safe for storing these identifiers. The bot may not have access to the user and could be unable to use this identifier, unless the user is already known to the bot by some other means. */
  user_id: string
  /** Optional. First name of the user, if the name was requested by the bot */
  first_name?: string
  /** Optional. Last name of the user, if the name was requested by the bot */
  last_name?: string
  /** Optional. Username of the user, if the username was requested by the bot */
  username?: string
  /** Optional. Available sizes of the chat photo, if the photo was requested by the bot */
  photo?: Array<PhotoSize>
}

export type UsersShared = {
  /** Identifier of the request */
  request_id: string
  /** Information about users shared with the bot */
  users: Array<SharedUser>
}

export type ChatShared = {
  /** Identifier of the request */
  request_id: string
  /** Identifier of the shared chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot may not have access to the chat and could be unable to use this identifier, unless the chat is already known to the bot by some other means. */
  chat_id: string
  /** Optional. Title of the chat, if the title was requested by the bot */
  title?: string
  /** Optional. Username of the chat, if the username was requested by the bot and available */
  username?: string
  /** Optional. Available sizes of the chat photo, if the photo was requested by the bot */
  photo?: Array<PhotoSize>
}

export type WriteAccessAllowed = {
  /** Optional. True, if the access was granted after the user accepted an explicit request from a Web App sent by the method requestWriteAccess */
  from_request?: boolean
  /** Optional. Name of the Web App, if the access was granted when the Web App was launched from a link */
  web_app_name?: string
  /** Optional. True, if the access was granted when the bot was added to the attachment or side menu */
  from_attachment_menu?: boolean
}

export type VideoChatScheduled = {
  /** Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator */
  start_date: number
}

export type VideoChatStarted = Record<string, unknown>

export type VideoChatEnded = {
  /** Video chat duration in seconds */
  duration: number
}

export type VideoChatParticipantsInvited = {
  /** New members that were invited to the video chat */
  users: Array<User>
}

export type PaidMessagePriceChanged = {
  /** The new number of Telegram Stars that must be paid by non-administrator users of the supergroup chat for each sent message */
  paid_message_star_count: number
}

export type DirectMessagePriceChanged = {
  /** True, if direct messages are enabled for the channel chat; False otherwise */
  are_direct_messages_enabled: boolean
  /** Optional. The new number of Telegram Stars that must be paid by users for each direct message sent to the channel. Does not apply to users who have been exempted by administrators. Defaults to 0. */
  direct_message_star_count?: number
}

export type SuggestedPostApproved = {
  /** Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply. */
  suggested_post_message?: Message
  /** Optional. Amount paid for the post */
  price?: SuggestedPostPrice
  /** Date when the post will be published */
  send_date: number
}

export type SuggestedPostApprovalFailed = {
  /** Optional. Message containing the suggested post whose approval has failed. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply. */
  suggested_post_message?: Message
  /** Expected price of the post */
  price: SuggestedPostPrice
}

export type SuggestedPostDeclined = {
  /** Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply. */
  suggested_post_message?: Message
  /** Optional. Comment with which the post was declined */
  comment?: string
}

export type SuggestedPostPaid = {
  /** Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply. */
  suggested_post_message?: Message
  /** Currency in which the payment was made. Currently, one of "XTR" for Telegram Stars or "TON" for TON grams. */
  currency: string
  /** Optional. The amount of the currency that was received by the channel in nanograms; for payments in TON grams only */
  amount?: number
  /** Optional. The amount of Telegram Stars that was received by the channel; for payments in Telegram Stars only */
  star_amount?: StarAmount
}

export type SuggestedPostRefunded = {
  /** Optional. Message containing the suggested post. Note that the Message object in this field will not contain the reply_to_message field even if it itself is a reply. */
  suggested_post_message?: Message
  /** Reason for the refund. Currently, one of "post_deleted" if the post was deleted within 24 hours of being posted or removed from scheduled messages without being posted, or "payment_refunded" if the payer refunded their payment. */
  reason: string
}

export type GiveawayCreated = {
  /** Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only */
  prize_star_count?: number
}

export type Giveaway = {
  /** The list of chats which the user must join to participate in the giveaway */
  chats: Array<Chat>
  /** Point in time (Unix timestamp) when winners of the giveaway will be selected */
  winners_selection_date: number
  /** The number of users which are supposed to be selected as winners of the giveaway */
  winner_count: number
  /** Optional. True, if only users who join the chats after the giveaway started should be eligible to win */
  only_new_members?: boolean
  /** Optional. True, if the list of giveaway winners will be visible to everyone */
  has_public_winners?: boolean
  /** Optional. Description of additional giveaway prize */
  prize_description?: string
  /** Optional. A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways. */
  country_codes?: Array<string>
  /** Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only */
  prize_star_count?: number
  /** Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only */
  premium_subscription_month_count?: number
}

export type GiveawayWinners = {
  /** The chat that created the giveaway */
  chat: Chat
  /** Identifier of the message with the giveaway in the chat */
  giveaway_message_id: string
  /** Point in time (Unix timestamp) when winners of the giveaway were selected */
  winners_selection_date: number
  /** Total number of winners in the giveaway */
  winner_count: number
  /** List of up to 100 winners of the giveaway */
  winners: Array<User>
  /** Optional. The number of other chats the user had to join in order to be eligible for the giveaway */
  additional_chat_count?: number
  /** Optional. The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only */
  prize_star_count?: number
  /** Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only */
  premium_subscription_month_count?: number
  /** Optional. Number of undistributed prizes */
  unclaimed_prize_count?: number
  /** Optional. True, if only users who had joined the chats after the giveaway started were eligible to win */
  only_new_members?: boolean
  /** Optional. True, if the giveaway was canceled because the payment for it was refunded */
  was_refunded?: boolean
  /** Optional. Description of additional giveaway prize */
  prize_description?: string
}

export type GiveawayCompleted = {
  /** Number of winners in the giveaway */
  winner_count: number
  /** Optional. Number of undistributed prizes */
  unclaimed_prize_count?: number
  /** Optional. Message with the giveaway that was completed, if it wasn't deleted */
  giveaway_message?: Message
  /** Optional. True, if the giveaway is a Telegram Star giveaway. Otherwise, currently, the giveaway is a Telegram Premium giveaway. */
  is_star_giveaway?: boolean
}

export type LinkPreviewOptions = {
  /** Optional. True, if the link preview is disabled */
  is_disabled?: boolean
  /** Optional. URL to use for the link preview. If empty, then the first URL found in the message text will be used. */
  url?: string
  /** Optional. True, if the media in the link preview is supposed to be shrunk; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview */
  prefer_small_media?: boolean
  /** Optional. True, if the media in the link preview is supposed to be enlarged; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview */
  prefer_large_media?: boolean
  /** Optional. True, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text */
  show_above_text?: boolean
}

export type SuggestedPostPrice = {
  /** Currency in which the post will be paid. Currently, must be one of "XTR" for Telegram Stars or "TON" for TON grams. */
  currency: string
  /** The amount of the currency that will be paid for the post in the smallest units of the currency, i.e. Telegram Stars or nanograms. Currently, price in Telegram Stars must be between 5 and 100000, and price in nanograms must be between 10000000 and 10000000000000. */
  amount: number
}

export type SuggestedPostInfo = {
  /** State of the suggested post. Currently, it can be one of "pending", "approved", "declined". */
  state: string
  /** Optional. Proposed price of the post. If the field is omitted, then the post is unpaid. */
  price?: SuggestedPostPrice
  /** Optional. Proposed send date of the post. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user or administrator who approves it. */
  send_date?: number
}

export type SuggestedPostParameters = {
  /** Optional. Proposed price for the post. If the field is omitted, then the post is unpaid. */
  price?: SuggestedPostPrice
  /** Optional. Proposed send date of the post. If specified, then the date must be between 300 second and 2678400 seconds (30 days) in the future. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user who approves it. */
  send_date?: number
}

export type DirectMessagesTopic = {
  /** Unique identifier of the topic. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. */
  topic_id: string
  /** Optional. Information about the user that created the topic. Currently, it is always present. */
  user?: User
}

export type UserProfilePhotos = {
  /** Total number of profile pictures the target user has */
  total_count: number
  /** Requested profile pictures (in up to 4 sizes each) */
  photos: Array<Array<PhotoSize>>
}

export type UserProfileAudios = {
  /** Total number of profile audios for the target user */
  total_count: number
  /** Requested profile audios */
  audios: Array<Audio>
}

export type File = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
  file_size?: number
  /** Optional. File path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file. */
  file_path?: string
}

export type WebAppInfo = {
  /** An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps */
  url: string
}

export type ReplyKeyboardMarkup = {
  /** Array of button rows, each represented by an Array of KeyboardButton objects */
  keyboard: Array<Array<KeyboardButton>>
  /** Optional. Requests clients to always show the keyboard when the regular keyboard is hidden. Defaults to False, in which case the custom keyboard can be hidden and opened with a keyboard icon. */
  is_persistent?: boolean
  /** Optional. Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to False, in which case the custom keyboard is always of the same height as the app's standard keyboard. */
  resize_keyboard?: boolean
  /** Optional. Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again. Defaults to False. */
  one_time_keyboard?: boolean
  /** Optional. The placeholder to be shown in the input field when the keyboard is active; 1-64 characters */
  input_field_placeholder?: string
  /** Optional. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message. Example: A user requests to change the bot's language, bot replies to the request with a keyboard to select the new language. Other users in the group don't see the keyboard. */
  selective?: boolean
  /** Optional. Pass True if the reply interface must be shown to the user, as if they had manually selected the bot's message and tapped 'Reply' */
  force_reply?: boolean
}

export type KeyboardButton = {
  /** Text of the button. If none of the fields other than text, icon_custom_emoji_id, and style are used, it will be sent as a message when the button is pressed. */
  text: string
  /** Optional. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on Fragment or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription. */
  icon_custom_emoji_id?: string
  /** Optional. Style of the button. Must be one of "danger" (red), "success" (green) or "primary" (blue). If omitted, then an app-specific style is used. */
  style?: string
  /** Optional. If specified, pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a "users_shared" service message. Available in private chats only. */
  request_users?: KeyboardButtonRequestUsers
  /** Optional. If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a "chat_shared" service message. Available in private chats only. */
  request_chat?: KeyboardButtonRequestChat
  /** Optional. If specified, pressing the button will ask the user to create and share a bot that will be managed by the current bot. Available for bots that enabled management of other bots in the @BotFather Mini App. Available in private chats only. */
  request_managed_bot?: KeyboardButtonRequestManagedBot
  /** Optional. If True, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only. */
  request_contact?: boolean
  /** Optional. If True, the user's current location will be sent when the button is pressed. Available in private chats only. */
  request_location?: boolean
  /** Optional. If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only. */
  request_poll?: KeyboardButtonPollType
  /** Optional. If specified, the described Web App will be launched when the button is pressed. The Web App will be able to send a "web_app_data" service message. Available in private chats only. */
  web_app?: WebAppInfo
}

export type KeyboardButtonRequestUsers = {
  /** Signed 32-bit identifier of the request that will be received back in the UsersShared object. Must be unique within the message. */
  request_id: string
  /** Optional. Pass True to request bots, pass False to request regular users. If not specified, no additional restrictions are applied. */
  user_is_bot?: boolean
  /** Optional. Pass True to request premium users, pass False to request non-premium users. If not specified, no additional restrictions are applied. */
  user_is_premium?: boolean
  /** Optional. The maximum number of users to be selected; 1-10. Defaults to 1. */
  max_quantity?: number
  /** Optional. Pass True to request the users' first and last names */
  request_name?: boolean
  /** Optional. Pass True to request the users' usernames */
  request_username?: boolean
  /** Optional. Pass True to request the users' photos */
  request_photo?: boolean
}

export type KeyboardButtonRequestChat = {
  /** Signed 32-bit identifier of the request, which will be received back in the ChatShared object. Must be unique within the message. */
  request_id: string
  /** Pass True to request a channel chat, pass False to request a group or a supergroup chat */
  chat_is_channel: boolean
  /** Optional. Pass True to request a forum supergroup, pass False to request a non-forum chat. If not specified, no additional restrictions are applied. */
  chat_is_forum?: boolean
  /** Optional. Pass True to request a supergroup or a channel with a username, pass False to request a chat without a username. If not specified, no additional restrictions are applied. */
  chat_has_username?: boolean
  /** Optional. Pass True to request a chat owned by the user. Otherwise, no additional restrictions are applied. */
  chat_is_created?: boolean
  /** Optional. A JSON-serialized object listing the required administrator rights of the user in the chat. The rights must be a superset of bot_administrator_rights. If not specified, no additional restrictions are applied. */
  user_administrator_rights?: ChatAdministratorRights
  /** Optional. A JSON-serialized object listing the required administrator rights of the bot in the chat. The rights must be a subset of user_administrator_rights. If not specified, no additional restrictions are applied. */
  bot_administrator_rights?: ChatAdministratorRights
  /** Optional. Pass True to request a chat with the bot as a member. Otherwise, no additional restrictions are applied. */
  bot_is_member?: boolean
  /** Optional. Pass True to request the chat's title */
  request_title?: boolean
  /** Optional. Pass True to request the chat's username */
  request_username?: boolean
  /** Optional. Pass True to request the chat's photo */
  request_photo?: boolean
}

export type KeyboardButtonRequestManagedBot = {
  /** Signed 32-bit identifier of the request. Must be unique within the message. */
  request_id: string
  /** Optional. Suggested name for the bot */
  suggested_name?: string
  /** Optional. Suggested username for the bot */
  suggested_username?: string
}

export type KeyboardButtonPollType = {
  /** Optional. If quiz is passed, the user will be allowed to create only polls in the quiz mode. If regular is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of any type. */
  type?: string
}

export type ReplyKeyboardRemove = {
  /** Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use one_time_keyboard in ReplyKeyboardMarkup) */
  remove_keyboard: boolean
  /** Optional. Use this parameter if you want to remove the keyboard for specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message. Example: A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven't voted yet. */
  selective?: boolean
}

export type InlineKeyboardMarkup = {
  /** Array of button rows, each represented by an Array of InlineKeyboardButton objects */
  inline_keyboard: Array<Array<InlineKeyboardButton>>
  /** Optional. Pass True if the reply interface must be shown to the user, as if they had manually selected the bot's message and tapped 'Reply'. The value of the field can't be changed when the inline keyboard is edited. */
  force_reply?: boolean
}

export type InlineKeyboardButton = {
  /** Label text on the button */
  text: string
  /** Optional. Unique identifier of the custom emoji shown before the text of the button. Can only be used by bots that purchased additional usernames on Fragment or in the messages directly sent by the bot to private, group and supergroup chats if the owner of the bot has a Telegram Premium subscription. */
  icon_custom_emoji_id?: string
  /** Optional. Style of the button. Must be one of "danger" (red), "success" (green) or "primary" (blue). If omitted, then an app-specific style is used. */
  style?: string
  /** Optional. HTTP or tg:// URL to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings. */
  url?: string
  /** Optional. Data to be sent in a callback query to the bot when the button is pressed, 1-64 bytes */
  callback_data?: string
  /** Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a business account. */
  web_app?: WebAppInfo
  /** Optional. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget. Not supported for ephemeral messages. */
  login_url?: LoginUrl
  /** Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a business account. */
  switch_inline_query?: string
  /** Optional. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted. This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a business account. */
  switch_inline_query_current_chat?: string
  /** Optional. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a business account. */
  switch_inline_query_chosen_chat?: SwitchInlineQueryChosenChat
  /** Optional. Description of the button that copies the specified text to the clipboard */
  copy_text?: CopyTextButton
  /** Optional. Description of the game that will be launched when the user presses the button. NOTE: This type of button must always be the first button in the first row. */
  callback_game?: CallbackGame
  /** Optional. Specify True, to send a Pay button. Substrings "⭐" and "XTR" in the buttons's text will be replaced with a Telegram Star icon. NOTE: This type of button must always be the first button in the first row and can only be used in invoice messages. */
  pay?: boolean
  /** Optional. If set, then the button is disabled and does nothing */
  disabled?: DisabledButton
}

export type LoginUrl = {
  /** An HTTPS URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in Receiving authorization data. NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in Checking authorization. */
  url: string
  /** Optional. New text of the button in forwarded messages */
  forward_text?: string
  /** Optional. Username of a bot, which will be used for user authorization; not supported in RichMessageButton. See Setting up a bot for more details. If not specified, the current bot's username will be assumed. The url's domain must be the same as the domain linked with the bot. See Linking your domain to the bot for more details. */
  bot_username?: string
  /** Optional. Pass True to request the permission for your bot to send messages to the user */
  request_write_access?: boolean
}

export type SwitchInlineQueryChosenChat = {
  /** Optional. The default inline query to be inserted in the input field. If left empty, only the bot's username will be inserted. */
  query?: string
  /** Optional. True, if private chats with users can be chosen */
  allow_user_chats?: boolean
  /** Optional. True, if private chats with bots can be chosen */
  allow_bot_chats?: boolean
  /** Optional. True, if group and supergroup chats can be chosen */
  allow_group_chats?: boolean
  /** Optional. True, if channel chats can be chosen */
  allow_channel_chats?: boolean
}

export type CopyTextButton = {
  /** The text to be copied to the clipboard; 1-256 characters */
  text: string
}

export type DisabledButton = Record<string, unknown>

export type CallbackQuery = {
  /** Unique identifier for this query */
  id: string
  /** Sender */
  from: User
  /** Optional. Message sent by the bot with the callback button that originated the query */
  message?: MaybeInaccessibleMessage
  /** Optional. Identifier of the message sent via the bot in inline mode, that originated the query */
  inline_message_id?: string
  /** Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in games. */
  chat_instance: string
  /** Optional. Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data. */
  data?: string
  /** Optional. Short name of a Game to be returned, serves as the unique identifier for the game */
  game_short_name?: string
}

export type ForceReply = {
  /** Shows reply interface to the user, as if they had manually selected the bot's message and tapped 'Reply' */
  force_reply: boolean
  /** Optional. The placeholder to be shown in the input field when the reply is active; 1-64 characters */
  input_field_placeholder?: string
  /** Optional. Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the text of the Message object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message. */
  selective?: boolean
}

export type Community = {
  /** Unique identifier for this community. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
  id: string
  /** Name of the community */
  name: string
}

export type ChatPhoto = {
  /** File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed. */
  small_file_id: string
  /** Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  small_file_unique_id: string
  /** File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed. */
  big_file_id: string
  /** Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  big_file_unique_id: string
}

export type ChatInviteLink = {
  /** The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with "...". */
  invite_link: string
  /** Creator of the link */
  creator: User
  /** True, if users joining the chat via the link need to be approved by chat administrators */
  creates_join_request: boolean
  /** True, if the link is primary */
  is_primary: boolean
  /** True, if the link is revoked */
  is_revoked: boolean
  /** Optional. Invite link name */
  name?: string
  /** Optional. Point in time (Unix timestamp) when the link will expire or has been expired */
  expire_date?: number
  /** Optional. The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 */
  member_limit?: number
  /** Optional. Number of pending join requests created using this link */
  pending_join_request_count?: number
  /** Optional. The number of seconds the subscription will be active for before the next payment */
  subscription_period?: number
  /** Optional. The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat using the link */
  subscription_price?: number
}

export type ChatAdministratorRights = {
  /** True, if the user's presence in the chat is hidden */
  is_anonymous: boolean
  /** True, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege. */
  can_manage_chat: boolean
  /** True, if the administrator can delete messages of other users */
  can_delete_messages: boolean
  /** True, if the administrator can manage video chats */
  can_manage_video_chats: boolean
  /** True, if the administrator can restrict, ban or unban chat members, or access supergroup statistics */
  can_restrict_members: boolean
  /** True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user) */
  can_promote_members: boolean
  /** True, if the user is allowed to change the chat title, photo and other settings */
  can_change_info: boolean
  /** True, if the user is allowed to invite new users to the chat */
  can_invite_users: boolean
  /** True, if the administrator can post stories to the chat */
  can_post_stories: boolean
  /** True, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive */
  can_edit_stories: boolean
  /** True, if the administrator can delete stories posted by other users */
  can_delete_stories: boolean
  /** Optional. True, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only */
  can_post_messages?: boolean
  /** Optional. True, if the administrator can edit messages of other users and can pin messages; for channels only */
  can_edit_messages?: boolean
  /** Optional. True, if the user is allowed to pin messages; for groups and supergroups only */
  can_pin_messages?: boolean
  /** Optional. True, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only */
  can_manage_topics?: boolean
  /** Optional. True, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only */
  can_manage_direct_messages?: boolean
  /** Optional. True, if the administrator can edit the tags of regular members; for groups and supergroups only */
  can_manage_tags?: boolean
  /** True, if the administrator can manage chat welcome messages or directly send them in the case of bots */
  can_send_welcome_messages: boolean
}

export type ChatMemberUpdated = {
  /** Chat the user belongs to */
  chat: Chat
  /** Performer of the action, which resulted in the change */
  from: User
  /** Date the change was done in Unix time */
  date: number
  /** Previous information about the chat member */
  old_chat_member: ChatMember
  /** New information about the chat member */
  new_chat_member: ChatMember
  /** Optional. Chat invite link, which was used by the user to join the chat; for joining by invite link events only */
  invite_link?: ChatInviteLink
  /** Optional. True, if the user joined the chat after sending a direct join request without using an invite link and being approved by an administrator */
  via_join_request?: boolean
  /** Optional. True, if the user joined the chat via a chat folder invite link */
  via_chat_folder_invite_link?: boolean
}

export type ChatMember =
  | ChatMemberOwner
  | ChatMemberAdministrator
  | ChatMemberMember
  | ChatMemberRestricted
  | ChatMemberLeft
  | ChatMemberBanned

export type ChatMemberOwner = {
  /** The member's status in the chat, always "creator" */
  status: "creator"
  /** Information about the user */
  user: User
  /** True, if the user's presence in the chat is hidden */
  is_anonymous: boolean
  /** Optional. Custom title for this user */
  custom_title?: string
}

export type ChatMemberAdministrator = {
  /** The member's status in the chat, always "administrator" */
  status: "administrator"
  /** Information about the user */
  user: User
  /** True, if the bot is allowed to edit administrator privileges of that user */
  can_be_edited: boolean
  /** True, if the user's presence in the chat is hidden */
  is_anonymous: boolean
  /** True, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege. */
  can_manage_chat: boolean
  /** True, if the administrator can delete messages of other users */
  can_delete_messages: boolean
  /** True, if the administrator can manage video chats */
  can_manage_video_chats: boolean
  /** True, if the administrator can restrict, ban or unban chat members, or access supergroup statistics */
  can_restrict_members: boolean
  /** True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user) */
  can_promote_members: boolean
  /** True, if the user is allowed to change the chat title, photo and other settings */
  can_change_info: boolean
  /** True, if the user is allowed to invite new users to the chat */
  can_invite_users: boolean
  /** True, if the administrator can post stories to the chat */
  can_post_stories: boolean
  /** True, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive */
  can_edit_stories: boolean
  /** True, if the administrator can delete stories posted by other users */
  can_delete_stories: boolean
  /** Optional. True, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only */
  can_post_messages?: boolean
  /** Optional. True, if the administrator can edit messages of other users and can pin messages; for channels only */
  can_edit_messages?: boolean
  /** Optional. True, if the user is allowed to pin messages; for groups and supergroups only */
  can_pin_messages?: boolean
  /** Optional. True, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only */
  can_manage_topics?: boolean
  /** Optional. True, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only */
  can_manage_direct_messages?: boolean
  /** Optional. True, if the administrator can edit the tags of regular members; for groups and supergroups only */
  can_manage_tags?: boolean
  /** True, if the administrator can manage chat welcome messages or directly send them in the case of bots */
  can_send_welcome_messages: boolean
  /** Optional. Custom title for this user */
  custom_title?: string
}

export type ChatMemberMember = {
  /** The member's status in the chat, always "member" */
  status: "member"
  /** Optional. Tag of the member */
  tag?: string
  /** Information about the user */
  user: User
  /** Optional. Date when the user's subscription will expire; Unix time */
  until_date?: number
}

export type ChatMemberRestricted = {
  /** The member's status in the chat, always "restricted" */
  status: "restricted"
  /** Optional. Tag of the member */
  tag?: string
  /** Information about the user */
  user: User
  /** True, if the user is a member of the chat at the moment of the request */
  is_member: boolean
  /** True, if the user is allowed to send text messages, rich messages, contacts, giveaways, giveaway winners, invoices, locations and venues */
  can_send_messages: boolean
  /** True, if the user is allowed to send audios */
  can_send_audios: boolean
  /** True, if the user is allowed to send documents */
  can_send_documents: boolean
  /** True, if the user is allowed to send photos */
  can_send_photos: boolean
  /** True, if the user is allowed to send videos */
  can_send_videos: boolean
  /** True, if the user is allowed to send video notes */
  can_send_video_notes: boolean
  /** True, if the user is allowed to send voice notes */
  can_send_voice_notes: boolean
  /** True, if the user is allowed to send polls and checklists */
  can_send_polls: boolean
  /** True, if the user is allowed to send animations, games, stickers and use inline bots */
  can_send_other_messages: boolean
  /** True, if the user is allowed to add web page previews to their messages */
  can_add_web_page_previews: boolean
  /** True, if the user is allowed to react to messages */
  can_react_to_messages: boolean
  /** True, if the user is allowed to edit their own tag */
  can_edit_tag: boolean
  /** True, if the user is allowed to change the chat title, photo and other settings */
  can_change_info: boolean
  /** True, if the user is allowed to invite new users to the chat */
  can_invite_users: boolean
  /** True, if the user is allowed to pin messages */
  can_pin_messages: boolean
  /** True, if the user is allowed to create forum topics */
  can_manage_topics: boolean
  /** Date when restrictions will be lifted for this user; Unix time. If 0, then the user is restricted forever. */
  until_date: number
}

export type ChatMemberLeft = {
  /** The member's status in the chat, always "left" */
  status: "left"
  /** Information about the user */
  user: User
}

export type ChatMemberBanned = {
  /** The member's status in the chat, always "kicked" */
  status: "kicked"
  /** Information about the user */
  user: User
  /** Date when restrictions will be lifted for this user; Unix time. If 0, then the user is banned forever. */
  until_date: number
}

export type ChatJoinRequest = {
  /** Chat to which the request was sent */
  chat: Chat
  /** User that sent the join request */
  from: User
  /** Identifier of a private chat with the user who sent the join request. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot can use this identifier for 5 minutes to send messages until the join request is processed, assuming no other administrator contacted the user. */
  user_chat_id: string
  /** Date the request was sent in Unix time */
  date: number
  /** Optional. Bio of the user */
  bio?: string
  /** Optional. Chat invite link that was used by the user to send the join request */
  invite_link?: ChatInviteLink
  /** Optional. Identifier of the join request query; for bots assigned to process join requests only. If present, then the bot must call sendChatJoinRequestWebApp or directly call answerChatJoinRequestQuery within 10 seconds. */
  query_id?: string
}

export type ChatPermissions = {
  /** Optional. True, if the user is allowed to send text messages, rich messages, contacts, giveaways, giveaway winners, invoices, locations and venues */
  can_send_messages?: boolean
  /** Optional. True, if the user is allowed to send audios */
  can_send_audios?: boolean
  /** Optional. True, if the user is allowed to send documents */
  can_send_documents?: boolean
  /** Optional. True, if the user is allowed to send photos */
  can_send_photos?: boolean
  /** Optional. True, if the user is allowed to send videos */
  can_send_videos?: boolean
  /** Optional. True, if the user is allowed to send video notes */
  can_send_video_notes?: boolean
  /** Optional. True, if the user is allowed to send voice notes */
  can_send_voice_notes?: boolean
  /** Optional. True, if the user is allowed to send polls and checklists */
  can_send_polls?: boolean
  /** Optional. True, if the user is allowed to send animations, games, stickers and use inline bots */
  can_send_other_messages?: boolean
  /** Optional. True, if the user is allowed to add web page previews to their messages */
  can_add_web_page_previews?: boolean
  /** Optional. True, if the user is allowed to react to messages. If omitted, defaults to the value of can_send_messages. */
  can_react_to_messages?: boolean
  /** Optional. True, if the user is allowed to edit their own tag. If omitted, defaults to the value of can_pin_messages. */
  can_edit_tag?: boolean
  /** Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups. */
  can_change_info?: boolean
  /** Optional. True, if the user is allowed to invite new users to the chat */
  can_invite_users?: boolean
  /** Optional. True, if the user is allowed to pin messages. Ignored in public supergroups. */
  can_pin_messages?: boolean
  /** Optional. True, if the user is allowed to create forum topics. If omitted, defaults to the value of can_pin_messages. */
  can_manage_topics?: boolean
}

export type Birthdate = {
  /** Day of the user's birth; 1-31 */
  day: number
  /** Month of the user's birth; 1-12 */
  month: number
  /** Optional. Year of the user's birth */
  year?: number
}

export type BusinessIntro = {
  /** Optional. Title text of the business intro */
  title?: string
  /** Optional. Message text of the business intro */
  message?: string
  /** Optional. Sticker of the business intro */
  sticker?: Sticker
}

export type BusinessLocation = {
  /** Address of the business */
  address: string
  /** Optional. Location of the business */
  location?: Location
}

export type BusinessOpeningHoursInterval = {
  /** The minute's sequence number in a week, starting on Monday, marking the start of the time interval during which the business is open; 0 - 7 * 24 * 60 */
  opening_minute: number
  /** The minute's sequence number in a week, starting on Monday, marking the end of the time interval during which the business is open; 0 - 8 * 24 * 60 */
  closing_minute: number
}

export type BusinessOpeningHours = {
  /** Unique name of the time zone for which the opening hours are defined */
  time_zone_name: string
  /** List of time intervals describing business opening hours */
  opening_hours: Array<BusinessOpeningHoursInterval>
}

export type UserRating = {
  /** Current level of the user, indicating their reliability when purchasing digital goods and services. A higher level suggests a more trustworthy customer; a negative level is likely reason for concern. */
  level: number
  /** Numerical value of the user's rating; the higher the rating, the better */
  rating: number
  /** The rating value required to get the current level */
  current_level_rating: number
  /** Optional. The rating value required to get to the next level; omitted if the maximum level was reached */
  next_level_rating?: number
}

export type StoryAreaPosition = {
  /** The abscissa of the area's center, as a percentage of the media width */
  x_percentage: number
  /** The ordinate of the area's center, as a percentage of the media height */
  y_percentage: number
  /** The width of the area's rectangle, as a percentage of the media width */
  width_percentage: number
  /** The height of the area's rectangle, as a percentage of the media height */
  height_percentage: number
  /** The clockwise rotation angle of the rectangle, in degrees; 0-360 */
  rotation_angle: number
  /** The radius of the rectangle corner rounding, as a percentage of the media width */
  corner_radius_percentage: number
}

export type LocationAddress = {
  /** The two-letter ISO 3166-1 alpha-2 country code of the country where the location is located */
  country_code: string
  /** Optional. State of the location */
  state?: string
  /** Optional. City of the location */
  city?: string
  /** Optional. Street address of the location */
  street?: string
}

export type StoryAreaType =
  | StoryAreaTypeLocation
  | StoryAreaTypeSuggestedReaction
  | StoryAreaTypeLink
  | StoryAreaTypeWeather
  | StoryAreaTypeUniqueGift

export type StoryAreaTypeLocation = {
  /** Type of the area, always "location" */
  type: "location"
  /** Location latitude in degrees */
  latitude: number
  /** Location longitude in degrees */
  longitude: number
  /** Optional. Address of the location */
  address?: LocationAddress
}

export type StoryAreaTypeSuggestedReaction = {
  /** Type of the area, always "suggested_reaction" */
  type: "suggested_reaction"
  /** Type of the reaction */
  reaction_type: ReactionType
  /** Optional. Pass True if the reaction area has a dark background */
  is_dark?: boolean
  /** Optional. Pass True if reaction area corner is flipped */
  is_flipped?: boolean
}

export type StoryAreaTypeLink = {
  /** Type of the area, always "link" */
  type: "link"
  /** HTTP or tg:// URL to be opened when the area is clicked */
  url: string
}

export type StoryAreaTypeWeather = {
  /** Type of the area, always "weather" */
  type: "weather"
  /** Temperature, in degree Celsius */
  temperature: number
  /** Emoji representing the weather */
  emoji: string
  /** A color of the area background in the ARGB format */
  background_color: number
}

export type StoryAreaTypeUniqueGift = {
  /** Type of the area, always "unique_gift" */
  type: "unique_gift"
  /** Unique name of the gift */
  name: string
}

export type StoryArea = {
  /** Position of the area */
  position: StoryAreaPosition
  /** Type of the area */
  type: StoryAreaType
}

export type ChatLocation = {
  /** The location to which the supergroup is connected. Can't be a live location. */
  location: Location
  /** Location address; 1-64 characters, as defined by the chat owner */
  address: string
}

export type ReactionType = ReactionTypeEmoji | ReactionTypeCustomEmoji | ReactionTypePaid

export type ReactionTypeEmoji = {
  /** Type of the reaction, always "emoji" */
  type: "emoji"
  /** Reaction emoji. Currently, it can be one of "❤", "👍", "👎", "🔥", "🥰", "👏", "😁", "🤔", "🤯", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏", "👌", "🕊", "🤡", "🥱", "🥴", "😍", "🐳", "❤‍🔥", "🌚", "🌭", "💯", "🤣", "⚡", "🍌", "🏆", "💔", "🤨", "😐", "🍓", "🍾", "💋", "🖕", "😈", "😴", "😭", "🤓", "👻", "👨‍💻", "👀", "🎃", "🙈", "😇", "😨", "🤝", "✍", "🤗", "🫡", "🎅", "🎄", "☃", "💅", "🤪", "🗿", "🆒", "💘", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷‍♂", "🤷", "🤷‍♀", "😡". */
  emoji: string
}

export type ReactionTypeCustomEmoji = {
  /** Type of the reaction, always "custom_emoji" */
  type: "custom_emoji"
  /** Custom emoji identifier */
  custom_emoji_id: string
}

export type ReactionTypePaid = {
  /** Type of the reaction, always "paid" */
  type: "paid"
}

export type ReactionCount = {
  /** Type of the reaction */
  type: ReactionType
  /** Number of times the reaction was added */
  total_count: number
}

export type MessageReactionUpdated = {
  /** The chat containing the message the user reacted to */
  chat: Chat
  /** Unique identifier of the message inside the chat */
  message_id: string
  /** Optional. The user that changed the reaction, if the user isn't anonymous */
  user?: User
  /** Optional. The chat on behalf of which the reaction was changed, if the user is anonymous */
  actor_chat?: Chat
  /** Date of the change in Unix time */
  date: number
  /** Previous list of reaction types that were set by the user */
  old_reaction: Array<ReactionType>
  /** New list of reaction types that have been set by the user */
  new_reaction: Array<ReactionType>
}

export type MessageReactionCountUpdated = {
  /** The chat containing the message */
  chat: Chat
  /** Unique message identifier inside the chat */
  message_id: string
  /** Date of the change in Unix time */
  date: number
  /** List of reactions that are present on the message */
  reactions: Array<ReactionCount>
}

export type ForumTopic = {
  /** Unique identifier of the forum topic */
  message_thread_id: string
  /** Name of the topic */
  name: string
  /** Color of the topic icon in RGB format */
  icon_color: number
  /** Optional. Unique identifier of the custom emoji shown as the topic icon */
  icon_custom_emoji_id?: string
  /** Optional. True, if the name of the topic wasn't specified explicitly by its creator and likely needs to be changed by the bot */
  is_name_implicit?: boolean
}

export type GiftBackground = {
  /** Center color of the background in RGB format */
  center_color: number
  /** Edge color of the background in RGB format */
  edge_color: number
  /** Text color of the background in RGB format */
  text_color: number
}

export type Gift = {
  /** Unique identifier of the gift */
  id: string
  /** The sticker that represents the gift */
  sticker: Sticker
  /** The number of Telegram Stars that must be paid to send the sticker */
  star_count: number
  /** Optional. The number of Telegram Stars that must be paid to upgrade the gift to a unique one */
  upgrade_star_count?: number
  /** Optional. True, if the gift can only be purchased by Telegram Premium subscribers */
  is_premium?: boolean
  /** Optional. True, if the gift can be used (after being upgraded) to customize a user's appearance */
  has_colors?: boolean
  /** Optional. The total number of gifts of this type that can be sent by all users; for limited gifts only */
  total_count?: number
  /** Optional. The number of remaining gifts of this type that can be sent by all users; for limited gifts only */
  remaining_count?: number
  /** Optional. The total number of gifts of this type that can be sent by the bot; for limited gifts only */
  personal_total_count?: number
  /** Optional. The number of remaining gifts of this type that can be sent by the bot; for limited gifts only */
  personal_remaining_count?: number
  /** Optional. Background of the gift */
  background?: GiftBackground
  /** Optional. The total number of different unique gifts that can be obtained by upgrading the gift */
  unique_gift_variant_count?: number
  /** Optional. Information about the chat that published the gift */
  publisher_chat?: Chat
}

export type Gifts = {
  /** The list of gifts */
  gifts: Array<Gift>
}

export type UniqueGiftModel = {
  /** Name of the model */
  name: string
  /** The sticker that represents the unique gift */
  sticker: Sticker
  /** The number of unique gifts that receive this model for every 1000 gift upgrades. Always 0 for crafted gifts. */
  rarity_per_mille: number
  /** Optional. Rarity of the model if it is a crafted model. Currently, can be "uncommon", "rare", "epic", or "legendary". */
  rarity?: string
}

export type UniqueGiftSymbol = {
  /** Name of the symbol */
  name: string
  /** The sticker that represents the unique gift */
  sticker: Sticker
  /** The number of unique gifts that receive this model for every 1000 gifts upgraded */
  rarity_per_mille: number
}

export type UniqueGiftBackdropColors = {
  /** The color in the center of the backdrop in RGB format */
  center_color: number
  /** The color on the edges of the backdrop in RGB format */
  edge_color: number
  /** The color to be applied to the symbol in RGB format */
  symbol_color: number
  /** The color for the text on the backdrop in RGB format */
  text_color: number
}

export type UniqueGiftBackdrop = {
  /** Name of the backdrop */
  name: string
  /** Colors of the backdrop */
  colors: UniqueGiftBackdropColors
  /** The number of unique gifts that receive this backdrop for every 1000 gifts upgraded */
  rarity_per_mille: number
}

export type UniqueGiftColors = {
  /** Custom emoji identifier of the unique gift's model */
  model_custom_emoji_id: string
  /** Custom emoji identifier of the unique gift's symbol */
  symbol_custom_emoji_id: string
  /** Main color used in light themes; RGB format */
  light_theme_main_color: number
  /** List of 1-3 additional colors used in light themes; RGB format */
  light_theme_other_colors: Array<number>
  /** Main color used in dark themes; RGB format */
  dark_theme_main_color: number
  /** List of 1-3 additional colors used in dark themes; RGB format */
  dark_theme_other_colors: Array<number>
}

export type UniqueGift = {
  /** Identifier of the regular gift from which the gift was upgraded */
  gift_id: string
  /** Human-readable name of the regular gift from which this unique gift was upgraded */
  base_name: string
  /** Unique name of the gift. This name can be used in https://t.me/nft/... links and story areas. */
  name: string
  /** Unique number of the upgraded gift among gifts upgraded from the same regular gift */
  number: number
  /** Model of the gift */
  model: UniqueGiftModel
  /** Symbol of the gift */
  symbol: UniqueGiftSymbol
  /** Backdrop of the gift */
  backdrop: UniqueGiftBackdrop
  /** Optional. True, if the original regular gift was exclusively purchaseable by Telegram Premium subscribers */
  is_premium?: boolean
  /** Optional. True, if the gift was used to craft another gift and isn't available anymore */
  is_burned?: boolean
  /** Optional. True, if the gift is assigned from the TON blockchain and can't be resold or transferred in Telegram */
  is_from_blockchain?: boolean
  /** Optional. The color scheme that can be used by the gift's owner for the chat's name, replies to messages and link previews; for business account gifts and gifts that are currently on sale only */
  colors?: UniqueGiftColors
  /** Optional. Information about the chat that published the gift */
  publisher_chat?: Chat
}

export type GiftInfo = {
  /** Information about the gift */
  gift: Gift
  /** Optional. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts */
  owned_gift_id?: string
  /** Optional. Number of Telegram Stars that can be claimed by the receiver by converting the gift; omitted if conversion to Telegram Stars is impossible */
  convert_star_count?: number
  /** Optional. Number of Telegram Stars that were prepaid for the ability to upgrade the gift */
  prepaid_upgrade_star_count?: number
  /** Optional. True, if the gift's upgrade was purchased after the gift was sent */
  is_upgrade_separate?: boolean
  /** Optional. True, if the gift can be upgraded to a unique gift */
  can_be_upgraded?: boolean
  /** Optional. Text of the message that was added to the gift */
  text?: string
  /** Optional. Special entities that appear in the text */
  entities?: Array<MessageEntity>
  /** Optional. True, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them */
  is_private?: boolean
  /** Optional. Unique number reserved for this gift when upgraded. See the number field in UniqueGift. */
  unique_gift_number?: number
}

export type UniqueGiftInfo = {
  /** Information about the gift */
  gift: UniqueGift
  /** Origin of the gift. Currently, either "upgrade" for gifts upgraded from regular gifts, "transfer" for gifts transferred from other users or channels, "resale" for gifts bought from other users, "gifted_upgrade" for upgrades purchased after the gift was sent, or "offer" for gifts bought or sold through gift purchase offers. */
  origin: string
  /** Optional. Text of the message that was added to the gift */
  text?: string
  /** Optional. Special entities that appear in the text */
  entities?: Array<MessageEntity>
  /** Optional. True, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them */
  is_private?: boolean
  /** Optional. For gifts bought from other users, the currency in which the payment for the gift was done. Currently, one of "XTR" for Telegram Stars or "TON" for TON grams. */
  last_resale_currency?: string
  /** Optional. For gifts bought from other users, the price paid for the gift in either Telegram Stars or nanograms */
  last_resale_amount?: number
  /** Optional. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts */
  owned_gift_id?: string
  /** Optional. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift */
  transfer_star_count?: number
  /** Optional. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now. */
  next_transfer_date?: number
}

export type OwnedGift = OwnedGiftRegular | OwnedGiftUnique

export type OwnedGiftRegular = {
  /** Type of the gift, always "regular" */
  type: "regular"
  /** Information about the regular gift */
  gift: Gift
  /** Optional. Unique identifier of the gift for the bot; for gifts received on behalf of business accounts only */
  owned_gift_id?: string
  /** Optional. Sender of the gift if it is a known user */
  sender_user?: User
  /** Date the gift was sent in Unix time */
  send_date: number
  /** Optional. Text of the message that was added to the gift */
  text?: string
  /** Optional. Special entities that appear in the text */
  entities?: Array<MessageEntity>
  /** Optional. True, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them */
  is_private?: boolean
  /** Optional. True, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only */
  is_saved?: boolean
  /** Optional. True, if the gift can be upgraded to a unique gift; for gifts received on behalf of business accounts only */
  can_be_upgraded?: boolean
  /** Optional. True, if the gift was refunded and isn't available anymore */
  was_refunded?: boolean
  /** Optional. Number of Telegram Stars that can be claimed by the receiver instead of the gift; omitted if the gift cannot be converted to Telegram Stars; for gifts received on behalf of business accounts only */
  convert_star_count?: number
  /** Optional. Number of Telegram Stars that were paid for the ability to upgrade the gift */
  prepaid_upgrade_star_count?: number
  /** Optional. True, if the gift's upgrade was purchased after the gift was sent; for gifts received on behalf of business accounts only */
  is_upgrade_separate?: boolean
  /** Optional. Unique number reserved for this gift when upgraded. See the number field in UniqueGift. */
  unique_gift_number?: number
}

export type OwnedGiftUnique = {
  /** Type of the gift, always "unique" */
  type: "unique"
  /** Information about the unique gift */
  gift: UniqueGift
  /** Optional. Unique identifier of the received gift for the bot; for gifts received on behalf of business accounts only */
  owned_gift_id?: string
  /** Optional. Sender of the gift if it is a known user */
  sender_user?: User
  /** Date the gift was sent in Unix time */
  send_date: number
  /** Optional. True, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only */
  is_saved?: boolean
  /** Optional. True, if the gift can be transferred to another owner; for gifts received on behalf of business accounts only */
  can_be_transferred?: boolean
  /** Optional. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift */
  transfer_star_count?: number
  /** Optional. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now. */
  next_transfer_date?: number
}

export type OwnedGifts = {
  /** The total number of gifts owned by the user or the chat */
  total_count: number
  /** The list of gifts */
  gifts: Array<OwnedGift>
  /** Optional. Offset for the next request. If empty, then there are no more results. */
  next_offset?: string
}

export type BotAccessSettings = {
  /** True, if only selected users can access the bot. The bot's owner can always access it. */
  is_access_restricted: boolean
  /** Optional. The list of other users who have access to the bot if the access is restricted */
  added_users?: Array<User>
}

export type AcceptedGiftTypes = {
  /** True, if unlimited regular gifts are accepted */
  unlimited_gifts: boolean
  /** True, if limited regular gifts are accepted */
  limited_gifts: boolean
  /** True, if unique gifts or gifts that can be upgraded to unique for free are accepted */
  unique_gifts: boolean
  /** True, if a Telegram Premium subscription is accepted */
  premium_subscription: boolean
  /** True, if transfers of unique gifts from channels are accepted */
  gifts_from_channels: boolean
}

export type StarAmount = {
  /** Integer amount of Telegram Stars, rounded to 0; can be negative */
  amount: number
  /** Optional. The number of 1/1000000000 shares of Telegram Stars; from -999999999 to 999999999; can be negative if and only if amount is non-positive */
  nanostar_amount?: number
}

export type BotCommand = {
  /** Text of the command; 1-32 characters. Can contain only lowercase English letters, digits and underscores. */
  command: string
  /** Description of the command; 1-256 characters */
  description: string
  /** Optional. True, if the command sends an ephemeral message, which can be seen only by the sender of the message and the bot */
  is_ephemeral?: boolean
}

export type BotCommandScope =
  | BotCommandScopeDefault
  | BotCommandScopeAllPrivateChats
  | BotCommandScopeAllGroupChats
  | BotCommandScopeAllChatAdministrators
  | BotCommandScopeChat
  | BotCommandScopeChatAdministrators
  | BotCommandScopeChatMember

export type BotCommandScopeDefault = {
  /** Scope type, must be default */
  type: "default"
}

export type BotCommandScopeAllPrivateChats = {
  /** Scope type, must be all_private_chats */
  type: "all_private_chats"
}

export type BotCommandScopeAllGroupChats = {
  /** Scope type, must be all_group_chats */
  type: "all_group_chats"
}

export type BotCommandScopeAllChatAdministrators = {
  /** Scope type, must be all_chat_administrators */
  type: "all_chat_administrators"
}

export type BotCommandScopeChat = {
  /** Scope type, must be chat */
  type: "chat"
  /** Unique identifier for the target chat or username of the target supergroup in the format @username. Channel direct messages chats and channel chats aren't supported. */
  chat_id: string | string
}

export type BotCommandScopeChatAdministrators = {
  /** Scope type, must be chat_administrators */
  type: "chat_administrators"
  /** Unique identifier for the target chat or username of the target supergroup in the format @username. Channel direct messages chats and channel chats aren't supported. */
  chat_id: string | string
}

export type BotCommandScopeChatMember = {
  /** Scope type, must be chat_member */
  type: "chat_member"
  /** Unique identifier for the target chat or username of the target supergroup in the format @username. Channel direct messages chats and channel chats aren't supported. */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
}

export type BotName = {
  /** The bot's name */
  name: string
}

export type BotDescription = {
  /** The bot's description */
  description: string
}

export type BotShortDescription = {
  /** The bot's short description */
  short_description: string
}

export type MenuButton = MenuButtonCommands | MenuButtonWebApp | MenuButtonDefault

export type MenuButtonCommands = {
  /** Type of the button, must be commands */
  type: "commands"
}

export type MenuButtonWebApp = {
  /** Type of the button, must be web_app */
  type: "web_app"
  /** Text on the button */
  text: string
  /** Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Alternatively, a t.me link to a Web App of the bot can be specified in the object instead of the Web App's URL, in which case the Web App will be opened as if the user pressed the link. */
  web_app: WebAppInfo
}

export type MenuButtonDefault = {
  /** Type of the button, must be default */
  type: "default"
}

export type ChatBoostSource = ChatBoostSourcePremium | ChatBoostSourceGiftCode | ChatBoostSourceGiveaway

export type ChatBoostSourcePremium = {
  /** Source of the boost, always "premium" */
  source: "premium"
  /** User that boosted the chat */
  user: User
}

export type ChatBoostSourceGiftCode = {
  /** Source of the boost, always "gift_code" */
  source: "gift_code"
  /** User for which the gift code was created */
  user: User
}

export type ChatBoostSourceGiveaway = {
  /** Source of the boost, always "giveaway" */
  source: "giveaway"
  /** Identifier of a message in the chat with the giveaway; the message could have been deleted already. May be 0 if the message isn't sent yet. */
  giveaway_message_id: string
  /** Optional. User that won the prize in the giveaway if any; for Telegram Premium giveaways only */
  user?: User
  /** Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only */
  prize_star_count?: number
  /** Optional. True, if the giveaway was completed, but there was no user to win the prize */
  is_unclaimed?: boolean
}

export type ChatBoost = {
  /** Unique identifier of the boost */
  boost_id: string
  /** Point in time (Unix timestamp) when the chat was boosted */
  add_date: number
  /** Point in time (Unix timestamp) when the boost will automatically expire, unless the booster's Telegram Premium subscription is prolonged */
  expiration_date: number
  /** Source of the added boost */
  source: ChatBoostSource
}

export type ChatBoostUpdated = {
  /** Chat which was boosted */
  chat: Chat
  /** Information about the chat boost */
  boost: ChatBoost
}

export type ChatBoostRemoved = {
  /** Chat which was boosted */
  chat: Chat
  /** Unique identifier of the boost */
  boost_id: string
  /** Point in time (Unix timestamp) when the boost was removed */
  remove_date: number
  /** Source of the removed boost */
  source: ChatBoostSource
}

export type ChatOwnerLeft = {
  /** Optional. The user who will become the new owner of the chat if the previous owner does not return to the chat */
  new_owner?: User
}

export type ChatOwnerChanged = {
  /** The new owner of the chat */
  new_owner: User
}

export type UserChatBoosts = {
  /** The list of boosts added to the chat by the user */
  boosts: Array<ChatBoost>
}

export type BusinessBotRights = {
  /** Optional. True, if the bot can send and edit messages in the private chats that had incoming messages in the last 24 hours */
  can_reply?: boolean
  /** Optional. True, if the bot can mark incoming private messages as read */
  can_read_messages?: boolean
  /** Optional. True, if the bot can delete messages sent by the bot */
  can_delete_sent_messages?: boolean
  /** Optional. True, if the bot can delete all private messages in managed chats */
  can_delete_all_messages?: boolean
  /** Optional. True, if the bot can edit the first and last name of the business account */
  can_edit_name?: boolean
  /** Optional. True, if the bot can edit the bio of the business account */
  can_edit_bio?: boolean
  /** Optional. True, if the bot can edit the profile photo of the business account */
  can_edit_profile_photo?: boolean
  /** Optional. True, if the bot can edit the username of the business account */
  can_edit_username?: boolean
  /** Optional. True, if the bot can change the privacy settings pertaining to gifts for the business account */
  can_change_gift_settings?: boolean
  /** Optional. True, if the bot can view gifts and the amount of Telegram Stars owned by the business account */
  can_view_gifts_and_stars?: boolean
  /** Optional. True, if the bot can convert regular gifts owned by the business account to Telegram Stars */
  can_convert_gifts_to_stars?: boolean
  /** Optional. True, if the bot can transfer and upgrade gifts owned by the business account */
  can_transfer_and_upgrade_gifts?: boolean
  /** Optional. True, if the bot can transfer Telegram Stars received by the business account to its own account, or use them to upgrade and transfer gifts */
  can_transfer_stars?: boolean
  /** Optional. True, if the bot can post, edit and delete stories on behalf of the business account */
  can_manage_stories?: boolean
}

export type BusinessConnection = {
  /** Unique identifier of the business connection */
  id: string
  /** Business account user that created the business connection */
  user: User
  /** Identifier of a private chat with the user who created the business connection. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. */
  user_chat_id: string
  /** Date the connection was established in Unix time */
  date: number
  /** Optional. Rights of the business bot */
  rights?: BusinessBotRights
  /** True, if the connection is active */
  is_enabled: boolean
}

export type BusinessMessagesDeleted = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Information about a chat in the business account. The bot may not have access to the chat or the corresponding user. */
  chat: Chat
  /** The list of identifiers of deleted messages in the chat of the business account */
  message_ids: Array<number>
}

export type SentWebAppMessage = {
  /** Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. */
  inline_message_id?: string
}

export type SentGuestMessage = {
  /** Identifier of the sent inline message */
  inline_message_id: string
}

export type PreparedInlineMessage = {
  /** Unique identifier of the prepared message */
  id: string
  /** Expiration date of the prepared message, in Unix time. Expired prepared messages can no longer be used. */
  expiration_date: number
}

export type PreparedKeyboardButton = {
  /** Unique identifier of the keyboard button */
  id: string
}

export type ResponseParameters = {
  /** Optional. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
  migrate_to_chat_id?: string
  /** Optional. In case of exceeding flood control, the number of seconds left to wait before the request can be repeated */
  retry_after?: number
}

export type InputMedia =
  | InputMediaAnimation
  | InputMediaAudio
  | InputMediaDocument
  | InputMediaLivePhoto
  | InputMediaPhoto
  | InputMediaVideo

export type InputMediaAnimation = {
  /** Type of the media, must be animation */
  type: "animation"
  /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  media: string
  /** Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string
  /** Optional. Caption of the animation to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the animation caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Animation width */
  width?: number
  /** Optional. Animation height */
  height?: number
  /** Optional. Animation duration in seconds */
  duration?: number
  /** Optional. Pass True if the animation needs to be covered with a spoiler animation */
  has_spoiler?: boolean
}

export type InputMediaAudio = {
  /** Type of the media, must be audio */
  type: "audio"
  /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  media: string
  /** Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string
  /** Optional. Caption of the audio to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the audio caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Duration of the audio in seconds */
  duration?: number
  /** Optional. Performer of the audio */
  performer?: string
  /** Optional. Title of the audio */
  title?: string
}

export type InputMediaDocument = {
  /** Type of the media, must be document */
  type: "document"
  /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  media: string
  /** Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string
  /** Optional. Caption of the document to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the document caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always True, if the document is sent as part of an album. */
  disable_content_type_detection?: boolean
}

export type InputMediaLink = {
  /** Type of the media, must be link */
  type: "link"
  /** HTTP URL of the link */
  url: string
}

export type InputMediaLivePhoto = {
  /** Type of the media, must be live_photo */
  type: "live_photo"
  /** Video of the live photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported. */
  media: string
  /** The static photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported. */
  photo: string
  /** Optional. Caption of the live photo to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the live photo caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Pass True if the live photo needs to be covered with a spoiler animation */
  has_spoiler?: boolean
}

export type InputMediaLocation = {
  /** Type of the media, must be location */
  type: "location"
  /** Latitude of the location */
  latitude: number
  /** Longitude of the location */
  longitude: number
  /** Optional. The radius of uncertainty for the location, measured in meters; 0-1500 */
  horizontal_accuracy?: number
}

export type InputMediaPhoto = {
  /** Type of the media, must be photo */
  type: "photo"
  /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  media: string
  /** Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the photo caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Pass True if the photo needs to be covered with a spoiler animation */
  has_spoiler?: boolean
}

export type InputMediaSticker = {
  /** Type of the media, must be sticker */
  type: "sticker"
  /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a .WEBP sticker from the Internet, or pass "attach://<file_attach_name>" to upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  media: string
  /** Optional. Emoji associated with the sticker; only for just uploaded stickers */
  emoji?: string
}

export type InputMediaVenue = {
  /** Type of the media, must be venue */
  type: "venue"
  /** Latitude of the location */
  latitude: number
  /** Longitude of the location */
  longitude: number
  /** Name of the venue */
  title: string
  /** Address of the venue */
  address: string
  /** Optional. Foursquare identifier of the venue */
  foursquare_id?: string
  /** Optional. Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".) */
  foursquare_type?: string
  /** Optional. Google Places identifier of the venue */
  google_place_id?: string
  /** Optional. Google Places type of the venue. (See supported types.) */
  google_place_type?: string
}

export type InputMediaVideo = {
  /** Type of the media, must be video */
  type: "video"
  /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  media: string
  /** Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string
  /** Optional. Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  cover?: string
  /** Optional. Start timestamp for the video in the message */
  start_timestamp?: number
  /** Optional. Caption of the video to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the video caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Video width */
  width?: number
  /** Optional. Video height */
  height?: number
  /** Optional. Video duration in seconds */
  duration?: number
  /** Optional. Pass True if the uploaded video is suitable for streaming */
  supports_streaming?: boolean
  /** Optional. Pass True if the video needs to be covered with a spoiler animation */
  has_spoiler?: boolean
}

export type InputMediaVoiceNote = {
  /** Type of the media, must be voice_note */
  type: "voice_note"
  /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  media: string
  /** Optional. Caption of the voice message to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the voice message caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Duration of the voice message in seconds */
  duration?: number
}

export type InputFile = string

export type InputPaidMedia = InputPaidMediaLivePhoto | InputPaidMediaPhoto | InputPaidMediaVideo

export type InputPaidMediaLivePhoto = {
  /** Type of the media, must be live_photo */
  type: "live_photo"
  /** Video of the live photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported. */
  media: string
  /** The static photo to send. Pass a file_id to send a file that exists on the Telegram servers (recommended) or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported. */
  photo: string
}

export type InputPaidMediaPhoto = {
  /** Type of the media, must be photo */
  type: "photo"
  /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  media: string
}

export type InputPaidMediaVideo = {
  /** Type of the media, must be video */
  type: "video"
  /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  media: string
  /** Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string
  /** Optional. Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  cover?: string
  /** Optional. Start timestamp for the video in the message */
  start_timestamp?: number
  /** Optional. Video width */
  width?: number
  /** Optional. Video height */
  height?: number
  /** Optional. Video duration in seconds */
  duration?: number
  /** Optional. Pass True if the uploaded video is suitable for streaming */
  supports_streaming?: boolean
}

export type InputProfilePhoto = InputProfilePhotoStatic | InputProfilePhotoAnimated

export type InputProfilePhotoStatic = {
  /** Type of the profile photo, must be static */
  type: "static"
  /** The static profile photo. Profile photos can't be reused and can only be uploaded as a new file, so you can pass "attach://<file_attach_name>" if the photo was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  photo: string
}

export type InputProfilePhotoAnimated = {
  /** Type of the profile photo, must be animated */
  type: "animated"
  /** The animated profile photo. Profile photos can't be reused and can only be uploaded as a new file, so you can pass "attach://<file_attach_name>" if the photo was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  animation: string
  /** Optional. Timestamp in seconds of the frame that will be used as the static profile photo. Defaults to 0.0. */
  main_frame_timestamp?: number
}

export type InputStoryContent = InputStoryContentPhoto | InputStoryContentVideo

export type InputStoryContentPhoto = {
  /** Type of the content, must be photo */
  type: "photo"
  /** The photo to post as a story. The photo must be of the size 1080x1920 and must not exceed 10 MB. The photo can't be reused and can only be uploaded as a new file, so you can pass "attach://<file_attach_name>" if the photo was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  photo: string
}

export type InputStoryContentVideo = {
  /** Type of the content, must be video */
  type: "video"
  /** The video to post as a story. The video must be of the size 720x1280, streamable, encoded with H.265 codec, with key frames added each second in the MPEG4 format, and must not exceed 30 MB. The video can't be reused and can only be uploaded as a new file, so you can pass "attach://<file_attach_name>" if the video was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  video: string
  /** Optional. Precise duration of the video in seconds; 0-60 */
  duration?: number
  /** Optional. Timestamp in seconds of the frame that will be used as the static cover for the story. Defaults to 0.0. */
  cover_frame_timestamp?: number
  /** Optional. Pass True if the video has no sound */
  is_animation?: boolean
}

export type Sticker = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** Type of the sticker, currently one of "regular", "mask", "custom_emoji". The type of the sticker is independent from its format, which is determined by the fields is_animated and is_video. */
  type: string
  /** Sticker width */
  width: number
  /** Sticker height */
  height: number
  /** True, if the sticker is animated */
  is_animated: boolean
  /** True, if the sticker is a video sticker */
  is_video: boolean
  /** Optional. Sticker thumbnail in the .WEBP or .JPG format */
  thumbnail?: PhotoSize
  /** Optional. Emoji associated with the sticker */
  emoji?: string
  /** Optional. Name of the sticker set to which the sticker belongs */
  set_name?: string
  /** Optional. For premium regular stickers, premium animation for the sticker */
  premium_animation?: File
  /** Optional. For mask stickers, the position where the mask should be placed */
  mask_position?: MaskPosition
  /** Optional. For custom emoji stickers, unique identifier of the custom emoji */
  custom_emoji_id?: string
  /** Optional. True, if the sticker must be repainted to a text color in messages, the color of the Telegram Premium badge in emoji status, white color on chat photos, or another appropriate color in other places */
  needs_repainting?: boolean
  /** Optional. File size in bytes */
  file_size?: number
}

export type StickerSet = {
  /** Sticker set name */
  name: string
  /** Sticker set title */
  title: string
  /** Type of stickers in the set, currently one of "regular", "mask", "custom_emoji" */
  sticker_type: string
  /** List of all set stickers */
  stickers: Array<Sticker>
  /** Optional. Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format */
  thumbnail?: PhotoSize
}

export type MaskPosition = {
  /** The part of the face relative to which the mask should be placed. One of "forehead", "eyes", "mouth", or "chin". */
  point: string
  /** Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position. */
  x_shift: number
  /** Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position. */
  y_shift: number
  /** Mask scaling coefficient. For example, 2.0 means double size. */
  scale: number
}

export type InputSticker = {
  /** The added sticker. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new file using multipart/form-data under <file_attach_name> name. Animated and video stickers can't be uploaded via HTTP URL. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  sticker: string
  /** Format of the added sticker, must be one of "static" for a .WEBP or .PNG image, "animated" for a .TGS animation, "video" for a .WEBM video */
  format: string
  /** List of 1-20 emoji associated with the sticker */
  emoji_list: Array<string>
  /** Optional. Position where the mask should be placed on faces. For "mask" stickers only. */
  mask_position?: MaskPosition
  /** Optional. List of 0-20 search keywords for the sticker with total length of up to 64 characters. For "regular" and "custom_emoji" stickers only. */
  keywords?: Array<string>
}

export type RichMessage = {
  /** Content of the message */
  blocks: Array<RichBlock>
  /** Optional. True, if the rich message must be shown right-to-left */
  is_rtl?: boolean
}

export type InputRichMessage = {
  /** Optional. Content of the rich message to send described as a list of blocks */
  blocks?: Array<InputRichBlock>
  /** Optional. Content of the rich message to send described using HTML formatting. See rich message formatting options for more details. Use media field to specify the media used in the message. */
  html?: string
  /** Optional. Content of the rich message to send described using Markdown formatting. See rich message formatting options for more details. Use media field to specify the media used in the message. */
  markdown?: string
  /** Optional. List of media that are specified in the markdown or html fields using tg://photo?id=, tg://video?id=, tg://document?id=, and tg://audio?id= links */
  media?: Array<InputRichMessageMedia>
  /** Optional. Pass True if the rich message must be shown right-to-left */
  is_rtl?: boolean
  /** Optional. Pass True to skip automatic detection of entities (e.g., URLs, email addresses, username mentions, hashtags, cashtags, bot commands, or phone numbers) in the text */
  skip_entity_detection?: boolean
}

export type InputRichMessageMedia = {
  /** Unique identifier of the media used in a tg://photo?id=, tg://video?id=, tg://document?id=, or tg://audio?id= link. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed. */
  id: string
  /** The media to be sent. Everything except the media itself and its properties is ignored. */
  media:
    | InputMediaAnimation
    | InputMediaAudio
    | InputMediaDocument
    | InputMediaPhoto
    | InputMediaVideo
    | InputMediaVoiceNote
}

export type RichMessageButton = {
  /** Text of the button. May contain only plain text, RichTextCustomEmoji and RichTextDateTime entities. */
  text: RichText
  /** Optional. Style of the button. Must be one of "danger", "success", "primary", or "link" (the button is shown as a regular link without borders). Apps may use theme-specific colors for the button background and text based on the style. The style "link" is allowed only for callback buttons. */
  style?: string
  /** Optional. HTTP or tg:// URL to be opened when the button is pressed. Links tg://user?id=<user_id> can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings. */
  url?: string
  /** Optional. Data to be sent in a callback query to the bot when the button is pressed, 1-64 bytes */
  callback_data?: string
  /** Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method answerWebAppQuery. Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a business account. */
  web_app?: WebAppInfo
  /** Optional. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the Telegram Login Widget. Not supported for ephemeral messages. */
  login_url?: LoginUrl
  /** Optional. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a business account. */
  switch_inline_query?: string
  /** Optional. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a business account. */
  switch_inline_query_current_chat?: string
  /** Optional. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a business account. */
  switch_inline_query_chosen_chat?: SwitchInlineQueryChosenChat
  /** Optional. A button that copies the specified text to the clipboard */
  copy_text?: CopyTextButton
  /** Optional. If set, then the button is disabled and does nothing */
  disabled?: DisabledButton
}

export type RichText =
  | string
  | Array<RichText>
  | RichTextBold
  | RichTextItalic
  | RichTextUnderline
  | RichTextStrikethrough
  | RichTextSpoiler
  | RichTextDateTime
  | RichTextTextMention
  | RichTextSubscript
  | RichTextSuperscript
  | RichTextMarked
  | RichTextCode
  | RichTextCustomEmoji
  | RichTextMathematicalExpression
  | RichTextUrl
  | RichTextEmailAddress
  | RichTextPhoneNumber
  | RichTextBankCardNumber
  | RichTextMention
  | RichTextHashtag
  | RichTextCashtag
  | RichTextBotCommand
  | RichTextButton
  | RichTextAnchor
  | RichTextAnchorLink
  | RichTextReference
  | RichTextReferenceLink

export type RichTextBold = {
  /** Type of the rich text, always "bold" */
  type: "bold"
  /** The text */
  text: RichText
}

export type RichTextItalic = {
  /** Type of the rich text, always "italic" */
  type: "italic"
  /** The text */
  text: RichText
}

export type RichTextUnderline = {
  /** Type of the rich text, always "underline" */
  type: "underline"
  /** The text */
  text: RichText
}

export type RichTextStrikethrough = {
  /** Type of the rich text, always "strikethrough" */
  type: "strikethrough"
  /** The text */
  text: RichText
}

export type RichTextSpoiler = {
  /** Type of the rich text, always "spoiler" */
  type: "spoiler"
  /** The text */
  text: RichText
}

export type RichTextDateTime = {
  /** Type of the rich text, always "date_time" */
  type: "date_time"
  /** The text */
  text: RichText
  /** The Unix time associated with the entity */
  unix_time: number
  /** The string that defines the formatting of the date and time. See date-time entity formatting for more details. */
  date_time_format: string
}

export type RichTextTextMention = {
  /** Type of the rich text, always "text_mention" */
  type: "text_mention"
  /** The text */
  text: RichText
  /** The mentioned user */
  user: User
}

export type RichTextSubscript = {
  /** Type of the rich text, always "subscript" */
  type: "subscript"
  /** The text */
  text: RichText
}

export type RichTextSuperscript = {
  /** Type of the rich text, always "superscript" */
  type: "superscript"
  /** The text */
  text: RichText
}

export type RichTextMarked = {
  /** Type of the rich text, always "marked" */
  type: "marked"
  /** The text */
  text: RichText
}

export type RichTextCode = {
  /** Type of the rich text, always "code" */
  type: "code"
  /** The text */
  text: RichText
}

export type RichTextCustomEmoji = {
  /** Type of the rich text, always "custom_emoji" */
  type: "custom_emoji"
  /** Unique identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker. */
  custom_emoji_id: string
  /** Alternative emoji for the custom emoji */
  alternative_text: string
}

export type RichTextMathematicalExpression = {
  /** Type of the rich text, always "mathematical_expression" */
  type: "mathematical_expression"
  /** The expression in LaTeX format */
  expression: string
}

export type RichTextUrl = {
  /** Type of the rich text, always "url" */
  type: "url"
  /** The text */
  text: RichText
  /** URL of the link */
  url: string
}

export type RichTextEmailAddress = {
  /** Type of the rich text, always "email_address" */
  type: "email_address"
  /** The text */
  text: RichText
  /** The email address */
  email_address: string
}

export type RichTextPhoneNumber = {
  /** Type of the rich text, always "phone_number" */
  type: "phone_number"
  /** The text */
  text: RichText
  /** The phone number */
  phone_number: string
}

export type RichTextBankCardNumber = {
  /** Type of the rich text, always "bank_card_number" */
  type: "bank_card_number"
  /** The text */
  text: RichText
  /** The bank card number */
  bank_card_number: string
}

export type RichTextMention = {
  /** Type of the rich text, always "mention" */
  type: "mention"
  /** The text */
  text: RichText
  /** The username */
  username: string
}

export type RichTextHashtag = {
  /** Type of the rich text, always "hashtag" */
  type: "hashtag"
  /** The text */
  text: RichText
  /** The hashtag */
  hashtag: string
}

export type RichTextCashtag = {
  /** Type of the rich text, always "cashtag" */
  type: "cashtag"
  /** The text */
  text: RichText
  /** The cashtag */
  cashtag: string
}

export type RichTextBotCommand = {
  /** Type of the rich text, always "bot_command" */
  type: "bot_command"
  /** The text */
  text: RichText
  /** The bot command */
  bot_command: string
}

export type RichTextButton = {
  /** Type of the rich text, always "button" */
  type: "button"
  /** The button */
  button: RichMessageButton
}

export type RichTextAnchor = {
  /** Type of the rich text, always "anchor" */
  type: "anchor"
  /** The name of the anchor */
  name: string
}

export type RichTextAnchorLink = {
  /** Type of the rich text, always "anchor_link" */
  type: "anchor_link"
  /** The link text */
  text: RichText
  /** The name of the anchor. If the name is empty, then the link brings back to the top of the message. */
  anchor_name: string
}

export type RichTextReference = {
  /** Type of the rich text, always "reference" */
  type: "reference"
  /** Text of the reference */
  text: RichText
  /** The name of the reference */
  name: string
}

export type RichTextReferenceLink = {
  /** Type of the rich text, always "reference_link" */
  type: "reference_link"
  /** The link text */
  text: RichText
  /** The name of the reference */
  reference_name: string
}

export type RichBlockCaption = {
  /** Block caption */
  text: RichText
  /** Optional. Block credit which corresponds to the HTML tag <cite> */
  credit?: RichText
}

export type RichBlockTableCell = {
  /** Optional. Text in the cell. If omitted, then the cell is invisible. */
  text?: RichText
  /** Optional. True, if the cell is a header cell */
  is_header?: boolean
  /** Optional. The number of columns the cell spans if it is bigger than 1 */
  colspan?: number
  /** Optional. The number of rows the cell spans if it is bigger than 1 */
  rowspan?: number
  /** Horizontal cell content alignment. Currently, must be one of "left", "center", or "right". */
  align: string
  /** Vertical cell content alignment. Currently, must be one of "top", "middle", or "bottom". */
  valign: string
}

export type RichBlockListItem = {
  /** Label of the item */
  label: string
  /** The content of the item */
  blocks: Array<RichBlock>
  /** Optional. True, if the item has a checkbox */
  has_checkbox?: boolean
  /** Optional. True, if the item has a checked checkbox */
  is_checked?: boolean
  /** Optional. For ordered lists, the numeric value of the item label */
  value?: number
  /** Optional. For ordered lists, the type of the item label; must be one of "a" for lowercase letters, "A" for uppercase letters, "i" for lowercase Roman numerals, "I" for uppercase Roman numerals, or "1" for decimal numbers */
  type?: string
}

export type RichBlock =
  | RichBlockParagraph
  | RichBlockSectionHeading
  | RichBlockPreformatted
  | RichBlockFooter
  | RichBlockDivider
  | RichBlockMathematicalExpression
  | RichBlockAnchor
  | RichBlockList
  | RichBlockBlockQuotation
  | RichBlockExpandableBlockQuotation
  | RichBlockPullQuotation
  | RichBlockCollage
  | RichBlockSlideshow
  | RichBlockTable
  | RichBlockDetails
  | RichBlockMap
  | RichBlockButtons
  | RichBlockAnimation
  | RichBlockAudio
  | RichBlockDocument
  | RichBlockPhoto
  | RichBlockVideo
  | RichBlockVoiceNote
  | RichBlockThinking

export type RichBlockParagraph = {
  /** Type of the block, always "paragraph" */
  type: "paragraph"
  /** Text of the block */
  text: RichText
}

export type RichBlockSectionHeading = {
  /** Type of the block, always "heading" */
  type: "heading"
  /** Text of the block */
  text: RichText
  /** Relative size of the text font; 1-6, 1 is the largest, 6 is the smallest */
  size: number
}

export type RichBlockPreformatted = {
  /** Type of the block, always "pre" */
  type: "pre"
  /** Text of the block */
  text: RichText
  /** Optional. The programming language of the text */
  language?: string
}

export type RichBlockFooter = {
  /** Type of the block, always "footer" */
  type: "footer"
  /** Text of the block */
  text: RichText
}

export type RichBlockDivider = {
  /** Type of the block, always "divider" */
  type: "divider"
}

export type RichBlockMathematicalExpression = {
  /** Type of the block, always "mathematical_expression" */
  type: "mathematical_expression"
  /** The mathematical expression in LaTeX format */
  expression: string
}

export type RichBlockAnchor = {
  /** Type of the block, always "anchor" */
  type: "anchor"
  /** The name of the anchor */
  name: string
}

export type RichBlockList = {
  /** Type of the block, always "list" */
  type: "list"
  /** Items of the list */
  items: Array<RichBlockListItem>
}

export type RichBlockBlockQuotation = {
  /** Type of the block, always "blockquote" */
  type: "blockquote"
  /** Content of the block */
  blocks: Array<RichBlock>
  /** Optional. Credit of the block */
  credit?: RichText
}

export type RichBlockExpandableBlockQuotation = {
  /** Type of the block, always "expandable_blockquote" */
  type: "expandable_blockquote"
  /** Content of the block */
  text: RichText
  /** Optional. Credit of the block */
  credit?: RichText
}

export type RichBlockPullQuotation = {
  /** Type of the block, always "pullquote" */
  type: "pullquote"
  /** Text of the block */
  text: RichText
  /** Optional. Credit of the block */
  credit?: RichText
}

export type RichBlockCollage = {
  /** Type of the block, always "collage" */
  type: "collage"
  /** Elements of the collage */
  blocks: Array<RichBlock>
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type RichBlockSlideshow = {
  /** Type of the block, always "slideshow" */
  type: "slideshow"
  /** Elements of the slideshow */
  blocks: Array<RichBlock>
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type RichBlockTable = {
  /** Type of the block, always "table" */
  type: "table"
  /** Cells of the table */
  cells: Array<Array<RichBlockTableCell>>
  /** Optional. True, if the table has borders */
  is_bordered?: boolean
  /** Optional. True, if the table is striped */
  is_striped?: boolean
  /** Optional. True, if table cells have smaller indents */
  is_compact?: boolean
  /** Optional. Caption of the table */
  caption?: RichText
}

export type RichBlockDetails = {
  /** Type of the block, always "details" */
  type: "details"
  /** Always shown summary of the block */
  summary: RichText
  /** Content of the block */
  blocks: Array<RichBlock>
  /** Optional. True, if the content of the block is visible by default */
  is_open?: boolean
}

export type RichBlockMap = {
  /** Type of the block, always "map" */
  type: "map"
  /** Location of the center of the map */
  location: Location
  /** Map zoom level */
  zoom: number
  /** Expected width of the map */
  width: number
  /** Expected height of the map */
  height: number
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type RichBlockButtons = {
  /** Type of the block, always "buttons" */
  type: "buttons"
  /** The buttons */
  buttons: Array<RichMessageButton>
  /** Optional. Horizontal alignment of the buttons. Currently, must be one of "left", "center", or "right". */
  align?: string
}

export type RichBlockAnimation = {
  /** Type of the block, always "animation" */
  type: "animation"
  /** The animation */
  animation: Animation
  /** Optional. True, if the media preview is covered by a spoiler animation */
  has_spoiler?: boolean
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type RichBlockAudio = {
  /** Type of the block, always "audio" */
  type: "audio"
  /** The audio */
  audio: Audio
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type RichBlockDocument = {
  /** Type of the block, always "document" */
  type: "document"
  /** The document */
  document: Document
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type RichBlockPhoto = {
  /** Type of the block, always "photo" */
  type: "photo"
  /** Available sizes of the photo */
  photo: Array<PhotoSize>
  /** Optional. True, if the media preview is covered by a spoiler animation */
  has_spoiler?: boolean
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type RichBlockVideo = {
  /** Type of the block, always "video" */
  type: "video"
  /** The video */
  video: Video
  /** Optional. True, if the media preview is covered by a spoiler animation */
  has_spoiler?: boolean
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type RichBlockVoiceNote = {
  /** Type of the block, always "voice_note" */
  type: "voice_note"
  /** The voice note */
  voice_note: Voice
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type RichBlockThinking = {
  /** Type of the block, always "thinking" */
  type: "thinking"
  /** Text of the block. See https://t.me/addemoji/AIActions for examples of custom emoji that are recommended for usage in the block. */
  text: RichText
}

export type InputRichBlockListItem = {
  /** The content of the item */
  blocks: Array<InputRichBlock>
  /** Optional. Pass True if the item has a checkbox */
  has_checkbox?: boolean
  /** Optional. Pass True if the item has a checked checkbox */
  is_checked?: boolean
  /** Optional. For ordered lists, the numeric value of the item label */
  value?: number
  /** Optional. For ordered lists, the type of the item label; must be one of "a" for lowercase letters, "A" for uppercase letters, "i" for lowercase Roman numerals, "I" for uppercase Roman numerals, or "1" for decimal numbers */
  type?: string
}

export type InputRichBlock =
  | InputRichBlockParagraph
  | InputRichBlockSectionHeading
  | InputRichBlockPreformatted
  | InputRichBlockFooter
  | InputRichBlockDivider
  | InputRichBlockMathematicalExpression
  | InputRichBlockAnchor
  | InputRichBlockList
  | InputRichBlockBlockQuotation
  | InputRichBlockExpandableBlockQuotation
  | InputRichBlockPullQuotation
  | InputRichBlockCollage
  | InputRichBlockSlideshow
  | InputRichBlockTable
  | InputRichBlockDetails
  | InputRichBlockMap
  | InputRichBlockButtons
  | InputRichBlockAnimation
  | InputRichBlockAudio
  | InputRichBlockDocument
  | InputRichBlockPhoto
  | InputRichBlockVideo
  | InputRichBlockVoiceNote
  | InputRichBlockThinking

export type InputRichBlockParagraph = {
  /** Type of the block, always "paragraph" */
  type: "paragraph"
  /** Text of the block */
  text: RichText
}

export type InputRichBlockSectionHeading = {
  /** Type of the block, always "heading" */
  type: "heading"
  /** Text of the block */
  text: RichText
  /** Relative size of the text font; 1-6, 1 is the largest, 6 is the smallest */
  size: number
}

export type InputRichBlockPreformatted = {
  /** Type of the block, always "pre" */
  type: "pre"
  /** Text of the block */
  text: RichText
  /** Optional. The programming language of the text */
  language?: string
}

export type InputRichBlockFooter = {
  /** Type of the block, always "footer" */
  type: "footer"
  /** Text of the block */
  text: RichText
}

export type InputRichBlockDivider = {
  /** Type of the block, always "divider" */
  type: "divider"
}

export type InputRichBlockMathematicalExpression = {
  /** Type of the block, always "mathematical_expression" */
  type: "mathematical_expression"
  /** The mathematical expression in LaTeX format */
  expression: string
}

export type InputRichBlockAnchor = {
  /** Type of the block, always "anchor" */
  type: "anchor"
  /** The name of the anchor */
  name: string
}

export type InputRichBlockList = {
  /** Type of the block, always "list" */
  type: "list"
  /** Items of the list */
  items: Array<InputRichBlockListItem>
}

export type InputRichBlockBlockQuotation = {
  /** Type of the block, always "blockquote" */
  type: "blockquote"
  /** Content of the block */
  blocks: Array<InputRichBlock>
  /** Optional. Credit of the block */
  credit?: RichText
}

export type InputRichBlockExpandableBlockQuotation = {
  /** Type of the block, always "expandable_blockquote" */
  type: "expandable_blockquote"
  /** Content of the block */
  text: RichText
  /** Optional. Credit of the block */
  credit?: RichText
}

export type InputRichBlockPullQuotation = {
  /** Type of the block, always "pullquote" */
  type: "pullquote"
  /** Text of the block */
  text: RichText
  /** Optional. Credit of the block */
  credit?: RichText
}

export type InputRichBlockCollage = {
  /** Type of the block, always "collage" */
  type: "collage"
  /** Elements of the collage */
  blocks: Array<InputRichBlock>
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type InputRichBlockSlideshow = {
  /** Type of the block, always "slideshow" */
  type: "slideshow"
  /** Elements of the slideshow */
  blocks: Array<InputRichBlock>
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type InputRichBlockTable = {
  /** Type of the block, always "table" */
  type: "table"
  /** Cells of the table */
  cells: Array<Array<RichBlockTableCell>>
  /** Optional. Pass True if the table has borders */
  is_bordered?: boolean
  /** Optional. Pass True if the table is striped */
  is_striped?: boolean
  /** Optional. Pass True if table cells must have smaller indents */
  is_compact?: boolean
  /** Optional. Caption of the table */
  caption?: RichText
}

export type InputRichBlockDetails = {
  /** Type of the block, always "details" */
  type: "details"
  /** Always shown summary of the block */
  summary: RichText
  /** Content of the block */
  blocks: Array<InputRichBlock>
  /** Optional. Pass True if the content of the block is visible by default */
  is_open?: boolean
}

export type InputRichBlockMap = {
  /** Type of the block, always "map" */
  type: "map"
  /** Location of the center of the map */
  location: Location
  /** Optional. Map zoom level; 0-24 */
  zoom?: number
  /** Optional. Map width; 0-10000 */
  width?: number
  /** Optional. Map height; 0-10000 */
  height?: number
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type InputRichBlockButtons = {
  /** Type of the block, always "buttons" */
  type: "buttons"
  /** List of 1-8 buttons to send */
  buttons: Array<RichMessageButton>
  /** Optional. Horizontal alignment of the buttons. Currently, must be one of "left", "center", or "right". */
  align?: string
}

export type InputRichBlockAnimation = {
  /** Type of the block, always "animation" */
  type: "animation"
  /** The animation. Caption is ignored. */
  animation: InputMediaAnimation
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type InputRichBlockAudio = {
  /** Type of the block, always "audio" */
  type: "audio"
  /** The audio. Caption is ignored. */
  audio: InputMediaAudio
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type InputRichBlockDocument = {
  /** Type of the block, always "document" */
  type: "document"
  /** The document. Caption is ignored. */
  document: InputMediaDocument
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type InputRichBlockPhoto = {
  /** Type of the block, always "photo" */
  type: "photo"
  /** The photo. Caption is ignored. */
  photo: InputMediaPhoto
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type InputRichBlockVideo = {
  /** Type of the block, always "video" */
  type: "video"
  /** The video. Caption is ignored. */
  video: InputMediaVideo
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type InputRichBlockVoiceNote = {
  /** Type of the block, always "voice_note" */
  type: "voice_note"
  /** The voice note. Caption is ignored. */
  voice_note: InputMediaVoiceNote
  /** Optional. Caption of the block */
  caption?: RichBlockCaption
}

export type InputRichBlockThinking = {
  /** Type of the block, always "thinking" */
  type: "thinking"
  /** Text of the block. See https://t.me/addemoji/AIActions for examples of custom emoji that are recommended for usage in the block. */
  text: RichText
}

export type InlineQuery = {
  /** Unique identifier for this query */
  id: string
  /** Sender */
  from: User
  /** Text of the query (up to 256 characters) */
  query: string
  /** Offset of the results to be returned, can be controlled by the bot */
  offset: string
  /** Optional. Type of the chat from which the inline query was sent. Can be either "sender" for a private chat with the inline query sender, "private", "group", "supergroup", or "channel". The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat. */
  chat_type?: string
  /** Optional. Sender location, only for bots that request user location */
  location?: Location
}

export type InlineQueryResultsButton = {
  /** Label text on the button */
  text: string
  /** Optional. Description of the Web App that will be launched when the user presses the button. The Web App will be able to switch back to the inline mode using the method switchInlineQuery inside the Web App. */
  web_app?: WebAppInfo
  /** Optional. Deep-linking parameter for the /start message sent to the bot when a user presses the button. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed. Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities. */
  start_parameter?: string
}

export type InlineQueryResult =
  | InlineQueryResultCachedAudio
  | InlineQueryResultCachedDocument
  | InlineQueryResultCachedGif
  | InlineQueryResultCachedMpeg4Gif
  | InlineQueryResultCachedPhoto
  | InlineQueryResultCachedSticker
  | InlineQueryResultCachedVideo
  | InlineQueryResultCachedVoice
  | InlineQueryResultArticle
  | InlineQueryResultAudio
  | InlineQueryResultContact
  | InlineQueryResultGame
  | InlineQueryResultDocument
  | InlineQueryResultGif
  | InlineQueryResultLocation
  | InlineQueryResultMpeg4Gif
  | InlineQueryResultPhoto
  | InlineQueryResultVenue
  | InlineQueryResultVideo
  | InlineQueryResultVoice

export type InlineQueryResultArticle = {
  /** Type of the result, must be article */
  type: "article"
  /** Unique identifier for this result, 1-64 Bytes */
  id: string
  /** Title of the result */
  title: string
  /** Content of the message to be sent */
  input_message_content: InputMessageContent
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. URL of the result */
  url?: string
  /** Optional. Short description of the result */
  description?: string
  /** Optional. Url of the thumbnail for the result */
  thumbnail_url?: string
  /** Optional. Thumbnail width */
  thumbnail_width?: number
  /** Optional. Thumbnail height */
  thumbnail_height?: number
}

export type InlineQueryResultPhoto = {
  /** Type of the result, must be photo */
  type: "photo"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid URL of the photo. Photo must be in JPEG format. Photo size must not exceed 5MB. */
  photo_url: string
  /** URL of the thumbnail for the photo */
  thumbnail_url: string
  /** Optional. Width of the photo */
  photo_width?: number
  /** Optional. Height of the photo */
  photo_height?: number
  /** Optional. Title for the result */
  title?: string
  /** Optional. Short description of the result */
  description?: string
  /** Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the photo caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the photo */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultGif = {
  /** Type of the result, must be gif */
  type: "gif"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid URL for the GIF file */
  gif_url: string
  /** Optional. Width of the GIF */
  gif_width?: number
  /** Optional. Height of the GIF */
  gif_height?: number
  /** Optional. Duration of the GIF in seconds */
  gif_duration?: number
  /** URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result */
  thumbnail_url: string
  /** Optional. MIME type of the thumbnail, must be one of "image/jpeg", "image/gif", or "video/mp4". Defaults to "image/jpeg". */
  thumbnail_mime_type?: string
  /** Optional. Title for the result */
  title?: string
  /** Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the GIF animation */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultMpeg4Gif = {
  /** Type of the result, must be mpeg4_gif */
  type: string
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid URL for the MPEG4 file */
  mpeg4_url: string
  /** Optional. Video width */
  mpeg4_width?: number
  /** Optional. Video height */
  mpeg4_height?: number
  /** Optional. Video duration in seconds */
  mpeg4_duration?: number
  /** URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result */
  thumbnail_url: string
  /** Optional. MIME type of the thumbnail, must be one of "image/jpeg", "image/gif", or "video/mp4". Defaults to "image/jpeg". */
  thumbnail_mime_type?: string
  /** Optional. Title for the result */
  title?: string
  /** Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the video animation */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultVideo = {
  /** Type of the result, must be video */
  type: "video"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid URL for the embedded video player or video file */
  video_url: string
  /** MIME type of the content of the video URL, "text/html" or "video/mp4" */
  mime_type: string
  /** URL of the thumbnail (JPEG only) for the video */
  thumbnail_url: string
  /** Title for the result */
  title: string
  /** Optional. Caption of the video to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the video caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Video width */
  video_width?: number
  /** Optional. Video height */
  video_height?: number
  /** Optional. Video duration in seconds */
  video_duration?: number
  /** Optional. Short description of the result */
  description?: string
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the video. This field is required if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video). */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultAudio = {
  /** Type of the result, must be audio */
  type: "audio"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid URL for the audio file */
  audio_url: string
  /** Title */
  title: string
  /** Optional. Caption, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the audio caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Performer */
  performer?: string
  /** Optional. Audio duration in seconds */
  audio_duration?: number
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the audio */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultVoice = {
  /** Type of the result, must be voice */
  type: "voice"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid URL for the voice recording */
  voice_url: string
  /** Recording title */
  title: string
  /** Optional. Caption, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the voice message caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Recording duration in seconds */
  voice_duration?: number
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the voice recording */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultDocument = {
  /** Type of the result, must be document */
  type: "document"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** Title for the result */
  title: string
  /** Optional. Caption of the document to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the document caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** A valid URL for the file */
  document_url: string
  /** MIME type of the content of the file, either "application/pdf" or "application/zip" */
  mime_type: string
  /** Optional. Short description of the result */
  description?: string
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the file */
  input_message_content?: InputMessageContent
  /** Optional. URL of the thumbnail (JPEG only) for the file */
  thumbnail_url?: string
  /** Optional. Thumbnail width */
  thumbnail_width?: number
  /** Optional. Thumbnail height */
  thumbnail_height?: number
}

export type InlineQueryResultLocation = {
  /** Type of the result, must be location */
  type: "location"
  /** Unique identifier for this result, 1-64 Bytes */
  id: string
  /** Location latitude in degrees */
  latitude: number
  /** Location longitude in degrees */
  longitude: number
  /** Location title */
  title: string
  /** Optional. The radius of uncertainty for the location, measured in meters; 0-1500 */
  horizontal_accuracy?: number
  /** Optional. Period in seconds during which the location can be updated, must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely */
  live_period?: number
  /** Optional. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
  heading?: number
  /** Optional. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
  proximity_alert_radius?: number
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the location */
  input_message_content?: InputMessageContent
  /** Optional. Url of the thumbnail for the result */
  thumbnail_url?: string
  /** Optional. Thumbnail width */
  thumbnail_width?: number
  /** Optional. Thumbnail height */
  thumbnail_height?: number
}

export type InlineQueryResultVenue = {
  /** Type of the result, must be venue */
  type: "venue"
  /** Unique identifier for this result, 1-64 Bytes */
  id: string
  /** Latitude of the venue location in degrees */
  latitude: number
  /** Longitude of the venue location in degrees */
  longitude: number
  /** Title of the venue */
  title: string
  /** Address of the venue */
  address: string
  /** Optional. Foursquare identifier of the venue if known */
  foursquare_id?: string
  /** Optional. Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".) */
  foursquare_type?: string
  /** Optional. Google Places identifier of the venue */
  google_place_id?: string
  /** Optional. Google Places type of the venue. (See supported types.) */
  google_place_type?: string
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the venue */
  input_message_content?: InputMessageContent
  /** Optional. Url of the thumbnail for the result */
  thumbnail_url?: string
  /** Optional. Thumbnail width */
  thumbnail_width?: number
  /** Optional. Thumbnail height */
  thumbnail_height?: number
}

export type InlineQueryResultContact = {
  /** Type of the result, must be contact */
  type: "contact"
  /** Unique identifier for this result, 1-64 Bytes */
  id: string
  /** Contact's phone number */
  phone_number: string
  /** Contact's first name */
  first_name: string
  /** Optional. Contact's last name */
  last_name?: string
  /** Optional. Additional data about the contact in the form of a vCard, 0-2048 bytes */
  vcard?: string
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the contact */
  input_message_content?: InputMessageContent
  /** Optional. Url of the thumbnail for the result */
  thumbnail_url?: string
  /** Optional. Thumbnail width */
  thumbnail_width?: number
  /** Optional. Thumbnail height */
  thumbnail_height?: number
}

export type InlineQueryResultGame = {
  /** Type of the result, must be game */
  type: "game"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** Short name of the game */
  game_short_name: string
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
}

export type InlineQueryResultCachedPhoto = {
  /** Type of the result, must be photo */
  type: "photo"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid file identifier of the photo */
  photo_file_id: string
  /** Optional. Title for the result */
  title?: string
  /** Optional. Short description of the result */
  description?: string
  /** Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the photo caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the photo */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultCachedGif = {
  /** Type of the result, must be gif */
  type: "gif"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid file identifier for the GIF file */
  gif_file_id: string
  /** Optional. Title for the result */
  title?: string
  /** Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the GIF animation */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultCachedMpeg4Gif = {
  /** Type of the result, must be mpeg4_gif */
  type: string
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid file identifier for the MPEG4 file */
  mpeg4_file_id: string
  /** Optional. Title for the result */
  title?: string
  /** Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the video animation */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultCachedSticker = {
  /** Type of the result, must be sticker */
  type: "sticker"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid file identifier of the sticker */
  sticker_file_id: string
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the sticker */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultCachedDocument = {
  /** Type of the result, must be document */
  type: "document"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** Title for the result */
  title: string
  /** A valid file identifier for the file */
  document_file_id: string
  /** Optional. Short description of the result */
  description?: string
  /** Optional. Caption of the document to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the document caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the file */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultCachedVideo = {
  /** Type of the result, must be video */
  type: "video"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid file identifier for the video file */
  video_file_id: string
  /** Title for the result */
  title: string
  /** Optional. Short description of the result */
  description?: string
  /** Optional. Caption of the video to be sent, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the video caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the video */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultCachedVoice = {
  /** Type of the result, must be voice */
  type: "voice"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid file identifier for the voice message */
  voice_file_id: string
  /** Voice message title */
  title: string
  /** Optional. Caption, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the voice message caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the voice message */
  input_message_content?: InputMessageContent
}

export type InlineQueryResultCachedAudio = {
  /** Type of the result, must be audio */
  type: "audio"
  /** Unique identifier for this result, 1-64 bytes */
  id: string
  /** A valid file identifier for the audio file */
  audio_file_id: string
  /** Optional. Caption, 0-1024 characters after entities parsing */
  caption?: string
  /** Optional. Mode for parsing entities in the audio caption. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Optional. Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup
  /** Optional. Content of the message to be sent instead of the audio */
  input_message_content?: InputMessageContent
}

export type InputMessageContent =
  | InputTextMessageContent
  | InputRichMessageContent
  | InputLocationMessageContent
  | InputVenueMessageContent
  | InputContactMessageContent
  | InputInvoiceMessageContent

export type InputTextMessageContent = {
  /** Text of the message to be sent, 1-4096 characters */
  message_text: string
  /** Optional. Mode for parsing entities in the message text. See formatting options for more details. */
  parse_mode?: string
  /** Optional. List of special entities that appear in message text, which can be specified instead of parse_mode */
  entities?: Array<MessageEntity>
  /** Optional. Link preview generation options for the message */
  link_preview_options?: LinkPreviewOptions
}

export type InputRichMessageContent = {
  /** The message to be sent. Only previously uploaded files may be used in the message. */
  rich_message: InputRichMessage
}

export type InputLocationMessageContent = {
  /** Latitude of the location in degrees */
  latitude: number
  /** Longitude of the location in degrees */
  longitude: number
  /** Optional. The radius of uncertainty for the location, measured in meters; 0-1500 */
  horizontal_accuracy?: number
  /** Optional. Period in seconds during which the location can be updated, must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely */
  live_period?: number
  /** Optional. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
  heading?: number
  /** Optional. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
  proximity_alert_radius?: number
}

export type InputVenueMessageContent = {
  /** Latitude of the venue in degrees */
  latitude: number
  /** Longitude of the venue in degrees */
  longitude: number
  /** Name of the venue */
  title: string
  /** Address of the venue */
  address: string
  /** Optional. Foursquare identifier of the venue, if known */
  foursquare_id?: string
  /** Optional. Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".) */
  foursquare_type?: string
  /** Optional. Google Places identifier of the venue */
  google_place_id?: string
  /** Optional. Google Places type of the venue. (See supported types.) */
  google_place_type?: string
}

export type InputContactMessageContent = {
  /** Contact's phone number */
  phone_number: string
  /** Contact's first name */
  first_name: string
  /** Optional. Contact's last name */
  last_name?: string
  /** Optional. Additional data about the contact in the form of a vCard, 0-2048 bytes */
  vcard?: string
}

export type InputInvoiceMessageContent = {
  /** Product name, 1-32 characters */
  title: string
  /** Product description, 1-255 characters */
  description: string
  /** Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. */
  payload: string
  /** Optional. Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars. */
  provider_token?: string
  /** Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars. */
  currency: string
  /** Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars. */
  prices: Array<LabeledPrice>
  /** Optional. The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars. */
  max_tip_amount?: number
  /** Optional. A JSON-serialized Array of suggested amounts of tip in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. */
  suggested_tip_amounts?: Array<number>
  /** Optional. A JSON-serialized object for data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider. */
  provider_data?: string
  /** Optional. URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. */
  photo_url?: string
  /** Optional. Photo size in bytes */
  photo_size?: number
  /** Optional. Photo width */
  photo_width?: number
  /** Optional. Photo height */
  photo_height?: number
  /** Optional. Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars. */
  need_name?: boolean
  /** Optional. Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars. */
  need_phone_number?: boolean
  /** Optional. Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars. */
  need_email?: boolean
  /** Optional. Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars. */
  need_shipping_address?: boolean
  /** Optional. Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars. */
  send_phone_number_to_provider?: boolean
  /** Optional. Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars. */
  send_email_to_provider?: boolean
  /** Optional. Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars. */
  is_flexible?: boolean
}

export type ChosenInlineResult = {
  /** The unique identifier for the result that was chosen */
  result_id: string
  /** The user that chose the result */
  from: User
  /** Optional. Sender location, only for bots that require user location */
  location?: Location
  /** Optional. Identifier of the sent inline message. Available only if there is an inline keyboard attached to the message. Will be also received in callback queries and can be used to edit the message. */
  inline_message_id?: string
  /** The query that was used to obtain the result */
  query: string
}

export type LabeledPrice = {
  /** Portion label */
  label: string
  /** Price of the product in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
  amount: number
}

export type Invoice = {
  /** Product name */
  title: string
  /** Product description */
  description: string
  /** Unique bot deep-linking parameter that can be used to generate this invoice */
  start_parameter: string
  /** Three-letter ISO 4217 currency code, or "XTR" for payments in Telegram Stars */
  currency: string
  /** Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
  total_amount: number
}

export type ShippingAddress = {
  /** Two-letter ISO 3166-1 alpha-2 country code */
  country_code: string
  /** State, if applicable */
  state: string
  /** City */
  city: string
  /** First line for the address */
  street_line1: string
  /** Second line for the address */
  street_line2: string
  /** Address post code */
  post_code: string
}

export type OrderInfo = {
  /** Optional. User name */
  name?: string
  /** Optional. User's phone number */
  phone_number?: string
  /** Optional. User email */
  email?: string
  /** Optional. User shipping address */
  shipping_address?: ShippingAddress
}

export type ShippingOption = {
  /** Shipping option identifier */
  id: string
  /** Option title */
  title: string
  /** List of price portions */
  prices: Array<LabeledPrice>
}

export type SuccessfulPayment = {
  /** Three-letter ISO 4217 currency code, or "XTR" for payments in Telegram Stars */
  currency: string
  /** Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
  total_amount: number
  /** Bot-specified invoice payload */
  invoice_payload: string
  /** Optional. Expiration date of the subscription, in Unix time; for recurring payments only */
  subscription_expiration_date?: number
  /** Optional. True, if the payment is a recurring payment for a subscription */
  is_recurring?: boolean
  /** Optional. True, if the payment is the first payment for a subscription */
  is_first_recurring?: boolean
  /** Optional. Identifier of the shipping option chosen by the user */
  shipping_option_id?: string
  /** Optional. Order information provided by the user */
  order_info?: OrderInfo
  /** Telegram payment identifier */
  telegram_payment_charge_id: string
  /** Provider payment identifier */
  provider_payment_charge_id: string
}

export type RefundedPayment = {
  /** Three-letter ISO 4217 currency code, or "XTR" for payments in Telegram Stars. Currently, always "XTR". */
  currency: string
  /** Total refunded price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45, total_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
  total_amount: number
  /** Bot-specified invoice payload */
  invoice_payload: string
  /** Telegram payment identifier */
  telegram_payment_charge_id: string
  /** Optional. Provider payment identifier */
  provider_payment_charge_id?: string
}

export type ShippingQuery = {
  /** Unique query identifier */
  id: string
  /** User who sent the query */
  from: User
  /** Bot-specified invoice payload */
  invoice_payload: string
  /** User specified shipping address */
  shipping_address: ShippingAddress
}

export type PreCheckoutQuery = {
  /** Unique query identifier */
  id: string
  /** User who sent the query */
  from: User
  /** Three-letter ISO 4217 currency code, or "XTR" for payments in Telegram Stars */
  currency: string
  /** Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
  total_amount: number
  /** Bot-specified invoice payload */
  invoice_payload: string
  /** Optional. Identifier of the shipping option chosen by the user */
  shipping_option_id?: string
  /** Optional. Order information provided by the user */
  order_info?: OrderInfo
}

export type PaidMediaPurchased = {
  /** User who purchased the media */
  from: User
  /** Bot-specified paid media payload */
  paid_media_payload: string
}

export type RevenueWithdrawalState =
  | RevenueWithdrawalStatePending
  | RevenueWithdrawalStateSucceeded
  | RevenueWithdrawalStateFailed

export type RevenueWithdrawalStatePending = {
  /** Type of the state, always "pending" */
  type: "pending"
}

export type RevenueWithdrawalStateSucceeded = {
  /** Type of the state, always "succeeded" */
  type: "succeeded"
  /** Date the withdrawal was completed in Unix time */
  date: number
  /** An HTTPS URL that can be used to see transaction details */
  url: string
}

export type RevenueWithdrawalStateFailed = {
  /** Type of the state, always "failed" */
  type: "failed"
}

export type AffiliateInfo = {
  /** Optional. The bot or the user that received an affiliate commission if it was received by a bot or a user */
  affiliate_user?: User
  /** Optional. The chat that received an affiliate commission if it was received by a chat */
  affiliate_chat?: Chat
  /** The number of Telegram Stars received by the affiliate for each 1000 Telegram Stars received by the bot from referred users */
  commission_per_mille: number
  /** Integer amount of Telegram Stars received by the affiliate from the transaction, rounded to 0; can be negative for refunds */
  amount: number
  /** Optional. The number of 1/1000000000 shares of Telegram Stars received by the affiliate; from -999999999 to 999999999; can be negative for refunds */
  nanostar_amount?: number
}

export type TransactionPartner =
  | TransactionPartnerUser
  | TransactionPartnerChat
  | TransactionPartnerAffiliateProgram
  | TransactionPartnerFragment
  | TransactionPartnerTelegramAds
  | TransactionPartnerTelegramApi
  | TransactionPartnerOther

export type TransactionPartnerUser = {
  /** Type of the transaction partner, always "user" */
  type: "user"
  /** Type of the transaction, currently one of "invoice_payment" for payments via invoices, "paid_media_payment" for payments for paid media, "gift_purchase" for gifts sent by the bot, "premium_purchase" for Telegram Premium subscriptions gifted by the bot, "business_account_transfer" for direct transfers from managed business accounts */
  transaction_type: string
  /** Information about the user */
  user: User
  /** Optional. Information about the affiliate that received a commission via this transaction. Can be available only for "invoice_payment" and "paid_media_payment" transactions. */
  affiliate?: AffiliateInfo
  /** Optional. Bot-specified invoice payload. Can be available only for "invoice_payment" transactions. */
  invoice_payload?: string
  /** Optional. The duration of the paid subscription. Can be available only for "invoice_payment" transactions. */
  subscription_period?: number
  /** Optional. Information about the paid media bought by the user; for "paid_media_payment" transactions only */
  paid_media?: Array<PaidMedia>
  /** Optional. Bot-specified paid media payload. Can be available only for "paid_media_payment" transactions. */
  paid_media_payload?: string
  /** Optional. The gift sent to the user by the bot; for "gift_purchase" transactions only */
  gift?: Gift
  /** Optional. Number of months the gifted Telegram Premium subscription will be active for; for "premium_purchase" transactions only */
  premium_subscription_duration?: number
}

export type TransactionPartnerChat = {
  /** Type of the transaction partner, always "chat" */
  type: "chat"
  /** Information about the chat */
  chat: Chat
  /** Optional. The gift sent to the chat by the bot */
  gift?: Gift
}

export type TransactionPartnerAffiliateProgram = {
  /** Type of the transaction partner, always "affiliate_program" */
  type: "affiliate_program"
  /** Optional. Information about the bot that sponsored the affiliate program */
  sponsor_user?: User
  /** The number of Telegram Stars received by the bot for each 1000 Telegram Stars received by the affiliate program sponsor from referred users */
  commission_per_mille: number
}

export type TransactionPartnerFragment = {
  /** Type of the transaction partner, always "fragment" */
  type: "fragment"
  /** Optional. State of the transaction if the transaction is outgoing */
  withdrawal_state?: RevenueWithdrawalState
}

export type TransactionPartnerTelegramAds = {
  /** Type of the transaction partner, always "telegram_ads" */
  type: "telegram_ads"
}

export type TransactionPartnerTelegramApi = {
  /** Type of the transaction partner, always "telegram_api" */
  type: "telegram_api"
  /** The number of successful requests that exceeded regular limits and were therefore billed */
  request_count: number
}

export type TransactionPartnerOther = {
  /** Type of the transaction partner, always "other" */
  type: "other"
}

export type StarTransaction = {
  /** Unique identifier of the transaction. Coincides with the identifier of the original transaction for refund transactions. Coincides with SuccessfulPayment.telegram_payment_charge_id for successful incoming payments from users. */
  id: string
  /** Integer amount of Telegram Stars transferred by the transaction */
  amount: number
  /** Optional. The number of 1/1000000000 shares of Telegram Stars transferred by the transaction; from 0 to 999999999 */
  nanostar_amount?: number
  /** Date the transaction was created in Unix time */
  date: number
  /** Optional. Source of an incoming transaction (e.g., a user purchasing goods or services, Fragment refunding a failed withdrawal). Only for incoming transactions. */
  source?: TransactionPartner
  /** Optional. Receiver of an outgoing transaction (e.g., a user for a purchase refund, Fragment for a withdrawal). Only for outgoing transactions. */
  receiver?: TransactionPartner
}

export type StarTransactions = {
  /** The list of transactions */
  transactions: Array<StarTransaction>
}

export type PassportData = {
  /** Array with information about documents and other Telegram Passport elements that was shared with the bot */
  data: Array<EncryptedPassportElement>
  /** Encrypted credentials required to decrypt the data */
  credentials: EncryptedCredentials
}

export type PassportFile = {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string
  /** File size in bytes */
  file_size: number
  /** Unix time when the file was uploaded */
  file_date: number
}

export type EncryptedPassportElement = {
  /** Element type. One of "personal_details", "passport", "driver_license", "identity_card", "internal_passport", "address", "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration", "phone_number", "email". */
  type: string
  /** Optional. Base64-encoded encrypted Telegram Passport element data provided by the user; available only for "personal_details", "passport", "driver_license", "identity_card", "internal_passport" and "address" types. Can be decrypted and verified using the accompanying EncryptedCredentials. */
  data?: string
  /** Optional. User's verified phone number; available only for "phone_number" type */
  phone_number?: string
  /** Optional. User's verified email address; available only for "email" type */
  email?: string
  /** Optional. Array of encrypted files with documents provided by the user; available only for "utility_bill", "bank_statement", "rental_agreement", "passport_registration" and "temporary_registration" types. Files can be decrypted and verified using the accompanying EncryptedCredentials. */
  files?: Array<PassportFile>
  /** Optional. Encrypted file with the front side of the document, provided by the user; available only for "passport", "driver_license", "identity_card" and "internal_passport". The file can be decrypted and verified using the accompanying EncryptedCredentials. */
  front_side?: PassportFile
  /** Optional. Encrypted file with the reverse side of the document, provided by the user; available only for "driver_license" and "identity_card". The file can be decrypted and verified using the accompanying EncryptedCredentials. */
  reverse_side?: PassportFile
  /** Optional. Encrypted file with the selfie of the user holding a document, provided by the user; available if requested for "passport", "driver_license", "identity_card" and "internal_passport". The file can be decrypted and verified using the accompanying EncryptedCredentials. */
  selfie?: PassportFile
  /** Optional. Array of encrypted files with translated versions of documents provided by the user; available if requested for "passport", "driver_license", "identity_card", "internal_passport", "utility_bill", "bank_statement", "rental_agreement", "passport_registration" and "temporary_registration" types. Files can be decrypted and verified using the accompanying EncryptedCredentials. */
  translation?: Array<PassportFile>
  /** Base64-encoded element hash for using in PassportElementErrorUnspecified */
  hash: string
}

export type EncryptedCredentials = {
  /** Base64-encoded encrypted JSON-serialized data with unique user's payload, data hashes and secrets required for EncryptedPassportElement decryption and authentication */
  data: string
  /** Base64-encoded data hash for data authentication */
  hash: string
  /** Base64-encoded secret, encrypted with the bot's public RSA key, required for data decryption */
  secret: string
}

export type PassportElementError =
  | PassportElementErrorDataField
  | PassportElementErrorFrontSide
  | PassportElementErrorReverseSide
  | PassportElementErrorSelfie
  | PassportElementErrorFile
  | PassportElementErrorFiles
  | PassportElementErrorTranslationFile
  | PassportElementErrorTranslationFiles
  | PassportElementErrorUnspecified

export type PassportElementErrorDataField = {
  /** Error source, must be data */
  source: "data"
  /** The section of the user's Telegram Passport which has the error, one of "personal_details", "passport", "driver_license", "identity_card", "internal_passport", "address" */
  type: string
  /** Name of the data field which has the error */
  field_name: string
  /** Base64-encoded data hash */
  data_hash: string
  /** Error message */
  message: string
}

export type PassportElementErrorFrontSide = {
  /** Error source, must be front_side */
  source: "front_side"
  /** The section of the user's Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport" */
  type: string
  /** Base64-encoded hash of the file with the front side of the document */
  file_hash: string
  /** Error message */
  message: string
}

export type PassportElementErrorReverseSide = {
  /** Error source, must be reverse_side */
  source: "reverse_side"
  /** The section of the user's Telegram Passport which has the issue, one of "driver_license", "identity_card" */
  type: string
  /** Base64-encoded hash of the file with the reverse side of the document */
  file_hash: string
  /** Error message */
  message: string
}

export type PassportElementErrorSelfie = {
  /** Error source, must be selfie */
  source: "selfie"
  /** The section of the user's Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport" */
  type: string
  /** Base64-encoded hash of the file with the selfie */
  file_hash: string
  /** Error message */
  message: string
}

export type PassportElementErrorFile = {
  /** Error source, must be file */
  source: "file"
  /** The section of the user's Telegram Passport which has the issue, one of "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration" */
  type: string
  /** Base64-encoded file hash */
  file_hash: string
  /** Error message */
  message: string
}

export type PassportElementErrorFiles = {
  /** Error source, must be files */
  source: "files"
  /** The section of the user's Telegram Passport which has the issue, one of "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration" */
  type: string
  /** List of base64-encoded file hashes */
  file_hashes: Array<string>
  /** Error message */
  message: string
}

export type PassportElementErrorTranslationFile = {
  /** Error source, must be translation_file */
  source: "translation_file"
  /** Type of element of the user's Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport", "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration" */
  type: string
  /** Base64-encoded file hash */
  file_hash: string
  /** Error message */
  message: string
}

export type PassportElementErrorTranslationFiles = {
  /** Error source, must be translation_files */
  source: "translation_files"
  /** Type of element of the user's Telegram Passport which has the issue, one of "passport", "driver_license", "identity_card", "internal_passport", "utility_bill", "bank_statement", "rental_agreement", "passport_registration", "temporary_registration" */
  type: string
  /** List of base64-encoded file hashes */
  file_hashes: Array<string>
  /** Error message */
  message: string
}

export type PassportElementErrorUnspecified = {
  /** Error source, must be unspecified */
  source: "unspecified"
  /** Type of element of the user's Telegram Passport which has the issue */
  type: string
  /** Base64-encoded element hash */
  element_hash: string
  /** Error message */
  message: string
}

export type Game = {
  /** Title of the game */
  title: string
  /** Description of the game */
  description: string
  /** Photo that will be displayed in the game message in chats */
  photo: Array<PhotoSize>
  /** Optional. Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls setGameScore, or manually edited using editMessageText. 0-4096 characters. */
  text?: string
  /** Optional. Special entities that appear in text, such as usernames, URLs, bot commands, etc. */
  text_entities?: Array<MessageEntity>
  /** Optional. Animation that will be displayed in the game message in chats. Upload via BotFather. */
  animation?: Animation
}

export type CallbackGame = Record<string, unknown>

export type GameHighScore = {
  /** Position in high score table for the game */
  position: number
  /** User */
  user: User
  /** Score */
  score: number
}

export type GetUpdatesRequest = {
  /** Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will be forgotten. */
  offset?: number
  /** Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100. */
  limit?: number
  /** Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only. */
  timeout?: number
  /** A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time. */
  allowed_updates?: Array<string>
}

export type GetUpdatesResponse = Array<Update>

export type SetWebhookRequest = {
  /** HTTPS URL to send updates to. Use an empty string to remove webhook integration. */
  url: string
  /** Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details. */
  certificate?: string
  /** The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS */
  ip_address?: string
  /** The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput. */
  max_connections?: number
  /** A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time. */
  allowed_updates?: Array<string>
  /** Pass True to drop all pending updates */
  drop_pending_updates?: boolean
  /** A secret token to be sent in a header "X-Telegram-Bot-Api-Secret-Token" in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header is useful to ensure that the request comes from a webhook set by you. */
  secret_token?: string
}

export type SetWebhookResponse = boolean

export type DeleteWebhookRequest = {
  /** Pass True to drop all pending updates */
  drop_pending_updates?: boolean
}

export type DeleteWebhookResponse = boolean

export type LogOutResponse = boolean

export type CloseResponse = boolean

export type SendMessageRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Text of the message to be sent, 1-4096 characters after entities parsing */
  text: string
  /** Mode for parsing entities in the message text. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode */
  entities?: Array<MessageEntity>
  /** Link preview generation options for the message */
  link_preview_options?: LinkPreviewOptions
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type ForwardMessageRequest = {
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat */
  direct_messages_topic_id?: string
  /** Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format @username) */
  from_chat_id: string | string
  /** New start timestamp for the forwarded video in the message */
  video_start_timestamp?: number
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the forwarded message from forwarding and saving */
  protect_content?: boolean
  /** Unique identifier of the message effect to be added to the message; only available when forwarding to private chats */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only */
  suggested_post_parameters?: SuggestedPostParameters
  /** Message identifier in the chat specified in from_chat_id */
  message_id: string
}

export type ForwardMessagesRequest = {
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat */
  direct_messages_topic_id?: string
  /** Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format @username) */
  from_chat_id: string | string
  /** A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to forward. The identifiers must be specified in a strictly increasing order. */
  message_ids: Array<number>
  /** Sends the messages silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the forwarded messages from forwarding and saving */
  protect_content?: boolean
}

export type ForwardMessagesResponse = Array<MessageId>

export type CopyMessageRequest = {
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format @username) */
  from_chat_id: string | string
  /** Message identifier in the chat specified in from_chat_id */
  message_id: string
  /** New start timestamp for the copied video in the message */
  video_start_timestamp?: number
  /** New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept. */
  caption?: string
  /** Mode for parsing entities in the new caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Pass True if the caption must be shown above the message media. Ignored if a new caption isn't specified. */
  show_caption_above_media?: boolean
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; only available when copying to private chats */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type CopyMessagesRequest = {
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format @username) */
  from_chat_id: string | string
  /** A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to copy. The identifiers must be specified in a strictly increasing order. */
  message_ids: Array<number>
  /** Sends the messages silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent messages from forwarding and saving */
  protect_content?: boolean
  /** Pass True to copy the messages without their captions */
  remove_caption?: boolean
}

export type CopyMessagesResponse = Array<MessageId>

export type SendPhotoRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  photo: string | string
  /** Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the photo caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Pass True if the photo needs to be covered with a spoiler animation */
  has_spoiler?: boolean
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendLivePhotoRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Live photo video to send. The video must be no longer than 10 seconds and must not exceed 10 MB in size. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported. */
  live_photo: string | string
  /** The static photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported. */
  photo: string | string
  /** Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the video caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Pass True if the video needs to be covered with a spoiler animation */
  has_spoiler?: boolean
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendAudioRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  audio: string | string
  /** Audio caption, 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the audio caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Duration of the audio in seconds */
  duration?: number
  /** Performer */
  performer?: string
  /** Track name */
  title?: string
  /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string | string
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendDocumentRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  document: string | string
  /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string | string
  /** Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the document caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Disables automatic server-side content type detection for files uploaded using multipart/form-data */
  disable_content_type_detection?: boolean
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendVideoRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  video: string | string
  /** Duration of sent video in seconds */
  duration?: number
  /** Video width */
  width?: number
  /** Video height */
  height?: number
  /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string | string
  /** Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  cover?: string | string
  /** Start timestamp for the video in the message */
  start_timestamp?: number
  /** Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the video caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Pass True if the video needs to be covered with a spoiler animation */
  has_spoiler?: boolean
  /** Pass True if the uploaded video is suitable for streaming */
  supports_streaming?: boolean
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendAnimationRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  animation: string | string
  /** Duration of sent animation in seconds */
  duration?: number
  /** Animation width */
  width?: number
  /** Animation height */
  height?: number
  /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string | string
  /** Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the animation caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Pass True if the animation needs to be covered with a spoiler animation */
  has_spoiler?: boolean
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendVoiceRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  voice: string | string
  /** Voice message caption, 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the voice message caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Duration of the voice message in seconds */
  duration?: number
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendVideoNoteRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending video notes by a URL is currently unsupported. */
  video_note: string | string
  /** Duration of sent video in seconds */
  duration?: number
  /** Video width and height, i.e. diameter of the video message */
  length?: number
  /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass "attach://<file_attach_name>" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  thumbnail?: string | string
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendPaidMediaRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance. */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** The number of Telegram Stars that must be paid to buy access to the media; 1-25000 */
  star_count: number
  /** A JSON-serialized Array describing the media to be sent; up to 10 items */
  media: Array<InputPaidMedia>
  /** Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes. */
  payload?: string
  /** Media caption, 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the media caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Pass True if the caption must be shown above the message media */
  show_caption_above_media?: boolean
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendMediaGroupRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized Array describing messages to be sent, must include 2-10 items */
  media:
    | Array<InputMediaAudio>
    | Array<InputMediaDocument>
    | Array<InputMediaLivePhoto>
    | Array<InputMediaPhoto>
    | Array<InputMediaVideo>
  /** Sends messages silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent messages from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
}

export type SendMediaGroupResponse = Array<Message>

export type SendLocationRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Latitude of the location */
  latitude: number
  /** Longitude of the location */
  longitude: number
  /** The radius of uncertainty for the location, measured in meters; 0-1500 */
  horizontal_accuracy?: number
  /** Period in seconds during which the location will be updated (see Live Locations), must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. Must be 0 for ephemeral messages. */
  live_period?: number
  /** For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
  heading?: number
  /** For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
  proximity_alert_radius?: number
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendVenueRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Latitude of the venue */
  latitude: number
  /** Longitude of the venue */
  longitude: number
  /** Name of the venue */
  title: string
  /** Address of the venue */
  address: string
  /** Foursquare identifier of the venue */
  foursquare_id?: string
  /** Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".) */
  foursquare_type?: string
  /** Google Places identifier of the venue */
  google_place_id?: string
  /** Google Places type of the venue. (See supported types.) */
  google_place_type?: string
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendContactRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Contact's phone number */
  phone_number: string
  /** Contact's first name */
  first_name: string
  /** Contact's last name */
  last_name?: string
  /** Additional data about the contact in the form of a vCard, 0-2048 bytes */
  vcard?: string
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendPollRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. Polls can't be sent to channel direct messages chats. */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Poll question, 1-300 characters */
  question: string
  /** Mode for parsing entities in the question. See formatting options for more details. Currently, only custom emoji entities are allowed. */
  question_parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of question_parse_mode. */
  question_entities?: Array<MessageEntity>
  /** A JSON-serialized list of 1-12 answer options */
  options: Array<InputPollOption>
  /** True, if the poll needs to be anonymous, defaults to True */
  is_anonymous?: boolean
  /** Poll type, "quiz" or "regular", defaults to "regular" */
  type?: string
  /** Pass True if the poll allows multiple answers, defaults to False */
  allows_multiple_answers?: boolean
  /** Pass True if the poll allows to change chosen answer options, defaults to False for quizzes and to True for regular polls */
  allows_revoting?: boolean
  /** Pass True if the poll options must be shown in random order */
  shuffle_options?: boolean
  /** Pass True if answer options can be added to the poll after creation; not supported for anonymous polls and quizzes */
  allow_adding_options?: boolean
  /** Pass True if poll results must be shown only after the poll closes */
  hide_results_until_closes?: boolean
  /** Pass True if voting is limited to users who have been members of the chat where the poll is being sent for more than 24 hours; for channel chats only */
  members_only?: boolean
  /** A JSON-serialized list of 0-12 two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll; for channel chats only. Use "FT" as a country code to allow users with anonymous numbers to vote. If omitted or empty, then users from any country can participate in the poll. */
  country_codes?: Array<string>
  /** A JSON-serialized list of monotonically increasing 0-based identifiers of the correct answer options, required for polls in quiz mode */
  correct_option_ids?: Array<number>
  /** Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing */
  explanation?: string
  /** Mode for parsing entities in the explanation. See formatting options for more details. */
  explanation_parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of explanation_parse_mode. */
  explanation_entities?: Array<MessageEntity>
  /** Media added to the quiz explanation */
  explanation_media?: InputPollMedia
  /** Amount of time in seconds the poll will be active after creation, 5-2628000. Can't be used together with close_date. */
  open_period?: number
  /** Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 2628000 seconds in the future. Can't be used together with open_period. */
  close_date?: number
  /** Pass True if the poll needs to be immediately closed. This can be useful for poll preview. */
  is_closed?: boolean
  /** Description of the poll to be sent, 0-1024 characters after entities parsing */
  description?: string
  /** Mode for parsing entities in the poll description. See formatting options for more details. */
  description_parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the poll description, which can be specified instead of description_parse_mode */
  description_entities?: Array<MessageEntity>
  /** Media added to the poll description */
  media?: InputPollMedia
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendChecklistRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id: string
  /** Unique identifier for the target chat or username of the target bot in the format @username */
  chat_id: string | string
  /** A JSON-serialized object for the checklist to send */
  checklist: InputChecklist
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Unique identifier of the message effect to be added to the message */
  message_effect_id?: string
  /** A JSON-serialized object for description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** A JSON-serialized object for an inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type SendDiceRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** Emoji on which the dice throw animation is based. Currently, must be one of "🎲", "🎯", "🏀", "⚽", "🎳", or "🎰". Dice can have values 1-6 for "🎲", "🎯" and "🎳", values 1-5 for "🏀" and "⚽", and values 1-64 for "🎰". Defaults to "🎲". */
  emoji?: string
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendMessageDraftRequest = {
  /** Unique identifier for the target private chat */
  chat_id: string
  /** Unique identifier for the target message thread */
  message_thread_id?: string
  /** Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation. */
  draft_id: string
  /** Text of the message to be sent, 0-4096 characters after entities parsing. Pass an empty text to show a "Thinking..." placeholder. */
  text?: string
  /** Mode for parsing entities in the message text. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode */
  entities?: Array<MessageEntity>
  /** Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button. */
  can_stop?: boolean
  /** Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message. */
  keep_on_stop?: boolean
}

export type SendMessageDraftResponse = boolean

export type SendChatActionRequest = {
  /** Unique identifier of the business connection on behalf of which the action will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot or supergroup in the format @username. Channel chats and channel direct messages chats aren't supported. */
  chat_id: string | string
  /** Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes. */
  action: string
}

export type SendChatActionResponse = boolean

export type SetMessageReactionRequest = {
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead. */
  message_id: string
  /** A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots. */
  reaction?: Array<ReactionType>
  /** Pass True to set the reaction with a big animation */
  is_big?: boolean
}

export type SetMessageReactionResponse = boolean

export type GetUserProfilePhotosRequest = {
  /** Unique identifier of the target user */
  user_id: string
  /** Sequential number of the first photo to be returned. By default, all photos are returned. */
  offset?: number
  /** Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100. */
  limit?: number
}

export type GetUserProfileAudiosRequest = {
  /** Unique identifier of the target user */
  user_id: string
  /** Sequential number of the first audio to be returned. By default, all audios are returned. */
  offset?: number
  /** Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100. */
  limit?: number
}

export type SetUserEmojiStatusRequest = {
  /** Unique identifier of the target user */
  user_id: string
  /** Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status. */
  emoji_status_custom_emoji_id?: string
  /** Expiration date of the emoji status, if any */
  emoji_status_expiration_date?: number
}

export type SetUserEmojiStatusResponse = boolean

export type GetFileRequest = {
  /** File identifier to get information about */
  file_id: string
}

export type BanChatMemberRequest = {
  /** Unique identifier for the target group or username of the target supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
  /** Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only. */
  until_date?: number
  /** Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels. */
  revoke_messages?: boolean
}

export type BanChatMemberResponse = boolean

export type UnbanChatMemberRequest = {
  /** Unique identifier for the target group or username of the target supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
  /** Do nothing if the user is not banned */
  only_if_banned?: boolean
}

export type UnbanChatMemberResponse = boolean

export type RestrictChatMemberRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
  /** A JSON-serialized object for new user permissions */
  permissions: ChatPermissions
  /** Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission. */
  use_independent_chat_permissions?: boolean
  /** Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever. */
  until_date?: number
}

export type RestrictChatMemberResponse = boolean

export type PromoteChatMemberRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
  /** Pass True if the administrator's presence in the chat is hidden */
  is_anonymous?: boolean
  /** Pass True if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege. */
  can_manage_chat?: boolean
  /** Pass True if the administrator can delete messages of other users */
  can_delete_messages?: boolean
  /** Pass True if the administrator can manage video chats */
  can_manage_video_chats?: boolean
  /** Pass True if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to True for promotions of channel administrators. */
  can_restrict_members?: boolean
  /** Pass True if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him) */
  can_promote_members?: boolean
  /** Pass True if the administrator can change chat title, photo and other settings */
  can_change_info?: boolean
  /** Pass True if the administrator can invite new users to the chat */
  can_invite_users?: boolean
  /** Pass True if the administrator can post stories to the chat */
  can_post_stories?: boolean
  /** Pass True if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive */
  can_edit_stories?: boolean
  /** Pass True if the administrator can delete stories posted by other users */
  can_delete_stories?: boolean
  /** Pass True if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only */
  can_post_messages?: boolean
  /** Pass True if the administrator can edit messages of other users and can pin messages; for channels only */
  can_edit_messages?: boolean
  /** Pass True if the administrator can pin messages; for supergroups only */
  can_pin_messages?: boolean
  /** Pass True if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only */
  can_manage_topics?: boolean
  /** Pass True if the administrator can manage direct messages within the channel and decline suggested posts; for channels only */
  can_manage_direct_messages?: boolean
  /** Pass True if the administrator can edit the tags of regular members; for groups and supergroups only */
  can_manage_tags?: boolean
  /** Pass True if the administrator can manage chat welcome messages or directly send them in the case of bots */
  can_send_welcome_messages?: boolean
}

export type PromoteChatMemberResponse = boolean

export type SetChatAdministratorCustomTitleRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
  /** New custom title for the administrator; 0-16 characters, emoji are not allowed */
  custom_title: string
}

export type SetChatAdministratorCustomTitleResponse = boolean

export type SetChatMemberTagRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
  /** New tag for the member; 0-16 characters, emoji are not allowed */
  tag?: string
}

export type SetChatMemberTagResponse = boolean

export type BanChatSenderChatRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Unique identifier of the target sender chat */
  sender_chat_id: string
}

export type BanChatSenderChatResponse = boolean

export type UnbanChatSenderChatRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Unique identifier of the target sender chat */
  sender_chat_id: string
}

export type UnbanChatSenderChatResponse = boolean

export type SetChatPermissionsRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** A JSON-serialized object for new default chat permissions */
  permissions: ChatPermissions
  /** Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission. */
  use_independent_chat_permissions?: boolean
}

export type SetChatPermissionsResponse = boolean

export type ExportChatInviteLinkRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
}

export type ExportChatInviteLinkResponse = string

export type CreateChatInviteLinkRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Invite link name; 0-32 characters */
  name?: string
  /** Point in time (Unix timestamp) when the link will expire */
  expire_date?: number
  /** The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 */
  member_limit?: number
  /** True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified. */
  creates_join_request?: boolean
}

export type EditChatInviteLinkRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** The invite link to edit */
  invite_link: string
  /** Invite link name; 0-32 characters */
  name?: string
  /** Point in time (Unix timestamp) when the link will expire */
  expire_date?: number
  /** The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 */
  member_limit?: number
  /** True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified. */
  creates_join_request?: boolean
}

export type CreateChatSubscriptionInviteLinkRequest = {
  /** Unique identifier for the target channel chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Invite link name; 0-32 characters */
  name?: string
  /** The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days). */
  subscription_period: number
  /** The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000 */
  subscription_price: number
}

export type EditChatSubscriptionInviteLinkRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** The invite link to edit */
  invite_link: string
  /** Invite link name; 0-32 characters */
  name?: string
}

export type RevokeChatInviteLinkRequest = {
  /** Unique identifier of the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** The invite link to revoke */
  invite_link: string
}

export type ApproveChatJoinRequestRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
}

export type ApproveChatJoinRequestResponse = boolean

export type DeclineChatJoinRequestRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
}

export type DeclineChatJoinRequestResponse = boolean

export type AnswerChatJoinRequestQueryRequest = {
  /** Unique identifier of the join request query */
  chat_join_request_query_id: string
  /** Result of the query. Must be either "approve" to allow the user to join the chat, "decline" to disallow the user to join the chat, or "queue" to leave the decision to other administrators. */
  result: string
}

export type AnswerChatJoinRequestQueryResponse = boolean

export type SendChatJoinRequestWebAppRequest = {
  /** Unique identifier of the join request query */
  chat_join_request_query_id: string
  /** An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps */
  web_app_url: string
}

export type SendChatJoinRequestWebAppResponse = boolean

export type SetChatPhotoRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** New chat photo, uploaded using multipart/form-data */
  photo: string
}

export type SetChatPhotoResponse = boolean

export type DeleteChatPhotoRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
}

export type DeleteChatPhotoResponse = boolean

export type SetChatTitleRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** New chat title, 1-128 characters */
  title: string
}

export type SetChatTitleResponse = boolean

export type SetChatDescriptionRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** New chat description, 0-255 characters */
  description?: string
}

export type SetChatDescriptionResponse = boolean

export type PinChatMessageRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be pinned */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Identifier of a message to pin */
  message_id: string
  /** Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats. */
  disable_notification?: boolean
}

export type PinChatMessageResponse = boolean

export type UnpinChatMessageRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be unpinned */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Identifier of the message to unpin. Required if business_connection_id is specified. If not specified, the most recent pinned message (by sending date) will be unpinned. */
  message_id?: string
}

export type UnpinChatMessageResponse = boolean

export type UnpinAllChatMessagesRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
}

export type UnpinAllChatMessagesResponse = boolean

export type LeaveChatRequest = {
  /** Unique identifier for the target chat or username of the target supergroup or channel in the format @username. Channel direct messages chats aren't supported; leave the corresponding channel instead. */
  chat_id: string | string
}

export type LeaveChatResponse = boolean

export type GetChatRequest = {
  /** Unique identifier for the target chat or username of the target supergroup or channel in the format @username */
  chat_id: string | string
}

export type GetChatAdministratorsRequest = {
  /** Unique identifier for the target chat or username of the target supergroup or channel in the format @username */
  chat_id: string | string
  /** Pass True to additionally receive all bots that are administrators of the chat. By default, bots other than the current bot are omitted. */
  return_bots?: boolean
}

export type GetChatAdministratorsResponse = Array<ChatMember>

export type GetChatMemberCountRequest = {
  /** Unique identifier for the target chat or username of the target supergroup or channel in the format @username */
  chat_id: string | string
}

export type GetChatMemberCountResponse = number

export type GetChatMemberRequest = {
  /** Unique identifier for the target chat or username of the target supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
}

export type GetUserPersonalChatMessagesRequest = {
  /** Unique identifier for the target user */
  user_id: string
  /** The maximum number of messages to return; 1-20 */
  limit: number
}

export type GetUserPersonalChatMessagesResponse = Array<Message>

export type SetChatStickerSetRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Name of the sticker set to be set as the group sticker set */
  sticker_set_name: string
}

export type SetChatStickerSetResponse = boolean

export type DeleteChatStickerSetRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
}

export type DeleteChatStickerSetResponse = boolean

export type GetForumTopicIconStickersResponse = Array<Sticker>

export type CreateForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Topic name, 1-128 characters */
  name: string
  /** Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F). */
  icon_color?: number
  /** Unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. */
  icon_custom_emoji_id?: string
}

export type EditForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread of the forum topic */
  message_thread_id: string
  /** New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept. */
  name?: string
  /** New unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept. */
  icon_custom_emoji_id?: string
}

export type EditForumTopicResponse = boolean

export type CloseForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread of the forum topic */
  message_thread_id: string
}

export type CloseForumTopicResponse = boolean

export type ReopenForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread of the forum topic */
  message_thread_id: string
}

export type ReopenForumTopicResponse = boolean

export type DeleteForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread of the forum topic */
  message_thread_id: string
}

export type DeleteForumTopicResponse = boolean

export type UnpinAllForumTopicMessagesRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread of the forum topic */
  message_thread_id: string
}

export type UnpinAllForumTopicMessagesResponse = boolean

export type EditGeneralForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** New topic name, 1-128 characters */
  name: string
}

export type EditGeneralForumTopicResponse = boolean

export type CloseGeneralForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
}

export type CloseGeneralForumTopicResponse = boolean

export type ReopenGeneralForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
}

export type ReopenGeneralForumTopicResponse = boolean

export type HideGeneralForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
}

export type HideGeneralForumTopicResponse = boolean

export type UnhideGeneralForumTopicRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
}

export type UnhideGeneralForumTopicResponse = boolean

export type UnpinAllGeneralForumTopicMessagesRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
}

export type UnpinAllGeneralForumTopicMessagesResponse = boolean

export type AnswerCallbackQueryRequest = {
  /** Unique identifier for the query to be answered */
  callback_query_id: string
  /** Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters. */
  text?: string
  /** If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to False. */
  show_alert?: boolean
  /** URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @BotFather, specify the URL that opens your game - note that this will only work if the query comes from a callback_game button. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter. */
  url?: string
  /** The maximum amount of time in seconds that the result of the callback query may be cached client-side. Defaults to 0. */
  cache_time?: number
}

export type AnswerCallbackQueryResponse = boolean

export type AnswerGuestQueryRequest = {
  /** Unique identifier for the query to be answered */
  guest_query_id: string
  /** A JSON-serialized object describing the message to be sent */
  result: InlineQueryResult
}

export type GetUserChatBoostsRequest = {
  /** Unique identifier for the chat or username of the channel in the format @username */
  chat_id: string | string
  /** Unique identifier of the target user */
  user_id: string
}

export type GetBusinessConnectionRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
}

export type GetManagedBotTokenRequest = {
  /** User identifier of the managed bot whose token will be returned */
  user_id: string
}

export type GetManagedBotTokenResponse = string

export type ReplaceManagedBotTokenRequest = {
  /** User identifier of the managed bot whose token will be replaced */
  user_id: string
}

export type ReplaceManagedBotTokenResponse = string

export type GetManagedBotAccessSettingsRequest = {
  /** User identifier of the managed bot whose access settings will be returned */
  user_id: string
}

export type SetManagedBotAccessSettingsRequest = {
  /** User identifier of the managed bot whose access settings will be changed */
  user_id: string
  /** Pass True if only selected users can access the bot. The bot's owner can always access it. */
  is_access_restricted: boolean
  /** A JSON-serialized list of up to 10 identifiers of users who will have access to the bot in addition to its owner. Ignored if is_access_restricted is False. */
  added_user_ids?: Array<number>
}

export type SetManagedBotAccessSettingsResponse = boolean

export type SetMyCommandsRequest = {
  /** A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified. */
  commands: Array<BotCommand>
  /** A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault. */
  scope?: BotCommandScope
  /** A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands. */
  language_code?: string
}

export type SetMyCommandsResponse = boolean

export type DeleteMyCommandsRequest = {
  /** A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault. */
  scope?: BotCommandScope
  /** A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands. */
  language_code?: string
}

export type DeleteMyCommandsResponse = boolean

export type GetMyCommandsRequest = {
  /** A JSON-serialized object, describing scope of users. Defaults to BotCommandScopeDefault. */
  scope?: BotCommandScope
  /** A two-letter ISO 639-1 language code or an empty string */
  language_code?: string
}

export type GetMyCommandsResponse = Array<BotCommand>

export type SetMyNameRequest = {
  /** New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language. */
  name?: string
  /** A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name. */
  language_code?: string
}

export type SetMyNameResponse = boolean

export type GetMyNameRequest = {
  /** A two-letter ISO 639-1 language code or an empty string */
  language_code?: string
}

export type SetMyDescriptionRequest = {
  /** New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language. */
  description?: string
  /** A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description. */
  language_code?: string
}

export type SetMyDescriptionResponse = boolean

export type GetMyDescriptionRequest = {
  /** A two-letter ISO 639-1 language code or an empty string */
  language_code?: string
}

export type SetMyShortDescriptionRequest = {
  /** New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language. */
  short_description?: string
  /** A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description. */
  language_code?: string
}

export type SetMyShortDescriptionResponse = boolean

export type GetMyShortDescriptionRequest = {
  /** A two-letter ISO 639-1 language code or an empty string */
  language_code?: string
}

export type SetMyProfilePhotoRequest = {
  /** The new profile photo to set */
  photo: InputProfilePhoto
}

export type SetMyProfilePhotoResponse = boolean

export type RemoveMyProfilePhotoResponse = boolean

export type SetChatMenuButtonRequest = {
  /** Unique identifier for the target private chat. If not specified, the bot's default menu button will be changed. */
  chat_id?: string
  /** A JSON-serialized object for the bot's new menu button. Defaults to MenuButtonDefault. */
  menu_button?: MenuButton
}

export type SetChatMenuButtonResponse = boolean

export type GetChatMenuButtonRequest = {
  /** Unique identifier for the target private chat. If not specified, the bot's default menu button will be returned. */
  chat_id?: string
}

export type SetMyDefaultAdministratorRightsRequest = {
  /** A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared. */
  rights?: ChatAdministratorRights
  /** Pass True to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed. */
  for_channels?: boolean
}

export type SetMyDefaultAdministratorRightsResponse = boolean

export type GetMyDefaultAdministratorRightsRequest = {
  /** Pass True to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned. */
  for_channels?: boolean
}

export type SendGiftRequest = {
  /** Required if chat_id is not specified. Unique identifier of the target user who will receive the gift. */
  user_id?: string
  /** Required if user_id is not specified. Unique identifier for the chat or username of the channel (in the format @username) that will receive the gift. */
  chat_id?: string | string
  /** Identifier of the gift; limited gifts can't be sent to channel chats */
  gift_id: string
  /** Pass True to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver */
  pay_for_upgrade?: boolean
  /** Text that will be shown along with the gift; 0-128 characters */
  text?: string
  /** Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored. */
  text_parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored. */
  text_entities?: Array<MessageEntity>
}

export type SendGiftResponse = boolean

export type GiftPremiumSubscriptionRequest = {
  /** Unique identifier of the target user who will receive a Telegram Premium subscription */
  user_id: string
  /** Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12 */
  month_count: number
  /** Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months */
  star_count: number
  /** Text that will be shown along with the service message about the subscription; 0-128 characters */
  text?: string
  /** Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored. */
  text_parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored. */
  text_entities?: Array<MessageEntity>
}

export type GiftPremiumSubscriptionResponse = boolean

export type VerifyUserRequest = {
  /** Unique identifier of the target user */
  user_id: string
  /** Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. */
  custom_description?: string
}

export type VerifyUserResponse = boolean

export type VerifyChatRequest = {
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. Channel direct messages chats can't be verified. */
  chat_id: string | string
  /** Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. */
  custom_description?: string
}

export type VerifyChatResponse = boolean

export type RemoveUserVerificationRequest = {
  /** Unique identifier of the target user */
  user_id: string
}

export type RemoveUserVerificationResponse = boolean

export type RemoveChatVerificationRequest = {
  /** Unique identifier for the target chat or username of the target bot or channel in the format @username */
  chat_id: string | string
}

export type RemoveChatVerificationResponse = boolean

export type ReadBusinessMessageRequest = {
  /** Unique identifier of the business connection on behalf of which to read the message */
  business_connection_id: string
  /** Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours. */
  chat_id: string
  /** Unique identifier of the message to mark as read */
  message_id: string
}

export type ReadBusinessMessageResponse = boolean

export type DeleteBusinessMessagesRequest = {
  /** Unique identifier of the business connection on behalf of which to delete the messages */
  business_connection_id: string
  /** A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See deleteMessage for limitations on which messages can be deleted. */
  message_ids: Array<number>
}

export type DeleteBusinessMessagesResponse = boolean

export type SetBusinessAccountNameRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** The new value of the first name for the business account; 1-64 characters */
  first_name: string
  /** The new value of the last name for the business account; 0-64 characters */
  last_name?: string
}

export type SetBusinessAccountNameResponse = boolean

export type SetBusinessAccountUsernameRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** The new value of the username for the business account; 0-32 characters */
  username?: string
}

export type SetBusinessAccountUsernameResponse = boolean

export type SetBusinessAccountBioRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** The new value of the bio for the business account; 0-140 characters */
  bio?: string
}

export type SetBusinessAccountBioResponse = boolean

export type SetBusinessAccountProfilePhotoRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** The new profile photo to set */
  photo: InputProfilePhoto
  /** Pass True to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo. */
  is_public?: boolean
}

export type SetBusinessAccountProfilePhotoResponse = boolean

export type RemoveBusinessAccountProfilePhotoRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Pass True to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo. */
  is_public?: boolean
}

export type RemoveBusinessAccountProfilePhotoResponse = boolean

export type SetBusinessAccountGiftSettingsRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Pass True if a button for sending a gift to the user or by the business account must always be shown in the input field */
  show_gift_button: boolean
  /** Types of gifts accepted by the business account */
  accepted_gift_types: AcceptedGiftTypes
}

export type SetBusinessAccountGiftSettingsResponse = boolean

export type GetBusinessAccountStarBalanceRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
}

export type TransferBusinessAccountStarsRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Number of Telegram Stars to transfer; 1-10000 */
  star_count: number
}

export type TransferBusinessAccountStarsResponse = boolean

export type GetBusinessAccountGiftsRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Pass True to exclude gifts that aren't saved to the account's profile page */
  exclude_unsaved?: boolean
  /** Pass True to exclude gifts that are saved to the account's profile page */
  exclude_saved?: boolean
  /** Pass True to exclude gifts that can be purchased an unlimited number of times */
  exclude_unlimited?: boolean
  /** Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique */
  exclude_limited_upgradable?: boolean
  /** Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique */
  exclude_limited_non_upgradable?: boolean
  /** Pass True to exclude unique gifts */
  exclude_unique?: boolean
  /** Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram */
  exclude_from_blockchain?: boolean
  /** Pass True to sort results by gift price instead of send date. Sorting is applied before pagination. */
  sort_by_price?: boolean
  /** Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results */
  offset?: string
  /** The maximum number of gifts to be returned; 1-100. Defaults to 100. */
  limit?: number
}

export type GetUserGiftsRequest = {
  /** Unique identifier of the user */
  user_id: string
  /** Pass True to exclude gifts that can be purchased an unlimited number of times */
  exclude_unlimited?: boolean
  /** Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique */
  exclude_limited_upgradable?: boolean
  /** Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique */
  exclude_limited_non_upgradable?: boolean
  /** Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram */
  exclude_from_blockchain?: boolean
  /** Pass True to exclude unique gifts */
  exclude_unique?: boolean
  /** Pass True to sort results by gift price instead of send date. Sorting is applied before pagination. */
  sort_by_price?: boolean
  /** Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results */
  offset?: string
  /** The maximum number of gifts to be returned; 1-100. Defaults to 100. */
  limit?: number
}

export type GetChatGiftsRequest = {
  /** Unique identifier for the target chat or username of the target channel in the format @username */
  chat_id: string | string
  /** Pass True to exclude gifts that aren't saved to the chat's profile page. Always True, unless the bot has the can_post_messages administrator right in the channel. */
  exclude_unsaved?: boolean
  /** Pass True to exclude gifts that are saved to the chat's profile page. Always False, unless the bot has the can_post_messages administrator right in the channel. */
  exclude_saved?: boolean
  /** Pass True to exclude gifts that can be purchased an unlimited number of times */
  exclude_unlimited?: boolean
  /** Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique */
  exclude_limited_upgradable?: boolean
  /** Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique */
  exclude_limited_non_upgradable?: boolean
  /** Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram */
  exclude_from_blockchain?: boolean
  /** Pass True to exclude unique gifts */
  exclude_unique?: boolean
  /** Pass True to sort results by gift price instead of send date. Sorting is applied before pagination. */
  sort_by_price?: boolean
  /** Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results */
  offset?: string
  /** The maximum number of gifts to be returned; 1-100. Defaults to 100. */
  limit?: number
}

export type ConvertGiftToStarsRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Unique identifier of the regular gift that should be converted to Telegram Stars */
  owned_gift_id: string
}

export type ConvertGiftToStarsResponse = boolean

export type UpgradeGiftRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Unique identifier of the regular gift that should be upgraded to a unique one */
  owned_gift_id: string
  /** Pass True to keep the original gift text, sender and receiver in the upgraded gift */
  keep_original_details?: boolean
  /** The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If gift.prepaid_upgrade_star_count > 0, then pass 0, otherwise, the can_transfer_stars business bot right is required and gift.upgrade_star_count must be passed. */
  star_count?: number
}

export type UpgradeGiftResponse = boolean

export type TransferGiftRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Unique identifier of the regular gift that should be transferred */
  owned_gift_id: string
  /** Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours. */
  new_owner_chat_id: string
  /** The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the can_transfer_stars business bot right is required. */
  star_count?: number
}

export type TransferGiftResponse = boolean

export type PostStoryRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Content of the story */
  content: InputStoryContent
  /** Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400 */
  active_period: number
  /** Caption of the story, 0-2048 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the story caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** A JSON-serialized list of clickable areas to be shown on the story */
  areas?: Array<StoryArea>
  /** Pass True to keep the story accessible after it expires */
  post_to_chat_page?: boolean
  /** Pass True if the content of the story must be protected from forwarding and screenshotting */
  protect_content?: boolean
}

export type RepostStoryRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Unique identifier of the chat which posted the story that should be reposted */
  from_chat_id: string
  /** Unique identifier of the story that should be reposted */
  from_story_id: string
  /** Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400 */
  active_period: number
  /** Pass True to keep the story accessible after it expires */
  post_to_chat_page?: boolean
  /** Pass True if the content of the story must be protected from forwarding and screenshotting */
  protect_content?: boolean
}

export type EditStoryRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Unique identifier of the story to edit */
  story_id: string
  /** Content of the story */
  content: InputStoryContent
  /** Caption of the story, 0-2048 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the story caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** A JSON-serialized list of clickable areas to be shown on the story */
  areas?: Array<StoryArea>
}

export type DeleteStoryRequest = {
  /** Unique identifier of the business connection */
  business_connection_id: string
  /** Unique identifier of the story to delete */
  story_id: string
}

export type DeleteStoryResponse = boolean

export type AnswerWebAppQueryRequest = {
  /** Unique identifier for the query to be answered */
  web_app_query_id: string
  /** A JSON-serialized object describing the message to be sent */
  result: InlineQueryResult
}

export type SavePreparedInlineMessageRequest = {
  /** Unique identifier of the target user that can use the prepared message */
  user_id: string
  /** A JSON-serialized object describing the message to be sent */
  result: InlineQueryResult
  /** Pass True if the message can be sent to private chats with users */
  allow_user_chats?: boolean
  /** Pass True if the message can be sent to private chats with bots */
  allow_bot_chats?: boolean
  /** Pass True if the message can be sent to group and supergroup chats */
  allow_group_chats?: boolean
  /** Pass True if the message can be sent to channel chats */
  allow_channel_chats?: boolean
}

export type SavePreparedKeyboardButtonRequest = {
  /** Unique identifier of the target user that can use the button */
  user_id: string
  /** A JSON-serialized object describing the button to be saved. The button must be of the type request_users, request_chat, or request_managed_bot. */
  button: KeyboardButton
}

export type EditMessageTextRequest = {
  /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
  business_connection_id?: string
  /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. */
  chat_id?: string | string
  /** Required if inline_message_id is not specified. Identifier of the message to edit. */
  message_id?: string
  /** Required if chat_id and message_id are not specified. Identifier of the inline message. */
  inline_message_id?: string
  /** New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified */
  text?: string
  /** Mode for parsing entities in the message text. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode */
  entities?: Array<MessageEntity>
  /** Link preview generation options for the message */
  link_preview_options?: LinkPreviewOptions
  /** New rich content of the message; required if text isn't specified. Direct upload of new files and explicit upload of files by a URL isn't supported when an inline message is edited. */
  rich_message?: InputRichMessage
  /** A JSON-serialized object for an inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditMessageTextResponse = Message | boolean

export type EditMessageCaptionRequest = {
  /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
  business_connection_id?: string
  /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. */
  chat_id?: string | string
  /** Required if inline_message_id is not specified. Identifier of the message to edit. */
  message_id?: string
  /** Required if chat_id and message_id are not specified. Identifier of the inline message. */
  inline_message_id?: string
  /** New caption of the message, 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the message caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages. */
  show_caption_above_media?: boolean
  /** A JSON-serialized object for an inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditMessageCaptionResponse = Message | boolean

export type EditMessageMediaRequest = {
  /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
  business_connection_id?: string
  /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. */
  chat_id?: string | string
  /** Required if inline_message_id is not specified. Identifier of the message to edit. */
  message_id?: string
  /** Required if chat_id and message_id are not specified. Identifier of the inline message. */
  inline_message_id?: string
  /** A JSON-serialized object for the new media content of the message */
  media: InputMedia
  /** A JSON-serialized object for a new inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditMessageMediaResponse = Message | boolean

export type EditMessageLiveLocationRequest = {
  /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
  business_connection_id?: string
  /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. */
  chat_id?: string | string
  /** Required if inline_message_id is not specified. Identifier of the message to edit. */
  message_id?: string
  /** Required if chat_id and message_id are not specified. Identifier of the inline message. */
  inline_message_id?: string
  /** Latitude of new location */
  latitude: number
  /** Longitude of new location */
  longitude: number
  /** New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current live_period by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then live_period remains unchanged. */
  live_period?: number
  /** The radius of uncertainty for the location, measured in meters; 0-1500 */
  horizontal_accuracy?: number
  /** Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
  heading?: number
  /** The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
  proximity_alert_radius?: number
  /** A JSON-serialized object for a new inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditMessageLiveLocationResponse = Message | boolean

export type StopMessageLiveLocationRequest = {
  /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
  business_connection_id?: string
  /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. */
  chat_id?: string | string
  /** Required if inline_message_id is not specified. Identifier of the message with live location to stop. */
  message_id?: string
  /** Required if chat_id and message_id are not specified. Identifier of the inline message. */
  inline_message_id?: string
  /** A JSON-serialized object for a new inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type StopMessageLiveLocationResponse = Message | boolean

export type EditMessageChecklistRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id: string
  /** Unique identifier for the target chat or username of the target bot in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message */
  message_id: string
  /** A JSON-serialized object for the new checklist */
  checklist: InputChecklist
  /** A JSON-serialized object for the new inline keyboard for the message */
  reply_markup?: InlineKeyboardMarkup
}

export type EditMessageReplyMarkupRequest = {
  /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
  business_connection_id?: string
  /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. */
  chat_id?: string | string
  /** Required if inline_message_id is not specified. Identifier of the message to edit. */
  message_id?: string
  /** Required if chat_id and message_id are not specified. Identifier of the inline message. */
  inline_message_id?: string
  /** A JSON-serialized object for an inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditMessageReplyMarkupResponse = Message | boolean

export type StopPollRequest = {
  /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Identifier of the original message with the poll */
  message_id: string
  /** A JSON-serialized object for a new message inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditEphemeralMessageTextRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Identifier of the user who received the message */
  receiver_user_id: string
  /** Identifier of the ephemeral message to edit */
  ephemeral_message_id: string
  /** New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified */
  text?: string
  /** Mode for parsing entities in the message text. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode */
  entities?: Array<MessageEntity>
  /** New rich content of the message; required if text isn't specified */
  rich_message?: InputRichMessage
  /** Link preview generation options for the message */
  link_preview_options?: LinkPreviewOptions
  /** A JSON-serialized object for an inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditEphemeralMessageTextResponse = boolean

export type EditEphemeralMessageMediaRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Identifier of the user who received the message */
  receiver_user_id: string
  /** Identifier of the ephemeral message to edit */
  ephemeral_message_id: string
  /** A JSON-serialized object for the new media content of the message */
  media: InputMedia
  /** A JSON-serialized object for an inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditEphemeralMessageMediaResponse = boolean

export type EditEphemeralMessageCaptionRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Identifier of the user who received the message */
  receiver_user_id: string
  /** Identifier of the ephemeral message to edit */
  ephemeral_message_id: string
  /** New caption of the message, 0-1024 characters after entities parsing */
  caption?: string
  /** Mode for parsing entities in the message caption. See formatting options for more details. */
  parse_mode?: string
  /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
  caption_entities?: Array<MessageEntity>
  /** Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages. */
  show_caption_above_media?: boolean
  /** A JSON-serialized object for an inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditEphemeralMessageCaptionResponse = boolean

export type EditEphemeralMessageReplyMarkupRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Identifier of the user who received the message */
  receiver_user_id: string
  /** Identifier of the ephemeral message to edit */
  ephemeral_message_id: string
  /** A JSON-serialized object for an inline keyboard */
  reply_markup?: InlineKeyboardMarkup
}

export type EditEphemeralMessageReplyMarkupResponse = boolean

export type ApproveSuggestedPostRequest = {
  /** Unique identifier for the target direct messages chat */
  chat_id: string
  /** Identifier of a suggested post message to approve */
  message_id: string
  /** Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future. */
  send_date?: number
}

export type ApproveSuggestedPostResponse = boolean

export type DeclineSuggestedPostRequest = {
  /** Unique identifier for the target direct messages chat */
  chat_id: string
  /** Identifier of a suggested post message to decline */
  message_id: string
  /** Comment for the creator of the suggested post; 0-128 characters */
  comment?: string
}

export type DeclineSuggestedPostResponse = boolean

export type DeleteMessageRequest = {
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Identifier of the message to delete */
  message_id: string
}

export type DeleteMessageResponse = boolean

export type DeleteMessagesRequest = {
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** A JSON-serialized list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted. */
  message_ids: Array<number>
}

export type DeleteMessagesResponse = boolean

export type DeleteEphemeralMessageRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Identifier of the user who received the message */
  receiver_user_id: string
  /** Identifier of the ephemeral message to delete */
  ephemeral_message_id: string
}

export type DeleteEphemeralMessageResponse = boolean

export type DeleteMessageReactionRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Identifier of the target message */
  message_id: string
  /** Identifier of the user whose reaction will be removed, if the reaction was added by a user */
  user_id?: string
  /** Identifier of the chat whose reaction will be removed, if the reaction was added by a chat */
  actor_chat_id?: string
}

export type DeleteMessageReactionResponse = boolean

export type DeleteAllMessageReactionsRequest = {
  /** Unique identifier for the target chat or username of the target supergroup in the format @username */
  chat_id: string | string
  /** Identifier of the user whose reactions will be removed, if the reactions were added by a user */
  user_id?: string
  /** Identifier of the chat whose reactions will be removed, if the reactions were added by a chat */
  actor_chat_id?: string
}

export type DeleteAllMessageReactionsResponse = boolean

export type SendStickerRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Video and animated stickers can't be sent via an HTTP URL. */
  sticker: string | string
  /** Emoji associated with the sticker; only for just uploaded stickers */
  emoji?: string
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type GetStickerSetRequest = {
  /** Name of the sticker set */
  name: string
}

export type GetCustomEmojiStickersRequest = {
  /** A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified. */
  custom_emoji_ids: Array<string>
}

export type GetCustomEmojiStickersResponse = Array<Sticker>

export type UploadStickerFileRequest = {
  /** User identifier of sticker file owner */
  user_id: string
  /** A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See https://core.telegram.org/stickers for technical requirements. More information on Sending Files: https://core.telegram.org/bots/api#sending-files */
  sticker: string
  /** Format of the sticker, must be one of "static", "animated", "video" */
  sticker_format: string
}

export type CreateNewStickerSetRequest = {
  /** User identifier of created sticker set owner */
  user_id: string
  /** Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in "_by_<bot_username>". <bot_username> is case insensitive. 1-64 characters. */
  name: string
  /** Sticker set title, 1-64 characters */
  title: string
  /** A JSON-serialized list of 1-50 initial stickers to be added to the sticker set */
  stickers: Array<InputSticker>
  /** Type of stickers in the set, pass "regular", "mask", or "custom_emoji". By default, a regular sticker set is created. */
  sticker_type?: string
  /** Pass True if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only */
  needs_repainting?: boolean
}

export type CreateNewStickerSetResponse = boolean

export type AddStickerToSetRequest = {
  /** User identifier of sticker set owner */
  user_id: string
  /** Sticker set name */
  name: string
  /** A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed. */
  sticker: InputSticker
}

export type AddStickerToSetResponse = boolean

export type SetStickerPositionInSetRequest = {
  /** File identifier of the sticker */
  sticker: string
  /** New sticker position in the set, zero-based */
  position: number
}

export type SetStickerPositionInSetResponse = boolean

export type DeleteStickerFromSetRequest = {
  /** File identifier of the sticker */
  sticker: string
}

export type DeleteStickerFromSetResponse = boolean

export type ReplaceStickerInSetRequest = {
  /** User identifier of the sticker set owner */
  user_id: string
  /** Sticker set name */
  name: string
  /** File identifier of the replaced sticker */
  old_sticker: string
  /** A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged. */
  sticker: InputSticker
}

export type ReplaceStickerInSetResponse = boolean

export type SetStickerEmojiListRequest = {
  /** File identifier of the sticker */
  sticker: string
  /** A JSON-serialized list of 1-20 emoji associated with the sticker */
  emoji_list: Array<string>
}

export type SetStickerEmojiListResponse = boolean

export type SetStickerKeywordsRequest = {
  /** File identifier of the sticker */
  sticker: string
  /** A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters */
  keywords?: Array<string>
}

export type SetStickerKeywordsResponse = boolean

export type SetStickerMaskPositionRequest = {
  /** File identifier of the sticker */
  sticker: string
  /** A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position. */
  mask_position?: MaskPosition
}

export type SetStickerMaskPositionResponse = boolean

export type SetStickerSetTitleRequest = {
  /** Sticker set name */
  name: string
  /** Sticker set title, 1-64 characters */
  title: string
}

export type SetStickerSetTitleResponse = boolean

export type SetStickerSetThumbnailRequest = {
  /** Sticker set name */
  name: string
  /** User identifier of the sticker set owner */
  user_id: string
  /** A .WEBP or .PNG image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a .TGS animation with a thumbnail up to 32 kilobytes in size (see https://core.telegram.org/stickers#animation-requirements for animated sticker technical requirements), or a .WEBM video with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/stickers#video-requirements for video sticker technical requirements. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail. */
  thumbnail?: string | string
  /** Format of the thumbnail, must be one of "static" for a .WEBP or .PNG image, "animated" for a .TGS animation, or "video" for a .WEBM video */
  format: string
}

export type SetStickerSetThumbnailResponse = boolean

export type SetCustomEmojiStickerSetThumbnailRequest = {
  /** Sticker set name */
  name: string
  /** Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail */
  custom_emoji_id?: string
}

export type SetCustomEmojiStickerSetThumbnailResponse = boolean

export type DeleteStickerSetRequest = {
  /** Sticker set name */
  name: string
}

export type DeleteStickerSetResponse = boolean

export type SendRichMessageRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent. Bot can send rich messages on behalf of a business account only if the corresponding user can send rich messages. */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** A JSON-serialized object containing the parameters of the ephemeral message to send */
  ephemeral_message_parameters?: EphemeralMessageParameters
  /** The message to be sent */
  rich_message: InputRichMessage
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user. */
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}

export type SendRichMessageDraftRequest = {
  /** Unique identifier for the target private chat */
  chat_id: string
  /** Unique identifier for the target message thread */
  message_thread_id?: string
  /** Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation. */
  draft_id: string
  /** The partial message to be streamed. Direct upload of new files and explicit upload of files by a URL isn't supported. */
  rich_message: InputRichMessage
  /** Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button. */
  can_stop?: boolean
  /** Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message. */
  keep_on_stop?: boolean
}

export type SendRichMessageDraftResponse = boolean

export type AnswerInlineQueryRequest = {
  /** Unique identifier for the answered query */
  inline_query_id: string
  /** A JSON-serialized Array of results for the inline query */
  results: Array<InlineQueryResult>
  /** The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300. */
  cache_time?: number
  /** Pass True if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query. */
  is_personal?: boolean
  /** Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes. */
  next_offset?: string
  /** A JSON-serialized object describing a button to be shown above inline query results */
  button?: InlineQueryResultsButton
}

export type AnswerInlineQueryResponse = boolean

export type SendInvoiceRequest = {
  /** Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
  direct_messages_topic_id?: string
  /** Product name, 1-32 characters */
  title: string
  /** Product description, 1-255 characters */
  description: string
  /** Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. */
  payload: string
  /** Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars. */
  provider_token?: string
  /** Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars. */
  currency: string
  /** Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars. */
  prices: Array<LabeledPrice>
  /** The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars. */
  max_tip_amount?: number
  /** A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. */
  suggested_tip_amounts?: Array<number>
  /** Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter. */
  start_parameter?: string
  /** JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. */
  provider_data?: string
  /** URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for. */
  photo_url?: string
  /** Photo size in bytes */
  photo_size?: number
  /** Photo width */
  photo_width?: number
  /** Photo height */
  photo_height?: number
  /** Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars. */
  need_name?: boolean
  /** Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars. */
  need_phone_number?: boolean
  /** Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars. */
  need_email?: boolean
  /** Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars. */
  need_shipping_address?: boolean
  /** Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars. */
  send_phone_number_to_provider?: boolean
  /** Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars. */
  send_email_to_provider?: boolean
  /** Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars. */
  is_flexible?: boolean
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
  suggested_post_parameters?: SuggestedPostParameters
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** A JSON-serialized object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button. */
  reply_markup?: InlineKeyboardMarkup
}

export type CreateInvoiceLinkRequest = {
  /** Unique identifier of the business connection on behalf of which the link will be created. For payments in Telegram Stars only. */
  business_connection_id?: string
  /** Product name, 1-32 characters */
  title: string
  /** Product description, 1-255 characters */
  description: string
  /** Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. */
  payload: string
  /** Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars. */
  provider_token?: string
  /** Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars. */
  currency: string
  /** Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars. */
  prices: Array<LabeledPrice>
  /** The number of seconds the subscription will be active for before the next payment. The currency must be set to "XTR" (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars. */
  subscription_period?: number
  /** The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars. */
  max_tip_amount?: number
  /** A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. */
  suggested_tip_amounts?: Array<number>
  /** JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. */
  provider_data?: string
  /** URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. */
  photo_url?: string
  /** Photo size in bytes */
  photo_size?: number
  /** Photo width */
  photo_width?: number
  /** Photo height */
  photo_height?: number
  /** Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars. */
  need_name?: boolean
  /** Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars. */
  need_phone_number?: boolean
  /** Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars. */
  need_email?: boolean
  /** Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars. */
  need_shipping_address?: boolean
  /** Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars. */
  send_phone_number_to_provider?: boolean
  /** Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars. */
  send_email_to_provider?: boolean
  /** Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars. */
  is_flexible?: boolean
}

export type CreateInvoiceLinkResponse = string

export type AnswerShippingQueryRequest = {
  /** Unique identifier for the query to be answered */
  shipping_query_id: string
  /** Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible) */
  ok: boolean
  /** Required if ok is True. A JSON-serialized Array of available shipping options. */
  shipping_options?: Array<ShippingOption>
  /** Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable"). Telegram will display this message to the user. */
  error_message?: string
}

export type AnswerShippingQueryResponse = boolean

export type AnswerPreCheckoutQueryRequest = {
  /** Unique identifier for the query to be answered */
  pre_checkout_query_id: string
  /** Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems. */
  ok: boolean
  /** Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user. */
  error_message?: string
}

export type AnswerPreCheckoutQueryResponse = boolean

export type GetStarTransactionsRequest = {
  /** Number of transactions to skip in the response */
  offset?: number
  /** The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100. */
  limit?: number
}

export type RefundStarPaymentRequest = {
  /** Identifier of the user whose payment will be refunded */
  user_id: string
  /** Telegram payment identifier */
  telegram_payment_charge_id: string
}

export type RefundStarPaymentResponse = boolean

export type EditUserStarSubscriptionRequest = {
  /** Identifier of the user whose subscription will be edited */
  user_id: string
  /** Telegram payment identifier for the subscription */
  telegram_payment_charge_id: string
  /** Pass True to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass False to allow the user to re-enable a subscription that was previously canceled by the bot. */
  is_canceled: boolean
}

export type EditUserStarSubscriptionResponse = boolean

export type SetPassportDataErrorsRequest = {
  /** User identifier */
  user_id: string
  /** A JSON-serialized Array describing the errors */
  errors: Array<PassportElementError>
}

export type SetPassportDataErrorsResponse = boolean

export type SendGameRequest = {
  /** Unique identifier of the business connection on behalf of which the message will be sent */
  business_connection_id?: string
  /** Unique identifier for the target chat or username of the target bot in the format @username. Games can't be sent to channel direct messages chats and channel chats. */
  chat_id: string | string
  /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
  message_thread_id?: string
  /** Short name of the game, serves as the unique identifier for the game. Set up your games via @BotFather. */
  game_short_name: string
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification?: boolean
  /** Protects the contents of the sent message from forwarding and saving */
  protect_content?: boolean
  /** Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance. */
  allow_paid_broadcast?: boolean
  /** Unique identifier of the message effect to be added to the message; for private chats only */
  message_effect_id?: string
  /** Description of the message to reply to */
  reply_parameters?: ReplyParameters
  /** A JSON-serialized object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game. */
  reply_markup?: InlineKeyboardMarkup
}

export type SetGameScoreRequest = {
  /** User identifier */
  user_id: string
  /** New score, must be non-negative */
  score: number
  /** Pass True if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters. */
  force?: boolean
  /** Pass True if the game message should not be automatically edited to include the current scoreboard */
  disable_edit_message?: boolean
  /** Required if inline_message_id is not specified. Unique identifier for the target chat. */
  chat_id?: string
  /** Required if inline_message_id is not specified. Identifier of the sent message. */
  message_id?: string
  /** Required if chat_id and message_id are not specified. Identifier of the inline message. */
  inline_message_id?: string
}

export type SetGameScoreResponse = Message | boolean

export type GetGameHighScoresRequest = {
  /** Target user id */
  user_id: string
  /** Required if inline_message_id is not specified. Unique identifier for the target chat. */
  chat_id?: string
  /** Required if inline_message_id is not specified. Identifier of the sent message. */
  message_id?: string
  /** Required if chat_id and message_id are not specified. Identifier of the inline message. */
  inline_message_id?: string
}

export type GetGameHighScoresResponse = Array<GameHighScore>
