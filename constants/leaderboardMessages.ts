/**
 * Coaching messages in Eng. Ali Shaheen's motivational style (Egyptian Arabic):
 * warm and encouraging, with a firmer nudge when performance is low. Only
 * standard keyboard emojis are used. The system picks a message from the tier
 * that matches the student's performance, so this is a library, not one message.
 *
 * `{p}` is replaced with the student's percentile (Arabic-Indic digits).
 */

export type PerformanceTier = "high" | "average" | "below";

/** Convert Western digits to Arabic-Indic (e.g. 68 → ٦٨). */
const toArabicDigits = (n: number): string =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

export const LEADERBOARD_MESSAGES: Record<PerformanceTier, string[]> = {
  // Performing well — congratulate and keep the momentum.
  high: [
    "عظيم يا صديقي.. أداءك في الكورس ده أفضل من {p}٪ من باقي الطلبة.. كمّل عايز أشوف اسمك في الليدر بورد هنا",
    "ده أنت جامد جداً! 🌟 أداءك فوق التوقعات بمراحل.. حافظ على المستوى ده وإنت في القمة 🔥",
    "برافو عليك يا نجم ✨ شغلك بيتكلم عنك.. متبطّلش، الأول على الكورس مستنيك 🏆",
    "أنا فخور بيك والله 💪 المجهود ده مش بيروح.. كمّل بنفس الروح دي 👏",
  ],
  // Middle of the pack — motivate to push further.
  average: [
    "شغلك كويس بس لسه ينفع أحسن 😊 ركّز شوية كمان وإنت هتفرق.. متوقفش دلوقتي 🚀",
    "إنت في نص الطريق ومعاك كل حاجة تكمّل.. شدّ حيلك ومتسبش نفسك 💪📚",
    "تمام يا صديقي بس عايزك تدّي تركيز زيادة 🔥 المستوى ده مش نهايتك.. يلا بينا",
    "ماشي في السكة الصح 👏 لو زوّدت مذاكرة شوية هتشوف الفرق بنفسك 🚀",
  ],
  // Below expectations — supportive but firm.
  below: [
    "بص يا صديقي.. المستوى ده مش اللي أعرفه عنك 📚 لمّ نفسك وابدأ مذاكرة بجدية من دلوقتي 💪",
    "أنا مش هجاملك.. المجهود قليل ومحتاج يزيد 🔥 قوم دلوقتي وابدأ من جديد، إنت قدها",
    "مفيش حاجة بتيجي ببلاش.. المستوى محتاج شغل حقيقي 💪 صحّي همتك وركّز في الكورس 📚",
    "متزعلش من كلامي بس ده لمصلحتك 👊 لو كمّلت بالطريقة دي مش هتوصل.. غيّر دلوقتي وإنت هتكسب",
  ],
};

/** Map a completion percentage (0–100) to a performance tier. */
export function getPerformanceTier(progress: number): PerformanceTier {
  if (progress >= 66) return "high";
  if (progress >= 35) return "average";
  return "below";
}

/**
 * Pick the most suitable coaching message for the student's performance. The
 * choice is deterministic (derived from `progress`) so it stays stable across
 * re-renders, and `{p}` is filled with the percentile in Arabic-Indic digits.
 */
export function pickCoachMessage(progress: number): string {
  const tier = getPerformanceTier(progress);
  const list = LEADERBOARD_MESSAGES[tier];
  const message = list[Math.abs(Math.round(progress)) % list.length];
  return message.replace("{p}", toArabicDigits(Math.round(progress)));
}
