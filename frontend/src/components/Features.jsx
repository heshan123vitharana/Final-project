import { useState, useEffect } from 'react';

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  // Removed unused state variables: activeFeature, setActiveFeature, hoveredFeature, setHoveredFeature

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Modern Gallery Content Data
  const galleryItems = [
    {
      type: "leadership",
      title: "Visionary Leadership",
      subtitle: "Guiding Sri Lanka's Rice Revolution",
      description: "Our experienced leadership team combines decades of agricultural expertise with modern innovation to drive sustainable growth in Sri Lanka's rice industry.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop&crop=faces",
      stats: "50+ Years Combined Experience",
      color: "emerald",
      category: "Leadership"
    },
    {
      type: "art",
      title: "Heritage & Culture",
      subtitle: "Celebrating Rice Farming Traditions",
      description: "Honoring the rich cultural heritage of Sri Lankan rice farming through traditional practices merged with contemporary agricultural science.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
      stats: "2000+ Years of Tradition",
      color: "amber",
      category: "Heritage"
    },
    {
      type: "innovation",
      title: "Digital Transformation",
      subtitle: "Technology Meets Agriculture",
      description: "Revolutionary digital solutions transforming how we manage, process, and distribute rice across the island nation.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
      stats: "100% Digital Platform",
      color: "blue",
      category: "Innovation"
    },
    {
      type: "community",
      title: "Farmer Community",
      subtitle: "Empowering Agricultural Excellence",
      description: "Building strong relationships with farming communities to ensure sustainable livelihoods and premium quality rice production.",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop",
      stats: "10,000+ Active Farmers",
      color: "green",
      category: "Community"
    },
    {
      type: "sustainability",
      title: "Sustainable Practices",
      subtitle: "Environmental Stewardship",
      description: "Implementing eco-friendly farming methods and sustainable practices to protect our environment for future generations.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
      stats: "Carbon Neutral by 2030",
      color: "teal",
      category: "Sustainability"
    },
    {
      type: "quality",
      title: "Premium Quality",
      subtitle: "Excellence in Every Grain",
      description: "Rigorous quality control processes ensuring every grain meets international standards for nutrition and taste.",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop",
      stats: "99.9% Quality Assurance",
      color: "purple",
      category: "Quality"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        bg: 'from-emerald-500 to-emerald-600',
        bgLight: 'from-emerald-50 to-emerald-100',
        text: 'text-emerald-600',
        textLight: 'text-emerald-50',
        border: 'border-emerald-200',
        accent: 'bg-emerald-500'
      },
      green: {
        bg: 'from-green-500 to-green-600',
        bgLight: 'from-green-50 to-green-100',
        text: 'text-green-600',
        textLight: 'text-green-50',
        border: 'border-green-200',
        accent: 'bg-green-500'
      },
      teal: {
        bg: 'from-teal-500 to-teal-600',
        bgLight: 'from-teal-50 to-teal-100',
        text: 'text-teal-600',
        textLight: 'text-teal-50',
        border: 'border-teal-200',
        accent: 'bg-teal-500'
      },
      blue: {
        bg: 'from-blue-500 to-blue-600',
        bgLight: 'from-blue-50 to-blue-100',
        text: 'text-blue-600',
        textLight: 'text-blue-50',
        border: 'border-blue-200',
        accent: 'bg-blue-500'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        bgLight: 'from-purple-50 to-purple-100',
        text: 'text-purple-600',
        textLight: 'text-purple-50',
        border: 'border-purple-200',
        accent: 'bg-purple-500'
      },
      amber: {
        bg: 'from-amber-500 to-amber-600',
        bgLight: 'from-amber-50 to-amber-100',
        text: 'text-amber-600',
        textLight: 'text-amber-50',
        border: 'border-amber-200',
        accent: 'bg-amber-500'
      }
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
      <section id="features" className="relative min-h-screen gov-section-bg overflow-hidden py-24">
      {/* Very Light Background Elements */}
      <div className="absolute inset-0">
        {/* Ultra light gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-white/80 to-emerald-50/15"></div>
        
        {/* Very subtle floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gray-100/5 rounded-full blur-3xl animate-pulse delay-2000" style={{ animationDuration: '8s' }}></div>
        
        {/* Almost invisible grid pattern */}
        <div className="absolute inset-0 opacity-[0.008]">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Government Excellence Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
            Services & Excellence
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Discover our commitment to serving Sri Lankan farmers and citizens through professional government 
            services, quality assurance, and agricultural excellence backed by decades of expertise.
          </p>
        </div>

        {/* Modern Services Layout */}
        <div className="flex flex-col md:flex-row items-center">
          <img className="max-w-2xl w-full" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" alt="Services Excellence" />
          <div className="space-y-10 px-4 md:px-0">
            <div className="flex items-center justify-center gap-6 max-w-md">
              <div className="p-6 aspect-square bg-violet-100 rounded-full">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 18.667V24.5m4.668-8.167V24.5m4.664-12.833V24.5m2.333-21L15.578 13.587a.584.584 0 0 1-.826 0l-3.84-3.84a.583.583 0 0 0-.825 0L2.332 17.5M4.668 21v3.5m4.664-8.167V24.5" stroke="#7F22FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">Real-Time Analytics</h3>
                <p className="text-sm text-slate-600">Get instant insights into your rice production with live dashboards and market data.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 max-w-md">
              <div className="p-6 aspect-square bg-green-100 rounded-full">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 11.667A2.333 2.333 0 0 0 11.667 14c0 1.19-.117 2.929-.304 4.667m4.972-3.36c0 2.776 0 7.443-1.167 10.36m5.004-1.144c.14-.7.502-2.683.583-3.523M2.332 14a11.667 11.667 0 0 1 21-7m-21 11.667h.01m23.092 0c.233-2.333.152-6.246 0-7" stroke="#00A63E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.832 22.75C6.415 21 6.999 17.5 6.999 14a7 7 0 0 1 .396-2.333m2.695 13.999c.245-.77.525-1.54.665-2.333m-.255-15.4A7 7 0 0 1 21 14v2.333" stroke="#00A63E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">Government-Grade Security</h3>
                <p className="text-sm text-slate-600">End-to-end encryption, secure transactions, compliance with national standards.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 max-w-md">
              <div className="p-6 aspect-square bg-orange-100 rounded-full">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.668 25.666h16.333a2.333 2.333 0 0 0 2.334-2.333V8.166L17.5 2.333H7a2.333 2.333 0 0 0-2.333 2.333v4.667" stroke="#F54900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.332 2.333V7a2.334 2.334 0 0 0 2.333 2.333h4.667m-21 8.167h11.667M10.5 21l3.5-3.5-3.5-3.5" stroke="#F54900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">Comprehensive Reports</h3>
                <p className="text-sm text-slate-600">Export professional agricultural reports for government compliance and quality assurance.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 max-w-md">
              <div className="p-6 aspect-square bg-blue-100 rounded-full">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2.333c6.443 0 11.667 5.224 11.667 11.667 0 6.443-5.224 11.667-11.667 11.667S2.333 20.443 2.333 14C2.333 7.557 7.557 2.333 14 2.333z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.333 14l4.667 4.667L23.333 9.333" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">Quality Assurance</h3>
                <p className="text-sm text-slate-600">Rigorous quality control processes ensuring every grain meets international standards.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 max-w-md">
              <div className="p-6 aspect-square bg-emerald-100 rounded-full">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 25.667c6.443 0 11.667-5.224 11.667-11.667S20.443 2.333 14 2.333 2.333 7.557 2.333 14s5.224 11.667 11.667 11.667z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.333 14H18.667M14 9.333v9.334" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">Farmer Support Network</h3>
                <p className="text-sm text-slate-600">24/7 support system connecting farmers with agricultural experts and government resources.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 max-w-md">
              <div className="p-6 aspect-square bg-teal-100 rounded-full">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.25 6.417c0-.644.522-1.167 1.167-1.167h1.166c.645 0 1.167.523 1.167 1.167v2.916c0 .645-.522 1.167-1.167 1.167h-1.166c-.645 0-1.167-.522-1.167-1.167V6.417z" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.833 14c0-.644.523-1.167 1.167-1.167h2.917c.644 0 1.166.523 1.166 1.167v7.583c0 .645-.522 1.167-1.166 1.167H7c-.644 0-1.167-.522-1.167-1.167V14z" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.083 17.5c0-.644.523-1.167 1.167-1.167H21.167c.644 0 1.166.523 1.166 1.167v4.083c0 .645-.522 1.167-1.166 1.167h-1.917c-.644 0-1.167-.522-1.167-1.167V17.5z" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">Sustainable Practices</h3>
                <p className="text-sm text-slate-600">Implementing eco-friendly farming methods to protect environment for future generations.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      </section>
    </>
  );
};

export default Features;
