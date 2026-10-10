// GENERATED. DO NOT EDIT.
// Source: spec/bot/api.json
// Run: pnpm bot:generate

import { int64, integer, number } from "@wirecat/cli-core/codegen/runtime"
import * as v from "valibot"
import type * as T from "./types.js"

export const Update: v.GenericSchema<unknown, T.Update> = v.looseObject({
  update_id: int64(),
  message: v.optional(v.lazy(() => Message)),
  edited_message: v.optional(v.lazy(() => Message)),
  channel_post: v.optional(v.lazy(() => Message)),
  edited_channel_post: v.optional(v.lazy(() => Message)),
  business_connection: v.optional(v.lazy(() => BusinessConnection)),
  business_message: v.optional(v.lazy(() => Message)),
  edited_business_message: v.optional(v.lazy(() => Message)),
  deleted_business_messages: v.optional(v.lazy(() => BusinessMessagesDeleted)),
  guest_message: v.optional(v.lazy(() => Message)),
  message_reaction: v.optional(v.lazy(() => MessageReactionUpdated)),
  message_reaction_count: v.optional(v.lazy(() => MessageReactionCountUpdated)),
  inline_query: v.optional(v.lazy(() => InlineQuery)),
  chosen_inline_result: v.optional(v.lazy(() => ChosenInlineResult)),
  callback_query: v.optional(v.lazy(() => CallbackQuery)),
  shipping_query: v.optional(v.lazy(() => ShippingQuery)),
  pre_checkout_query: v.optional(v.lazy(() => PreCheckoutQuery)),
  purchased_paid_media: v.optional(v.lazy(() => PaidMediaPurchased)),
  poll: v.optional(v.lazy(() => Poll)),
  poll_answer: v.optional(v.lazy(() => PollAnswer)),
  my_chat_member: v.optional(v.lazy(() => ChatMemberUpdated)),
  chat_member: v.optional(v.lazy(() => ChatMemberUpdated)),
  chat_join_request: v.optional(v.lazy(() => ChatJoinRequest)),
  chat_boost: v.optional(v.lazy(() => ChatBoostUpdated)),
  removed_chat_boost: v.optional(v.lazy(() => ChatBoostRemoved)),
  managed_bot: v.optional(v.lazy(() => ManagedBotUpdated)),
  subscription: v.optional(v.lazy(() => BotSubscriptionUpdated)),
  stopped_message_generation: v.optional(v.lazy(() => MessageGenerationStopped)),
})

export const WebhookInfo: v.GenericSchema<unknown, T.WebhookInfo> = v.looseObject({
  url: v.string(),
  has_custom_certificate: v.boolean(),
  pending_update_count: integer(),
  ip_address: v.optional(v.string()),
  last_error_date: v.optional(integer()),
  last_error_message: v.optional(v.string()),
  last_synchronization_error_date: v.optional(integer()),
  max_connections: v.optional(integer()),
  allowed_updates: v.optional(v.array(v.string())),
})

export const User: v.GenericSchema<unknown, T.User> = v.looseObject({
  id: int64(),
  is_bot: v.boolean(),
  first_name: v.string(),
  last_name: v.optional(v.string()),
  username: v.optional(v.string()),
  language_code: v.optional(v.string()),
  is_premium: v.optional(v.boolean()),
  added_to_attachment_menu: v.optional(v.boolean()),
  can_join_groups: v.optional(v.boolean()),
  can_read_all_group_messages: v.optional(v.boolean()),
  supports_guest_queries: v.optional(v.boolean()),
  supports_inline_queries: v.optional(v.boolean()),
  can_connect_to_business: v.optional(v.boolean()),
  has_main_web_app: v.optional(v.boolean()),
  has_topics_enabled: v.optional(v.boolean()),
  allows_users_to_create_topics: v.optional(v.boolean()),
  can_manage_bots: v.optional(v.boolean()),
  supports_join_request_queries: v.optional(v.boolean()),
})

export const Chat: v.GenericSchema<unknown, T.Chat> = v.looseObject({
  id: int64(),
  type: v.string(),
  title: v.optional(v.string()),
  username: v.optional(v.string()),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  is_forum: v.optional(v.boolean()),
  is_direct_messages: v.optional(v.boolean()),
})

export const ChatFullInfo: v.GenericSchema<unknown, T.ChatFullInfo> = v.looseObject({
  id: int64(),
  type: v.string(),
  title: v.optional(v.string()),
  username: v.optional(v.string()),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  is_forum: v.optional(v.boolean()),
  is_direct_messages: v.optional(v.boolean()),
  accent_color_id: int64(),
  max_reaction_count: integer(),
  photo: v.optional(v.lazy(() => ChatPhoto)),
  active_usernames: v.optional(v.array(v.string())),
  birthdate: v.optional(v.lazy(() => Birthdate)),
  business_intro: v.optional(v.lazy(() => BusinessIntro)),
  business_location: v.optional(v.lazy(() => BusinessLocation)),
  business_opening_hours: v.optional(v.lazy(() => BusinessOpeningHours)),
  personal_chat: v.optional(v.lazy(() => Chat)),
  parent_chat: v.optional(v.lazy(() => Chat)),
  available_reactions: v.optional(v.array(v.lazy(() => ReactionType))),
  background_custom_emoji_id: v.optional(v.string()),
  profile_accent_color_id: v.optional(int64()),
  profile_background_custom_emoji_id: v.optional(v.string()),
  emoji_status_custom_emoji_id: v.optional(v.string()),
  emoji_status_expiration_date: v.optional(integer()),
  bio: v.optional(v.string()),
  has_private_forwards: v.optional(v.boolean()),
  has_restricted_voice_and_video_messages: v.optional(v.boolean()),
  join_to_send_messages: v.optional(v.boolean()),
  join_by_request: v.optional(v.boolean()),
  description: v.optional(v.string()),
  invite_link: v.optional(v.string()),
  pinned_message: v.optional(v.lazy(() => Message)),
  permissions: v.optional(v.lazy(() => ChatPermissions)),
  accepted_gift_types: v.lazy(() => AcceptedGiftTypes),
  can_send_paid_media: v.optional(v.boolean()),
  slow_mode_delay: v.optional(integer()),
  unrestrict_boost_count: v.optional(integer()),
  message_auto_delete_time: v.optional(integer()),
  has_aggressive_anti_spam_enabled: v.optional(v.boolean()),
  has_hidden_members: v.optional(v.boolean()),
  has_protected_content: v.optional(v.boolean()),
  has_visible_history: v.optional(v.boolean()),
  sticker_set_name: v.optional(v.string()),
  can_set_sticker_set: v.optional(v.boolean()),
  custom_emoji_sticker_set_name: v.optional(v.string()),
  linked_chat_id: v.optional(int64()),
  location: v.optional(v.lazy(() => ChatLocation)),
  rating: v.optional(v.lazy(() => UserRating)),
  first_profile_audio: v.optional(v.lazy(() => Audio)),
  unique_gift_colors: v.optional(v.lazy(() => UniqueGiftColors)),
  paid_message_star_count: v.optional(integer()),
  guard_bot: v.optional(v.lazy(() => User)),
  community: v.optional(v.lazy(() => Community)),
})

export const Message: v.GenericSchema<unknown, T.Message> = v.looseObject({
  message_id: int64(),
  message_thread_id: v.optional(int64()),
  direct_messages_topic: v.optional(v.lazy(() => DirectMessagesTopic)),
  from: v.optional(v.lazy(() => User)),
  sender_chat: v.optional(v.lazy(() => Chat)),
  sender_boost_count: v.optional(integer()),
  sender_business_bot: v.optional(v.lazy(() => User)),
  sender_tag: v.optional(v.string()),
  receiver_user: v.optional(v.lazy(() => User)),
  ephemeral_message_id: v.optional(int64()),
  date: integer(),
  guest_query_id: v.optional(v.string()),
  business_connection_id: v.optional(v.string()),
  chat: v.lazy(() => Chat),
  forward_origin: v.optional(v.lazy(() => MessageOrigin)),
  is_topic_message: v.optional(v.boolean()),
  is_automatic_forward: v.optional(v.boolean()),
  reply_to_message: v.optional(v.lazy(() => Message)),
  external_reply: v.optional(v.lazy(() => ExternalReplyInfo)),
  quote: v.optional(v.lazy(() => TextQuote)),
  reply_to_story: v.optional(v.lazy(() => Story)),
  reply_to_checklist_task_id: v.optional(int64()),
  reply_to_poll_option_id: v.optional(v.string()),
  via_bot: v.optional(v.lazy(() => User)),
  guest_bot_caller_user: v.optional(v.lazy(() => User)),
  guest_bot_caller_chat: v.optional(v.lazy(() => Chat)),
  edit_date: v.optional(integer()),
  has_protected_content: v.optional(v.boolean()),
  is_from_offline: v.optional(v.boolean()),
  is_paid_post: v.optional(v.boolean()),
  media_group_id: v.optional(v.string()),
  author_signature: v.optional(v.string()),
  paid_star_count: v.optional(integer()),
  text: v.optional(v.string()),
  entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  link_preview_options: v.optional(v.lazy(() => LinkPreviewOptions)),
  suggested_post_info: v.optional(v.lazy(() => SuggestedPostInfo)),
  effect_id: v.optional(v.string()),
  rich_message: v.optional(v.lazy(() => RichMessage)),
  animation: v.optional(v.lazy(() => Animation)),
  audio: v.optional(v.lazy(() => Audio)),
  document: v.optional(v.lazy(() => Document)),
  live_photo: v.optional(v.lazy(() => LivePhoto)),
  paid_media: v.optional(v.lazy(() => PaidMediaInfo)),
  photo: v.optional(v.array(v.lazy(() => PhotoSize))),
  sticker: v.optional(v.lazy(() => Sticker)),
  story: v.optional(v.lazy(() => Story)),
  video: v.optional(v.lazy(() => Video)),
  video_note: v.optional(v.lazy(() => VideoNote)),
  voice: v.optional(v.lazy(() => Voice)),
  caption: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  has_media_spoiler: v.optional(v.boolean()),
  checklist: v.optional(v.lazy(() => Checklist)),
  contact: v.optional(v.lazy(() => Contact)),
  dice: v.optional(v.lazy(() => Dice)),
  game: v.optional(v.lazy(() => Game)),
  poll: v.optional(v.lazy(() => Poll)),
  venue: v.optional(v.lazy(() => Venue)),
  location: v.optional(v.lazy(() => Location)),
  new_chat_members: v.optional(v.array(v.lazy(() => User))),
  left_chat_member: v.optional(v.lazy(() => User)),
  chat_owner_left: v.optional(v.lazy(() => ChatOwnerLeft)),
  chat_owner_changed: v.optional(v.lazy(() => ChatOwnerChanged)),
  new_chat_title: v.optional(v.string()),
  new_chat_photo: v.optional(v.array(v.lazy(() => PhotoSize))),
  delete_chat_photo: v.optional(v.boolean()),
  group_chat_created: v.optional(v.boolean()),
  supergroup_chat_created: v.optional(v.boolean()),
  channel_chat_created: v.optional(v.boolean()),
  message_auto_delete_timer_changed: v.optional(v.lazy(() => MessageAutoDeleteTimerChanged)),
  migrate_to_chat_id: v.optional(int64()),
  migrate_from_chat_id: v.optional(int64()),
  pinned_message: v.optional(v.lazy(() => MaybeInaccessibleMessage)),
  invoice: v.optional(v.lazy(() => Invoice)),
  successful_payment: v.optional(v.lazy(() => SuccessfulPayment)),
  refunded_payment: v.optional(v.lazy(() => RefundedPayment)),
  users_shared: v.optional(v.lazy(() => UsersShared)),
  chat_shared: v.optional(v.lazy(() => ChatShared)),
  gift: v.optional(v.lazy(() => GiftInfo)),
  unique_gift: v.optional(v.lazy(() => UniqueGiftInfo)),
  gift_upgrade_sent: v.optional(v.lazy(() => GiftInfo)),
  connected_website: v.optional(v.string()),
  write_access_allowed: v.optional(v.lazy(() => WriteAccessAllowed)),
  passport_data: v.optional(v.lazy(() => PassportData)),
  proximity_alert_triggered: v.optional(v.lazy(() => ProximityAlertTriggered)),
  boost_added: v.optional(v.lazy(() => ChatBoostAdded)),
  chat_background_set: v.optional(v.lazy(() => ChatBackground)),
  checklist_tasks_done: v.optional(v.lazy(() => ChecklistTasksDone)),
  checklist_tasks_added: v.optional(v.lazy(() => ChecklistTasksAdded)),
  community_chat_added: v.optional(v.lazy(() => CommunityChatAdded)),
  community_chat_joined: v.optional(v.lazy(() => CommunityChatJoined)),
  community_chat_removed: v.optional(v.lazy(() => CommunityChatRemoved)),
  direct_message_price_changed: v.optional(v.lazy(() => DirectMessagePriceChanged)),
  forum_topic_created: v.optional(v.lazy(() => ForumTopicCreated)),
  forum_topic_edited: v.optional(v.lazy(() => ForumTopicEdited)),
  forum_topic_closed: v.optional(v.lazy(() => ForumTopicClosed)),
  forum_topic_reopened: v.optional(v.lazy(() => ForumTopicReopened)),
  general_forum_topic_hidden: v.optional(v.lazy(() => GeneralForumTopicHidden)),
  general_forum_topic_unhidden: v.optional(v.lazy(() => GeneralForumTopicUnhidden)),
  giveaway_created: v.optional(v.lazy(() => GiveawayCreated)),
  giveaway: v.optional(v.lazy(() => Giveaway)),
  giveaway_winners: v.optional(v.lazy(() => GiveawayWinners)),
  giveaway_completed: v.optional(v.lazy(() => GiveawayCompleted)),
  managed_bot_created: v.optional(v.lazy(() => ManagedBotCreated)),
  paid_message_price_changed: v.optional(v.lazy(() => PaidMessagePriceChanged)),
  poll_option_added: v.optional(v.lazy(() => PollOptionAdded)),
  poll_option_deleted: v.optional(v.lazy(() => PollOptionDeleted)),
  suggested_post_approved: v.optional(v.lazy(() => SuggestedPostApproved)),
  suggested_post_approval_failed: v.optional(v.lazy(() => SuggestedPostApprovalFailed)),
  suggested_post_declined: v.optional(v.lazy(() => SuggestedPostDeclined)),
  suggested_post_paid: v.optional(v.lazy(() => SuggestedPostPaid)),
  suggested_post_refunded: v.optional(v.lazy(() => SuggestedPostRefunded)),
  video_chat_scheduled: v.optional(v.lazy(() => VideoChatScheduled)),
  video_chat_started: v.optional(v.lazy(() => VideoChatStarted)),
  video_chat_ended: v.optional(v.lazy(() => VideoChatEnded)),
  video_chat_participants_invited: v.optional(v.lazy(() => VideoChatParticipantsInvited)),
  web_app_data: v.optional(v.lazy(() => WebAppData)),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const MessageId: v.GenericSchema<unknown, T.MessageId> = v.looseObject({
  message_id: int64(),
})

export const InaccessibleMessage: v.GenericSchema<unknown, T.InaccessibleMessage> = v.looseObject({
  chat: v.lazy(() => Chat),
  message_id: int64(),
  date: integer(),
})

export const MaybeInaccessibleMessage: v.GenericSchema<unknown, T.MaybeInaccessibleMessage> = v.union([
  v.lazy(() => Message),
  v.lazy(() => InaccessibleMessage),
])

export const MessageEntity: v.GenericSchema<unknown, T.MessageEntity> = v.looseObject({
  type: v.string(),
  offset: integer(),
  length: integer(),
  url: v.optional(v.string()),
  user: v.optional(v.lazy(() => User)),
  language: v.optional(v.string()),
  custom_emoji_id: v.optional(v.string()),
  unix_time: v.optional(integer()),
  date_time_format: v.optional(v.string()),
})

export const TextQuote: v.GenericSchema<unknown, T.TextQuote> = v.looseObject({
  text: v.string(),
  entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  position: integer(),
  is_manual: v.optional(v.boolean()),
})

export const ExternalReplyInfo: v.GenericSchema<unknown, T.ExternalReplyInfo> = v.looseObject({
  origin: v.lazy(() => MessageOrigin),
  chat: v.optional(v.lazy(() => Chat)),
  message_id: v.optional(int64()),
  link_preview_options: v.optional(v.lazy(() => LinkPreviewOptions)),
  animation: v.optional(v.lazy(() => Animation)),
  audio: v.optional(v.lazy(() => Audio)),
  document: v.optional(v.lazy(() => Document)),
  live_photo: v.optional(v.lazy(() => LivePhoto)),
  paid_media: v.optional(v.lazy(() => PaidMediaInfo)),
  photo: v.optional(v.array(v.lazy(() => PhotoSize))),
  sticker: v.optional(v.lazy(() => Sticker)),
  story: v.optional(v.lazy(() => Story)),
  video: v.optional(v.lazy(() => Video)),
  video_note: v.optional(v.lazy(() => VideoNote)),
  voice: v.optional(v.lazy(() => Voice)),
  has_media_spoiler: v.optional(v.boolean()),
  checklist: v.optional(v.lazy(() => Checklist)),
  contact: v.optional(v.lazy(() => Contact)),
  dice: v.optional(v.lazy(() => Dice)),
  game: v.optional(v.lazy(() => Game)),
  giveaway: v.optional(v.lazy(() => Giveaway)),
  giveaway_winners: v.optional(v.lazy(() => GiveawayWinners)),
  invoice: v.optional(v.lazy(() => Invoice)),
  location: v.optional(v.lazy(() => Location)),
  poll: v.optional(v.lazy(() => Poll)),
  venue: v.optional(v.lazy(() => Venue)),
})

export const ReplyParameters: v.GenericSchema<unknown, T.ReplyParameters> = v.looseObject({
  message_id: v.optional(int64()),
  chat_id: v.optional(v.union([int64(), v.string()])),
  ephemeral_message_id: v.optional(int64()),
  allow_sending_without_reply: v.optional(v.boolean()),
  quote: v.optional(v.string()),
  quote_parse_mode: v.optional(v.string()),
  quote_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  quote_position: v.optional(integer()),
  checklist_task_id: v.optional(int64()),
  poll_option_id: v.optional(v.string()),
})

export const EphemeralMessageParameters: v.GenericSchema<unknown, T.EphemeralMessageParameters> = v.looseObject({
  receiver_user_id: int64(),
  callback_query_id: v.optional(v.string()),
  replace_callback_query_message: v.optional(v.boolean()),
})

export const MessageOrigin: v.GenericSchema<unknown, T.MessageOrigin> = v.union([
  v.lazy(() => MessageOriginUser),
  v.lazy(() => MessageOriginHiddenUser),
  v.lazy(() => MessageOriginChat),
  v.lazy(() => MessageOriginChannel),
])

export const MessageOriginUser: v.GenericSchema<unknown, T.MessageOriginUser> = v.looseObject({
  type: v.picklist(["user"]),
  date: integer(),
  sender_user: v.lazy(() => User),
})

export const MessageOriginHiddenUser: v.GenericSchema<unknown, T.MessageOriginHiddenUser> = v.looseObject({
  type: v.picklist(["hidden_user"]),
  date: integer(),
  sender_user_name: v.string(),
})

export const MessageOriginChat: v.GenericSchema<unknown, T.MessageOriginChat> = v.looseObject({
  type: v.picklist(["chat"]),
  date: integer(),
  sender_chat: v.lazy(() => Chat),
  author_signature: v.optional(v.string()),
})

export const MessageOriginChannel: v.GenericSchema<unknown, T.MessageOriginChannel> = v.looseObject({
  type: v.picklist(["channel"]),
  date: integer(),
  chat: v.lazy(() => Chat),
  message_id: int64(),
  author_signature: v.optional(v.string()),
})

export const PhotoSize: v.GenericSchema<unknown, T.PhotoSize> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  width: integer(),
  height: integer(),
  file_size: v.optional(integer()),
})

export const Animation: v.GenericSchema<unknown, T.Animation> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  width: integer(),
  height: integer(),
  duration: integer(),
  thumbnail: v.optional(v.lazy(() => PhotoSize)),
  file_name: v.optional(v.string()),
  mime_type: v.optional(v.string()),
  file_size: v.optional(integer()),
})

export const Audio: v.GenericSchema<unknown, T.Audio> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  duration: integer(),
  performer: v.optional(v.string()),
  title: v.optional(v.string()),
  file_name: v.optional(v.string()),
  mime_type: v.optional(v.string()),
  file_size: v.optional(integer()),
  thumbnail: v.optional(v.lazy(() => PhotoSize)),
})

export const Document: v.GenericSchema<unknown, T.Document> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  thumbnail: v.optional(v.lazy(() => PhotoSize)),
  file_name: v.optional(v.string()),
  mime_type: v.optional(v.string()),
  file_size: v.optional(integer()),
})

export const LivePhoto: v.GenericSchema<unknown, T.LivePhoto> = v.looseObject({
  photo: v.optional(v.array(v.lazy(() => PhotoSize))),
  file_id: v.string(),
  file_unique_id: v.string(),
  width: integer(),
  height: integer(),
  duration: integer(),
  mime_type: v.optional(v.string()),
  file_size: v.optional(integer()),
})

export const Story: v.GenericSchema<unknown, T.Story> = v.looseObject({
  chat: v.lazy(() => Chat),
  id: int64(),
})

export const VideoQuality: v.GenericSchema<unknown, T.VideoQuality> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  width: integer(),
  height: integer(),
  codec: v.string(),
  file_size: v.optional(integer()),
})

export const Video: v.GenericSchema<unknown, T.Video> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  width: integer(),
  height: integer(),
  duration: integer(),
  thumbnail: v.optional(v.lazy(() => PhotoSize)),
  cover: v.optional(v.array(v.lazy(() => PhotoSize))),
  start_timestamp: v.optional(integer()),
  qualities: v.optional(v.array(v.lazy(() => VideoQuality))),
  file_name: v.optional(v.string()),
  mime_type: v.optional(v.string()),
  file_size: v.optional(integer()),
})

export const VideoNote: v.GenericSchema<unknown, T.VideoNote> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  length: integer(),
  duration: integer(),
  thumbnail: v.optional(v.lazy(() => PhotoSize)),
  file_size: v.optional(integer()),
})

export const Voice: v.GenericSchema<unknown, T.Voice> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  duration: integer(),
  mime_type: v.optional(v.string()),
  file_size: v.optional(integer()),
})

export const PaidMediaInfo: v.GenericSchema<unknown, T.PaidMediaInfo> = v.looseObject({
  star_count: integer(),
  paid_media: v.array(v.lazy(() => PaidMedia)),
})

export const PaidMedia: v.GenericSchema<unknown, T.PaidMedia> = v.union([
  v.lazy(() => PaidMediaLivePhoto),
  v.lazy(() => PaidMediaPhoto),
  v.lazy(() => PaidMediaPreview),
  v.lazy(() => PaidMediaVideo),
])

export const PaidMediaLivePhoto: v.GenericSchema<unknown, T.PaidMediaLivePhoto> = v.looseObject({
  type: v.picklist(["live_photo"]),
  live_photo: v.lazy(() => LivePhoto),
})

export const PaidMediaPhoto: v.GenericSchema<unknown, T.PaidMediaPhoto> = v.looseObject({
  type: v.picklist(["photo"]),
  photo: v.array(v.lazy(() => PhotoSize)),
})

export const PaidMediaPreview: v.GenericSchema<unknown, T.PaidMediaPreview> = v.looseObject({
  type: v.picklist(["preview"]),
  width: v.optional(integer()),
  height: v.optional(integer()),
  duration: v.optional(integer()),
})

export const PaidMediaVideo: v.GenericSchema<unknown, T.PaidMediaVideo> = v.looseObject({
  type: v.picklist(["video"]),
  video: v.lazy(() => Video),
})

export const Contact: v.GenericSchema<unknown, T.Contact> = v.looseObject({
  phone_number: v.string(),
  first_name: v.string(),
  last_name: v.optional(v.string()),
  user_id: v.optional(int64()),
  vcard: v.optional(v.string()),
})

export const Dice: v.GenericSchema<unknown, T.Dice> = v.looseObject({
  emoji: v.string(),
  value: integer(),
})

export const Link: v.GenericSchema<unknown, T.Link> = v.looseObject({
  url: v.string(),
})

export const PollMedia: v.GenericSchema<unknown, T.PollMedia> = v.looseObject({
  animation: v.optional(v.lazy(() => Animation)),
  audio: v.optional(v.lazy(() => Audio)),
  document: v.optional(v.lazy(() => Document)),
  link: v.optional(v.lazy(() => Link)),
  live_photo: v.optional(v.lazy(() => LivePhoto)),
  location: v.optional(v.lazy(() => Location)),
  photo: v.optional(v.array(v.lazy(() => PhotoSize))),
  sticker: v.optional(v.lazy(() => Sticker)),
  venue: v.optional(v.lazy(() => Venue)),
  video: v.optional(v.lazy(() => Video)),
})

export const InputPollMedia: v.GenericSchema<unknown, T.InputPollMedia> = v.union([
  v.lazy(() => InputMediaAnimation),
  v.lazy(() => InputMediaAudio),
  v.lazy(() => InputMediaDocument),
  v.lazy(() => InputMediaLivePhoto),
  v.lazy(() => InputMediaLocation),
  v.lazy(() => InputMediaPhoto),
  v.lazy(() => InputMediaVenue),
  v.lazy(() => InputMediaVideo),
])

export const InputPollOptionMedia: v.GenericSchema<unknown, T.InputPollOptionMedia> = v.union([
  v.lazy(() => InputMediaAnimation),
  v.lazy(() => InputMediaLink),
  v.lazy(() => InputMediaLivePhoto),
  v.lazy(() => InputMediaLocation),
  v.lazy(() => InputMediaPhoto),
  v.lazy(() => InputMediaSticker),
  v.lazy(() => InputMediaVenue),
  v.lazy(() => InputMediaVideo),
])

export const PollOption: v.GenericSchema<unknown, T.PollOption> = v.looseObject({
  persistent_id: v.string(),
  text: v.string(),
  text_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  media: v.optional(v.lazy(() => PollMedia)),
  voter_count: integer(),
  added_by_user: v.optional(v.lazy(() => User)),
  added_by_chat: v.optional(v.lazy(() => Chat)),
  addition_date: v.optional(integer()),
})

export const InputPollOption: v.GenericSchema<unknown, T.InputPollOption> = v.looseObject({
  text: v.string(),
  text_parse_mode: v.optional(v.string()),
  text_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  media: v.optional(v.lazy(() => InputPollOptionMedia)),
})

export const PollAnswer: v.GenericSchema<unknown, T.PollAnswer> = v.looseObject({
  poll_id: v.string(),
  voter_chat: v.optional(v.lazy(() => Chat)),
  user: v.optional(v.lazy(() => User)),
  option_ids: v.array(integer()),
  option_persistent_ids: v.array(v.string()),
})

