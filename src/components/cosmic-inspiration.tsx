'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, MapPin, Sparkles, ChevronRight } from 'lucide-react';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  siteName?: string;
  publishTime?: string;
}

interface SpaceImage {
  title: string;
  imageUrl: string;
  width?: number;
  height?: number;
  sourceUrl?: string;
}

interface CosmicData {
  summary: string | null;
  results: SearchResult[];
  images: SpaceImage[];
}

interface CosmicInspirationProps {
  lang: string;
}

export default function CosmicInspiration({ lang }: CosmicInspirationProps) {
  const [data, setData] = useState<CosmicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [geo, setGeo] = useState<string>('');
  const [detecting, setDetecting] = useState(false);

  const fetchData = useCallback(async (location?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/reddit-space', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geo: location || '' }),
      });
      if (res.ok) {
        const json = await res.json();
        setData({
          summary: json.summary || null,
          results: json.results || [],
          images: json.images || [],
        });
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const detectLocation = async () => {
    setDetecting(true);
    try {
      // Use IP-based region detection
      const regionRes = await fetch('/api/detect-region');
      if (regionRes.ok) {
        const regionData = await regionRes.json();
        const countryCode = regionData.country || '';
        // Map country codes to searchable names for Reddit
        const countryNames: Record<string, string> = {
          US: 'United States', GB: 'United Kingdom', DE: 'Germany', FR: 'France',
          JP: 'Japan', KR: 'South Korea', CN: 'China', AU: 'Australia',
          CA: 'Canada', BR: 'Brazil', IN: 'India', IT: 'Italy', ES: 'Spain',
          NL: 'Netherlands', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
          SG: 'Singapore', AE: 'UAE', SA: 'Saudi Arabia', MX: 'Mexico',
        };
        const locationStr = countryNames[countryCode] || countryCode;
        setGeo(locationStr);
        await fetchData(locationStr);
      } else {
        await fetchData();
      }
    } catch {
      await fetchData();
    } finally {
      setDetecting(false);
    }
  };

  const isZh = lang === 'zh';

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="flex items-start justify-between mb-8 lg:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#E8B4B8]" />
              <span className="text-[11px] font-light tracking-[0.2em] uppercase text-[#8A8580]">
                {isZh ? '宇宙灵感' : 'COSMIC INSPIRATION'}
              </span>
            </div>
            <h2 className="text-2xl lg:text-[2.5rem] font-light tracking-[0.05em] text-[#F5F0EB] leading-[1.1]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {isZh ? '来自星空的故事' : 'Stories From The Cosmos'}
            </h2>
          </div>
          <button
            onClick={detectLocation}
            disabled={detecting}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 rounded-full text-[11px] tracking-[0.1em] uppercase text-[#8A8580] hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-all duration-300 disabled:opacity-50"
          >
            <MapPin className="w-3 h-3" />
            {detecting
              ? (isZh ? '定位中...' : 'LOCATING...')
              : geo
                ? (isZh ? '更新位置' : 'UPDATE LOCATION')
                : (isZh ? '附近发现' : 'NEAR ME')}
          </button>
        </div>

        {/* AI Summary */}
        {data?.summary && (
          <div className="mb-8 lg:mb-12 max-w-[700px]">
            <p className="text-[14px] lg:text-[15px] font-light leading-[1.7] text-[#8A8580]">
              {data.summary}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-3 py-8">
            <div className="w-5 h-5 border border-[#E8B4B8]/30 border-t-[#E8B4B8] rounded-full animate-spin" />
            <span className="text-[12px] tracking-[0.1em] uppercase text-[#8A8580]">
              {isZh ? '搜索宇宙信号...' : 'SCANNING THE COSMOS...'}
            </span>
          </div>
        )}

        {/* Content Grid */}
        {!loading && data && (
          <>
            {/* Images Row */}
            {data.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 mb-8 lg:mb-12 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible">
                {data.images.map((img, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[70vw] lg:w-auto rounded-lg overflow-hidden relative group"
                  >
                    <div className="aspect-[4/3] bg-[#111] relative overflow-hidden">
                      {img.imageUrl ? (
                        <img
                          src={img.imageUrl}
                          alt={img.title || 'Cosmic inspiration'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-[#8A8580]/30" />
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
                      {img.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
                          <p className="text-[11px] lg:text-[12px] font-light tracking-[0.05em] text-[#F5F0EB]/80 line-clamp-2">
                            {img.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reddit Discussions */}
            {data.results.length > 0 && (
              <div className="space-y-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-[#FF4500]/20 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-[#FF4500]">R</span>
                  </div>
                  <span className="text-[11px] tracking-[0.15em] uppercase text-[#8A8580]">
                    {isZh ? '来自太空社区的讨论' : 'FROM THE SPACE COMMUNITY'}
                  </span>
                  {geo && (
                    <span className="text-[10px] tracking-[0.1em] text-[#E8B4B8]/60 ml-1">
                      · {isZh ? '基于你的位置' : 'GEO-TARGETED'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  {data.results.slice(0, 6).map((result, i) => (
                    <a
                      key={i}
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 lg:p-5 bg-[#111] border border-white/5 rounded-lg hover:border-[#E8B4B8]/20 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] lg:text-[14px] font-light text-[#F5F0EB] leading-[1.4] line-clamp-2 mb-2 group-hover:text-[#E8B4B8] transition-colors duration-300">
                            {result.title}
                          </h4>
                          <p className="text-[11px] lg:text-[12px] font-light text-[#8A8580] leading-[1.5] line-clamp-2">
                            {result.snippet}
                          </p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#8A8580]/50 group-hover:text-[#E8B4B8] transition-colors duration-300 flex-shrink-0 mt-1" />
                      </div>
                      {result.siteName && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-[10px] tracking-[0.1em] uppercase text-[#8A8580]/60">
                            {result.siteName}
                          </span>
                          {result.publishTime && (
                            <>
                              <span className="text-[#8A8580]/30">·</span>
                              <span className="text-[10px] text-[#8A8580]/60">
                                {result.publishTime}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </a>
                  ))}
                </div>

                {/* Explore More Link */}
                <div className="mt-6 lg:mt-8">
                  <a
                    href="https://www.reddit.com/r/space/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300 group/link"
                  >
                    {isZh ? '探索更多太空话题' : 'EXPLORE MORE SPACE TOPICS'}
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            )}

            {/* Empty State */}
            {data.results.length === 0 && data.images.length === 0 && (
              <div className="py-12 text-center">
                <Sparkles className="w-8 h-8 text-[#8A8580]/30 mx-auto mb-3" />
                <p className="text-[13px] font-light text-[#8A8580]">
                  {isZh ? '暂无宇宙灵感，请稍后再试' : 'No cosmic signals found. Try again later.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
