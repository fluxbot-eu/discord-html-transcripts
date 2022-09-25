import { DiscordAttachment, DiscordAttachments } from "@derockdev/discord-components-react";
import { Attachment, Message } from "discord.js";
import { RenderMessageContext } from "..";
import React from 'react';
import { downloadImageToDataURL, formatBytes } from "../../utils/utils";

export default async function renderAttachments(message: Message, context: RenderMessageContext) {
  if(message.attachments.size === 0) return null;

  return (
    <DiscordAttachments slot="attachments">
      {
        await Promise.all(
          message.attachments.map(async (attachment) => (
            await renderAttachment(attachment, message, context)
          ))
        )
      }
    </DiscordAttachments>
  )
}

// "audio" | "video" | "image" | "file"
function getAttachmentType(attachment: Attachment): "audio" | "video" | "image" | "file" {
  var type = attachment.contentType?.split("/")?.[0] ?? "unknown";
  if(["audio", "video", "image"].includes(type)) return type as any;
  return "file";
}

export async function renderAttachment(attachment: Attachment, message: Message, context: RenderMessageContext) {
  let url = attachment.url;
  const name = attachment.name;
  const width = attachment.width;
  const height = attachment.height;

  const type = getAttachmentType(attachment);

  if(context.saveImages) {
    const downloaded = await downloadImageToDataURL(url);
    if(downloaded) {
      url = downloaded;
    }
  }

  return (
    <DiscordAttachment
      type={type}
      size={formatBytes(attachment.size)}
      key={attachment.id}
      slot="attachment"
      url={url}
      alt={name ?? undefined}
      width={width ?? undefined}
      height={height ?? undefined}
    />
  )
}