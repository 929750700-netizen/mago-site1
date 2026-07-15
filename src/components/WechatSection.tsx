"use client";

import Image from "next/image";
import { Check, Copy, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { SiteCopy, WechatContact } from "@/types/content";

export function WechatSection({ contact, copy }: { contact: WechatContact; copy: SiteCopy["home"] }) {
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    await navigator.clipboard.writeText(contact.wechatId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (!contact.visible) return null;

  return (
    <section id="wechat" className="wechat-section">
      <div className="wechat-section__image" aria-hidden="true">
        <Image src="/media/optimized/sunset-cups.webp" alt="" fill sizes="50vw" />
      </div>
      <div className="wechat-section__content">
        <span className="eyebrow">{copy.contactEyebrow}</span>
        <h2>{copy.contactTitleLine1}<br />{copy.contactTitleLine2}</h2>
        <p>{copy.contactDescription || contact.description}</p>
        <div className="wechat-card">
          <div className="wechat-card__qr">
            <Image src={contact.qrCode} alt={`${contact.name}二维码`} fill sizes="220px" />
          </div>
          <div className="wechat-card__copy">
            <MessageCircle size={22} />
            <span>{contact.name}</span>
            <strong>{contact.wechatId}</strong>
            <small>{copy.qrHint}</small>
            <button type="button" onClick={copyId} className="button button--dark">
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? copy.copiedWechatButton : copy.copyWechatButton}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
