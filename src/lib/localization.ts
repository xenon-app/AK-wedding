export type Language = "en" | "hi";

export const LANGUAGE_STORAGE_KEY = "ak-wedding-language";
const LANGUAGE_CHANGE_EVENT = "ak-wedding-language-change";
let sessionLanguage: Language | null = null;

export function getLanguageSnapshot(): Language {
  try {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === "en" || savedLanguage === "hi") return savedLanguage;
  } catch {
    // Storage can be unavailable in private browsing; use browser settings.
  }

  if (sessionLanguage) return sessionLanguage;
  const preferredLanguage =
    navigator.languages?.[0] || navigator.language || "en";
  return preferredLanguage.toLowerCase().startsWith("hi") ? "hi" : "en";
}

export function getServerLanguageSnapshot(): Language {
  return "en";
}

export function subscribeToLanguage(listener: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === LANGUAGE_STORAGE_KEY || event.key === null) {
      sessionLanguage = null;
      listener();
    }
  };
  window.addEventListener(LANGUAGE_CHANGE_EVENT, listener);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function setLanguagePreference(language: Language) {
  sessionLanguage = language;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The selected language remains active for this page view.
  }
  window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
}

const HINDI_TRANSLATIONS: Record<string, string> = {
  "A Special Invitation": "एक विशेष निमंत्रण",
  "Together with their Families": "अपने परिवारों सहित",
  "You Are Cordially Invited!": "सादर आमंत्रित हैं!",
  "To celebrate the wedding of": "विवाहोत्सव के पावन अवसर पर",
  "Wednesday, 9th December 2026": "बुधवार, 9 दिसंबर 2026",
  "With the blessings of our families, we invite you to join us in celebrating our special day.":
    "अपने परिवारों के आशीर्वाद सहित, हम आपको अपने इस विशेष दिन के उत्सव में सादर आमंत्रित करते हैं।",
  "View Your Invitation": "निमंत्रण देखें",
  "Preparing Experience": "अनुभव तैयार किया जा रहा है",
  "Preparing Invitation...": "निमंत्रण तैयार किया जा रहा है...",
  "Assets Prepared • Welcome": "आवश्यक सामग्री तैयार • स्वागत है",
  "Some resources could not be loaded. Tap to retry.":
    "कुछ आवश्यक सामग्री लोड नहीं हो सकी। पुनः प्रयास करें।",
  "Retry Loading": "फिर से लोड करें",
  "Experience preparation": "अनुभव की तैयारी",
  "Wedding Invitation": "विवाह निमंत्रण",
  "Choose language": "भाषा चुनें",
  "With the heavenly blessings of": "ईश्वर के दिव्य आशीर्वाद से",
  "With the blessings of": "के आशीर्वाद सहित",
  INVITE: "सादर आमंत्रित करते हैं",
  "You to join us in the wedding celebrations of":
    "आपको विवाहोत्सव में सम्मिलित होने हेतु सादर आमंत्रित करते हैं",
  "See the route": "मार्ग देखें",
  "See the": "मार्ग",
  route: "देखें",
  "Map kholne ke liye click karein": "नक्शा खोलने के लिए यहाँ क्लिक करें",
  "Map open karne ke liye click karein": "नक्शा देखने के लिए यहाँ क्लिक करें",
  "Meet the Bride & Groom": "वर-वधू से मिलें",
  "Meet the Bride and Groom": "वर-वधू से मिलें",
  "Meet Bride & Groom": "वर-वधू से मिलें",
  "MEET THE": "वर-वधू से",
  "Bride & Groom": "मिलें",
  "Daughter of": "सुपुत्री",
  "On the following events": "निम्नलिखित कार्यक्रम",
  "The countdown begins": "उलटी गिनती शुरू",
  "The Countdown Begins": "उलटी गिनती शुरू",
  "Until The Auspicious Vivah • 09.12.2026":
    "शुभ विवाह तक • 09.12.2026",
  "Moments We Cherish": "हमारी संजोई हुई यादें",
  "Drag or use arrows to explore our journey":
    "हमारी यात्रा देखने के लिए खींचें या तीरों का उपयोग करें",
  "Eternal Bond": "अटूट बंधन",
  "Together in Love": "प्रेम में एक-दूजे के साथ",
  "Cherished Celebrations": "स्मरणीय उत्सव",
  Soulmates: "जीवनसाथी",
  "A New Journey Begins": "एक नए सफ़र की शुरुआत",
  "Pure Joy": "असीम आनंद",
  "Hand in Hand Forever": "जीवनभर हाथ थामे",
  "Blessed Union": "मंगलमय मिलन",
  "With Gratitude": "सादर आभार",
  "We cordially invite you to be part of our":
    "हम आपको अपने",
  "journey and seek your presence and":
    "सफ़र का हिस्सा बनने और आपकी उपस्थिति एवं",
  "blessings for our new beginning.":
    "नए आरंभ के लिए आपका आशीर्वाद पाने हेतु सादर आमंत्रित करते हैं।",
  "Shri Arjun Chaudhary & Family": "श्री Arjun Chaudhary एवं परिवार",
  "Smt. Anita Devi & Shri Arjun Chaudhary":
    "श्रीमती Anita Devi एवं श्री Arjun Chaudhary",
  "Smt. Meena Devi & Shri Jageshwar Chaudhary,":
    "श्रीमती Meena Devi एवं श्री Jageshwar Chaudhary,",
  "Aapka swagat hai": "आपका स्वागत है",
  "RSVP ke liye click karein": "कृपया अपनी उपस्थिति की पुष्टि करें",
  "Aap sabhi ke sneh aur ashirwad ke liye hum hamesha aabhaari rahenge. Aapki upasthiti se yah shubh avasar aur bhi khaas ban jayega.":
    "आप सभी के स्नेह और आशीर्वाद के लिए हम सदैव आभारी रहेंगे। आपकी उपस्थिति से यह शुभ अवसर और भी विशेष बन जाएगा।",
  "Hasanpur Bujurg, Rampur Ratnakar, Jandaha, Vaishali":
    "हसनपुर बुजुर्ग, रामपुर रत्नाकर, जंदाहा, वैशाली",
  "RSVP on WhatsApp": "WhatsApp पर अपनी उपस्थिति की पुष्टि करें",
  "Check Location": "स्थान देखें",
  "Preetibhoj Location": "प्रीतिभोज स्थल",
  "Vivah Location": "विवाह स्थल",
  "Preetibhoj & Vivah": "प्रीतिभोज एवं विवाह",
  "Preetibhoj &amp; Vivah": "प्रीतिभोज एवं विवाह",
  "Satyanarayan Puja , Matkor ,Baba Bhuian Puja":
    "सत्यनारायण पूजा, मटकोर एवं बाबा भुइयाँ पूजा",
  "Satyanarayan Puja, Matkor, Baba Bhuian Puja":
    "सत्यनारायण पूजा, मटकोर एवं बाबा भुइयाँ पूजा",
  "Baba Bhuian Puja": "बाबा भुइयाँ पूजा",
  "Haldi & Mehndi": "हल्दी एवं मेहंदी",
  "06.12.2026 (Sunday)": "06.12.2026 (रविवार)",
  "07.12.2026 (Monday)": "07.12.2026 (सोमवार)",
  "08.12.2026 (Monday)": "08.12.2026 (सोमवार)",
  "09.12.2026 (Wednesday)": "09.12.2026 (बुधवार)",
  "11:00 AM onwards": "प्रातः 11:00 बजे से",
  "Instagram kholne ke liye click karein":
    "Instagram खोलने के लिए यहाँ क्लिक करें",
  "Click to view next photo": "अगली तस्वीर देखने के लिए क्लिक करें",
  "Preetibhoj & Vivah Celebration": "प्रीतिभोज एवं विवाह समारोह",
  carousel: "तस्वीरों का हिंडोला",
  slide: "तस्वीर",
  "Play music": "संगीत चलाएँ",
  "Pause music": "संगीत रोकें",
  "Previous slide": "पिछली तस्वीर",
  "Next slide": "अगली तस्वीर",
  "Cover carousel": "तस्वीरों का हिंडोला",
  DAYS: "दिन",
  HOURS: "घंटे",
  MINUTES: "मिनट",
  SECONDS: "सेकंड",
  "Akhilesh & Rakhi - Royal Elegance": "Akhilesh & Rakhi - शाही अंदाज़",
  "Akhilesh & Rakhi - Together in Love":
    "Akhilesh & Rakhi - प्रेम में एक-दूजे के साथ",
  "Akhilesh & Rakhi - Soulmates": "Akhilesh & Rakhi - जीवनसाथी",
  "Akhilesh & Rakhi - Pure Joy": "Akhilesh & Rakhi - असीम आनंद",
  "Akhilesh & Rakhi - Blessed Union": "Akhilesh & Rakhi - मंगलमय मिलन",
  "Akhilesh & Rakhi - Celebration": "Akhilesh & Rakhi - उत्सव",
  "Akhilesh & Rakhi - Cherished Memories":
    "Akhilesh & Rakhi - संजोई हुई यादें",
  "Akhilesh & Rakhi - Blessed Moments": "Akhilesh & Rakhi - मंगलमय पल",
  "Go to slide": "तस्वीर पर जाएँ",
  "Days": "दिन",
  "Hours": "घंटे",
  "Minutes": "मिनट",
  "Seconds": "सेकंड",
};

