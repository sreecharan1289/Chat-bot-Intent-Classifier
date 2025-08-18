"use client";

import React, { useState, useRef, useEffect } from 'react';
import Chatbot from './components/ChatBot';

function useTypingAnimation(text: string, speed: number = 100) {
  const [typedText, setTypedText] = useState("");
  useEffect(() => {
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      setTypedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return typedText;
}

export default function HomePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  const mainText =
    "   Eager to know your Intents?    Explore the power of Natural Language understanding with our ATIS Intent Classifier. Simply ask a query related to flight information, and our bot will classify your intent.";
  const typedText = useTypingAnimation(mainText, 50);

  const carouselCards = [
    {
      id: 1,
      image: "https://placehold.co/600x400/FF5733/FFFFFF?text=Flight+Queries",
      title: "Flight Information",
      description: "Get details about flights, schedules, and availability for your travel needs."
    },
    {
      id: 2,
      image: "https://placehold.co/600x400/33FF57/FFFFFF?text=Flight+Time",
      title: "Flight Time & Schedule",
      description: "Check departure times, arrival schedules, and flight durations."
    },
    {
      id: 3,
      image: "https://placehold.co/600x400/3357FF/FFFFFF?text=Airfare+Pricing",
      title: "Airfare & Pricing",
      description: "Compare ticket prices, find deals, and check fare information."
    },
    {
      id: 4,
      image: "https://placehold.co/600x400/FF33A1/FFFFFF?text=Aircraft+Info",
      title: "Aircraft Details",
      description: "Learn about aircraft types, seating configurations, and plane specifications."
    },
    {
      id: 5,
      image: "https://placehold.co/600x400/A133FF/FFFFFF?text=Ground+Service",
      title: "Ground Services",
      description: "Information about ground transportation, parking, and airport amenities."
    },
    {
      id: 6,
      image: "https://placehold.co/600x400/FF9400/FFFFFF?text=Airline+Details",
      title: "Airline Information",
      description: "Discover airline policies, services, baggage rules, and company details."
    },
    {
      id: 7,
      image: "https://placehold.co/600x400/0088CC/FFFFFF?text=Codes+%26+Terms",
      title: "Abbreviations & Codes",
      description: "Understand airport codes, airline abbreviations, and aviation terminology."
    }
  ];

  const totalCards = carouselCards.length;

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % totalCards);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + totalCards) % totalCards);

  useEffect(() => {
    const timer = setInterval(nextCard, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Background with airplane image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-25 z-0 pointer-events-none"
        style={{ backgroundImage: 'url("/assets/aeroplane.jpg")' }}
        aria-hidden="true"
      />


<header className={`relative ${isChatbotOpen ? 'z-10' : 'z-20'} bg-gradient-to-r from-slate-900/90 via-gray-800/90 to-zinc-900/90 backdrop-blur-md shadow-2xl border-b border-white/10 rounded-b-2xl`}>
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-center space-x-3">
      {/* Optional: Add an icon */}
      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-xl tracking-tight">
        ChatBot Intent Classification
      </h1>
    </div>
  </div>
</header>



      <div className="relative flex flex-col items-center text-center overflow-hidden z-10">
        {/* Main ATIS content with typing animation - First section */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-10xl text-center px-7">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 drop-shadow-lg">
              {typedText.split('?')[0]}?
              {typedText.includes('?') && <span className="animate-pulse text-blue-500">|</span>}
            </h1>
            {typedText.length > mainText.split('?')[0].length + 1 && (
              <p className="text-lg md:text-xl text-slate-700 max-w-4xl mb-12 leading-relaxed mx-auto px-4">
                {typedText.substring(mainText.split('?')[0].length + 2)}
                {typedText.length === mainText.length && <span className="animate-pulse text-blue-600">|</span>}
              </p>
            )}
          </div>
        </div>

        {/* Second section - Classification of Intents and Carousel */}
        <div className="w-full min-h-screen flex flex-col justify-center py-16">
          {/* Section Title for Carousel */}
          <div className="w-full text-center mb-12 px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 drop-shadow-md bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Classification of Intents
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mx-auto rounded-full shadow-lg"></div>
          </div>

          {/* Horizontal Sliding Carousel Section */}
          <div className="relative w-full max-w-6xl mb-16 px-4 mx-auto">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentCard * 340}px)`,
                  width: `${totalCards * 340}px`,
                }}
              >
                {carouselCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="flex-none w-80 mx-2 rounded-xl shadow-xl bg-white p-6 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                    onClick={() => setCurrentCard(index)}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Carousel Navigation Arrows */}
            <button
              onClick={prevCard}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full z-20 hover:bg-opacity-75 transition-colors"
              aria-label="Previous card"
            >
              <span className="material-symbols-rounded text-3xl">arrow_back_ios</span>
            </button>
            <button
              onClick={nextCard}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full z-20 hover:bg-opacity-75 transition-colors"
              aria-label="Next card"
            >
              <span className="material-symbols-rounded text-3xl">arrow_forward_ios</span>
            </button>
            <div className="flex justify-center mt-6 space-x-2">
              {carouselCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCard(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentCard ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Chatbot Toggle Button - Bottom Right */}
        {!isChatbotOpen && (
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="fixed bottom-8 right-8 z-50 bg-purple-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 hover:bg-purple-700 animate-bounce-in"
            aria-label="Open Chatbot"
          >
            <span className="material-symbols-rounded">chat</span>
          </button>
        )}

        {/* Chatbot Overlay */}
        {isChatbotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-60 transition-opacity duration-300">
            <div className="relative h-full flex items-center justify-end p-4">
              <Chatbot />
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 z-50 p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors"
                aria-label="Close Chatbot"
              >
                <span className="material-symbols-rounded text-3xl">close</span>
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
          }
          .animate-bounce-in { 
            animation: bounceIn 0.8s ease-out forwards 1s; 
          }
        `}</style>
      </div>
    </>
  );
}
