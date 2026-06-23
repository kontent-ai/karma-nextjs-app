const configured = process.env.NEXT_PUBLIC_KONTENT_URL;

export const kontentHost = configured && configured.length > 0 ? configured : "kontent.ai";
