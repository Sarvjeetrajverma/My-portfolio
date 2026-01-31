import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const projects = [
  {
    title: "Task Manager App",
    description: "A full-stack Todo application allowing users to create, read, update, and delete tasks. Features user authentication and task categorization.",
    tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    github: "https://github.com",
    demo: "https://netlify.com",
    image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1032&q=80"
  },
  {
    title: "Weather Dashboard",
    description: "A responsive weather application that fetches real-time weather data using the OpenWeatherMap API. Displays current conditions and a 5-day forecast.",
    tech: ["React", "OpenWeatherMap API", "CSS3"],
    github: "https://github.com",
    demo: "https://netlify.com",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  {
    title: "Personal Blog Platform",
    description: "A dynamic blog site where I share my learning journey. Includes a markdown editor for writing posts and a comment section for engagement.",
    tech: ["Next.js", "Firebase", "Markdown"],
    github: "https://github.com",
    demo: "https://netlify.com",
    image: "/src/assets/project1.png"
  },
  {
    title: "E-commerce Starter",
    description: "A simple e-commerce frontend with product listing, filtering, and a shopping cart functionality using React Context API.",
    tech: ["React", "Context API", "Styled Components"],
    github: "https://github.com",
    demo: "https://netlify.com",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80"
  }
];

const Projects = () => {
  return (
    <section id="projects" className="w-full py-20 bg-gray-900 text-white">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-teal-400 font-bold uppercase tracking-wider">Portfolio</p>
          <h2 className="text-3xl md:text-4xl font-bold py-4">My Projects</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-teal-500/20 transition-all duration-300 border border-gray-700"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="text-xs bg-gray-700 text-teal-400 px-3 py-1 rounded-full border border-gray-600">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-teal-500 text-white rounded-lg transition-colors duration-300 text-sm font-semibold"
                  >
                    <FaGithub size={18} /> Code
                  </a>
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-teal-500 text-white rounded-lg transition-colors duration-300 text-sm font-semibold"
                  >
                    <FaExternalLinkAlt size={16} /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
