// /lib/sensay/api.js
const BASE_URL = "https://api.sensay.io";

function assertEnv() {
  const missing = [];
  if (!process.env.SENSAY_ORG_SECRET) missing.push("SENSAY_ORG_SECRET");
  if (!process.env.SENSAY_REPLICA_UUID) missing.push("SENSAY_REPLICA_UUID");
  if (!process.env.SENSAY_MASTER_USER_ID) missing.push("SENSAY_MASTER_USER_ID");
  if (missing.length)
    throw new Error("Missing env vars: " + missing.join(", "));
}

/**
 * Fetch chat history for a replica, for a specific X-USER-ID.
 * @param {object} params { limit, cursor, start, end }
 * @param {string} [userId]
 * @returns {Promise<any>} Parsed JSON from Sensay
 */
export async function getReplicaHistory(params = {}, userId) {
  assertEnv();
  const apiVersion = process.env.SENSAY_API_VERSION || "2025-03-25";
  const replica = process.env.SENSAY_REPLICA_UUID;
  const xUserId = userId || process.env.SENSAY_MASTER_USER_ID;

  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", String(params.cursor));
  if (params.start) query.set("start", String(params.start));
  if (params.end) query.set("end", String(params.end));

  const url = `${BASE_URL}/v1/replicas/${replica}/chat/history${query.toString() ? `?${query}` : ""}`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-ORGANIZATION-SECRET": process.env.SENSAY_ORG_SECRET,
      "X-API-Version": apiVersion,
      "X-USER-ID": xUserId,
    },
  });

  const text = await resp.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) {}
  if (!resp.ok) {
    const msg = data?.error || data?.message || text || `HTTP ${resp.status}`;
    throw new Error(`[Sensay] ${resp.status} ${String(msg).slice(0, 500)}`);
  }
  return data;
}

/**
 * JSON-based completion (non-experimental), mirrors the WP plugin /chat endpoint behavior.
 * Sends only the current user content; server uses X-USER-ID history when store=true.
 * @param {string} content
 * @param {Object} options  { temperature, store, source, discord_data, metadata, model, ... }
 * @param {string} [userId]
 * @returns {Promise<string>}
 */
export async function completeReplicaJson(content, options = {}, userId) {
  assertEnv();

  const apiVersion = process.env.SENSAY_API_VERSION || "2025-03-25";
  const replica = process.env.SENSAY_REPLICA_UUID;
  const xUserId = userId || process.env.SENSAY_MASTER_USER_ID;

  const url = `${BASE_URL}/v1/replicas/${replica}/chat/completions`;
  const body = {
    content,
    ...(options || {}),
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "X-ORGANIZATION-SECRET": process.env.SENSAY_ORG_SECRET,
      "X-API-Version": apiVersion,
      "X-USER-ID": xUserId,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await resp.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) {}

  if (!resp.ok) {
    const msg = data?.error || data?.message || text || `HTTP ${resp.status}`;
    throw new Error(`[Sensay] ${resp.status} ${String(msg).slice(0, 500)}`);
  }

  // Try common reply shapes
  const reply =
    (data && (data.content || data?.response?.content)) ||
    (typeof text === 'string' ? text : "");
  return String(reply || "");
}

/**
 * Experimental completions (SSE'yi toplayıp tek metin döner)
 * @param {Array<{role:'user'|'assistant'|'system', content:string}>} messages
 * @param {Object} options  Ek alanlar: { temperature, store, source, discord_data, metadata, model, ... }
 * @param {string} [userId] X-USER-ID için (varsayılan .env'deki SENSAY_MASTER_USER_ID)
 * @returns {Promise<string>}
 */
export async function completeReplica(messages, options = {}, userId) {
  assertEnv();

  const apiVersion = process.env.SENSAY_API_VERSION || "2025-03-25";
  const replica = process.env.SENSAY_REPLICA_UUID; // örn: 03db5651-...
  const xUserId = userId || process.env.SENSAY_MASTER_USER_ID;

  // EXPERIMENTAL endpoint:
  const url = `${BASE_URL}/v1/experimental/replicas/${replica}/chat/completions`;

  // İsteğe dahil edilecek body — curl örneğindeki alanları destekler:
  const body = {
    messages,
    // opsiyonel alanlar:
    ...(options || {}),
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "X-ORGANIZATION-SECRET": process.env.SENSAY_ORG_SECRET,
      "X-API-Version": apiVersion,
      "X-USER-ID": xUserId, // ÖNEMLİ: kullanıcı/hesap kimliği
      "Content-Type": "application/json",
      Accept: "text/event-stream", // stream gelir, toplayacağız
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok || !resp.body) {
    const t = await (resp.text?.() || Promise.resolve(""));
    throw new Error(`[Sensay] ${resp.status} ${t?.slice(0, 500)}`);
  }

  // SSE'yi toplayıp tek string üret (JSON olaylarını ayrıştır)
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let out = "";
  let buffer = ""; // chunk sınırları arasında kalan satır parçalarını tut

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;

    // CRLF -> LF normalize et
    buffer = buffer.replace(/\r\n/g, "\n");

    const lines = buffer.split("\n");
    // Son satır newline ile bitmemiş olabilir; buffer'da tut
    buffer = lines.pop() ?? "";

    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;

      // Birçok SSE sağlayıcısı JSON nesnelerini yollar. Deneysel olarak ayrıştır.
      let appended = false;
      try {
        const evt = JSON.parse(data);
        // Yaygın alan adları: delta, text, content, choices[0].delta/content, data.text
        const token =
          (typeof evt.delta === 'string' && evt.delta) ||
          (typeof evt.text === 'string' && evt.text) ||
          (typeof evt.content === 'string' && evt.content) ||
          (evt?.choices?.[0]?.delta?.content ?? evt?.choices?.[0]?.delta?.text) ||
          (evt?.data?.text ?? evt?.data?.content);
        if (token) {
          out += String(token);
          appended = true;
        }
      } catch (_) {
        // JSON değilse veya ayrıştırılamadıysa olduğu gibi ekle (geriye dönük uyum)
      }

      if (!appended) {
        out += data;
      }
    }
  }
  // Döngü bitti; buffer'da işlenmemiş bir satır varsa ve data: ile başlıyorsa işle
  const tail = buffer.trim();
  if (tail.startsWith("data:")) {
    const data = tail.slice(5).trim();
    if (data && data !== "[DONE]") {
      let appended = false;
      try {
        const evt = JSON.parse(data);
        const token =
          (typeof evt.delta === 'string' && evt.delta) ||
          (typeof evt.text === 'string' && evt.text) ||
          (typeof evt.content === 'string' && evt.content) ||
          (evt?.choices?.[0]?.delta?.content ?? evt?.choices?.[0]?.delta?.text) ||
          (evt?.data?.text ?? evt?.data?.content);
        if (token) {
          out += String(token);
          appended = true;
        }
      } catch (_) {}
      if (!appended) out += data;
    }
  }
  return out;
}