export const Poll: v.GenericSchema<unknown, T.Poll> = v.looseObject({
  id: v.string(),
  question: v.string(),
  question_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  options: v.array(v.lazy(() => PollOption)),
  total_voter_count: integer(),
  is_closed: v.boolean(),
  is_anonymous: v.boolean(),
  type: v.string(),
  allows_multiple_answers: v.boolean(),
  allows_revoting: v.boolean(),
  members_only: v.boolean(),
  country_codes: v.optional(v.array(v.string())),
  correct_option_ids: v.optional(v.array(integer())),
  explanation: v.optional(v.string()),
  explanation_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  explanation_media: v.optional(v.lazy(() => PollMedia)),
  open_period: v.optional(integer()),
  close_date: v.optional(integer()),
  description: v.optional(v.string()),
  description_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  media: v.optional(v.lazy(() => PollMedia)),
})

export const ChecklistTask: v.GenericSchema<unknown, T.ChecklistTask> = v.looseObject({
  id: int64(),
  text: v.string(),
  text_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  completed_by_user: v.optional(v.lazy(() => User)),
  completed_by_chat: v.optional(v.lazy(() => Chat)),
  completion_date: v.optional(integer()),
})

export const Checklist: v.GenericSchema<unknown, T.Checklist> = v.looseObject({
  title: v.string(),
  title_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  tasks: v.array(v.lazy(() => ChecklistTask)),
  others_can_add_tasks: v.optional(v.boolean()),
  others_can_mark_tasks_as_done: v.optional(v.boolean()),
})

export const InputChecklistTask: v.GenericSchema<unknown, T.InputChecklistTask> = v.looseObject({
  id: int64(),
  text: v.string(),
  parse_mode: v.optional(v.string()),
  text_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
})

export const InputChecklist: v.GenericSchema<unknown, T.InputChecklist> = v.looseObject({
  title: v.string(),
  parse_mode: v.optional(v.string()),
  title_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  tasks: v.array(v.lazy(() => InputChecklistTask)),
  others_can_add_tasks: v.optional(v.boolean()),
  others_can_mark_tasks_as_done: v.optional(v.boolean()),
})

export const Location: v.GenericSchema<unknown, T.Location> = v.looseObject({
  latitude: number(),
  longitude: number(),
  horizontal_accuracy: v.optional(number()),
  live_period: v.optional(integer()),
  heading: v.optional(integer()),
  proximity_alert_radius: v.optional(integer()),
})

export const Venue: v.GenericSchema<unknown, T.Venue> = v.looseObject({
  location: v.lazy(() => Location),
  title: v.string(),
  address: v.string(),
  foursquare_id: v.optional(v.string()),
  foursquare_type: v.optional(v.string()),
  google_place_id: v.optional(v.string()),
  google_place_type: v.optional(v.string()),
})

export const WebAppData: v.GenericSchema<unknown, T.WebAppData> = v.looseObject({
  data: v.string(),
  button_text: v.string(),
})

export const ProximityAlertTriggered: v.GenericSchema<unknown, T.ProximityAlertTriggered> = v.looseObject({
  traveler: v.lazy(() => User),
  watcher: v.lazy(() => User),
  distance: integer(),
})

export const MessageAutoDeleteTimerChanged: v.GenericSchema<unknown, T.MessageAutoDeleteTimerChanged> = v.looseObject({
  message_auto_delete_time: integer(),
})

export const ManagedBotCreated: v.GenericSchema<unknown, T.ManagedBotCreated> = v.looseObject({
  bot: v.lazy(() => User),
})

export const ManagedBotUpdated: v.GenericSchema<unknown, T.ManagedBotUpdated> = v.looseObject({
  user: v.lazy(() => User),
  bot: v.lazy(() => User),
})

export const BotSubscriptionUpdated: v.GenericSchema<unknown, T.BotSubscriptionUpdated> = v.looseObject({
  user: v.lazy(() => User),
  invoice_payload: v.string(),
  state: v.string(),
})

export const MessageGenerationStopped: v.GenericSchema<unknown, T.MessageGenerationStopped> = v.looseObject({
  chat: v.lazy(() => Chat),
  message_thread_id: v.optional(int64()),
  draft_id: int64(),
})

export const PollOptionAdded: v.GenericSchema<unknown, T.PollOptionAdded> = v.looseObject({
  poll_message: v.optional(v.lazy(() => MaybeInaccessibleMessage)),
  option_persistent_id: v.string(),
  option_text: v.string(),
  option_text_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
})

export const PollOptionDeleted: v.GenericSchema<unknown, T.PollOptionDeleted> = v.looseObject({
  poll_message: v.optional(v.lazy(() => MaybeInaccessibleMessage)),
  option_persistent_id: v.string(),
  option_text: v.string(),
  option_text_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
})

export const ChatBoostAdded: v.GenericSchema<unknown, T.ChatBoostAdded> = v.looseObject({
  boost_count: integer(),
})

export const BackgroundFill: v.GenericSchema<unknown, T.BackgroundFill> = v.union([
  v.lazy(() => BackgroundFillSolid),
  v.lazy(() => BackgroundFillGradient),
  v.lazy(() => BackgroundFillFreeformGradient),
])

export const BackgroundFillSolid: v.GenericSchema<unknown, T.BackgroundFillSolid> = v.looseObject({
  type: v.picklist(["solid"]),
  color: integer(),
})

export const BackgroundFillGradient: v.GenericSchema<unknown, T.BackgroundFillGradient> = v.looseObject({
  type: v.picklist(["gradient"]),
  top_color: integer(),
  bottom_color: integer(),
  rotation_angle: integer(),
})

export const BackgroundFillFreeformGradient: v.GenericSchema<unknown, T.BackgroundFillFreeformGradient> = v.looseObject(
  {
    type: v.picklist(["freeform_gradient"]),
    colors: v.array(integer()),
  },
)

export const BackgroundType: v.GenericSchema<unknown, T.BackgroundType> = v.union([
  v.lazy(() => BackgroundTypeFill),
  v.lazy(() => BackgroundTypeWallpaper),
  v.lazy(() => BackgroundTypePattern),
  v.lazy(() => BackgroundTypeChatTheme),
])

export const BackgroundTypeFill: v.GenericSchema<unknown, T.BackgroundTypeFill> = v.looseObject({
  type: v.picklist(["fill"]),
  fill: v.lazy(() => BackgroundFill),
  dark_theme_dimming: integer(),
})

export const BackgroundTypeWallpaper: v.GenericSchema<unknown, T.BackgroundTypeWallpaper> = v.looseObject({
  type: v.picklist(["wallpaper"]),
  document: v.lazy(() => Document),
  dark_theme_dimming: integer(),
  is_blurred: v.optional(v.boolean()),
  is_moving: v.optional(v.boolean()),
})

export const BackgroundTypePattern: v.GenericSchema<unknown, T.BackgroundTypePattern> = v.looseObject({
  type: v.picklist(["pattern"]),
  document: v.lazy(() => Document),
  fill: v.lazy(() => BackgroundFill),
  intensity: integer(),
  is_inverted: v.optional(v.boolean()),
  is_moving: v.optional(v.boolean()),
})

export const BackgroundTypeChatTheme: v.GenericSchema<unknown, T.BackgroundTypeChatTheme> = v.looseObject({
  type: v.picklist(["chat_theme"]),
  theme_name: v.string(),
})

export const ChatBackground: v.GenericSchema<unknown, T.ChatBackground> = v.looseObject({
  type: v.lazy(() => BackgroundType),
})

export const ChecklistTasksDone: v.GenericSchema<unknown, T.ChecklistTasksDone> = v.looseObject({
  checklist_message: v.optional(v.lazy(() => Message)),
  marked_as_done_task_ids: v.optional(v.array(integer())),
  marked_as_not_done_task_ids: v.optional(v.array(integer())),
})

export const ChecklistTasksAdded: v.GenericSchema<unknown, T.ChecklistTasksAdded> = v.looseObject({
  checklist_message: v.optional(v.lazy(() => Message)),
  tasks: v.array(v.lazy(() => ChecklistTask)),
})

export const CommunityChatAdded: v.GenericSchema<unknown, T.CommunityChatAdded> = v.looseObject({
  community: v.lazy(() => Community),
})

export const CommunityChatJoined: v.GenericSchema<unknown, T.CommunityChatJoined> = v.looseObject({
  community: v.lazy(() => Community),
})

export const CommunityChatRemoved: v.GenericSchema<unknown, T.CommunityChatRemoved> = v.looseObject({})

export const ForumTopicCreated: v.GenericSchema<unknown, T.ForumTopicCreated> = v.looseObject({
  name: v.string(),
  icon_color: integer(),
  icon_custom_emoji_id: v.optional(v.string()),
  is_name_implicit: v.optional(v.boolean()),
})

export const ForumTopicClosed: v.GenericSchema<unknown, T.ForumTopicClosed> = v.looseObject({})

export const ForumTopicEdited: v.GenericSchema<unknown, T.ForumTopicEdited> = v.looseObject({
  name: v.optional(v.string()),
  icon_custom_emoji_id: v.optional(v.string()),
})

export const ForumTopicReopened: v.GenericSchema<unknown, T.ForumTopicReopened> = v.looseObject({})

export const GeneralForumTopicHidden: v.GenericSchema<unknown, T.GeneralForumTopicHidden> = v.looseObject({})

export const GeneralForumTopicUnhidden: v.GenericSchema<unknown, T.GeneralForumTopicUnhidden> = v.looseObject({})

export const SharedUser: v.GenericSchema<unknown, T.SharedUser> = v.looseObject({
  user_id: int64(),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  username: v.optional(v.string()),
  photo: v.optional(v.array(v.lazy(() => PhotoSize))),
})

export const UsersShared: v.GenericSchema<unknown, T.UsersShared> = v.looseObject({
  request_id: int64(),
  users: v.array(v.lazy(() => SharedUser)),
})

export const ChatShared: v.GenericSchema<unknown, T.ChatShared> = v.looseObject({
  request_id: int64(),
  chat_id: int64(),
  title: v.optional(v.string()),
  username: v.optional(v.string()),
  photo: v.optional(v.array(v.lazy(() => PhotoSize))),
})

export const WriteAccessAllowed: v.GenericSchema<unknown, T.WriteAccessAllowed> = v.looseObject({
  from_request: v.optional(v.boolean()),
  web_app_name: v.optional(v.string()),
  from_attachment_menu: v.optional(v.boolean()),
})

export const VideoChatScheduled: v.GenericSchema<unknown, T.VideoChatScheduled> = v.looseObject({
  start_date: integer(),
})

export const VideoChatStarted: v.GenericSchema<unknown, T.VideoChatStarted> = v.looseObject({})

export const VideoChatEnded: v.GenericSchema<unknown, T.VideoChatEnded> = v.looseObject({
  duration: integer(),
})

export const VideoChatParticipantsInvited: v.GenericSchema<unknown, T.VideoChatParticipantsInvited> = v.looseObject({
  users: v.array(v.lazy(() => User)),
})

export const PaidMessagePriceChanged: v.GenericSchema<unknown, T.PaidMessagePriceChanged> = v.looseObject({
  paid_message_star_count: integer(),
})

export const DirectMessagePriceChanged: v.GenericSchema<unknown, T.DirectMessagePriceChanged> = v.looseObject({
  are_direct_messages_enabled: v.boolean(),
  direct_message_star_count: v.optional(integer()),
})

export const SuggestedPostApproved: v.GenericSchema<unknown, T.SuggestedPostApproved> = v.looseObject({
  suggested_post_message: v.optional(v.lazy(() => Message)),
  price: v.optional(v.lazy(() => SuggestedPostPrice)),
  send_date: integer(),
})

export const SuggestedPostApprovalFailed: v.GenericSchema<unknown, T.SuggestedPostApprovalFailed> = v.looseObject({
  suggested_post_message: v.optional(v.lazy(() => Message)),
  price: v.lazy(() => SuggestedPostPrice),
})

export const SuggestedPostDeclined: v.GenericSchema<unknown, T.SuggestedPostDeclined> = v.looseObject({
  suggested_post_message: v.optional(v.lazy(() => Message)),
  comment: v.optional(v.string()),
})

export const SuggestedPostPaid: v.GenericSchema<unknown, T.SuggestedPostPaid> = v.looseObject({
  suggested_post_message: v.optional(v.lazy(() => Message)),
  currency: v.string(),
  amount: v.optional(integer()),
  star_amount: v.optional(v.lazy(() => StarAmount)),
})

export const SuggestedPostRefunded: v.GenericSchema<unknown, T.SuggestedPostRefunded> = v.looseObject({
  suggested_post_message: v.optional(v.lazy(() => Message)),
  reason: v.string(),
})

export const GiveawayCreated: v.GenericSchema<unknown, T.GiveawayCreated> = v.looseObject({
  prize_star_count: v.optional(integer()),
})

export const Giveaway: v.GenericSchema<unknown, T.Giveaway> = v.looseObject({
  chats: v.array(v.lazy(() => Chat)),
  winners_selection_date: integer(),
  winner_count: integer(),
  only_new_members: v.optional(v.boolean()),
  has_public_winners: v.optional(v.boolean()),
  prize_description: v.optional(v.string()),
  country_codes: v.optional(v.array(v.string())),
  prize_star_count: v.optional(integer()),
  premium_subscription_month_count: v.optional(integer()),
})

export const GiveawayWinners: v.GenericSchema<unknown, T.GiveawayWinners> = v.looseObject({
  chat: v.lazy(() => Chat),
  giveaway_message_id: int64(),
  winners_selection_date: integer(),
  winner_count: integer(),
  winners: v.array(v.lazy(() => User)),
  additional_chat_count: v.optional(integer()),
  prize_star_count: v.optional(integer()),
  premium_subscription_month_count: v.optional(integer()),
  unclaimed_prize_count: v.optional(integer()),
  only_new_members: v.optional(v.boolean()),
  was_refunded: v.optional(v.boolean()),
  prize_description: v.optional(v.string()),
})

export const GiveawayCompleted: v.GenericSchema<unknown, T.GiveawayCompleted> = v.looseObject({
  winner_count: integer(),
  unclaimed_prize_count: v.optional(integer()),
  giveaway_message: v.optional(v.lazy(() => Message)),
  is_star_giveaway: v.optional(v.boolean()),
})

export const LinkPreviewOptions: v.GenericSchema<unknown, T.LinkPreviewOptions> = v.looseObject({
  is_disabled: v.optional(v.boolean()),
  url: v.optional(v.string()),
  prefer_small_media: v.optional(v.boolean()),
  prefer_large_media: v.optional(v.boolean()),
  show_above_text: v.optional(v.boolean()),
})

export const SuggestedPostPrice: v.GenericSchema<unknown, T.SuggestedPostPrice> = v.looseObject({
  currency: v.string(),
  amount: integer(),
})

export const SuggestedPostInfo: v.GenericSchema<unknown, T.SuggestedPostInfo> = v.looseObject({
  state: v.string(),
  price: v.optional(v.lazy(() => SuggestedPostPrice)),
  send_date: v.optional(integer()),
})

export const SuggestedPostParameters: v.GenericSchema<unknown, T.SuggestedPostParameters> = v.looseObject({
  price: v.optional(v.lazy(() => SuggestedPostPrice)),
  send_date: v.optional(integer()),
})

export const DirectMessagesTopic: v.GenericSchema<unknown, T.DirectMessagesTopic> = v.looseObject({
  topic_id: int64(),
  user: v.optional(v.lazy(() => User)),
})

export const UserProfilePhotos: v.GenericSchema<unknown, T.UserProfilePhotos> = v.looseObject({
  total_count: integer(),
  photos: v.array(v.array(v.lazy(() => PhotoSize))),
})

export const UserProfileAudios: v.GenericSchema<unknown, T.UserProfileAudios> = v.looseObject({
  total_count: integer(),
  audios: v.array(v.lazy(() => Audio)),
})

export const File: v.GenericSchema<unknown, T.File> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  file_size: v.optional(integer()),
  file_path: v.optional(v.string()),
})

export const WebAppInfo: v.GenericSchema<unknown, T.WebAppInfo> = v.looseObject({
  url: v.string(),
})

export const ReplyKeyboardMarkup: v.GenericSchema<unknown, T.ReplyKeyboardMarkup> = v.looseObject({
  keyboard: v.array(v.array(v.lazy(() => KeyboardButton))),
  is_persistent: v.optional(v.boolean()),
  resize_keyboard: v.optional(v.boolean()),
  one_time_keyboard: v.optional(v.boolean()),
  input_field_placeholder: v.optional(v.string()),
  selective: v.optional(v.boolean()),
  force_reply: v.optional(v.boolean()),
})

export const KeyboardButton: v.GenericSchema<unknown, T.KeyboardButton> = v.looseObject({
  text: v.string(),
  icon_custom_emoji_id: v.optional(v.string()),
  style: v.optional(v.string()),
  request_users: v.optional(v.lazy(() => KeyboardButtonRequestUsers)),
  request_chat: v.optional(v.lazy(() => KeyboardButtonRequestChat)),
  request_managed_bot: v.optional(v.lazy(() => KeyboardButtonRequestManagedBot)),
  request_contact: v.optional(v.boolean()),
  request_location: v.optional(v.boolean()),
  request_poll: v.optional(v.lazy(() => KeyboardButtonPollType)),
  web_app: v.optional(v.lazy(() => WebAppInfo)),
})

export const KeyboardButtonRequestUsers: v.GenericSchema<unknown, T.KeyboardButtonRequestUsers> = v.looseObject({
  request_id: int64(),
  user_is_bot: v.optional(v.boolean()),
  user_is_premium: v.optional(v.boolean()),
  max_quantity: v.optional(integer()),
  request_name: v.optional(v.boolean()),
  request_username: v.optional(v.boolean()),
  request_photo: v.optional(v.boolean()),
})

export const KeyboardButtonRequestChat: v.GenericSchema<unknown, T.KeyboardButtonRequestChat> = v.looseObject({
  request_id: int64(),
  chat_is_channel: v.boolean(),
  chat_is_forum: v.optional(v.boolean()),
  chat_has_username: v.optional(v.boolean()),
  chat_is_created: v.optional(v.boolean()),
  user_administrator_rights: v.optional(v.lazy(() => ChatAdministratorRights)),
  bot_administrator_rights: v.optional(v.lazy(() => ChatAdministratorRights)),
  bot_is_member: v.optional(v.boolean()),
  request_title: v.optional(v.boolean()),
  request_username: v.optional(v.boolean()),
  request_photo: v.optional(v.boolean()),
})

export const KeyboardButtonRequestManagedBot: v.GenericSchema<unknown, T.KeyboardButtonRequestManagedBot> =
  v.looseObject({
    request_id: int64(),
    suggested_name: v.optional(v.string()),
    suggested_username: v.optional(v.string()),
  })

export const KeyboardButtonPollType: v.GenericSchema<unknown, T.KeyboardButtonPollType> = v.looseObject({
  type: v.optional(v.string()),
})

export const ReplyKeyboardRemove: v.GenericSchema<unknown, T.ReplyKeyboardRemove> = v.looseObject({
  remove_keyboard: v.boolean(),
  selective: v.optional(v.boolean()),
})

export const InlineKeyboardMarkup: v.GenericSchema<unknown, T.InlineKeyboardMarkup> = v.looseObject({
  inline_keyboard: v.array(v.array(v.lazy(() => InlineKeyboardButton))),
  force_reply: v.optional(v.boolean()),
})

export const InlineKeyboardButton: v.GenericSchema<unknown, T.InlineKeyboardButton> = v.looseObject({
  text: v.string(),
  icon_custom_emoji_id: v.optional(v.string()),
  style: v.optional(v.string()),
  url: v.optional(v.string()),
  callback_data: v.optional(v.string()),
  web_app: v.optional(v.lazy(() => WebAppInfo)),
  login_url: v.optional(v.lazy(() => LoginUrl)),
  switch_inline_query: v.optional(v.string()),
  switch_inline_query_current_chat: v.optional(v.string()),
  switch_inline_query_chosen_chat: v.optional(v.lazy(() => SwitchInlineQueryChosenChat)),
  copy_text: v.optional(v.lazy(() => CopyTextButton)),
  callback_game: v.optional(v.lazy(() => CallbackGame)),
  pay: v.optional(v.boolean()),
  disabled: v.optional(v.lazy(() => DisabledButton)),
})

export const LoginUrl: v.GenericSchema<unknown, T.LoginUrl> = v.looseObject({
  url: v.string(),
  forward_text: v.optional(v.string()),
  bot_username: v.optional(v.string()),
  request_write_access: v.optional(v.boolean()),
})

export const SwitchInlineQueryChosenChat: v.GenericSchema<unknown, T.SwitchInlineQueryChosenChat> = v.looseObject({
  query: v.optional(v.string()),
  allow_user_chats: v.optional(v.boolean()),
  allow_bot_chats: v.optional(v.boolean()),
  allow_group_chats: v.optional(v.boolean()),
  allow_channel_chats: v.optional(v.boolean()),
})

export const CopyTextButton: v.GenericSchema<unknown, T.CopyTextButton> = v.looseObject({
  text: v.string(),
})

export const DisabledButton: v.GenericSchema<unknown, T.DisabledButton> = v.looseObject({})

export const CallbackQuery: v.GenericSchema<unknown, T.CallbackQuery> = v.looseObject({
  id: v.string(),
  from: v.lazy(() => User),
  message: v.optional(v.lazy(() => MaybeInaccessibleMessage)),
  inline_message_id: v.optional(v.string()),
  chat_instance: v.string(),
  data: v.optional(v.string()),
  game_short_name: v.optional(v.string()),
})

export const ForceReply: v.GenericSchema<unknown, T.ForceReply> = v.looseObject({
  force_reply: v.boolean(),
  input_field_placeholder: v.optional(v.string()),
  selective: v.optional(v.boolean()),
})

export const Community: v.GenericSchema<unknown, T.Community> = v.looseObject({
  id: int64(),
  name: v.string(),
})

export const ChatPhoto: v.GenericSchema<unknown, T.ChatPhoto> = v.looseObject({
  small_file_id: v.string(),
  small_file_unique_id: v.string(),
  big_file_id: v.string(),
  big_file_unique_id: v.string(),
})

export const ChatInviteLink: v.GenericSchema<unknown, T.ChatInviteLink> = v.looseObject({
  invite_link: v.string(),
  creator: v.lazy(() => User),
  creates_join_request: v.boolean(),
  is_primary: v.boolean(),
  is_revoked: v.boolean(),
  name: v.optional(v.string()),
  expire_date: v.optional(integer()),
  member_limit: v.optional(integer()),
  pending_join_request_count: v.optional(integer()),
  subscription_period: v.optional(integer()),
  subscription_price: v.optional(integer()),
})

export const ChatAdministratorRights: v.GenericSchema<unknown, T.ChatAdministratorRights> = v.looseObject({
  is_anonymous: v.boolean(),
  can_manage_chat: v.boolean(),
  can_delete_messages: v.boolean(),
  can_manage_video_chats: v.boolean(),
  can_restrict_members: v.boolean(),
  can_promote_members: v.boolean(),
  can_change_info: v.boolean(),
  can_invite_users: v.boolean(),
  can_post_stories: v.boolean(),
  can_edit_stories: v.boolean(),
  can_delete_stories: v.boolean(),
  can_post_messages: v.optional(v.boolean()),
  can_edit_messages: v.optional(v.boolean()),
  can_pin_messages: v.optional(v.boolean()),
  can_manage_topics: v.optional(v.boolean()),
  can_manage_direct_messages: v.optional(v.boolean()),
  can_manage_tags: v.optional(v.boolean()),
  can_send_welcome_messages: v.boolean(),
})

export const ChatMemberUpdated: v.GenericSchema<unknown, T.ChatMemberUpdated> = v.looseObject({
  chat: v.lazy(() => Chat),
  from: v.lazy(() => User),
  date: integer(),
  old_chat_member: v.lazy(() => ChatMember),
  new_chat_member: v.lazy(() => ChatMember),
  invite_link: v.optional(v.lazy(() => ChatInviteLink)),
  via_join_request: v.optional(v.boolean()),
  via_chat_folder_invite_link: v.optional(v.boolean()),
})

export const ChatMember: v.GenericSchema<unknown, T.ChatMember> = v.union([
  v.lazy(() => ChatMemberOwner),
  v.lazy(() => ChatMemberAdministrator),
  v.lazy(() => ChatMemberMember),
  v.lazy(() => ChatMemberRestricted),
  v.lazy(() => ChatMemberLeft),
  v.lazy(() => ChatMemberBanned),
])

export const ChatMemberOwner: v.GenericSchema<unknown, T.ChatMemberOwner> = v.looseObject({
  status: v.picklist(["creator"]),
  user: v.lazy(() => User),
  is_anonymous: v.boolean(),
  custom_title: v.optional(v.string()),
})

export const ChatMemberAdministrator: v.GenericSchema<unknown, T.ChatMemberAdministrator> = v.looseObject({
  status: v.picklist(["administrator"]),
  user: v.lazy(() => User),
  can_be_edited: v.boolean(),
  is_anonymous: v.boolean(),
  can_manage_chat: v.boolean(),
  can_delete_messages: v.boolean(),
  can_manage_video_chats: v.boolean(),
  can_restrict_members: v.boolean(),
  can_promote_members: v.boolean(),
  can_change_info: v.boolean(),
  can_invite_users: v.boolean(),
  can_post_stories: v.boolean(),
  can_edit_stories: v.boolean(),
  can_delete_stories: v.boolean(),
  can_post_messages: v.optional(v.boolean()),
  can_edit_messages: v.optional(v.boolean()),
  can_pin_messages: v.optional(v.boolean()),
  can_manage_topics: v.optional(v.boolean()),
  can_manage_direct_messages: v.optional(v.boolean()),
  can_manage_tags: v.optional(v.boolean()),
  can_send_welcome_messages: v.boolean(),
  custom_title: v.optional(v.string()),
})

export const ChatMemberMember: v.GenericSchema<unknown, T.ChatMemberMember> = v.looseObject({
  status: v.picklist(["member"]),
  tag: v.optional(v.string()),
  user: v.lazy(() => User),
  until_date: v.optional(integer()),
})

export const ChatMemberRestricted: v.GenericSchema<unknown, T.ChatMemberRestricted> = v.looseObject({
  status: v.picklist(["restricted"]),
  tag: v.optional(v.string()),
  user: v.lazy(() => User),
  is_member: v.boolean(),
  can_send_messages: v.boolean(),
  can_send_audios: v.boolean(),
  can_send_documents: v.boolean(),
  can_send_photos: v.boolean(),
  can_send_videos: v.boolean(),
  can_send_video_notes: v.boolean(),
  can_send_voice_notes: v.boolean(),
  can_send_polls: v.boolean(),
  can_send_other_messages: v.boolean(),
  can_add_web_page_previews: v.boolean(),
  can_react_to_messages: v.boolean(),
  can_edit_tag: v.boolean(),
  can_change_info: v.boolean(),
  can_invite_users: v.boolean(),
  can_pin_messages: v.boolean(),
  can_manage_topics: v.boolean(),
  until_date: integer(),
})

export const ChatMemberLeft: v.GenericSchema<unknown, T.ChatMemberLeft> = v.looseObject({
  status: v.picklist(["left"]),
  user: v.lazy(() => User),
})

