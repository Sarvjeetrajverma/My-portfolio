// ----------------------------------------------------------------------
// AUTOMATIC IMAGE IMPORT
// This automatically imports all images from src/assets/travel/
// ----------------------------------------------------------------------

const images = import.meta.glob('../assets/travel/*.{png,jpg,jpeg,svg,webp}', { eager: true });

const getImage = (filename) => {
    return images[`../assets/travel/${filename}`]?.default || '';
};

/**
 * Helper to easily add a photo without writing boilerplate.
 * @param {string} file - Filename in src/assets/travel/
 * @param {string} location - Location name
 * @param {string} date - Date string
 * @param {string} caption - Photo description
 */
const p = (file, location, date, caption) => ({
    id: file.replace(/[^a-zA-Z0-9]/g, ''),
    url: getImage(file),
    location: location || '',
    date: date || '',
    caption: caption || ''
});

export const travelData = [
    {
        id: 'sikkim-march-2025',
        title: "Sikkim, India",
        date: "March 2025",
        description: "Frozen lakes, white peaks, and endless adventures.",
        coverImage: getImage('guru2.jpeg'),
        photos: [
            p('gangtok1.jpeg', 'MG Marg, Gangtok', 'March 1, 2025', 'Strolling through the vibrant heart of Gangtok at MG Marg.'),
            p('gangtok2.jpeg', 'Rumtek Monastery', 'March 1, 2025', 'Finding peace amidst the intricate architecture of Rumtek.'),
            p('gangtok3.jpeg', 'Tashi View Point', 'March 1, 2025', 'Witnessing the majestic Kanchenjunga painted in morning gold.'),
            p('gangtok4.jpeg', 'Ganesh Tok', 'March 12, 2025', "A breathtaking bird's-eye view of Gangtok from Ganesh Tok."),
            p('gangtok5.jpeg', 'Hanuman Tok', 'March 12, 2025', 'Spiritual vibes and sweeping vistas at Hanuman Tok.'),
            p('gangtok6.jpeg', 'Local Market, Gangtok', 'March 1, 2025', 'Exploring the vibrant colors and flavors of Lal Bazaar.'),
            p('gangtok7.jpeg', 'MG Marg, Gangtok', 'March 1, 2025', 'MG Marg coming alive with shimmering lights at dusk.'),
            p('gangtok8.jpeg', 'Rumtek Monastery', 'March 1, 2025', 'Spinning prayer wheels, sending wishes into the mountain air.'),
            p('gangtok9.jpeg', 'Tashi View Point', 'March 1, 2025', 'Where the mountains meet the clouds: A view from Tashi.'),
            p('gangtok10.jpeg', 'Ganesh Tok', 'March 1, 2025', 'The urban charm of Gangtok amidst rolling green hills.'),
            p('gangtok11.jpeg', 'Hanuman Tok', 'March 12, 2025', 'High above the world, where silence speaks.'),
            p('guru1.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'The surreal turquoise waters of Gurudongmar at 17,800 ft.'),
            p('guru2.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'Mirror-like reflections of snow-capped giants.'),
            p('guru3.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'The raw, untouched beauty of the Tibetan Plateau.'),
            p('guru4.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'A splash of azure in a landscape of white and grey.'),
            p('guru5.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'Prayer flags dancing in the wind, carrying blessings.'),
            p('guru6.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'Icy shores of one of the highest lakes in the world.'),
            p('guru7.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'The stark, mesmerizing wilderness of North Sikkim.'),
            p('guru8.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'Breathing in the thin, crisp air of the Himalayas.'),
            p('guru9.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'Sunbeams glistening on the sacred waters.'),
            p('guru10.jpeg', 'Gurudongmar Lake', 'March 12, 2025', 'Standing in awe of the towering Himalayan sentinels.'),
            p('sikkim1.jpeg', 'Yumthang Valley', 'March 12, 2025', 'Stepping into the enchanting Valley of Flowers.'),
            p('sikkim2.jpeg', 'Yumthang Valley', 'March 12, 2025', 'The crystal-clear Yumthang River carving its path.'),
            p('sikkim.jpeg', 'Yumthang Valley', 'March 12, 2025', 'A winter wonderland of snow-dusted pines.'),
            p('sikkim4.jpeg', 'Yumthang Valley', 'March 12, 2025', 'Gentle yaks grazing in the high-altitude meadows.'),
            p('sikkim5.jpeg', 'Yumthang Valley', 'March 12, 2025', 'A riot of colors: Rhododendrons in full bloom.'),
            p('sikkim6.jpeg', 'Yumthang Valley', 'March 12, 2025', 'The winding road leading to the snowy realm of Zero Point.'),
            p('sikkim7.jpeg', 'Yumthang Valley', 'March 12, 2025', 'Mystical mists embracing the valley floor.'),
            p('sikkim8.jpeg', 'Yumthang Valley', 'March 12, 2025', "Nature's carpet: Wildflowers blooming in abundance."),
            p('sikkim9.jpeg', 'Yumthang Valley', 'March 12, 2025', 'Warmth in the wilderness: The natural hot springs.'),
            p('sikkim10.jpeg', 'Yumthang Valley', 'March 12, 2025', 'Listening to the soothing melody of the river.'),
            p('sikkim11.jpeg', 'Yumthang Valley', 'March 12, 2025', 'Pure, unadulterated nature at its finest.')
        ]
    },
    {
        id: 'jharkhand-january-2026',
        title: "Jharkhand, India",
        date: "January 2026",
        description: "Exploring the roof of Jharkhand at Parasnath and the cultural heart at Deoghar.",
        coverImage: getImage('prs1 (4).jpeg'),
        photos: [
            p('prs1 (1).jpeg', 'Parasnath Hill', 'Jan 15, 2026', 'The beginning of a sacred ascent up Parasnath Hill.'),
            p('prs1 (2).jpeg', 'Shikharji', 'Jan 15, 2026', 'Touching the sky: The breathtaking view from Shikharji.'),
            p('prs1 (3).jpeg', 'Madhuban', 'Jan 16, 2026', 'Wandering through the dense, serene Madhuban forests.'),
            p('prs1 (4).jpeg', 'Shikharji', 'Jan 15, 2026', 'A spiritual journey through the clouds.'),
            p('prs1 (5).jpeg', 'Shikharji', 'Jan 15, 2026', 'Ancient temples standing tall against the horizon.'),
            p('prs1 (6).jpeg', 'Shikharji', 'Jan 15, 2026', 'The peaceful aura of the Jain temples.'),
            p('prs1 (7).jpeg', 'Shikharji', 'Jan 15, 2026', 'Steps leading to salvation: The pilgrimage trail.'),
            p('prs1 (8).jpeg', 'Shikharji', 'Jan 15, 2026', 'Sunrise painting the hills in hues of orange.'),
            p('prs1 (9).jpeg', 'Shikharji', 'Jan 15, 2026', 'Mist veiling the sacred peaks.'),
            p('prs1 (10).jpeg', 'Shikharji', 'Jan 15, 2026', 'Devotion and nature intertwined.'),
            p('prs1 (11).jpeg', 'Shikharji', 'Jan 15, 2026', "A panoramic glimpse of Jharkhand's highest point."),
            p('prs1 (12).jpeg', 'Shikharji', 'Jan 15, 2026', 'Silence and serenity at the top.'),
            p('prs1 (14).jpeg', 'Shikharji', 'Jan 15, 2026', 'Architectural marvels on the mountain top.'),
            p('prs1 (15).jpeg', 'Shikharji', 'Jan 15, 2026', 'Where faith meets the mountains.'),
            p('prs1 (16).jpeg', 'Shikharji', 'Jan 15, 2026', 'The golden hour at Shikharji.'),
            p('prs1 (17).jpeg', 'Shikharji', 'Jan 15, 2026', 'Walking amidst the clouds.'),
            p('prs1 (18).jpeg', 'Shikharji', 'Jan 15, 2026', 'A journey of inner peace.'),
            p('prs1 (19).jpeg', 'Shikharji', 'Jan 15, 2026', 'The majestic view of the surrounding valleys.'),
            p('prs1 (20).jpeg', 'Shikharji', 'Jan 15, 2026', 'Sunset hues over the sacred hill.'),
            p('prs1 (21).jpeg', 'Shikharji', 'Jan 15, 2026', 'The final ascent: A test of faith and endurance.')
        ]
    },
    {
        id: 'varanasi-january-2026',
        title: "Uttar Pradesh, India",
        date: "June 2024",
        description: "An unforgettable journey through the rich heritage of Uttar Pradesh, right here in the holy city of Banaras.",
        coverImage: getImage('var (1).jpeg'),
        photos: [
            p('var (1).jpeg', 'Dashashwamedh Ghat', 'June 2024', "The timeless soul of India: Varanasi's ancient ghats."),
            p('var (3).jpeg', 'Assi Ghat', 'June 2024', 'Morning serenity: Boats drifting on the Ganges.'),
            p('var (4).jpeg', 'Assi Ghat', 'June 2024', 'The vibrant colors of the riverbank.'),
            p('var (5).jpeg', 'Assi Ghat', 'June 2024', 'A walk through the narrow, history-filled lanes.'),
            p('var (6).jpeg', 'Assi Ghat', 'June 2024', 'Sadhu on the ghats: A portrait of devotion.'),
            p('var (7).jpeg', 'Assi Ghat', 'June 2024', 'The architectural beauty of the riverside temples.'),
            p('var (8).jpeg', 'Assi Ghat', 'June 2024', 'Boats at bank of the ganga river.'),
            p('var (9).jpeg', 'Assi Ghat', 'June 2024', 'The architectural beauty of the riverside temples.'),
            p('var (10).jpeg', 'Assi Ghat', 'June 2024', 'Morning serenity: Boats drifting on the Ganges.'),
            p('var (11).jpeg', 'Assi Ghat', 'June 2024', 'The bustling energy of Dashashwamedh Ghat.'),
            p('var (12).jpeg', 'Assi Ghat', 'June 2024', 'The majestic view of boats at the Ganges at dusk.'),
            p('var (13).jpeg', 'Assi Ghat', 'June 2024', 'Ganga arti & The bustling energy of Dashashwamedh Ghat.'),
            p('var (14).jpeg', 'Assi Ghat', 'June 2024', 'Exploring the spiritual heart of Kashi.'),
            p('var (15).jpeg', 'Assi Ghat', 'June 2024', 'Exploring the spiritual heart of Kashi.')
        ]
    },
    {
        id: 'barabar',
        title: "Bihar, India",
        date: "June 2022",
        description: "An unforgettable journey through the rich heritage of Bihar, right here in the Barabar caves.",
        coverImage: getImage('barabar (15).jpeg'),
        photos: [
            p('barabar (1).jpeg', 'Barabar caves', 'June 2022', "The timeless soul of Barabar caves."),
            p('barabar (2).jpeg', 'Barabar caves', 'June 2022', 'Morning serenity: Boats drifting on the Barabar caves.'),
            p('barabar (3).jpeg', 'Barabar caves', 'June 2022', 'The vibrant colors of the Barabar caves.'),
            p('barabar (4).jpeg', 'Barabar caves', 'June 2022', 'A walk through the narrow, history-filled lanes.'),
            p('barabar (5).jpeg', 'Barabar caves', 'June 2022', 'Sadhu on the ghats: A portrait of devotion.'),
            p('barabar (6).jpeg', 'Barabar caves', 'June 2022', 'The architectural beauty of the Barabar caves.'),
            p('barabar (7).jpeg', 'Barabar caves', 'June 2022', 'Boats at bank of the Barabar caves.'),
            p('barabar (8).jpeg', 'Barabar caves', 'June 2022', 'The architectural beauty of the Barabar caves.'),
            p('barabar (9).jpeg', 'Barabar caves', 'June 2022', 'Morning serenity: Boats drifting on the Barabar caves.'),
            p('barabar (10).jpeg', 'Barabar caves', 'June 2022', 'The bustling energy of Barabar caves.'),
            p('barabar (11).jpeg', 'Barabar caves', 'June 2022', 'The majestic view of boats at the Barabar caves.'),
            p('barabar (12).jpeg', 'Barabar caves', 'June 2022', 'Ganga arti & The bustling energy of Barabar caves.'),
            p('barabar (13).jpeg', 'Barabar caves', 'June 2022', 'Exploring the spiritual heart of Barabar caves.'),
            p('barabar (14).jpeg', 'Barabar caves', 'June 2022', 'Exploring the spiritual heart of Barabar caves.')
        ]
    }
];