const ENGLISH_TRANSLATIONS = new Map<string, string>();
const ENGLISH_SOURCE_TRANSLATIONS: Record<string, string> = {
  "Map kholne ke liye click karein": "Click here to open the map",
  "Map open karne ke liye click karein": "Click here to open the map",
  "Instagram kholne ke liye click karein": "Click here to open Instagram",
  "Aapka swagat hai": "Welcome",
  "RSVP ke liye click karein": "Click to RSVP",
  "Aap sabhi ke sneh aur ashirwad ke liye hum hamesha aabhaari rahenge. Aapki upasthiti se yah shubh avasar aur bhi khaas ban jayega.":
    "We will always be grateful for your love and blessings. Your presence will make this auspicious occasion even more special.",
};
const HINDI_BY_NORMALIZED = new Map<string, string>();
Object.entries(HINDI_TRANSLATIONS).forEach(([english, hindi]) => {
  const normalizedHindi = normalize(hindi);
  const normalizedEnglish = normalize(english);
  if (!ENGLISH_TRANSLATIONS.has(normalizedHindi)) {
    ENGLISH_TRANSLATIONS.set(normalizedHindi, english);
  }
  if (!HINDI_BY_NORMALIZED.has(normalizedEnglish)) {
    HINDI_BY_NORMALIZED.set(normalizedEnglish, hindi);
  }
});
Object.entries(ENGLISH_SOURCE_TRANSLATIONS).forEach(([source, english]) => {
  ENGLISH_TRANSLATIONS.set(normalize(source), english);
});