export const ChatMemberBanned: v.GenericSchema<unknown, T.ChatMemberBanned> = v.looseObject({
  status: v.picklist(["kicked"]),
  user: v.lazy(() => User),
  until_date: integer(),
})

export const ChatJoinRequest: v.GenericSchema<unknown, T.ChatJoinRequest> = v.looseObject({
  chat: v.lazy(() => Chat),
  from: v.lazy(() => User),
  user_chat_id: int64(),
  date: integer(),
  bio: v.optional(v.string()),
  invite_link: v.optional(v.lazy(() => ChatInviteLink)),
  query_id: v.optional(v.string()),
})

export const ChatPermissions: v.GenericSchema<unknown, T.ChatPermissions> = v.looseObject({
  can_send_messages: v.optional(v.boolean()),
  can_send_audios: v.optional(v.boolean()),
  can_send_documents: v.optional(v.boolean()),
  can_send_photos: v.optional(v.boolean()),
  can_send_videos: v.optional(v.boolean()),
  can_send_video_notes: v.optional(v.boolean()),
  can_send_voice_notes: v.optional(v.boolean()),
  can_send_polls: v.optional(v.boolean()),
  can_send_other_messages: v.optional(v.boolean()),
  can_add_web_page_previews: v.optional(v.boolean()),
  can_react_to_messages: v.optional(v.boolean()),
  can_edit_tag: v.optional(v.boolean()),
  can_change_info: v.optional(v.boolean()),
  can_invite_users: v.optional(v.boolean()),
  can_pin_messages: v.optional(v.boolean()),
  can_manage_topics: v.optional(v.boolean()),
})

export const Birthdate: v.GenericSchema<unknown, T.Birthdate> = v.looseObject({
  day: integer(),
  month: integer(),
  year: v.optional(integer()),
})

export const BusinessIntro: v.GenericSchema<unknown, T.BusinessIntro> = v.looseObject({
  title: v.optional(v.string()),
  message: v.optional(v.string()),
  sticker: v.optional(v.lazy(() => Sticker)),
})

export const BusinessLocation: v.GenericSchema<unknown, T.BusinessLocation> = v.looseObject({
  address: v.string(),
  location: v.optional(v.lazy(() => Location)),
})

export const BusinessOpeningHoursInterval: v.GenericSchema<unknown, T.BusinessOpeningHoursInterval> = v.looseObject({
  opening_minute: integer(),
  closing_minute: integer(),
})

export const BusinessOpeningHours: v.GenericSchema<unknown, T.BusinessOpeningHours> = v.looseObject({
  time_zone_name: v.string(),
  opening_hours: v.array(v.lazy(() => BusinessOpeningHoursInterval)),
})

export const UserRating: v.GenericSchema<unknown, T.UserRating> = v.looseObject({
  level: integer(),
  rating: integer(),
  current_level_rating: integer(),
  next_level_rating: v.optional(integer()),
})

export const StoryAreaPosition: v.GenericSchema<unknown, T.StoryAreaPosition> = v.looseObject({
  x_percentage: number(),
  y_percentage: number(),
  width_percentage: number(),
  height_percentage: number(),
  rotation_angle: number(),
  corner_radius_percentage: number(),
})

export const LocationAddress: v.GenericSchema<unknown, T.LocationAddress> = v.looseObject({
  country_code: v.string(),
  state: v.optional(v.string()),
  city: v.optional(v.string()),
  street: v.optional(v.string()),
})

export const StoryAreaType: v.GenericSchema<unknown, T.StoryAreaType> = v.union([
  v.lazy(() => StoryAreaTypeLocation),
  v.lazy(() => StoryAreaTypeSuggestedReaction),
  v.lazy(() => StoryAreaTypeLink),
  v.lazy(() => StoryAreaTypeWeather),
  v.lazy(() => StoryAreaTypeUniqueGift),
])

export const StoryAreaTypeLocation: v.GenericSchema<unknown, T.StoryAreaTypeLocation> = v.looseObject({
  type: v.picklist(["location"]),
  latitude: number(),
  longitude: number(),
  address: v.optional(v.lazy(() => LocationAddress)),
})

export const StoryAreaTypeSuggestedReaction: v.GenericSchema<unknown, T.StoryAreaTypeSuggestedReaction> = v.looseObject(
  {
    type: v.picklist(["suggested_reaction"]),
    reaction_type: v.lazy(() => ReactionType),
    is_dark: v.optional(v.boolean()),
    is_flipped: v.optional(v.boolean()),
  },
)

export const StoryAreaTypeLink: v.GenericSchema<unknown, T.StoryAreaTypeLink> = v.looseObject({
  type: v.picklist(["link"]),
  url: v.string(),
})

export const StoryAreaTypeWeather: v.GenericSchema<unknown, T.StoryAreaTypeWeather> = v.looseObject({
  type: v.picklist(["weather"]),
  temperature: number(),
  emoji: v.string(),
  background_color: integer(),
})

export const StoryAreaTypeUniqueGift: v.GenericSchema<unknown, T.StoryAreaTypeUniqueGift> = v.looseObject({
  type: v.picklist(["unique_gift"]),
  name: v.string(),
})

export const StoryArea: v.GenericSchema<unknown, T.StoryArea> = v.looseObject({
  position: v.lazy(() => StoryAreaPosition),
  type: v.lazy(() => StoryAreaType),
})

export const ChatLocation: v.GenericSchema<unknown, T.ChatLocation> = v.looseObject({
  location: v.lazy(() => Location),
  address: v.string(),
})

export const ReactionType: v.GenericSchema<unknown, T.ReactionType> = v.union([
  v.lazy(() => ReactionTypeEmoji),
  v.lazy(() => ReactionTypeCustomEmoji),
  v.lazy(() => ReactionTypePaid),
])

export const ReactionTypeEmoji: v.GenericSchema<unknown, T.ReactionTypeEmoji> = v.looseObject({
  type: v.picklist(["emoji"]),
  emoji: v.string(),
})

export const ReactionTypeCustomEmoji: v.GenericSchema<unknown, T.ReactionTypeCustomEmoji> = v.looseObject({
  type: v.picklist(["custom_emoji"]),
  custom_emoji_id: v.string(),
})

export const ReactionTypePaid: v.GenericSchema<unknown, T.ReactionTypePaid> = v.looseObject({
  type: v.picklist(["paid"]),
})

export const ReactionCount: v.GenericSchema<unknown, T.ReactionCount> = v.looseObject({
  type: v.lazy(() => ReactionType),
  total_count: integer(),
})

export const MessageReactionUpdated: v.GenericSchema<unknown, T.MessageReactionUpdated> = v.looseObject({
  chat: v.lazy(() => Chat),
  message_id: int64(),
  user: v.optional(v.lazy(() => User)),
  actor_chat: v.optional(v.lazy(() => Chat)),
  date: integer(),
  old_reaction: v.array(v.lazy(() => ReactionType)),
  new_reaction: v.array(v.lazy(() => ReactionType)),
})

export const MessageReactionCountUpdated: v.GenericSchema<unknown, T.MessageReactionCountUpdated> = v.looseObject({
  chat: v.lazy(() => Chat),
  message_id: int64(),
  date: integer(),
  reactions: v.array(v.lazy(() => ReactionCount)),
})

export const ForumTopic: v.GenericSchema<unknown, T.ForumTopic> = v.looseObject({
  message_thread_id: int64(),
  name: v.string(),
  icon_color: integer(),
  icon_custom_emoji_id: v.optional(v.string()),
  is_name_implicit: v.optional(v.boolean()),
})

export const GiftBackground: v.GenericSchema<unknown, T.GiftBackground> = v.looseObject({
  center_color: integer(),
  edge_color: integer(),
  text_color: integer(),
})

export const Gift: v.GenericSchema<unknown, T.Gift> = v.looseObject({
  id: v.string(),
  sticker: v.lazy(() => Sticker),
  star_count: integer(),
  upgrade_star_count: v.optional(integer()),
  is_premium: v.optional(v.boolean()),
  has_colors: v.optional(v.boolean()),
  total_count: v.optional(integer()),
  remaining_count: v.optional(integer()),
  personal_total_count: v.optional(integer()),
  personal_remaining_count: v.optional(integer()),
  background: v.optional(v.lazy(() => GiftBackground)),
  unique_gift_variant_count: v.optional(integer()),
  publisher_chat: v.optional(v.lazy(() => Chat)),
})

export const Gifts: v.GenericSchema<unknown, T.Gifts> = v.looseObject({
  gifts: v.array(v.lazy(() => Gift)),
})

export const UniqueGiftModel: v.GenericSchema<unknown, T.UniqueGiftModel> = v.looseObject({
  name: v.string(),
  sticker: v.lazy(() => Sticker),
  rarity_per_mille: integer(),
  rarity: v.optional(v.string()),
})

export const UniqueGiftSymbol: v.GenericSchema<unknown, T.UniqueGiftSymbol> = v.looseObject({
  name: v.string(),
  sticker: v.lazy(() => Sticker),
  rarity_per_mille: integer(),
})

export const UniqueGiftBackdropColors: v.GenericSchema<unknown, T.UniqueGiftBackdropColors> = v.looseObject({
  center_color: integer(),
  edge_color: integer(),
  symbol_color: integer(),
  text_color: integer(),
})

export const UniqueGiftBackdrop: v.GenericSchema<unknown, T.UniqueGiftBackdrop> = v.looseObject({
  name: v.string(),
  colors: v.lazy(() => UniqueGiftBackdropColors),
  rarity_per_mille: integer(),
})

export const UniqueGiftColors: v.GenericSchema<unknown, T.UniqueGiftColors> = v.looseObject({
  model_custom_emoji_id: v.string(),
  symbol_custom_emoji_id: v.string(),
  light_theme_main_color: integer(),
  light_theme_other_colors: v.array(integer()),
  dark_theme_main_color: integer(),
  dark_theme_other_colors: v.array(integer()),
})

export const UniqueGift: v.GenericSchema<unknown, T.UniqueGift> = v.looseObject({
  gift_id: v.string(),
  base_name: v.string(),
  name: v.string(),
  number: integer(),
  model: v.lazy(() => UniqueGiftModel),
  symbol: v.lazy(() => UniqueGiftSymbol),
  backdrop: v.lazy(() => UniqueGiftBackdrop),
  is_premium: v.optional(v.boolean()),
  is_burned: v.optional(v.boolean()),
  is_from_blockchain: v.optional(v.boolean()),
  colors: v.optional(v.lazy(() => UniqueGiftColors)),
  publisher_chat: v.optional(v.lazy(() => Chat)),
})

export const GiftInfo: v.GenericSchema<unknown, T.GiftInfo> = v.looseObject({
  gift: v.lazy(() => Gift),
  owned_gift_id: v.optional(v.string()),
  convert_star_count: v.optional(integer()),
  prepaid_upgrade_star_count: v.optional(integer()),
  is_upgrade_separate: v.optional(v.boolean()),
  can_be_upgraded: v.optional(v.boolean()),
  text: v.optional(v.string()),
  entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  is_private: v.optional(v.boolean()),
  unique_gift_number: v.optional(integer()),
})

export const UniqueGiftInfo: v.GenericSchema<unknown, T.UniqueGiftInfo> = v.looseObject({
  gift: v.lazy(() => UniqueGift),
  origin: v.string(),
  text: v.optional(v.string()),
  entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  is_private: v.optional(v.boolean()),
  last_resale_currency: v.optional(v.string()),
  last_resale_amount: v.optional(integer()),
  owned_gift_id: v.optional(v.string()),
  transfer_star_count: v.optional(integer()),
  next_transfer_date: v.optional(integer()),
})

export const OwnedGift: v.GenericSchema<unknown, T.OwnedGift> = v.union([
  v.lazy(() => OwnedGiftRegular),
  v.lazy(() => OwnedGiftUnique),
])

export const OwnedGiftRegular: v.GenericSchema<unknown, T.OwnedGiftRegular> = v.looseObject({
  type: v.picklist(["regular"]),
  gift: v.lazy(() => Gift),
  owned_gift_id: v.optional(v.string()),
  sender_user: v.optional(v.lazy(() => User)),
  send_date: integer(),
  text: v.optional(v.string()),
  entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  is_private: v.optional(v.boolean()),
  is_saved: v.optional(v.boolean()),
  can_be_upgraded: v.optional(v.boolean()),
  was_refunded: v.optional(v.boolean()),
  convert_star_count: v.optional(integer()),
  prepaid_upgrade_star_count: v.optional(integer()),
  is_upgrade_separate: v.optional(v.boolean()),
  unique_gift_number: v.optional(integer()),
})

export const OwnedGiftUnique: v.GenericSchema<unknown, T.OwnedGiftUnique> = v.looseObject({
  type: v.picklist(["unique"]),
  gift: v.lazy(() => UniqueGift),
  owned_gift_id: v.optional(v.string()),
  sender_user: v.optional(v.lazy(() => User)),
  send_date: integer(),
  is_saved: v.optional(v.boolean()),
  can_be_transferred: v.optional(v.boolean()),
  transfer_star_count: v.optional(integer()),
  next_transfer_date: v.optional(integer()),
})

export const OwnedGifts: v.GenericSchema<unknown, T.OwnedGifts> = v.looseObject({
  total_count: integer(),
  gifts: v.array(v.lazy(() => OwnedGift)),
  next_offset: v.optional(v.string()),
})

export const BotAccessSettings: v.GenericSchema<unknown, T.BotAccessSettings> = v.looseObject({
  is_access_restricted: v.boolean(),
  added_users: v.optional(v.array(v.lazy(() => User))),
})

export const AcceptedGiftTypes: v.GenericSchema<unknown, T.AcceptedGiftTypes> = v.looseObject({
  unlimited_gifts: v.boolean(),
  limited_gifts: v.boolean(),
  unique_gifts: v.boolean(),
  premium_subscription: v.boolean(),
  gifts_from_channels: v.boolean(),
})

export const StarAmount: v.GenericSchema<unknown, T.StarAmount> = v.looseObject({
  amount: integer(),
  nanostar_amount: v.optional(integer()),
})

export const BotCommand: v.GenericSchema<unknown, T.BotCommand> = v.looseObject({
  command: v.string(),
  description: v.string(),
  is_ephemeral: v.optional(v.boolean()),
})

export const BotCommandScope: v.GenericSchema<unknown, T.BotCommandScope> = v.union([
  v.lazy(() => BotCommandScopeDefault),
  v.lazy(() => BotCommandScopeAllPrivateChats),
  v.lazy(() => BotCommandScopeAllGroupChats),
  v.lazy(() => BotCommandScopeAllChatAdministrators),
  v.lazy(() => BotCommandScopeChat),
  v.lazy(() => BotCommandScopeChatAdministrators),
  v.lazy(() => BotCommandScopeChatMember),
])

export const BotCommandScopeDefault: v.GenericSchema<unknown, T.BotCommandScopeDefault> = v.looseObject({
  type: v.picklist(["default"]),
})

export const BotCommandScopeAllPrivateChats: v.GenericSchema<unknown, T.BotCommandScopeAllPrivateChats> = v.looseObject(
  {
    type: v.picklist(["all_private_chats"]),
  },
)

export const BotCommandScopeAllGroupChats: v.GenericSchema<unknown, T.BotCommandScopeAllGroupChats> = v.looseObject({
  type: v.picklist(["all_group_chats"]),
})

export const BotCommandScopeAllChatAdministrators: v.GenericSchema<unknown, T.BotCommandScopeAllChatAdministrators> =
  v.looseObject({
    type: v.picklist(["all_chat_administrators"]),
  })

export const BotCommandScopeChat: v.GenericSchema<unknown, T.BotCommandScopeChat> = v.looseObject({
  type: v.picklist(["chat"]),
  chat_id: v.union([int64(), v.string()]),
})

export const BotCommandScopeChatAdministrators: v.GenericSchema<unknown, T.BotCommandScopeChatAdministrators> =
  v.looseObject({
    type: v.picklist(["chat_administrators"]),
    chat_id: v.union([int64(), v.string()]),
  })

export const BotCommandScopeChatMember: v.GenericSchema<unknown, T.BotCommandScopeChatMember> = v.looseObject({
  type: v.picklist(["chat_member"]),
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
})

export const BotName: v.GenericSchema<unknown, T.BotName> = v.looseObject({
  name: v.string(),
})

export const BotDescription: v.GenericSchema<unknown, T.BotDescription> = v.looseObject({
  description: v.string(),
})

export const BotShortDescription: v.GenericSchema<unknown, T.BotShortDescription> = v.looseObject({
  short_description: v.string(),
})

export const MenuButton: v.GenericSchema<unknown, T.MenuButton> = v.union([
  v.lazy(() => MenuButtonCommands),
  v.lazy(() => MenuButtonWebApp),
  v.lazy(() => MenuButtonDefault),
])

export const MenuButtonCommands: v.GenericSchema<unknown, T.MenuButtonCommands> = v.looseObject({
  type: v.picklist(["commands"]),
})

export const MenuButtonWebApp: v.GenericSchema<unknown, T.MenuButtonWebApp> = v.looseObject({
  type: v.picklist(["web_app"]),
  text: v.string(),
  web_app: v.lazy(() => WebAppInfo),
})

export const MenuButtonDefault: v.GenericSchema<unknown, T.MenuButtonDefault> = v.looseObject({
  type: v.picklist(["default"]),
})

export const ChatBoostSource: v.GenericSchema<unknown, T.ChatBoostSource> = v.union([
  v.lazy(() => ChatBoostSourcePremium),
  v.lazy(() => ChatBoostSourceGiftCode),
  v.lazy(() => ChatBoostSourceGiveaway),
])

export const ChatBoostSourcePremium: v.GenericSchema<unknown, T.ChatBoostSourcePremium> = v.looseObject({
  source: v.picklist(["premium"]),
  user: v.lazy(() => User),
})

export const ChatBoostSourceGiftCode: v.GenericSchema<unknown, T.ChatBoostSourceGiftCode> = v.looseObject({
  source: v.picklist(["gift_code"]),
  user: v.lazy(() => User),
})

export const ChatBoostSourceGiveaway: v.GenericSchema<unknown, T.ChatBoostSourceGiveaway> = v.looseObject({
  source: v.picklist(["giveaway"]),
  giveaway_message_id: int64(),
  user: v.optional(v.lazy(() => User)),
  prize_star_count: v.optional(integer()),
  is_unclaimed: v.optional(v.boolean()),
})

export const ChatBoost: v.GenericSchema<unknown, T.ChatBoost> = v.looseObject({
  boost_id: v.string(),
  add_date: integer(),
  expiration_date: integer(),
  source: v.lazy(() => ChatBoostSource),
})

export const ChatBoostUpdated: v.GenericSchema<unknown, T.ChatBoostUpdated> = v.looseObject({
  chat: v.lazy(() => Chat),
  boost: v.lazy(() => ChatBoost),
})

export const ChatBoostRemoved: v.GenericSchema<unknown, T.ChatBoostRemoved> = v.looseObject({
  chat: v.lazy(() => Chat),
  boost_id: v.string(),
  remove_date: integer(),
  source: v.lazy(() => ChatBoostSource),
})

export const ChatOwnerLeft: v.GenericSchema<unknown, T.ChatOwnerLeft> = v.looseObject({
  new_owner: v.optional(v.lazy(() => User)),
})

export const ChatOwnerChanged: v.GenericSchema<unknown, T.ChatOwnerChanged> = v.looseObject({
  new_owner: v.lazy(() => User),
})

export const UserChatBoosts: v.GenericSchema<unknown, T.UserChatBoosts> = v.looseObject({
  boosts: v.array(v.lazy(() => ChatBoost)),
})

export const BusinessBotRights: v.GenericSchema<unknown, T.BusinessBotRights> = v.looseObject({
  can_reply: v.optional(v.boolean()),
  can_read_messages: v.optional(v.boolean()),
  can_delete_sent_messages: v.optional(v.boolean()),
  can_delete_all_messages: v.optional(v.boolean()),
  can_edit_name: v.optional(v.boolean()),
  can_edit_bio: v.optional(v.boolean()),
  can_edit_profile_photo: v.optional(v.boolean()),
  can_edit_username: v.optional(v.boolean()),
  can_change_gift_settings: v.optional(v.boolean()),
  can_view_gifts_and_stars: v.optional(v.boolean()),
  can_convert_gifts_to_stars: v.optional(v.boolean()),
  can_transfer_and_upgrade_gifts: v.optional(v.boolean()),
  can_transfer_stars: v.optional(v.boolean()),
  can_manage_stories: v.optional(v.boolean()),
})

export const BusinessConnection: v.GenericSchema<unknown, T.BusinessConnection> = v.looseObject({
  id: v.string(),
  user: v.lazy(() => User),
  user_chat_id: int64(),
  date: integer(),
  rights: v.optional(v.lazy(() => BusinessBotRights)),
  is_enabled: v.boolean(),
})

export const BusinessMessagesDeleted: v.GenericSchema<unknown, T.BusinessMessagesDeleted> = v.looseObject({
  business_connection_id: v.string(),
  chat: v.lazy(() => Chat),
  message_ids: v.array(integer()),
})

export const SentWebAppMessage: v.GenericSchema<unknown, T.SentWebAppMessage> = v.looseObject({
  inline_message_id: v.optional(v.string()),
})

export const SentGuestMessage: v.GenericSchema<unknown, T.SentGuestMessage> = v.looseObject({
  inline_message_id: v.string(),
})

export const PreparedInlineMessage: v.GenericSchema<unknown, T.PreparedInlineMessage> = v.looseObject({
  id: v.string(),
  expiration_date: integer(),
})

export const PreparedKeyboardButton: v.GenericSchema<unknown, T.PreparedKeyboardButton> = v.looseObject({
  id: v.string(),
})

export const ResponseParameters: v.GenericSchema<unknown, T.ResponseParameters> = v.looseObject({
  migrate_to_chat_id: v.optional(int64()),
  retry_after: v.optional(integer()),
})

export const InputMedia: v.GenericSchema<unknown, T.InputMedia> = v.union([
  v.lazy(() => InputMediaAnimation),
  v.lazy(() => InputMediaAudio),
  v.lazy(() => InputMediaDocument),
  v.lazy(() => InputMediaLivePhoto),
  v.lazy(() => InputMediaPhoto),
  v.lazy(() => InputMediaVideo),
])

export const InputMediaAnimation: v.GenericSchema<unknown, T.InputMediaAnimation> = v.looseObject({
  type: v.picklist(["animation"]),
  media: v.string(),
  thumbnail: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  width: v.optional(integer()),
  height: v.optional(integer()),
  duration: v.optional(integer()),
  has_spoiler: v.optional(v.boolean()),
})

export const InputMediaAudio: v.GenericSchema<unknown, T.InputMediaAudio> = v.looseObject({
  type: v.picklist(["audio"]),
  media: v.string(),
  thumbnail: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  duration: v.optional(integer()),
  performer: v.optional(v.string()),
  title: v.optional(v.string()),
})

export const InputMediaDocument: v.GenericSchema<unknown, T.InputMediaDocument> = v.looseObject({
  type: v.picklist(["document"]),
  media: v.string(),
  thumbnail: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  disable_content_type_detection: v.optional(v.boolean()),
})

export const InputMediaLink: v.GenericSchema<unknown, T.InputMediaLink> = v.looseObject({
  type: v.picklist(["link"]),
  url: v.string(),
})

