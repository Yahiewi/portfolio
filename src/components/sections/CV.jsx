const CV = ({ language }) => {
    return (
      <section id="CV" className="min-h-screen flex justify-center items-center">
        <h1 className="text-4xl">{language === 'en' ? 'CV Section' : 'Section CV'}</h1>
      </section>
    );
  };
  
  export default CV;