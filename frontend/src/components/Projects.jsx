import React from "react";
import { motion } from "framer-motion";
import ProjectsBoard from "./ProjectsBoard";

const Projects = () => {
  return (
    <motion.div
      className="min-h-screen font-sans antialiased text-white bg-[#0B0B23]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ProjectsBoard />
    </motion.div>
  );
};

export default Projects;