export const InputMediaLivePhoto: v.GenericSchema<unknown, T.InputMediaLivePhoto> = v.looseObject({
  type: v.picklist(["live_photo"]),
  media: v.string(),
  photo: v.string(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  has_spoiler: v.optional(v.boolean()),
})

export const InputMediaLocation: v.GenericSchema<unknown, T.InputMediaLocation> = v.looseObject({
  type: v.picklist(["location"]),
  latitude: number(),
  longitude: number(),
  horizontal_accuracy: v.optional(number()),
})

export const InputMediaPhoto: v.GenericSchema<unknown, T.InputMediaPhoto> = v.looseObject({
  type: v.picklist(["photo"]),
  media: v.string(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  has_spoiler: v.optional(v.boolean()),
})

export const InputMediaSticker: v.GenericSchema<unknown, T.InputMediaSticker> = v.looseObject({
  type: v.picklist(["sticker"]),
  media: v.string(),
  emoji: v.optional(v.string()),
})

export const InputMediaVenue: v.GenericSchema<unknown, T.InputMediaVenue> = v.looseObject({
  type: v.picklist(["venue"]),
  latitude: number(),
  longitude: number(),
  title: v.string(),
  address: v.string(),
  foursquare_id: v.optional(v.string()),
  foursquare_type: v.optional(v.string()),
  google_place_id: v.optional(v.string()),
  google_place_type: v.optional(v.string()),
})

export const InputMediaVideo: v.GenericSchema<unknown, T.InputMediaVideo> = v.looseObject({
  type: v.picklist(["video"]),
  media: v.string(),
  thumbnail: v.optional(v.string()),
  cover: v.optional(v.string()),
  start_timestamp: v.optional(integer()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  width: v.optional(integer()),
  height: v.optional(integer()),
  duration: v.optional(integer()),
  supports_streaming: v.optional(v.boolean()),
  has_spoiler: v.optional(v.boolean()),
})

export const InputMediaVoiceNote: v.GenericSchema<unknown, T.InputMediaVoiceNote> = v.looseObject({
  type: v.picklist(["voice_note"]),
  media: v.string(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  duration: v.optional(integer()),
})

export const InputFile: v.GenericSchema<unknown, T.InputFile> = v.pipe(v.string(), v.startsWith("attach://"))

export const InputPaidMedia: v.GenericSchema<unknown, T.InputPaidMedia> = v.union([
  v.lazy(() => InputPaidMediaLivePhoto),
  v.lazy(() => InputPaidMediaPhoto),
  v.lazy(() => InputPaidMediaVideo),
])

export const InputPaidMediaLivePhoto: v.GenericSchema<unknown, T.InputPaidMediaLivePhoto> = v.looseObject({
  type: v.picklist(["live_photo"]),
  media: v.string(),
  photo: v.string(),
})

export const InputPaidMediaPhoto: v.GenericSchema<unknown, T.InputPaidMediaPhoto> = v.looseObject({
  type: v.picklist(["photo"]),
  media: v.string(),
})

export const InputPaidMediaVideo: v.GenericSchema<unknown, T.InputPaidMediaVideo> = v.looseObject({
  type: v.picklist(["video"]),
  media: v.string(),
  thumbnail: v.optional(v.string()),
  cover: v.optional(v.string()),
  start_timestamp: v.optional(integer()),
  width: v.optional(integer()),
  height: v.optional(integer()),
  duration: v.optional(integer()),
  supports_streaming: v.optional(v.boolean()),
})

export const InputProfilePhoto: v.GenericSchema<unknown, T.InputProfilePhoto> = v.union([
  v.lazy(() => InputProfilePhotoStatic),
  v.lazy(() => InputProfilePhotoAnimated),
])

export const InputProfilePhotoStatic: v.GenericSchema<unknown, T.InputProfilePhotoStatic> = v.looseObject({
  type: v.picklist(["static"]),
  photo: v.string(),
})

export const InputProfilePhotoAnimated: v.GenericSchema<unknown, T.InputProfilePhotoAnimated> = v.looseObject({
  type: v.picklist(["animated"]),
  animation: v.string(),
  main_frame_timestamp: v.optional(number()),
})

export const InputStoryContent: v.GenericSchema<unknown, T.InputStoryContent> = v.union([
  v.lazy(() => InputStoryContentPhoto),
  v.lazy(() => InputStoryContentVideo),
])

export const InputStoryContentPhoto: v.GenericSchema<unknown, T.InputStoryContentPhoto> = v.looseObject({
  type: v.picklist(["photo"]),
  photo: v.string(),
})

export const InputStoryContentVideo: v.GenericSchema<unknown, T.InputStoryContentVideo> = v.looseObject({
  type: v.picklist(["video"]),
  video: v.string(),
  duration: v.optional(number()),
  cover_frame_timestamp: v.optional(number()),
  is_animation: v.optional(v.boolean()),
})

export const Sticker: v.GenericSchema<unknown, T.Sticker> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  type: v.string(),
  width: integer(),
  height: integer(),
  is_animated: v.boolean(),
  is_video: v.boolean(),
  thumbnail: v.optional(v.lazy(() => PhotoSize)),
  emoji: v.optional(v.string()),
  set_name: v.optional(v.string()),
  premium_animation: v.optional(v.lazy(() => File)),
  mask_position: v.optional(v.lazy(() => MaskPosition)),
  custom_emoji_id: v.optional(v.string()),
  needs_repainting: v.optional(v.boolean()),
  file_size: v.optional(integer()),
})

export const StickerSet: v.GenericSchema<unknown, T.StickerSet> = v.looseObject({
  name: v.string(),
  title: v.string(),
  sticker_type: v.string(),
  stickers: v.array(v.lazy(() => Sticker)),
  thumbnail: v.optional(v.lazy(() => PhotoSize)),
})

export const MaskPosition: v.GenericSchema<unknown, T.MaskPosition> = v.looseObject({
  point: v.string(),
  x_shift: number(),
  y_shift: number(),
  scale: number(),
})

export const InputSticker: v.GenericSchema<unknown, T.InputSticker> = v.looseObject({
  sticker: v.string(),
  format: v.string(),
  emoji_list: v.array(v.string()),
  mask_position: v.optional(v.lazy(() => MaskPosition)),
  keywords: v.optional(v.array(v.string())),
})

export const RichMessage: v.GenericSchema<unknown, T.RichMessage> = v.looseObject({
  blocks: v.array(v.lazy(() => RichBlock)),
  is_rtl: v.optional(v.boolean()),
})

export const InputRichMessage: v.GenericSchema<unknown, T.InputRichMessage> = v.looseObject({
  blocks: v.optional(v.array(v.lazy(() => InputRichBlock))),
  html: v.optional(v.string()),
  markdown: v.optional(v.string()),
  media: v.optional(v.array(v.lazy(() => InputRichMessageMedia))),
  is_rtl: v.optional(v.boolean()),
  skip_entity_detection: v.optional(v.boolean()),
})

export const InputRichMessageMedia: v.GenericSchema<unknown, T.InputRichMessageMedia> = v.looseObject({
  id: v.string(),
  media: v.union([
    v.lazy(() => InputMediaAnimation),
    v.lazy(() => InputMediaAudio),
    v.lazy(() => InputMediaDocument),
    v.lazy(() => InputMediaPhoto),
    v.lazy(() => InputMediaVideo),
    v.lazy(() => InputMediaVoiceNote),
  ]),
})

export const RichMessageButton: v.GenericSchema<unknown, T.RichMessageButton> = v.looseObject({
  text: v.lazy(() => RichText),
  style: v.optional(v.string()),
  url: v.optional(v.string()),
  callback_data: v.optional(v.string()),
  web_app: v.optional(v.lazy(() => WebAppInfo)),
  login_url: v.optional(v.lazy(() => LoginUrl)),
  switch_inline_query: v.optional(v.string()),
  switch_inline_query_current_chat: v.optional(v.string()),
  switch_inline_query_chosen_chat: v.optional(v.lazy(() => SwitchInlineQueryChosenChat)),
  copy_text: v.optional(v.lazy(() => CopyTextButton)),
  disabled: v.optional(v.lazy(() => DisabledButton)),
})

export const RichText: v.GenericSchema<unknown, T.RichText> = v.union([
  v.string(),
  v.array(v.lazy(() => RichText)),
  v.lazy(() => RichTextBold),
  v.lazy(() => RichTextItalic),
  v.lazy(() => RichTextUnderline),
  v.lazy(() => RichTextStrikethrough),
  v.lazy(() => RichTextSpoiler),
  v.lazy(() => RichTextDateTime),
  v.lazy(() => RichTextTextMention),
  v.lazy(() => RichTextSubscript),
  v.lazy(() => RichTextSuperscript),
  v.lazy(() => RichTextMarked),
  v.lazy(() => RichTextCode),
  v.lazy(() => RichTextCustomEmoji),
  v.lazy(() => RichTextMathematicalExpression),
  v.lazy(() => RichTextUrl),
  v.lazy(() => RichTextEmailAddress),
  v.lazy(() => RichTextPhoneNumber),
  v.lazy(() => RichTextBankCardNumber),
  v.lazy(() => RichTextMention),
  v.lazy(() => RichTextHashtag),
  v.lazy(() => RichTextCashtag),
  v.lazy(() => RichTextBotCommand),
  v.lazy(() => RichTextButton),
  v.lazy(() => RichTextAnchor),
  v.lazy(() => RichTextAnchorLink),
  v.lazy(() => RichTextReference),
  v.lazy(() => RichTextReferenceLink),
])

export const RichTextBold: v.GenericSchema<unknown, T.RichTextBold> = v.looseObject({
  type: v.picklist(["bold"]),
  text: v.lazy(() => RichText),
})

export const RichTextItalic: v.GenericSchema<unknown, T.RichTextItalic> = v.looseObject({
  type: v.picklist(["italic"]),
  text: v.lazy(() => RichText),
})

export const RichTextUnderline: v.GenericSchema<unknown, T.RichTextUnderline> = v.looseObject({
  type: v.picklist(["underline"]),
  text: v.lazy(() => RichText),
})

export const RichTextStrikethrough: v.GenericSchema<unknown, T.RichTextStrikethrough> = v.looseObject({
  type: v.picklist(["strikethrough"]),
  text: v.lazy(() => RichText),
})

export const RichTextSpoiler: v.GenericSchema<unknown, T.RichTextSpoiler> = v.looseObject({
  type: v.picklist(["spoiler"]),
  text: v.lazy(() => RichText),
})

export const RichTextDateTime: v.GenericSchema<unknown, T.RichTextDateTime> = v.looseObject({
  type: v.picklist(["date_time"]),
  text: v.lazy(() => RichText),
  unix_time: integer(),
  date_time_format: v.string(),
})

export const RichTextTextMention: v.GenericSchema<unknown, T.RichTextTextMention> = v.looseObject({
  type: v.picklist(["text_mention"]),
  text: v.lazy(() => RichText),
  user: v.lazy(() => User),
})

export const RichTextSubscript: v.GenericSchema<unknown, T.RichTextSubscript> = v.looseObject({
  type: v.picklist(["subscript"]),
  text: v.lazy(() => RichText),
})

export const RichTextSuperscript: v.GenericSchema<unknown, T.RichTextSuperscript> = v.looseObject({
  type: v.picklist(["superscript"]),
  text: v.lazy(() => RichText),
})

export const RichTextMarked: v.GenericSchema<unknown, T.RichTextMarked> = v.looseObject({
  type: v.picklist(["marked"]),
  text: v.lazy(() => RichText),
})

export const RichTextCode: v.GenericSchema<unknown, T.RichTextCode> = v.looseObject({
  type: v.picklist(["code"]),
  text: v.lazy(() => RichText),
})

export const RichTextCustomEmoji: v.GenericSchema<unknown, T.RichTextCustomEmoji> = v.looseObject({
  type: v.picklist(["custom_emoji"]),
  custom_emoji_id: v.string(),
  alternative_text: v.string(),
})

export const RichTextMathematicalExpression: v.GenericSchema<unknown, T.RichTextMathematicalExpression> = v.looseObject(
  {
    type: v.picklist(["mathematical_expression"]),
    expression: v.string(),
  },
)

export const RichTextUrl: v.GenericSchema<unknown, T.RichTextUrl> = v.looseObject({
  type: v.picklist(["url"]),
  text: v.lazy(() => RichText),
  url: v.string(),
})

export const RichTextEmailAddress: v.GenericSchema<unknown, T.RichTextEmailAddress> = v.looseObject({
  type: v.picklist(["email_address"]),
  text: v.lazy(() => RichText),
  email_address: v.string(),
})

export const RichTextPhoneNumber: v.GenericSchema<unknown, T.RichTextPhoneNumber> = v.looseObject({
  type: v.picklist(["phone_number"]),
  text: v.lazy(() => RichText),
  phone_number: v.string(),
})

export const RichTextBankCardNumber: v.GenericSchema<unknown, T.RichTextBankCardNumber> = v.looseObject({
  type: v.picklist(["bank_card_number"]),
  text: v.lazy(() => RichText),
  bank_card_number: v.string(),
})

export const RichTextMention: v.GenericSchema<unknown, T.RichTextMention> = v.looseObject({
  type: v.picklist(["mention"]),
  text: v.lazy(() => RichText),
  username: v.string(),
})

export const RichTextHashtag: v.GenericSchema<unknown, T.RichTextHashtag> = v.looseObject({
  type: v.picklist(["hashtag"]),
  text: v.lazy(() => RichText),
  hashtag: v.string(),
})

export const RichTextCashtag: v.GenericSchema<unknown, T.RichTextCashtag> = v.looseObject({
  type: v.picklist(["cashtag"]),
  text: v.lazy(() => RichText),
  cashtag: v.string(),
})

export const RichTextBotCommand: v.GenericSchema<unknown, T.RichTextBotCommand> = v.looseObject({
  type: v.picklist(["bot_command"]),
  text: v.lazy(() => RichText),
  bot_command: v.string(),
})

export const RichTextButton: v.GenericSchema<unknown, T.RichTextButton> = v.looseObject({
  type: v.picklist(["button"]),
  button: v.lazy(() => RichMessageButton),
})

export const RichTextAnchor: v.GenericSchema<unknown, T.RichTextAnchor> = v.looseObject({
  type: v.picklist(["anchor"]),
  name: v.string(),
})

export const RichTextAnchorLink: v.GenericSchema<unknown, T.RichTextAnchorLink> = v.looseObject({
  type: v.picklist(["anchor_link"]),
  text: v.lazy(() => RichText),
  anchor_name: v.string(),
})

export const RichTextReference: v.GenericSchema<unknown, T.RichTextReference> = v.looseObject({
  type: v.picklist(["reference"]),
  text: v.lazy(() => RichText),
  name: v.string(),
})

export const RichTextReferenceLink: v.GenericSchema<unknown, T.RichTextReferenceLink> = v.looseObject({
  type: v.picklist(["reference_link"]),
  text: v.lazy(() => RichText),
  reference_name: v.string(),
})

export const RichBlockCaption: v.GenericSchema<unknown, T.RichBlockCaption> = v.looseObject({
  text: v.lazy(() => RichText),
  credit: v.optional(v.lazy(() => RichText)),
})

export const RichBlockTableCell: v.GenericSchema<unknown, T.RichBlockTableCell> = v.looseObject({
  text: v.optional(v.lazy(() => RichText)),
  is_header: v.optional(v.boolean()),
  colspan: v.optional(integer()),
  rowspan: v.optional(integer()),
  align: v.string(),
  valign: v.string(),
})

export const RichBlockListItem: v.GenericSchema<unknown, T.RichBlockListItem> = v.looseObject({
  label: v.string(),
  blocks: v.array(v.lazy(() => RichBlock)),
  has_checkbox: v.optional(v.boolean()),
  is_checked: v.optional(v.boolean()),
  value: v.optional(integer()),
  type: v.optional(v.string()),
})

export const RichBlock: v.GenericSchema<unknown, T.RichBlock> = v.union([
  v.lazy(() => RichBlockParagraph),
  v.lazy(() => RichBlockSectionHeading),
  v.lazy(() => RichBlockPreformatted),
  v.lazy(() => RichBlockFooter),
  v.lazy(() => RichBlockDivider),
  v.lazy(() => RichBlockMathematicalExpression),
  v.lazy(() => RichBlockAnchor),
  v.lazy(() => RichBlockList),
  v.lazy(() => RichBlockBlockQuotation),
  v.lazy(() => RichBlockExpandableBlockQuotation),
  v.lazy(() => RichBlockPullQuotation),
  v.lazy(() => RichBlockCollage),
  v.lazy(() => RichBlockSlideshow),
  v.lazy(() => RichBlockTable),
  v.lazy(() => RichBlockDetails),
  v.lazy(() => RichBlockMap),
  v.lazy(() => RichBlockButtons),
  v.lazy(() => RichBlockAnimation),
  v.lazy(() => RichBlockAudio),
  v.lazy(() => RichBlockDocument),
  v.lazy(() => RichBlockPhoto),
  v.lazy(() => RichBlockVideo),
  v.lazy(() => RichBlockVoiceNote),
  v.lazy(() => RichBlockThinking),
])

export const RichBlockParagraph: v.GenericSchema<unknown, T.RichBlockParagraph> = v.looseObject({
  type: v.picklist(["paragraph"]),
  text: v.lazy(() => RichText),
})

export const RichBlockSectionHeading: v.GenericSchema<unknown, T.RichBlockSectionHeading> = v.looseObject({
  type: v.picklist(["heading"]),
  text: v.lazy(() => RichText),
  size: integer(),
})

export const RichBlockPreformatted: v.GenericSchema<unknown, T.RichBlockPreformatted> = v.looseObject({
  type: v.picklist(["pre"]),
  text: v.lazy(() => RichText),
  language: v.optional(v.string()),
})

export const RichBlockFooter: v.GenericSchema<unknown, T.RichBlockFooter> = v.looseObject({
  type: v.picklist(["footer"]),
  text: v.lazy(() => RichText),
})

export const RichBlockDivider: v.GenericSchema<unknown, T.RichBlockDivider> = v.looseObject({
  type: v.picklist(["divider"]),
})

export const RichBlockMathematicalExpression: v.GenericSchema<unknown, T.RichBlockMathematicalExpression> =
  v.looseObject({
    type: v.picklist(["mathematical_expression"]),
    expression: v.string(),
  })

export const RichBlockAnchor: v.GenericSchema<unknown, T.RichBlockAnchor> = v.looseObject({
  type: v.picklist(["anchor"]),
  name: v.string(),
})

export const RichBlockList: v.GenericSchema<unknown, T.RichBlockList> = v.looseObject({
  type: v.picklist(["list"]),
  items: v.array(v.lazy(() => RichBlockListItem)),
})

export const RichBlockBlockQuotation: v.GenericSchema<unknown, T.RichBlockBlockQuotation> = v.looseObject({
  type: v.picklist(["blockquote"]),
  blocks: v.array(v.lazy(() => RichBlock)),
  credit: v.optional(v.lazy(() => RichText)),
})

export const RichBlockExpandableBlockQuotation: v.GenericSchema<unknown, T.RichBlockExpandableBlockQuotation> =
  v.looseObject({
    type: v.picklist(["expandable_blockquote"]),
    text: v.lazy(() => RichText),
    credit: v.optional(v.lazy(() => RichText)),
  })

export const RichBlockPullQuotation: v.GenericSchema<unknown, T.RichBlockPullQuotation> = v.looseObject({
  type: v.picklist(["pullquote"]),
  text: v.lazy(() => RichText),
  credit: v.optional(v.lazy(() => RichText)),
})

export const RichBlockCollage: v.GenericSchema<unknown, T.RichBlockCollage> = v.looseObject({
  type: v.picklist(["collage"]),
  blocks: v.array(v.lazy(() => RichBlock)),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const RichBlockSlideshow: v.GenericSchema<unknown, T.RichBlockSlideshow> = v.looseObject({
  type: v.picklist(["slideshow"]),
  blocks: v.array(v.lazy(() => RichBlock)),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const RichBlockTable: v.GenericSchema<unknown, T.RichBlockTable> = v.looseObject({
  type: v.picklist(["table"]),
  cells: v.array(v.array(v.lazy(() => RichBlockTableCell))),
  is_bordered: v.optional(v.boolean()),
  is_striped: v.optional(v.boolean()),
  is_compact: v.optional(v.boolean()),
  caption: v.optional(v.lazy(() => RichText)),
})

export const RichBlockDetails: v.GenericSchema<unknown, T.RichBlockDetails> = v.looseObject({
  type: v.picklist(["details"]),
  summary: v.lazy(() => RichText),
  blocks: v.array(v.lazy(() => RichBlock)),
  is_open: v.optional(v.boolean()),
})

export const RichBlockMap: v.GenericSchema<unknown, T.RichBlockMap> = v.looseObject({
  type: v.picklist(["map"]),
  location: v.lazy(() => Location),
  zoom: integer(),
  width: integer(),
  height: integer(),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const RichBlockButtons: v.GenericSchema<unknown, T.RichBlockButtons> = v.looseObject({
  type: v.picklist(["buttons"]),
  buttons: v.array(v.lazy(() => RichMessageButton)),
  align: v.optional(v.string()),
})

export const RichBlockAnimation: v.GenericSchema<unknown, T.RichBlockAnimation> = v.looseObject({
  type: v.picklist(["animation"]),
  animation: v.lazy(() => Animation),
  has_spoiler: v.optional(v.boolean()),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const RichBlockAudio: v.GenericSchema<unknown, T.RichBlockAudio> = v.looseObject({
  type: v.picklist(["audio"]),
  audio: v.lazy(() => Audio),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const RichBlockDocument: v.GenericSchema<unknown, T.RichBlockDocument> = v.looseObject({
  type: v.picklist(["document"]),
  document: v.lazy(() => Document),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const RichBlockPhoto: v.GenericSchema<unknown, T.RichBlockPhoto> = v.looseObject({
  type: v.picklist(["photo"]),
  photo: v.array(v.lazy(() => PhotoSize)),
  has_spoiler: v.optional(v.boolean()),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const RichBlockVideo: v.GenericSchema<unknown, T.RichBlockVideo> = v.looseObject({
  type: v.picklist(["video"]),
  video: v.lazy(() => Video),
  has_spoiler: v.optional(v.boolean()),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const RichBlockVoiceNote: v.GenericSchema<unknown, T.RichBlockVoiceNote> = v.looseObject({
  type: v.picklist(["voice_note"]),
  voice_note: v.lazy(() => Voice),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const RichBlockThinking: v.GenericSchema<unknown, T.RichBlockThinking> = v.looseObject({
  type: v.picklist(["thinking"]),
  text: v.lazy(() => RichText),
})

export const InputRichBlockListItem: v.GenericSchema<unknown, T.InputRichBlockListItem> = v.looseObject({
  blocks: v.array(v.lazy(() => InputRichBlock)),
  has_checkbox: v.optional(v.boolean()),
  is_checked: v.optional(v.boolean()),
  value: v.optional(integer()),
  type: v.optional(v.string()),
})

export const InputRichBlock: v.GenericSchema<unknown, T.InputRichBlock> = v.union([
  v.lazy(() => InputRichBlockParagraph),
  v.lazy(() => InputRichBlockSectionHeading),
  v.lazy(() => InputRichBlockPreformatted),
  v.lazy(() => InputRichBlockFooter),
  v.lazy(() => InputRichBlockDivider),
  v.lazy(() => InputRichBlockMathematicalExpression),
  v.lazy(() => InputRichBlockAnchor),
  v.lazy(() => InputRichBlockList),
  v.lazy(() => InputRichBlockBlockQuotation),
  v.lazy(() => InputRichBlockExpandableBlockQuotation),
  v.lazy(() => InputRichBlockPullQuotation),
  v.lazy(() => InputRichBlockCollage),
  v.lazy(() => InputRichBlockSlideshow),
  v.lazy(() => InputRichBlockTable),
  v.lazy(() => InputRichBlockDetails),
  v.lazy(() => InputRichBlockMap),
  v.lazy(() => InputRichBlockButtons),
  v.lazy(() => InputRichBlockAnimation),
  v.lazy(() => InputRichBlockAudio),
  v.lazy(() => InputRichBlockDocument),
  v.lazy(() => InputRichBlockPhoto),
  v.lazy(() => InputRichBlockVideo),
  v.lazy(() => InputRichBlockVoiceNote),
  v.lazy(() => InputRichBlockThinking),
])

export const InputRichBlockParagraph: v.GenericSchema<unknown, T.InputRichBlockParagraph> = v.looseObject({
  type: v.picklist(["paragraph"]),
  text: v.lazy(() => RichText),
})

export const InputRichBlockSectionHeading: v.GenericSchema<unknown, T.InputRichBlockSectionHeading> = v.looseObject({
  type: v.picklist(["heading"]),
  text: v.lazy(() => RichText),
  size: integer(),
})

export const InputRichBlockPreformatted: v.GenericSchema<unknown, T.InputRichBlockPreformatted> = v.looseObject({
  type: v.picklist(["pre"]),
  text: v.lazy(() => RichText),
  language: v.optional(v.string()),
})

export const InputRichBlockFooter: v.GenericSchema<unknown, T.InputRichBlockFooter> = v.looseObject({
  type: v.picklist(["footer"]),
  text: v.lazy(() => RichText),
})

export const InputRichBlockDivider: v.GenericSchema<unknown, T.InputRichBlockDivider> = v.looseObject({
  type: v.picklist(["divider"]),
})

export const InputRichBlockMathematicalExpression: v.GenericSchema<unknown, T.InputRichBlockMathematicalExpression> =
  v.looseObject({
    type: v.picklist(["mathematical_expression"]),
    expression: v.string(),
  })

export const InputRichBlockAnchor: v.GenericSchema<unknown, T.InputRichBlockAnchor> = v.looseObject({
  type: v.picklist(["anchor"]),
  name: v.string(),
})

export const InputRichBlockList: v.GenericSchema<unknown, T.InputRichBlockList> = v.looseObject({
  type: v.picklist(["list"]),
  items: v.array(v.lazy(() => InputRichBlockListItem)),
})

export const InputRichBlockBlockQuotation: v.GenericSchema<unknown, T.InputRichBlockBlockQuotation> = v.looseObject({
  type: v.picklist(["blockquote"]),
  blocks: v.array(v.lazy(() => InputRichBlock)),
  credit: v.optional(v.lazy(() => RichText)),
})

export const InputRichBlockExpandableBlockQuotation: v.GenericSchema<
  unknown,
  T.InputRichBlockExpandableBlockQuotation
> = v.looseObject({
  type: v.picklist(["expandable_blockquote"]),
  text: v.lazy(() => RichText),
  credit: v.optional(v.lazy(() => RichText)),
})

export const InputRichBlockPullQuotation: v.GenericSchema<unknown, T.InputRichBlockPullQuotation> = v.looseObject({
  type: v.picklist(["pullquote"]),
  text: v.lazy(() => RichText),
  credit: v.optional(v.lazy(() => RichText)),
})

export const InputRichBlockCollage: v.GenericSchema<unknown, T.InputRichBlockCollage> = v.looseObject({
  type: v.picklist(["collage"]),
  blocks: v.array(v.lazy(() => InputRichBlock)),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const InputRichBlockSlideshow: v.GenericSchema<unknown, T.InputRichBlockSlideshow> = v.looseObject({
  type: v.picklist(["slideshow"]),
  blocks: v.array(v.lazy(() => InputRichBlock)),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const InputRichBlockTable: v.GenericSchema<unknown, T.InputRichBlockTable> = v.looseObject({
  type: v.picklist(["table"]),
  cells: v.array(v.array(v.lazy(() => RichBlockTableCell))),
  is_bordered: v.optional(v.boolean()),
  is_striped: v.optional(v.boolean()),
  is_compact: v.optional(v.boolean()),
  caption: v.optional(v.lazy(() => RichText)),
})

export const InputRichBlockDetails: v.GenericSchema<unknown, T.InputRichBlockDetails> = v.looseObject({
  type: v.picklist(["details"]),
  summary: v.lazy(() => RichText),
  blocks: v.array(v.lazy(() => InputRichBlock)),
  is_open: v.optional(v.boolean()),
})

export const InputRichBlockMap: v.GenericSchema<unknown, T.InputRichBlockMap> = v.looseObject({
  type: v.picklist(["map"]),
  location: v.lazy(() => Location),
  zoom: v.optional(integer()),
  width: v.optional(integer()),
  height: v.optional(integer()),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const InputRichBlockButtons: v.GenericSchema<unknown, T.InputRichBlockButtons> = v.looseObject({
  type: v.picklist(["buttons"]),
  buttons: v.array(v.lazy(() => RichMessageButton)),
  align: v.optional(v.string()),
})

export const InputRichBlockAnimation: v.GenericSchema<unknown, T.InputRichBlockAnimation> = v.looseObject({
  type: v.picklist(["animation"]),
  animation: v.lazy(() => InputMediaAnimation),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const InputRichBlockAudio: v.GenericSchema<unknown, T.InputRichBlockAudio> = v.looseObject({
  type: v.picklist(["audio"]),
  audio: v.lazy(() => InputMediaAudio),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const InputRichBlockDocument: v.GenericSchema<unknown, T.InputRichBlockDocument> = v.looseObject({
  type: v.picklist(["document"]),
  document: v.lazy(() => InputMediaDocument),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const InputRichBlockPhoto: v.GenericSchema<unknown, T.InputRichBlockPhoto> = v.looseObject({
  type: v.picklist(["photo"]),
  photo: v.lazy(() => InputMediaPhoto),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const InputRichBlockVideo: v.GenericSchema<unknown, T.InputRichBlockVideo> = v.looseObject({
  type: v.picklist(["video"]),
  video: v.lazy(() => InputMediaVideo),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const InputRichBlockVoiceNote: v.GenericSchema<unknown, T.InputRichBlockVoiceNote> = v.looseObject({
  type: v.picklist(["voice_note"]),
  voice_note: v.lazy(() => InputMediaVoiceNote),
  caption: v.optional(v.lazy(() => RichBlockCaption)),
})

export const InputRichBlockThinking: v.GenericSchema<unknown, T.InputRichBlockThinking> = v.looseObject({
  type: v.picklist(["thinking"]),
  text: v.lazy(() => RichText),
})

export const InlineQuery: v.GenericSchema<unknown, T.InlineQuery> = v.looseObject({
  id: v.string(),
  from: v.lazy(() => User),
  query: v.string(),
  offset: v.string(),
  chat_type: v.optional(v.string()),
  location: v.optional(v.lazy(() => Location)),
})

export const InlineQueryResultsButton: v.GenericSchema<unknown, T.InlineQueryResultsButton> = v.looseObject({
  text: v.string(),
  web_app: v.optional(v.lazy(() => WebAppInfo)),
  start_parameter: v.optional(v.string()),
})

export const InlineQueryResult: v.GenericSchema<unknown, T.InlineQueryResult> = v.union([
  v.lazy(() => InlineQueryResultCachedAudio),
  v.lazy(() => InlineQueryResultCachedDocument),
  v.lazy(() => InlineQueryResultCachedGif),
  v.lazy(() => InlineQueryResultCachedMpeg4Gif),
  v.lazy(() => InlineQueryResultCachedPhoto),
  v.lazy(() => InlineQueryResultCachedSticker),
  v.lazy(() => InlineQueryResultCachedVideo),
  v.lazy(() => InlineQueryResultCachedVoice),
  v.lazy(() => InlineQueryResultArticle),
  v.lazy(() => InlineQueryResultAudio),
  v.lazy(() => InlineQueryResultContact),
  v.lazy(() => InlineQueryResultGame),
  v.lazy(() => InlineQueryResultDocument),
  v.lazy(() => InlineQueryResultGif),
  v.lazy(() => InlineQueryResultLocation),
  v.lazy(() => InlineQueryResultMpeg4Gif),
  v.lazy(() => InlineQueryResultPhoto),
  v.lazy(() => InlineQueryResultVenue),
  v.lazy(() => InlineQueryResultVideo),
  v.lazy(() => InlineQueryResultVoice),
])

export const InlineQueryResultArticle: v.GenericSchema<unknown, T.InlineQueryResultArticle> = v.looseObject({
  type: v.picklist(["article"]),
  id: v.string(),
  title: v.string(),
  input_message_content: v.lazy(() => InputMessageContent),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  url: v.optional(v.string()),
  description: v.optional(v.string()),
  thumbnail_url: v.optional(v.string()),
  thumbnail_width: v.optional(integer()),
  thumbnail_height: v.optional(integer()),
})

export const InlineQueryResultPhoto: v.GenericSchema<unknown, T.InlineQueryResultPhoto> = v.looseObject({
  type: v.picklist(["photo"]),
  id: v.string(),
  photo_url: v.string(),
  thumbnail_url: v.string(),
  photo_width: v.optional(integer()),
  photo_height: v.optional(integer()),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultGif: v.GenericSchema<unknown, T.InlineQueryResultGif> = v.looseObject({
  type: v.picklist(["gif"]),
  id: v.string(),
  gif_url: v.string(),
  gif_width: v.optional(integer()),
  gif_height: v.optional(integer()),
  gif_duration: v.optional(integer()),
  thumbnail_url: v.string(),
  thumbnail_mime_type: v.optional(v.string()),
  title: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultMpeg4Gif: v.GenericSchema<unknown, T.InlineQueryResultMpeg4Gif> = v.looseObject({
  type: v.string(),
  id: v.string(),
  mpeg4_url: v.string(),
  mpeg4_width: v.optional(integer()),
  mpeg4_height: v.optional(integer()),
  mpeg4_duration: v.optional(integer()),
  thumbnail_url: v.string(),
  thumbnail_mime_type: v.optional(v.string()),
  title: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultVideo: v.GenericSchema<unknown, T.InlineQueryResultVideo> = v.looseObject({
  type: v.picklist(["video"]),
  id: v.string(),
  video_url: v.string(),
  mime_type: v.string(),
  thumbnail_url: v.string(),
  title: v.string(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  video_width: v.optional(integer()),
  video_height: v.optional(integer()),
  video_duration: v.optional(integer()),
  description: v.optional(v.string()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultAudio: v.GenericSchema<unknown, T.InlineQueryResultAudio> = v.looseObject({
  type: v.picklist(["audio"]),
  id: v.string(),
  audio_url: v.string(),
  title: v.string(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  performer: v.optional(v.string()),
  audio_duration: v.optional(integer()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultVoice: v.GenericSchema<unknown, T.InlineQueryResultVoice> = v.looseObject({
  type: v.picklist(["voice"]),
  id: v.string(),
  voice_url: v.string(),
  title: v.string(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  voice_duration: v.optional(integer()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultDocument: v.GenericSchema<unknown, T.InlineQueryResultDocument> = v.looseObject({
  type: v.picklist(["document"]),
  id: v.string(),
  title: v.string(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  document_url: v.string(),
  mime_type: v.string(),
  description: v.optional(v.string()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
  thumbnail_url: v.optional(v.string()),
  thumbnail_width: v.optional(integer()),
  thumbnail_height: v.optional(integer()),
})

export const InlineQueryResultLocation: v.GenericSchema<unknown, T.InlineQueryResultLocation> = v.looseObject({
  type: v.picklist(["location"]),
  id: v.string(),
  latitude: number(),
  longitude: number(),
  title: v.string(),
  horizontal_accuracy: v.optional(number()),
  live_period: v.optional(integer()),
  heading: v.optional(integer()),
  proximity_alert_radius: v.optional(integer()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
  thumbnail_url: v.optional(v.string()),
  thumbnail_width: v.optional(integer()),
  thumbnail_height: v.optional(integer()),
})

export const InlineQueryResultVenue: v.GenericSchema<unknown, T.InlineQueryResultVenue> = v.looseObject({
  type: v.picklist(["venue"]),
  id: v.string(),
  latitude: number(),
  longitude: number(),
  title: v.string(),
  address: v.string(),
  foursquare_id: v.optional(v.string()),
  foursquare_type: v.optional(v.string()),
  google_place_id: v.optional(v.string()),
  google_place_type: v.optional(v.string()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
  thumbnail_url: v.optional(v.string()),
  thumbnail_width: v.optional(integer()),
  thumbnail_height: v.optional(integer()),
})

export const InlineQueryResultContact: v.GenericSchema<unknown, T.InlineQueryResultContact> = v.looseObject({
  type: v.picklist(["contact"]),
  id: v.string(),
  phone_number: v.string(),
  first_name: v.string(),
  last_name: v.optional(v.string()),
  vcard: v.optional(v.string()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
  thumbnail_url: v.optional(v.string()),
  thumbnail_width: v.optional(integer()),
  thumbnail_height: v.optional(integer()),
})

export const InlineQueryResultGame: v.GenericSchema<unknown, T.InlineQueryResultGame> = v.looseObject({
  type: v.picklist(["game"]),
  id: v.string(),
  game_short_name: v.string(),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const InlineQueryResultCachedPhoto: v.GenericSchema<unknown, T.InlineQueryResultCachedPhoto> = v.looseObject({
  type: v.picklist(["photo"]),
  id: v.string(),
  photo_file_id: v.string(),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultCachedGif: v.GenericSchema<unknown, T.InlineQueryResultCachedGif> = v.looseObject({
  type: v.picklist(["gif"]),
  id: v.string(),
  gif_file_id: v.string(),
  title: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultCachedMpeg4Gif: v.GenericSchema<unknown, T.InlineQueryResultCachedMpeg4Gif> =
  v.looseObject({
    type: v.string(),
    id: v.string(),
    mpeg4_file_id: v.string(),
    title: v.optional(v.string()),
    caption: v.optional(v.string()),
    parse_mode: v.optional(v.string()),
    caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
    show_caption_above_media: v.optional(v.boolean()),
    reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
    input_message_content: v.optional(v.lazy(() => InputMessageContent)),
  })

export const InlineQueryResultCachedSticker: v.GenericSchema<unknown, T.InlineQueryResultCachedSticker> = v.looseObject(
  {
    type: v.picklist(["sticker"]),
    id: v.string(),
    sticker_file_id: v.string(),
    reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
    input_message_content: v.optional(v.lazy(() => InputMessageContent)),
  },
)

export const InlineQueryResultCachedDocument: v.GenericSchema<unknown, T.InlineQueryResultCachedDocument> =
  v.looseObject({
    type: v.picklist(["document"]),
    id: v.string(),
    title: v.string(),
    document_file_id: v.string(),
    description: v.optional(v.string()),
    caption: v.optional(v.string()),
    parse_mode: v.optional(v.string()),
    caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
    reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
    input_message_content: v.optional(v.lazy(() => InputMessageContent)),
  })

export const InlineQueryResultCachedVideo: v.GenericSchema<unknown, T.InlineQueryResultCachedVideo> = v.looseObject({
  type: v.picklist(["video"]),
  id: v.string(),
  video_file_id: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultCachedVoice: v.GenericSchema<unknown, T.InlineQueryResultCachedVoice> = v.looseObject({
  type: v.picklist(["voice"]),
  id: v.string(),
  voice_file_id: v.string(),
  title: v.string(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InlineQueryResultCachedAudio: v.GenericSchema<unknown, T.InlineQueryResultCachedAudio> = v.looseObject({
  type: v.picklist(["audio"]),
  id: v.string(),
  audio_file_id: v.string(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  input_message_content: v.optional(v.lazy(() => InputMessageContent)),
})

export const InputMessageContent: v.GenericSchema<unknown, T.InputMessageContent> = v.union([
  v.lazy(() => InputTextMessageContent),
  v.lazy(() => InputRichMessageContent),
  v.lazy(() => InputLocationMessageContent),
  v.lazy(() => InputVenueMessageContent),
  v.lazy(() => InputContactMessageContent),
  v.lazy(() => InputInvoiceMessageContent),
])

export const InputTextMessageContent: v.GenericSchema<unknown, T.InputTextMessageContent> = v.looseObject({
  message_text: v.string(),
  parse_mode: v.optional(v.string()),
  entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  link_preview_options: v.optional(v.lazy(() => LinkPreviewOptions)),
})

export const InputRichMessageContent: v.GenericSchema<unknown, T.InputRichMessageContent> = v.looseObject({
  rich_message: v.lazy(() => InputRichMessage),
})

export const InputLocationMessageContent: v.GenericSchema<unknown, T.InputLocationMessageContent> = v.looseObject({
  latitude: number(),
  longitude: number(),
  horizontal_accuracy: v.optional(number()),
  live_period: v.optional(integer()),
  heading: v.optional(integer()),
  proximity_alert_radius: v.optional(integer()),
})

export const InputVenueMessageContent: v.GenericSchema<unknown, T.InputVenueMessageContent> = v.looseObject({
  latitude: number(),
  longitude: number(),
  title: v.string(),
  address: v.string(),
  foursquare_id: v.optional(v.string()),
  foursquare_type: v.optional(v.string()),
  google_place_id: v.optional(v.string()),
  google_place_type: v.optional(v.string()),
})

export const InputContactMessageContent: v.GenericSchema<unknown, T.InputContactMessageContent> = v.looseObject({
  phone_number: v.string(),
  first_name: v.string(),
  last_name: v.optional(v.string()),
  vcard: v.optional(v.string()),
})

export const InputInvoiceMessageContent: v.GenericSchema<unknown, T.InputInvoiceMessageContent> = v.looseObject({
  title: v.string(),
  description: v.string(),
  payload: v.string(),
  provider_token: v.optional(v.string()),
  currency: v.string(),
  prices: v.array(v.lazy(() => LabeledPrice)),
  max_tip_amount: v.optional(integer()),
  suggested_tip_amounts: v.optional(v.array(integer())),
  provider_data: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  photo_size: v.optional(integer()),
  photo_width: v.optional(integer()),
  photo_height: v.optional(integer()),
  need_name: v.optional(v.boolean()),
  need_phone_number: v.optional(v.boolean()),
  need_email: v.optional(v.boolean()),
  need_shipping_address: v.optional(v.boolean()),
  send_phone_number_to_provider: v.optional(v.boolean()),
  send_email_to_provider: v.optional(v.boolean()),
  is_flexible: v.optional(v.boolean()),
})

export const ChosenInlineResult: v.GenericSchema<unknown, T.ChosenInlineResult> = v.looseObject({
  result_id: v.string(),
  from: v.lazy(() => User),
  location: v.optional(v.lazy(() => Location)),
  inline_message_id: v.optional(v.string()),
  query: v.string(),
})

export const LabeledPrice: v.GenericSchema<unknown, T.LabeledPrice> = v.looseObject({
  label: v.string(),
  amount: integer(),
})

export const Invoice: v.GenericSchema<unknown, T.Invoice> = v.looseObject({
  title: v.string(),
  description: v.string(),
  start_parameter: v.string(),
  currency: v.string(),
  total_amount: integer(),
})

export const ShippingAddress: v.GenericSchema<unknown, T.ShippingAddress> = v.looseObject({
  country_code: v.string(),
  state: v.string(),
  city: v.string(),
  street_line1: v.string(),
  street_line2: v.string(),
  post_code: v.string(),
})

export const OrderInfo: v.GenericSchema<unknown, T.OrderInfo> = v.looseObject({
  name: v.optional(v.string()),
  phone_number: v.optional(v.string()),
  email: v.optional(v.string()),
  shipping_address: v.optional(v.lazy(() => ShippingAddress)),
})

export const ShippingOption: v.GenericSchema<unknown, T.ShippingOption> = v.looseObject({
  id: v.string(),
  title: v.string(),
  prices: v.array(v.lazy(() => LabeledPrice)),
})

export const SuccessfulPayment: v.GenericSchema<unknown, T.SuccessfulPayment> = v.looseObject({
  currency: v.string(),
  total_amount: integer(),
  invoice_payload: v.string(),
  subscription_expiration_date: v.optional(integer()),
  is_recurring: v.optional(v.boolean()),
  is_first_recurring: v.optional(v.boolean()),
  shipping_option_id: v.optional(v.string()),
  order_info: v.optional(v.lazy(() => OrderInfo)),
  telegram_payment_charge_id: v.string(),
  provider_payment_charge_id: v.string(),
})

export const RefundedPayment: v.GenericSchema<unknown, T.RefundedPayment> = v.looseObject({
  currency: v.string(),
  total_amount: integer(),
  invoice_payload: v.string(),
  telegram_payment_charge_id: v.string(),
  provider_payment_charge_id: v.optional(v.string()),
})

export const ShippingQuery: v.GenericSchema<unknown, T.ShippingQuery> = v.looseObject({
  id: v.string(),
  from: v.lazy(() => User),
  invoice_payload: v.string(),
  shipping_address: v.lazy(() => ShippingAddress),
})

export const PreCheckoutQuery: v.GenericSchema<unknown, T.PreCheckoutQuery> = v.looseObject({
  id: v.string(),
  from: v.lazy(() => User),
  currency: v.string(),
  total_amount: integer(),
  invoice_payload: v.string(),
  shipping_option_id: v.optional(v.string()),
  order_info: v.optional(v.lazy(() => OrderInfo)),
})

export const PaidMediaPurchased: v.GenericSchema<unknown, T.PaidMediaPurchased> = v.looseObject({
  from: v.lazy(() => User),
  paid_media_payload: v.string(),
})

export const RevenueWithdrawalState: v.GenericSchema<unknown, T.RevenueWithdrawalState> = v.union([
  v.lazy(() => RevenueWithdrawalStatePending),
  v.lazy(() => RevenueWithdrawalStateSucceeded),
  v.lazy(() => RevenueWithdrawalStateFailed),
])

export const RevenueWithdrawalStatePending: v.GenericSchema<unknown, T.RevenueWithdrawalStatePending> = v.looseObject({
  type: v.picklist(["pending"]),
})

export const RevenueWithdrawalStateSucceeded: v.GenericSchema<unknown, T.RevenueWithdrawalStateSucceeded> =
  v.looseObject({
    type: v.picklist(["succeeded"]),
    date: integer(),
    url: v.string(),
  })

export const RevenueWithdrawalStateFailed: v.GenericSchema<unknown, T.RevenueWithdrawalStateFailed> = v.looseObject({
  type: v.picklist(["failed"]),
})

export const AffiliateInfo: v.GenericSchema<unknown, T.AffiliateInfo> = v.looseObject({
  affiliate_user: v.optional(v.lazy(() => User)),
  affiliate_chat: v.optional(v.lazy(() => Chat)),
  commission_per_mille: integer(),
  amount: integer(),
  nanostar_amount: v.optional(integer()),
})

export const TransactionPartner: v.GenericSchema<unknown, T.TransactionPartner> = v.union([
  v.lazy(() => TransactionPartnerUser),
  v.lazy(() => TransactionPartnerChat),
  v.lazy(() => TransactionPartnerAffiliateProgram),
  v.lazy(() => TransactionPartnerFragment),
  v.lazy(() => TransactionPartnerTelegramAds),
  v.lazy(() => TransactionPartnerTelegramApi),
  v.lazy(() => TransactionPartnerOther),
])

export const TransactionPartnerUser: v.GenericSchema<unknown, T.TransactionPartnerUser> = v.looseObject({
  type: v.picklist(["user"]),
  transaction_type: v.string(),
  user: v.lazy(() => User),
  affiliate: v.optional(v.lazy(() => AffiliateInfo)),
  invoice_payload: v.optional(v.string()),
  subscription_period: v.optional(integer()),
  paid_media: v.optional(v.array(v.lazy(() => PaidMedia))),
  paid_media_payload: v.optional(v.string()),
  gift: v.optional(v.lazy(() => Gift)),
  premium_subscription_duration: v.optional(integer()),
})

export const TransactionPartnerChat: v.GenericSchema<unknown, T.TransactionPartnerChat> = v.looseObject({
  type: v.picklist(["chat"]),
  chat: v.lazy(() => Chat),
  gift: v.optional(v.lazy(() => Gift)),
})

export const TransactionPartnerAffiliateProgram: v.GenericSchema<unknown, T.TransactionPartnerAffiliateProgram> =
  v.looseObject({
    type: v.picklist(["affiliate_program"]),
    sponsor_user: v.optional(v.lazy(() => User)),
    commission_per_mille: integer(),
  })

export const TransactionPartnerFragment: v.GenericSchema<unknown, T.TransactionPartnerFragment> = v.looseObject({
  type: v.picklist(["fragment"]),
  withdrawal_state: v.optional(v.lazy(() => RevenueWithdrawalState)),
})

export const TransactionPartnerTelegramAds: v.GenericSchema<unknown, T.TransactionPartnerTelegramAds> = v.looseObject({
  type: v.picklist(["telegram_ads"]),
})

export const TransactionPartnerTelegramApi: v.GenericSchema<unknown, T.TransactionPartnerTelegramApi> = v.looseObject({
  type: v.picklist(["telegram_api"]),
  request_count: integer(),
})

export const TransactionPartnerOther: v.GenericSchema<unknown, T.TransactionPartnerOther> = v.looseObject({
  type: v.picklist(["other"]),
})

export const StarTransaction: v.GenericSchema<unknown, T.StarTransaction> = v.looseObject({
  id: v.string(),
  amount: integer(),
  nanostar_amount: v.optional(integer()),
  date: integer(),
  source: v.optional(v.lazy(() => TransactionPartner)),
  receiver: v.optional(v.lazy(() => TransactionPartner)),
})

export const StarTransactions: v.GenericSchema<unknown, T.StarTransactions> = v.looseObject({
  transactions: v.array(v.lazy(() => StarTransaction)),
})

export const PassportData: v.GenericSchema<unknown, T.PassportData> = v.looseObject({
  data: v.array(v.lazy(() => EncryptedPassportElement)),
  credentials: v.lazy(() => EncryptedCredentials),
})

export const PassportFile: v.GenericSchema<unknown, T.PassportFile> = v.looseObject({
  file_id: v.string(),
  file_unique_id: v.string(),
  file_size: integer(),
  file_date: integer(),
})

export const EncryptedPassportElement: v.GenericSchema<unknown, T.EncryptedPassportElement> = v.looseObject({
  type: v.string(),
  data: v.optional(v.string()),
  phone_number: v.optional(v.string()),
  email: v.optional(v.string()),
  files: v.optional(v.array(v.lazy(() => PassportFile))),
  front_side: v.optional(v.lazy(() => PassportFile)),
  reverse_side: v.optional(v.lazy(() => PassportFile)),
  selfie: v.optional(v.lazy(() => PassportFile)),
  translation: v.optional(v.array(v.lazy(() => PassportFile))),
  hash: v.string(),
})

export const EncryptedCredentials: v.GenericSchema<unknown, T.EncryptedCredentials> = v.looseObject({
  data: v.string(),
  hash: v.string(),
  secret: v.string(),
})

export const PassportElementError: v.GenericSchema<unknown, T.PassportElementError> = v.union([
  v.lazy(() => PassportElementErrorDataField),
  v.lazy(() => PassportElementErrorFrontSide),
  v.lazy(() => PassportElementErrorReverseSide),
  v.lazy(() => PassportElementErrorSelfie),
  v.lazy(() => PassportElementErrorFile),
  v.lazy(() => PassportElementErrorFiles),
  v.lazy(() => PassportElementErrorTranslationFile),
  v.lazy(() => PassportElementErrorTranslationFiles),
  v.lazy(() => PassportElementErrorUnspecified),
])

export const PassportElementErrorDataField: v.GenericSchema<unknown, T.PassportElementErrorDataField> = v.looseObject({
  source: v.picklist(["data"]),
  type: v.string(),
  field_name: v.string(),
  data_hash: v.string(),
  message: v.string(),
})

export const PassportElementErrorFrontSide: v.GenericSchema<unknown, T.PassportElementErrorFrontSide> = v.looseObject({
  source: v.picklist(["front_side"]),
  type: v.string(),
  file_hash: v.string(),
  message: v.string(),
})

export const PassportElementErrorReverseSide: v.GenericSchema<unknown, T.PassportElementErrorReverseSide> =
  v.looseObject({
    source: v.picklist(["reverse_side"]),
    type: v.string(),
    file_hash: v.string(),
    message: v.string(),
  })

export const PassportElementErrorSelfie: v.GenericSchema<unknown, T.PassportElementErrorSelfie> = v.looseObject({
  source: v.picklist(["selfie"]),
  type: v.string(),
  file_hash: v.string(),
  message: v.string(),
})

export const PassportElementErrorFile: v.GenericSchema<unknown, T.PassportElementErrorFile> = v.looseObject({
  source: v.picklist(["file"]),
  type: v.string(),
  file_hash: v.string(),
  message: v.string(),
})

export const PassportElementErrorFiles: v.GenericSchema<unknown, T.PassportElementErrorFiles> = v.looseObject({
  source: v.picklist(["files"]),
  type: v.string(),
  file_hashes: v.array(v.string()),
  message: v.string(),
})

export const PassportElementErrorTranslationFile: v.GenericSchema<unknown, T.PassportElementErrorTranslationFile> =
  v.looseObject({
    source: v.picklist(["translation_file"]),
    type: v.string(),
    file_hash: v.string(),
    message: v.string(),
  })

export const PassportElementErrorTranslationFiles: v.GenericSchema<unknown, T.PassportElementErrorTranslationFiles> =
  v.looseObject({
    source: v.picklist(["translation_files"]),
    type: v.string(),
    file_hashes: v.array(v.string()),
    message: v.string(),
  })

export const PassportElementErrorUnspecified: v.GenericSchema<unknown, T.PassportElementErrorUnspecified> =
  v.looseObject({
    source: v.picklist(["unspecified"]),
    type: v.string(),
    element_hash: v.string(),
    message: v.string(),
  })

export const Game: v.GenericSchema<unknown, T.Game> = v.looseObject({
  title: v.string(),
  description: v.string(),
  photo: v.array(v.lazy(() => PhotoSize)),
  text: v.optional(v.string()),
  text_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  animation: v.optional(v.lazy(() => Animation)),
})

export const CallbackGame: v.GenericSchema<unknown, T.CallbackGame> = v.looseObject({})

export const GameHighScore: v.GenericSchema<unknown, T.GameHighScore> = v.looseObject({
  position: integer(),
  user: v.lazy(() => User),
  score: integer(),
})

export const GetUpdatesRequest: v.GenericSchema<unknown, T.GetUpdatesRequest> = v.looseObject({
  offset: v.optional(integer()),
  limit: v.optional(integer()),
  timeout: v.optional(integer()),
  allowed_updates: v.optional(v.array(v.string())),
})

export const GetUpdatesResponse: v.GenericSchema<unknown, T.GetUpdatesResponse> = v.array(v.lazy(() => Update))

export const SetWebhookRequest: v.GenericSchema<unknown, T.SetWebhookRequest> = v.looseObject({
  url: v.string(),
  certificate: v.optional(v.pipe(v.string(), v.startsWith("attach://"))),
  ip_address: v.optional(v.string()),
  max_connections: v.optional(integer()),
  allowed_updates: v.optional(v.array(v.string())),
  drop_pending_updates: v.optional(v.boolean()),
  secret_token: v.optional(v.string()),
})

export const SetWebhookResponse: v.GenericSchema<unknown, T.SetWebhookResponse> = v.boolean()

export const DeleteWebhookRequest: v.GenericSchema<unknown, T.DeleteWebhookRequest> = v.looseObject({
  drop_pending_updates: v.optional(v.boolean()),
})

export const DeleteWebhookResponse: v.GenericSchema<unknown, T.DeleteWebhookResponse> = v.boolean()

export const LogOutResponse: v.GenericSchema<unknown, T.LogOutResponse> = v.boolean()

export const CloseResponse: v.GenericSchema<unknown, T.CloseResponse> = v.boolean()

export const SendMessageRequest: v.GenericSchema<unknown, T.SendMessageRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  text: v.string(),
  parse_mode: v.optional(v.string()),
  entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  link_preview_options: v.optional(v.lazy(() => LinkPreviewOptions)),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const ForwardMessageRequest: v.GenericSchema<unknown, T.ForwardMessageRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  from_chat_id: v.union([int64(), v.string()]),
  video_start_timestamp: v.optional(integer()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  message_id: int64(),
})

export const ForwardMessagesRequest: v.GenericSchema<unknown, T.ForwardMessagesRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  from_chat_id: v.union([int64(), v.string()]),
  message_ids: v.array(integer()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
})

export const ForwardMessagesResponse: v.GenericSchema<unknown, T.ForwardMessagesResponse> = v.array(
  v.lazy(() => MessageId),
)

export const CopyMessageRequest: v.GenericSchema<unknown, T.CopyMessageRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  from_chat_id: v.union([int64(), v.string()]),
  message_id: int64(),
  video_start_timestamp: v.optional(integer()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const CopyMessagesRequest: v.GenericSchema<unknown, T.CopyMessagesRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  from_chat_id: v.union([int64(), v.string()]),
  message_ids: v.array(integer()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  remove_caption: v.optional(v.boolean()),
})

export const CopyMessagesResponse: v.GenericSchema<unknown, T.CopyMessagesResponse> = v.array(v.lazy(() => MessageId))

export const SendPhotoRequest: v.GenericSchema<unknown, T.SendPhotoRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  photo: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  has_spoiler: v.optional(v.boolean()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendLivePhotoRequest: v.GenericSchema<unknown, T.SendLivePhotoRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  live_photo: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  photo: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  has_spoiler: v.optional(v.boolean()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendAudioRequest: v.GenericSchema<unknown, T.SendAudioRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  audio: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  duration: v.optional(integer()),
  performer: v.optional(v.string()),
  title: v.optional(v.string()),
  thumbnail: v.optional(v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()])),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendDocumentRequest: v.GenericSchema<unknown, T.SendDocumentRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  document: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  thumbnail: v.optional(v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()])),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  disable_content_type_detection: v.optional(v.boolean()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendVideoRequest: v.GenericSchema<unknown, T.SendVideoRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  video: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  duration: v.optional(integer()),
  width: v.optional(integer()),
  height: v.optional(integer()),
  thumbnail: v.optional(v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()])),
  cover: v.optional(v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()])),
  start_timestamp: v.optional(integer()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  has_spoiler: v.optional(v.boolean()),
  supports_streaming: v.optional(v.boolean()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendAnimationRequest: v.GenericSchema<unknown, T.SendAnimationRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  animation: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  duration: v.optional(integer()),
  width: v.optional(integer()),
  height: v.optional(integer()),
  thumbnail: v.optional(v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()])),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  has_spoiler: v.optional(v.boolean()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendVoiceRequest: v.GenericSchema<unknown, T.SendVoiceRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  voice: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  duration: v.optional(integer()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendVideoNoteRequest: v.GenericSchema<unknown, T.SendVideoNoteRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  video_note: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  duration: v.optional(integer()),
  length: v.optional(integer()),
  thumbnail: v.optional(v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()])),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendPaidMediaRequest: v.GenericSchema<unknown, T.SendPaidMediaRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  star_count: integer(),
  media: v.array(v.lazy(() => InputPaidMedia)),
  payload: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendMediaGroupRequest: v.GenericSchema<unknown, T.SendMediaGroupRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  media: v.union([
    v.array(v.lazy(() => InputMediaAudio)),
    v.array(v.lazy(() => InputMediaDocument)),
    v.array(v.lazy(() => InputMediaLivePhoto)),
    v.array(v.lazy(() => InputMediaPhoto)),
    v.array(v.lazy(() => InputMediaVideo)),
  ]),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
})

export const SendMediaGroupResponse: v.GenericSchema<unknown, T.SendMediaGroupResponse> = v.array(v.lazy(() => Message))

export const SendLocationRequest: v.GenericSchema<unknown, T.SendLocationRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  latitude: number(),
  longitude: number(),
  horizontal_accuracy: v.optional(number()),
  live_period: v.optional(integer()),
  heading: v.optional(integer()),
  proximity_alert_radius: v.optional(integer()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendVenueRequest: v.GenericSchema<unknown, T.SendVenueRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  latitude: number(),
  longitude: number(),
  title: v.string(),
  address: v.string(),
  foursquare_id: v.optional(v.string()),
  foursquare_type: v.optional(v.string()),
  google_place_id: v.optional(v.string()),
  google_place_type: v.optional(v.string()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendContactRequest: v.GenericSchema<unknown, T.SendContactRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  phone_number: v.string(),
  first_name: v.string(),
  last_name: v.optional(v.string()),
  vcard: v.optional(v.string()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendPollRequest: v.GenericSchema<unknown, T.SendPollRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  question: v.string(),
  question_parse_mode: v.optional(v.string()),
  question_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  options: v.array(v.lazy(() => InputPollOption)),
  is_anonymous: v.optional(v.boolean()),
  type: v.optional(v.string()),
  allows_multiple_answers: v.optional(v.boolean()),
  allows_revoting: v.optional(v.boolean()),
  shuffle_options: v.optional(v.boolean()),
  allow_adding_options: v.optional(v.boolean()),
  hide_results_until_closes: v.optional(v.boolean()),
  members_only: v.optional(v.boolean()),
  country_codes: v.optional(v.array(v.string())),
  correct_option_ids: v.optional(v.array(integer())),
  explanation: v.optional(v.string()),
  explanation_parse_mode: v.optional(v.string()),
  explanation_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  explanation_media: v.optional(v.lazy(() => InputPollMedia)),
  open_period: v.optional(integer()),
  close_date: v.optional(integer()),
  is_closed: v.optional(v.boolean()),
  description: v.optional(v.string()),
  description_parse_mode: v.optional(v.string()),
  description_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  media: v.optional(v.lazy(() => InputPollMedia)),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendChecklistRequest: v.GenericSchema<unknown, T.SendChecklistRequest> = v.looseObject({
  business_connection_id: v.string(),
  chat_id: v.union([int64(), v.string()]),
  checklist: v.lazy(() => InputChecklist),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const SendDiceRequest: v.GenericSchema<unknown, T.SendDiceRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  emoji: v.optional(v.string()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendMessageDraftRequest: v.GenericSchema<unknown, T.SendMessageDraftRequest> = v.looseObject({
  chat_id: int64(),
  message_thread_id: v.optional(int64()),
  draft_id: int64(),
  text: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  can_stop: v.optional(v.boolean()),
  keep_on_stop: v.optional(v.boolean()),
})

export const SendMessageDraftResponse: v.GenericSchema<unknown, T.SendMessageDraftResponse> = v.boolean()

export const SendChatActionRequest: v.GenericSchema<unknown, T.SendChatActionRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  action: v.string(),
})

export const SendChatActionResponse: v.GenericSchema<unknown, T.SendChatActionResponse> = v.boolean()

export const SetMessageReactionRequest: v.GenericSchema<unknown, T.SetMessageReactionRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_id: int64(),
  reaction: v.optional(v.array(v.lazy(() => ReactionType))),
  is_big: v.optional(v.boolean()),
})

export const SetMessageReactionResponse: v.GenericSchema<unknown, T.SetMessageReactionResponse> = v.boolean()

export const GetUserProfilePhotosRequest: v.GenericSchema<unknown, T.GetUserProfilePhotosRequest> = v.looseObject({
  user_id: int64(),
  offset: v.optional(integer()),
  limit: v.optional(integer()),
})

export const GetUserProfileAudiosRequest: v.GenericSchema<unknown, T.GetUserProfileAudiosRequest> = v.looseObject({
  user_id: int64(),
  offset: v.optional(integer()),
  limit: v.optional(integer()),
})

export const SetUserEmojiStatusRequest: v.GenericSchema<unknown, T.SetUserEmojiStatusRequest> = v.looseObject({
  user_id: int64(),
  emoji_status_custom_emoji_id: v.optional(v.string()),
  emoji_status_expiration_date: v.optional(integer()),
})

export const SetUserEmojiStatusResponse: v.GenericSchema<unknown, T.SetUserEmojiStatusResponse> = v.boolean()

export const GetFileRequest: v.GenericSchema<unknown, T.GetFileRequest> = v.looseObject({
  file_id: v.string(),
})

export const BanChatMemberRequest: v.GenericSchema<unknown, T.BanChatMemberRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
  until_date: v.optional(integer()),
  revoke_messages: v.optional(v.boolean()),
})

export const BanChatMemberResponse: v.GenericSchema<unknown, T.BanChatMemberResponse> = v.boolean()

export const UnbanChatMemberRequest: v.GenericSchema<unknown, T.UnbanChatMemberRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
  only_if_banned: v.optional(v.boolean()),
})

export const UnbanChatMemberResponse: v.GenericSchema<unknown, T.UnbanChatMemberResponse> = v.boolean()

export const RestrictChatMemberRequest: v.GenericSchema<unknown, T.RestrictChatMemberRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
  permissions: v.lazy(() => ChatPermissions),
  use_independent_chat_permissions: v.optional(v.boolean()),
  until_date: v.optional(integer()),
})

export const RestrictChatMemberResponse: v.GenericSchema<unknown, T.RestrictChatMemberResponse> = v.boolean()

export const PromoteChatMemberRequest: v.GenericSchema<unknown, T.PromoteChatMemberRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
  is_anonymous: v.optional(v.boolean()),
  can_manage_chat: v.optional(v.boolean()),
  can_delete_messages: v.optional(v.boolean()),
  can_manage_video_chats: v.optional(v.boolean()),
  can_restrict_members: v.optional(v.boolean()),
  can_promote_members: v.optional(v.boolean()),
  can_change_info: v.optional(v.boolean()),
  can_invite_users: v.optional(v.boolean()),
  can_post_stories: v.optional(v.boolean()),
  can_edit_stories: v.optional(v.boolean()),
  can_delete_stories: v.optional(v.boolean()),
  can_post_messages: v.optional(v.boolean()),
  can_edit_messages: v.optional(v.boolean()),
  can_pin_messages: v.optional(v.boolean()),
  can_manage_topics: v.optional(v.boolean()),
  can_manage_direct_messages: v.optional(v.boolean()),
  can_manage_tags: v.optional(v.boolean()),
  can_send_welcome_messages: v.optional(v.boolean()),
})

export const PromoteChatMemberResponse: v.GenericSchema<unknown, T.PromoteChatMemberResponse> = v.boolean()

export const SetChatAdministratorCustomTitleRequest: v.GenericSchema<
  unknown,
  T.SetChatAdministratorCustomTitleRequest
> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
  custom_title: v.string(),
})

export const SetChatAdministratorCustomTitleResponse: v.GenericSchema<
  unknown,
  T.SetChatAdministratorCustomTitleResponse
> = v.boolean()

export const SetChatMemberTagRequest: v.GenericSchema<unknown, T.SetChatMemberTagRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
  tag: v.optional(v.string()),
})

export const SetChatMemberTagResponse: v.GenericSchema<unknown, T.SetChatMemberTagResponse> = v.boolean()

export const BanChatSenderChatRequest: v.GenericSchema<unknown, T.BanChatSenderChatRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  sender_chat_id: int64(),
})

export const BanChatSenderChatResponse: v.GenericSchema<unknown, T.BanChatSenderChatResponse> = v.boolean()

export const UnbanChatSenderChatRequest: v.GenericSchema<unknown, T.UnbanChatSenderChatRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  sender_chat_id: int64(),
})

export const UnbanChatSenderChatResponse: v.GenericSchema<unknown, T.UnbanChatSenderChatResponse> = v.boolean()

export const SetChatPermissionsRequest: v.GenericSchema<unknown, T.SetChatPermissionsRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  permissions: v.lazy(() => ChatPermissions),
  use_independent_chat_permissions: v.optional(v.boolean()),
})

export const SetChatPermissionsResponse: v.GenericSchema<unknown, T.SetChatPermissionsResponse> = v.boolean()

export const ExportChatInviteLinkRequest: v.GenericSchema<unknown, T.ExportChatInviteLinkRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const ExportChatInviteLinkResponse: v.GenericSchema<unknown, T.ExportChatInviteLinkResponse> = v.string()

export const CreateChatInviteLinkRequest: v.GenericSchema<unknown, T.CreateChatInviteLinkRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  name: v.optional(v.string()),
  expire_date: v.optional(integer()),
  member_limit: v.optional(integer()),
  creates_join_request: v.optional(v.boolean()),
})

export const EditChatInviteLinkRequest: v.GenericSchema<unknown, T.EditChatInviteLinkRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  invite_link: v.string(),
  name: v.optional(v.string()),
  expire_date: v.optional(integer()),
  member_limit: v.optional(integer()),
  creates_join_request: v.optional(v.boolean()),
})

export const CreateChatSubscriptionInviteLinkRequest: v.GenericSchema<
  unknown,
  T.CreateChatSubscriptionInviteLinkRequest
> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  name: v.optional(v.string()),
  subscription_period: integer(),
  subscription_price: integer(),
})

export const EditChatSubscriptionInviteLinkRequest: v.GenericSchema<unknown, T.EditChatSubscriptionInviteLinkRequest> =
  v.looseObject({
    chat_id: v.union([int64(), v.string()]),
    invite_link: v.string(),
    name: v.optional(v.string()),
  })

export const RevokeChatInviteLinkRequest: v.GenericSchema<unknown, T.RevokeChatInviteLinkRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  invite_link: v.string(),
})

export const ApproveChatJoinRequestRequest: v.GenericSchema<unknown, T.ApproveChatJoinRequestRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
})

export const ApproveChatJoinRequestResponse: v.GenericSchema<unknown, T.ApproveChatJoinRequestResponse> = v.boolean()

export const DeclineChatJoinRequestRequest: v.GenericSchema<unknown, T.DeclineChatJoinRequestRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
})

export const DeclineChatJoinRequestResponse: v.GenericSchema<unknown, T.DeclineChatJoinRequestResponse> = v.boolean()

export const AnswerChatJoinRequestQueryRequest: v.GenericSchema<unknown, T.AnswerChatJoinRequestQueryRequest> =
  v.looseObject({
    chat_join_request_query_id: v.string(),
    result: v.string(),
  })

export const AnswerChatJoinRequestQueryResponse: v.GenericSchema<unknown, T.AnswerChatJoinRequestQueryResponse> =
  v.boolean()

export const SendChatJoinRequestWebAppRequest: v.GenericSchema<unknown, T.SendChatJoinRequestWebAppRequest> =
  v.looseObject({
    chat_join_request_query_id: v.string(),
    web_app_url: v.string(),
  })

export const SendChatJoinRequestWebAppResponse: v.GenericSchema<unknown, T.SendChatJoinRequestWebAppResponse> =
  v.boolean()

export const SetChatPhotoRequest: v.GenericSchema<unknown, T.SetChatPhotoRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  photo: v.pipe(v.string(), v.startsWith("attach://")),
})

export const SetChatPhotoResponse: v.GenericSchema<unknown, T.SetChatPhotoResponse> = v.boolean()

export const DeleteChatPhotoRequest: v.GenericSchema<unknown, T.DeleteChatPhotoRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const DeleteChatPhotoResponse: v.GenericSchema<unknown, T.DeleteChatPhotoResponse> = v.boolean()

export const SetChatTitleRequest: v.GenericSchema<unknown, T.SetChatTitleRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  title: v.string(),
})

export const SetChatTitleResponse: v.GenericSchema<unknown, T.SetChatTitleResponse> = v.boolean()

export const SetChatDescriptionRequest: v.GenericSchema<unknown, T.SetChatDescriptionRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  description: v.optional(v.string()),
})

export const SetChatDescriptionResponse: v.GenericSchema<unknown, T.SetChatDescriptionResponse> = v.boolean()

export const PinChatMessageRequest: v.GenericSchema<unknown, T.PinChatMessageRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_id: int64(),
  disable_notification: v.optional(v.boolean()),
})

export const PinChatMessageResponse: v.GenericSchema<unknown, T.PinChatMessageResponse> = v.boolean()

export const UnpinChatMessageRequest: v.GenericSchema<unknown, T.UnpinChatMessageRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_id: v.optional(int64()),
})

export const UnpinChatMessageResponse: v.GenericSchema<unknown, T.UnpinChatMessageResponse> = v.boolean()

export const UnpinAllChatMessagesRequest: v.GenericSchema<unknown, T.UnpinAllChatMessagesRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const UnpinAllChatMessagesResponse: v.GenericSchema<unknown, T.UnpinAllChatMessagesResponse> = v.boolean()

export const LeaveChatRequest: v.GenericSchema<unknown, T.LeaveChatRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const LeaveChatResponse: v.GenericSchema<unknown, T.LeaveChatResponse> = v.boolean()

export const GetChatRequest: v.GenericSchema<unknown, T.GetChatRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const GetChatAdministratorsRequest: v.GenericSchema<unknown, T.GetChatAdministratorsRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  return_bots: v.optional(v.boolean()),
})

export const GetChatAdministratorsResponse: v.GenericSchema<unknown, T.GetChatAdministratorsResponse> = v.array(
  v.lazy(() => ChatMember),
)

export const GetChatMemberCountRequest: v.GenericSchema<unknown, T.GetChatMemberCountRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const GetChatMemberCountResponse: v.GenericSchema<unknown, T.GetChatMemberCountResponse> = integer()

export const GetChatMemberRequest: v.GenericSchema<unknown, T.GetChatMemberRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
})

export const GetUserPersonalChatMessagesRequest: v.GenericSchema<unknown, T.GetUserPersonalChatMessagesRequest> =
  v.looseObject({
    user_id: int64(),
    limit: integer(),
  })

export const GetUserPersonalChatMessagesResponse: v.GenericSchema<unknown, T.GetUserPersonalChatMessagesResponse> =
  v.array(v.lazy(() => Message))

export const SetChatStickerSetRequest: v.GenericSchema<unknown, T.SetChatStickerSetRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  sticker_set_name: v.string(),
})

export const SetChatStickerSetResponse: v.GenericSchema<unknown, T.SetChatStickerSetResponse> = v.boolean()

export const DeleteChatStickerSetRequest: v.GenericSchema<unknown, T.DeleteChatStickerSetRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const DeleteChatStickerSetResponse: v.GenericSchema<unknown, T.DeleteChatStickerSetResponse> = v.boolean()

export const GetForumTopicIconStickersResponse: v.GenericSchema<unknown, T.GetForumTopicIconStickersResponse> = v.array(
  v.lazy(() => Sticker),
)

export const CreateForumTopicRequest: v.GenericSchema<unknown, T.CreateForumTopicRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  name: v.string(),
  icon_color: v.optional(integer()),
  icon_custom_emoji_id: v.optional(v.string()),
})

export const EditForumTopicRequest: v.GenericSchema<unknown, T.EditForumTopicRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: int64(),
  name: v.optional(v.string()),
  icon_custom_emoji_id: v.optional(v.string()),
})

export const EditForumTopicResponse: v.GenericSchema<unknown, T.EditForumTopicResponse> = v.boolean()

export const CloseForumTopicRequest: v.GenericSchema<unknown, T.CloseForumTopicRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: int64(),
})

export const CloseForumTopicResponse: v.GenericSchema<unknown, T.CloseForumTopicResponse> = v.boolean()

export const ReopenForumTopicRequest: v.GenericSchema<unknown, T.ReopenForumTopicRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: int64(),
})

export const ReopenForumTopicResponse: v.GenericSchema<unknown, T.ReopenForumTopicResponse> = v.boolean()

export const DeleteForumTopicRequest: v.GenericSchema<unknown, T.DeleteForumTopicRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: int64(),
})

export const DeleteForumTopicResponse: v.GenericSchema<unknown, T.DeleteForumTopicResponse> = v.boolean()

export const UnpinAllForumTopicMessagesRequest: v.GenericSchema<unknown, T.UnpinAllForumTopicMessagesRequest> =
  v.looseObject({
    chat_id: v.union([int64(), v.string()]),
    message_thread_id: int64(),
  })

export const UnpinAllForumTopicMessagesResponse: v.GenericSchema<unknown, T.UnpinAllForumTopicMessagesResponse> =
  v.boolean()

export const EditGeneralForumTopicRequest: v.GenericSchema<unknown, T.EditGeneralForumTopicRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  name: v.string(),
})

export const EditGeneralForumTopicResponse: v.GenericSchema<unknown, T.EditGeneralForumTopicResponse> = v.boolean()

export const CloseGeneralForumTopicRequest: v.GenericSchema<unknown, T.CloseGeneralForumTopicRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const CloseGeneralForumTopicResponse: v.GenericSchema<unknown, T.CloseGeneralForumTopicResponse> = v.boolean()

export const ReopenGeneralForumTopicRequest: v.GenericSchema<unknown, T.ReopenGeneralForumTopicRequest> = v.looseObject(
  {
    chat_id: v.union([int64(), v.string()]),
  },
)

export const ReopenGeneralForumTopicResponse: v.GenericSchema<unknown, T.ReopenGeneralForumTopicResponse> = v.boolean()

export const HideGeneralForumTopicRequest: v.GenericSchema<unknown, T.HideGeneralForumTopicRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const HideGeneralForumTopicResponse: v.GenericSchema<unknown, T.HideGeneralForumTopicResponse> = v.boolean()

export const UnhideGeneralForumTopicRequest: v.GenericSchema<unknown, T.UnhideGeneralForumTopicRequest> = v.looseObject(
  {
    chat_id: v.union([int64(), v.string()]),
  },
)

export const UnhideGeneralForumTopicResponse: v.GenericSchema<unknown, T.UnhideGeneralForumTopicResponse> = v.boolean()

export const UnpinAllGeneralForumTopicMessagesRequest: v.GenericSchema<
  unknown,
  T.UnpinAllGeneralForumTopicMessagesRequest
> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const UnpinAllGeneralForumTopicMessagesResponse: v.GenericSchema<
  unknown,
  T.UnpinAllGeneralForumTopicMessagesResponse
> = v.boolean()

export const AnswerCallbackQueryRequest: v.GenericSchema<unknown, T.AnswerCallbackQueryRequest> = v.looseObject({
  callback_query_id: v.string(),
  text: v.optional(v.string()),
  show_alert: v.optional(v.boolean()),
  url: v.optional(v.string()),
  cache_time: v.optional(integer()),
})

export const AnswerCallbackQueryResponse: v.GenericSchema<unknown, T.AnswerCallbackQueryResponse> = v.boolean()

export const AnswerGuestQueryRequest: v.GenericSchema<unknown, T.AnswerGuestQueryRequest> = v.looseObject({
  guest_query_id: v.string(),
  result: v.lazy(() => InlineQueryResult),
})

export const GetUserChatBoostsRequest: v.GenericSchema<unknown, T.GetUserChatBoostsRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  user_id: int64(),
})

export const GetBusinessConnectionRequest: v.GenericSchema<unknown, T.GetBusinessConnectionRequest> = v.looseObject({
  business_connection_id: v.string(),
})

export const GetManagedBotTokenRequest: v.GenericSchema<unknown, T.GetManagedBotTokenRequest> = v.looseObject({
  user_id: int64(),
})

export const GetManagedBotTokenResponse: v.GenericSchema<unknown, T.GetManagedBotTokenResponse> = v.string()

export const ReplaceManagedBotTokenRequest: v.GenericSchema<unknown, T.ReplaceManagedBotTokenRequest> = v.looseObject({
  user_id: int64(),
})

export const ReplaceManagedBotTokenResponse: v.GenericSchema<unknown, T.ReplaceManagedBotTokenResponse> = v.string()

export const GetManagedBotAccessSettingsRequest: v.GenericSchema<unknown, T.GetManagedBotAccessSettingsRequest> =
  v.looseObject({
    user_id: int64(),
  })

export const SetManagedBotAccessSettingsRequest: v.GenericSchema<unknown, T.SetManagedBotAccessSettingsRequest> =
  v.looseObject({
    user_id: int64(),
    is_access_restricted: v.boolean(),
    added_user_ids: v.optional(v.array(integer())),
  })

export const SetManagedBotAccessSettingsResponse: v.GenericSchema<unknown, T.SetManagedBotAccessSettingsResponse> =
  v.boolean()

export const SetMyCommandsRequest: v.GenericSchema<unknown, T.SetMyCommandsRequest> = v.looseObject({
  commands: v.array(v.lazy(() => BotCommand)),
  scope: v.optional(v.lazy(() => BotCommandScope)),
  language_code: v.optional(v.string()),
})

export const SetMyCommandsResponse: v.GenericSchema<unknown, T.SetMyCommandsResponse> = v.boolean()

export const DeleteMyCommandsRequest: v.GenericSchema<unknown, T.DeleteMyCommandsRequest> = v.looseObject({
  scope: v.optional(v.lazy(() => BotCommandScope)),
  language_code: v.optional(v.string()),
})

export const DeleteMyCommandsResponse: v.GenericSchema<unknown, T.DeleteMyCommandsResponse> = v.boolean()

export const GetMyCommandsRequest: v.GenericSchema<unknown, T.GetMyCommandsRequest> = v.looseObject({
  scope: v.optional(v.lazy(() => BotCommandScope)),
  language_code: v.optional(v.string()),
})

export const GetMyCommandsResponse: v.GenericSchema<unknown, T.GetMyCommandsResponse> = v.array(
  v.lazy(() => BotCommand),
)

export const SetMyNameRequest: v.GenericSchema<unknown, T.SetMyNameRequest> = v.looseObject({
  name: v.optional(v.string()),
  language_code: v.optional(v.string()),
})

export const SetMyNameResponse: v.GenericSchema<unknown, T.SetMyNameResponse> = v.boolean()

export const GetMyNameRequest: v.GenericSchema<unknown, T.GetMyNameRequest> = v.looseObject({
  language_code: v.optional(v.string()),
})

export const SetMyDescriptionRequest: v.GenericSchema<unknown, T.SetMyDescriptionRequest> = v.looseObject({
  description: v.optional(v.string()),
  language_code: v.optional(v.string()),
})

export const SetMyDescriptionResponse: v.GenericSchema<unknown, T.SetMyDescriptionResponse> = v.boolean()

export const GetMyDescriptionRequest: v.GenericSchema<unknown, T.GetMyDescriptionRequest> = v.looseObject({
  language_code: v.optional(v.string()),
})

export const SetMyShortDescriptionRequest: v.GenericSchema<unknown, T.SetMyShortDescriptionRequest> = v.looseObject({
  short_description: v.optional(v.string()),
  language_code: v.optional(v.string()),
})

export const SetMyShortDescriptionResponse: v.GenericSchema<unknown, T.SetMyShortDescriptionResponse> = v.boolean()

export const GetMyShortDescriptionRequest: v.GenericSchema<unknown, T.GetMyShortDescriptionRequest> = v.looseObject({
  language_code: v.optional(v.string()),
})

export const SetMyProfilePhotoRequest: v.GenericSchema<unknown, T.SetMyProfilePhotoRequest> = v.looseObject({
  photo: v.lazy(() => InputProfilePhoto),
})

export const SetMyProfilePhotoResponse: v.GenericSchema<unknown, T.SetMyProfilePhotoResponse> = v.boolean()

export const RemoveMyProfilePhotoResponse: v.GenericSchema<unknown, T.RemoveMyProfilePhotoResponse> = v.boolean()

export const SetChatMenuButtonRequest: v.GenericSchema<unknown, T.SetChatMenuButtonRequest> = v.looseObject({
  chat_id: v.optional(int64()),
  menu_button: v.optional(v.lazy(() => MenuButton)),
})

export const SetChatMenuButtonResponse: v.GenericSchema<unknown, T.SetChatMenuButtonResponse> = v.boolean()

export const GetChatMenuButtonRequest: v.GenericSchema<unknown, T.GetChatMenuButtonRequest> = v.looseObject({
  chat_id: v.optional(int64()),
})

export const SetMyDefaultAdministratorRightsRequest: v.GenericSchema<
  unknown,
  T.SetMyDefaultAdministratorRightsRequest
> = v.looseObject({
  rights: v.optional(v.lazy(() => ChatAdministratorRights)),
  for_channels: v.optional(v.boolean()),
})

export const SetMyDefaultAdministratorRightsResponse: v.GenericSchema<
  unknown,
  T.SetMyDefaultAdministratorRightsResponse
> = v.boolean()

export const GetMyDefaultAdministratorRightsRequest: v.GenericSchema<
  unknown,
  T.GetMyDefaultAdministratorRightsRequest
> = v.looseObject({
  for_channels: v.optional(v.boolean()),
})

export const SendGiftRequest: v.GenericSchema<unknown, T.SendGiftRequest> = v.looseObject({
  user_id: v.optional(int64()),
  chat_id: v.optional(v.union([int64(), v.string()])),
  gift_id: v.string(),
  pay_for_upgrade: v.optional(v.boolean()),
  text: v.optional(v.string()),
  text_parse_mode: v.optional(v.string()),
  text_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
})

export const SendGiftResponse: v.GenericSchema<unknown, T.SendGiftResponse> = v.boolean()

export const GiftPremiumSubscriptionRequest: v.GenericSchema<unknown, T.GiftPremiumSubscriptionRequest> = v.looseObject(
  {
    user_id: int64(),
    month_count: integer(),
    star_count: integer(),
    text: v.optional(v.string()),
    text_parse_mode: v.optional(v.string()),
    text_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  },
)

export const GiftPremiumSubscriptionResponse: v.GenericSchema<unknown, T.GiftPremiumSubscriptionResponse> = v.boolean()

export const VerifyUserRequest: v.GenericSchema<unknown, T.VerifyUserRequest> = v.looseObject({
  user_id: int64(),
  custom_description: v.optional(v.string()),
})

export const VerifyUserResponse: v.GenericSchema<unknown, T.VerifyUserResponse> = v.boolean()

export const VerifyChatRequest: v.GenericSchema<unknown, T.VerifyChatRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  custom_description: v.optional(v.string()),
})

export const VerifyChatResponse: v.GenericSchema<unknown, T.VerifyChatResponse> = v.boolean()

export const RemoveUserVerificationRequest: v.GenericSchema<unknown, T.RemoveUserVerificationRequest> = v.looseObject({
  user_id: int64(),
})

export const RemoveUserVerificationResponse: v.GenericSchema<unknown, T.RemoveUserVerificationResponse> = v.boolean()

export const RemoveChatVerificationRequest: v.GenericSchema<unknown, T.RemoveChatVerificationRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
})

