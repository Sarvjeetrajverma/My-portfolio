// ----------------------------------------------------------------------
// AUTOMATIC IMAGE IMPORT
// This automatically imports all images from src/assets/travel/
// ----------------------------------------------------------------------

// Load all images (Vite specific).
const images = import.meta.glob('../assets/travel/*.{png,jpg,jpeg,svg,webp}', { eager: true });

const getImage = (filename) => {
return images[`../assets/travel/${filename}`]?.default;
};

export const travelData = [
{
 id: 'sikkim-march-2025',
title: "Sikkim, India",
date: "March 2025",
coordinates: [88.6138, 27.3314],
description: "A amazing journey through the snowy peaks and amazing culture of Sikkim.",
coverImage: getImage('guru2.jpeg') ,

destinations: [
{
id: 'gangtok',
name: "Gangtok",
description: "The bustling capital city nestled in the clouds.",
photos: [
{
id: 'gtk-1',
url: getImage('gangtok1.jpeg') ,
date: "march 1, 2025",
location: "MG Marg, Gangtok",
caption: "Strolling through the vibrant heart of Gangtok at MG Marg."
},
{
id: 'gtk-2',
url: getImage('gangtok2.jpeg') ,
date: "march 1, 2025",
location: "Rumtek Monastery",
caption: "Finding peace amidst the intricate architecture of Rumtek."
},
{
id: 'gtk-3',
url: getImage('gangtok3.jpeg') ,
date: "march 1, 2025",
location: "Tashi View Point",
caption: "Witnessing the majestic Kanchenjunga painted in morning gold."
},
{
id: 'gtk-4',
url: getImage('gangtok4.jpeg') ,
date: "march 12, 2025",
location: "Ganesh Tok",
caption: "A breathtaking bird's-eye view of Gangtok from Ganesh Tok."
},
{
id: 'gtk-5',
url: getImage('gangtok5.jpeg') ,
date: "march 12, 2025",
location: "Hanuman Tok",
caption: "Spiritual vibes and sweeping vistas at Hanuman Tok."
},
{
id: 'gtk-6',
url: getImage('gangtok6.jpeg') ,
date: "march 1, 2025",
location: "Local Market, Gangtok",
caption: "Exploring the vibrant colors and flavors of Lal Bazaar."
},
{
id: 'gtk-7',
url: getImage('gangtok7.jpeg') ,
date: "march 1, 2025",
location: "MG Marg, Gangtok",
caption: "MG Marg coming alive with shimmering lights at dusk."
},
{
id: 'gtk-8',
url: getImage('gangtok8.jpeg') ,
date: "march 1, 2025",
location: "Rumtek Monastery",
caption: "Spinning prayer wheels, sending wishes into the mountain air."
},
{
id: 'gtk-9',
url: getImage('gangtok9.jpeg') ,
date: "march 1, 2025",
location: "Tashi View Point",
caption: "Where the mountains meet the clouds: A view from Tashi."
},
{
id: 'gtk-10',
url: getImage('gangtok10.jpeg') ,
location: "Ganesh Tok",
caption: "The urban charm of Gangtok amidst rolling green hills."
},
{
id: 'gtk-11',
url: getImage('gangtok11.jpeg') ,
date: "march 12, 2025",
location: "Hanuman Tok",
caption: "High above the world, where silence speaks."
}
]
},
{
id: 'guru',
name: "Gurudongmar Lake",
description: "A glacial lake changing colors with the seasons.",
photos: [

{
id: 'guru-1',
url: getImage('guru1.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "The surreal turquoise waters of Gurudongmar at 17,800 ft."
}, {
id: 'guru-2',
url: getImage('guru2.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "Mirror-like reflections of snow-capped giants."
}, {
id: 'guru-3',
url: getImage('guru3.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "The raw, untouched beauty of the Tibetan Plateau."
}, {
id: 'guru-4',
url: getImage('guru4.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "A splash of azure in a landscape of white and grey."
}, {
id: 'guru-5',
url: getImage('guru5.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "Prayer flags dancing in the wind, carrying blessings."
}, {
id: 'guru-6',
url: getImage('guru6.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "Icy shores of one of the highest lakes in the world."
}, {
id: 'guru-7',
url: getImage('guru7.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "The stark, mesmerizing wilderness of North Sikkim."
}, {
id: 'guru-8',
url: getImage('guru8.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "Breathing in the thin, crisp air of the Himalayas."
}, {
id: 'guru-9',
url: getImage('guru9.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "Sunbeams glistening on the sacred waters."
}, {
id: 'guru-10',
url: getImage('guru10.jpeg') ,
date: "march 12, 2025",
location: "Gurudongmar Lake",
caption: "Standing in awe of the towering Himalayan sentinels."
}
]
},
{
id: 'yumth',
name: "yumthang valley",
description: "yumthang valley snowy and flowers valley ",
photos: [
{
id: 'yum-1',
url: getImage('sikkim1.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "Stepping into the enchanting Valley of Flowers."
},{
id: 'yum-2',
url: getImage('sikkim2.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "The crystal-clear Yumthang River carving its path."
},
{
id: 'yum-3',
url: getImage('sikkim.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "A winter wonderland of snow-dusted pines."
},{
id: 'yum-4',
url: getImage('sikkim4.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "Gentle yaks grazing in the high-altitude meadows."
},{
id: 'yum-5',
url: getImage('sikkim5.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "A riot of colors: Rhododendrons in full bloom."
},{
id: 'yum-6',
url: getImage('sikkim6.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "The winding road leading to the snowy realm of Zero Point."
},
{
id: 'yum-7',
url: getImage('sikkim7.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "Mystical mists embracing the valley floor."
},{
id: 'yum-8',
url: getImage('sikkim8.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "Nature's carpet: Wildflowers blooming in abundance."
},{
id: 'yum-9',
url: getImage('sikkim9.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "Warmth in the wilderness: The natural hot springs."
},
{
id: 'yum-10',
url: getImage('sikkim10.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "Listening to the soothing melody of the river."
},{
id: 'yum-11',
url: getImage('sikkim11.jpeg') ,
date: "march 12, 2025",
location: "Yumthang Valley",
caption: "Pure, unadulterated nature at its finest."
},
] 
}
]
},
{
id: 'jharkhand-january-2026',
title: "Jharkhand, India",
date: "January 2026",
coordinates: [86.1285, 23.9556],
description: "A amazing journey through the snowy peaks and amazing culture of Jharkhand.",
coverImage: getImage('prs1 (4).jpeg'),
destinations: [
{
id: 'parasnath-hill',
name: "Parasnath Hill",
description: "The highest mountain peak in the state of Jharkhand, and a major Jain pilgrimage site.",
photos: [
{
id: 'pn-1',
url: getImage('prs1 (1).jpeg') ,
location: " Hill",
caption: "The beginning of a sacred ascent up Parasnath Hill."
},
{
id: 'pn-2',
url: getImage('prs1 (2).jpeg'),
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Touching the sky: The breathtaking view from Shikharji."
},
{
id: 'pn-3',
url: getImage('prs1 (3).jpeg') ,
date: "Jan 16, 2026",
location: "Madhuban",
caption: "Wandering through the dense, serene Madhuban forests."
},
{
id: 'pn-4',
url: getImage('prs1 (4).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "A spiritual journey through the clouds."
},{
id: 'pn-5',
url: getImage('prs1 (5).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Ancient temples standing tall against the horizon."
},{
id: 'pn-6',
url: getImage('prs1 (6).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "The peaceful aura of the Jain temples."
},{
id: 'pn-7',
url: getImage('prs1 (7).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Steps leading to salvation: The pilgrimage trail."
},{
id: 'pn-8',
url: getImage('prs1 (8).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Sunrise painting the hills in hues of orange."
},{
id: 'pn-9',
url: getImage('prs1 (9).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Mist veiling the sacred peaks."
},{
id: 'pn-10',
url: getImage('prs1 (10).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Devotion and nature intertwined."
},{
id: 'pn-11',
url: getImage('prs1 (11).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "A panoramic glimpse of Jharkhand's highest point."
},{
id: 'pn-12',
url: getImage('prs1 (12).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Silence and serenity at the top."
},{
id: 'pn-13',
url: getImage('prs1 (1).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "The sacred path traveled by millions."
},{
id: 'pn-14',
url: getImage('prs1 (14).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Architectural marvels on the mountain top."
},{
id: 'pn-15',
url: getImage('prs1 (15).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Where faith meets the mountains."
},{
id: 'pn-16',
url: getImage('prs1 (16).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "The golden hour at Shikharji."
},{
id: 'pn-17',
url: getImage('prs1 (17).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Walking amidst the clouds."
},{
id: 'pn-18',
url: getImage('prs1 (18).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "A journey of inner peace."
},{
id: 'pn-19',
url: getImage('prs1 (19).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "The majestic view of the surrounding valleys."
},{
id: 'pn-20',
url: getImage('prs1 (20).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "Sunset hues over the sacred hill."
},{
id: 'pn-21',
url: getImage('prs1 (21).jpeg') ,
date: "Jan 15, 2026",
location: "Shikharji",
caption: "The final ascent: A test of faith and endurance."
},
]
}
]
},
{
id: 'varanasi-january-2026',
title: "Uttarpardesh, India",
date: "june 2024",
coordinates: [82.9739, 25.3176],
description: "A amazing journey through the snowy peaks and amazing culture of U.P.",
coverImage: getImage('var (1).jpeg'),
destinations: [
{
id: 'varanasi',
name: "Varanasi",
description: "The highest mountain peak in the state of Jharkhand, and a major Jain pilgrimage site.",
photos: [
{
id: 'vn-1',
url: getImage('var (1).jpeg') ,
date: "Jan 15, 2026",
location: "Dashashwamedh Ghat",
caption: "The timeless soul of India: Varanasi's ancient ghats."
},
{
id: 'vn-2',
url: getImage('var (3).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "Morning serenity: Boats drifting on the Ganges."
},
{
id: 'vn-3',
url: getImage('var (4).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "The vibrant colors of the riverbank."
},{
id: 'vn-4',
url: getImage('var (5).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "A walk through the narrow, history-filled lanes."
},{
id: 'vn-5',
url: getImage('var (6).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "Sadhu on the ghats: A portrait of devotion."
},{
id: 'vn-6',
url: getImage('var (7).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "The architectural beauty of the riverside temples."
},{
id: 'vn-7',
url: getImage('var (8).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "boats at bank of the ganga river."
},{
id: 'vn-8',
url: getImage('var (9).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "The architectural beauty of the riverside temples."
},{
id: 'vn-9',
url: getImage('var (10).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "Morning serenity: Boats drifting on the Ganges."
},{
id: 'vn-10',
url: getImage('var (11).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "The bustling energy of Dashashwamedh Ghat."
},
{
id: 'vn-11',
url: getImage('var (12).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "The majestic view of boats at the Ganges at dusk."
},{
id: 'vn-12',
url: getImage('var (13).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "ganga arti & The bustling energy of Dashashwamedh Ghat."
},{
id: 'vn-13',
url: getImage('var (14).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "Exploring the spiritual heart of Kashi."
},{
id: 'vn-14',
url: getImage('var (15).jpeg') ,
date: "Jan 16, 2026",
location: "Assi Ghat",
caption: "Exploring the spiritual heart of Kashi."
},
]
}
]
}

];