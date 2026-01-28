import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SiHuggingface as Huggingface } from 'react-icons/si';

import Header from '../../shared/header/Header.js';
import TopCardsModel from './TopCardsModel.tsx';
import Chat from '../chat/Chat.tsx';
import SearchBar from '../../shared/search/SearchBar.tsx';
import SearchController from '../../shared/search/SearchController.tsx';
import BottomCard from './BottomCard.tsx';
import { modelCardsDetails } from '../../../global/data.js';
import { COLORS } from './arts.ts';

const HEADER_HEIGHT = 16;
const MIN_WIDTH = 5;
const MAX_WIDTH = 40;
const COLLAPSE_THRESHOLD = 10;

function Home() {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [widthPercent, setWidthPercent] = useState(20);
  
  const draggingRef = useRef(false);
  const pointerIdRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(20);

  const handlePointerDown = (e) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    
    pointerIdRef.current = e.pointerId;
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = widthPercent;
    document.body.style.userSelect = 'none';
    document.body.style.touchAction = 'none';
  };

  useEffect(() => {
    const handlePointerMove = (ev) => {
      if (!draggingRef.current || (pointerIdRef.current != null && ev.pointerId !== pointerIdRef.current)) {
        return;
      }

      const deltaPx = ev.clientX - startXRef.current;
      const deltaPercent = (deltaPx / window.innerWidth) * 100;
      const nextWidth = startWidthRef.current + deltaPercent;
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, nextWidth));
      
      setWidthPercent((prev) => Math.abs(prev - clampedWidth) < 0.01 ? prev : clampedWidth);
    };

    const handlePointerUp = (ev) => {
      if (!draggingRef.current || (pointerIdRef.current != null && ev.pointerId !== pointerIdRef.current)) {
        return;
      }

      draggingRef.current = false;
      pointerIdRef.current = null;
      document.body.style.userSelect = '';
      document.body.style.touchAction = '';
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const isCollapsed = widthPercent <= COLLAPSE_THRESHOLD;

  const renderModelCard = (item, index, isUncensored = false) => {
    if (isUncensored !== !!item.uncensored) return null;
    
    return (
      <BottomCard
        key={index}
        item={item}
        index={index}
        icon={<Huggingface className="text-yellow-600" size={24} />}
        uncensored={isUncensored}
      />
    );
  };

  return (
    <div
      className="min-h-screen bg-n-900 font-sans transition-colors duration-200 grid grid-rows-[auto_1fr] scrollbar-hide overflow-hidden z-50"
      style={{ gridTemplateColumns: `${widthPercent}% 1fr` }}
    >
      <header className="col-span-2 fixed top-0 left-0 right-0 h-16 z-20">
        <Header isHome={true} />
      </header>

      <section
        className="row-start-2 row-end-3 col-start-1 col-end-2 translate-y-4 fixed top-16 left-0 bottom-0 z-50"
        style={{ width: `${widthPercent}%`, height: 'calc(100vh - 5rem)', overflow: 'hidden' }}
      >
        {!isCollapsed && (
          <div className="w-full h-full overflow-auto">
            <Chat adaptable={true} />
          </div>
        )}

        <span
          onPointerDown={handlePointerDown}
          className="absolute right-0 top-1/2 translate-y-[-50%] translate-x-[50%] w-1 h-full flex cursor-ew-resize z-10 bg-black"
        />
      </section>

      <main className="container mx-auto p-10 flex flex-col items-center row-start-2 row-end-3 col-start-2 col-end-3 w-full max-w-none mt-16 -translate-x-10">
        <TopCardsModel />

        <div
          className="local fixed left-1 top-[50%] translate-y-[-50%] w-[17rem] h-[77vh]"
          style={{ backgroundAttachment: 'fixed' }}
        />

        <SearchBar
          onSearchChange={setSearchQuery}
          placeholder={t('search', { returnObjects: false })}
          className={`mb-4 mt-6 shadow rounded-xl ${COLORS.text2}`}
        />

        <SearchController
          items={modelCardsDetails}
          searchKeys={['modelName', 'memoryUsage', 'intelligenceLevel', 'fullModelName']}
          threshold={0.05}
          searchQuery={searchQuery}
        >
          {({ filteredItems }) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 w-full max-w-7xl mt-10">
              {filteredItems.map((item, index) => renderModelCard(item, index, false))}

              <div className={`col-span-1 md:col-span-2 lg:col-span-5 mt-8 border-t ${COLORS.border1}`} />

              <h1 className={`w-56 col-span-1 md:col-span-2 lg:col-span-5 text-xl font-semibold font-playfair rounded-md ${COLORS.text1}`}>
                uncensored🗡️
              </h1>

              {filteredItems.map((item, index) => renderModelCard(item, index, true))}
            </div>
          )}
        </SearchController>
      </main>
    </div>
  );
}

export default Home;