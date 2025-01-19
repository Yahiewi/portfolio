const Contact = ({ language }) => {
    return (
      <section id="Contact" className="min-h-screen flex justify-center items-center">
        <h1 className="text-4xl">{language === 'en' ? 'Contact Section' : 'Section Contact'}</h1>
      </section>
    );
  };
  
  export default Contact;
  