function createPhraseMatcher(entries: [string, string][]) {
  const phrases = entries
    .filter(([source]) => source.length >= 5)
    .sort(([left], [right]) => right.length - left.length);
  if (!phrases.length) return null;

  const lookup = new Map(
    phrases.map(
      ([source, target]) => [normalize(source), target] as [string, string],
    ),
  );
  const pattern = phrases
    .map(([source]) => source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return {
    lookup,
    pattern: new RegExp(pattern, "gi"),
  };
}

const HINDI_PHRASES = createPhraseMatcher(Object.entries(HINDI_TRANSLATIONS));
const ENGLISH_PHRASES = createPhraseMatcher(
  Array.from(ENGLISH_TRANSLATIONS, ([source, english]) => [
    source,
    english,
  ] as [string, string]),
);
interface LocalizedValue {
  en: string;
  hi: string;
}

const originalTextValues = new WeakMap<Node, LocalizedValue>();
const originalAttributeValues = new WeakMap<Element, Map<string, LocalizedValue>>();

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function translateDynamicStatus(value: string, language: Language) {
  const preparingExperience = value.match(/^Preparing Experience • (\d+)%$/i);
  if (preparingExperience) {
    return language === "hi"
      ? `अनुभव तैयार किया जा रहा है • ${preparingExperience[1]}%`
      : `Preparing Experience • ${preparingExperience[1]}%`;
  }

  const preparingInvitation = value.match(/^Preparing Invitation\.\.\. (\d+)%$/i);
  if (preparingInvitation) {
    return language === "hi"
      ? `निमंत्रण तैयार किया जा रहा है... ${preparingInvitation[1]}%`
      : `Preparing Invitation... ${preparingInvitation[1]}%`;
  }

  const slideNumber = value.match(/^Go to slide (\d+)$/i);
  if (slideNumber) {
    return language === "hi"
      ? `तस्वीर ${slideNumber[1]} पर जाएँ`
      : `Go to slide ${slideNumber[1]}`;
  }

  const slidePosition = value.match(/^(\d+) of (\d+)$/i);
  if (slidePosition) {
    return language === "hi"
      ? `${slidePosition[2]} में से ${slidePosition[1]}`
      : `${slidePosition[1]} of ${slidePosition[2]}`;
  }

  const hindiSlidePosition = value.match(/^(\d+) में से (\d+)$/);
  if (hindiSlidePosition) {
    return language === "en"
      ? `${hindiSlidePosition[2]} of ${hindiSlidePosition[1]}`
      : `${value}`;
  }

  return null;
}

export function translateText(value: string, language: Language) {
  const normalized = normalize(value);
  if (!normalized) return value;

  const dynamicTranslation = translateDynamicStatus(value.trim(), language);
  if (dynamicTranslation) {
    return preserveWhitespace(value, dynamicTranslation);
  }

  const exactTranslation =
    language === "hi"
      ? HINDI_BY_NORMALIZED.get(normalized)
      : ENGLISH_TRANSLATIONS.get(normalized);

  if (exactTranslation) return preserveWhitespace(value, exactTranslation);

  const matcher = language === "hi" ? HINDI_PHRASES : ENGLISH_PHRASES;
  return matcher
    ? value.replace(matcher.pattern, (phrase) => matcher.lookup.get(normalize(phrase)) ?? phrase)
    : value;
}

function translateElementAttributes(element: Element, language: Language) {
  let originalValues = originalAttributeValues.get(element);
  if (!originalValues) {
    originalValues = new Map();
    originalAttributeValues.set(element, originalValues);
  }

  for (const attribute of [
    "aria-label",
    "aria-description",
    "aria-roledescription",
    "aria-valuetext",
    "title",
    "alt",
    "placeholder",
  ]) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    let localizedValue = originalValues.get(attribute);
    if (
      !localizedValue ||
      (value !== localizedValue.en && value !== localizedValue.hi)
    ) {
      localizedValue = {
        en: translateText(value, "en"),
        hi: translateText(value, "hi"),
      };
      originalValues.set(attribute, localizedValue);
    }
    const translated = localizedValue[language];
    if (translated !== value) element.setAttribute(attribute, translated);
  }
}

