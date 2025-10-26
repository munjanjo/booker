import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text || res.statusText };
  }
}

function withTimeout(promise, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(
      () => reject(new Error("Zahtjev je istekao (timeout).")),
      timeoutMs
    );
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

export async function apiFetch(
  path,
  { method = "GET", body, headers, auth = false, timeoutMs = 15000 } = {}
) {
  if (!API_BASE) {
    throw new Error("VITE_API_BASE_URL nije postavljen.");
  }

  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
  };

  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }

  if (auth) {
    const user = getAuth().currentUser;
    if (!user) {
      const err = new Error("Niste prijavljeni.");
      err.status = 401;
      throw err;
    }
    const token = await user.getIdToken(false);
    opts.headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE}${path}`;

  let res;
  try {
    res = await withTimeout(fetch(url, opts), timeoutMs);
  } catch (networkErr) {
    const err = new Error(networkErr.message || "Mrežna greška.");
    err.cause = networkErr;
    throw err;
  }

  if (res.status === 204) return null;

  const data = await parseResponse(res);

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.details = data;
    throw err;
  }

  return data;
}
