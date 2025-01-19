import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Home = ({ language }) => {
  const fadeInUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="min-h-[calc(100vh-8rem)] flex flex-col justify-center" id="home">
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-40 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <motion.div
          variants={fadeInUpVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400 text-lg font-medium mb-4 block">
            {language === 'en' ? "Hello, I'm" : "Bonjour, je suis"}
          </span>
        </motion.div>

        <motion.h2 
          className="text-6xl font-bold mb-8"
          variants={fadeInUpVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {language === 'en' ? (
            <>
              Software Engineer<br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Creating Digital Solutions
              </span>
            </>
          ) : (
            <>
              Ingénieur Logiciel<br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Créant des Solutions Digitales
              </span>
            </>
          )}
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-400 max-w-2xl mb-12"
          variants={fadeInUpVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {language === 'en' 
            ? "Transforming complex problems into elegant solutions through innovative software engineering. Currently seeking a PFE internship opportunity in France."
            : "Transformer des problèmes complexes en solutions élégantes par l'ingénierie logicielle innovante. Actuellement à la recherche d'un stage PFE en France."}
        </motion.p>

        <motion.div 
          className="flex gap-6"
          variants={fadeInUpVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button 
            onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors"
          >
            {language === 'en' ? "View Projects" : "Voir les Projets"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-xl border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
          >
            {language === 'en' ? "Contact Me" : "Me Contacter"}
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <motion.div 
            className="w-1 h-1.5 bg-purple-400 rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
