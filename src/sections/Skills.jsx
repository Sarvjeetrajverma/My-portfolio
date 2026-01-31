import React from 'react';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaGitAlt } from "react-icons/fa";
import { SiTailwindcss, SiMongodb, SiExpress, SiRedux, SiTypescript, SiNextdotjs } from "react-icons/si";
import { motion } from "framer-motion";

const skills = [
  { name: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
  { name: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
  { name: "JavaScript", icon: <FaJs className="text-yellow-400" /> },
  { name: "TypeScript", icon: <SiTypescript className="text-blue-600" /> },
  { name: "React", icon: <FaReact className="text-cyan-400" /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
  { name: "Redux", icon: <SiRedux className="text-purple-500" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-300" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
  { name: "Express.js", icon: <SiExpress className="text-white" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-green-400" /> },
  { name: "Git", icon: <FaGitAlt className="text-red-500" /> },
];

const Skills = () => {
  return (
    <section id="skills" className="w-full py-20 bg-gray-900 text-white">
      <div className="max-w-[1240px] mx-auto px-4 flex flex-col justify-center h-full">
        <div className="text-center mb-12">
          <p className="text-teal-400 font-bold uppercase tracking-wider">Skills</p>
          <h2 className="text-3xl md:text-4xl font-bold py-4">What I Can Do</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="p-6 shadow-xl rounded-xl hover:scale-105 ease-in duration-300 bg-gray-800 flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-teal-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl">
                {skill.icon}
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold">{skill.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills
