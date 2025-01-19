const Projects = ({ language }) => {
    return (
      <section id="projects" className="min-h-screen flex justify-center items-center">
        <h1 className="text-4xl">{language === 'en' ? 'Projects Section' : 'Section Projets'}</h1>
      </section>
    );
  };
  
  export default Projects;
  