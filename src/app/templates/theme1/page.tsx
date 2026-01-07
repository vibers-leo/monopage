"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, ArrowRight, Play, Calendar, MapPin, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

// 1. Feed Data (안정적인 이미지로 교체)
const FEED_ITEMS = [
  {
    id: 1,
    type: "photo",
    src: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2800&auto=format&fit=crop", // Surfer/Artist vibe
    title: "Concept Photo #1: Waves",
    category: "PHOTO",
    date: "2025. 05. 20"
  },
  {
    id: 2,
    type: "video",
    src: "https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=2800&auto=format&fit=crop", // Studio/Mic
    title: "Recording Behind",
    category: "VIDEO",
    date: "2025. 05. 18"
  },
  {
    id: 3,
    type: "shop",
    src: "https://images.unsplash.com/photo-1550614000-4b9519e49a2a?q=80&w=2800&auto=format&fit=crop", // Merch/Hoodie
    title: "Official Hoodie Ver.2",
    category: "SHOP",
    date: "2025. 05. 15"
  },
  {
    id: 4,
    type: "notice",
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2800&auto=format&fit=crop", // Concert Crowd
    title: "World Tour Seoul: Sold Out",
    category: "NOTICE",
    date: "2025. 05. 10"
  },
  {
    id: 5,
    type: "photo",
    src: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2800&auto=format&fit=crop", // Party/Light
    title: "After Party Moments",
    category: "PHOTO",
    date: "2025. 05. 05"
  },
  {
    id: 6,
    type: "blog",
    src: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=2800&auto=format&fit=crop", // Minimal Plant/Room
    title: "Daily Note: Resting",
    category: "BLOG",
    date: "2025. 05. 01"
  },
];

// 2. Schedule Data
const SCHEDULE_ITEMS = [
  { id: 1, date: "JUN 12", title: "FAN MEETING: HELLO", location: "SEOUL, OLYMPIC HALL", status: "UPCOMING" },
  { id: 2, date: "JUN 24", title: "SUMMER FESTIVAL 2025", location: "TOKYO, STADIUM", status: "UPCOMING" },
  { id: 3, date: "JUL 05", title: "NEW ALBUM SHOWCASE", location: "NEW YORK, CENTER", status: "TBA" },
];

