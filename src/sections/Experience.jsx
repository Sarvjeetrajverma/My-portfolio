import React from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    role: "Full Stack Developer Intern",
    company: "Tech Startup (Remote)",
    period: "Jun 2023 - Aug 2023",
    description: [
      "Assisted in building responsive frontend components using React.js and Tailwind CSS.",
      "Collaborated with senior developers to fix bugs and optimize page load speeds.",
      "Learned version control best practices using Git and GitHub in a team environment.",
      "Participated in daily stand-ups and contributed to sprint planning discussions."
    ]
  },
  {
    role: "Freelance Web Developer",
    company: "Self-Employed",
    period: "2022 - Present",
    description: [
      "Designed and developed custom portfolio websites for local small businesses using HTML, CSS, and JavaScript.",
      "Implemented responsive designs ensuring compatibility across mobile and desktop devices.",
      "Managed client requirements and delivered projects within agreed timelines.",
      "Gained hands-on experience with hosting platforms like Vercel and Netlify."
    ]
  },
  {
    role: "Open Source Contributor",
    company: "GitHub Community",
    period: "2021 - Present",
    description: [
      "Contributed documentation updates and minor bug fixes to popular open-source React libraries.",
      "Engaged with the developer community to learn coding standards and best practices.",
      "Built and shared personal projects on GitHub, receiving feedback and stars from peers.",
      "Participated in Hacktoberfest, completing challenges and improving coding skills."
    ]
  }
];

const Experience = () => {
  return (
    <section id="experience" className="w-full py-20 bg-gray-800 text-white">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-teal-400 font-bold uppercase tracking-wider">My Journey</p>
          <h2 className="text-3xl md:text-4xl font-bold py-4">Experience</h2>
        </div>

        <div className="flex flex-col gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900 p-6 rounded-xl shadow-xl border-l-4 border-teal-400 hover:bg-gray-700 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                  <p className="text-teal-400 font-semibold text-lg">{exp.company}</p>
                </div>
                <span className="text-gray-400 italic mt-2 md:mt-0 bg-gray-800 px-3 py-1 rounded-full text-sm border border-gray-700">
                  {exp.period}
                </span>
              </div>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {exp.description.map((desc, i) => (
                  <li key={i} className="leading-relaxed">{desc}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
