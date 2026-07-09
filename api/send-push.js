import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

// Envoi des notifications push quotidiennes.
// Déclenché par le Cron Vercel (voir vercel.json) ou manuellement avec le bon secret.
// Variables d'environnement requises (Vercel → Settings → Environment Variables) :
//   VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT (ex: mailto:toi@exemple.com)
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE (clé service_role, JAMAIS côté client)
//   CRON_SECRET (chaîne aléatoire ; le cron l'envoie en header)

export default async function handler(req, res) {
  // Sécurité : n'autoriser que le Cron Vercel ou un appel avec le bon secret.
  const auth = req.headers["authorization"] || "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const { VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT, SUPABASE_URL, SUPABASE_SERVICE_ROLE } = process.env;
  if (!VAPID_PUBLIC || !VAPID_PRIVATE || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    return res.status(500).json({ error: "config manquante (VAPID/SUPABASE env vars)" });
  }

  webpush.setVapidDetails(VAPID_SUBJECT || "mailto:contact@apex.app", VAPID_PUBLIC, VAPID_PRIVATE);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  // Récupère toutes les souscriptions.
  const { data: subs, error } = await supabase.from("push_subscriptions").select("endpoint, subscription");
  if (error) return res.status(500).json({ error: error.message });

  // Message du jour (personnalisable). Le body accepte un titre + corps + url.
  const payload = JSON.stringify({
    title: "APEX Performance",
    body: "Ton coach t'attend 💪 Check ton Score APEX et ta séance du jour.",
    url: "/",
    tag: "apex-daily",
  });

  let sent = 0, removed = 0;
  await Promise.all((subs || []).map(async (row) => {
    try {
      await webpush.sendNotification(row.subscription, payload);
      sent++;
    } catch (e) {
      // 404/410 = souscription expirée → on la supprime.
      if (e.statusCode === 404 || e.statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
        removed++;
      }
    }
  }));

  return res.status(200).json({ ok: true, total: subs?.length || 0, sent, removed });
}