export default function TemplateTheme1() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax Animations
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* 1. Header (Sticky & Transparent) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md py-4 border-b border-gray-100" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="#" className={`text-2xl font-serif font-bold tracking-widest uppercase transition-colors ${isScrolled ? "text-black" : "text-white"}`}>
            THE MUSE
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center gap-10 text-xs font-bold tracking-widest uppercase transition-colors ${isScrolled ? "text-gray-900" : "text-white/90"}`}>
            <Link href="#" className="hover:opacity-60 transition-opacity">Home</Link>
            <Link href="#" className="hover:opacity-60 transition-opacity">Schedule</Link>
            <Link href="#" className="hover:opacity-60 transition-opacity">Media</Link>
            <Link href="#" className="hover:opacity-60 transition-opacity">Shop</Link>
            <Link href="#" className="hover:opacity-60 transition-opacity">Community</Link>
          </nav>

          {/* Icons */}
          <div className={`flex items-center gap-6 transition-colors ${isScrolled ? "text-black" : "text-white"}`}>
            <Search className="w-5 h-5 cursor-pointer hover:opacity-60 transition-opacity" />
            <ShoppingBag className="w-5 h-5 cursor-pointer hover:opacity-60 transition-opacity" />
            <div className="w-px h-4 bg-current opacity-30 mx-1" />
            <Link href="#" className="text-xs font-bold tracking-widest hover:opacity-60 transition-opacity hidden md:block">LOGIN</Link>
            <Menu className="md:hidden w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Full Screen) */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          {/* Main Hero Image Updated */}
          <Image
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2800&auto=format&fit=crop" // Atmospheric Concert/Artist
            alt="Hero Background"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center text-white p-6 max-w-4xl"
        >
          <h2 className="text-xs md:text-sm tracking-[0.4em] font-medium mb-6 uppercase text-white/80">The Official Artist Platform</h2>
          <h1 className="text-6xl md:text-9xl font-serif font-medium tracking-wide leading-none mb-10 drop-shadow-2xl">
            THE MUSE
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-10 py-4 bg-white text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/90 transition-all min-w-[200px]">
              Latest Release
            </button>
            <button className="px-10 py-4 border border-white/30 backdrop-blur-sm text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-all min-w-[200px]">
              Join Membership
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/50" />
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* 3. Latest Updates (Grid) */}
      <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-20">
          <div>
            <span className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-4 block">Feed</span>
            <h2 className="text-4xl md:text-6xl font-serif font-medium">Latest Updates</h2>
          </div>
          <Link href="#" className="hidden md:flex items-center gap-3 text-xs font-bold tracking-widest border-b border-black pb-2 hover:opacity-60 transition-all">
            VIEW ALL <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-10">
          {FEED_ITEMS.map((item) => (
            <div key={item.id} className="group cursor-pointer flex flex-col gap-6">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase shadow-sm">
                    {item.category}
                    </span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-medium leading-tight group-hover:opacity-60 transition-opacity">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 mt-3 font-mono uppercase tracking-wider">
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Video Section (New) */}
      <section className="py-24 bg-black text-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2 relative aspect-video bg-gray-900 group cursor-pointer overflow-hidden">
                    <Image 
                        src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2800&auto=format&fit=crop"
                        alt="Video Thumbnail"
                        fill
                        className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Play className="fill-white text-white ml-2" size={32} />
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 space-y-8">
                    <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">Featured Video</span>
                    <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                        Behind the Scenes:<br/>
                        <span className="italic text-gray-400">The Beginning</span>
                    </h2>
                    <p className="text-gray-400 leading-relaxed max-w-md">
                        Watch the exclusive documentary of THE MUSE's journey. 
                        Unseen footage, raw emotions, and the story behind the new album.
                    </p>
                    <button className="text-xs font-bold tracking-widest uppercase border-b border-white pb-2 hover:opacity-60 transition-opacity">
                        Watch Now
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* 5. Schedule Section (New) */}
      <section className="py-32 px-6 md:px-12 max-w-[1200px] mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-20">Upcoming Schedule</h2>
        
        <div className="space-y-0 divide-y divide-gray-200 border-t border-b border-gray-200">
            {SCHEDULE_ITEMS.map((item) => (
                <div key={item.id} className="group py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-gray-50 transition-colors px-4">
                    <div className="flex items-center gap-12 w-full md:w-auto">
                        <div className="text-xs font-bold tracking-widest uppercase text-gray-400 min-w-[60px]">{item.date}</div>
                        <div className="text-xl md:text-2xl font-serif font-medium">{item.title}</div>
                    </div>
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-500">
                            <MapPin size={14} />
                            {item.location}
                        </div>
                         <div className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border ${item.status === 'UPCOMING' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}>
                            {item.status}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-12 text-center">
            <Link href="#" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity">
                VIEW FULL SCHEDULE <ChevronRight size={14} />
            </Link>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-gray-50 py-20 px-6 border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center text-center gap-10">
          <div className="text-3xl font-serif font-bold tracking-widest text-black">THE MUSE</div>
          <div className="flex gap-8 text-black text-xs font-bold tracking-widest">
             <Link href="#" className="hover:opacity-50 transition-opacity">INSTAGRAM</Link>
             <Link href="#" className="hover:opacity-50 transition-opacity">TWITTER</Link>
             <Link href="#" className="hover:opacity-50 transition-opacity">YOUTUBE</Link>
             <Link href="#" className="hover:opacity-50 transition-opacity">SPOTIFY</Link>
          </div>
          <div className="text-gray-400 text-[10px] tracking-widest uppercase mt-4">
            &copy; 2025 ArtPage Platform. Powered by ArtPage.
          </div>
        </div>
      </footer>
    </div>
  );
}
