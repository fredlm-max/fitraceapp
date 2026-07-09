// Web Push — souscription côté client + enregistrement dans Supabase.
// La clé VAPID publique est publique par conception (elle identifie le serveur push).
import { supabase } from "./supabaseClient";

const VAPID_PUBLIC_KEY = "BG1SSrLoIy3Q2S6OeI8rEYFNGc50XL5C8KrRwf8Ro7svim452YamGodVpZ2DRXH1ySWHlHNCpW4eZH-DEEOE6Yg";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

// L'utilisateur a-t-il déjà accordé/refusé/pas encore décidé ?
export function pushPermission() {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission; // "default" | "granted" | "denied"
}

export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    typeof Notification !== "undefined"
  );
}

// Demande la permission, souscrit, et enregistre la souscription dans Supabase.
// Retourne true si activé avec succès.
export async function enablePushNotifications(email) {
  if (!pushSupported()) throw new Error("Notifications non supportées sur cet appareil");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Permission refusée");

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  // Enregistre la souscription (une par appareil) côté serveur via RPC.
  const { error } = await supabase.rpc("save_push_subscription", {
    p_email: (email || "").toLowerCase().trim(),
    p_subscription: sub.toJSON(),
  });
  if (error) throw error;
  try { localStorage.setItem("apex_push_enabled", "1"); } catch {}
  return true;
}

// Désactive : supprime la souscription locale + côté serveur.
export async function disablePushNotifications(email) {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await supabase.rpc("delete_push_subscription", {
        p_email: (email || "").toLowerCase().trim(),
        p_endpoint: sub.endpoint,
      });
      await sub.unsubscribe();
    }
  } catch {}
  try { localStorage.removeItem("apex_push_enabled"); } catch {}
}

export function pushEnabledLocally() {
  try { return localStorage.getItem("apex_push_enabled") === "1"; } catch { return false; }
}
