"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const barcelonaImages = [
    "https://imageio.forbes.com/specials-images/imageserve/64d609a7e451f8dae9d9eed6/FC-Barcelona-wants-to-sign-Marcus-Rashford-/960x0.jpg?format=jpg&width=1440",  // Заменете с действителни URLs
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk3QvspeEaaeIHlOETOPDgEAkFN2n_cXNhww&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB1242b5uYSOAdj6cm2vSOVmUKGVGqG8cEnw&s",
  ];

  const fansImages = [
    "https://cdn.vox-cdn.com/thumbor/j43AFiS0xnS37c5IyDgzu6LOiOw=/0x0:7943x5295/1200x800/filters:focal(3337x2013:4607x3283)/cdn.vox-cdn.com/uploads/chorus_image/image/73615868/2172240629.0.jpg",  // Заменете с действителни URLs
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Tifo_at_Camp_Nou.jpg/640px-Tifo_at_Camp_Nou.jpg",
    "hhttps://imageio.forbes.com/specials-images/imageserve/62fcd9038c0342f80e38a5f5/FC-Barcelona-v-Pumas---Club-Friendly/960x0.jpg?format=jpg&width=960",
  ];

  const campNouImages = [
    "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/6f/56/64.jpg",  // Заменете с действителни URLs
    "https://stadiumdb.com/img/news/2024/05/47Nou03.jpg",
    "https://www.fcbarcelona.com/photo-resources/2021/08/09/276ad270-e5c6-453d-8d9f-212417ad7cb3/Camp-Nou-3.jpg?width=1200&height=750",
  ];

  const [currentBarcelonaIndex, setCurrentBarcelonaIndex] = useState(0);
  const [currentFansIndex, setCurrentFansIndex] = useState(0);
  const [currentCampNouIndex, setCurrentCampNouIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBarcelonaIndex((prevIndex) => (prevIndex + 1) % barcelonaImages.length);
      setCurrentFansIndex((prevIndex) => (prevIndex + 1) % fansImages.length);
      setCurrentCampNouIndex((prevIndex) => (prevIndex + 1) % campNouImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [barcelonaImages.length, fansImages.length, campNouImages.length]);

  return (
    <div className="bg-blue-900 min-h-screen">
      

      <main className="bg-red-800 text-center py-10">
        {/* Barcelona FC Section */}
        <section className="bg-white mx-auto w-3/4 max-w-xl p-6 mb-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">BARCELONA FC</h2>
          <div className="relative">
            <img src={barcelonaImages[currentBarcelonaIndex]} alt="Barcelona FC" className="w-full h-auto mb-4" />
            <button onClick={() => setCurrentBarcelonaIndex((currentBarcelonaIndex - 1 + barcelonaImages.length) % barcelonaImages.length)} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded">‹</button>
            <button onClick={() => setCurrentBarcelonaIndex((currentBarcelonaIndex + 1) % barcelonaImages.length)} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded">›</button>
          </div>
          <p className="text-gray-700 mt-4">FC Barcelona, founded in 1899, is one of the most successful and iconic football clubs in the world. The club's home is the legendary Camp Nou stadium, which has been the stage for countless memorable moments.</p>
        </section>

        {/* Barcelona Fans Section */}
        <section className="bg-white mx-auto w-3/4 max-w-xl p-6 mb-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">BARCELONA FANS</h2>
          <div className="relative">
            <img src={fansImages[currentFansIndex]} alt="Barcelona Fans" className="w-full h-auto mb-4" />
            <button onClick={() => setCurrentFansIndex((currentFansIndex - 1 + fansImages.length) % fansImages.length)} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded">‹</button>
            <button onClick={() => setCurrentFansIndex((currentFansIndex + 1) % fansImages.length)} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded">›</button>
          </div>
          <p className="text-gray-700 mt-4">This page is dedicated to the passionate fans of FC Barcelona. Here, you can connect with other fans, share your love for the club, and stay updated with the latest fan activities and news.</p>
        </section>

        {/* Camp Nou Section */}
        <section className="bg-white mx-auto w-3/4 max-w-xl p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">CAMP NOU</h2>
          <div className="relative">
            <img src={campNouImages[currentCampNouIndex]} alt="Camp Nou" className="w-full h-auto mb-4" />
            <button onClick={() => setCurrentCampNouIndex((currentCampNouIndex - 1 + campNouImages.length) % campNouImages.length)} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded">‹</button>
            <button onClick={() => setCurrentCampNouIndex((currentCampNouIndex + 1) % campNouImages.length)} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded">›</button>
          </div>
          <p className="text-gray-700 mt-4">Camp Nou, the home stadium of FC Barcelona, is one of the most iconic stadiums in the world. It has a seating capacity of over 99,000, making it the largest stadium in Europe.That's the second home of all the FC Barcelona fans around the world.</p>
        </section>
      </main>
    </div>
  );
}