function translateTextNode(node: Node, language: Language) {
  const parent = node.parentElement;
  if (parent?.closest("script, style, noscript")) return;
  const value = node.nodeValue;
  if (!value) return;

  let localizedValue = originalTextValues.get(node);
  if (
    !localizedValue ||
    (value !== localizedValue.en && value !== localizedValue.hi)
  ) {
    localizedValue = {
      en: translateText(value, "en"),
      hi: translateText(value, "hi"),
    };
    originalTextValues.set(node, localizedValue);
  }
  const translated = localizedValue[language];
  if (translated !== value) node.nodeValue = translated;
}

function translateSubtree(root: Node, language: Language) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root, language);
    return;
  }

  if (root instanceof Element) translateElementAttributes(root, language);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    translateTextNode(node, language);
  }

  if (root instanceof Element) {
    root.querySelectorAll("*").forEach((element) =>
      translateElementAttributes(element, language),
    );
  }
}

export function observeLocalizedContent(language: Language) {
  translateSubtree(document.body, language);

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "characterData") {
        translateSubtree(record.target, language);
      } else if (record.type === "attributes") {
        translateElementAttributes(record.target as Element, language);
      } else {
        record.addedNodes.forEach((node) => translateSubtree(node, language));
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: [
      "aria-label",
      "aria-description",
      "aria-roledescription",
      "aria-valuetext",
      "title",
      "alt",
      "placeholder",
    ],
    characterData: true,
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}
