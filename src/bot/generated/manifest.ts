// GENERATED. DO NOT EDIT.
// Source: spec/bot/api.json
// Run: pnpm bot:generate

import type { ManifestOperation } from "@leemour/cli-core/codegen"

export const operations: readonly ManifestOperation[] = [
  {
    id: "getUpdates",
    command: "get-updates",
    binding: {
      kind: "rpc",
      name: "getUpdates",
    },
    effect: "destructive",
    summary:
      "Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects.",
    description:
      "Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects.",
    tags: [],
    parameters: [
      {
        name: "offset",
        in: "body",
        required: false,
        description:
          "Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will be forgotten.",
        schema: {
          type: "integer",
          description:
            "Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will be forgotten.",
        },
      },
      {
        name: "limit",
        in: "body",
        required: false,
        description:
          "Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
        schema: {
          type: "integer",
          description:
            "Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
        },
      },
      {
        name: "timeout",
        in: "body",
        required: false,
        description:
          "Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.",
        schema: {
          type: "integer",
          description:
            "Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.",
        },
      },
      {
        name: "allowed_updates",
        in: "body",
        required: false,
        description:
          'A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn\'t affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time.',
        schema: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            'A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn\'t affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time.',
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "GetUpdatesRequest",
    },
    response: {
      confidence: "contract",
      schema: "GetUpdatesResponse",
    },
  },
  {
    id: "setWebhook",
    command: "set-webhook",
    binding: {
      kind: "rpc",
      name: "setWebhook",
    },
    effect: "write",
    summary:
      "Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request (a request with response HTTP status code different from 2XY), we will repeat the request and give up after a reasonable amount of attempts. Returns True on success.",
    description:
      'Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized Update. In case of an unsuccessful request (a request with response HTTP status code different from 2XY), we will repeat the request and give up after a reasonable amount of attempts. Returns True on success.\n\nIf you\'d like to make sure that the webhook was set by you, you can specify secret data in the parameter secret_token. If specified, the request will contain a header "X-Telegram-Bot-Api-Secret-Token" with the secret token as content.',
    tags: [],
    parameters: [
      {
        name: "url",
        in: "body",
        required: true,
        description: "HTTPS URL to send updates to. Use an empty string to remove webhook integration.",
        schema: {
          type: "string",
          description: "HTTPS URL to send updates to. Use an empty string to remove webhook integration.",
        },
      },
      {
        name: "certificate",
        in: "body",
        required: false,
        description:
          "Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details.",
        schema: {
          type: "string",
          format: "binary",
          description:
            "Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details.",
        },
      },
      {
        name: "ip_address",
        in: "body",
        required: false,
        description:
          "The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS",
        schema: {
          type: "string",
          description:
            "The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS",
        },
      },
      {
        name: "max_connections",
        in: "body",
        required: false,
        description:
          "The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput.",
        schema: {
          type: "integer",
          description:
            "The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput.",
        },
      },
      {
        name: "allowed_updates",
        in: "body",
        required: false,
        description:
          'A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn\'t affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.',
        schema: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            'A JSON-serialized list of the update types you want your bot to receive. For example, specify ["message", "edited_channel_post", "callback_query"] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member, message_reaction, and message_reaction_count (default). If not specified, the previous setting will be used. Please note that this parameter doesn\'t affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.',
        },
      },
      {
        name: "drop_pending_updates",
        in: "body",
        required: false,
        description: "Pass True to drop all pending updates",
        schema: {
          type: "boolean",
          description: "Pass True to drop all pending updates",
        },
      },
      {
        name: "secret_token",
        in: "body",
        required: false,
        description:
          'A secret token to be sent in a header "X-Telegram-Bot-Api-Secret-Token" in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header is useful to ensure that the request comes from a webhook set by you.',
        schema: {
          type: "string",
          description:
            'A secret token to be sent in a header "X-Telegram-Bot-Api-Secret-Token" in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header is useful to ensure that the request comes from a webhook set by you.',
          sensitive: true,
        },
        sensitive: true,
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetWebhookRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetWebhookResponse",
    },
  },
  {
    id: "deleteWebhook",
    command: "delete-webhook",
    binding: {
      kind: "rpc",
      name: "deleteWebhook",
    },
    effect: "destructive",
    summary:
      "Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success.",
    description:
      "Use this method to remove webhook integration if you decide to switch back to getUpdates. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "drop_pending_updates",
        in: "body",
        required: false,
        description: "Pass True to drop all pending updates",
        schema: {
          type: "boolean",
          description: "Pass True to drop all pending updates",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DeleteWebhookRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteWebhookResponse",
    },
  },
  {
    id: "getWebhookInfo",
    command: "get-webhook-info",
    binding: {
      kind: "rpc",
      name: "getWebhookInfo",
    },
    effect: "read",
    summary:
      "Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.",
    description:
      "Use this method to get current webhook status. Requires no parameters. On success, returns a WebhookInfo object. If the bot is using getUpdates, will return an object with the url field empty.",
    tags: [],
    parameters: [],
    response: {
      confidence: "contract",
      schema: "WebhookInfo",
    },
  },
  {
    id: "getMe",
    command: "get-me",
    binding: {
      kind: "rpc",
      name: "getMe",
    },
    effect: "read",
    summary:
      "A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a User object.",
    description:
      "A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a User object.",
    tags: [],
    parameters: [],
    response: {
      confidence: "contract",
      schema: "User",
    },
  },
  {
    id: "logOut",
    command: "log-out",
    binding: {
      kind: "rpc",
      name: "logOut",
    },
    effect: "destructive",
    summary:
      "Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters.",
    description:
      "Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters.",
    tags: [],
    parameters: [],
    response: {
      confidence: "contract",
      schema: "LogOutResponse",
    },
  },
  {
    id: "close",
    command: "close",
    binding: {
      kind: "rpc",
      name: "close",
    },
    effect: "destructive",
    summary:
      "Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters.",
    description:
      "Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters.",
    tags: [],
    parameters: [],
    response: {
      confidence: "contract",
      schema: "CloseResponse",
    },
  },
  {
    id: "sendMessage",
    command: "send-message",
    binding: {
      kind: "rpc",
      name: "sendMessage",
    },
    effect: "write",
    summary: "Use this method to send text messages. On success, the sent Message is returned.",
    description: "Use this method to send text messages. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "text",
        in: "body",
        required: true,
        description: "Text of the message to be sent, 1-4096 characters after entities parsing",
        schema: {
          type: "string",
          description: "Text of the message to be sent, 1-4096 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the message text. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the message text. See formatting options for more details.",
        },
      },
      {
        name: "entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
        },
      },
      {
        name: "link_preview_options",
        in: "body",
        required: false,
        description: "Link preview generation options for the message",
        schema: {
          type: "ref",
          ref: "LinkPreviewOptions",
          description: "Link preview generation options for the message",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "forwardMessage",
    command: "forward-message",
    binding: {
      kind: "rpc",
      name: "forwardMessage",
    },
    effect: "write",
    summary:
      "Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.",
    description:
      "Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat",
        },
      },
      {
        name: "from_chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format @username)",
        schema: {
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
      },
      {
        name: "video_start_timestamp",
        in: "body",
        required: false,
        description: "New start timestamp for the forwarded video in the message",
        schema: {
          type: "integer",
          description: "New start timestamp for the forwarded video in the message",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the forwarded message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the forwarded message from forwarding and saving",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the message effect to be added to the message; only available when forwarding to private chats",
        schema: {
          type: "string",
          description:
            "Unique identifier of the message effect to be added to the message; only available when forwarding to private chats",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only",
        },
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Message identifier in the chat specified in from_chat_id",
        schema: {
          type: "integer",
          format: "int64",
          description: "Message identifier in the chat specified in from_chat_id",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ForwardMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "forwardMessages",
    command: "forward-messages",
    binding: {
      kind: "rpc",
      name: "forwardMessages",
    },
    effect: "write",
    summary:
      "Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an Array of MessageId of the sent messages is returned.",
    description:
      "Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an Array of MessageId of the sent messages is returned.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat",
        },
      },
      {
        name: "from_chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format @username)",
        schema: {
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
      },
      {
        name: "message_ids",
        in: "body",
        required: true,
        description:
          "A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to forward. The identifiers must be specified in a strictly increasing order.",
        schema: {
          type: "array",
          items: {
            type: "integer",
          },
          description:
            "A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to forward. The identifiers must be specified in a strictly increasing order.",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the messages silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the messages silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the forwarded messages from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the forwarded messages from forwarding and saving",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ForwardMessagesRequest",
    },
    response: {
      confidence: "contract",
      schema: "ForwardMessagesResponse",
    },
  },
  {
    id: "copyMessage",
    command: "copy-message",
    binding: {
      kind: "rpc",
      name: "copyMessage",
    },
    effect: "write",
    summary:
      "Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.",
    description:
      "Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessage, but the copied message doesn't have a link to the original message. Returns the MessageId of the sent message on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "from_chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the chat where the original message was sent (or username of the target bot, supergroup or channel in the format @username)",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Message identifier in the chat specified in from_chat_id",
        schema: {
          type: "integer",
          format: "int64",
          description: "Message identifier in the chat specified in from_chat_id",
        },
      },
      {
        name: "video_start_timestamp",
        in: "body",
        required: false,
        description: "New start timestamp for the copied video in the message",
        schema: {
          type: "integer",
          description: "New start timestamp for the copied video in the message",
        },
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description:
          "New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept.",
        schema: {
          type: "string",
          description:
            "New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept.",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the new caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the new caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "show_caption_above_media",
        in: "body",
        required: false,
        description:
          "Pass True if the caption must be shown above the message media. Ignored if a new caption isn't specified.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the caption must be shown above the message media. Ignored if a new caption isn't specified.",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the message effect to be added to the message; only available when copying to private chats",
        schema: {
          type: "string",
          description:
            "Unique identifier of the message effect to be added to the message; only available when copying to private chats",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "CopyMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "MessageId",
    },
  },
  {
    id: "copyMessages",
    command: "copy-messages",
    binding: {
      kind: "rpc",
      name: "copyMessages",
    },
    effect: "write",
    summary:
      "Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an Array of MessageId of the sent messages is returned.",
    description:
      "Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz poll can be copied only if the value of the field correct_option_ids is known to the bot. The method is analogous to the method forwardMessages, but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an Array of MessageId of the sent messages is returned.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat",
        },
      },
      {
        name: "from_chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the chat where the original messages were sent (or username of the target bot, supergroup or channel in the format @username)",
        schema: {
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
      },
      {
        name: "message_ids",
        in: "body",
        required: true,
        description:
          "A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to copy. The identifiers must be specified in a strictly increasing order.",
        schema: {
          type: "array",
          items: {
            type: "integer",
          },
          description:
            "A JSON-serialized list of 1-100 identifiers of messages in the chat from_chat_id to copy. The identifiers must be specified in a strictly increasing order.",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the messages silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the messages silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent messages from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent messages from forwarding and saving",
        },
      },
      {
        name: "remove_caption",
        in: "body",
        required: false,
        description: "Pass True to copy the messages without their captions",
        schema: {
          type: "boolean",
          description: "Pass True to copy the messages without their captions",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "CopyMessagesRequest",
    },
    response: {
      confidence: "contract",
      schema: "CopyMessagesResponse",
    },
  },
  {
    id: "sendPhoto",
    command: "send-photo",
    binding: {
      kind: "rpc",
      name: "sendPhoto",
    },
    effect: "write",
    summary: "Use this method to send photos. On success, the sent Message is returned.",
    description: "Use this method to send photos. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "photo",
        in: "body",
        required: true,
        description:
          "Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description:
          "Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description:
            "Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the photo caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the photo caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "show_caption_above_media",
        in: "body",
        required: false,
        description: "Pass True if the caption must be shown above the message media",
        schema: {
          type: "boolean",
          description: "Pass True if the caption must be shown above the message media",
        },
      },
      {
        name: "has_spoiler",
        in: "body",
        required: false,
        description: "Pass True if the photo needs to be covered with a spoiler animation",
        schema: {
          type: "boolean",
          description: "Pass True if the photo needs to be covered with a spoiler animation",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendPhotoRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendLivePhoto",
    command: "send-live-photo",
    binding: {
      kind: "rpc",
      name: "sendLivePhoto",
    },
    effect: "write",
    summary: "Use this method to send live photos. On success, the sent Message is returned.",
    description: "Use this method to send live photos. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "live_photo",
        in: "body",
        required: true,
        description:
          "Live photo video to send. The video must be no longer than 10 seconds and must not exceed 10 MB in size. Pass a file_id as String to send a video that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported.",
        schema: {
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
      },
      {
        name: "photo",
        in: "body",
        required: true,
        description:
          "The static photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending live photos by a URL is currently unsupported.",
        schema: {
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
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description:
          "Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description:
            "Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the video caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the video caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "show_caption_above_media",
        in: "body",
        required: false,
        description: "Pass True if the caption must be shown above the message media",
        schema: {
          type: "boolean",
          description: "Pass True if the caption must be shown above the message media",
        },
      },
      {
        name: "has_spoiler",
        in: "body",
        required: false,
        description: "Pass True if the video needs to be covered with a spoiler animation",
        schema: {
          type: "boolean",
          description: "Pass True if the video needs to be covered with a spoiler animation",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendLivePhotoRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendAudio",
    command: "send-audio",
    binding: {
      kind: "rpc",
      name: "sendAudio",
    },
    effect: "write",
    summary:
      "Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.",
    description:
      "Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.\n\nFor sending voice messages, use the sendVoice method instead.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "audio",
        in: "body",
        required: true,
        description:
          "Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description: "Audio caption, 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description: "Audio caption, 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the audio caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the audio caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "duration",
        in: "body",
        required: false,
        description: "Duration of the audio in seconds",
        schema: {
          type: "integer",
          description: "Duration of the audio in seconds",
        },
      },
      {
        name: "performer",
        in: "body",
        required: false,
        description: "Performer",
        schema: {
          type: "string",
          description: "Performer",
        },
      },
      {
        name: "title",
        in: "body",
        required: false,
        description: "Track name",
        schema: {
          type: "string",
          description: "Track name",
        },
      },
      {
        name: "thumbnail",
        in: "body",
        required: false,
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendAudioRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendDocument",
    command: "send-document",
    binding: {
      kind: "rpc",
      name: "sendDocument",
    },
    effect: "write",
    summary:
      "Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.",
    description:
      "Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "document",
        in: "body",
        required: true,
        description:
          "File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "thumbnail",
        in: "body",
        required: false,
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description:
          "Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description:
            "Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the document caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the document caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "disable_content_type_detection",
        in: "body",
        required: false,
        description:
          "Disables automatic server-side content type detection for files uploaded using multipart/form-data",
        schema: {
          type: "boolean",
          description:
            "Disables automatic server-side content type detection for files uploaded using multipart/form-data",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendDocumentRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendVideo",
    command: "send-video",
    binding: {
      kind: "rpc",
      name: "sendVideo",
    },
    effect: "write",
    summary:
      "Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.",
    description:
      "Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "video",
        in: "body",
        required: true,
        description:
          "Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "duration",
        in: "body",
        required: false,
        description: "Duration of sent video in seconds",
        schema: {
          type: "integer",
          description: "Duration of sent video in seconds",
        },
      },
      {
        name: "width",
        in: "body",
        required: false,
        description: "Video width",
        schema: {
          type: "integer",
          description: "Video width",
        },
      },
      {
        name: "height",
        in: "body",
        required: false,
        description: "Video height",
        schema: {
          type: "integer",
          description: "Video height",
        },
      },
      {
        name: "thumbnail",
        in: "body",
        required: false,
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "cover",
        in: "body",
        required: false,
        description:
          'Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name> name. More information on Sending Files: https://core.telegram.org/bots/api#sending-files',
        schema: {
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
      },
      {
        name: "start_timestamp",
        in: "body",
        required: false,
        description: "Start timestamp for the video in the message",
        schema: {
          type: "integer",
          description: "Start timestamp for the video in the message",
        },
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description:
          "Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description:
            "Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the video caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the video caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "show_caption_above_media",
        in: "body",
        required: false,
        description: "Pass True if the caption must be shown above the message media",
        schema: {
          type: "boolean",
          description: "Pass True if the caption must be shown above the message media",
        },
      },
      {
        name: "has_spoiler",
        in: "body",
        required: false,
        description: "Pass True if the video needs to be covered with a spoiler animation",
        schema: {
          type: "boolean",
          description: "Pass True if the video needs to be covered with a spoiler animation",
        },
      },
      {
        name: "supports_streaming",
        in: "body",
        required: false,
        description: "Pass True if the uploaded video is suitable for streaming",
        schema: {
          type: "boolean",
          description: "Pass True if the uploaded video is suitable for streaming",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendVideoRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendAnimation",
    command: "send-animation",
    binding: {
      kind: "rpc",
      name: "sendAnimation",
    },
    effect: "write",
    summary:
      "Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.",
    description:
      "Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent Message is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "animation",
        in: "body",
        required: true,
        description:
          "Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "duration",
        in: "body",
        required: false,
        description: "Duration of sent animation in seconds",
        schema: {
          type: "integer",
          description: "Duration of sent animation in seconds",
        },
      },
      {
        name: "width",
        in: "body",
        required: false,
        description: "Animation width",
        schema: {
          type: "integer",
          description: "Animation width",
        },
      },
      {
        name: "height",
        in: "body",
        required: false,
        description: "Animation height",
        schema: {
          type: "integer",
          description: "Animation height",
        },
      },
      {
        name: "thumbnail",
        in: "body",
        required: false,
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description:
          "Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description:
            "Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the animation caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the animation caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "show_caption_above_media",
        in: "body",
        required: false,
        description: "Pass True if the caption must be shown above the message media",
        schema: {
          type: "boolean",
          description: "Pass True if the caption must be shown above the message media",
        },
      },
      {
        name: "has_spoiler",
        in: "body",
        required: false,
        description: "Pass True if the animation needs to be covered with a spoiler animation",
        schema: {
          type: "boolean",
          description: "Pass True if the animation needs to be covered with a spoiler animation",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendAnimationRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendVoice",
    command: "send-voice",
    binding: {
      kind: "rpc",
      name: "sendVoice",
    },
    effect: "write",
    summary:
      "Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.",
    description:
      "Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "voice",
        in: "body",
        required: true,
        description:
          "Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description: "Voice message caption, 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description: "Voice message caption, 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the voice message caption. See formatting options for more details.",
        schema: {
          type: "string",
          description:
            "Mode for parsing entities in the voice message caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "duration",
        in: "body",
        required: false,
        description: "Duration of the voice message in seconds",
        schema: {
          type: "integer",
          description: "Duration of the voice message in seconds",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendVoiceRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendVideoNote",
    command: "send-video-note",
    binding: {
      kind: "rpc",
      name: "sendVideoNote",
    },
    effect: "write",
    summary:
      "Use this method to send a rounded square MPEG4 video of up to 1 minute long. On success, the sent Message is returned.",
    description:
      "Use this method to send a rounded square MPEG4 video of up to 1 minute long. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "video_note",
        in: "body",
        required: true,
        description:
          "Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Sending video notes by a URL is currently unsupported.",
        schema: {
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
      },
      {
        name: "duration",
        in: "body",
        required: false,
        description: "Duration of sent video in seconds",
        schema: {
          type: "integer",
          description: "Duration of sent video in seconds",
        },
      },
      {
        name: "length",
        in: "body",
        required: false,
        description: "Video width and height, i.e. diameter of the video message",
        schema: {
          type: "integer",
          description: "Video width and height, i.e. diameter of the video message",
        },
      },
      {
        name: "thumbnail",
        in: "body",
        required: false,
        description:
          "Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass \"attach://<file_attach_name>\" if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
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
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendVideoNoteRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendPaidMedia",
    command: "send-paid-media",
    binding: {
      kind: "rpc",
      name: "sendPaidMedia",
    },
    effect: "write",
    summary: "Use this method to send paid media. On success, the sent Message is returned.",
    description: "Use this method to send paid media. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance.",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "star_count",
        in: "body",
        required: true,
        description: "The number of Telegram Stars that must be paid to buy access to the media; 1-25000",
        schema: {
          type: "integer",
          description: "The number of Telegram Stars that must be paid to buy access to the media; 1-25000",
        },
      },
      {
        name: "media",
        in: "body",
        required: true,
        description: "A JSON-serialized Array describing the media to be sent; up to 10 items",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "InputPaidMedia",
          },
          description: "A JSON-serialized Array describing the media to be sent; up to 10 items",
        },
      },
      {
        name: "payload",
        in: "body",
        required: false,
        description:
          "Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes.",
        schema: {
          type: "string",
          description:
            "Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes.",
        },
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description: "Media caption, 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description: "Media caption, 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the media caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the media caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "show_caption_above_media",
        in: "body",
        required: false,
        description: "Pass True if the caption must be shown above the message media",
        schema: {
          type: "boolean",
          description: "Pass True if the caption must be shown above the message media",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendPaidMediaRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendMediaGroup",
    command: "send-media-group",
    binding: {
      kind: "rpc",
      name: "sendMediaGroup",
    },
    effect: "write",
    summary:
      "Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of Message objects that were sent is returned.",
    description:
      "Use this method to send a group of photos, live photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an Array of Message objects that were sent is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat",
        },
      },
      {
        name: "media",
        in: "body",
        required: true,
        description: "A JSON-serialized Array describing messages to be sent, must include 2-10 items",
        schema: {
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
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends messages silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends messages silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent messages from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent messages from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendMediaGroupRequest",
    },
    response: {
      confidence: "contract",
      schema: "SendMediaGroupResponse",
    },
  },
  {
    id: "sendLocation",
    command: "send-location",
    binding: {
      kind: "rpc",
      name: "sendLocation",
    },
    effect: "write",
    summary: "Use this method to send point on the map. On success, the sent Message is returned.",
    description: "Use this method to send point on the map. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "latitude",
        in: "body",
        required: true,
        description: "Latitude of the location",
        schema: {
          type: "number",
          description: "Latitude of the location",
        },
      },
      {
        name: "longitude",
        in: "body",
        required: true,
        description: "Longitude of the location",
        schema: {
          type: "number",
          description: "Longitude of the location",
        },
      },
      {
        name: "horizontal_accuracy",
        in: "body",
        required: false,
        description: "The radius of uncertainty for the location, measured in meters; 0-1500",
        schema: {
          type: "number",
          description: "The radius of uncertainty for the location, measured in meters; 0-1500",
        },
      },
      {
        name: "live_period",
        in: "body",
        required: false,
        description:
          "Period in seconds during which the location will be updated (see Live Locations), must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. Must be 0 for ephemeral messages.",
        schema: {
          type: "integer",
          description:
            "Period in seconds during which the location will be updated (see Live Locations), must be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. Must be 0 for ephemeral messages.",
        },
      },
      {
        name: "heading",
        in: "body",
        required: false,
        description:
          "For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.",
        schema: {
          type: "integer",
          description:
            "For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.",
        },
      },
      {
        name: "proximity_alert_radius",
        in: "body",
        required: false,
        description:
          "For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.",
        schema: {
          type: "integer",
          description:
            "For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendLocationRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendVenue",
    command: "send-venue",
    binding: {
      kind: "rpc",
      name: "sendVenue",
    },
    effect: "write",
    summary: "Use this method to send information about a venue. On success, the sent Message is returned.",
    description: "Use this method to send information about a venue. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "latitude",
        in: "body",
        required: true,
        description: "Latitude of the venue",
        schema: {
          type: "number",
          description: "Latitude of the venue",
        },
      },
      {
        name: "longitude",
        in: "body",
        required: true,
        description: "Longitude of the venue",
        schema: {
          type: "number",
          description: "Longitude of the venue",
        },
      },
      {
        name: "title",
        in: "body",
        required: true,
        description: "Name of the venue",
        schema: {
          type: "string",
          description: "Name of the venue",
        },
      },
      {
        name: "address",
        in: "body",
        required: true,
        description: "Address of the venue",
        schema: {
          type: "string",
          description: "Address of the venue",
        },
      },
      {
        name: "foursquare_id",
        in: "body",
        required: false,
        description: "Foursquare identifier of the venue",
        schema: {
          type: "string",
          description: "Foursquare identifier of the venue",
        },
      },
      {
        name: "foursquare_type",
        in: "body",
        required: false,
        description:
          'Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)',
        schema: {
          type: "string",
          description:
            'Foursquare type of the venue, if known. (For example, "arts_entertainment/default", "arts_entertainment/aquarium" or "food/icecream".)',
        },
      },
      {
        name: "google_place_id",
        in: "body",
        required: false,
        description: "Google Places identifier of the venue",
        schema: {
          type: "string",
          description: "Google Places identifier of the venue",
        },
      },
      {
        name: "google_place_type",
        in: "body",
        required: false,
        description: "Google Places type of the venue. (See supported types.)",
        schema: {
          type: "string",
          description: "Google Places type of the venue. (See supported types.)",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendVenueRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendContact",
    command: "send-contact",
    binding: {
      kind: "rpc",
      name: "sendContact",
    },
    effect: "write",
    summary: "Use this method to send phone contacts. On success, the sent Message is returned.",
    description: "Use this method to send phone contacts. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "phone_number",
        in: "body",
        required: true,
        description: "Contact's phone number",
        schema: {
          type: "string",
          description: "Contact's phone number",
        },
      },
      {
        name: "first_name",
        in: "body",
        required: true,
        description: "Contact's first name",
        schema: {
          type: "string",
          description: "Contact's first name",
        },
      },
      {
        name: "last_name",
        in: "body",
        required: false,
        description: "Contact's last name",
        schema: {
          type: "string",
          description: "Contact's last name",
        },
      },
      {
        name: "vcard",
        in: "body",
        required: false,
        description: "Additional data about the contact in the form of a vCard, 0-2048 bytes",
        schema: {
          type: "string",
          description: "Additional data about the contact in the form of a vCard, 0-2048 bytes",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendContactRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendPoll",
    command: "send-poll",
    binding: {
      kind: "rpc",
      name: "sendPoll",
    },
    effect: "write",
    summary: "Use this method to send a native poll. On success, the sent Message is returned.",
    description: "Use this method to send a native poll. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. Polls can't be sent to channel direct messages chats.",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "question",
        in: "body",
        required: true,
        description: "Poll question, 1-300 characters",
        schema: {
          type: "string",
          description: "Poll question, 1-300 characters",
        },
      },
      {
        name: "question_parse_mode",
        in: "body",
        required: false,
        description:
          "Mode for parsing entities in the question. See formatting options for more details. Currently, only custom emoji entities are allowed.",
        schema: {
          type: "string",
          description:
            "Mode for parsing entities in the question. See formatting options for more details. Currently, only custom emoji entities are allowed.",
        },
      },
      {
        name: "question_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of question_parse_mode.",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of question_parse_mode.",
        },
      },
      {
        name: "options",
        in: "body",
        required: true,
        description: "A JSON-serialized list of 1-12 answer options",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "InputPollOption",
          },
          description: "A JSON-serialized list of 1-12 answer options",
        },
      },
      {
        name: "is_anonymous",
        in: "body",
        required: false,
        description: "True, if the poll needs to be anonymous, defaults to True",
        schema: {
          type: "boolean",
          description: "True, if the poll needs to be anonymous, defaults to True",
        },
      },
      {
        name: "type",
        in: "body",
        required: false,
        description: 'Poll type, "quiz" or "regular", defaults to "regular"',
        schema: {
          type: "string",
          description: 'Poll type, "quiz" or "regular", defaults to "regular"',
        },
      },
      {
        name: "allows_multiple_answers",
        in: "body",
        required: false,
        description: "Pass True if the poll allows multiple answers, defaults to False",
        schema: {
          type: "boolean",
          description: "Pass True if the poll allows multiple answers, defaults to False",
        },
      },
      {
        name: "allows_revoting",
        in: "body",
        required: false,
        description:
          "Pass True if the poll allows to change chosen answer options, defaults to False for quizzes and to True for regular polls",
        schema: {
          type: "boolean",
          description:
            "Pass True if the poll allows to change chosen answer options, defaults to False for quizzes and to True for regular polls",
        },
      },
      {
        name: "shuffle_options",
        in: "body",
        required: false,
        description: "Pass True if the poll options must be shown in random order",
        schema: {
          type: "boolean",
          description: "Pass True if the poll options must be shown in random order",
        },
      },
      {
        name: "allow_adding_options",
        in: "body",
        required: false,
        description:
          "Pass True if answer options can be added to the poll after creation; not supported for anonymous polls and quizzes",
        schema: {
          type: "boolean",
          description:
            "Pass True if answer options can be added to the poll after creation; not supported for anonymous polls and quizzes",
        },
      },
      {
        name: "hide_results_until_closes",
        in: "body",
        required: false,
        description: "Pass True if poll results must be shown only after the poll closes",
        schema: {
          type: "boolean",
          description: "Pass True if poll results must be shown only after the poll closes",
        },
      },
      {
        name: "members_only",
        in: "body",
        required: false,
        description:
          "Pass True if voting is limited to users who have been members of the chat where the poll is being sent for more than 24 hours; for channel chats only",
        schema: {
          type: "boolean",
          description:
            "Pass True if voting is limited to users who have been members of the chat where the poll is being sent for more than 24 hours; for channel chats only",
        },
      },
      {
        name: "country_codes",
        in: "body",
        required: false,
        description:
          'A JSON-serialized list of 0-12 two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll; for channel chats only. Use "FT" as a country code to allow users with anonymous numbers to vote. If omitted or empty, then users from any country can participate in the poll.',
        schema: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            'A JSON-serialized list of 0-12 two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which users can vote in the poll; for channel chats only. Use "FT" as a country code to allow users with anonymous numbers to vote. If omitted or empty, then users from any country can participate in the poll.',
        },
      },
      {
        name: "correct_option_ids",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of monotonically increasing 0-based identifiers of the correct answer options, required for polls in quiz mode",
        schema: {
          type: "array",
          items: {
            type: "integer",
          },
          description:
            "A JSON-serialized list of monotonically increasing 0-based identifiers of the correct answer options, required for polls in quiz mode",
        },
      },
      {
        name: "explanation",
        in: "body",
        required: false,
        description:
          "Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing",
        schema: {
          type: "string",
          description:
            "Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing",
        },
      },
      {
        name: "explanation_parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the explanation. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the explanation. See formatting options for more details.",
        },
      },
      {
        name: "explanation_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of explanation_parse_mode.",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of explanation_parse_mode.",
        },
      },
      {
        name: "explanation_media",
        in: "body",
        required: false,
        description: "Media added to the quiz explanation",
        schema: {
          type: "ref",
          ref: "InputPollMedia",
          description: "Media added to the quiz explanation",
        },
      },
      {
        name: "open_period",
        in: "body",
        required: false,
        description:
          "Amount of time in seconds the poll will be active after creation, 5-2628000. Can't be used together with close_date.",
        schema: {
          type: "integer",
          description:
            "Amount of time in seconds the poll will be active after creation, 5-2628000. Can't be used together with close_date.",
        },
      },
      {
        name: "close_date",
        in: "body",
        required: false,
        description:
          "Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 2628000 seconds in the future. Can't be used together with open_period.",
        schema: {
          type: "integer",
          description:
            "Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 2628000 seconds in the future. Can't be used together with open_period.",
        },
      },
      {
        name: "is_closed",
        in: "body",
        required: false,
        description: "Pass True if the poll needs to be immediately closed. This can be useful for poll preview.",
        schema: {
          type: "boolean",
          description: "Pass True if the poll needs to be immediately closed. This can be useful for poll preview.",
        },
      },
      {
        name: "description",
        in: "body",
        required: false,
        description: "Description of the poll to be sent, 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description: "Description of the poll to be sent, 0-1024 characters after entities parsing",
        },
      },
      {
        name: "description_parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the poll description. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the poll description. See formatting options for more details.",
        },
      },
      {
        name: "description_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the poll description, which can be specified instead of description_parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the poll description, which can be specified instead of description_parse_mode",
        },
      },
      {
        name: "media",
        in: "body",
        required: false,
        description: "Media added to the poll description",
        schema: {
          type: "ref",
          ref: "InputPollMedia",
          description: "Media added to the poll description",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendPollRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendChecklist",
    command: "send-checklist",
    binding: {
      kind: "rpc",
      name: "sendChecklist",
    },
    effect: "write",
    summary:
      "Use this method to send a checklist on behalf of a connected business account. On success, the sent Message is returned.",
    description:
      "Use this method to send a checklist on behalf of a connected business account. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target bot in the format @username",
        schema: {
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
      },
      {
        name: "checklist",
        in: "body",
        required: true,
        description: "A JSON-serialized object for the checklist to send",
        schema: {
          type: "ref",
          ref: "InputChecklist",
          description: "A JSON-serialized object for the checklist to send",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object for description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "A JSON-serialized object for description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for an inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for an inline keyboard",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendChecklistRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendDice",
    command: "send-dice",
    binding: {
      kind: "rpc",
      name: "sendDice",
    },
    effect: "write",
    summary:
      "Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.",
    description:
      "Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "emoji",
        in: "body",
        required: false,
        description:
          'Emoji on which the dice throw animation is based. Currently, must be one of "🎲", "🎯", "🏀", "⚽", "🎳", or "🎰". Dice can have values 1-6 for "🎲", "🎯" and "🎳", values 1-5 for "🏀" and "⚽", and values 1-64 for "🎰". Defaults to "🎲".',
        schema: {
          type: "string",
          description:
            'Emoji on which the dice throw animation is based. Currently, must be one of "🎲", "🎯", "🏀", "⚽", "🎳", or "🎰". Dice can have values 1-6 for "🎲", "🎯" and "🎳", values 1-5 for "🏀" and "⚽", and values 1-64 for "🎰". Defaults to "🎲".',
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendDiceRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendMessageDraft",
    command: "send-message-draft",
    binding: {
      kind: "rpc",
      name: "sendMessageDraft",
    },
    effect: "write",
    summary:
      "Use this method to stream a partial message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendMessage with the complete message to persist it in the user's chat. Returns True on success.",
    description:
      "Use this method to stream a partial message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendMessage with the complete message to persist it in the user's chat. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target private chat",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target private chat",
        },
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description: "Unique identifier for the target message thread",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target message thread",
        },
      },
      {
        name: "draft_id",
        in: "body",
        required: true,
        description:
          "Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation.",
        },
      },
      {
        name: "text",
        in: "body",
        required: false,
        description:
          'Text of the message to be sent, 0-4096 characters after entities parsing. Pass an empty text to show a "Thinking..." placeholder.',
        schema: {
          type: "string",
          description:
            'Text of the message to be sent, 0-4096 characters after entities parsing. Pass an empty text to show a "Thinking..." placeholder.',
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the message text. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the message text. See formatting options for more details.",
        },
      },
      {
        name: "entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
        },
      },
      {
        name: "can_stop",
        in: "body",
        required: false,
        description:
          'Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button.',
        schema: {
          type: "boolean",
          description:
            'Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button.',
        },
      },
      {
        name: "keep_on_stop",
        in: "body",
        required: false,
        description:
          "Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message.",
        schema: {
          type: "boolean",
          description:
            "Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendMessageDraftRequest",
    },
    response: {
      confidence: "contract",
      schema: "SendMessageDraftResponse",
    },
  },
  {
    id: "sendChatAction",
    command: "send-chat-action",
    binding: {
      kind: "rpc",
      name: "sendChatAction",
    },
    effect: "write",
    summary:
      "Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.",
    description:
      "Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success.\n\nWe only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the action will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the action will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot or supergroup in the format @username. Channel chats and channel direct messages chats aren't supported.",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "action",
        in: "body",
        required: true,
        description:
          "Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes.",
        schema: {
          type: "string",
          description:
            "Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendChatActionRequest",
    },
    response: {
      confidence: "contract",
      schema: "SendChatActionResponse",
    },
  },
  {
    id: "setMessageReaction",
    command: "set-message-reaction",
    binding: {
      kind: "rpc",
      name: "setMessageReaction",
    },
    effect: "write",
    summary:
      "Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns True on success.",
    description:
      "Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description:
          "Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead.",
        },
      },
      {
        name: "reaction",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots.",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "ReactionType",
          },
          description:
            "A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots.",
        },
      },
      {
        name: "is_big",
        in: "body",
        required: false,
        description: "Pass True to set the reaction with a big animation",
        schema: {
          type: "boolean",
          description: "Pass True to set the reaction with a big animation",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetMessageReactionRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetMessageReactionResponse",
    },
  },
  {
    id: "getUserProfilePhotos",
    command: "get-user-profile-photos",
    binding: {
      kind: "rpc",
      name: "getUserProfilePhotos",
    },
    effect: "read",
    summary: "Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.",
    description: "Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "offset",
        in: "body",
        required: false,
        description: "Sequential number of the first photo to be returned. By default, all photos are returned.",
        schema: {
          type: "integer",
          description: "Sequential number of the first photo to be returned. By default, all photos are returned.",
        },
      },
      {
        name: "limit",
        in: "body",
        required: false,
        description: "Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
        schema: {
          type: "integer",
          description:
            "Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetUserProfilePhotosRequest",
    },
    response: {
      confidence: "contract",
      schema: "UserProfilePhotos",
    },
  },
  {
    id: "getUserProfileAudios",
    command: "get-user-profile-audios",
    binding: {
      kind: "rpc",
      name: "getUserProfileAudios",
    },
    effect: "read",
    summary: "Use this method to get a list of profile audios for a user. Returns a UserProfileAudios object.",
    description: "Use this method to get a list of profile audios for a user. Returns a UserProfileAudios object.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "offset",
        in: "body",
        required: false,
        description: "Sequential number of the first audio to be returned. By default, all audios are returned.",
        schema: {
          type: "integer",
          description: "Sequential number of the first audio to be returned. By default, all audios are returned.",
        },
      },
      {
        name: "limit",
        in: "body",
        required: false,
        description: "Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
        schema: {
          type: "integer",
          description:
            "Limits the number of audios to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetUserProfileAudiosRequest",
    },
    response: {
      confidence: "contract",
      schema: "UserProfileAudios",
    },
  },
  {
    id: "setUserEmojiStatus",
    command: "set-user-emoji-status",
    binding: {
      kind: "rpc",
      name: "setUserEmojiStatus",
    },
    effect: "write",
    summary:
      "Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method requestEmojiStatusAccess. Returns True on success.",
    description:
      "Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method requestEmojiStatusAccess. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "emoji_status_custom_emoji_id",
        in: "body",
        required: false,
        description: "Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status.",
        schema: {
          type: "string",
          description: "Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status.",
        },
      },
      {
        name: "emoji_status_expiration_date",
        in: "body",
        required: false,
        description: "Expiration date of the emoji status, if any",
        schema: {
          type: "integer",
          description: "Expiration date of the emoji status, if any",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetUserEmojiStatusRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetUserEmojiStatusResponse",
    },
  },
  {
    id: "getFile",
    command: "get-file",
    binding: {
      kind: "rpc",
      name: "getFile",
    },
    effect: "read",
    summary:
      "Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.",
    description:
      "Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.\n\nNote: This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.",
    tags: [],
    parameters: [
      {
        name: "file_id",
        in: "body",
        required: true,
        description: "File identifier to get information about",
        schema: {
          type: "string",
          description: "File identifier to get information about",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetFileRequest",
    },
    response: {
      confidence: "contract",
      schema: "File",
    },
  },
  {
    id: "banChatMember",
    command: "ban-chat-member",
    binding: {
      kind: "rpc",
      name: "banChatMember",
    },
    effect: "destructive",
    summary:
      "Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    description:
      "Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target group or username of the target supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "until_date",
        in: "body",
        required: false,
        description:
          "Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.",
        schema: {
          type: "integer",
          description:
            "Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.",
        },
      },
      {
        name: "revoke_messages",
        in: "body",
        required: false,
        description:
          "Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels.",
        schema: {
          type: "boolean",
          description:
            "Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "BanChatMemberRequest",
    },
    response: {
      confidence: "contract",
      schema: "BanChatMemberResponse",
    },
  },
  {
    id: "unbanChatMember",
    command: "unban-chat-member",
    binding: {
      kind: "rpc",
      name: "unbanChatMember",
    },
    effect: "destructive",
    summary:
      "Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.",
    description:
      "Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target group or username of the target supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "only_if_banned",
        in: "body",
        required: false,
        description: "Do nothing if the user is not banned",
        schema: {
          type: "boolean",
          description: "Do nothing if the user is not banned",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "UnbanChatMemberRequest",
    },
    response: {
      confidence: "contract",
      schema: "UnbanChatMemberResponse",
    },
  },
  {
    id: "restrictChatMember",
    command: "restrict-chat-member",
    binding: {
      kind: "rpc",
      name: "restrictChatMember",
    },
    effect: "write",
    summary:
      "Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.",
    description:
      "Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "permissions",
        in: "body",
        required: true,
        description: "A JSON-serialized object for new user permissions",
        schema: {
          type: "ref",
          ref: "ChatPermissions",
          description: "A JSON-serialized object for new user permissions",
        },
      },
      {
        name: "use_independent_chat_permissions",
        in: "body",
        required: false,
        description:
          "Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission.",
        schema: {
          type: "boolean",
          description:
            "Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission.",
        },
      },
      {
        name: "until_date",
        in: "body",
        required: false,
        description:
          "Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever.",
        schema: {
          type: "integer",
          description:
            "Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "RestrictChatMemberRequest",
    },
    response: {
      confidence: "contract",
      schema: "RestrictChatMemberResponse",
    },
  },
  {
    id: "promoteChatMember",
    command: "promote-chat-member",
    binding: {
      kind: "rpc",
      name: "promoteChatMember",
    },
    effect: "write",
    summary:
      "Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.",
    description:
      "Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "is_anonymous",
        in: "body",
        required: false,
        description: "Pass True if the administrator's presence in the chat is hidden",
        schema: {
          type: "boolean",
          description: "Pass True if the administrator's presence in the chat is hidden",
        },
      },
      {
        name: "can_manage_chat",
        in: "body",
        required: false,
        description:
          "Pass True if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege.",
        },
      },
      {
        name: "can_delete_messages",
        in: "body",
        required: false,
        description: "Pass True if the administrator can delete messages of other users",
        schema: {
          type: "boolean",
          description: "Pass True if the administrator can delete messages of other users",
        },
      },
      {
        name: "can_manage_video_chats",
        in: "body",
        required: false,
        description: "Pass True if the administrator can manage video chats",
        schema: {
          type: "boolean",
          description: "Pass True if the administrator can manage video chats",
        },
      },
      {
        name: "can_restrict_members",
        in: "body",
        required: false,
        description:
          "Pass True if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to True for promotions of channel administrators.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to True for promotions of channel administrators.",
        },
      },
      {
        name: "can_promote_members",
        in: "body",
        required: false,
        description:
          "Pass True if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him)",
        schema: {
          type: "boolean",
          description:
            "Pass True if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him)",
        },
      },
      {
        name: "can_change_info",
        in: "body",
        required: false,
        description: "Pass True if the administrator can change chat title, photo and other settings",
        schema: {
          type: "boolean",
          description: "Pass True if the administrator can change chat title, photo and other settings",
        },
      },
      {
        name: "can_invite_users",
        in: "body",
        required: false,
        description: "Pass True if the administrator can invite new users to the chat",
        schema: {
          type: "boolean",
          description: "Pass True if the administrator can invite new users to the chat",
        },
      },
      {
        name: "can_post_stories",
        in: "body",
        required: false,
        description: "Pass True if the administrator can post stories to the chat",
        schema: {
          type: "boolean",
          description: "Pass True if the administrator can post stories to the chat",
        },
      },
      {
        name: "can_edit_stories",
        in: "body",
        required: false,
        description:
          "Pass True if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive",
        schema: {
          type: "boolean",
          description:
            "Pass True if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive",
        },
      },
      {
        name: "can_delete_stories",
        in: "body",
        required: false,
        description: "Pass True if the administrator can delete stories posted by other users",
        schema: {
          type: "boolean",
          description: "Pass True if the administrator can delete stories posted by other users",
        },
      },
      {
        name: "can_post_messages",
        in: "body",
        required: false,
        description:
          "Pass True if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only",
        schema: {
          type: "boolean",
          description:
            "Pass True if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only",
        },
      },
      {
        name: "can_edit_messages",
        in: "body",
        required: false,
        description:
          "Pass True if the administrator can edit messages of other users and can pin messages; for channels only",
        schema: {
          type: "boolean",
          description:
            "Pass True if the administrator can edit messages of other users and can pin messages; for channels only",
        },
      },
      {
        name: "can_pin_messages",
        in: "body",
        required: false,
        description: "Pass True if the administrator can pin messages; for supergroups only",
        schema: {
          type: "boolean",
          description: "Pass True if the administrator can pin messages; for supergroups only",
        },
      },
      {
        name: "can_manage_topics",
        in: "body",
        required: false,
        description:
          "Pass True if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only",
        schema: {
          type: "boolean",
          description:
            "Pass True if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only",
        },
      },
      {
        name: "can_manage_direct_messages",
        in: "body",
        required: false,
        description:
          "Pass True if the administrator can manage direct messages within the channel and decline suggested posts; for channels only",
        schema: {
          type: "boolean",
          description:
            "Pass True if the administrator can manage direct messages within the channel and decline suggested posts; for channels only",
        },
      },
      {
        name: "can_manage_tags",
        in: "body",
        required: false,
        description:
          "Pass True if the administrator can edit the tags of regular members; for groups and supergroups only",
        schema: {
          type: "boolean",
          description:
            "Pass True if the administrator can edit the tags of regular members; for groups and supergroups only",
        },
      },
      {
        name: "can_send_welcome_messages",
        in: "body",
        required: false,
        description:
          "Pass True if the administrator can manage chat welcome messages or directly send them in the case of bots",
        schema: {
          type: "boolean",
          description:
            "Pass True if the administrator can manage chat welcome messages or directly send them in the case of bots",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "PromoteChatMemberRequest",
    },
    response: {
      confidence: "contract",
      schema: "PromoteChatMemberResponse",
    },
  },
  {
    id: "setChatAdministratorCustomTitle",
    command: "set-chat-administrator-custom-title",
    binding: {
      kind: "rpc",
      name: "setChatAdministratorCustomTitle",
    },
    effect: "write",
    summary:
      "Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.",
    description:
      "Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "custom_title",
        in: "body",
        required: true,
        description: "New custom title for the administrator; 0-16 characters, emoji are not allowed",
        schema: {
          type: "string",
          description: "New custom title for the administrator; 0-16 characters, emoji are not allowed",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetChatAdministratorCustomTitleRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetChatAdministratorCustomTitleResponse",
    },
  },
  {
    id: "setChatMemberTag",
    command: "set-chat-member-tag",
    binding: {
      kind: "rpc",
      name: "setChatMemberTag",
    },
    effect: "write",
    summary:
      "Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the can_manage_tags administrator right. Returns True on success.",
    description:
      "Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the can_manage_tags administrator right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "tag",
        in: "body",
        required: false,
        description: "New tag for the member; 0-16 characters, emoji are not allowed",
        schema: {
          type: "string",
          description: "New tag for the member; 0-16 characters, emoji are not allowed",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetChatMemberTagRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetChatMemberTagResponse",
    },
  },
  {
    id: "banChatSenderChat",
    command: "ban-chat-sender-chat",
    binding: {
      kind: "rpc",
      name: "banChatSenderChat",
    },
    effect: "destructive",
    summary:
      "Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.",
    description:
      "Use this method to ban a channel chat in a supergroup or a channel. Until the chat is unbanned, the owner of the banned chat won't be able to send messages on behalf of any of their channels. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "sender_chat_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target sender chat",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target sender chat",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "BanChatSenderChatRequest",
    },
    response: {
      confidence: "contract",
      schema: "BanChatSenderChatResponse",
    },
  },
  {
    id: "unbanChatSenderChat",
    command: "unban-chat-sender-chat",
    binding: {
      kind: "rpc",
      name: "unbanChatSenderChat",
    },
    effect: "write",
    summary:
      "Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.",
    description:
      "Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "sender_chat_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target sender chat",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target sender chat",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "UnbanChatSenderChatRequest",
    },
    response: {
      confidence: "contract",
      schema: "UnbanChatSenderChatResponse",
    },
  },
  {
    id: "setChatPermissions",
    command: "set-chat-permissions",
    binding: {
      kind: "rpc",
      name: "setChatPermissions",
    },
    effect: "write",
    summary:
      "Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.",
    description:
      "Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "permissions",
        in: "body",
        required: true,
        description: "A JSON-serialized object for new default chat permissions",
        schema: {
          type: "ref",
          ref: "ChatPermissions",
          description: "A JSON-serialized object for new default chat permissions",
        },
      },
      {
        name: "use_independent_chat_permissions",
        in: "body",
        required: false,
        description:
          "Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission.",
        schema: {
          type: "boolean",
          description:
            "Pass True if chat permissions are set independently. Otherwise, the can_send_other_messages and can_add_web_page_previews permissions will imply the can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, and can_send_voice_notes permissions; the can_send_polls permission will imply the can_send_messages permission.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetChatPermissionsRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetChatPermissionsResponse",
    },
  },
  {
    id: "exportChatInviteLink",
    command: "export-chat-invite-link",
    binding: {
      kind: "rpc",
      name: "exportChatInviteLink",
    },
    effect: "destructive",
    summary:
      "Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.",
    description:
      "Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ExportChatInviteLinkRequest",
    },
    response: {
      confidence: "contract",
      schema: "ExportChatInviteLinkResponse",
    },
  },
  {
    id: "createChatInviteLink",
    command: "create-chat-invite-link",
    binding: {
      kind: "rpc",
      name: "createChatInviteLink",
    },
    effect: "write",
    summary:
      "Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.",
    description:
      "Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "name",
        in: "body",
        required: false,
        description: "Invite link name; 0-32 characters",
        schema: {
          type: "string",
          description: "Invite link name; 0-32 characters",
        },
      },
      {
        name: "expire_date",
        in: "body",
        required: false,
        description: "Point in time (Unix timestamp) when the link will expire",
        schema: {
          type: "integer",
          description: "Point in time (Unix timestamp) when the link will expire",
        },
      },
      {
        name: "member_limit",
        in: "body",
        required: false,
        description:
          "The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999",
        schema: {
          type: "integer",
          description:
            "The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999",
        },
      },
      {
        name: "creates_join_request",
        in: "body",
        required: false,
        description:
          "True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified.",
        schema: {
          type: "boolean",
          description:
            "True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "CreateChatInviteLinkRequest",
    },
    response: {
      confidence: "contract",
      schema: "ChatInviteLink",
    },
  },
  {
    id: "editChatInviteLink",
    command: "edit-chat-invite-link",
    binding: {
      kind: "rpc",
      name: "editChatInviteLink",
    },
    effect: "write",
    summary:
      "Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.",
    description:
      "Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "invite_link",
        in: "body",
        required: true,
        description: "The invite link to edit",
        schema: {
          type: "string",
          description: "The invite link to edit",
        },
      },
      {
        name: "name",
        in: "body",
        required: false,
        description: "Invite link name; 0-32 characters",
        schema: {
          type: "string",
          description: "Invite link name; 0-32 characters",
        },
      },
      {
        name: "expire_date",
        in: "body",
        required: false,
        description: "Point in time (Unix timestamp) when the link will expire",
        schema: {
          type: "integer",
          description: "Point in time (Unix timestamp) when the link will expire",
        },
      },
      {
        name: "member_limit",
        in: "body",
        required: false,
        description:
          "The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999",
        schema: {
          type: "integer",
          description:
            "The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999",
        },
      },
      {
        name: "creates_join_request",
        in: "body",
        required: false,
        description:
          "True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified.",
        schema: {
          type: "boolean",
          description:
            "True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditChatInviteLinkRequest",
    },
    response: {
      confidence: "contract",
      schema: "ChatInviteLink",
    },
  },
  {
    id: "createChatSubscriptionInviteLink",
    command: "create-chat-subscription-invite-link",
    binding: {
      kind: "rpc",
      name: "createChatSubscriptionInviteLink",
    },
    effect: "write",
    summary:
      "Use this method to create a subscription invite link for a channel chat. The bot must have the can_invite_users administrator rights. The link can be edited using the method editChatSubscriptionInviteLink or revoked using the method revokeChatInviteLink. Returns the new invite link as a ChatInviteLink object.",
    description:
      "Use this method to create a subscription invite link for a channel chat. The bot must have the can_invite_users administrator rights. The link can be edited using the method editChatSubscriptionInviteLink or revoked using the method revokeChatInviteLink. Returns the new invite link as a ChatInviteLink object.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target channel chat or username of the target channel in the format @username",
        schema: {
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
      },
      {
        name: "name",
        in: "body",
        required: false,
        description: "Invite link name; 0-32 characters",
        schema: {
          type: "string",
          description: "Invite link name; 0-32 characters",
        },
      },
      {
        name: "subscription_period",
        in: "body",
        required: true,
        description:
          "The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).",
        schema: {
          type: "integer",
          description:
            "The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days).",
        },
      },
      {
        name: "subscription_price",
        in: "body",
        required: true,
        description:
          "The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000",
        schema: {
          type: "integer",
          description:
            "The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "CreateChatSubscriptionInviteLinkRequest",
    },
    response: {
      confidence: "contract",
      schema: "ChatInviteLink",
    },
  },
  {
    id: "editChatSubscriptionInviteLink",
    command: "edit-chat-subscription-invite-link",
    binding: {
      kind: "rpc",
      name: "editChatSubscriptionInviteLink",
    },
    effect: "write",
    summary:
      "Use this method to edit a subscription invite link created by the bot. The bot must have the can_invite_users administrator rights. Returns the edited invite link as a ChatInviteLink object.",
    description:
      "Use this method to edit a subscription invite link created by the bot. The bot must have the can_invite_users administrator rights. Returns the edited invite link as a ChatInviteLink object.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "invite_link",
        in: "body",
        required: true,
        description: "The invite link to edit",
        schema: {
          type: "string",
          description: "The invite link to edit",
        },
      },
      {
        name: "name",
        in: "body",
        required: false,
        description: "Invite link name; 0-32 characters",
        schema: {
          type: "string",
          description: "Invite link name; 0-32 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditChatSubscriptionInviteLinkRequest",
    },
    response: {
      confidence: "contract",
      schema: "ChatInviteLink",
    },
  },
  {
    id: "revokeChatInviteLink",
    command: "revoke-chat-invite-link",
    binding: {
      kind: "rpc",
      name: "revokeChatInviteLink",
    },
    effect: "destructive",
    summary:
      "Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.",
    description:
      "Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target chat or username of the target channel in the format @username",
        schema: {
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
      },
      {
        name: "invite_link",
        in: "body",
        required: true,
        description: "The invite link to revoke",
        schema: {
          type: "string",
          description: "The invite link to revoke",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "RevokeChatInviteLinkRequest",
    },
    response: {
      confidence: "contract",
      schema: "ChatInviteLink",
    },
  },
  {
    id: "approveChatJoinRequest",
    command: "approve-chat-join-request",
    binding: {
      kind: "rpc",
      name: "approveChatJoinRequest",
    },
    effect: "write",
    summary:
      "Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.",
    description:
      "Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ApproveChatJoinRequestRequest",
    },
    response: {
      confidence: "contract",
      schema: "ApproveChatJoinRequestResponse",
    },
  },
  {
    id: "declineChatJoinRequest",
    command: "decline-chat-join-request",
    binding: {
      kind: "rpc",
      name: "declineChatJoinRequest",
    },
    effect: "destructive",
    summary:
      "Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.",
    description:
      "Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeclineChatJoinRequestRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeclineChatJoinRequestResponse",
    },
  },
  {
    id: "answerChatJoinRequestQuery",
    command: "answer-chat-join-request-query",
    binding: {
      kind: "rpc",
      name: "answerChatJoinRequestQuery",
    },
    effect: "write",
    summary: "Use this method to process a received chat join request query. Returns True on success.",
    description: "Use this method to process a received chat join request query. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_join_request_query_id",
        in: "body",
        required: true,
        description: "Unique identifier of the join request query",
        schema: {
          type: "string",
          description: "Unique identifier of the join request query",
        },
      },
      {
        name: "result",
        in: "body",
        required: true,
        description:
          'Result of the query. Must be either "approve" to allow the user to join the chat, "decline" to disallow the user to join the chat, or "queue" to leave the decision to other administrators.',
        schema: {
          type: "string",
          description:
            'Result of the query. Must be either "approve" to allow the user to join the chat, "decline" to disallow the user to join the chat, or "queue" to leave the decision to other administrators.',
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "AnswerChatJoinRequestQueryRequest",
    },
    response: {
      confidence: "contract",
      schema: "AnswerChatJoinRequestQueryResponse",
    },
  },
  {
    id: "sendChatJoinRequestWebApp",
    command: "send-chat-join-request-web-app",
    binding: {
      kind: "rpc",
      name: "sendChatJoinRequestWebApp",
    },
    effect: "write",
    summary:
      "Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Call answerChatJoinRequestQuery to resolve the join request query based on the user interaction with the Mini App. Returns True on success.",
    description:
      "Use this method to process a received chat join request query by showing a Mini App to the user before deciding the outcome. Call answerChatJoinRequestQuery to resolve the join request query based on the user interaction with the Mini App. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_join_request_query_id",
        in: "body",
        required: true,
        description: "Unique identifier of the join request query",
        schema: {
          type: "string",
          description: "Unique identifier of the join request query",
        },
      },
      {
        name: "web_app_url",
        in: "body",
        required: true,
        description:
          "An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps",
        schema: {
          type: "string",
          description:
            "An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendChatJoinRequestWebAppRequest",
    },
    response: {
      confidence: "contract",
      schema: "SendChatJoinRequestWebAppResponse",
    },
  },
  {
    id: "setChatPhoto",
    command: "set-chat-photo",
    binding: {
      kind: "rpc",
      name: "setChatPhoto",
    },
    effect: "write",
    summary:
      "Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    description:
      "Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "photo",
        in: "body",
        required: true,
        description: "New chat photo, uploaded using multipart/form-data",
        schema: {
          type: "string",
          format: "binary",
          description: "New chat photo, uploaded using multipart/form-data",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetChatPhotoRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetChatPhotoResponse",
    },
  },
  {
    id: "deleteChatPhoto",
    command: "delete-chat-photo",
    binding: {
      kind: "rpc",
      name: "deleteChatPhoto",
    },
    effect: "destructive",
    summary:
      "Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    description:
      "Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteChatPhotoRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteChatPhotoResponse",
    },
  },
  {
    id: "setChatTitle",
    command: "set-chat-title",
    binding: {
      kind: "rpc",
      name: "setChatTitle",
    },
    effect: "write",
    summary:
      "Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    description:
      "Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "title",
        in: "body",
        required: true,
        description: "New chat title, 1-128 characters",
        schema: {
          type: "string",
          description: "New chat title, 1-128 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetChatTitleRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetChatTitleResponse",
    },
  },
  {
    id: "setChatDescription",
    command: "set-chat-description",
    binding: {
      kind: "rpc",
      name: "setChatDescription",
    },
    effect: "write",
    summary:
      "Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    description:
      "Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "description",
        in: "body",
        required: false,
        description: "New chat description, 0-255 characters",
        schema: {
          type: "string",
          description: "New chat description, 0-255 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetChatDescriptionRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetChatDescriptionResponse",
    },
  },
  {
    id: "pinChatMessage",
    command: "pin-chat-message",
    binding: {
      kind: "rpc",
      name: "pinChatMessage",
    },
    effect: "write",
    summary:
      "Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns True on success.",
    description:
      "Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be pinned",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be pinned",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Identifier of a message to pin",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of a message to pin",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description:
          "Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats.",
        schema: {
          type: "boolean",
          description:
            "Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "PinChatMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "PinChatMessageResponse",
    },
  },
  {
    id: "unpinChatMessage",
    command: "unpin-chat-message",
    binding: {
      kind: "rpc",
      name: "unpinChatMessage",
    },
    effect: "write",
    summary:
      "Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns True on success.",
    description:
      "Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be unpinned",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be unpinned",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "message_id",
        in: "body",
        required: false,
        description:
          "Identifier of the message to unpin. Required if business_connection_id is specified. If not specified, the most recent pinned message (by sending date) will be unpinned.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the message to unpin. Required if business_connection_id is specified. If not specified, the most recent pinned message (by sending date) will be unpinned.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "UnpinChatMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "UnpinChatMessageResponse",
    },
  },
  {
    id: "unpinAllChatMessages",
    command: "unpin-all-chat-messages",
    binding: {
      kind: "rpc",
      name: "unpinAllChatMessages",
    },
    effect: "destructive",
    summary:
      "Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns True on success.",
    description:
      "Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "UnpinAllChatMessagesRequest",
    },
    response: {
      confidence: "contract",
      schema: "UnpinAllChatMessagesResponse",
    },
  },
  {
    id: "leaveChat",
    command: "leave-chat",
    binding: {
      kind: "rpc",
      name: "leaveChat",
    },
    effect: "destructive",
    summary: "Use this method for your bot to leave a group, supergroup or channel. Returns True on success.",
    description: "Use this method for your bot to leave a group, supergroup or channel. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username. Channel direct messages chats aren't supported; leave the corresponding channel instead.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "LeaveChatRequest",
    },
    response: {
      confidence: "contract",
      schema: "LeaveChatResponse",
    },
  },
  {
    id: "getChat",
    command: "get-chat",
    binding: {
      kind: "rpc",
      name: "getChat",
    },
    effect: "read",
    summary: "Use this method to get up-to-date information about the chat. Returns a ChatFullInfo object on success.",
    description:
      "Use this method to get up-to-date information about the chat. Returns a ChatFullInfo object on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetChatRequest",
    },
    response: {
      confidence: "contract",
      schema: "ChatFullInfo",
    },
  },
  {
    id: "getChatAdministrators",
    command: "get-chat-administrators",
    binding: {
      kind: "rpc",
      name: "getChatAdministrators",
    },
    effect: "read",
    summary: "Use this method to get a list of administrators in a chat. Returns an Array of ChatMember objects.",
    description: "Use this method to get a list of administrators in a chat. Returns an Array of ChatMember objects.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username",
        schema: {
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
      {
        name: "return_bots",
        in: "body",
        required: false,
        description:
          "Pass True to additionally receive all bots that are administrators of the chat. By default, bots other than the current bot are omitted.",
        schema: {
          type: "boolean",
          description:
            "Pass True to additionally receive all bots that are administrators of the chat. By default, bots other than the current bot are omitted.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetChatAdministratorsRequest",
    },
    response: {
      confidence: "contract",
      schema: "GetChatAdministratorsResponse",
    },
  },
  {
    id: "getChatMemberCount",
    command: "get-chat-member-count",
    binding: {
      kind: "rpc",
      name: "getChatMemberCount",
    },
    effect: "read",
    summary: "Use this method to get the number of members in a chat. Returns Integer on success.",
    description: "Use this method to get the number of members in a chat. Returns Integer on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetChatMemberCountRequest",
    },
    response: {
      confidence: "contract",
      schema: "GetChatMemberCountResponse",
    },
  },
  {
    id: "getChatMember",
    command: "get-chat-member",
    binding: {
      kind: "rpc",
      name: "getChatMember",
    },
    effect: "read",
    summary:
      "Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a ChatMember object on success.",
    description:
      "Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a ChatMember object on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup or channel in the format @username",
        schema: {
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
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetChatMemberRequest",
    },
    response: {
      confidence: "contract",
      schema: "ChatMember",
    },
  },
  {
    id: "getUserPersonalChatMessages",
    command: "get-user-personal-chat-messages",
    binding: {
      kind: "rpc",
      name: "getUserPersonalChatMessages",
    },
    effect: "read",
    summary:
      "Use this method to get the last messages from the personal chat (i.e., the chat currently added to their profile) of a given user. On success, an Array of Message objects is returned.",
    description:
      "Use this method to get the last messages from the personal chat (i.e., the chat currently added to their profile) of a given user. On success, an Array of Message objects is returned.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target user",
        },
      },
      {
        name: "limit",
        in: "body",
        required: true,
        description: "The maximum number of messages to return; 1-20",
        schema: {
          type: "integer",
          description: "The maximum number of messages to return; 1-20",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetUserPersonalChatMessagesRequest",
    },
    response: {
      confidence: "contract",
      schema: "GetUserPersonalChatMessagesResponse",
    },
  },
  {
    id: "setChatStickerSet",
    command: "set-chat-sticker-set",
    binding: {
      kind: "rpc",
      name: "setChatStickerSet",
    },
    effect: "write",
    summary:
      "Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.",
    description:
      "Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "sticker_set_name",
        in: "body",
        required: true,
        description: "Name of the sticker set to be set as the group sticker set",
        schema: {
          type: "string",
          description: "Name of the sticker set to be set as the group sticker set",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetChatStickerSetRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetChatStickerSetResponse",
    },
  },
  {
    id: "deleteChatStickerSet",
    command: "delete-chat-sticker-set",
    binding: {
      kind: "rpc",
      name: "deleteChatStickerSet",
    },
    effect: "destructive",
    summary:
      "Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.",
    description:
      "Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in getChat requests to check if the bot can use this method. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteChatStickerSetRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteChatStickerSetResponse",
    },
  },
  {
    id: "getForumTopicIconStickers",
    command: "get-forum-topic-icon-stickers",
    binding: {
      kind: "rpc",
      name: "getForumTopicIconStickers",
    },
    effect: "read",
    summary:
      "Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of Sticker objects.",
    description:
      "Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of Sticker objects.",
    tags: [],
    parameters: [],
    response: {
      confidence: "contract",
      schema: "GetForumTopicIconStickersResponse",
    },
  },
  {
    id: "createForumTopic",
    command: "create-forum-topic",
    binding: {
      kind: "rpc",
      name: "createForumTopic",
    },
    effect: "write",
    summary:
      "Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator right. Returns information about the created topic as a ForumTopic object.",
    description:
      "Use this method to create a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator right. Returns information about the created topic as a ForumTopic object.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "name",
        in: "body",
        required: true,
        description: "Topic name, 1-128 characters",
        schema: {
          type: "string",
          description: "Topic name, 1-128 characters",
        },
      },
      {
        name: "icon_color",
        in: "body",
        required: false,
        description:
          "Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F).",
        schema: {
          type: "integer",
          description:
            "Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F).",
        },
      },
      {
        name: "icon_custom_emoji_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers.",
        schema: {
          type: "string",
          description:
            "Unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "CreateForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "ForumTopic",
    },
  },
  {
    id: "editForumTopic",
    command: "edit-forum-topic",
    binding: {
      kind: "rpc",
      name: "editForumTopic",
    },
    effect: "write",
    summary:
      "Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.",
    description:
      "Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "message_thread_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target message thread of the forum topic",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target message thread of the forum topic",
        },
      },
      {
        name: "name",
        in: "body",
        required: false,
        description:
          "New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept.",
        schema: {
          type: "string",
          description:
            "New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept.",
        },
      },
      {
        name: "icon_custom_emoji_id",
        in: "body",
        required: false,
        description:
          "New unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept.",
        schema: {
          type: "string",
          description:
            "New unique identifier of the custom emoji shown as the topic icon. Use getForumTopicIconStickers to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditForumTopicResponse",
    },
  },
  {
    id: "closeForumTopic",
    command: "close-forum-topic",
    binding: {
      kind: "rpc",
      name: "closeForumTopic",
    },
    effect: "write",
    summary:
      "Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.",
    description:
      "Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "message_thread_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target message thread of the forum topic",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target message thread of the forum topic",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "CloseForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "CloseForumTopicResponse",
    },
  },
  {
    id: "reopenForumTopic",
    command: "reopen-forum-topic",
    binding: {
      kind: "rpc",
      name: "reopenForumTopic",
    },
    effect: "write",
    summary:
      "Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.",
    description:
      "Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights, unless it is the creator of the topic. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "message_thread_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target message thread of the forum topic",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target message thread of the forum topic",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ReopenForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "ReopenForumTopicResponse",
    },
  },
  {
    id: "deleteForumTopic",
    command: "delete-forum-topic",
    binding: {
      kind: "rpc",
      name: "deleteForumTopic",
    },
    effect: "destructive",
    summary:
      "Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success.",
    description:
      "Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_delete_messages administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "message_thread_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target message thread of the forum topic",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target message thread of the forum topic",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteForumTopicResponse",
    },
  },
  {
    id: "unpinAllForumTopicMessages",
    command: "unpin-all-forum-topic-messages",
    binding: {
      kind: "rpc",
      name: "unpinAllForumTopicMessages",
    },
    effect: "destructive",
    summary:
      "Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.",
    description:
      "Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with a user. In the case of a supergroup chat the bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "message_thread_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target message thread of the forum topic",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target message thread of the forum topic",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "UnpinAllForumTopicMessagesRequest",
    },
    response: {
      confidence: "contract",
      schema: "UnpinAllForumTopicMessagesResponse",
    },
  },
  {
    id: "editGeneralForumTopic",
    command: "edit-general-forum-topic",
    binding: {
      kind: "rpc",
      name: "editGeneralForumTopic",
    },
    effect: "write",
    summary:
      "Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.",
    description:
      "Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "name",
        in: "body",
        required: true,
        description: "New topic name, 1-128 characters",
        schema: {
          type: "string",
          description: "New topic name, 1-128 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditGeneralForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditGeneralForumTopicResponse",
    },
  },
  {
    id: "closeGeneralForumTopic",
    command: "close-general-forum-topic",
    binding: {
      kind: "rpc",
      name: "closeGeneralForumTopic",
    },
    effect: "write",
    summary:
      "Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.",
    description:
      "Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "CloseGeneralForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "CloseGeneralForumTopicResponse",
    },
  },
  {
    id: "reopenGeneralForumTopic",
    command: "reopen-general-forum-topic",
    binding: {
      kind: "rpc",
      name: "reopenGeneralForumTopic",
    },
    effect: "write",
    summary:
      "Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success.",
    description:
      "Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically unhidden if it was hidden. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ReopenGeneralForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "ReopenGeneralForumTopicResponse",
    },
  },
  {
    id: "hideGeneralForumTopic",
    command: "hide-general-forum-topic",
    binding: {
      kind: "rpc",
      name: "hideGeneralForumTopic",
    },
    effect: "write",
    summary:
      "Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success.",
    description:
      "Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. The topic will be automatically closed if it was open. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "HideGeneralForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "HideGeneralForumTopicResponse",
    },
  },
  {
    id: "unhideGeneralForumTopic",
    command: "unhide-general-forum-topic",
    binding: {
      kind: "rpc",
      name: "unhideGeneralForumTopic",
    },
    effect: "write",
    summary:
      "Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.",
    description:
      "Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the can_manage_topics administrator rights. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "UnhideGeneralForumTopicRequest",
    },
    response: {
      confidence: "contract",
      schema: "UnhideGeneralForumTopicResponse",
    },
  },
  {
    id: "unpinAllGeneralForumTopicMessages",
    command: "unpin-all-general-forum-topic-messages",
    binding: {
      kind: "rpc",
      name: "unpinAllGeneralForumTopicMessages",
    },
    effect: "destructive",
    summary:
      "Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.",
    description:
      "Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the can_pin_messages administrator right in the supergroup. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "UnpinAllGeneralForumTopicMessagesRequest",
    },
    response: {
      confidence: "contract",
      schema: "UnpinAllGeneralForumTopicMessagesResponse",
    },
  },
  {
    id: "answerCallbackQuery",
    command: "answer-callback-query",
    binding: {
      kind: "rpc",
      name: "answerCallbackQuery",
    },
    effect: "write",
    summary:
      "Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.",
    description:
      "Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.",
    tags: [],
    parameters: [
      {
        name: "callback_query_id",
        in: "body",
        required: true,
        description: "Unique identifier for the query to be answered",
        schema: {
          type: "string",
          description: "Unique identifier for the query to be answered",
        },
      },
      {
        name: "text",
        in: "body",
        required: false,
        description: "Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters.",
        schema: {
          type: "string",
          description:
            "Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters.",
        },
      },
      {
        name: "show_alert",
        in: "body",
        required: false,
        description:
          "If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to False.",
        schema: {
          type: "boolean",
          description:
            "If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to False.",
        },
      },
      {
        name: "url",
        in: "body",
        required: false,
        description:
          "URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @BotFather, specify the URL that opens your game - note that this will only work if the query comes from a callback_game button. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.",
        schema: {
          type: "string",
          description:
            "URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @BotFather, specify the URL that opens your game - note that this will only work if the query comes from a callback_game button. Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter.",
        },
      },
      {
        name: "cache_time",
        in: "body",
        required: false,
        description:
          "The maximum amount of time in seconds that the result of the callback query may be cached client-side. Defaults to 0.",
        schema: {
          type: "integer",
          description:
            "The maximum amount of time in seconds that the result of the callback query may be cached client-side. Defaults to 0.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "AnswerCallbackQueryRequest",
    },
    response: {
      confidence: "contract",
      schema: "AnswerCallbackQueryResponse",
    },
  },
  {
    id: "answerGuestQuery",
    command: "answer-guest-query",
    binding: {
      kind: "rpc",
      name: "answerGuestQuery",
    },
    effect: "write",
    summary: "Use this method to reply to a received guest message. On success, a SentGuestMessage object is returned.",
    description:
      "Use this method to reply to a received guest message. On success, a SentGuestMessage object is returned.",
    tags: [],
    parameters: [
      {
        name: "guest_query_id",
        in: "body",
        required: true,
        description: "Unique identifier for the query to be answered",
        schema: {
          type: "string",
          description: "Unique identifier for the query to be answered",
        },
      },
      {
        name: "result",
        in: "body",
        required: true,
        description: "A JSON-serialized object describing the message to be sent",
        schema: {
          type: "ref",
          ref: "InlineQueryResult",
          description: "A JSON-serialized object describing the message to be sent",
        },
        sensitive: true,
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "AnswerGuestQueryRequest",
    },
    response: {
      confidence: "contract",
      schema: "SentGuestMessage",
    },
  },
  {
    id: "getUserChatBoosts",
    command: "get-user-chat-boosts",
    binding: {
      kind: "rpc",
      name: "getUserChatBoosts",
    },
    effect: "read",
    summary:
      "Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object.",
    description:
      "Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a UserChatBoosts object.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the chat or username of the channel in the format @username",
        schema: {
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
      },
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetUserChatBoostsRequest",
    },
    response: {
      confidence: "contract",
      schema: "UserChatBoosts",
    },
  },
  {
    id: "getBusinessConnection",
    command: "get-business-connection",
    binding: {
      kind: "rpc",
      name: "getBusinessConnection",
    },
    effect: "read",
    summary:
      "Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success.",
    description:
      "Use this method to get information about the connection of the bot with a business account. Returns a BusinessConnection object on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetBusinessConnectionRequest",
    },
    response: {
      confidence: "contract",
      schema: "BusinessConnection",
    },
  },
  {
    id: "getManagedBotToken",
    command: "get-managed-bot-token",
    binding: {
      kind: "rpc",
      name: "getManagedBotToken",
    },
    effect: "read",
    summary: "Use this method to get the token of a managed bot. Returns the token as String on success.",
    description: "Use this method to get the token of a managed bot. Returns the token as String on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier of the managed bot whose token will be returned",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier of the managed bot whose token will be returned",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetManagedBotTokenRequest",
    },
    response: {
      confidence: "contract",
      schema: "GetManagedBotTokenResponse",
      sensitive: true,
    },
  },
  {
    id: "replaceManagedBotToken",
    command: "replace-managed-bot-token",
    binding: {
      kind: "rpc",
      name: "replaceManagedBotToken",
    },
    effect: "destructive",
    summary:
      "Use this method to revoke the current token of a managed bot and generate a new one. Returns the new token as String on success.",
    description:
      "Use this method to revoke the current token of a managed bot and generate a new one. Returns the new token as String on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier of the managed bot whose token will be replaced",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier of the managed bot whose token will be replaced",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ReplaceManagedBotTokenRequest",
    },
    response: {
      confidence: "contract",
      schema: "ReplaceManagedBotTokenResponse",
      sensitive: true,
    },
  },
  {
    id: "getManagedBotAccessSettings",
    command: "get-managed-bot-access-settings",
    binding: {
      kind: "rpc",
      name: "getManagedBotAccessSettings",
    },
    effect: "read",
    summary:
      "Use this method to get the access settings of a managed bot. Returns a BotAccessSettings object on success.",
    description:
      "Use this method to get the access settings of a managed bot. Returns a BotAccessSettings object on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier of the managed bot whose access settings will be returned",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier of the managed bot whose access settings will be returned",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetManagedBotAccessSettingsRequest",
    },
    response: {
      confidence: "contract",
      schema: "BotAccessSettings",
    },
  },
  {
    id: "setManagedBotAccessSettings",
    command: "set-managed-bot-access-settings",
    binding: {
      kind: "rpc",
      name: "setManagedBotAccessSettings",
    },
    effect: "write",
    summary: "Use this method to change the access settings of a managed bot. Returns True on success.",
    description: "Use this method to change the access settings of a managed bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier of the managed bot whose access settings will be changed",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier of the managed bot whose access settings will be changed",
        },
      },
      {
        name: "is_access_restricted",
        in: "body",
        required: true,
        description: "Pass True if only selected users can access the bot. The bot's owner can always access it.",
        schema: {
          type: "boolean",
          description: "Pass True if only selected users can access the bot. The bot's owner can always access it.",
        },
      },
      {
        name: "added_user_ids",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of up to 10 identifiers of users who will have access to the bot in addition to its owner. Ignored if is_access_restricted is False.",
        schema: {
          type: "array",
          items: {
            type: "integer",
          },
          description:
            "A JSON-serialized list of up to 10 identifiers of users who will have access to the bot in addition to its owner. Ignored if is_access_restricted is False.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetManagedBotAccessSettingsRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetManagedBotAccessSettingsResponse",
    },
  },
  {
    id: "setMyCommands",
    command: "set-my-commands",
    binding: {
      kind: "rpc",
      name: "setMyCommands",
    },
    effect: "write",
    summary:
      "Use this method to change the list of the bot's commands. See this manual for more details about bot commands. Returns True on success.",
    description:
      "Use this method to change the list of the bot's commands. See this manual for more details about bot commands. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "commands",
        in: "body",
        required: true,
        description:
          "A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "BotCommand",
          },
          description:
            "A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified.",
        },
      },
      {
        name: "scope",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.",
        schema: {
          type: "ref",
          ref: "BotCommandScope",
          description:
            "A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.",
        },
      },
      {
        name: "language_code",
        in: "body",
        required: false,
        description:
          "A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.",
        schema: {
          type: "string",
          description:
            "A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetMyCommandsRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetMyCommandsResponse",
    },
  },
  {
    id: "deleteMyCommands",
    command: "delete-my-commands",
    binding: {
      kind: "rpc",
      name: "deleteMyCommands",
    },
    effect: "destructive",
    summary:
      "Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users. Returns True on success.",
    description:
      "Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, higher level commands will be shown to affected users. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "scope",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.",
        schema: {
          type: "ref",
          ref: "BotCommandScope",
          description:
            "A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault.",
        },
      },
      {
        name: "language_code",
        in: "body",
        required: false,
        description:
          "A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.",
        schema: {
          type: "string",
          description:
            "A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands.",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "DeleteMyCommandsRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteMyCommandsResponse",
    },
  },
  {
    id: "getMyCommands",
    command: "get-my-commands",
    binding: {
      kind: "rpc",
      name: "getMyCommands",
    },
    effect: "read",
    summary:
      "Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of BotCommand objects. If commands aren't set, an empty list is returned.",
    description:
      "Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of BotCommand objects. If commands aren't set, an empty list is returned.",
    tags: [],
    parameters: [
      {
        name: "scope",
        in: "body",
        required: false,
        description: "A JSON-serialized object, describing scope of users. Defaults to BotCommandScopeDefault.",
        schema: {
          type: "ref",
          ref: "BotCommandScope",
          description: "A JSON-serialized object, describing scope of users. Defaults to BotCommandScopeDefault.",
        },
      },
      {
        name: "language_code",
        in: "body",
        required: false,
        description: "A two-letter ISO 639-1 language code or an empty string",
        schema: {
          type: "string",
          description: "A two-letter ISO 639-1 language code or an empty string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "GetMyCommandsRequest",
    },
    response: {
      confidence: "contract",
      schema: "GetMyCommandsResponse",
    },
  },
  {
    id: "setMyName",
    command: "set-my-name",
    binding: {
      kind: "rpc",
      name: "setMyName",
    },
    effect: "write",
    summary: "Use this method to change the bot's name. Returns True on success.",
    description: "Use this method to change the bot's name. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "name",
        in: "body",
        required: false,
        description:
          "New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language.",
        schema: {
          type: "string",
          description:
            "New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language.",
        },
      },
      {
        name: "language_code",
        in: "body",
        required: false,
        description:
          "A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name.",
        schema: {
          type: "string",
          description:
            "A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name.",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "SetMyNameRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetMyNameResponse",
    },
  },
  {
    id: "getMyName",
    command: "get-my-name",
    binding: {
      kind: "rpc",
      name: "getMyName",
    },
    effect: "read",
    summary: "Use this method to get the current bot name for the given user language. Returns BotName on success.",
    description: "Use this method to get the current bot name for the given user language. Returns BotName on success.",
    tags: [],
    parameters: [
      {
        name: "language_code",
        in: "body",
        required: false,
        description: "A two-letter ISO 639-1 language code or an empty string",
        schema: {
          type: "string",
          description: "A two-letter ISO 639-1 language code or an empty string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "GetMyNameRequest",
    },
    response: {
      confidence: "contract",
      schema: "BotName",
    },
  },
  {
    id: "setMyDescription",
    command: "set-my-description",
    binding: {
      kind: "rpc",
      name: "setMyDescription",
    },
    effect: "write",
    summary:
      "Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns True on success.",
    description:
      "Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "description",
        in: "body",
        required: false,
        description:
          "New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language.",
        schema: {
          type: "string",
          description:
            "New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language.",
        },
      },
      {
        name: "language_code",
        in: "body",
        required: false,
        description:
          "A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description.",
        schema: {
          type: "string",
          description:
            "A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description.",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "SetMyDescriptionRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetMyDescriptionResponse",
    },
  },
  {
    id: "getMyDescription",
    command: "get-my-description",
    binding: {
      kind: "rpc",
      name: "getMyDescription",
    },
    effect: "read",
    summary:
      "Use this method to get the current bot description for the given user language. Returns BotDescription on success.",
    description:
      "Use this method to get the current bot description for the given user language. Returns BotDescription on success.",
    tags: [],
    parameters: [
      {
        name: "language_code",
        in: "body",
        required: false,
        description: "A two-letter ISO 639-1 language code or an empty string",
        schema: {
          type: "string",
          description: "A two-letter ISO 639-1 language code or an empty string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "GetMyDescriptionRequest",
    },
    response: {
      confidence: "contract",
      schema: "BotDescription",
    },
  },
  {
    id: "setMyShortDescription",
    command: "set-my-short-description",
    binding: {
      kind: "rpc",
      name: "setMyShortDescription",
    },
    effect: "write",
    summary:
      "Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns True on success.",
    description:
      "Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "short_description",
        in: "body",
        required: false,
        description:
          "New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language.",
        schema: {
          type: "string",
          description:
            "New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language.",
        },
      },
      {
        name: "language_code",
        in: "body",
        required: false,
        description:
          "A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description.",
        schema: {
          type: "string",
          description:
            "A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description.",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "SetMyShortDescriptionRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetMyShortDescriptionResponse",
    },
  },
  {
    id: "getMyShortDescription",
    command: "get-my-short-description",
    binding: {
      kind: "rpc",
      name: "getMyShortDescription",
    },
    effect: "read",
    summary:
      "Use this method to get the current bot short description for the given user language. Returns BotShortDescription on success.",
    description:
      "Use this method to get the current bot short description for the given user language. Returns BotShortDescription on success.",
    tags: [],
    parameters: [
      {
        name: "language_code",
        in: "body",
        required: false,
        description: "A two-letter ISO 639-1 language code or an empty string",
        schema: {
          type: "string",
          description: "A two-letter ISO 639-1 language code or an empty string",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "GetMyShortDescriptionRequest",
    },
    response: {
      confidence: "contract",
      schema: "BotShortDescription",
    },
  },
  {
    id: "setMyProfilePhoto",
    command: "set-my-profile-photo",
    binding: {
      kind: "rpc",
      name: "setMyProfilePhoto",
    },
    effect: "write",
    summary: "Changes the profile photo of the bot. Returns True on success.",
    description: "Changes the profile photo of the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "photo",
        in: "body",
        required: true,
        description: "The new profile photo to set",
        schema: {
          type: "ref",
          ref: "InputProfilePhoto",
          description: "The new profile photo to set",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetMyProfilePhotoRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetMyProfilePhotoResponse",
    },
  },
  {
    id: "removeMyProfilePhoto",
    command: "remove-my-profile-photo",
    binding: {
      kind: "rpc",
      name: "removeMyProfilePhoto",
    },
    effect: "destructive",
    summary: "Removes the profile photo of the bot. Requires no parameters. Returns True on success.",
    description: "Removes the profile photo of the bot. Requires no parameters. Returns True on success.",
    tags: [],
    parameters: [],
    response: {
      confidence: "contract",
      schema: "RemoveMyProfilePhotoResponse",
    },
  },
  {
    id: "setChatMenuButton",
    command: "set-chat-menu-button",
    binding: {
      kind: "rpc",
      name: "setChatMenuButton",
    },
    effect: "write",
    summary:
      "Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.",
    description:
      "Use this method to change the bot's menu button in a private chat, or the default menu button. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target private chat. If not specified, the bot's default menu button will be changed.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target private chat. If not specified, the bot's default menu button will be changed.",
        },
      },
      {
        name: "menu_button",
        in: "body",
        required: false,
        description: "A JSON-serialized object for the bot's new menu button. Defaults to MenuButtonDefault.",
        schema: {
          type: "ref",
          ref: "MenuButton",
          description: "A JSON-serialized object for the bot's new menu button. Defaults to MenuButtonDefault.",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "SetChatMenuButtonRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetChatMenuButtonResponse",
    },
  },
  {
    id: "getChatMenuButton",
    command: "get-chat-menu-button",
    binding: {
      kind: "rpc",
      name: "getChatMenuButton",
    },
    effect: "read",
    summary:
      "Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.",
    description:
      "Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns MenuButton on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target private chat. If not specified, the bot's default menu button will be returned.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target private chat. If not specified, the bot's default menu button will be returned.",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "GetChatMenuButtonRequest",
    },
    response: {
      confidence: "contract",
      schema: "MenuButton",
    },
  },
  {
    id: "setMyDefaultAdministratorRights",
    command: "set-my-default-administrator-rights",
    binding: {
      kind: "rpc",
      name: "setMyDefaultAdministratorRights",
    },
    effect: "write",
    summary:
      "Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns True on success.",
    description:
      "Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "rights",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared.",
        schema: {
          type: "ref",
          ref: "ChatAdministratorRights",
          description:
            "A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared.",
        },
      },
      {
        name: "for_channels",
        in: "body",
        required: false,
        description:
          "Pass True to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed.",
        schema: {
          type: "boolean",
          description:
            "Pass True to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed.",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "SetMyDefaultAdministratorRightsRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetMyDefaultAdministratorRightsResponse",
    },
  },
  {
    id: "getMyDefaultAdministratorRights",
    command: "get-my-default-administrator-rights",
    binding: {
      kind: "rpc",
      name: "getMyDefaultAdministratorRights",
    },
    effect: "read",
    summary:
      "Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.",
    description:
      "Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.",
    tags: [],
    parameters: [
      {
        name: "for_channels",
        in: "body",
        required: false,
        description:
          "Pass True to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned.",
        schema: {
          type: "boolean",
          description:
            "Pass True to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned.",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "GetMyDefaultAdministratorRightsRequest",
    },
    response: {
      confidence: "contract",
      schema: "ChatAdministratorRights",
    },
  },
  {
    id: "getAvailableGifts",
    command: "get-available-gifts",
    binding: {
      kind: "rpc",
      name: "getAvailableGifts",
    },
    effect: "read",
    summary:
      "Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a Gifts object.",
    description:
      "Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a Gifts object.",
    tags: [],
    parameters: [],
    response: {
      confidence: "contract",
      schema: "Gifts",
    },
  },
  {
    id: "sendGift",
    command: "send-gift",
    binding: {
      kind: "rpc",
      name: "sendGift",
    },
    effect: "destructive",
    summary:
      "Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns True on success.",
    description:
      "Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: false,
        description:
          "Required if chat_id is not specified. Unique identifier of the target user who will receive the gift.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Required if chat_id is not specified. Unique identifier of the target user who will receive the gift.",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: false,
        description:
          "Required if user_id is not specified. Unique identifier for the chat or username of the channel (in the format @username) that will receive the gift.",
        schema: {
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
      },
      {
        name: "gift_id",
        in: "body",
        required: true,
        description: "Identifier of the gift; limited gifts can't be sent to channel chats",
        schema: {
          type: "string",
          description: "Identifier of the gift; limited gifts can't be sent to channel chats",
        },
      },
      {
        name: "pay_for_upgrade",
        in: "body",
        required: false,
        description:
          "Pass True to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver",
        schema: {
          type: "boolean",
          description:
            "Pass True to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver",
        },
      },
      {
        name: "text",
        in: "body",
        required: false,
        description: "Text that will be shown along with the gift; 0-128 characters",
        schema: {
          type: "string",
          description: "Text that will be shown along with the gift; 0-128 characters",
        },
      },
      {
        name: "text_parse_mode",
        in: "body",
        required: false,
        description:
          'Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
        schema: {
          type: "string",
          description:
            'Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
        },
      },
      {
        name: "text_entities",
        in: "body",
        required: false,
        description:
          'A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            'A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendGiftRequest",
    },
    response: {
      confidence: "contract",
      schema: "SendGiftResponse",
    },
  },
  {
    id: "giftPremiumSubscription",
    command: "gift-premium-subscription",
    binding: {
      kind: "rpc",
      name: "giftPremiumSubscription",
    },
    effect: "destructive",
    summary: "Gifts a Telegram Premium subscription to the given user. Returns True on success.",
    description: "Gifts a Telegram Premium subscription to the given user. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user who will receive a Telegram Premium subscription",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user who will receive a Telegram Premium subscription",
        },
      },
      {
        name: "month_count",
        in: "body",
        required: true,
        description:
          "Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12",
        schema: {
          type: "integer",
          description:
            "Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12",
        },
      },
      {
        name: "star_count",
        in: "body",
        required: true,
        description:
          "Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months",
        schema: {
          type: "integer",
          description:
            "Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months",
        },
      },
      {
        name: "text",
        in: "body",
        required: false,
        description: "Text that will be shown along with the service message about the subscription; 0-128 characters",
        schema: {
          type: "string",
          description:
            "Text that will be shown along with the service message about the subscription; 0-128 characters",
        },
      },
      {
        name: "text_parse_mode",
        in: "body",
        required: false,
        description:
          'Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
        schema: {
          type: "string",
          description:
            'Mode for parsing entities in the text. See formatting options for more details. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
        },
      },
      {
        name: "text_entities",
        in: "body",
        required: false,
        description:
          'A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            'A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of text_parse_mode. Entities other than "bold", "italic", "underline", "strikethrough", "spoiler", "custom_emoji", and "date_time" are ignored.',
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GiftPremiumSubscriptionRequest",
    },
    response: {
      confidence: "contract",
      schema: "GiftPremiumSubscriptionResponse",
    },
  },
  {
    id: "verifyUser",
    command: "verify-user",
    binding: {
      kind: "rpc",
      name: "verifyUser",
    },
    effect: "write",
    summary: "Verifies a user on behalf of the organization which is represented by the bot. Returns True on success.",
    description:
      "Verifies a user on behalf of the organization which is represented by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
      {
        name: "custom_description",
        in: "body",
        required: false,
        description:
          "Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description.",
        schema: {
          type: "string",
          description:
            "Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "VerifyUserRequest",
    },
    response: {
      confidence: "contract",
      schema: "VerifyUserResponse",
    },
  },
  {
    id: "verifyChat",
    command: "verify-chat",
    binding: {
      kind: "rpc",
      name: "verifyChat",
    },
    effect: "write",
    summary: "Verifies a chat on behalf of the organization which is represented by the bot. Returns True on success.",
    description:
      "Verifies a chat on behalf of the organization which is represented by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username. Channel direct messages chats can't be verified.",
        schema: {
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
      },
      {
        name: "custom_description",
        in: "body",
        required: false,
        description:
          "Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description.",
        schema: {
          type: "string",
          description:
            "Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "VerifyChatRequest",
    },
    response: {
      confidence: "contract",
      schema: "VerifyChatResponse",
    },
  },
  {
    id: "removeUserVerification",
    command: "remove-user-verification",
    binding: {
      kind: "rpc",
      name: "removeUserVerification",
    },
    effect: "destructive",
    summary:
      "Removes verification from a user who is currently verified on behalf of the organization represented by the bot. Returns True on success.",
    description:
      "Removes verification from a user who is currently verified on behalf of the organization represented by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "RemoveUserVerificationRequest",
    },
    response: {
      confidence: "contract",
      schema: "RemoveUserVerificationResponse",
    },
  },
  {
    id: "removeChatVerification",
    command: "remove-chat-verification",
    binding: {
      kind: "rpc",
      name: "removeChatVerification",
    },
    effect: "destructive",
    summary:
      "Removes verification from a chat that is currently verified on behalf of the organization represented by the bot. Returns True on success.",
    description:
      "Removes verification from a chat that is currently verified on behalf of the organization represented by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot or channel in the format @username",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "RemoveChatVerificationRequest",
    },
    response: {
      confidence: "contract",
      schema: "RemoveChatVerificationResponse",
    },
  },
  {
    id: "readBusinessMessage",
    command: "read-business-message",
    binding: {
      kind: "rpc",
      name: "readBusinessMessage",
    },
    effect: "write",
    summary:
      "Marks incoming message as read on behalf of a business account. Requires the can_read_messages business bot right. Returns True on success.",
    description:
      "Marks incoming message as read on behalf of a business account. Requires the can_read_messages business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection on behalf of which to read the message",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which to read the message",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours.",
        },
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Unique identifier of the message to mark as read",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the message to mark as read",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ReadBusinessMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "ReadBusinessMessageResponse",
    },
  },
  {
    id: "deleteBusinessMessages",
    command: "delete-business-messages",
    binding: {
      kind: "rpc",
      name: "deleteBusinessMessages",
    },
    effect: "destructive",
    summary:
      "Delete messages on behalf of a business account. Requires the can_delete_sent_messages business bot right to delete messages sent by the bot itself, or the can_delete_all_messages business bot right to delete any message. Returns True on success.",
    description:
      "Delete messages on behalf of a business account. Requires the can_delete_sent_messages business bot right to delete messages sent by the bot itself, or the can_delete_all_messages business bot right to delete any message. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection on behalf of which to delete the messages",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which to delete the messages",
        },
      },
      {
        name: "message_ids",
        in: "body",
        required: true,
        description:
          "A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See deleteMessage for limitations on which messages can be deleted.",
        schema: {
          type: "array",
          items: {
            type: "integer",
          },
          description:
            "A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See deleteMessage for limitations on which messages can be deleted.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteBusinessMessagesRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteBusinessMessagesResponse",
    },
  },
  {
    id: "setBusinessAccountName",
    command: "set-business-account-name",
    binding: {
      kind: "rpc",
      name: "setBusinessAccountName",
    },
    effect: "write",
    summary:
      "Changes the first and last name of a managed business account. Requires the can_change_name business bot right. Returns True on success.",
    description:
      "Changes the first and last name of a managed business account. Requires the can_change_name business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "first_name",
        in: "body",
        required: true,
        description: "The new value of the first name for the business account; 1-64 characters",
        schema: {
          type: "string",
          description: "The new value of the first name for the business account; 1-64 characters",
        },
      },
      {
        name: "last_name",
        in: "body",
        required: false,
        description: "The new value of the last name for the business account; 0-64 characters",
        schema: {
          type: "string",
          description: "The new value of the last name for the business account; 0-64 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetBusinessAccountNameRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetBusinessAccountNameResponse",
    },
  },
  {
    id: "setBusinessAccountUsername",
    command: "set-business-account-username",
    binding: {
      kind: "rpc",
      name: "setBusinessAccountUsername",
    },
    effect: "write",
    summary:
      "Changes the username of a managed business account. Requires the can_change_username business bot right. Returns True on success.",
    description:
      "Changes the username of a managed business account. Requires the can_change_username business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "username",
        in: "body",
        required: false,
        description: "The new value of the username for the business account; 0-32 characters",
        schema: {
          type: "string",
          description: "The new value of the username for the business account; 0-32 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetBusinessAccountUsernameRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetBusinessAccountUsernameResponse",
    },
  },
  {
    id: "setBusinessAccountBio",
    command: "set-business-account-bio",
    binding: {
      kind: "rpc",
      name: "setBusinessAccountBio",
    },
    effect: "write",
    summary:
      "Changes the bio of a managed business account. Requires the can_change_bio business bot right. Returns True on success.",
    description:
      "Changes the bio of a managed business account. Requires the can_change_bio business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "bio",
        in: "body",
        required: false,
        description: "The new value of the bio for the business account; 0-140 characters",
        schema: {
          type: "string",
          description: "The new value of the bio for the business account; 0-140 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetBusinessAccountBioRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetBusinessAccountBioResponse",
    },
  },
  {
    id: "setBusinessAccountProfilePhoto",
    command: "set-business-account-profile-photo",
    binding: {
      kind: "rpc",
      name: "setBusinessAccountProfilePhoto",
    },
    effect: "write",
    summary:
      "Changes the profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.",
    description:
      "Changes the profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "photo",
        in: "body",
        required: true,
        description: "The new profile photo to set",
        schema: {
          type: "ref",
          ref: "InputProfilePhoto",
          description: "The new profile photo to set",
        },
      },
      {
        name: "is_public",
        in: "body",
        required: false,
        description:
          "Pass True to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo.",
        schema: {
          type: "boolean",
          description:
            "Pass True to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetBusinessAccountProfilePhotoRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetBusinessAccountProfilePhotoResponse",
    },
  },
  {
    id: "removeBusinessAccountProfilePhoto",
    command: "remove-business-account-profile-photo",
    binding: {
      kind: "rpc",
      name: "removeBusinessAccountProfilePhoto",
    },
    effect: "destructive",
    summary:
      "Removes the current profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.",
    description:
      "Removes the current profile photo of a managed business account. Requires the can_edit_profile_photo business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "is_public",
        in: "body",
        required: false,
        description:
          "Pass True to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo.",
        schema: {
          type: "boolean",
          description:
            "Pass True to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "RemoveBusinessAccountProfilePhotoRequest",
    },
    response: {
      confidence: "contract",
      schema: "RemoveBusinessAccountProfilePhotoResponse",
    },
  },
  {
    id: "setBusinessAccountGiftSettings",
    command: "set-business-account-gift-settings",
    binding: {
      kind: "rpc",
      name: "setBusinessAccountGiftSettings",
    },
    effect: "write",
    summary:
      "Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the can_change_gift_settings business bot right. Returns True on success.",
    description:
      "Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the can_change_gift_settings business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "show_gift_button",
        in: "body",
        required: true,
        description:
          "Pass True if a button for sending a gift to the user or by the business account must always be shown in the input field",
        schema: {
          type: "boolean",
          description:
            "Pass True if a button for sending a gift to the user or by the business account must always be shown in the input field",
        },
      },
      {
        name: "accepted_gift_types",
        in: "body",
        required: true,
        description: "Types of gifts accepted by the business account",
        schema: {
          type: "ref",
          ref: "AcceptedGiftTypes",
          description: "Types of gifts accepted by the business account",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetBusinessAccountGiftSettingsRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetBusinessAccountGiftSettingsResponse",
    },
  },
  {
    id: "getBusinessAccountStarBalance",
    command: "get-business-account-star-balance",
    binding: {
      kind: "rpc",
      name: "getBusinessAccountStarBalance",
    },
    effect: "read",
    summary:
      "Returns the amount of Telegram Stars owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns StarAmount on success.",
    description:
      "Returns the amount of Telegram Stars owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns StarAmount on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetBusinessAccountStarBalanceRequest",
    },
    response: {
      confidence: "contract",
      schema: "StarAmount",
    },
  },
  {
    id: "transferBusinessAccountStars",
    command: "transfer-business-account-stars",
    binding: {
      kind: "rpc",
      name: "transferBusinessAccountStars",
    },
    effect: "destructive",
    summary:
      "Transfers Telegram Stars from the business account balance to the bot's balance. Requires the can_transfer_stars business bot right. Returns True on success.",
    description:
      "Transfers Telegram Stars from the business account balance to the bot's balance. Requires the can_transfer_stars business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "star_count",
        in: "body",
        required: true,
        description: "Number of Telegram Stars to transfer; 1-10000",
        schema: {
          type: "integer",
          description: "Number of Telegram Stars to transfer; 1-10000",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "TransferBusinessAccountStarsRequest",
    },
    response: {
      confidence: "contract",
      schema: "TransferBusinessAccountStarsResponse",
    },
  },
  {
    id: "getBusinessAccountGifts",
    command: "get-business-account-gifts",
    binding: {
      kind: "rpc",
      name: "getBusinessAccountGifts",
    },
    effect: "read",
    summary:
      "Returns the gifts received and owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns OwnedGifts on success.",
    description:
      "Returns the gifts received and owned by a managed business account. Requires the can_view_gifts_and_stars business bot right. Returns OwnedGifts on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "exclude_unsaved",
        in: "body",
        required: false,
        description: "Pass True to exclude gifts that aren't saved to the account's profile page",
        schema: {
          type: "boolean",
          description: "Pass True to exclude gifts that aren't saved to the account's profile page",
        },
      },
      {
        name: "exclude_saved",
        in: "body",
        required: false,
        description: "Pass True to exclude gifts that are saved to the account's profile page",
        schema: {
          type: "boolean",
          description: "Pass True to exclude gifts that are saved to the account's profile page",
        },
      },
      {
        name: "exclude_unlimited",
        in: "body",
        required: false,
        description: "Pass True to exclude gifts that can be purchased an unlimited number of times",
        schema: {
          type: "boolean",
          description: "Pass True to exclude gifts that can be purchased an unlimited number of times",
        },
      },
      {
        name: "exclude_limited_upgradable",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique",
        },
      },
      {
        name: "exclude_limited_non_upgradable",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique",
        },
      },
      {
        name: "exclude_unique",
        in: "body",
        required: false,
        description: "Pass True to exclude unique gifts",
        schema: {
          type: "boolean",
          description: "Pass True to exclude unique gifts",
        },
      },
      {
        name: "exclude_from_blockchain",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram",
        },
      },
      {
        name: "sort_by_price",
        in: "body",
        required: false,
        description:
          "Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.",
        schema: {
          type: "boolean",
          description:
            "Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.",
        },
      },
      {
        name: "offset",
        in: "body",
        required: false,
        description:
          "Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results",
        schema: {
          type: "string",
          description:
            "Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results",
        },
      },
      {
        name: "limit",
        in: "body",
        required: false,
        description: "The maximum number of gifts to be returned; 1-100. Defaults to 100.",
        schema: {
          type: "integer",
          description: "The maximum number of gifts to be returned; 1-100. Defaults to 100.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetBusinessAccountGiftsRequest",
    },
    response: {
      confidence: "contract",
      schema: "OwnedGifts",
    },
  },
  {
    id: "getUserGifts",
    command: "get-user-gifts",
    binding: {
      kind: "rpc",
      name: "getUserGifts",
    },
    effect: "read",
    summary: "Returns the gifts owned and hosted by a user. Returns OwnedGifts on success.",
    description: "Returns the gifts owned and hosted by a user. Returns OwnedGifts on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the user",
        },
      },
      {
        name: "exclude_unlimited",
        in: "body",
        required: false,
        description: "Pass True to exclude gifts that can be purchased an unlimited number of times",
        schema: {
          type: "boolean",
          description: "Pass True to exclude gifts that can be purchased an unlimited number of times",
        },
      },
      {
        name: "exclude_limited_upgradable",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique",
        },
      },
      {
        name: "exclude_limited_non_upgradable",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique",
        },
      },
      {
        name: "exclude_from_blockchain",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram",
        },
      },
      {
        name: "exclude_unique",
        in: "body",
        required: false,
        description: "Pass True to exclude unique gifts",
        schema: {
          type: "boolean",
          description: "Pass True to exclude unique gifts",
        },
      },
      {
        name: "sort_by_price",
        in: "body",
        required: false,
        description:
          "Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.",
        schema: {
          type: "boolean",
          description:
            "Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.",
        },
      },
      {
        name: "offset",
        in: "body",
        required: false,
        description:
          "Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results",
        schema: {
          type: "string",
          description:
            "Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results",
        },
      },
      {
        name: "limit",
        in: "body",
        required: false,
        description: "The maximum number of gifts to be returned; 1-100. Defaults to 100.",
        schema: {
          type: "integer",
          description: "The maximum number of gifts to be returned; 1-100. Defaults to 100.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetUserGiftsRequest",
    },
    response: {
      confidence: "contract",
      schema: "OwnedGifts",
    },
  },
  {
    id: "getChatGifts",
    command: "get-chat-gifts",
    binding: {
      kind: "rpc",
      name: "getChatGifts",
    },
    effect: "read",
    summary: "Returns the gifts owned by a chat. Returns OwnedGifts on success.",
    description: "Returns the gifts owned by a chat. Returns OwnedGifts on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target channel in the format @username",
        schema: {
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
            "Unique identifier for the target chat or username of the target channel in the format @username",
        },
      },
      {
        name: "exclude_unsaved",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that aren't saved to the chat's profile page. Always True, unless the bot has the can_post_messages administrator right in the channel.",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that aren't saved to the chat's profile page. Always True, unless the bot has the can_post_messages administrator right in the channel.",
        },
      },
      {
        name: "exclude_saved",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that are saved to the chat's profile page. Always False, unless the bot has the can_post_messages administrator right in the channel.",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that are saved to the chat's profile page. Always False, unless the bot has the can_post_messages administrator right in the channel.",
        },
      },
      {
        name: "exclude_unlimited",
        in: "body",
        required: false,
        description: "Pass True to exclude gifts that can be purchased an unlimited number of times",
        schema: {
          type: "boolean",
          description: "Pass True to exclude gifts that can be purchased an unlimited number of times",
        },
      },
      {
        name: "exclude_limited_upgradable",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that can be purchased a limited number of times and can be upgraded to unique",
        },
      },
      {
        name: "exclude_limited_non_upgradable",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique",
        },
      },
      {
        name: "exclude_from_blockchain",
        in: "body",
        required: false,
        description:
          "Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram",
        schema: {
          type: "boolean",
          description:
            "Pass True to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram",
        },
      },
      {
        name: "exclude_unique",
        in: "body",
        required: false,
        description: "Pass True to exclude unique gifts",
        schema: {
          type: "boolean",
          description: "Pass True to exclude unique gifts",
        },
      },
      {
        name: "sort_by_price",
        in: "body",
        required: false,
        description:
          "Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.",
        schema: {
          type: "boolean",
          description:
            "Pass True to sort results by gift price instead of send date. Sorting is applied before pagination.",
        },
      },
      {
        name: "offset",
        in: "body",
        required: false,
        description:
          "Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results",
        schema: {
          type: "string",
          description:
            "Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results",
        },
      },
      {
        name: "limit",
        in: "body",
        required: false,
        description: "The maximum number of gifts to be returned; 1-100. Defaults to 100.",
        schema: {
          type: "integer",
          description: "The maximum number of gifts to be returned; 1-100. Defaults to 100.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetChatGiftsRequest",
    },
    response: {
      confidence: "contract",
      schema: "OwnedGifts",
    },
  },
  {
    id: "convertGiftToStars",
    command: "convert-gift-to-stars",
    binding: {
      kind: "rpc",
      name: "convertGiftToStars",
    },
    effect: "destructive",
    summary:
      "Converts a given regular gift to Telegram Stars. Requires the can_convert_gifts_to_stars business bot right. Returns True on success.",
    description:
      "Converts a given regular gift to Telegram Stars. Requires the can_convert_gifts_to_stars business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "owned_gift_id",
        in: "body",
        required: true,
        description: "Unique identifier of the regular gift that should be converted to Telegram Stars",
        schema: {
          type: "string",
          description: "Unique identifier of the regular gift that should be converted to Telegram Stars",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ConvertGiftToStarsRequest",
    },
    response: {
      confidence: "contract",
      schema: "ConvertGiftToStarsResponse",
    },
  },
  {
    id: "upgradeGift",
    command: "upgrade-gift",
    binding: {
      kind: "rpc",
      name: "upgradeGift",
    },
    effect: "destructive",
    summary:
      "Upgrades a given regular gift to a unique gift. Requires the can_transfer_and_upgrade_gifts business bot right. Additionally requires the can_transfer_stars business bot right if the upgrade is paid. Returns True on success.",
    description:
      "Upgrades a given regular gift to a unique gift. Requires the can_transfer_and_upgrade_gifts business bot right. Additionally requires the can_transfer_stars business bot right if the upgrade is paid. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "owned_gift_id",
        in: "body",
        required: true,
        description: "Unique identifier of the regular gift that should be upgraded to a unique one",
        schema: {
          type: "string",
          description: "Unique identifier of the regular gift that should be upgraded to a unique one",
        },
      },
      {
        name: "keep_original_details",
        in: "body",
        required: false,
        description: "Pass True to keep the original gift text, sender and receiver in the upgraded gift",
        schema: {
          type: "boolean",
          description: "Pass True to keep the original gift text, sender and receiver in the upgraded gift",
        },
      },
      {
        name: "star_count",
        in: "body",
        required: false,
        description:
          "The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If gift.prepaid_upgrade_star_count > 0, then pass 0, otherwise, the can_transfer_stars business bot right is required and gift.upgrade_star_count must be passed.",
        schema: {
          type: "integer",
          description:
            "The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If gift.prepaid_upgrade_star_count > 0, then pass 0, otherwise, the can_transfer_stars business bot right is required and gift.upgrade_star_count must be passed.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "UpgradeGiftRequest",
    },
    response: {
      confidence: "contract",
      schema: "UpgradeGiftResponse",
    },
  },
  {
    id: "transferGift",
    command: "transfer-gift",
    binding: {
      kind: "rpc",
      name: "transferGift",
    },
    effect: "destructive",
    summary:
      "Transfers an owned unique gift to another user. Requires the can_transfer_and_upgrade_gifts business bot right. Requires can_transfer_stars business bot right if the transfer is paid. Returns True on success.",
    description:
      "Transfers an owned unique gift to another user. Requires the can_transfer_and_upgrade_gifts business bot right. Requires can_transfer_stars business bot right if the transfer is paid. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "owned_gift_id",
        in: "body",
        required: true,
        description: "Unique identifier of the regular gift that should be transferred",
        schema: {
          type: "string",
          description: "Unique identifier of the regular gift that should be transferred",
        },
      },
      {
        name: "new_owner_chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours.",
        },
      },
      {
        name: "star_count",
        in: "body",
        required: false,
        description:
          "The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the can_transfer_stars business bot right is required.",
        schema: {
          type: "integer",
          description:
            "The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the can_transfer_stars business bot right is required.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "TransferGiftRequest",
    },
    response: {
      confidence: "contract",
      schema: "TransferGiftResponse",
    },
  },
  {
    id: "postStory",
    command: "post-story",
    binding: {
      kind: "rpc",
      name: "postStory",
    },
    effect: "write",
    summary:
      "Posts a story on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.",
    description:
      "Posts a story on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "content",
        in: "body",
        required: true,
        description: "Content of the story",
        schema: {
          type: "ref",
          ref: "InputStoryContent",
          description: "Content of the story",
        },
      },
      {
        name: "active_period",
        in: "body",
        required: true,
        description:
          "Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400",
        schema: {
          type: "integer",
          description:
            "Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400",
        },
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description: "Caption of the story, 0-2048 characters after entities parsing",
        schema: {
          type: "string",
          description: "Caption of the story, 0-2048 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the story caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the story caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "areas",
        in: "body",
        required: false,
        description: "A JSON-serialized list of clickable areas to be shown on the story",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "StoryArea",
          },
          description: "A JSON-serialized list of clickable areas to be shown on the story",
        },
      },
      {
        name: "post_to_chat_page",
        in: "body",
        required: false,
        description: "Pass True to keep the story accessible after it expires",
        schema: {
          type: "boolean",
          description: "Pass True to keep the story accessible after it expires",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Pass True if the content of the story must be protected from forwarding and screenshotting",
        schema: {
          type: "boolean",
          description: "Pass True if the content of the story must be protected from forwarding and screenshotting",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "PostStoryRequest",
    },
    response: {
      confidence: "contract",
      schema: "Story",
    },
  },
  {
    id: "repostStory",
    command: "repost-story",
    binding: {
      kind: "rpc",
      name: "repostStory",
    },
    effect: "write",
    summary:
      "Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the can_manage_stories business bot right for both business accounts. Returns Story on success.",
    description:
      "Reposts a story on behalf of a business account from another business account. Both business accounts must be managed by the same bot, and the story on the source account must have been posted (or reposted) by the bot. Requires the can_manage_stories business bot right for both business accounts. Returns Story on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "from_chat_id",
        in: "body",
        required: true,
        description: "Unique identifier of the chat which posted the story that should be reposted",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the chat which posted the story that should be reposted",
        },
      },
      {
        name: "from_story_id",
        in: "body",
        required: true,
        description: "Unique identifier of the story that should be reposted",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the story that should be reposted",
        },
      },
      {
        name: "active_period",
        in: "body",
        required: true,
        description:
          "Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400",
        schema: {
          type: "integer",
          description:
            "Period after which the story is moved to the archive, in seconds; must be one of 6 * 3600, 12 * 3600, 86400, or 2 * 86400",
        },
      },
      {
        name: "post_to_chat_page",
        in: "body",
        required: false,
        description: "Pass True to keep the story accessible after it expires",
        schema: {
          type: "boolean",
          description: "Pass True to keep the story accessible after it expires",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Pass True if the content of the story must be protected from forwarding and screenshotting",
        schema: {
          type: "boolean",
          description: "Pass True if the content of the story must be protected from forwarding and screenshotting",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "RepostStoryRequest",
    },
    response: {
      confidence: "contract",
      schema: "Story",
    },
  },
  {
    id: "editStory",
    command: "edit-story",
    binding: {
      kind: "rpc",
      name: "editStory",
    },
    effect: "write",
    summary:
      "Edits a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.",
    description:
      "Edits a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns Story on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "story_id",
        in: "body",
        required: true,
        description: "Unique identifier of the story to edit",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the story to edit",
        },
      },
      {
        name: "content",
        in: "body",
        required: true,
        description: "Content of the story",
        schema: {
          type: "ref",
          ref: "InputStoryContent",
          description: "Content of the story",
        },
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description: "Caption of the story, 0-2048 characters after entities parsing",
        schema: {
          type: "string",
          description: "Caption of the story, 0-2048 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the story caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the story caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "areas",
        in: "body",
        required: false,
        description: "A JSON-serialized list of clickable areas to be shown on the story",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "StoryArea",
          },
          description: "A JSON-serialized list of clickable areas to be shown on the story",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditStoryRequest",
    },
    response: {
      confidence: "contract",
      schema: "Story",
    },
  },
  {
    id: "deleteStory",
    command: "delete-story",
    binding: {
      kind: "rpc",
      name: "deleteStory",
    },
    effect: "destructive",
    summary:
      "Deletes a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns True on success.",
    description:
      "Deletes a story previously posted by the bot on behalf of a managed business account. Requires the can_manage_stories business bot right. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection",
        },
      },
      {
        name: "story_id",
        in: "body",
        required: true,
        description: "Unique identifier of the story to delete",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the story to delete",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteStoryRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteStoryResponse",
    },
  },
  {
    id: "answerWebAppQuery",
    command: "answer-web-app-query",
    binding: {
      kind: "rpc",
      name: "answerWebAppQuery",
    },
    effect: "write",
    summary:
      "Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a SentWebAppMessage object is returned.",
    description:
      "Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a SentWebAppMessage object is returned.",
    tags: [],
    parameters: [
      {
        name: "web_app_query_id",
        in: "body",
        required: true,
        description: "Unique identifier for the query to be answered",
        schema: {
          type: "string",
          description: "Unique identifier for the query to be answered",
        },
      },
      {
        name: "result",
        in: "body",
        required: true,
        description: "A JSON-serialized object describing the message to be sent",
        schema: {
          type: "ref",
          ref: "InlineQueryResult",
          description: "A JSON-serialized object describing the message to be sent",
        },
        sensitive: true,
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "AnswerWebAppQueryRequest",
    },
    response: {
      confidence: "contract",
      schema: "SentWebAppMessage",
    },
  },
  {
    id: "savePreparedInlineMessage",
    command: "save-prepared-inline-message",
    binding: {
      kind: "rpc",
      name: "savePreparedInlineMessage",
    },
    effect: "write",
    summary: "Stores a message that can be sent by a user of a Mini App. Returns a PreparedInlineMessage object.",
    description: "Stores a message that can be sent by a user of a Mini App. Returns a PreparedInlineMessage object.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user that can use the prepared message",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user that can use the prepared message",
        },
      },
      {
        name: "result",
        in: "body",
        required: true,
        description: "A JSON-serialized object describing the message to be sent",
        schema: {
          type: "ref",
          ref: "InlineQueryResult",
          description: "A JSON-serialized object describing the message to be sent",
        },
        sensitive: true,
      },
      {
        name: "allow_user_chats",
        in: "body",
        required: false,
        description: "Pass True if the message can be sent to private chats with users",
        schema: {
          type: "boolean",
          description: "Pass True if the message can be sent to private chats with users",
        },
      },
      {
        name: "allow_bot_chats",
        in: "body",
        required: false,
        description: "Pass True if the message can be sent to private chats with bots",
        schema: {
          type: "boolean",
          description: "Pass True if the message can be sent to private chats with bots",
        },
      },
      {
        name: "allow_group_chats",
        in: "body",
        required: false,
        description: "Pass True if the message can be sent to group and supergroup chats",
        schema: {
          type: "boolean",
          description: "Pass True if the message can be sent to group and supergroup chats",
        },
      },
      {
        name: "allow_channel_chats",
        in: "body",
        required: false,
        description: "Pass True if the message can be sent to channel chats",
        schema: {
          type: "boolean",
          description: "Pass True if the message can be sent to channel chats",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SavePreparedInlineMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "PreparedInlineMessage",
    },
  },
  {
    id: "savePreparedKeyboardButton",
    command: "save-prepared-keyboard-button",
    binding: {
      kind: "rpc",
      name: "savePreparedKeyboardButton",
    },
    effect: "write",
    summary:
      "Stores a keyboard button that can be used by a user within a Mini App. Returns a PreparedKeyboardButton object.",
    description:
      "Stores a keyboard button that can be used by a user within a Mini App. Returns a PreparedKeyboardButton object.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Unique identifier of the target user that can use the button",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier of the target user that can use the button",
        },
      },
      {
        name: "button",
        in: "body",
        required: true,
        description:
          "A JSON-serialized object describing the button to be saved. The button must be of the type request_users, request_chat, or request_managed_bot.",
        schema: {
          type: "ref",
          ref: "KeyboardButton",
          description:
            "A JSON-serialized object describing the button to be saved. The button must be of the type request_users, request_chat, or request_managed_bot.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SavePreparedKeyboardButtonRequest",
    },
    response: {
      confidence: "contract",
      schema: "PreparedKeyboardButton",
    },
  },
  {
    id: "editMessageText",
    command: "edit-message-text",
    binding: {
      kind: "rpc",
      name: "editMessageText",
    },
    effect: "write",
    summary:
      "Use this method to edit text, rich and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.",
    description:
      "Use this method to edit text, rich and game messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        schema: {
          type: "string",
          description:
            "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: false,
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: false,
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        schema: {
          type: "integer",
          format: "int64",
          description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        },
      },
      {
        name: "inline_message_id",
        in: "body",
        required: false,
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        schema: {
          type: "string",
          description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        },
      },
      {
        name: "text",
        in: "body",
        required: false,
        description:
          "New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified",
        schema: {
          type: "string",
          description:
            "New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the message text. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the message text. See formatting options for more details.",
        },
      },
      {
        name: "entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
        },
      },
      {
        name: "link_preview_options",
        in: "body",
        required: false,
        description: "Link preview generation options for the message",
        schema: {
          type: "ref",
          ref: "LinkPreviewOptions",
          description: "Link preview generation options for the message",
        },
      },
      {
        name: "rich_message",
        in: "body",
        required: false,
        description:
          "New rich content of the message; required if text isn't specified. Direct upload of new files and explicit upload of files by a URL isn't supported when an inline message is edited.",
        schema: {
          type: "ref",
          ref: "InputRichMessage",
          description:
            "New rich content of the message; required if text isn't specified. Direct upload of new files and explicit upload of files by a URL isn't supported when an inline message is edited.",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for an inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for an inline keyboard",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "EditMessageTextRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditMessageTextResponse",
    },
  },
  {
    id: "editMessageCaption",
    command: "edit-message-caption",
    binding: {
      kind: "rpc",
      name: "editMessageCaption",
    },
    effect: "write",
    summary:
      "Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.",
    description:
      "Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        schema: {
          type: "string",
          description:
            "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: false,
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: false,
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        schema: {
          type: "integer",
          format: "int64",
          description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        },
      },
      {
        name: "inline_message_id",
        in: "body",
        required: false,
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        schema: {
          type: "string",
          description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        },
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description: "New caption of the message, 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description: "New caption of the message, 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the message caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the message caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "show_caption_above_media",
        in: "body",
        required: false,
        description:
          "Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages.",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for an inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for an inline keyboard",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "EditMessageCaptionRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditMessageCaptionResponse",
    },
  },
  {
    id: "editMessageMedia",
    command: "edit-message-media",
    binding: {
      kind: "rpc",
      name: "editMessageMedia",
    },
    effect: "write",
    summary:
      "Use this method to edit animation, audio, document, live photo, photo, or video messages, or to replace a text or a rich message with a media. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo, a live photo, or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.",
    description:
      "Use this method to edit animation, audio, document, live photo, photo, or video messages, or to replace a text or a rich message with a media. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo, a live photo, or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        schema: {
          type: "string",
          description:
            "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: false,
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: false,
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        schema: {
          type: "integer",
          format: "int64",
          description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        },
      },
      {
        name: "inline_message_id",
        in: "body",
        required: false,
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        schema: {
          type: "string",
          description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        },
      },
      {
        name: "media",
        in: "body",
        required: true,
        description: "A JSON-serialized object for the new media content of the message",
        schema: {
          type: "ref",
          ref: "InputMedia",
          description: "A JSON-serialized object for the new media content of the message",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for a new inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for a new inline keyboard",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditMessageMediaRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditMessageMediaResponse",
    },
  },
  {
    id: "editMessageLiveLocation",
    command: "edit-message-live-location",
    binding: {
      kind: "rpc",
      name: "editMessageLiveLocation",
    },
    effect: "write",
    summary:
      "Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.",
    description:
      "Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to stopMessageLiveLocation. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        schema: {
          type: "string",
          description:
            "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: false,
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: false,
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        schema: {
          type: "integer",
          format: "int64",
          description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        },
      },
      {
        name: "inline_message_id",
        in: "body",
        required: false,
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        schema: {
          type: "string",
          description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        },
      },
      {
        name: "latitude",
        in: "body",
        required: true,
        description: "Latitude of new location",
        schema: {
          type: "number",
          description: "Latitude of new location",
        },
      },
      {
        name: "longitude",
        in: "body",
        required: true,
        description: "Longitude of new location",
        schema: {
          type: "number",
          description: "Longitude of new location",
        },
      },
      {
        name: "live_period",
        in: "body",
        required: false,
        description:
          "New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current live_period by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then live_period remains unchanged.",
        schema: {
          type: "integer",
          description:
            "New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current live_period by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then live_period remains unchanged.",
        },
      },
      {
        name: "horizontal_accuracy",
        in: "body",
        required: false,
        description: "The radius of uncertainty for the location, measured in meters; 0-1500",
        schema: {
          type: "number",
          description: "The radius of uncertainty for the location, measured in meters; 0-1500",
        },
      },
      {
        name: "heading",
        in: "body",
        required: false,
        description: "Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.",
        schema: {
          type: "integer",
          description: "Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.",
        },
      },
      {
        name: "proximity_alert_radius",
        in: "body",
        required: false,
        description:
          "The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.",
        schema: {
          type: "integer",
          description:
            "The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for a new inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for a new inline keyboard",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditMessageLiveLocationRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditMessageLiveLocationResponse",
    },
  },
  {
    id: "stopMessageLiveLocation",
    command: "stop-message-live-location",
    binding: {
      kind: "rpc",
      name: "stopMessageLiveLocation",
    },
    effect: "write",
    summary:
      "Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.",
    description:
      "Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited Message is returned, otherwise True is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        schema: {
          type: "string",
          description:
            "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: false,
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: false,
        description:
          "Required if inline_message_id is not specified. Identifier of the message with live location to stop.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Required if inline_message_id is not specified. Identifier of the message with live location to stop.",
        },
      },
      {
        name: "inline_message_id",
        in: "body",
        required: false,
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        schema: {
          type: "string",
          description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for a new inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for a new inline keyboard",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "StopMessageLiveLocationRequest",
    },
    response: {
      confidence: "contract",
      schema: "StopMessageLiveLocationResponse",
    },
  },
  {
    id: "editMessageChecklist",
    command: "edit-message-checklist",
    binding: {
      kind: "rpc",
      name: "editMessageChecklist",
    },
    effect: "write",
    summary:
      "Use this method to edit a checklist on behalf of a connected business account. On success, the edited Message is returned.",
    description:
      "Use this method to edit a checklist on behalf of a connected business account. On success, the edited Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: true,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target chat or username of the target bot in the format @username",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target message",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target message",
        },
      },
      {
        name: "checklist",
        in: "body",
        required: true,
        description: "A JSON-serialized object for the new checklist",
        schema: {
          type: "ref",
          ref: "InputChecklist",
          description: "A JSON-serialized object for the new checklist",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for the new inline keyboard for the message",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for the new inline keyboard for the message",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditMessageChecklistRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "editMessageReplyMarkup",
    command: "edit-message-reply-markup",
    binding: {
      kind: "rpc",
      name: "editMessageReplyMarkup",
    },
    effect: "write",
    summary:
      "Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.",
    description:
      "Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        schema: {
          type: "string",
          description:
            "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: false,
        description:
          "Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username.",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: false,
        description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        schema: {
          type: "integer",
          format: "int64",
          description: "Required if inline_message_id is not specified. Identifier of the message to edit.",
        },
      },
      {
        name: "inline_message_id",
        in: "body",
        required: false,
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        schema: {
          type: "string",
          description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for an inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for an inline keyboard",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "EditMessageReplyMarkupRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditMessageReplyMarkupResponse",
    },
  },
  {
    id: "stopPoll",
    command: "stop-poll",
    binding: {
      kind: "rpc",
      name: "stopPoll",
    },
    effect: "write",
    summary: "Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.",
    description: "Use this method to stop a poll which was sent by the bot. On success, the stopped Poll is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        schema: {
          type: "string",
          description:
            "Unique identifier of the business connection on behalf of which the message to be edited was sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Identifier of the original message with the poll",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the original message with the poll",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for a new message inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for a new message inline keyboard",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "StopPollRequest",
    },
    response: {
      confidence: "contract",
      schema: "Poll",
    },
  },
  {
    id: "editEphemeralMessageText",
    command: "edit-ephemeral-message-text",
    binding: {
      kind: "rpc",
      name: "editEphemeralMessageText",
    },
    effect: "write",
    summary:
      "Use this method to edit an ephemeral text or rich message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.",
    description:
      "Use this method to edit an ephemeral text or rich message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "receiver_user_id",
        in: "body",
        required: true,
        description: "Identifier of the user who received the message",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the user who received the message",
        },
      },
      {
        name: "ephemeral_message_id",
        in: "body",
        required: true,
        description: "Identifier of the ephemeral message to edit",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the ephemeral message to edit",
        },
      },
      {
        name: "text",
        in: "body",
        required: false,
        description:
          "New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified",
        schema: {
          type: "string",
          description:
            "New text of the message, 1-4096 characters after entity parsing; required if rich_message isn't specified",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the message text. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the message text. See formatting options for more details.",
        },
      },
      {
        name: "entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode",
        },
      },
      {
        name: "rich_message",
        in: "body",
        required: false,
        description: "New rich content of the message; required if text isn't specified",
        schema: {
          type: "ref",
          ref: "InputRichMessage",
          description: "New rich content of the message; required if text isn't specified",
        },
      },
      {
        name: "link_preview_options",
        in: "body",
        required: false,
        description: "Link preview generation options for the message",
        schema: {
          type: "ref",
          ref: "LinkPreviewOptions",
          description: "Link preview generation options for the message",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for an inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for an inline keyboard",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditEphemeralMessageTextRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditEphemeralMessageTextResponse",
    },
  },
  {
    id: "editEphemeralMessageMedia",
    command: "edit-ephemeral-message-media",
    binding: {
      kind: "rpc",
      name: "editEphemeralMessageMedia",
    },
    effect: "write",
    summary:
      "Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.",
    description:
      "Use this method to edit the media of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "receiver_user_id",
        in: "body",
        required: true,
        description: "Identifier of the user who received the message",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the user who received the message",
        },
      },
      {
        name: "ephemeral_message_id",
        in: "body",
        required: true,
        description: "Identifier of the ephemeral message to edit",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the ephemeral message to edit",
        },
      },
      {
        name: "media",
        in: "body",
        required: true,
        description: "A JSON-serialized object for the new media content of the message",
        schema: {
          type: "ref",
          ref: "InputMedia",
          description: "A JSON-serialized object for the new media content of the message",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for an inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for an inline keyboard",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditEphemeralMessageMediaRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditEphemeralMessageMediaResponse",
    },
  },
  {
    id: "editEphemeralMessageCaption",
    command: "edit-ephemeral-message-caption",
    binding: {
      kind: "rpc",
      name: "editEphemeralMessageCaption",
    },
    effect: "write",
    summary:
      "Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.",
    description:
      "Use this method to edit the caption of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "receiver_user_id",
        in: "body",
        required: true,
        description: "Identifier of the user who received the message",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the user who received the message",
        },
      },
      {
        name: "ephemeral_message_id",
        in: "body",
        required: true,
        description: "Identifier of the ephemeral message to edit",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the ephemeral message to edit",
        },
      },
      {
        name: "caption",
        in: "body",
        required: false,
        description: "New caption of the message, 0-1024 characters after entities parsing",
        schema: {
          type: "string",
          description: "New caption of the message, 0-1024 characters after entities parsing",
        },
      },
      {
        name: "parse_mode",
        in: "body",
        required: false,
        description: "Mode for parsing entities in the message caption. See formatting options for more details.",
        schema: {
          type: "string",
          description: "Mode for parsing entities in the message caption. See formatting options for more details.",
        },
      },
      {
        name: "caption_entities",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "MessageEntity",
          },
          description:
            "A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode",
        },
      },
      {
        name: "show_caption_above_media",
        in: "body",
        required: false,
        description:
          "Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the caption must be shown above the message media. Supported only for animation, photo and video messages.",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for an inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for an inline keyboard",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditEphemeralMessageCaptionRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditEphemeralMessageCaptionResponse",
    },
  },
  {
    id: "editEphemeralMessageReplyMarkup",
    command: "edit-ephemeral-message-reply-markup",
    binding: {
      kind: "rpc",
      name: "editEphemeralMessageReplyMarkup",
    },
    effect: "write",
    summary:
      "Use this method to edit only the reply markup of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.",
    description:
      "Use this method to edit only the reply markup of an ephemeral message. Note that it is not guaranteed that the user will receive the message edit event, especially if they are offline. On success, True is returned.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "receiver_user_id",
        in: "body",
        required: true,
        description: "Identifier of the user who received the message",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the user who received the message",
        },
      },
      {
        name: "ephemeral_message_id",
        in: "body",
        required: true,
        description: "Identifier of the ephemeral message to edit",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the ephemeral message to edit",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description: "A JSON-serialized object for an inline keyboard",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description: "A JSON-serialized object for an inline keyboard",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditEphemeralMessageReplyMarkupRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditEphemeralMessageReplyMarkupResponse",
    },
  },
  {
    id: "approveSuggestedPost",
    command: "approve-suggested-post",
    binding: {
      kind: "rpc",
      name: "approveSuggestedPost",
    },
    effect: "destructive",
    summary:
      "Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns True on success.",
    description:
      "Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target direct messages chat",
        },
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Identifier of a suggested post message to approve",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of a suggested post message to approve",
        },
      },
      {
        name: "send_date",
        in: "body",
        required: false,
        description:
          "Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future.",
        schema: {
          type: "integer",
          description:
            "Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ApproveSuggestedPostRequest",
    },
    response: {
      confidence: "contract",
      schema: "ApproveSuggestedPostResponse",
    },
  },
  {
    id: "declineSuggestedPost",
    command: "decline-suggested-post",
    binding: {
      kind: "rpc",
      name: "declineSuggestedPost",
    },
    effect: "destructive",
    summary:
      "Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns True on success.",
    description:
      "Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target direct messages chat",
        },
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Identifier of a suggested post message to decline",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of a suggested post message to decline",
        },
      },
      {
        name: "comment",
        in: "body",
        required: false,
        description: "Comment for the creator of the suggested post; 0-128 characters",
        schema: {
          type: "string",
          description: "Comment for the creator of the suggested post; 0-128 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeclineSuggestedPostRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeclineSuggestedPostResponse",
    },
  },
  {
    id: "deleteMessage",
    command: "delete-message",
    binding: {
      kind: "rpc",
      name: "deleteMessage",
    },
    effect: "destructive",
    summary: "Use this method to delete a message, including service messages, with the following limitations:",
    description:
      "Use this method to delete a message, including service messages, with the following limitations:\n\n- A message can only be deleted if it was sent less than 48 hours ago.\n\n- Service messages about a supergroup, channel, or forum topic creation can't be deleted.\n\n- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.\n\n- Bots can delete outgoing messages in private chats, groups, and supergroups.\n\n- Bots can delete incoming messages in private chats.\n\n- Bots granted can_post_messages permissions can delete outgoing messages in channels.\n\n- If the bot is an administrator of a group, it can delete any message there.\n\n- If the bot has can_delete_messages administrator right in a supergroup or a channel, it can delete any message there.\n\n- If the bot has can_manage_direct_messages administrator right in a channel, it can delete any message in the corresponding direct messages chat.\n\nReturns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Identifier of the message to delete",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the message to delete",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteMessageResponse",
    },
  },
  {
    id: "deleteMessages",
    command: "delete-messages",
    binding: {
      kind: "rpc",
      name: "deleteMessages",
    },
    effect: "destructive",
    summary:
      "Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns True on success.",
    description:
      "Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_ids",
        in: "body",
        required: true,
        description:
          "A JSON-serialized list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted.",
        schema: {
          type: "array",
          items: {
            type: "integer",
          },
          description:
            "A JSON-serialized list of 1-100 identifiers of messages to delete. See deleteMessage for limitations on which messages can be deleted.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteMessagesRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteMessagesResponse",
    },
  },
  {
    id: "deleteEphemeralMessage",
    command: "delete-ephemeral-message",
    binding: {
      kind: "rpc",
      name: "deleteEphemeralMessage",
    },
    effect: "destructive",
    summary:
      "Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns True on success.",
    description:
      "Use this method to delete an ephemeral message. Note that it is not guaranteed that the user will receive the message deletion event, especially if they are offline. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "receiver_user_id",
        in: "body",
        required: true,
        description: "Identifier of the user who received the message",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the user who received the message",
        },
      },
      {
        name: "ephemeral_message_id",
        in: "body",
        required: true,
        description: "Identifier of the ephemeral message to delete",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the ephemeral message to delete",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteEphemeralMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteEphemeralMessageResponse",
    },
  },
  {
    id: "deleteMessageReaction",
    command: "delete-message-reaction",
    binding: {
      kind: "rpc",
      name: "deleteMessageReaction",
    },
    effect: "destructive",
    summary:
      "Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.",
    description:
      "Use this method to remove a reaction from a message in a group or a supergroup chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "message_id",
        in: "body",
        required: true,
        description: "Identifier of the target message",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the target message",
        },
      },
      {
        name: "user_id",
        in: "body",
        required: false,
        description: "Identifier of the user whose reaction will be removed, if the reaction was added by a user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the user whose reaction will be removed, if the reaction was added by a user",
        },
      },
      {
        name: "actor_chat_id",
        in: "body",
        required: false,
        description: "Identifier of the chat whose reaction will be removed, if the reaction was added by a chat",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the chat whose reaction will be removed, if the reaction was added by a chat",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteMessageReactionRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteMessageReactionResponse",
    },
  },
  {
    id: "deleteAllMessageReactions",
    command: "delete-all-message-reactions",
    binding: {
      kind: "rpc",
      name: "deleteAllMessageReactions",
    },
    effect: "destructive",
    summary:
      "Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user or chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.",
    description:
      "Use this method to remove up to 10000 recent reactions in a group or a supergroup chat added by a given user or chat. The bot must have the 'can_delete_messages' administrator right in the chat. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target supergroup in the format @username",
        schema: {
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
      {
        name: "user_id",
        in: "body",
        required: false,
        description: "Identifier of the user whose reactions will be removed, if the reactions were added by a user",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the user whose reactions will be removed, if the reactions were added by a user",
        },
      },
      {
        name: "actor_chat_id",
        in: "body",
        required: false,
        description: "Identifier of the chat whose reactions will be removed, if the reactions were added by a chat",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the chat whose reactions will be removed, if the reactions were added by a chat",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteAllMessageReactionsRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteAllMessageReactionsResponse",
    },
  },
  {
    id: "sendSticker",
    command: "send-sticker",
    binding: {
      kind: "rpc",
      name: "sendSticker",
    },
    effect: "write",
    summary:
      "Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.",
    description:
      "Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "sticker",
        in: "body",
        required: true,
        description:
          "Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Video and animated stickers can't be sent via an HTTP URL.",
        schema: {
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
      },
      {
        name: "emoji",
        in: "body",
        required: false,
        description: "Emoji associated with the sticker; only for just uploaded stickers",
        schema: {
          type: "string",
          description: "Emoji associated with the sticker; only for just uploaded stickers",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendStickerRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "getStickerSet",
    command: "get-sticker-set",
    binding: {
      kind: "rpc",
      name: "getStickerSet",
    },
    effect: "read",
    summary: "Use this method to get a sticker set. On success, a StickerSet object is returned.",
    description: "Use this method to get a sticker set. On success, a StickerSet object is returned.",
    tags: [],
    parameters: [
      {
        name: "name",
        in: "body",
        required: true,
        description: "Name of the sticker set",
        schema: {
          type: "string",
          description: "Name of the sticker set",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetStickerSetRequest",
    },
    response: {
      confidence: "contract",
      schema: "StickerSet",
    },
  },
  {
    id: "getCustomEmojiStickers",
    command: "get-custom-emoji-stickers",
    binding: {
      kind: "rpc",
      name: "getCustomEmojiStickers",
    },
    effect: "read",
    summary:
      "Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.",
    description:
      "Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of Sticker objects.",
    tags: [],
    parameters: [
      {
        name: "custom_emoji_ids",
        in: "body",
        required: true,
        description:
          "A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.",
        schema: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetCustomEmojiStickersRequest",
    },
    response: {
      confidence: "contract",
      schema: "GetCustomEmojiStickersResponse",
    },
  },
  {
    id: "uploadStickerFile",
    command: "upload-sticker-file",
    binding: {
      kind: "rpc",
      name: "uploadStickerFile",
    },
    effect: "write",
    summary:
      "Use this method to upload a file with a sticker for later use in the createNewStickerSet, addStickerToSet, or replaceStickerInSet methods (the file can be used multiple times). Returns the uploaded File on success.",
    description:
      "Use this method to upload a file with a sticker for later use in the createNewStickerSet, addStickerToSet, or replaceStickerInSet methods (the file can be used multiple times). Returns the uploaded File on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier of sticker file owner",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier of sticker file owner",
        },
      },
      {
        name: "sticker",
        in: "body",
        required: true,
        description:
          "A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See https://core.telegram.org/stickers for technical requirements. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        schema: {
          type: "string",
          format: "binary",
          description:
            "A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See https://core.telegram.org/stickers for technical requirements. More information on Sending Files: https://core.telegram.org/bots/api#sending-files",
        },
      },
      {
        name: "sticker_format",
        in: "body",
        required: true,
        description: 'Format of the sticker, must be one of "static", "animated", "video"',
        schema: {
          type: "string",
          description: 'Format of the sticker, must be one of "static", "animated", "video"',
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "UploadStickerFileRequest",
    },
    response: {
      confidence: "contract",
      schema: "File",
    },
  },
  {
    id: "createNewStickerSet",
    command: "create-new-sticker-set",
    binding: {
      kind: "rpc",
      name: "createNewStickerSet",
    },
    effect: "write",
    summary:
      "Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns True on success.",
    description:
      "Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier of created sticker set owner",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier of created sticker set owner",
        },
      },
      {
        name: "name",
        in: "body",
        required: true,
        description:
          'Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can\'t contain consecutive underscores and must end in "_by_<bot_username>". <bot_username> is case insensitive. 1-64 characters.',
        schema: {
          type: "string",
          description:
            'Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only English letters, digits and underscores. Must begin with a letter, can\'t contain consecutive underscores and must end in "_by_<bot_username>". <bot_username> is case insensitive. 1-64 characters.',
        },
      },
      {
        name: "title",
        in: "body",
        required: true,
        description: "Sticker set title, 1-64 characters",
        schema: {
          type: "string",
          description: "Sticker set title, 1-64 characters",
        },
      },
      {
        name: "stickers",
        in: "body",
        required: true,
        description: "A JSON-serialized list of 1-50 initial stickers to be added to the sticker set",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "InputSticker",
          },
          description: "A JSON-serialized list of 1-50 initial stickers to be added to the sticker set",
        },
      },
      {
        name: "sticker_type",
        in: "body",
        required: false,
        description:
          'Type of stickers in the set, pass "regular", "mask", or "custom_emoji". By default, a regular sticker set is created.',
        schema: {
          type: "string",
          description:
            'Type of stickers in the set, pass "regular", "mask", or "custom_emoji". By default, a regular sticker set is created.',
        },
      },
      {
        name: "needs_repainting",
        in: "body",
        required: false,
        description:
          "Pass True if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only",
        schema: {
          type: "boolean",
          description:
            "Pass True if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "CreateNewStickerSetRequest",
    },
    response: {
      confidence: "contract",
      schema: "CreateNewStickerSetResponse",
    },
  },
  {
    id: "addStickerToSet",
    command: "add-sticker-to-set",
    binding: {
      kind: "rpc",
      name: "addStickerToSet",
    },
    effect: "write",
    summary:
      "Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns True on success.",
    description:
      "Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier of sticker set owner",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier of sticker set owner",
        },
      },
      {
        name: "name",
        in: "body",
        required: true,
        description: "Sticker set name",
        schema: {
          type: "string",
          description: "Sticker set name",
        },
      },
      {
        name: "sticker",
        in: "body",
        required: true,
        description:
          "A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed.",
        schema: {
          type: "ref",
          ref: "InputSticker",
          description:
            "A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "AddStickerToSetRequest",
    },
    response: {
      confidence: "contract",
      schema: "AddStickerToSetResponse",
    },
  },
  {
    id: "setStickerPositionInSet",
    command: "set-sticker-position-in-set",
    binding: {
      kind: "rpc",
      name: "setStickerPositionInSet",
    },
    effect: "write",
    summary:
      "Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success.",
    description:
      "Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "sticker",
        in: "body",
        required: true,
        description: "File identifier of the sticker",
        schema: {
          type: "string",
          description: "File identifier of the sticker",
        },
      },
      {
        name: "position",
        in: "body",
        required: true,
        description: "New sticker position in the set, zero-based",
        schema: {
          type: "integer",
          description: "New sticker position in the set, zero-based",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetStickerPositionInSetRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetStickerPositionInSetResponse",
    },
  },
  {
    id: "deleteStickerFromSet",
    command: "delete-sticker-from-set",
    binding: {
      kind: "rpc",
      name: "deleteStickerFromSet",
    },
    effect: "destructive",
    summary: "Use this method to delete a sticker from a set created by the bot. Returns True on success.",
    description: "Use this method to delete a sticker from a set created by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "sticker",
        in: "body",
        required: true,
        description: "File identifier of the sticker",
        schema: {
          type: "string",
          description: "File identifier of the sticker",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteStickerFromSetRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteStickerFromSetResponse",
    },
  },
  {
    id: "replaceStickerInSet",
    command: "replace-sticker-in-set",
    binding: {
      kind: "rpc",
      name: "replaceStickerInSet",
    },
    effect: "write",
    summary:
      "Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling deleteStickerFromSet, then addStickerToSet, then setStickerPositionInSet. Returns True on success.",
    description:
      "Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling deleteStickerFromSet, then addStickerToSet, then setStickerPositionInSet. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier of the sticker set owner",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier of the sticker set owner",
        },
      },
      {
        name: "name",
        in: "body",
        required: true,
        description: "Sticker set name",
        schema: {
          type: "string",
          description: "Sticker set name",
        },
      },
      {
        name: "old_sticker",
        in: "body",
        required: true,
        description: "File identifier of the replaced sticker",
        schema: {
          type: "string",
          description: "File identifier of the replaced sticker",
        },
      },
      {
        name: "sticker",
        in: "body",
        required: true,
        description:
          "A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.",
        schema: {
          type: "ref",
          ref: "InputSticker",
          description:
            "A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "ReplaceStickerInSetRequest",
    },
    response: {
      confidence: "contract",
      schema: "ReplaceStickerInSetResponse",
    },
  },
  {
    id: "setStickerEmojiList",
    command: "set-sticker-emoji-list",
    binding: {
      kind: "rpc",
      name: "setStickerEmojiList",
    },
    effect: "write",
    summary:
      "Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.",
    description:
      "Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "sticker",
        in: "body",
        required: true,
        description: "File identifier of the sticker",
        schema: {
          type: "string",
          description: "File identifier of the sticker",
        },
      },
      {
        name: "emoji_list",
        in: "body",
        required: true,
        description: "A JSON-serialized list of 1-20 emoji associated with the sticker",
        schema: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A JSON-serialized list of 1-20 emoji associated with the sticker",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetStickerEmojiListRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetStickerEmojiListResponse",
    },
  },
  {
    id: "setStickerKeywords",
    command: "set-sticker-keywords",
    binding: {
      kind: "rpc",
      name: "setStickerKeywords",
    },
    effect: "write",
    summary:
      "Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.",
    description:
      "Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "sticker",
        in: "body",
        required: true,
        description: "File identifier of the sticker",
        schema: {
          type: "string",
          description: "File identifier of the sticker",
        },
      },
      {
        name: "keywords",
        in: "body",
        required: false,
        description:
          "A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters",
        schema: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetStickerKeywordsRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetStickerKeywordsResponse",
    },
  },
  {
    id: "setStickerMaskPosition",
    command: "set-sticker-mask-position",
    binding: {
      kind: "rpc",
      name: "setStickerMaskPosition",
    },
    effect: "write",
    summary:
      "Use this method to change the mask position of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns True on success.",
    description:
      "Use this method to change the mask position of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "sticker",
        in: "body",
        required: true,
        description: "File identifier of the sticker",
        schema: {
          type: "string",
          description: "File identifier of the sticker",
        },
      },
      {
        name: "mask_position",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position.",
        schema: {
          type: "ref",
          ref: "MaskPosition",
          description:
            "A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetStickerMaskPositionRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetStickerMaskPositionResponse",
    },
  },
  {
    id: "setStickerSetTitle",
    command: "set-sticker-set-title",
    binding: {
      kind: "rpc",
      name: "setStickerSetTitle",
    },
    effect: "write",
    summary: "Use this method to set the title of a created sticker set. Returns True on success.",
    description: "Use this method to set the title of a created sticker set. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "name",
        in: "body",
        required: true,
        description: "Sticker set name",
        schema: {
          type: "string",
          description: "Sticker set name",
        },
      },
      {
        name: "title",
        in: "body",
        required: true,
        description: "Sticker set title, 1-64 characters",
        schema: {
          type: "string",
          description: "Sticker set title, 1-64 characters",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetStickerSetTitleRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetStickerSetTitleResponse",
    },
  },
  {
    id: "setStickerSetThumbnail",
    command: "set-sticker-set-thumbnail",
    binding: {
      kind: "rpc",
      name: "setStickerSetThumbnail",
    },
    effect: "write",
    summary:
      "Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns True on success.",
    description:
      "Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "name",
        in: "body",
        required: true,
        description: "Sticker set name",
        schema: {
          type: "string",
          description: "Sticker set name",
        },
      },
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier of the sticker set owner",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier of the sticker set owner",
        },
      },
      {
        name: "thumbnail",
        in: "body",
        required: false,
        description:
          "A .WEBP or .PNG image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a .TGS animation with a thumbnail up to 32 kilobytes in size (see https://core.telegram.org/stickers#animation-requirements for animated sticker technical requirements), or a .WEBM video with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/stickers#video-requirements for video sticker technical requirements. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files: https://core.telegram.org/bots/api#sending-files. Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail.",
        schema: {
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
      },
      {
        name: "format",
        in: "body",
        required: true,
        description:
          'Format of the thumbnail, must be one of "static" for a .WEBP or .PNG image, "animated" for a .TGS animation, or "video" for a .WEBM video',
        schema: {
          type: "string",
          description:
            'Format of the thumbnail, must be one of "static" for a .WEBP or .PNG image, "animated" for a .TGS animation, or "video" for a .WEBM video',
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetStickerSetThumbnailRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetStickerSetThumbnailResponse",
    },
  },
  {
    id: "setCustomEmojiStickerSetThumbnail",
    command: "set-custom-emoji-sticker-set-thumbnail",
    binding: {
      kind: "rpc",
      name: "setCustomEmojiStickerSetThumbnail",
    },
    effect: "write",
    summary: "Use this method to set the thumbnail of a custom emoji sticker set. Returns True on success.",
    description: "Use this method to set the thumbnail of a custom emoji sticker set. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "name",
        in: "body",
        required: true,
        description: "Sticker set name",
        schema: {
          type: "string",
          description: "Sticker set name",
        },
      },
      {
        name: "custom_emoji_id",
        in: "body",
        required: false,
        description:
          "Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail",
        schema: {
          type: "string",
          description:
            "Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetCustomEmojiStickerSetThumbnailRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetCustomEmojiStickerSetThumbnailResponse",
    },
  },
  {
    id: "deleteStickerSet",
    command: "delete-sticker-set",
    binding: {
      kind: "rpc",
      name: "deleteStickerSet",
    },
    effect: "destructive",
    summary: "Use this method to delete a sticker set that was created by the bot. Returns True on success.",
    description: "Use this method to delete a sticker set that was created by the bot. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "name",
        in: "body",
        required: true,
        description: "Sticker set name",
        schema: {
          type: "string",
          description: "Sticker set name",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "DeleteStickerSetRequest",
    },
    response: {
      confidence: "contract",
      schema: "DeleteStickerSetResponse",
    },
  },
  {
    id: "sendRichMessage",
    command: "send-rich-message",
    binding: {
      kind: "rpc",
      name: "sendRichMessage",
    },
    effect: "write",
    summary:
      "Use this method to send rich messages. If the message contains a block with a media element, then the bot must have the right to send the media to the chat. On success, the sent Message is returned.",
    description:
      "Use this method to send rich messages. If the message contains a block with a media element, then the bot must have the right to send the media to the chat. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the business connection on behalf of which the message will be sent. Bot can send rich messages on behalf of a business account only if the corresponding user can send rich messages.",
        schema: {
          type: "string",
          description:
            "Unique identifier of the business connection on behalf of which the message will be sent. Bot can send rich messages on behalf of a business account only if the corresponding user can send rich messages.",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "ephemeral_message_parameters",
        in: "body",
        required: false,
        description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        schema: {
          type: "ref",
          ref: "EphemeralMessageParameters",
          description: "A JSON-serialized object containing the parameters of the ephemeral message to send",
        },
      },
      {
        name: "rich_message",
        in: "body",
        required: true,
        description: "The message to be sent",
        schema: {
          type: "ref",
          ref: "InputRichMessage",
          description: "The message to be sent",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user.",
        schema: {
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
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendRichMessageRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "sendRichMessageDraft",
    command: "send-rich-message-draft",
    binding: {
      kind: "rpc",
      name: "sendRichMessageDraft",
    },
    effect: "write",
    summary:
      "Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendRichMessage with the complete message to persist it in the user's chat. Returns True on success.",
    description:
      "Use this method to stream a partial rich message to a user while the message is being generated. Note that the streamed draft is ephemeral and acts as a temporary 30-second preview - once the output is finalized, you must call sendRichMessage with the complete message to persist it in the user's chat. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description: "Unique identifier for the target private chat",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target private chat",
        },
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description: "Unique identifier for the target message thread",
        schema: {
          type: "integer",
          format: "int64",
          description: "Unique identifier for the target message thread",
        },
      },
      {
        name: "draft_id",
        in: "body",
        required: true,
        description:
          "Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation.",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier of the message draft; must be non-zero. Changes to drafts with the same identifier are animated. Otherwise, the draft is replaced without animation.",
        },
      },
      {
        name: "rich_message",
        in: "body",
        required: true,
        description:
          "The partial message to be streamed. Direct upload of new files and explicit upload of files by a URL isn't supported.",
        schema: {
          type: "ref",
          ref: "InputRichMessage",
          description:
            "The partial message to be streamed. Direct upload of new files and explicit upload of files by a URL isn't supported.",
        },
      },
      {
        name: "can_stop",
        in: "body",
        required: false,
        description:
          'Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button.',
        schema: {
          type: "boolean",
          description:
            'Pass True to show the user a button to stop further drafts. The bot will receive an Update "stopped_message_generation" if the user presses the button.',
        },
      },
      {
        name: "keep_on_stop",
        in: "body",
        required: false,
        description:
          "Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message.",
        schema: {
          type: "boolean",
          description:
            "Pass True to keep the draft in the chat when the button is pressed. The draft will still disappear after a short time or if the bot sends a message. To fully preserve the partial draft, the bot should send it as a new message.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendRichMessageDraftRequest",
    },
    response: {
      confidence: "contract",
      schema: "SendRichMessageDraftResponse",
    },
  },
  {
    id: "answerInlineQuery",
    command: "answer-inline-query",
    binding: {
      kind: "rpc",
      name: "answerInlineQuery",
    },
    effect: "write",
    summary: "Use this method to send answers to an inline query. On success, True is returned.",
    description:
      "Use this method to send answers to an inline query. On success, True is returned.\n\nNo more than 50 results per query are allowed.",
    tags: [],
    parameters: [
      {
        name: "inline_query_id",
        in: "body",
        required: true,
        description: "Unique identifier for the answered query",
        schema: {
          type: "string",
          description: "Unique identifier for the answered query",
        },
      },
      {
        name: "results",
        in: "body",
        required: true,
        description: "A JSON-serialized Array of results for the inline query",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "InlineQueryResult",
          },
          description: "A JSON-serialized Array of results for the inline query",
        },
        sensitive: true,
      },
      {
        name: "cache_time",
        in: "body",
        required: false,
        description:
          "The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.",
        schema: {
          type: "integer",
          description:
            "The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.",
        },
      },
      {
        name: "is_personal",
        in: "body",
        required: false,
        description:
          "Pass True if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query.",
        schema: {
          type: "boolean",
          description:
            "Pass True if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query.",
        },
      },
      {
        name: "next_offset",
        in: "body",
        required: false,
        description:
          "Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes.",
        schema: {
          type: "string",
          description:
            "Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes.",
        },
      },
      {
        name: "button",
        in: "body",
        required: false,
        description: "A JSON-serialized object describing a button to be shown above inline query results",
        schema: {
          type: "ref",
          ref: "InlineQueryResultsButton",
          description: "A JSON-serialized object describing a button to be shown above inline query results",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "AnswerInlineQueryRequest",
    },
    response: {
      confidence: "contract",
      schema: "AnswerInlineQueryResponse",
    },
  },
  {
    id: "sendInvoice",
    command: "send-invoice",
    binding: {
      kind: "rpc",
      name: "sendInvoice",
    },
    effect: "write",
    summary: "Use this method to send invoices. On success, the sent Message is returned.",
    description: "Use this method to send invoices. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot, supergroup or channel in the format @username",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "direct_messages_topic_id",
        in: "body",
        required: false,
        description:
          "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat",
        },
      },
      {
        name: "title",
        in: "body",
        required: true,
        description: "Product name, 1-32 characters",
        schema: {
          type: "string",
          description: "Product name, 1-32 characters",
        },
      },
      {
        name: "description",
        in: "body",
        required: true,
        description: "Product description, 1-255 characters",
        schema: {
          type: "string",
          description: "Product description, 1-255 characters",
        },
      },
      {
        name: "payload",
        in: "body",
        required: true,
        description:
          "Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.",
        schema: {
          type: "string",
          description:
            "Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.",
        },
      },
      {
        name: "provider_token",
        in: "body",
        required: false,
        description:
          "Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.",
        schema: {
          type: "string",
          description:
            "Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.",
          sensitive: true,
        },
        sensitive: true,
      },
      {
        name: "currency",
        in: "body",
        required: true,
        description:
          'Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars.',
        schema: {
          type: "string",
          description:
            'Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars.',
        },
      },
      {
        name: "prices",
        in: "body",
        required: true,
        description:
          "Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "LabeledPrice",
          },
          description:
            "Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.",
        },
      },
      {
        name: "max_tip_amount",
        in: "body",
        required: false,
        description:
          "The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.",
        schema: {
          type: "integer",
          description:
            "The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.",
        },
      },
      {
        name: "suggested_tip_amounts",
        in: "body",
        required: false,
        description:
          "A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.",
        schema: {
          type: "array",
          items: {
            type: "integer",
          },
          description:
            "A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.",
        },
      },
      {
        name: "start_parameter",
        in: "body",
        required: false,
        description:
          "Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter.",
        schema: {
          type: "string",
          description:
            "Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter.",
        },
      },
      {
        name: "provider_data",
        in: "body",
        required: false,
        description:
          "JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.",
        schema: {
          type: "string",
          description:
            "JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.",
        },
      },
      {
        name: "photo_url",
        in: "body",
        required: false,
        description:
          "URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.",
        schema: {
          type: "string",
          description:
            "URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.",
        },
      },
      {
        name: "photo_size",
        in: "body",
        required: false,
        description: "Photo size in bytes",
        schema: {
          type: "integer",
          description: "Photo size in bytes",
        },
      },
      {
        name: "photo_width",
        in: "body",
        required: false,
        description: "Photo width",
        schema: {
          type: "integer",
          description: "Photo width",
        },
      },
      {
        name: "photo_height",
        in: "body",
        required: false,
        description: "Photo height",
        schema: {
          type: "integer",
          description: "Photo height",
        },
      },
      {
        name: "need_name",
        in: "body",
        required: false,
        description:
          "Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "need_phone_number",
        in: "body",
        required: false,
        description:
          "Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "need_email",
        in: "body",
        required: false,
        description:
          "Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "need_shipping_address",
        in: "body",
        required: false,
        description:
          "Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "send_phone_number_to_provider",
        in: "body",
        required: false,
        description:
          "Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "send_email_to_provider",
        in: "body",
        required: false,
        description:
          "Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "is_flexible",
        in: "body",
        required: false,
        description:
          "Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "suggested_post_parameters",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        schema: {
          type: "ref",
          ref: "SuggestedPostParameters",
          description:
            "A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined.",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button.",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description:
            "A JSON-serialized object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendInvoiceRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "createInvoiceLink",
    command: "create-invoice-link",
    binding: {
      kind: "rpc",
      name: "createInvoiceLink",
    },
    effect: "write",
    summary: "Use this method to create a link for an invoice. Returns the created invoice link as String on success.",
    description:
      "Use this method to create a link for an invoice. Returns the created invoice link as String on success.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description:
          "Unique identifier of the business connection on behalf of which the link will be created. For payments in Telegram Stars only.",
        schema: {
          type: "string",
          description:
            "Unique identifier of the business connection on behalf of which the link will be created. For payments in Telegram Stars only.",
        },
      },
      {
        name: "title",
        in: "body",
        required: true,
        description: "Product name, 1-32 characters",
        schema: {
          type: "string",
          description: "Product name, 1-32 characters",
        },
      },
      {
        name: "description",
        in: "body",
        required: true,
        description: "Product description, 1-255 characters",
        schema: {
          type: "string",
          description: "Product description, 1-255 characters",
        },
      },
      {
        name: "payload",
        in: "body",
        required: true,
        description:
          "Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.",
        schema: {
          type: "string",
          description:
            "Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.",
        },
      },
      {
        name: "provider_token",
        in: "body",
        required: false,
        description:
          "Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.",
        schema: {
          type: "string",
          description:
            "Payment provider token, obtained via @BotFather. Pass an empty string for payments in Telegram Stars.",
          sensitive: true,
        },
        sensitive: true,
      },
      {
        name: "currency",
        in: "body",
        required: true,
        description:
          'Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars.',
        schema: {
          type: "string",
          description:
            'Three-letter ISO 4217 currency code, see more on currencies. Pass "XTR" for payments in Telegram Stars.',
        },
      },
      {
        name: "prices",
        in: "body",
        required: true,
        description:
          "Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "LabeledPrice",
          },
          description:
            "Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in Telegram Stars.",
        },
      },
      {
        name: "subscription_period",
        in: "body",
        required: false,
        description:
          'The number of seconds the subscription will be active for before the next payment. The currency must be set to "XTR" (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars.',
        schema: {
          type: "integer",
          description:
            'The number of seconds the subscription will be active for before the next payment. The currency must be set to "XTR" (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars.',
        },
      },
      {
        name: "max_tip_amount",
        in: "body",
        required: false,
        description:
          "The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.",
        schema: {
          type: "integer",
          description:
            "The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in Telegram Stars.",
        },
      },
      {
        name: "suggested_tip_amounts",
        in: "body",
        required: false,
        description:
          "A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.",
        schema: {
          type: "array",
          items: {
            type: "integer",
          },
          description:
            "A JSON-serialized Array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount.",
        },
      },
      {
        name: "provider_data",
        in: "body",
        required: false,
        description:
          "JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.",
        schema: {
          type: "string",
          description:
            "JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.",
        },
      },
      {
        name: "photo_url",
        in: "body",
        required: false,
        description:
          "URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.",
        schema: {
          type: "string",
          description:
            "URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service.",
        },
      },
      {
        name: "photo_size",
        in: "body",
        required: false,
        description: "Photo size in bytes",
        schema: {
          type: "integer",
          description: "Photo size in bytes",
        },
      },
      {
        name: "photo_width",
        in: "body",
        required: false,
        description: "Photo width",
        schema: {
          type: "integer",
          description: "Photo width",
        },
      },
      {
        name: "photo_height",
        in: "body",
        required: false,
        description: "Photo height",
        schema: {
          type: "integer",
          description: "Photo height",
        },
      },
      {
        name: "need_name",
        in: "body",
        required: false,
        description:
          "Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if you require the user's full name to complete the order. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "need_phone_number",
        in: "body",
        required: false,
        description:
          "Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if you require the user's phone number to complete the order. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "need_email",
        in: "body",
        required: false,
        description:
          "Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if you require the user's email address to complete the order. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "need_shipping_address",
        in: "body",
        required: false,
        description:
          "Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if you require the user's shipping address to complete the order. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "send_phone_number_to_provider",
        in: "body",
        required: false,
        description:
          "Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the user's phone number should be sent to the provider. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "send_email_to_provider",
        in: "body",
        required: false,
        description:
          "Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the user's email address should be sent to the provider. Ignored for payments in Telegram Stars.",
        },
      },
      {
        name: "is_flexible",
        in: "body",
        required: false,
        description:
          "Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the final price depends on the shipping method. Ignored for payments in Telegram Stars.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "CreateInvoiceLinkRequest",
    },
    response: {
      confidence: "contract",
      schema: "CreateInvoiceLinkResponse",
    },
  },
  {
    id: "answerShippingQuery",
    command: "answer-shipping-query",
    binding: {
      kind: "rpc",
      name: "answerShippingQuery",
    },
    effect: "write",
    summary:
      "If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.",
    description:
      "If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an Update with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned.",
    tags: [],
    parameters: [
      {
        name: "shipping_query_id",
        in: "body",
        required: true,
        description: "Unique identifier for the query to be answered",
        schema: {
          type: "string",
          description: "Unique identifier for the query to be answered",
        },
      },
      {
        name: "ok",
        in: "body",
        required: true,
        description:
          "Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)",
        schema: {
          type: "boolean",
          description:
            "Pass True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible)",
        },
      },
      {
        name: "shipping_options",
        in: "body",
        required: false,
        description: "Required if ok is True. A JSON-serialized Array of available shipping options.",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "ShippingOption",
          },
          description: "Required if ok is True. A JSON-serialized Array of available shipping options.",
        },
      },
      {
        name: "error_message",
        in: "body",
        required: false,
        description:
          'Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable"). Telegram will display this message to the user.',
        schema: {
          type: "string",
          description:
            'Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable"). Telegram will display this message to the user.',
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "AnswerShippingQueryRequest",
    },
    response: {
      confidence: "contract",
      schema: "AnswerShippingQueryResponse",
    },
  },
  {
    id: "answerPreCheckoutQuery",
    command: "answer-pre-checkout-query",
    binding: {
      kind: "rpc",
      name: "answerPreCheckoutQuery",
    },
    effect: "destructive",
    summary:
      "Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.",
    description:
      "Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an Update with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.",
    tags: [],
    parameters: [
      {
        name: "pre_checkout_query_id",
        in: "body",
        required: true,
        description: "Unique identifier for the query to be answered",
        schema: {
          type: "string",
          description: "Unique identifier for the query to be answered",
        },
      },
      {
        name: "ok",
        in: "body",
        required: true,
        description:
          "Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.",
        schema: {
          type: "boolean",
          description:
            "Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems.",
        },
      },
      {
        name: "error_message",
        in: "body",
        required: false,
        description:
          'Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user.',
        schema: {
          type: "string",
          description:
            'Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user.',
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "AnswerPreCheckoutQueryRequest",
    },
    response: {
      confidence: "contract",
      schema: "AnswerPreCheckoutQueryResponse",
    },
  },
  {
    id: "getMyStarBalance",
    command: "get-my-star-balance",
    binding: {
      kind: "rpc",
      name: "getMyStarBalance",
    },
    effect: "read",
    summary:
      "A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a StarAmount object.",
    description:
      "A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a StarAmount object.",
    tags: [],
    parameters: [],
    response: {
      confidence: "contract",
      schema: "StarAmount",
    },
  },
  {
    id: "getStarTransactions",
    command: "get-star-transactions",
    binding: {
      kind: "rpc",
      name: "getStarTransactions",
    },
    effect: "read",
    summary:
      "Returns the bot's Telegram Star transactions in chronological order. On success, returns a StarTransactions object.",
    description:
      "Returns the bot's Telegram Star transactions in chronological order. On success, returns a StarTransactions object.",
    tags: [],
    parameters: [
      {
        name: "offset",
        in: "body",
        required: false,
        description: "Number of transactions to skip in the response",
        schema: {
          type: "integer",
          description: "Number of transactions to skip in the response",
        },
      },
      {
        name: "limit",
        in: "body",
        required: false,
        description:
          "The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
        schema: {
          type: "integer",
          description:
            "The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100.",
        },
      },
    ],
    request: {
      required: false,
      confidence: "contract",
      schema: "GetStarTransactionsRequest",
    },
    response: {
      confidence: "contract",
      schema: "StarTransactions",
    },
  },
  {
    id: "refundStarPayment",
    command: "refund-star-payment",
    binding: {
      kind: "rpc",
      name: "refundStarPayment",
    },
    effect: "destructive",
    summary: "Refunds a successful payment in Telegram Stars. Returns True on success.",
    description: "Refunds a successful payment in Telegram Stars. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Identifier of the user whose payment will be refunded",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the user whose payment will be refunded",
        },
      },
      {
        name: "telegram_payment_charge_id",
        in: "body",
        required: true,
        description: "Telegram payment identifier",
        schema: {
          type: "string",
          description: "Telegram payment identifier",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "RefundStarPaymentRequest",
    },
    response: {
      confidence: "contract",
      schema: "RefundStarPaymentResponse",
    },
  },
  {
    id: "editUserStarSubscription",
    command: "edit-user-star-subscription",
    binding: {
      kind: "rpc",
      name: "editUserStarSubscription",
    },
    effect: "destructive",
    summary:
      "Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns True on success.",
    description:
      "Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns True on success.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Identifier of the user whose subscription will be edited",
        schema: {
          type: "integer",
          format: "int64",
          description: "Identifier of the user whose subscription will be edited",
        },
      },
      {
        name: "telegram_payment_charge_id",
        in: "body",
        required: true,
        description: "Telegram payment identifier for the subscription",
        schema: {
          type: "string",
          description: "Telegram payment identifier for the subscription",
        },
      },
      {
        name: "is_canceled",
        in: "body",
        required: true,
        description:
          "Pass True to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass False to allow the user to re-enable a subscription that was previously canceled by the bot.",
        schema: {
          type: "boolean",
          description:
            "Pass True to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass False to allow the user to re-enable a subscription that was previously canceled by the bot.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "EditUserStarSubscriptionRequest",
    },
    response: {
      confidence: "contract",
      schema: "EditUserStarSubscriptionResponse",
    },
  },
  {
    id: "setPassportDataErrors",
    command: "set-passport-data-errors",
    binding: {
      kind: "rpc",
      name: "setPassportDataErrors",
    },
    effect: "write",
    summary:
      "Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success.",
    description:
      "Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success.\n\nUse this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier",
        },
      },
      {
        name: "errors",
        in: "body",
        required: true,
        description: "A JSON-serialized Array describing the errors",
        schema: {
          type: "array",
          items: {
            type: "ref",
            ref: "PassportElementError",
          },
          description: "A JSON-serialized Array describing the errors",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetPassportDataErrorsRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetPassportDataErrorsResponse",
    },
  },
  {
    id: "sendGame",
    command: "send-game",
    binding: {
      kind: "rpc",
      name: "sendGame",
    },
    effect: "write",
    summary: "Use this method to send a game. On success, the sent Message is returned.",
    description: "Use this method to send a game. On success, the sent Message is returned.",
    tags: [],
    parameters: [
      {
        name: "business_connection_id",
        in: "body",
        required: false,
        description: "Unique identifier of the business connection on behalf of which the message will be sent",
        schema: {
          type: "string",
          description: "Unique identifier of the business connection on behalf of which the message will be sent",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: true,
        description:
          "Unique identifier for the target chat or username of the target bot in the format @username. Games can't be sent to channel direct messages chats and channel chats.",
        schema: {
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
      },
      {
        name: "message_thread_id",
        in: "body",
        required: false,
        description:
          "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        schema: {
          type: "integer",
          format: "int64",
          description:
            "Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only",
        },
      },
      {
        name: "game_short_name",
        in: "body",
        required: true,
        description:
          "Short name of the game, serves as the unique identifier for the game. Set up your games via @BotFather.",
        schema: {
          type: "string",
          description:
            "Short name of the game, serves as the unique identifier for the game. Set up your games via @BotFather.",
        },
      },
      {
        name: "disable_notification",
        in: "body",
        required: false,
        description: "Sends the message silently. Users will receive a notification with no sound.",
        schema: {
          type: "boolean",
          description: "Sends the message silently. Users will receive a notification with no sound.",
        },
      },
      {
        name: "protect_content",
        in: "body",
        required: false,
        description: "Protects the contents of the sent message from forwarding and saving",
        schema: {
          type: "boolean",
          description: "Protects the contents of the sent message from forwarding and saving",
        },
      },
      {
        name: "allow_paid_broadcast",
        in: "body",
        required: false,
        description:
          "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        schema: {
          type: "boolean",
          description:
            "Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance.",
        },
      },
      {
        name: "message_effect_id",
        in: "body",
        required: false,
        description: "Unique identifier of the message effect to be added to the message; for private chats only",
        schema: {
          type: "string",
          description: "Unique identifier of the message effect to be added to the message; for private chats only",
        },
      },
      {
        name: "reply_parameters",
        in: "body",
        required: false,
        description: "Description of the message to reply to",
        schema: {
          type: "ref",
          ref: "ReplyParameters",
          description: "Description of the message to reply to",
        },
      },
      {
        name: "reply_markup",
        in: "body",
        required: false,
        description:
          "A JSON-serialized object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game.",
        schema: {
          type: "ref",
          ref: "InlineKeyboardMarkup",
          description:
            "A JSON-serialized object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SendGameRequest",
    },
    response: {
      confidence: "contract",
      schema: "Message",
    },
  },
  {
    id: "setGameScore",
    command: "set-game-score",
    binding: {
      kind: "rpc",
      name: "setGameScore",
    },
    effect: "write",
    summary:
      "Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.",
    description:
      "Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the Message is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user's current score in the chat and force is False.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "User identifier",
        schema: {
          type: "integer",
          format: "int64",
          description: "User identifier",
        },
      },
      {
        name: "score",
        in: "body",
        required: true,
        description: "New score, must be non-negative",
        schema: {
          type: "integer",
          description: "New score, must be non-negative",
        },
      },
      {
        name: "force",
        in: "body",
        required: false,
        description:
          "Pass True if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters.",
        schema: {
          type: "boolean",
          description:
            "Pass True if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters.",
        },
      },
      {
        name: "disable_edit_message",
        in: "body",
        required: false,
        description:
          "Pass True if the game message should not be automatically edited to include the current scoreboard",
        schema: {
          type: "boolean",
          description:
            "Pass True if the game message should not be automatically edited to include the current scoreboard",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: false,
        description: "Required if inline_message_id is not specified. Unique identifier for the target chat.",
        schema: {
          type: "integer",
          format: "int64",
          description: "Required if inline_message_id is not specified. Unique identifier for the target chat.",
        },
      },
      {
        name: "message_id",
        in: "body",
        required: false,
        description: "Required if inline_message_id is not specified. Identifier of the sent message.",
        schema: {
          type: "integer",
          format: "int64",
          description: "Required if inline_message_id is not specified. Identifier of the sent message.",
        },
      },
      {
        name: "inline_message_id",
        in: "body",
        required: false,
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        schema: {
          type: "string",
          description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "SetGameScoreRequest",
    },
    response: {
      confidence: "contract",
      schema: "SetGameScoreResponse",
    },
  },
  {
    id: "getGameHighScores",
    command: "get-game-high-scores",
    binding: {
      kind: "rpc",
      name: "getGameHighScores",
    },
    effect: "read",
    summary:
      "Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of GameHighScore objects.",
    description:
      "Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of GameHighScore objects.",
    tags: [],
    parameters: [
      {
        name: "user_id",
        in: "body",
        required: true,
        description: "Target user id",
        schema: {
          type: "integer",
          format: "int64",
          description: "Target user id",
        },
      },
      {
        name: "chat_id",
        in: "body",
        required: false,
        description: "Required if inline_message_id is not specified. Unique identifier for the target chat.",
        schema: {
          type: "integer",
          format: "int64",
          description: "Required if inline_message_id is not specified. Unique identifier for the target chat.",
        },
      },
      {
        name: "message_id",
        in: "body",
        required: false,
        description: "Required if inline_message_id is not specified. Identifier of the sent message.",
        schema: {
          type: "integer",
          format: "int64",
          description: "Required if inline_message_id is not specified. Identifier of the sent message.",
        },
      },
      {
        name: "inline_message_id",
        in: "body",
        required: false,
        description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        schema: {
          type: "string",
          description: "Required if chat_id and message_id are not specified. Identifier of the inline message.",
        },
      },
    ],
    request: {
      required: true,
      confidence: "contract",
      schema: "GetGameHighScoresRequest",
    },
    response: {
      confidence: "contract",
      schema: "GetGameHighScoresResponse",
    },
  },
]
