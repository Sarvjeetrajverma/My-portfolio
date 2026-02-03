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
            caption: "Walking down the famous MG Marg."
          },
          {
            id: 'gtk-2',
            url: getImage('gangtok2.jpeg') ,
            date: "march 1, 2025",
            location: "Rumtek Monastery",
            caption: "Peaceful vibes at Rumtek."
          },
          {
            id: 'gtk-3',
            url: getImage('gangtok3.jpeg') ,
            date: "march 1, 2025",
            location: "Tashi View Point",
            caption: "Sunrise over Kanchenjunga."
          },
          {
            id: 'gtk-4',
            url: getImage('gangtok4.jpeg') ,
            date: "march 12, 2025",
            location: "Ganesh Tok",
            caption: "A bird's eye view of Gangtok."
          },
          {
            id: 'gtk-5',
            url: getImage('gangtok5.jpeg') ,
            date: "march 12, 2025",
            location: "Hanuman Tok",
            caption: "Spiritual heights and city lights."
          },
          {
            id: 'gtk-6',
            url: getImage('gangtok6.jpeg') ,
            date: "march 1, 2025",
            location: "Local Market, Gangtok",
            caption: "Vibrant colors of the local market."
          },
          {
            id: 'gtk-7',
            url: getImage('gangtok7.jpeg') ,
            date: "march 1, 2025",
            location: "MG Marg, Gangtok",
            caption: "Walking down the famous MG Marg."
          },
          {
            id: 'gtk-8',
            url: getImage('gangtok8.jpeg') ,
            date: "march 1, 2025",
            location: "Rumtek Monastery",
            caption: "Peaceful vibes at Rumtek."
          },
          {
            id: 'gtk-9',
            url: getImage('gangtok9.jpeg') ,
            date: "march 1, 2025",
            location: "Tashi View Point",
            caption: "A bird's eye view of Gangtok."
          },
          {
            id: 'gtk-10',
            url: getImage('gangtok1.jpeg') ,
            location: "Ganesh Tok",
            caption: "A bird's eye view of Gangtok."
          },
          {
            id: 'gtk-11',
            url: getImage('gangtok1.jpeg') ,
            date: "march 12, 2025",
            location: "Hanuman Tok",
            caption: "Spiritual heights and city lights."
          }
        ]
      },
      {
        id: 'guru',
        name: "Gurudongmar Lake",
        description: "A glacial lake changing colors with the seasons.",
        photos: [
        
           {
            id: 'guru-2',
            url: getImage('guru1.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }, {
            id: 'guru-3',
            url: getImage('guru2.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }, {
            id: 'guru-4',
            url: getImage('guru3.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }, {
            id: 'guru-5',
            url: getImage('guru4.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }, {
            id: 'guru-6',
            url: getImage('guru5.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }, {
            id: 'guru-7',
            url: getImage('guru6.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }, {
            id: 'guru-8',
            url: getImage('guru7.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }, {
            id: 'guru-9',
            url: getImage('guru8.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }, {
            id: 'guru-10',
            url: getImage('guru9.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }, {
            id: 'guru-11',
            url: getImage('guru10.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          }
        ]
      },
      {
        id: 'tsomgo',
        name: "yumthang valley",
        description: "yumthang valley snowy and flowers valley ",
        photos: [
          {
            id: 'yum-1',
            url: getImage('sikkim1.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },{
            id: 'yum-1',
            url: getImage('sikkim2.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },
          {
            id: 'yum-2',
            url: getImage('sikkim3.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },{
            id: 'yum-3',
            url: getImage('sikkim4.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },{
            id: 'yum-4',
            url: getImage('sikkim5.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },{
            id: 'yum-5',
            url: getImage('sikkim6.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },
          {
            id: 'yum-6',
            url: getImage('sikkim7.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },{
            id: 'yum-7',
            url: getImage('sikkim8.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },{
            id: 'yum-8',
            url: getImage('sikkim9.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },
          {
            id: 'yum-9',
            url: getImage('sikkim10.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },{
            id: 'yum-10',
            url: getImage('sikkim11.jpeg') ,
            date: "march 12, 2025",
            location: "Tsomgo Lake",
            caption: "Frozen beauty of Tsomgo."
          },
        ] 
      }
      
    ]
  }
];