import fs from 'node:fs';

const SPAN_STYLE = 'display:inline-block;opacity:0.001;filter:blur(10px);transform:translateX(0px) translateY(10px) scale(0) rotate(0deg) skewX(0deg) skewY(0deg)';
function letterSpans(word) {
  return word.split('').map(ch => `<span style="${SPAN_STYLE}">${ch}</span>`).join('');
}

let html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');

// --- Letter-span name replacements (animated hero text) ---
// Abhishek -> Akhilesh (both 8 letters)
html = html.split(letterSpans('Abhishek')).join(letterSpans('Akhilesh'));
// Kanika -> Rakhi (6 -> 5 letters)
html = html.split(letterSpans('Kanika')).join(letterSpans('Rakhi'));
// weds stays

// --- data-framer-name attribute values ---
html = html.split('data-framer-name="Abhishek"').join('data-framer-name="Akhilesh"');
html = html.split('data-framer-name="Kanika"').join('data-framer-name="Rakhi"');

// --- Parents / blessings ---
html = html.split('Smt. Lata Devi & Sm. Kamal Kapoor').join('Smt. Anita Devi & Shri Arjun Chaudhary');
html = html.split('Mrs. Reena & Mr. Rajiv Kapoor').join('Smt. Anita Devi & Shri Arjun Chaudhary');
html = html.split('Mrs. Shalini & Mr. Aakash Mittal').join('Smt. Meena Devi & Shri Jageshwar Chaudhary');

// --- Event names ---
html = html.split('Mehendi').join('Satyanarayan Puja');
html = html.split('Cocktail').join('Baba Bhuian Puja');
html = html.split('Pre-Wedding').join('Preetibhoj');
html = html.split('Shaadi').join('Vivah');
html = html.split('Reception').join('Baraat');

// --- Dates ---
html = html.split('Friday, March 7th 2026').join('06.12.2026 (Sunday)');
html = html.split('Friday, March 8th 2026').join('07.12.2026 (Monday)');
html = html.split('Friday, March 9th 2026').join('08.12.2026 (Tuesday)');
html = html.split('Friday, March 10th 2026').join('09.12.2026 (Wednesday)');
html = html.split('Friday, March 11th 2026').join('09.12.2026 (Wednesday)');

// --- Venue / time ---
html = html.split('The Savoy, Mussoorie').join('Hasanpur Bujurg, Rampur Ratnakar, Jandaha, Vaishali');
html = html.split('6pm Onwards').join('11:00 AM onwards');

// --- Haldi event name already; keep Haldi as Haldi Mehndi? rename Haldi occurrences that are event names ---
// (Haldi appears in "Haldi" event and "Haldi" in text; replace standalone event label)
html = html.split('>Haldi<').join('>Haldi Mehndi<');

// --- RSVP / looking forward ---
html = html.split('Looking forward to see you').join('Aapka swagat hai');
html = html.split('Click the link to RSVP').join('RSVP ke liye click karein');
html = html.split('Click to open the map').join('Map kholne ke liye click karein');
html = html.split('See the route').join('Route dekhein');

// --- Couple message ---
html = html.split('We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness. We are looking forward to see you at the wedding functions.').join('Aap sabhi ke sneh aur ashirwad ke liye hum hamesha aabhaari rahenge. Aapki upasthiti se yah shubh avasar aur bhi khaas ban jayega.');

// --- Things to know items ---
html = html.split('#BadriKiDulhania').join('#AkhileshKiDulhania');
html = html.split('While posting photos on social media please use the hashtag - ').join('Social media par photos post karte samay hashtag ka upyog karein - ');
html = html.split('It will be mostly cloudy with temperature reaching up to 22 degrees at the venue').join('Venue par mausam adhiktar badal wala rahega, taapmaan 22 degree tak.');
html = html.split('We recommend the nearby lodge called Amba Valley near the venue for the staff members').join('Staff members ke liye venue ke nazdeek Amba Valley lodge sifarish karte hain.');
html = html.split('Valet parking for all our guests will be available at the venue').join('Sabhi mehmanon ke liye venue par valet parking uplabdh hogi.');

// --- Follow the action / instagram ---
html = html.split('Follow the action').join('Follow the action');
html = html.split('Click the link to open Instagram').join('Instagram kholne ke liye click karein');

// --- Footer message ---
html = html.split('Mittal family is excited that you are able to join us in celebrating what we hope will be one of the happiest days of our lives.').join('Chaudhary parivaar aap sabhi ko apne is shubh avasar par aamantrit karta hai.');
html = html.split('© Missing Piece 2025').join('© Chaudhary Parivaar 2026');

// --- Watermark / buy button (template) keep as is ---

fs.writeFileSync('docs/research/mountain-source.html', html);
console.log('content updated');