export const RemoveChatVerificationResponse: v.GenericSchema<unknown, T.RemoveChatVerificationResponse> = v.boolean()

export const ReadBusinessMessageRequest: v.GenericSchema<unknown, T.ReadBusinessMessageRequest> = v.looseObject({
  business_connection_id: v.string(),
  chat_id: int64(),
  message_id: int64(),
})

export const ReadBusinessMessageResponse: v.GenericSchema<unknown, T.ReadBusinessMessageResponse> = v.boolean()

export const DeleteBusinessMessagesRequest: v.GenericSchema<unknown, T.DeleteBusinessMessagesRequest> = v.looseObject({
  business_connection_id: v.string(),
  message_ids: v.array(integer()),
})

export const DeleteBusinessMessagesResponse: v.GenericSchema<unknown, T.DeleteBusinessMessagesResponse> = v.boolean()

export const SetBusinessAccountNameRequest: v.GenericSchema<unknown, T.SetBusinessAccountNameRequest> = v.looseObject({
  business_connection_id: v.string(),
  first_name: v.string(),
  last_name: v.optional(v.string()),
})

export const SetBusinessAccountNameResponse: v.GenericSchema<unknown, T.SetBusinessAccountNameResponse> = v.boolean()

export const SetBusinessAccountUsernameRequest: v.GenericSchema<unknown, T.SetBusinessAccountUsernameRequest> =
  v.looseObject({
    business_connection_id: v.string(),
    username: v.optional(v.string()),
  })

