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
  { icon: FaXTwitter, label: "X", link: "https://twitter.com/itssarvjeet", color: "#aeeea2" },
  { icon: FaLinkedinIn, label: "LinkedIn", link: "https://www.linkedin.com/in/sarvjeetrajverma/", color: "#0ea5e9" },
  { icon: FaGithub, label: "GitHub", link: "https://www.github.com/sarvjeetrajverma", color: "#dfefba" },
  { icon: FaInstagram, label: "Instagram", link: "https://www.instagram.com/sarvjeetrajverma", color: "#e55c87" }
];

const sectionVariants = {
  initial: { opacity: 0, scale: 0.97, y: 24 },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" }
  }
};

const textBlockVariants = {
  initial: { opacity: 0, x: -40 },
  enter: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut", delay: 0.2 }
  }
};

const rightSideVariants = {
  initial: { opacity: 0, x: 40, rotateX: -15, rotateY: 15 },
  enter: {
    opacity: 1,
    x: 0,
    rotateX: 0,
    rotateY: 0,
    transition: { duration: 1.0, ease: "easeOut", delay: 0.3 }
  }
};

const particleData = [...Array(8)].map(() => ({
  top: 25 + Math.random() * 50,
  left: 25 + Math.random() * 50,
  duration: 3 + Math.random() * 3
}));

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
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
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

  const [prefersReducedMotion, setPrm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrm(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Mouse Movement Logic for Name Animation ---
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth);
    mouseY.set(clientY / innerHeight);
  };

  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const nameX = useTransform(springX, [0, 1], [-20, 20]);
  const nameY = useTransform(springY, [0, 1], [-20, 20]);
  const nameRotateX = useTransform(springY, [0, 1], [10, -10]);
  const nameRotateY = useTransform(springX, [0, 1], [-10, 10]);

  // --- Canvas Logic ---
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    if (isMobile || prefersReducedMotion) {
      dpr = Math.min(dpr, 1);
    } else {
      dpr = Math.min(dpr, 1.75);
    }

    let width = (canvas.width = canvas.clientWidth * dpr);
    let height = (canvas.height = canvas.clientHeight * dpr);

    const layers = isMobile || prefersReducedMotion
      ? [
          { count: 15, speed: 0.02, size: [0.7, 1.0], color: "rgba(248,250,252,0.3)" },
          { count: 10, speed: 0.03, size: [1.0, 1.5], color: "rgba(129,140,248,0.3)" }
        ]
      : [
          { count: 35, speed: 0.03, size: [0.7, 1.3], color: "rgba(248,250,252,0.4)" },
          { count: 20, speed: 0.05, size: [1.0, 2.0], color: "rgba(129,140,248,0.45)" }
        ];

    const stars = [];

    layers.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.6 + 0.4,
          r: (Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0]) * dpr,
          baseAlpha: Math.random() * 0.3 + 0.2,
          twinkle: Math.random() * 0.004 + 0.001,
          layer: li
        });
      }
    });

    const onResize = () => {
      let newDpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      newDpr = Math.min(newDpr, 1.75);
      dpr = newDpr;
      width = (canvas.width = canvas.clientWidth * dpr);
      height = (canvas.height = canvas.clientHeight * dpr);
    };
    window.addEventListener("resize", onResize);

    const onCanvasMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = (e.clientX - rect.left) / rect.width;
      pointerRef.current.y = (e.clientY - rect.top) / rect.height;
    };
    canvas.addEventListener("pointermove", onCanvasMove);

    let last = performance.now();

    const render = (now) => {
      const dt = Math.min(40, now - last);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const centerX = width / 2;
      const centerY = height / 2;
      const warpIntensity = prefersReducedMotion ? 0.06 : 0.22;
      const pointerShiftX = (pointerRef.current.x - 0.5) * 20 * dpr;
      const pointerShiftY = (pointerRef.current.y - 0.5) * 20 * dpr;

      layers.forEach((layer, li) => {
        ctx.fillStyle = layer.color;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          if (s.layer !== li) continue;
          const dirX = s.x - centerX;
          const dirY = s.y - centerY;
          const dist = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
          const normX = dirX / dist;
          const normY = dirY / dist;

          s.x += normX * layer.speed * dt * warpIntensity;
          s.y += normY * layer.speed * dt * warpIntensity;

          if (s.x < -40 || s.x > width + 40 || s.y < -40 || s.y > height + 40) {
            s.x = centerX + (Math.random() - 0.5) * 80;
            s.y = centerY + (Math.random() - 0.5) * 80;
            s.z = Math.random() * 0.6 + 0.4;
          }

          const twinkleAlpha = s.baseAlpha + Math.sin(now * s.twinkle + i) * 0.16 * (li + 1);
          const screenX = (s.x + pointerShiftX * (1 - s.z)) / dpr;
          const screenY = (s.y + pointerShiftY * (1 - s.z)) / dpr;

          ctx.beginPath();
          ctx.globalAlpha = Math.max(0.04, Math.min(0.55, twinkleAlpha));
          ctx.arc(screenX, screenY, (s.r / dpr) * s.z, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });

      ctx.restore();
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onCanvasMove);
    };
  }, [prefersReducedMotion, isMobile]);

  return (
    <motion.section
      id="home"
      onMouseMove={onMouseMove}
      className="relative w-full overflow-hidden bg-transparent text-white flex items-center lg:min-h-screen perspective-[1000px] pt-24"
      variants={sectionVariants}
      initial="initial"
      animate="enter"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10 lg:py-0 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
        
        {/* TEXT SIDE */}
        <motion.div
          className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left"
          variants={textBlockVariants}
        >
          {/* --- COMPACT RESPONSIVE HOLIDAY BANNER --- */}
          <AnimatePresence>
            {activeHoliday && showHolidayBanner && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mb-5 w-full max-w-sm mx-auto lg:mx-0 rounded-xl relative overflow-hidden shadow-lg border border-white/10 group bg-slate-900/50 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 p-3">
                  
                  {/* Icon / Logo Area */}
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-sky-400/20 to-indigo-500/20 border border-sky-300/20 shrink-0 text-xl shadow-inner">
                    <motion.span 
                      animate={{ rotate: [0, 8, -8, 0] }} 
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                      {activeHoliday.icon}
                    </motion.span>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {activeHoliday.name}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-2 pr-1">
                      {activeHoliday.note}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowHolidayBanner(false)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 self-start"
                    aria-label="Dismiss banner"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="inline-flex items-center justify-center lg:justify-start px-3 py-1 mb-4 rounded-full border border-cyan-400/20 bg-cyan-500/5 backdrop-blur-md gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400/90 animate-pulse" />
            <span className="text-cyan-100 font-mono text-[11px] tracking-[0.28em]">
              {roles[index].substring(0, subindex)}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 tracking-tight perspective-[500px]">
            <span className="block text-slate-100 text-lg sm:text-2xl font-light mb-1">
              Hello, I'm
            </span>
            <motion.span
              style={{ 
                x: nameX, 
                y: nameY,
                rotateX: nameRotateX,
                rotateY: nameRotateY,
                transformStyle: "preserve-3d"
              }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-50 via-cyan-200 to-indigo-200 drop-shadow-[0_0_14px_rgba(34,211,238,0.3)] cursor-default inline-block"
            >
              Sarvjeet Raj Verma
            </motion.span>
          </h1>

          <p className="text-slate-50/80 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
            Crafting immersive web universes where clean engineering meets
            cinematic experiences. Constellations of components, galaxies
            of micro‑interactions, and one seamless digital journey.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-7">
            <motion.a
              href="#projects"
              className="relative inline-flex items-center justify-center px-7 py-3 rounded-full bg-sky-100/85 text-slate-900 text-sm sm:text-base font-semibold shadow-[0_0_14px_rgba(56,189,248,0.35)] overflow-hidden"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">View Projects</span>
              <span className="pointer-events-none absolute inset-[1px] rounded-full bg-gradient-to-r from-sky-200 via-cyan-100 to-amber-100 opacity-55" />
            </motion.a>

            <motion.a
              href="/sarvjeetrajverma_resume.pdf"
              download="SarvjeetRajVerma_Resume.pdf"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-slate-200/60 text-slate-100 text-sm sm:text-base bg-slate-900/20 hover:bg-slate-900/45 backdrop-blur-md transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <span>Download Resume</span>
              <span className="text-lg leading-none">↓</span>
            </motion.a>
          </div>

          <div className="flex gap-5 justify-center lg:justify-start">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="relative text-2xl text-slate-200 hover:text-white transition-colors"
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -8, 0] 
                }}
                transition={{ 
                  opacity: { delay: 0.5 + i * 0.1, duration: 0.4 },
                  y: { 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.4 
                  }
                }}
                whileHover={{
                  scale: 1.25,
                  color: s.color,
                  y: -5,
                  textShadow: "0 0 14px rgba(248,250,252,0.9)",
                  transition: { duration: 0.2, y: { duration: 0.2, repeat: 0 } }
                }}
              >
                <s.icon />
                <span className="sr-only">{s.label}</span>
              </motion.a>
            ))}
          </div>

          {/* --- MODERN INDIAN TECH CLOCK & DATE --- */}
          <motion.div 
            className="mt-10 inline-flex flex-col lg:items-start w-full select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="relative px-6 py-5 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden group w-full max-w-md mx-auto lg:mx-0">
              
              {/* Subtle Tricolor Top Glow (Saffron, White, Green) */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-slate-100 to-green-500 opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              
              {/* Ashoka Chakra Blue Ambient Glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
                
                {/* Greeting & Timezone */}
                <div className="flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-semibold text-orange-400 drop-shadow-md">नमस्ते</span>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">| NAMASTE</span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-4xl sm:text-5xl font-light text-slate-100 tracking-tight leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      {hours}<span className="text-orange-400 animate-pulse">:</span>{minutes}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-green-400 leading-none drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{seconds}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                        {ampm}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider (Hidden on Mobile) */}
                <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-slate-600 to-transparent mt-2"></div>
                {/* Horizontal Divider (Mobile Only) */}
                <div className="block sm:hidden w-3/4 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-1"></div>

                {/* Data & Location Readouts */}
                <div className="flex flex-col justify-center font-mono text-[10px] text-slate-400 tracking-widest space-y-2.5 mt-2 sm:mt-1">
                  
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 w-10 text-right sm:text-left">तिथि:</span>
                    <span className="text-slate-200 font-semibold bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">{dateStr}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 w-10 text-right sm:text-left">ZONE:</span>
                    <span className="text-blue-400 font-bold flex items-center gap-2">
                      IST (UTC+5:30)
                      {/* Rotating "Chakra" Hologram Effect */}
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="w-3 h-3 rounded-full border-[1.5px] border-blue-500 border-t-transparent shadow-[0_0_5px_rgba(59,130,246,0.6)]"
                      />
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 w-10 text-right sm:text-left">BASE:</span>
                    <span className="text-orange-300 font-bold flex items-center gap-1 drop-shadow-[0_0_5px_rgba(253,186,116,0.4)]">
                      INDIA 🇮🇳
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* VISUAL SIDE */}
        <motion.div
          className="order-1 lg:order-2 relative h-[260px] sm:h-[320px] lg:h-[480px] flex items-center justify-center"
          variants={rightSideVariants}
        >
          <div className="relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] lg:w-[340px] lg:h-[340px]">
            <motion.div
              className="absolute inset-[-10%] rounded-full border border-sky-400/15"
              style={{ boxShadow: "0 0 16px rgba(56,189,248,0.25)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="absolute inset-[4%] rounded-full border border-indigo-400/18 border-dashed"
              animate={{ rotate: -360 }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="absolute inset-[20%] rounded-full border border-slate-500/18"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
              <span className="absolute -right-1 top-1/3 -translate-y-1/2 h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(244,114,182,0.7)]" />
            </motion.div>

            <motion.div
              className="absolute inset-[24%] rounded-[36%] bg-gradient-to-br from-cyan-400/60 via-sky-300/50 to-indigo-500/60"
              animate={{
                borderRadius: [
                  "40% 60% 55% 45% / 40% 40% 60% 60%",
                  "70% 30% 50% 50% / 40% 70% 30% 60%",
                  "45% 55% 40% 60% / 65% 35% 55% 35%"
                ],
                rotate: [0, 8, -6, 0],
                boxShadow: [
                  "0 0 24px rgba(56,189,248,0.45)",
                  "0 0 30px rgba(129,140,248,0.55)",
                  "0 0 26px rgba(56,189,248,0.5)"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(248,250,252,0.5),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.6),transparent_60%)] mix-blend-screen" />
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-1/2 w-[150px] sm:w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-950/55 border border-slate-500/30 shadow-[0_12px_26px_rgba(15,23,42,0.75)] flex flex-col items-center justify-center gap-1 py-4 backdrop-blur-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-12 w-12 rounded-full bg-slate-900/70 flex items-center justify-center text-3xl shadow-[0_0_12px_rgba(56,189,248,0.6)]">
                👨‍💻
              </div>
              <div className="mt-1 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-100">
                  Portfolio
                </p>
                <p className="text-sm font-semibold text-sky-100">
                  Sarvjeet
                </p>
              </div>
            </motion.div>

            {particleData.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-sky-300/70"
                style={{
                  top: `${particle.top}%`,
                  left: `${particle.left}%`,
                  boxShadow: "0 0 8px rgba(56,189,248,0.75)"
                }}
                animate={{
                  y: [0, -5, 0],
                  x: [0, i % 2 === 0 ? 6 : -6, 0],
                  opacity: [0.18, 0.7, 0.18]
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}