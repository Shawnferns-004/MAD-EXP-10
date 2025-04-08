import React, { useEffect } from 'react';
import { AlertCircle, FileText, Phone, Shield, Users, Clock, Heart, Laptop, MapPin, MessageSquare, Star } from 'lucide-react';

function App() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header 
        className="relative py-32 text-white scroll-animate parallax"
        style={{
          backgroundImage: 'linear-gradient(rgba(23, 37, 84, 0.9), rgba(23, 37, 84, 0.85)), url("https://res.cloudinary.com/dc8e6gchd/image/upload/v1743233900/Fire-safety-in-India-1_vkxlty.jpg")'
        }}
      >
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <h1 className="text-6xl font-bold text-center mb-6 tracking-tight">Emergency Response Unit</h1>
          <p className="text-center text-2xl font-light max-w-3xl mx-auto leading-relaxed">
            When every second counts, trust in our dedicated team to deliver immediate, professional emergency response services.
          </p>
        </div>
      </header>

      {/* Stats Section */}
      <section 
        className="py-20 px-4 relative scroll-animate parallax"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.97)), url("https://res.cloudinary.com/dc8e6gchd/image/upload/v1743234165/accien36_bxcbne.jpg")'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center stagger-children">
            <StatCard icon={<Clock className="w-8 h-8" />} number="24/7" text="Emergency Service" />
            <StatCard icon={<Users className="w-8 h-8" />} number="200+" text="Team Members" />
            <StatCard icon={<Heart className="w-8 h-8" />} number="50k+" text="Lives Impacted" />
            <StatCard icon={<Star className="w-8 h-8" />} number="99%" text="Success Rate" />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section 
        className="py-24 px-4 relative scroll-animate parallax"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)))'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="scroll-animate">
              <h2 className="text-4xl font-bold mb-8 text-gray-900">About Us</h2>
              <div className="space-y-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  We are more than just an emergency response unit – we are your community's guardian. 
                  With state-of-the-art technology and highly trained professionals, we ensure rapid 
                  response times and exceptional care when you need it most.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our commitment to excellence has made us the most trusted emergency service provider 
                  in the region, with a track record of saving lives and protecting communities.
                </p>
                <div className="flex items-center gap-3 text-blue-900 mt-8 hover-lift">
                  <Phone className="w-6 h-6" />
                  <span className="font-semibold text-xl">24/7 Emergency Hotline: 1-800-EMERGENCY</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="flex items-center gap-4 hover-lift">
                  <MapPin className="w-6 h-6 text-blue-900" />
                  <span className="font-medium">Global Coverage</span>
                </div>
                <div className="flex items-center gap-4 hover-lift">
                  <AlertCircle className="w-6 h-6 text-blue-900" />
                  <span className="font-medium">Rapid Response</span>
                </div>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 scroll-animate">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000"
                alt="Emergency Response Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        className="py-24 px-4 relative scroll-animate parallax"
        style={{
          backgroundImage: 'linear-gradient(rgba(249, 250, 251, 0.95), rgba(249, 250, 251, 0.95)), url("https://res.cloudinary.com/dc8e6gchd/image/upload/v1743234165/PTI09_02_2024_000040B_y3aip6.jpg")'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            <ServiceCard
              icon={<Heart className="w-8 h-8" />}
              title="Medical Emergency"
              description="24/7 immediate medical response with state-of-the-art equipment and trained professionals."
            />
            <ServiceCard
              icon={<Shield className="w-8 h-8" />}
              title="Disaster Response"
              description="Comprehensive disaster management and emergency evacuation services."
            />
            <ServiceCard
              icon={<MessageSquare className="w-8 h-8" />}
              title="Crisis Consultation"
              description="Expert guidance and support for crisis management and prevention."
            />
          </div>
        </div>
      </section>

      {/* Document Policy Section */}
      <section 
        className="py-24 px-4 relative scroll-animate parallax"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.97)), url("https://res.cloudinary.com/dc8e6gchd/image/upload/v1743234165/accien36_bxcbne.jpg")'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Document Policy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our comprehensive documentation system ensures transparency, security, and efficiency 
              in every emergency response operation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16 stagger-children">
            <PolicyCard
              icon={<Shield className="w-8 h-8 text-blue-900" />}
              title="Data Protection"
              description="Military-grade encryption and security protocols protect all emergency-related documentation."
            />
            <PolicyCard
              icon={<FileText className="w-8 h-8 text-blue-900" />}
              title="Documentation Standards"
              description="Rigorous documentation protocols ensure accurate and detailed incident reporting."
            />
            <PolicyCard
              icon={<Laptop className="w-8 h-8 text-blue-900" />}
              title="Digital Integration"
              description="Seamless digital systems for real-time documentation and information access."
            />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg scroll-animate">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Key Policy Points</h3>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 stagger-children">
              <PolicyPoint text="All emergency incidents documented within 1 hour of occurrence" />
              <PolicyPoint text="Patient information protected under strict confidentiality guidelines" />
              <PolicyPoint text="Regular compliance audits and policy reviews" />
              <PolicyPoint text="Digital and physical document redundancy" />
              <PolicyPoint text="Automated backup systems with geographic distribution" />
              <PolicyPoint text="Strict access control and activity logging" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        className="py-24 px-4 relative text-white scroll-animate parallax"
        style={{
          backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.95), rgba(30, 41, 59, 0.95)), url("https://res.cloudinary.com/dc8e6gchd/image/upload/v1743234164/Forest-Fires-India-Reuters_uwaxez.webp")'
        }}
      >
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Serve You</h2>
          <p className="text-xl mb-12 font-light">
            Our emergency response team is available 24/7, ready to provide immediate assistance.
          </p>
          <div className="flex justify-center items-center gap-6 text-2xl font-semibold hover-lift">
            <Phone className="w-8 h-8" />
            <span>1-800-EMERGENCY</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, number, text }) {
  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow hover-lift">
      <div className="flex justify-center text-blue-900 mb-4">{icon}</div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{number}</div>
      <div className="text-gray-600">{text}</div>
    </div>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-105">
      <div className="text-blue-900 mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PolicyCard({ icon, title, description }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-105">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PolicyPoint({ text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="min-w-[24px] mt-1 text-blue-900">•</div>
      <p className="text-gray-600 text-lg">{text}</p>
    </div>
  );
}

export default App;