export const SetBusinessAccountUsernameResponse: v.GenericSchema<unknown, T.SetBusinessAccountUsernameResponse> =
  v.boolean()

export const SetBusinessAccountBioRequest: v.GenericSchema<unknown, T.SetBusinessAccountBioRequest> = v.looseObject({
  business_connection_id: v.string(),
  bio: v.optional(v.string()),
})

export const SetBusinessAccountBioResponse: v.GenericSchema<unknown, T.SetBusinessAccountBioResponse> = v.boolean()

export const SetBusinessAccountProfilePhotoRequest: v.GenericSchema<unknown, T.SetBusinessAccountProfilePhotoRequest> =
  v.looseObject({
    business_connection_id: v.string(),
    photo: v.lazy(() => InputProfilePhoto),
    is_public: v.optional(v.boolean()),
  })

export const SetBusinessAccountProfilePhotoResponse: v.GenericSchema<
  unknown,
  T.SetBusinessAccountProfilePhotoResponse
> = v.boolean()

export const RemoveBusinessAccountProfilePhotoRequest: v.GenericSchema<
  unknown,
  T.RemoveBusinessAccountProfilePhotoRequest
> = v.looseObject({
  business_connection_id: v.string(),
  is_public: v.optional(v.boolean()),
})

export const RemoveBusinessAccountProfilePhotoResponse: v.GenericSchema<
  unknown,
  T.RemoveBusinessAccountProfilePhotoResponse
