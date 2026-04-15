import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { FaXTwitter, FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa6";

// --- EXPANDED HOLIDAY DATA MAP (Name, Icon, and 1-Sentence Note) ---
const holidayData = {
  // January
  "01-01": { name: "New Year / Global Family Day", icon: "🎆", note: "Embrace fresh starts and cherish the time spent with your loved ones." },
  "01-04": { name: "World Braille Day", icon: "⠃", note: "Celebrating the brilliant invention that brought literacy to the visually impaired." },
  "01-11": { name: "International Thank-You Day", icon: "🙏", note: "Take a moment today to express gratitude to those who make your life better." },
  "01-14": { name: "Makar Sankranti", icon: "🪁", note: "May your life soar as high as the kites in the harvest sky." },
  "01-23": { name: "Basant Panchami", icon: "🌼", note: "May Goddess Saraswati bless you with immense knowledge and wisdom." },
  "01-26": { name: "Republic Day", icon: "🇮🇳", note: "Honoring the constitution, diversity, and spirit of our great nation." },
  "01-30": { name: "World Leprosy Day", icon: "🤝", note: "Spreading awareness and compassion to end the stigma surrounding leprosy." },
  // February
  "02-01": { name: "Sant Ravidas Jayanti", icon: "🕊️", note: "Remembering the teachings of equality and spiritual freedom by Sant Ravidas." },
  "02-04": { name: "Shab-e-Barat", icon: "🌙", note: "A night of forgiveness, prayer, and seeking blessings for the year ahead." },
  "02-12": { name: "Darwin Day", icon: "🧬", note: "Celebrating science, evolution, and the endless pursuit of human curiosity." },
  "02-14": { name: "Valentine's Day", icon: "💖", note: "Spread love, kindness, and appreciation to everyone who holds a place in your heart." },
  "02-15": { name: "Mahashivratri", icon: "🔱", note: "May Lord Shiva guide you from darkness into the light of ultimate truth." },
  "02-21": { name: "International Mother Language Day", icon: "🗣️", note: "Celebrate the linguistic and cultural diversity that shapes our identity." },
  "02-22": { name: "World Thinking Day", icon: "💡", note: "Empowering young minds to think globally and create a better tomorrow." },
  // March
  "03-01": { name: "International Day of the Seal", icon: "🦭", note: "Raising awareness to protect marine life and their fragile ecosystems." },
  "03-02": { name: "Holi", icon: "🎨", note: "May your life be painted with the vibrant colors of joy and prosperity." },
  "03-03": { name: "Holi", icon: "🎨", note: "May your life be painted with the vibrant colors of joy and prosperity." },
  "03-04": { name: "Holi", icon: "🎨", note: "May your life be painted with the vibrant colors of joy and prosperity." },
  "03-08": { name: "International Women's Day", icon: "👩🏽‍🚀", note: "Honoring the achievements and resilience of women across the globe." },
  "03-20": { name: "World Frog Day", icon: "🐸", note: "Leap into action to protect amphibians and their critical natural habitats." },
  "03-21": { name: "Eid-ul-Fitr / Down Syndrome Day", icon: "🕌", note: "Embrace inclusion today, and may your home be filled with peace and blessings." },
  "03-22": { name: "Bihar Diwas / World Water Day", icon: "💧", note: "Conserve every drop today while celebrating the rich heritage of Bihar." },
  "03-23": { name: "World Meteorological Day", icon: "🌤️", note: "Appreciating the science that helps us understand and protect our climate." },
  "03-24": { name: "World TB Day", icon: "🩺", note: "Standing together to raise awareness and put an end to tuberculosis." },
  "03-26": { name: "Samrat Ashok Jayanti", icon: "🦁", note: "Honoring the legacy of peace and dharma left by Emperor Ashoka." },
  "03-27": { name: "Ram Navami", icon: "🏹", note: "May the divine grace of Lord Rama always be with you and your family." },
  "03-28": { name: "Earth Hour", icon: "🌍", note: "Turn off the lights and spark a commitment to our planet's future." },
  "03-31": { name: "Mahavir Jayanti", icon: "🌿", note: "Embrace the path of non-violence and truth taught by Lord Mahavira." },
  // April
  "04-02": { name: "Children's Book Day", icon: "📚", note: "Spark a child's imagination today through the magic of a good story." },
  "04-03": { name: "Good Friday", icon: "✝️", note: "A day of solemn reflection on sacrifice, grace, and ultimate love." },
  "04-07": { name: "World Health Day", icon: "🍏", note: "Prioritize your physical and mental well-being for a happier, healthier life." },
  "04-12": { name: "Yuri's Night", icon: "🚀", note: "Celebrating humanity's first bold steps into the vastness of outer space." },
  "04-13": { name: "Special Librarians Day", icon: "📖", note: "Thank the dedicated knowledge keepers who help us navigate information." },
  "04-14": { name: "Dr. B.R. Ambedkar Jayanti", icon: "⚖️", note: "Honoring the chief architect of the Indian Constitution and a champion of equality." },
  "04-21": { name: "Creativity & Innovation Day", icon: "🎨", note: "Think outside the box and let your unique ideas change the world." },
  "04-22": { name: "Earth Day", icon: "🌱", note: "Invest in our planet today to ensure a sustainable and green tomorrow." },
  "04-23": { name: "World Book Day", icon: "📕", note: "Get lost in a book and celebrate the universal power of literature." },
  "04-25": { name: "World Penguin Day", icon: "🐧", note: "Waddle into action to protect these incredible flightless birds." },
  "04-29": { name: "International Dance Day", icon: "💃", note: "Express yourself and feel the rhythm—dance like nobody's watching!" },
  // May
  "05-01": { name: "May Day / Buddha Purnima", icon: "🧘‍♂️", note: "Celebrate the dignity of labor and the serene enlightenment of Lord Buddha." },
  "05-03": { name: "World Press Freedom Day", icon: "📰", note: "Defending the truth and honoring the courage of journalists worldwide." },
  "05-05": { name: "International Midwives Day", icon: "🍼", note: "Thanking the skilled hands that safely guide new life into the world." },
  "05-08": { name: "World Red Cross Day", icon: "🚑", note: "Celebrating the spirit of humanitarianism and life-saving volunteer work." },
  "05-10": { name: "World Lupus Day", icon: "🦋", note: "Spreading awareness to support those living with lupus every single day." },
  "05-12": { name: "International Nurses Day", icon: "🩺", note: "Honoring the compassion, care, and tireless dedication of nurses." },
  "05-13": { name: "IEEE Global Engineering Day", icon: "⚙️", note: "Recognizing the engineers who build, innovate, and connect our world." },
  "05-15": { name: "International Day of Families", icon: "👨‍👩‍👧‍👦", note: "Treasure the bonds and unconditional support that family provides." },
  "05-17": { name: "World Hypertension Day", icon: "❤️", note: "Know your numbers and prioritize a healthy, stress-free lifestyle." },
  "05-18": { name: "International Museum Day", icon: "🏛️", note: "Explore the art, history, and culture preserved in our museums." },
  "05-21": { name: "Cultural Diversity Day", icon: "🌍", note: "Embrace the beautiful differences that make our global community so rich." },
  "05-22": { name: "Biological Diversity Day", icon: "🐝", note: "Protect the intricate web of life that sustains our natural ecosystems." },
  "05-23": { name: "World Turtle Day", icon: "🐢", note: "Slow and steady wins the race—let's protect turtles and their habitats." },
  "05-24": { name: "World Schizophrenia Day", icon: "🧠", note: "Breaking the stigma and advocating for better mental health support." },
  "05-25": { name: "Towel Day", icon: "🧣", note: "Don't panic! Always know where your towel is as you explore the galaxy." },
  "05-28": { name: "Red Nose Day / Bakrid", icon: "🐏", note: "Share a smile, spread charity, and celebrate the spirit of sacrifice." },
  "05-31": { name: "World No-Tobacco Day", icon: "🚭", note: "Choose your health today and commit to a smoke-free future." },
  // June
  "06-01": { name: "World Milk Day", icon: "🥛", note: "Raise a glass to global nutrition and the hardworking dairy industry." },
  "06-03": { name: "World Bicycle Day", icon: "🚲", note: "Pedal your way to better health and a cleaner, greener environment." },
  "06-05": { name: "World Environment Day", icon: "🌳", note: "Take action today to restore our ecosystems and protect our only home." },
  "06-08": { name: "World Ocean Day", icon: "🌊", note: "Keep our oceans clean to protect the majestic blue heart of our planet." },
  "06-14": { name: "World Blood Donor Day", icon: "🩸", note: "Give the gift of life and thank those who volunteer to donate blood." },
  "06-16": { name: "Day of the African Child", icon: "🌍", note: "Advocating for quality education and the rights of children across Africa." },
  "06-17": { name: "Combat Desertification Day", icon: "🌵", note: "Work together to restore degraded land and combat extreme droughts." },
  "06-20": { name: "World Refugee Day", icon: "🕊️", note: "Standing in solidarity with those forced to flee their homes for safety." },
  "06-21": { name: "International Yoga Day", icon: "🧘‍♀️", note: "Unite your mind, body, and spirit through the ancient practice of Yoga." },
  "06-26": { name: "Against Drug Abuse Day", icon: "🚫", note: "Promoting a healthy society free of drug abuse and illicit trafficking." },
  // July
  "07-11": { name: "World Population Day", icon: "👥", note: "Focusing on the urgency and importance of global population issues." },
  "07-16": { name: "World Snake Day", icon: "🐍", note: "Appreciating these slithering reptiles and their crucial role in nature." },
  "07-20": { name: "International Moon Day", icon: "🌕", note: "Commemorating humanity's giant leap onto the lunar surface." },
  "07-28": { name: "World Hepatitis Day", icon: "🎗️", note: "Raise awareness, encourage testing, and take action to eliminate hepatitis." },
  "07-30": { name: "International Friendship Day", icon: "🤝", note: "Reach out to a friend today and celebrate the bonds that tie us together." },
  // August
  "08-04": { name: "Chehallum", icon: "🕌", note: "A solemn day of remembrance marking the end of the mourning period." },
  "08-08": { name: "International Infinity Day", icon: "♾️", note: "Celebrate limitless possibilities, philosophy, and the concept of forever." },
  "08-09": { name: "World's Indigenous People", icon: "🪶", note: "Honoring the cultures, wisdom, and rights of indigenous populations." },
  "08-10": { name: "International Biodiesel Day", icon: "⛽", note: "Fueling the future with sustainable and renewable energy alternatives." },
  "08-12": { name: "International Youth Day", icon: "🌟", note: "Empowering the voices and actions of the youth to shape a better future." },
  "08-13": { name: "Lefthanders Day", icon: "✍️", note: "Celebrating the uniqueness and creativity of left-handed people everywhere." },
  "08-14": { name: "World Lizard Day", icon: "🦎", note: "Taking a moment to appreciate the incredible diversity of lizards." },
  "08-15": { name: "Independence Day", icon: "🇮🇳", note: "Proudly unfurl the tricolor and honor the heroes of our freedom struggle." },
  "08-23": { name: "Slave Trade Remembrance Day", icon: "⛓️", note: "Remembering history's dark chapters to ensure freedom for all today." },
  "08-26": { name: "Hazrat Mohammad Sahab Birthday", icon: "✨", note: "Commemorating the birth and reflecting on the teachings of the Prophet." },
  "08-28": { name: "Rakshabandhan", icon: "🎀", note: "Celebrating the unbreakable bond of love and protection between siblings." },
  // September
  "09-04": { name: "Sri Krishna Janmashtami", icon: "🦚", note: "May the melodies of Lord Krishna's flute fill your life with eternal joy." },
  "09-08": { name: "International Literacy Day", icon: "📖", note: "Empowering communities through the profound gift of reading and writing." },
  "09-13": { name: "International Chocolate Day", icon: "🍫", note: "Treat yourself today—life is always a little better with chocolate." },
  "09-15": { name: "Democracy / Software Freedom Day", icon: "🗳️", note: "Advocating for digital rights and the power of the people to choose." },
  "09-16": { name: "Ozone Layer Preservation Day", icon: "🛡️", note: "Protecting the fragile shield of gas that protects all life on Earth." },
  "09-19": { name: "Talk Like a Pirate Day", icon: "🏴‍☠️", note: "Ahoy matey! Shiver me timbers and have a swashbuckling good time today." },
  "09-21": { name: "World Gratitude Day", icon: "🌻", note: "Pause, reflect, and be thankful for the little things that bring you joy." },
  "09-22": { name: "World Car-Free Day", icon: "🚶", note: "Leave the keys at home and take a walk to reduce your carbon footprint." },
  "09-29": { name: "Inventors Day / World Heart Day", icon: "❤️", note: "Innovate for the future and remember to take care of your cardiovascular health." },
  // October
  "10-01": { name: "Music Day / World Ballet Day", icon: "🎵", note: "Let the rhythm move you and celebrate the universal language of art." },
  "10-02": { name: "Gandhi Jayanti / Farm Animals Day", icon: "🕊️", note: "Embrace non-violence towards all living beings on this day of peace." },
  "10-03": { name: "World Temperance Day", icon: "⚖️", note: "A day to reflect on moderation, self-restraint, and balanced living." },
  "10-04": { name: "World Animal Day", icon: "🐾", note: "Speak up for those without a voice and improve animal welfare globally." },
  "10-05": { name: "World Teacher's Day", icon: "🧑‍🏫", note: "Thank the educators who patiently ignite the spark of knowledge." },
  "10-10": { name: "World Mental Health Day", icon: "🧠", note: "It's okay not to be okay; prioritize your mental well-being today." },
  "10-16": { name: "World Food Day", icon: "🌾", note: "Striving for a world with zero hunger and accessible nutrition for all." },
  "10-17": { name: "Durga Puja / Poverty Eradication Day", icon: "🌺", note: "May Maa Durga give you strength as we fight to end global poverty." },
  "10-18": { name: "Durga Puja", icon: "🌺", note: "Celebrate the victory of good over evil with devotion and joy." },
  "10-19": { name: "Durga Puja", icon: "🌺", note: "Celebrate the victory of good over evil with devotion and joy." },
  "10-20": { name: "Durga Puja", icon: "🌺", note: "Celebrate the victory of good over evil with devotion and joy." },
  "10-24": { name: "United Nations Day", icon: "🇺🇳", note: "Celebrating international cooperation, peace, and global development." },
  "10-29": { name: "International Internet Day", icon: "🌐", note: "Commemorating the technological revolution that connected the entire world." },
  "10-31": { name: "Halloween", icon: "🎃", note: "Have a spook-tacular day full of treats, tricks, and frightening fun!" },
  // November
  "11-08": { name: "Diwali / Chhath Puja", icon: "🪔", note: "May the festival of lights guide you towards happiness and prosperity." },
  "11-09": { name: "Diwali / Chhath Puja", icon: "🪔", note: "May the festival of lights guide you towards happiness and prosperity." },
  "11-10": { name: "Diwali / Chhath Puja", icon: "🪔", note: "May the festival of lights guide you towards happiness and prosperity." },
  "11-11": { name: "Diwali / Chhath Puja", icon: "🪔", note: "May the festival of lights guide you towards happiness and prosperity." },
  "11-12": { name: "Diwali / Chhath Puja", icon: "🪔", note: "May the festival of lights guide you towards happiness and prosperity." },
  "11-13": { name: "Diwali / Chhath Puja", icon: "🪔", note: "May the festival of lights guide you towards happiness and prosperity." },
  "11-14": { name: "Diwali / World Diabetes Day", icon: "🪔", note: "Celebrate the lights while spreading awareness about diabetic care." },
  "11-15": { name: "Diwali / Chhath Puja", icon: "🪔", note: "May the festival of lights guide you towards happiness and prosperity." },
  "11-16": { name: "Day for Tolerance", icon: "🤝", note: "Fostering mutual understanding, respect, and peace among diverse cultures." },
  "11-19": { name: "World Toilet Day", icon: "🚽", note: "Raising awareness to tackle the global sanitation crisis securely." },
  "11-21": { name: "World Television Day", icon: "📺", note: "Celebrating the visual media that informs, entertains, and connects us." },
  "11-24": { name: "Guru Nanak Jayanti", icon: "ੴ", note: "May the holy teachings of Guru Nanak Dev Ji enlighten your path." },
  "11-25": { name: "Elimination of Violence Against Women", icon: "🛑", note: "Take a stand today to build a safe, respectful world for all women." },
  "11-30": { name: "Computer Security Day", icon: "🔒", note: "Update your passwords and stay safe in the ever-evolving digital world." },
  // December
  "12-01": { name: "World Aids Day", icon: "🎗️", note: "Show your support for people living with HIV and remember those we've lost." },
  "12-02": { name: "Abolition of Slavery Day", icon: "🕊️", note: "Fighting to eradicate contemporary forms of slavery and human trafficking." },
  "12-05": { name: "International Volunteers Day", icon: "🙌", note: "Thank you to those who selflessly give their time to help others." },
  "12-07": { name: "International Civil Aviation Day", icon: "✈️", note: "Recognizing the importance of safe and efficient global air travel." },
  "12-10": { name: "Human Rights Day", icon: "📜", note: "Stand up for your rights and the fundamental freedoms of all people." },
  "12-25": { name: "Christmas", icon: "🎄", note: "Wishing you a season of joy, warmth, and beautiful memories." },
  "12-31": { name: "New Year's Eve", icon: "🥂", note: "Reflect on the past year and get ready to ring in exciting new adventures!" }
};

const socials = [
  { icon: FaXTwitter, label: "X", link: "https://twitter.com/itssarvjeet", colorClass: "text-white" },
  { icon: FaLinkedinIn, label: "LinkedIn", link: "https://www.linkedin.com/in/sarvjeetrajverma/", colorClass: "text-[#0A66C2]" },
  { icon: FaGithub, label: "GitHub", link: "https://www.github.com/sarvjeetrajverma", colorClass: "text-white" },
  { icon: FaInstagram, label: "Instagram", link: "https://www.instagram.com/sarvjeetrajverma", colorClass: "text-[#E1306C]" }
];

const Icons = {
  Close: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  ArrowRight: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  Download: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
};

export default function Home() {
  const roles = useMemo(
    () => ["WEB DEVELOPER", "MERN STACK DEVELOPER", "UI/UX ENTHUSIAST"],
    []
  );
  const [index, setIndex] = useState(0);
  const [subindex, setSubindex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // --- Real Time Clock & Banner State ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showHolidayBanner, setShowHolidayBanner] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0];
  const minutes = currentTime.toLocaleTimeString('en-US', { minute: '2-digit' });
  const seconds = currentTime.toLocaleTimeString('en-US', { second: '2-digit' });
  const ampm = currentTime.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1];
  const dateStr = currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  // --- Holiday Checking Logic ---
  const currentMonthDay = `${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(2, '0')}`;
  const activeHoliday = holidayData[currentMonthDay];

  // --- Typewriter Effect ---
  useEffect(() => {
    const current = roles[index];
    const timeout = setTimeout(() => {
      if (!deleting && subindex < current.length) {
        setSubindex((v) => v + 1);
      } else if (!deleting && subindex === current.length) {
        setTimeout(() => setDeleting(true), 1200);
      } else if (deleting && subindex > 0) {
        setSubindex((v) => v - 1);
      } else if (deleting && subindex === 0) {
        setDeleting(false);
        setIndex((p) => (p + 1) % roles.length);
      }
    }, deleting ? 40 : 60);
    return () => clearTimeout(timeout);
  }, [subindex, deleting, index, roles]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // --- Mouse parallax for name ---
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const onMouseMove = (e) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };
  const springX = useSpring(mouseX, { damping: 20, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 200 });
  const nameX = useTransform(springX, [0, 1], [-12, 12]);
  const nameY = useTransform(springY, [0, 1], [-12, 12]);

  // --- Canvas starfield ---
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.75);
    let width = (canvas.width = canvas.clientWidth * dpr);
    let height = (canvas.height = canvas.clientHeight * dpr);
    const layers = isMobile
      ? [{ count: 15, speed: 0.02, size: [0.7, 1.0], color: "rgba(248,250,252,0.3)" }, { count: 10, speed: 0.03, size: [1.0, 1.5], color: "rgba(129,140,248,0.3)" }]
      : [{ count: 35, speed: 0.03, size: [0.7, 1.3], color: "rgba(248,250,252,0.4)" }, { count: 20, speed: 0.05, size: [1.0, 2.0], color: "rgba(129,140,248,0.45)" }];
    const stars = [];
    layers.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({ x: Math.random() * width, y: Math.random() * height, z: Math.random() * 0.6 + 0.4, r: (Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0]) * dpr, baseAlpha: Math.random() * 0.3 + 0.2, twinkle: Math.random() * 0.004 + 0.001, layer: li });
      }
    });
    const onResize = () => { width = (canvas.width = canvas.clientWidth * dpr); height = (canvas.height = canvas.clientHeight * dpr); };
    window.addEventListener("resize", onResize);
    const onMove = (e) => { const r = canvas.getBoundingClientRect(); pointerRef.current.x = (e.clientX - r.left) / r.width; pointerRef.current.y = (e.clientY - r.top) / r.height; };
    canvas.addEventListener("pointermove", onMove);
    let last = performance.now();
    const render = (now) => {
      const dt = Math.min(40, now - last); last = now;
      ctx.clearRect(0, 0, width, height); ctx.save(); ctx.scale(dpr, dpr);
      const cx = width / 2, cy = height / 2;
      const px = (pointerRef.current.x - 0.5) * 20 * dpr;
      const py = (pointerRef.current.y - 0.5) * 20 * dpr;
      layers.forEach((layer, li) => {
        ctx.fillStyle = layer.color;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i]; if (s.layer !== li) continue;
          const dx = s.x - cx, dy = s.y - cy, dist = Math.sqrt(dx * dx + dy * dy) || 1;
          s.x += (dx / dist) * layer.speed * dt * 0.22; s.y += (dy / dist) * layer.speed * dt * 0.22;
          if (s.x < -40 || s.x > width + 40 || s.y < -40 || s.y > height + 40) { s.x = cx + (Math.random() - 0.5) * 80; s.y = cy + (Math.random() - 0.5) * 80; }
          ctx.beginPath(); ctx.globalAlpha = Math.max(0.04, Math.min(0.55, s.baseAlpha + Math.sin(now * s.twinkle + i) * 0.16 * (li + 1)));
          ctx.arc((s.x + px * (1 - s.z)) / dpr, (s.y + py * (1 - s.z)) / dpr, (s.r / dpr) * s.z, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      });
      ctx.restore(); rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); canvas.removeEventListener("pointermove", onMove); };
  }, [isMobile]);

  return (
    <motion.section
      id="home"
      onMouseMove={!isMobile ? onMouseMove : undefined}
      className="relative w-full overflow-hidden bg-transparent text-white h-[100dvh]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      {/* Starfield canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40 mix-blend-screen" />

      {/* Single ambient glow — Apple-style single soft orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(120,119,198,0.15) 0%, rgba(99,80,180,0.06) 50%, transparent 70%)', filter: 'blur(90px)' }} />

      <div className="relative z-10 w-full h-full max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col items-center justify-center text-center" style={{ paddingTop: '76px', paddingBottom: '16px' }}>

        {/* STATUS PILL + TYPEWRITER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="flex flex-row flex-wrap justify-center items-center gap-2.5 mb-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">
              IST {hours}:{minutes} {ampm}
            </span>
          </div>
          <div className="text-xs tracking-[0.2em] text-slate-600 uppercase">
            {roles[index].substring(0, subindex)}<span className="animate-pulse">|</span>
          </div>
        </motion.div>

        {/* MASSIVE NAME */}
        <motion.div
          className="w-full mb-4"
          style={!isMobile ? { x: nameX, y: nameY } : {}}
        >
          <h1 className="font-medium tracking-tighter text-white">
            <span className="block text-slate-500 text-xs font-light mb-1.5 tracking-[0.4em] uppercase">I am</span>
            <span className="block" style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', lineHeight: '1.0' }}>Sarvjeet Raj</span>
            <span className="block text-transparent" style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', lineHeight: '1.02', WebkitTextStroke: '1px var(--theme-stroke)' }}>Verma</span>
          </h1>
        </motion.div>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="text-slate-400 text-sm sm:text-sm md:text-base max-w-md mx-auto leading-relaxed mb-4 font-light tracking-wide"
        >
          Crafting immaculate digital experiences. Bridging profound technical architecture with flawless aesthetic design.
        </motion.p>

        {/* ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
          className="flex flex-row items-center gap-6 sm:gap-9 mb-4"
        >
          <motion.a
            href="#projects"
            className="flex items-center gap-1.5 text-white border-b border-white/40 pb-0.5 text-base sm:text-base font-medium tracking-wide hover:text-slate-300 hover:border-slate-400 transition-colors"
            whileHover={{ y: -2 }}
          >
            Explore Work <Icons.ArrowRight size={14} />
          </motion.a>
          <motion.a
            href="/sarvjeetrajverma_resume.pdf"
            download="SarvjeetRajVerma_Resume.pdf"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-200 transition-colors text-base sm:text-base font-medium tracking-wide"
            whileHover={{ y: -2 }}
          >
            Resume <Icons.Download size={13} />
          </motion.a>
        </motion.div>

        {/* SOCIALS — horizontal row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-6 sm:gap-7"
        >
          {socials.map((s) => (
            <motion.a
              key={s.label} href={s.link} target="_blank" rel="noreferrer"
              className={`${s.colorClass} hover:scale-110 hover:brightness-125 transition-all duration-300 opacity-90 hover:opacity-100`}
              whileHover={{ y: -3 }}
            >
              <s.icon size={26} />
              <span className="sr-only">{s.label}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* HOLIDAY BANNER — bottom of screen */}
        <AnimatePresence>
          {activeHoliday && showHolidayBanner && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-slate-600 text-[10px] tracking-widest uppercase font-medium"
            >
              <span>{activeHoliday.icon}</span>
              <span className="truncate max-w-[220px] sm:max-w-none">{activeHoliday.name} — {activeHoliday.note}</span>
              <button onClick={() => setShowHolidayBanner(false)} className="hover:text-slate-300 transition-colors">
                <Icons.Close size={11} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}