

export default function Home() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen bg-transparent text-white flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/stars-bg.jpg')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark/Color overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        {/* Left (Text) */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Hi, I’m <span className="text-purple-400">Yahia</span>
          </h1>
          <p className="leading-relaxed text-gray-200">
            I’m a third-year engineering student at IMT Atlantique specializing in software development,
            seeking a 6-month final-year internship starting April or May 2025. I’m passionate about web development,
            machine learning, game development, and just building innovative software.
          </p>
          {/* Example Button or CTA */}
          <div>
            <a
              href="contact"
              className="inline-block bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-3 rounded-full text-white font-semibold"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right (Photo) */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/yahia.jpg" // Replace with your actual file name in /public
            alt="Yahia Profile"
            className="w-72 h-72 object-cover rounded-full border-4 border-purple-400 shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