> = v.boolean()

export const SetBusinessAccountGiftSettingsRequest: v.GenericSchema<unknown, T.SetBusinessAccountGiftSettingsRequest> =
  v.looseObject({
    business_connection_id: v.string(),
    show_gift_button: v.boolean(),
    accepted_gift_types: v.lazy(() => AcceptedGiftTypes),
  })

export const SetBusinessAccountGiftSettingsResponse: v.GenericSchema<
  unknown,
  T.SetBusinessAccountGiftSettingsResponse
> = v.boolean()

export const GetBusinessAccountStarBalanceRequest: v.GenericSchema<unknown, T.GetBusinessAccountStarBalanceRequest> =
  v.looseObject({
    business_connection_id: v.string(),
  })

export const TransferBusinessAccountStarsRequest: v.GenericSchema<unknown, T.TransferBusinessAccountStarsRequest> =
  v.looseObject({
    business_connection_id: v.string(),
    star_count: integer(),
  })

export const TransferBusinessAccountStarsResponse: v.GenericSchema<unknown, T.TransferBusinessAccountStarsResponse> =
  v.boolean()

export const GetBusinessAccountGiftsRequest: v.GenericSchema<unknown, T.GetBusinessAccountGiftsRequest> = v.looseObject(
  {
    business_connection_id: v.string(),
    exclude_unsaved: v.optional(v.boolean()),
    exclude_saved: v.optional(v.boolean()),
    exclude_unlimited: v.optional(v.boolean()),
    exclude_limited_upgradable: v.optional(v.boolean()),
    exclude_limited_non_upgradable: v.optional(v.boolean()),
    exclude_unique: v.optional(v.boolean()),
    exclude_from_blockchain: v.optional(v.boolean()),
    sort_by_price: v.optional(v.boolean()),
    offset: v.optional(v.string()),
    limit: v.optional(integer()),
  },
)

export const GetUserGiftsRequest: v.GenericSchema<unknown, T.GetUserGiftsRequest> = v.looseObject({
  user_id: int64(),
  exclude_unlimited: v.optional(v.boolean()),
  exclude_limited_upgradable: v.optional(v.boolean()),
  exclude_limited_non_upgradable: v.optional(v.boolean()),
  exclude_from_blockchain: v.optional(v.boolean()),
  exclude_unique: v.optional(v.boolean()),
  sort_by_price: v.optional(v.boolean()),
  offset: v.optional(v.string()),
  limit: v.optional(integer()),
})

export const GetChatGiftsRequest: v.GenericSchema<unknown, T.GetChatGiftsRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  exclude_unsaved: v.optional(v.boolean()),
  exclude_saved: v.optional(v.boolean()),
  exclude_unlimited: v.optional(v.boolean()),
  exclude_limited_upgradable: v.optional(v.boolean()),
  exclude_limited_non_upgradable: v.optional(v.boolean()),
  exclude_from_blockchain: v.optional(v.boolean()),
  exclude_unique: v.optional(v.boolean()),
  sort_by_price: v.optional(v.boolean()),
  offset: v.optional(v.string()),
  limit: v.optional(integer()),
})

export const ConvertGiftToStarsRequest: v.GenericSchema<unknown, T.ConvertGiftToStarsRequest> = v.looseObject({
  business_connection_id: v.string(),
  owned_gift_id: v.string(),
})

export const ConvertGiftToStarsResponse: v.GenericSchema<unknown, T.ConvertGiftToStarsResponse> = v.boolean()

export const UpgradeGiftRequest: v.GenericSchema<unknown, T.UpgradeGiftRequest> = v.looseObject({
  business_connection_id: v.string(),
  owned_gift_id: v.string(),
  keep_original_details: v.optional(v.boolean()),
  star_count: v.optional(integer()),
})

export const UpgradeGiftResponse: v.GenericSchema<unknown, T.UpgradeGiftResponse> = v.boolean()

export const TransferGiftRequest: v.GenericSchema<unknown, T.TransferGiftRequest> = v.looseObject({
  business_connection_id: v.string(),
  owned_gift_id: v.string(),
  new_owner_chat_id: int64(),
  star_count: v.optional(integer()),
})

export const TransferGiftResponse: v.GenericSchema<unknown, T.TransferGiftResponse> = v.boolean()

export const PostStoryRequest: v.GenericSchema<unknown, T.PostStoryRequest> = v.looseObject({
  business_connection_id: v.string(),
  content: v.lazy(() => InputStoryContent),
  active_period: integer(),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  areas: v.optional(v.array(v.lazy(() => StoryArea))),
  post_to_chat_page: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
})

export const RepostStoryRequest: v.GenericSchema<unknown, T.RepostStoryRequest> = v.looseObject({
  business_connection_id: v.string(),
  from_chat_id: int64(),
  from_story_id: int64(),
  active_period: integer(),
  post_to_chat_page: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
})

export const EditStoryRequest: v.GenericSchema<unknown, T.EditStoryRequest> = v.looseObject({
  business_connection_id: v.string(),
  story_id: int64(),
  content: v.lazy(() => InputStoryContent),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  areas: v.optional(v.array(v.lazy(() => StoryArea))),
})

export const DeleteStoryRequest: v.GenericSchema<unknown, T.DeleteStoryRequest> = v.looseObject({
  business_connection_id: v.string(),
  story_id: int64(),
})

export const DeleteStoryResponse: v.GenericSchema<unknown, T.DeleteStoryResponse> = v.boolean()

export const AnswerWebAppQueryRequest: v.GenericSchema<unknown, T.AnswerWebAppQueryRequest> = v.looseObject({
  web_app_query_id: v.string(),
  result: v.lazy(() => InlineQueryResult),
})

export const SavePreparedInlineMessageRequest: v.GenericSchema<unknown, T.SavePreparedInlineMessageRequest> =
  v.looseObject({
    user_id: int64(),
    result: v.lazy(() => InlineQueryResult),
    allow_user_chats: v.optional(v.boolean()),
    allow_bot_chats: v.optional(v.boolean()),
    allow_group_chats: v.optional(v.boolean()),
    allow_channel_chats: v.optional(v.boolean()),
  })

export const SavePreparedKeyboardButtonRequest: v.GenericSchema<unknown, T.SavePreparedKeyboardButtonRequest> =
  v.looseObject({
    user_id: int64(),
    button: v.lazy(() => KeyboardButton),
  })

export const EditMessageTextRequest: v.GenericSchema<unknown, T.EditMessageTextRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.optional(v.union([int64(), v.string()])),
  message_id: v.optional(int64()),
  inline_message_id: v.optional(v.string()),
  text: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  link_preview_options: v.optional(v.lazy(() => LinkPreviewOptions)),
  rich_message: v.optional(v.lazy(() => InputRichMessage)),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const EditMessageTextResponse: v.GenericSchema<unknown, T.EditMessageTextResponse> = v.union([
  v.lazy(() => Message),
  v.boolean(),
])

export const EditMessageCaptionRequest: v.GenericSchema<unknown, T.EditMessageCaptionRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.optional(v.union([int64(), v.string()])),
  message_id: v.optional(int64()),
  inline_message_id: v.optional(v.string()),
  caption: v.optional(v.string()),
  parse_mode: v.optional(v.string()),
  caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
  show_caption_above_media: v.optional(v.boolean()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const EditMessageCaptionResponse: v.GenericSchema<unknown, T.EditMessageCaptionResponse> = v.union([
  v.lazy(() => Message),
  v.boolean(),
])

export const EditMessageMediaRequest: v.GenericSchema<unknown, T.EditMessageMediaRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.optional(v.union([int64(), v.string()])),
  message_id: v.optional(int64()),
  inline_message_id: v.optional(v.string()),
  media: v.lazy(() => InputMedia),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const EditMessageMediaResponse: v.GenericSchema<unknown, T.EditMessageMediaResponse> = v.union([
  v.lazy(() => Message),
  v.boolean(),
])

export const EditMessageLiveLocationRequest: v.GenericSchema<unknown, T.EditMessageLiveLocationRequest> = v.looseObject(
  {
    business_connection_id: v.optional(v.string()),
    chat_id: v.optional(v.union([int64(), v.string()])),
    message_id: v.optional(int64()),
    inline_message_id: v.optional(v.string()),
    latitude: number(),
    longitude: number(),
    live_period: v.optional(integer()),
    horizontal_accuracy: v.optional(number()),
    heading: v.optional(integer()),
    proximity_alert_radius: v.optional(integer()),
    reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  },
)

export const EditMessageLiveLocationResponse: v.GenericSchema<unknown, T.EditMessageLiveLocationResponse> = v.union([
  v.lazy(() => Message),
  v.boolean(),
])

export const StopMessageLiveLocationRequest: v.GenericSchema<unknown, T.StopMessageLiveLocationRequest> = v.looseObject(
  {
    business_connection_id: v.optional(v.string()),
    chat_id: v.optional(v.union([int64(), v.string()])),
    message_id: v.optional(int64()),
    inline_message_id: v.optional(v.string()),
    reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  },
)

export const StopMessageLiveLocationResponse: v.GenericSchema<unknown, T.StopMessageLiveLocationResponse> = v.union([
  v.lazy(() => Message),
  v.boolean(),
])

export const EditMessageChecklistRequest: v.GenericSchema<unknown, T.EditMessageChecklistRequest> = v.looseObject({
  business_connection_id: v.string(),
  chat_id: v.union([int64(), v.string()]),
  message_id: int64(),
  checklist: v.lazy(() => InputChecklist),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const EditMessageReplyMarkupRequest: v.GenericSchema<unknown, T.EditMessageReplyMarkupRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.optional(v.union([int64(), v.string()])),
  message_id: v.optional(int64()),
  inline_message_id: v.optional(v.string()),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const EditMessageReplyMarkupResponse: v.GenericSchema<unknown, T.EditMessageReplyMarkupResponse> = v.union([
  v.lazy(() => Message),
  v.boolean(),
])

export const StopPollRequest: v.GenericSchema<unknown, T.StopPollRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_id: int64(),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const EditEphemeralMessageTextRequest: v.GenericSchema<unknown, T.EditEphemeralMessageTextRequest> =
  v.looseObject({
    chat_id: v.union([int64(), v.string()]),
    receiver_user_id: int64(),
    ephemeral_message_id: int64(),
    text: v.optional(v.string()),
    parse_mode: v.optional(v.string()),
    entities: v.optional(v.array(v.lazy(() => MessageEntity))),
    rich_message: v.optional(v.lazy(() => InputRichMessage)),
    link_preview_options: v.optional(v.lazy(() => LinkPreviewOptions)),
    reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  })

export const EditEphemeralMessageTextResponse: v.GenericSchema<unknown, T.EditEphemeralMessageTextResponse> =
  v.boolean()

export const EditEphemeralMessageMediaRequest: v.GenericSchema<unknown, T.EditEphemeralMessageMediaRequest> =
  v.looseObject({
    chat_id: v.union([int64(), v.string()]),
    receiver_user_id: int64(),
    ephemeral_message_id: int64(),
    media: v.lazy(() => InputMedia),
    reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  })

export const EditEphemeralMessageMediaResponse: v.GenericSchema<unknown, T.EditEphemeralMessageMediaResponse> =
  v.boolean()

export const EditEphemeralMessageCaptionRequest: v.GenericSchema<unknown, T.EditEphemeralMessageCaptionRequest> =
  v.looseObject({
    chat_id: v.union([int64(), v.string()]),
    receiver_user_id: int64(),
    ephemeral_message_id: int64(),
    caption: v.optional(v.string()),
    parse_mode: v.optional(v.string()),
    caption_entities: v.optional(v.array(v.lazy(() => MessageEntity))),
    show_caption_above_media: v.optional(v.boolean()),
    reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
  })

export const EditEphemeralMessageCaptionResponse: v.GenericSchema<unknown, T.EditEphemeralMessageCaptionResponse> =
  v.boolean()

export const EditEphemeralMessageReplyMarkupRequest: v.GenericSchema<
  unknown,
  T.EditEphemeralMessageReplyMarkupRequest
> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  receiver_user_id: int64(),
  ephemeral_message_id: int64(),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const EditEphemeralMessageReplyMarkupResponse: v.GenericSchema<
  unknown,
  T.EditEphemeralMessageReplyMarkupResponse
> = v.boolean()

export const ApproveSuggestedPostRequest: v.GenericSchema<unknown, T.ApproveSuggestedPostRequest> = v.looseObject({
  chat_id: int64(),
  message_id: int64(),
  send_date: v.optional(integer()),
})

export const ApproveSuggestedPostResponse: v.GenericSchema<unknown, T.ApproveSuggestedPostResponse> = v.boolean()

export const DeclineSuggestedPostRequest: v.GenericSchema<unknown, T.DeclineSuggestedPostRequest> = v.looseObject({
  chat_id: int64(),
  message_id: int64(),
  comment: v.optional(v.string()),
})

export const DeclineSuggestedPostResponse: v.GenericSchema<unknown, T.DeclineSuggestedPostResponse> = v.boolean()

export const DeleteMessageRequest: v.GenericSchema<unknown, T.DeleteMessageRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_id: int64(),
})

export const DeleteMessageResponse: v.GenericSchema<unknown, T.DeleteMessageResponse> = v.boolean()

export const DeleteMessagesRequest: v.GenericSchema<unknown, T.DeleteMessagesRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_ids: v.array(integer()),
})

export const DeleteMessagesResponse: v.GenericSchema<unknown, T.DeleteMessagesResponse> = v.boolean()

export const DeleteEphemeralMessageRequest: v.GenericSchema<unknown, T.DeleteEphemeralMessageRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  receiver_user_id: int64(),
  ephemeral_message_id: int64(),
})

export const DeleteEphemeralMessageResponse: v.GenericSchema<unknown, T.DeleteEphemeralMessageResponse> = v.boolean()

export const DeleteMessageReactionRequest: v.GenericSchema<unknown, T.DeleteMessageReactionRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_id: int64(),
  user_id: v.optional(int64()),
  actor_chat_id: v.optional(int64()),
})

export const DeleteMessageReactionResponse: v.GenericSchema<unknown, T.DeleteMessageReactionResponse> = v.boolean()

export const DeleteAllMessageReactionsRequest: v.GenericSchema<unknown, T.DeleteAllMessageReactionsRequest> =
  v.looseObject({
    chat_id: v.union([int64(), v.string()]),
    user_id: v.optional(int64()),
    actor_chat_id: v.optional(int64()),
  })

export const DeleteAllMessageReactionsResponse: v.GenericSchema<unknown, T.DeleteAllMessageReactionsResponse> =
  v.boolean()

export const SendStickerRequest: v.GenericSchema<unknown, T.SendStickerRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  sticker: v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()]),
  emoji: v.optional(v.string()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const GetStickerSetRequest: v.GenericSchema<unknown, T.GetStickerSetRequest> = v.looseObject({
  name: v.string(),
})

export const GetCustomEmojiStickersRequest: v.GenericSchema<unknown, T.GetCustomEmojiStickersRequest> = v.looseObject({
  custom_emoji_ids: v.array(v.string()),
})

export const GetCustomEmojiStickersResponse: v.GenericSchema<unknown, T.GetCustomEmojiStickersResponse> = v.array(
  v.lazy(() => Sticker),
)

export const UploadStickerFileRequest: v.GenericSchema<unknown, T.UploadStickerFileRequest> = v.looseObject({
  user_id: int64(),
  sticker: v.pipe(v.string(), v.startsWith("attach://")),
  sticker_format: v.string(),
})

export const CreateNewStickerSetRequest: v.GenericSchema<unknown, T.CreateNewStickerSetRequest> = v.looseObject({
  user_id: int64(),
  name: v.string(),
  title: v.string(),
  stickers: v.array(v.lazy(() => InputSticker)),
  sticker_type: v.optional(v.string()),
  needs_repainting: v.optional(v.boolean()),
})

export const CreateNewStickerSetResponse: v.GenericSchema<unknown, T.CreateNewStickerSetResponse> = v.boolean()

export const AddStickerToSetRequest: v.GenericSchema<unknown, T.AddStickerToSetRequest> = v.looseObject({
  user_id: int64(),
  name: v.string(),
  sticker: v.lazy(() => InputSticker),
})

export const AddStickerToSetResponse: v.GenericSchema<unknown, T.AddStickerToSetResponse> = v.boolean()

export const SetStickerPositionInSetRequest: v.GenericSchema<unknown, T.SetStickerPositionInSetRequest> = v.looseObject(
  {
    sticker: v.string(),
    position: integer(),
  },
)

export const SetStickerPositionInSetResponse: v.GenericSchema<unknown, T.SetStickerPositionInSetResponse> = v.boolean()

export const DeleteStickerFromSetRequest: v.GenericSchema<unknown, T.DeleteStickerFromSetRequest> = v.looseObject({
  sticker: v.string(),
})

export const DeleteStickerFromSetResponse: v.GenericSchema<unknown, T.DeleteStickerFromSetResponse> = v.boolean()

export const ReplaceStickerInSetRequest: v.GenericSchema<unknown, T.ReplaceStickerInSetRequest> = v.looseObject({
  user_id: int64(),
  name: v.string(),
  old_sticker: v.string(),
  sticker: v.lazy(() => InputSticker),
})

export const ReplaceStickerInSetResponse: v.GenericSchema<unknown, T.ReplaceStickerInSetResponse> = v.boolean()

export const SetStickerEmojiListRequest: v.GenericSchema<unknown, T.SetStickerEmojiListRequest> = v.looseObject({
  sticker: v.string(),
  emoji_list: v.array(v.string()),
})

export const SetStickerEmojiListResponse: v.GenericSchema<unknown, T.SetStickerEmojiListResponse> = v.boolean()

export const SetStickerKeywordsRequest: v.GenericSchema<unknown, T.SetStickerKeywordsRequest> = v.looseObject({
  sticker: v.string(),
  keywords: v.optional(v.array(v.string())),
})

export const SetStickerKeywordsResponse: v.GenericSchema<unknown, T.SetStickerKeywordsResponse> = v.boolean()

export const SetStickerMaskPositionRequest: v.GenericSchema<unknown, T.SetStickerMaskPositionRequest> = v.looseObject({
  sticker: v.string(),
  mask_position: v.optional(v.lazy(() => MaskPosition)),
})

export const SetStickerMaskPositionResponse: v.GenericSchema<unknown, T.SetStickerMaskPositionResponse> = v.boolean()

export const SetStickerSetTitleRequest: v.GenericSchema<unknown, T.SetStickerSetTitleRequest> = v.looseObject({
  name: v.string(),
  title: v.string(),
})

export const SetStickerSetTitleResponse: v.GenericSchema<unknown, T.SetStickerSetTitleResponse> = v.boolean()

export const SetStickerSetThumbnailRequest: v.GenericSchema<unknown, T.SetStickerSetThumbnailRequest> = v.looseObject({
  name: v.string(),
  user_id: int64(),
  thumbnail: v.optional(v.union([v.pipe(v.string(), v.startsWith("attach://")), v.string()])),
  format: v.string(),
})

export const SetStickerSetThumbnailResponse: v.GenericSchema<unknown, T.SetStickerSetThumbnailResponse> = v.boolean()

export const SetCustomEmojiStickerSetThumbnailRequest: v.GenericSchema<
  unknown,
  T.SetCustomEmojiStickerSetThumbnailRequest
> = v.looseObject({
  name: v.string(),
  custom_emoji_id: v.optional(v.string()),
})

export const SetCustomEmojiStickerSetThumbnailResponse: v.GenericSchema<
  unknown,
  T.SetCustomEmojiStickerSetThumbnailResponse
> = v.boolean()

export const DeleteStickerSetRequest: v.GenericSchema<unknown, T.DeleteStickerSetRequest> = v.looseObject({
  name: v.string(),
})

export const DeleteStickerSetResponse: v.GenericSchema<unknown, T.DeleteStickerSetResponse> = v.boolean()

export const SendRichMessageRequest: v.GenericSchema<unknown, T.SendRichMessageRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  ephemeral_message_parameters: v.optional(v.lazy(() => EphemeralMessageParameters)),
  rich_message: v.lazy(() => InputRichMessage),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(
    v.union([
      v.lazy(() => InlineKeyboardMarkup),
      v.lazy(() => ReplyKeyboardMarkup),
      v.lazy(() => ReplyKeyboardRemove),
      v.lazy(() => ForceReply),
    ]),
  ),
})

export const SendRichMessageDraftRequest: v.GenericSchema<unknown, T.SendRichMessageDraftRequest> = v.looseObject({
  chat_id: int64(),
  message_thread_id: v.optional(int64()),
  draft_id: int64(),
  rich_message: v.lazy(() => InputRichMessage),
  can_stop: v.optional(v.boolean()),
  keep_on_stop: v.optional(v.boolean()),
})

export const SendRichMessageDraftResponse: v.GenericSchema<unknown, T.SendRichMessageDraftResponse> = v.boolean()

export const AnswerInlineQueryRequest: v.GenericSchema<unknown, T.AnswerInlineQueryRequest> = v.looseObject({
  inline_query_id: v.string(),
  results: v.array(v.lazy(() => InlineQueryResult)),
  cache_time: v.optional(integer()),
  is_personal: v.optional(v.boolean()),
  next_offset: v.optional(v.string()),
  button: v.optional(v.lazy(() => InlineQueryResultsButton)),
})

export const AnswerInlineQueryResponse: v.GenericSchema<unknown, T.AnswerInlineQueryResponse> = v.boolean()

export const SendInvoiceRequest: v.GenericSchema<unknown, T.SendInvoiceRequest> = v.looseObject({
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  direct_messages_topic_id: v.optional(int64()),
  title: v.string(),
  description: v.string(),
  payload: v.string(),
  provider_token: v.optional(v.string()),
  currency: v.string(),
  prices: v.array(v.lazy(() => LabeledPrice)),
  max_tip_amount: v.optional(integer()),
  suggested_tip_amounts: v.optional(v.array(integer())),
  start_parameter: v.optional(v.string()),
  provider_data: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  photo_size: v.optional(integer()),
  photo_width: v.optional(integer()),
  photo_height: v.optional(integer()),
  need_name: v.optional(v.boolean()),
  need_phone_number: v.optional(v.boolean()),
  need_email: v.optional(v.boolean()),
  need_shipping_address: v.optional(v.boolean()),
  send_phone_number_to_provider: v.optional(v.boolean()),
  send_email_to_provider: v.optional(v.boolean()),
  is_flexible: v.optional(v.boolean()),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  suggested_post_parameters: v.optional(v.lazy(() => SuggestedPostParameters)),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const CreateInvoiceLinkRequest: v.GenericSchema<unknown, T.CreateInvoiceLinkRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  title: v.string(),
  description: v.string(),
  payload: v.string(),
  provider_token: v.optional(v.string()),
  currency: v.string(),
  prices: v.array(v.lazy(() => LabeledPrice)),
  subscription_period: v.optional(integer()),
  max_tip_amount: v.optional(integer()),
  suggested_tip_amounts: v.optional(v.array(integer())),
  provider_data: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  photo_size: v.optional(integer()),
  photo_width: v.optional(integer()),
  photo_height: v.optional(integer()),
  need_name: v.optional(v.boolean()),
  need_phone_number: v.optional(v.boolean()),
  need_email: v.optional(v.boolean()),
  need_shipping_address: v.optional(v.boolean()),
  send_phone_number_to_provider: v.optional(v.boolean()),
  send_email_to_provider: v.optional(v.boolean()),
  is_flexible: v.optional(v.boolean()),
})

export const CreateInvoiceLinkResponse: v.GenericSchema<unknown, T.CreateInvoiceLinkResponse> = v.string()

