const Home = () => {
    return (    
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-screen w-full">
  <h1 className="mb-2 text-[2rem] md:text-[4rem]" style={{ color: '#262626' }}>
    Maya Built for Voice AI
  </h1>
  <p className="mb-4 text-base md:text-lg text-[var(--greige)] max-w-[28ch] md:max-w-2xl">
    One API to connect your products to Great Voices
  </p>
  <div className="mb-6">
    <a
      href="/dashboard/text-to-speech"
      rel="noopener noreferrer"
      className="inline-block px-6 py-3 text-white rounded-full font-medium transition-colors duration-200"
      style={{ backgroundColor: '#262626' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
    >
      Try Api Now
    </a>
  </div>
  <div
    className="w-full mx-auto mb-8"
    style={{
      width: "min(38rem, -2rem + 100vw)",
      maxWidth: "min(38rem, -2rem + 100vw)"
    }}
  />
</div>

    )
}

export default Home;