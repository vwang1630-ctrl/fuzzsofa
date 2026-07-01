import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { geo } = body as { geo?: string };

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new SearchClient(config, customHeaders);

    // Search Reddit space communities for meteorite/cosmic content
    const baseQuery = geo
      ? `site:reddit.com meteorite space cosmic ${geo}`
      : 'site:reddit.com/r/space meteorite cosmic asteroid universe';

    const [webResponse, imageResponse] = await Promise.all([
      client.advancedSearch(baseQuery, {
        searchType: 'web',
        count: 8,
        sites: 'reddit.com',
        needSummary: true,
        needUrl: true,
      }),
      client.imageSearch('meteorite space cosmic asteroid universe reddit', 6),
    ]);

    // Also do a geo-specific search if location provided
    let geoResults: typeof webResponse.web_items = [];
    if (geo) {
      const geoResponse = await client.advancedSearch(
        `site:reddit.com space observatory meteorite ${geo}`,
        {
          searchType: 'web',
          count: 4,
          sites: 'reddit.com',
          needSummary: false,
        }
      );
      geoResults = geoResponse.web_items || [];
    }

    return NextResponse.json({
      summary: webResponse.summary || null,
      results: [...geoResults, ...(webResponse.web_items || [])]
        .filter((item): item is NonNullable<typeof item> => item !== null && item !== undefined)
        .slice(0, 10)
        .map((item) => ({
          title: item.title,
          url: item.url,
          snippet: item.snippet,
          siteName: item.site_name,
          publishTime: item.publish_time,
        })),
      images: (imageResponse.image_items || [])
        .filter((item): item is NonNullable<typeof item> => item !== null && item !== undefined)
        .slice(0, 6)
        .map((item) => ({
          title: item.title || '',
          imageUrl: item.image?.url || '',
          width: item.image?.width,
          height: item.image?.height,
          sourceUrl: item.url,
        })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Search failed';
    console.error('Reddit space search error:', message);
    return NextResponse.json(
      { error: message, results: [], images: [], summary: null },
      { status: 500 }
    );
  }
}