export const AnswerShippingQueryRequest: v.GenericSchema<unknown, T.AnswerShippingQueryRequest> = v.looseObject({
  shipping_query_id: v.string(),
  ok: v.boolean(),
  shipping_options: v.optional(v.array(v.lazy(() => ShippingOption))),
  error_message: v.optional(v.string()),
})

export const AnswerShippingQueryResponse: v.GenericSchema<unknown, T.AnswerShippingQueryResponse> = v.boolean()

export const AnswerPreCheckoutQueryRequest: v.GenericSchema<unknown, T.AnswerPreCheckoutQueryRequest> = v.looseObject({
  pre_checkout_query_id: v.string(),
  ok: v.boolean(),
  error_message: v.optional(v.string()),
})

export const AnswerPreCheckoutQueryResponse: v.GenericSchema<unknown, T.AnswerPreCheckoutQueryResponse> = v.boolean()

export const GetStarTransactionsRequest: v.GenericSchema<unknown, T.GetStarTransactionsRequest> = v.looseObject({
  offset: v.optional(integer()),
  limit: v.optional(integer()),
})

export const RefundStarPaymentRequest: v.GenericSchema<unknown, T.RefundStarPaymentRequest> = v.looseObject({
  user_id: int64(),
  telegram_payment_charge_id: v.string(),
})

export const RefundStarPaymentResponse: v.GenericSchema<unknown, T.RefundStarPaymentResponse> = v.boolean()

export const EditUserStarSubscriptionRequest: v.GenericSchema<unknown, T.EditUserStarSubscriptionRequest> =
  v.looseObject({
    user_id: int64(),
    telegram_payment_charge_id: v.string(),
    is_canceled: v.boolean(),
  })

export const EditUserStarSubscriptionResponse: v.GenericSchema<unknown, T.EditUserStarSubscriptionResponse> =
  v.boolean()

export const SetPassportDataErrorsRequest: v.GenericSchema<unknown, T.SetPassportDataErrorsRequest> = v.looseObject({
  user_id: int64(),
  errors: v.array(v.lazy(() => PassportElementError)),
})

export const SetPassportDataErrorsResponse: v.GenericSchema<unknown, T.SetPassportDataErrorsResponse> = v.boolean()

export const SendGameRequest: v.GenericSchema<unknown, T.SendGameRequest> = v.looseObject({
  business_connection_id: v.optional(v.string()),
  chat_id: v.union([int64(), v.string()]),
  message_thread_id: v.optional(int64()),
  game_short_name: v.string(),
  disable_notification: v.optional(v.boolean()),
  protect_content: v.optional(v.boolean()),
  allow_paid_broadcast: v.optional(v.boolean()),
  message_effect_id: v.optional(v.string()),
  reply_parameters: v.optional(v.lazy(() => ReplyParameters)),
  reply_markup: v.optional(v.lazy(() => InlineKeyboardMarkup)),
})

export const SetGameScoreRequest: v.GenericSchema<unknown, T.SetGameScoreRequest> = v.looseObject({
  user_id: int64(),
  score: integer(),
  force: v.optional(v.boolean()),
  disable_edit_message: v.optional(v.boolean()),
  chat_id: v.optional(int64()),
  message_id: v.optional(int64()),
  inline_message_id: v.optional(v.string()),
})

export const SetGameScoreResponse: v.GenericSchema<unknown, T.SetGameScoreResponse> = v.union([
  v.lazy(() => Message),
  v.boolean(),
])

export const GetGameHighScoresRequest: v.GenericSchema<unknown, T.GetGameHighScoresRequest> = v.looseObject({
  user_id: int64(),
  chat_id: v.optional(int64()),
  message_id: v.optional(int64()),
  inline_message_id: v.optional(v.string()),
})

export const GetGameHighScoresResponse: v.GenericSchema<unknown, T.GetGameHighScoresResponse> = v.array(
  v.lazy(() => GameHighScore),
)

export const schemas = {
  Update,
  WebhookInfo,
  User,
  Chat,
  ChatFullInfo,
  Message,
  MessageId,
  InaccessibleMessage,
  MaybeInaccessibleMessage,
  MessageEntity,
  TextQuote,
  ExternalReplyInfo,
  ReplyParameters,
  EphemeralMessageParameters,
  MessageOrigin,
  MessageOriginUser,
  MessageOriginHiddenUser,
  MessageOriginChat,
  MessageOriginChannel,
  PhotoSize,
  Animation,
  Audio,
  Document,
  LivePhoto,
  Story,
  VideoQuality,
  Video,
  VideoNote,
  Voice,
  PaidMediaInfo,
  PaidMedia,
  PaidMediaLivePhoto,
  PaidMediaPhoto,
  PaidMediaPreview,
  PaidMediaVideo,
  Contact,
  Dice,
  Link,
  PollMedia,
  InputPollMedia,
  InputPollOptionMedia,
  PollOption,
  InputPollOption,
  PollAnswer,
  Poll,
  ChecklistTask,
  Checklist,
  InputChecklistTask,
  InputChecklist,
  Location,
  Venue,
  WebAppData,
  ProximityAlertTriggered,
  MessageAutoDeleteTimerChanged,
  ManagedBotCreated,
  ManagedBotUpdated,
  BotSubscriptionUpdated,
  MessageGenerationStopped,
  PollOptionAdded,
  PollOptionDeleted,
  ChatBoostAdded,
  BackgroundFill,
  BackgroundFillSolid,
  BackgroundFillGradient,
  BackgroundFillFreeformGradient,
  BackgroundType,
  BackgroundTypeFill,
  BackgroundTypeWallpaper,
  BackgroundTypePattern,
  BackgroundTypeChatTheme,
  ChatBackground,
  ChecklistTasksDone,
  ChecklistTasksAdded,
  CommunityChatAdded,
  CommunityChatJoined,
  CommunityChatRemoved,
  ForumTopicCreated,
  ForumTopicClosed,
  ForumTopicEdited,
  ForumTopicReopened,
  GeneralForumTopicHidden,
  GeneralForumTopicUnhidden,
  SharedUser,
  UsersShared,
  ChatShared,
  WriteAccessAllowed,
  VideoChatScheduled,
  VideoChatStarted,
  VideoChatEnded,
  VideoChatParticipantsInvited,
  PaidMessagePriceChanged,
  DirectMessagePriceChanged,
  SuggestedPostApproved,
  SuggestedPostApprovalFailed,
  SuggestedPostDeclined,
  SuggestedPostPaid,
  SuggestedPostRefunded,
  GiveawayCreated,
  Giveaway,
  GiveawayWinners,
  GiveawayCompleted,
  LinkPreviewOptions,
  SuggestedPostPrice,
  SuggestedPostInfo,
  SuggestedPostParameters,
  DirectMessagesTopic,
  UserProfilePhotos,
  UserProfileAudios,
  File,
  WebAppInfo,
  ReplyKeyboardMarkup,
  KeyboardButton,
  KeyboardButtonRequestUsers,
  KeyboardButtonRequestChat,
  KeyboardButtonRequestManagedBot,
  KeyboardButtonPollType,
  ReplyKeyboardRemove,
  InlineKeyboardMarkup,
  InlineKeyboardButton,
  LoginUrl,
  SwitchInlineQueryChosenChat,
  CopyTextButton,
  DisabledButton,
  CallbackQuery,
  ForceReply,
  Community,
  ChatPhoto,
  ChatInviteLink,
  ChatAdministratorRights,
  ChatMemberUpdated,
  ChatMember,
  ChatMemberOwner,
  ChatMemberAdministrator,
  ChatMemberMember,
  ChatMemberRestricted,
  ChatMemberLeft,
  ChatMemberBanned,
  ChatJoinRequest,
  ChatPermissions,
  Birthdate,
  BusinessIntro,
  BusinessLocation,
  BusinessOpeningHoursInterval,
  BusinessOpeningHours,
  UserRating,
  StoryAreaPosition,
  LocationAddress,
  StoryAreaType,
  StoryAreaTypeLocation,
  StoryAreaTypeSuggestedReaction,
  StoryAreaTypeLink,
  StoryAreaTypeWeather,
  StoryAreaTypeUniqueGift,
  StoryArea,
  ChatLocation,
  ReactionType,
  ReactionTypeEmoji,
  ReactionTypeCustomEmoji,
  ReactionTypePaid,
  ReactionCount,
  MessageReactionUpdated,
  MessageReactionCountUpdated,
  ForumTopic,
  GiftBackground,
  Gift,
  Gifts,
  UniqueGiftModel,
  UniqueGiftSymbol,
  UniqueGiftBackdropColors,
  UniqueGiftBackdrop,
  UniqueGiftColors,
  UniqueGift,
  GiftInfo,
  UniqueGiftInfo,
  OwnedGift,
  OwnedGiftRegular,
  OwnedGiftUnique,
  OwnedGifts,
  BotAccessSettings,
  AcceptedGiftTypes,
  StarAmount,
  BotCommand,
  BotCommandScope,
  BotCommandScopeDefault,
  BotCommandScopeAllPrivateChats,
  BotCommandScopeAllGroupChats,
  BotCommandScopeAllChatAdministrators,
  BotCommandScopeChat,
  BotCommandScopeChatAdministrators,
  BotCommandScopeChatMember,
  BotName,
  BotDescription,
  BotShortDescription,
  MenuButton,
  MenuButtonCommands,
  MenuButtonWebApp,
  MenuButtonDefault,
  ChatBoostSource,
  ChatBoostSourcePremium,
  ChatBoostSourceGiftCode,
  ChatBoostSourceGiveaway,
  ChatBoost,
  ChatBoostUpdated,
  ChatBoostRemoved,
  ChatOwnerLeft,
  ChatOwnerChanged,
  UserChatBoosts,
  BusinessBotRights,
  BusinessConnection,
  BusinessMessagesDeleted,
  SentWebAppMessage,
  SentGuestMessage,
  PreparedInlineMessage,
  PreparedKeyboardButton,
  ResponseParameters,
  InputMedia,
  InputMediaAnimation,
  InputMediaAudio,
  InputMediaDocument,
  InputMediaLink,
  InputMediaLivePhoto,
  InputMediaLocation,
  InputMediaPhoto,
  InputMediaSticker,
  InputMediaVenue,
  InputMediaVideo,
  InputMediaVoiceNote,
  InputFile,
  InputPaidMedia,
  InputPaidMediaLivePhoto,
  InputPaidMediaPhoto,
  InputPaidMediaVideo,
  InputProfilePhoto,
  InputProfilePhotoStatic,
  InputProfilePhotoAnimated,
  InputStoryContent,
  InputStoryContentPhoto,
  InputStoryContentVideo,
  Sticker,
  StickerSet,
  MaskPosition,
  InputSticker,
  RichMessage,
  InputRichMessage,
  InputRichMessageMedia,
  RichMessageButton,
  RichText,
  RichTextBold,
  RichTextItalic,
  RichTextUnderline,
  RichTextStrikethrough,
  RichTextSpoiler,
  RichTextDateTime,
  RichTextTextMention,
  RichTextSubscript,
  RichTextSuperscript,
  RichTextMarked,
  RichTextCode,
  RichTextCustomEmoji,
  RichTextMathematicalExpression,
  RichTextUrl,
  RichTextEmailAddress,
  RichTextPhoneNumber,
  RichTextBankCardNumber,
  RichTextMention,
  RichTextHashtag,
  RichTextCashtag,
  RichTextBotCommand,
  RichTextButton,
  RichTextAnchor,
  RichTextAnchorLink,
  RichTextReference,
  RichTextReferenceLink,
  RichBlockCaption,
  RichBlockTableCell,
  RichBlockListItem,
  RichBlock,
  RichBlockParagraph,
  RichBlockSectionHeading,
  RichBlockPreformatted,
  RichBlockFooter,
  RichBlockDivider,
  RichBlockMathematicalExpression,
  RichBlockAnchor,
  RichBlockList,
  RichBlockBlockQuotation,
  RichBlockExpandableBlockQuotation,
  RichBlockPullQuotation,
  RichBlockCollage,
  RichBlockSlideshow,
  RichBlockTable,
  RichBlockDetails,
  RichBlockMap,
  RichBlockButtons,
  RichBlockAnimation,
  RichBlockAudio,
  RichBlockDocument,
  RichBlockPhoto,
  RichBlockVideo,
  RichBlockVoiceNote,
  RichBlockThinking,
  InputRichBlockListItem,
  InputRichBlock,
  InputRichBlockParagraph,
  InputRichBlockSectionHeading,
  InputRichBlockPreformatted,
  InputRichBlockFooter,
  InputRichBlockDivider,
  InputRichBlockMathematicalExpression,
  InputRichBlockAnchor,
  InputRichBlockList,
  InputRichBlockBlockQuotation,
  InputRichBlockExpandableBlockQuotation,
  InputRichBlockPullQuotation,
  InputRichBlockCollage,
  InputRichBlockSlideshow,
  InputRichBlockTable,
  InputRichBlockDetails,
  InputRichBlockMap,
  InputRichBlockButtons,
  InputRichBlockAnimation,
  InputRichBlockAudio,
  InputRichBlockDocument,
  InputRichBlockPhoto,
  InputRichBlockVideo,
  InputRichBlockVoiceNote,
  InputRichBlockThinking,
  InlineQuery,
  InlineQueryResultsButton,
  InlineQueryResult,
  InlineQueryResultArticle,
  InlineQueryResultPhoto,
  InlineQueryResultGif,
  InlineQueryResultMpeg4Gif,
  InlineQueryResultVideo,
  InlineQueryResultAudio,
  InlineQueryResultVoice,
  InlineQueryResultDocument,
  InlineQueryResultLocation,
  InlineQueryResultVenue,
  InlineQueryResultContact,
  InlineQueryResultGame,
  InlineQueryResultCachedPhoto,
  InlineQueryResultCachedGif,
  InlineQueryResultCachedMpeg4Gif,
  InlineQueryResultCachedSticker,
  InlineQueryResultCachedDocument,
  InlineQueryResultCachedVideo,
  InlineQueryResultCachedVoice,
  InlineQueryResultCachedAudio,
  InputMessageContent,
  InputTextMessageContent,
  InputRichMessageContent,
  InputLocationMessageContent,
  InputVenueMessageContent,
  InputContactMessageContent,
  InputInvoiceMessageContent,
  ChosenInlineResult,
  LabeledPrice,
  Invoice,
  ShippingAddress,
  OrderInfo,
  ShippingOption,
  SuccessfulPayment,
  RefundedPayment,
  ShippingQuery,
  PreCheckoutQuery,
  PaidMediaPurchased,
  RevenueWithdrawalState,
  RevenueWithdrawalStatePending,
  RevenueWithdrawalStateSucceeded,
  RevenueWithdrawalStateFailed,
  AffiliateInfo,
  TransactionPartner,
  TransactionPartnerUser,
  TransactionPartnerChat,
  TransactionPartnerAffiliateProgram,
  TransactionPartnerFragment,
  TransactionPartnerTelegramAds,
  TransactionPartnerTelegramApi,
  TransactionPartnerOther,
  StarTransaction,
  StarTransactions,
  PassportData,
  PassportFile,
  EncryptedPassportElement,
  EncryptedCredentials,
  PassportElementError,
  PassportElementErrorDataField,
  PassportElementErrorFrontSide,
  PassportElementErrorReverseSide,
  PassportElementErrorSelfie,
  PassportElementErrorFile,
  PassportElementErrorFiles,
  PassportElementErrorTranslationFile,
  PassportElementErrorTranslationFiles,
  PassportElementErrorUnspecified,
  Game,
  CallbackGame,
  GameHighScore,
  GetUpdatesRequest,
  GetUpdatesResponse,
  SetWebhookRequest,
  SetWebhookResponse,
  DeleteWebhookRequest,
  DeleteWebhookResponse,
  LogOutResponse,
  CloseResponse,
  SendMessageRequest,
  ForwardMessageRequest,
  ForwardMessagesRequest,
  ForwardMessagesResponse,
  CopyMessageRequest,
  CopyMessagesRequest,
  CopyMessagesResponse,
  SendPhotoRequest,
  SendLivePhotoRequest,
  SendAudioRequest,
  SendDocumentRequest,
  SendVideoRequest,
  SendAnimationRequest,
  SendVoiceRequest,
  SendVideoNoteRequest,
  SendPaidMediaRequest,
  SendMediaGroupRequest,
  SendMediaGroupResponse,
  SendLocationRequest,
  SendVenueRequest,
  SendContactRequest,
  SendPollRequest,
  SendChecklistRequest,
  SendDiceRequest,
  SendMessageDraftRequest,
  SendMessageDraftResponse,
  SendChatActionRequest,
  SendChatActionResponse,
  SetMessageReactionRequest,
  SetMessageReactionResponse,
  GetUserProfilePhotosRequest,
  GetUserProfileAudiosRequest,
  SetUserEmojiStatusRequest,
  SetUserEmojiStatusResponse,
  GetFileRequest,
  BanChatMemberRequest,
  BanChatMemberResponse,
  UnbanChatMemberRequest,
  UnbanChatMemberResponse,
  RestrictChatMemberRequest,
  RestrictChatMemberResponse,
  PromoteChatMemberRequest,
  PromoteChatMemberResponse,
  SetChatAdministratorCustomTitleRequest,
  SetChatAdministratorCustomTitleResponse,
  SetChatMemberTagRequest,
  SetChatMemberTagResponse,
  BanChatSenderChatRequest,
  BanChatSenderChatResponse,
  UnbanChatSenderChatRequest,
  UnbanChatSenderChatResponse,
  SetChatPermissionsRequest,
  SetChatPermissionsResponse,
  ExportChatInviteLinkRequest,
  ExportChatInviteLinkResponse,
  CreateChatInviteLinkRequest,
  EditChatInviteLinkRequest,
  CreateChatSubscriptionInviteLinkRequest,
  EditChatSubscriptionInviteLinkRequest,
  RevokeChatInviteLinkRequest,
  ApproveChatJoinRequestRequest,
  ApproveChatJoinRequestResponse,
  DeclineChatJoinRequestRequest,
  DeclineChatJoinRequestResponse,
  AnswerChatJoinRequestQueryRequest,
  AnswerChatJoinRequestQueryResponse,
  SendChatJoinRequestWebAppRequest,
  SendChatJoinRequestWebAppResponse,
  SetChatPhotoRequest,
  SetChatPhotoResponse,
  DeleteChatPhotoRequest,
  DeleteChatPhotoResponse,
  SetChatTitleRequest,
  SetChatTitleResponse,
  SetChatDescriptionRequest,
  SetChatDescriptionResponse,
  PinChatMessageRequest,
  PinChatMessageResponse,
  UnpinChatMessageRequest,
  UnpinChatMessageResponse,
  UnpinAllChatMessagesRequest,
  UnpinAllChatMessagesResponse,
  LeaveChatRequest,
  LeaveChatResponse,
  GetChatRequest,
  GetChatAdministratorsRequest,
  GetChatAdministratorsResponse,
  GetChatMemberCountRequest,
  GetChatMemberCountResponse,
  GetChatMemberRequest,
  GetUserPersonalChatMessagesRequest,
  GetUserPersonalChatMessagesResponse,
  SetChatStickerSetRequest,
  SetChatStickerSetResponse,
  DeleteChatStickerSetRequest,
  DeleteChatStickerSetResponse,
  GetForumTopicIconStickersResponse,
  CreateForumTopicRequest,
  EditForumTopicRequest,
  EditForumTopicResponse,
  CloseForumTopicRequest,
  CloseForumTopicResponse,
  ReopenForumTopicRequest,
  ReopenForumTopicResponse,
  DeleteForumTopicRequest,
  DeleteForumTopicResponse,
  UnpinAllForumTopicMessagesRequest,
  UnpinAllForumTopicMessagesResponse,
  EditGeneralForumTopicRequest,
  EditGeneralForumTopicResponse,
  CloseGeneralForumTopicRequest,
  CloseGeneralForumTopicResponse,
  ReopenGeneralForumTopicRequest,
  ReopenGeneralForumTopicResponse,
  HideGeneralForumTopicRequest,
  HideGeneralForumTopicResponse,
  UnhideGeneralForumTopicRequest,
  UnhideGeneralForumTopicResponse,
  UnpinAllGeneralForumTopicMessagesRequest,
  UnpinAllGeneralForumTopicMessagesResponse,
  AnswerCallbackQueryRequest,
  AnswerCallbackQueryResponse,
  AnswerGuestQueryRequest,
  GetUserChatBoostsRequest,
  GetBusinessConnectionRequest,
  GetManagedBotTokenRequest,
  GetManagedBotTokenResponse,
  ReplaceManagedBotTokenRequest,
  ReplaceManagedBotTokenResponse,
  GetManagedBotAccessSettingsRequest,
  SetManagedBotAccessSettingsRequest,
  SetManagedBotAccessSettingsResponse,
  SetMyCommandsRequest,
  SetMyCommandsResponse,
  DeleteMyCommandsRequest,
  DeleteMyCommandsResponse,
  GetMyCommandsRequest,
  GetMyCommandsResponse,
  SetMyNameRequest,
  SetMyNameResponse,
  GetMyNameRequest,
  SetMyDescriptionRequest,
  SetMyDescriptionResponse,
  GetMyDescriptionRequest,
  SetMyShortDescriptionRequest,
  SetMyShortDescriptionResponse,
  GetMyShortDescriptionRequest,
  SetMyProfilePhotoRequest,
  SetMyProfilePhotoResponse,
  RemoveMyProfilePhotoResponse,
  SetChatMenuButtonRequest,
  SetChatMenuButtonResponse,
  GetChatMenuButtonRequest,
  SetMyDefaultAdministratorRightsRequest,
  SetMyDefaultAdministratorRightsResponse,
  GetMyDefaultAdministratorRightsRequest,
  SendGiftRequest,
  SendGiftResponse,
  GiftPremiumSubscriptionRequest,
  GiftPremiumSubscriptionResponse,
  VerifyUserRequest,
  VerifyUserResponse,
  VerifyChatRequest,
  VerifyChatResponse,
  RemoveUserVerificationRequest,
  RemoveUserVerificationResponse,
  RemoveChatVerificationRequest,
  RemoveChatVerificationResponse,
  ReadBusinessMessageRequest,
  ReadBusinessMessageResponse,
  DeleteBusinessMessagesRequest,
  DeleteBusinessMessagesResponse,
  SetBusinessAccountNameRequest,
  SetBusinessAccountNameResponse,
  SetBusinessAccountUsernameRequest,
  SetBusinessAccountUsernameResponse,
  SetBusinessAccountBioRequest,
  SetBusinessAccountBioResponse,
  SetBusinessAccountProfilePhotoRequest,
  SetBusinessAccountProfilePhotoResponse,
  RemoveBusinessAccountProfilePhotoRequest,
  RemoveBusinessAccountProfilePhotoResponse,
  SetBusinessAccountGiftSettingsRequest,
  SetBusinessAccountGiftSettingsResponse,
  GetBusinessAccountStarBalanceRequest,
  TransferBusinessAccountStarsRequest,
  TransferBusinessAccountStarsResponse,
  GetBusinessAccountGiftsRequest,
  GetUserGiftsRequest,
  GetChatGiftsRequest,
  ConvertGiftToStarsRequest,
  ConvertGiftToStarsResponse,
  UpgradeGiftRequest,
  UpgradeGiftResponse,
  TransferGiftRequest,
  TransferGiftResponse,
  PostStoryRequest,
  RepostStoryRequest,
  EditStoryRequest,
  DeleteStoryRequest,
  DeleteStoryResponse,
  AnswerWebAppQueryRequest,
  SavePreparedInlineMessageRequest,
  SavePreparedKeyboardButtonRequest,
  EditMessageTextRequest,
  EditMessageTextResponse,
  EditMessageCaptionRequest,
  EditMessageCaptionResponse,
  EditMessageMediaRequest,
  EditMessageMediaResponse,
  EditMessageLiveLocationRequest,
  EditMessageLiveLocationResponse,
  StopMessageLiveLocationRequest,
  StopMessageLiveLocationResponse,
  EditMessageChecklistRequest,
  EditMessageReplyMarkupRequest,
  EditMessageReplyMarkupResponse,
  StopPollRequest,
  EditEphemeralMessageTextRequest,
  EditEphemeralMessageTextResponse,
  EditEphemeralMessageMediaRequest,
  EditEphemeralMessageMediaResponse,
  EditEphemeralMessageCaptionRequest,
  EditEphemeralMessageCaptionResponse,
  EditEphemeralMessageReplyMarkupRequest,
  EditEphemeralMessageReplyMarkupResponse,
  ApproveSuggestedPostRequest,
  ApproveSuggestedPostResponse,
  DeclineSuggestedPostRequest,
  DeclineSuggestedPostResponse,
  DeleteMessageRequest,
  DeleteMessageResponse,
  DeleteMessagesRequest,
  DeleteMessagesResponse,
  DeleteEphemeralMessageRequest,
  DeleteEphemeralMessageResponse,
  DeleteMessageReactionRequest,
  DeleteMessageReactionResponse,
  DeleteAllMessageReactionsRequest,
  DeleteAllMessageReactionsResponse,
  SendStickerRequest,
  GetStickerSetRequest,
  GetCustomEmojiStickersRequest,
  GetCustomEmojiStickersResponse,
  UploadStickerFileRequest,
  CreateNewStickerSetRequest,
  CreateNewStickerSetResponse,
  AddStickerToSetRequest,
  AddStickerToSetResponse,
  SetStickerPositionInSetRequest,
  SetStickerPositionInSetResponse,
  DeleteStickerFromSetRequest,
  DeleteStickerFromSetResponse,
  ReplaceStickerInSetRequest,
  ReplaceStickerInSetResponse,
  SetStickerEmojiListRequest,
  SetStickerEmojiListResponse,
  SetStickerKeywordsRequest,
  SetStickerKeywordsResponse,
  SetStickerMaskPositionRequest,
  SetStickerMaskPositionResponse,
  SetStickerSetTitleRequest,
  SetStickerSetTitleResponse,
  SetStickerSetThumbnailRequest,
  SetStickerSetThumbnailResponse,
  SetCustomEmojiStickerSetThumbnailRequest,
  SetCustomEmojiStickerSetThumbnailResponse,
  DeleteStickerSetRequest,
  DeleteStickerSetResponse,
  SendRichMessageRequest,
  SendRichMessageDraftRequest,
  SendRichMessageDraftResponse,
  AnswerInlineQueryRequest,
  AnswerInlineQueryResponse,
  SendInvoiceRequest,
  CreateInvoiceLinkRequest,
  CreateInvoiceLinkResponse,
  AnswerShippingQueryRequest,
  AnswerShippingQueryResponse,
  AnswerPreCheckoutQueryRequest,
  AnswerPreCheckoutQueryResponse,
  GetStarTransactionsRequest,
  RefundStarPaymentRequest,
  RefundStarPaymentResponse,
  EditUserStarSubscriptionRequest,
  EditUserStarSubscriptionResponse,
  SetPassportDataErrorsRequest,
  SetPassportDataErrorsResponse,
  SendGameRequest,
  SetGameScoreRequest,
  SetGameScoreResponse,
  GetGameHighScoresRequest,
  GetGameHighScoresResponse,
} as const
