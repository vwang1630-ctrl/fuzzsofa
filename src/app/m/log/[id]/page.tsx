'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const logs = [
  {
    id: 1,
    title: '工坊手记：一件雕塑沙发的诞生',
    date: '2026-06-28',
    summary: '从一块海绵到最终成型的沙发，我们记录下每一道工序背后的思考与手感。',
    image: 'https://picsum.photos/seed/log1/600/400',
    content:
      '在Fuzz Sofa的工坊里，每一件作品都从一块海绵开始。设计师先用纸笔勾勒出轮廓，然后将概念转为三维模型。每一道弧线都经过反复推敲，确保坐感与美学的平衡。手工塑形是最关键的步骤，工匠们凭借多年经验，用手感判断每一处曲线的弧度。最终，一件兼具雕塑美感与实用功能的沙发诞生了。',
  },
  {
    id: 2,
    title: '与自然对话：环形设计的灵感来源',
    date: '2026-06-20',
    summary: '环形的围坐形式并非偶然，它源于对自然中圆形聚落形态的观察。',
    image: 'https://picsum.photos/seed/log2/600/400',
    content:
      '我们观察自然中的环形结构，从鸟巢到古老的圆形剧场。环形围坐是人类最古老的社交形式之一，它消除了主次之分，让每个人都能平等地参与对话。Ring Sofa 的设计正是源于这一洞察——没有起点，没有终点，只有永不停歇的交流。',
  },
  {
    id: 3,
    title: '匠心工艺：从选材到成品',
    date: '2026-06-12',
    summary: '每一块海绵、每一根钢架都经过严格筛选，确保品质与耐久。',
    image: 'https://picsum.photos/seed/log3/600/400',
    content:
      '我们选用航空级镀锌钢框架，确保稳固与安全。高密度海绵经过定制模具成型，在三维空间中寻找平衡。每一块面料都经过触感测试，只有通过"云触感"标准的才能用于成品。一体式金属底座采用哑光饰面，与整体设计浑然一体。',
  },
];

export default function LogDetailPage() {
  const params = useParams();
  const logId = Number(params.id);
  const log = logs.find((l) => l.id === logId) || logs[0];

  return (
    <div className="page page-log-detail active">
      <div style={{
        position: "sticky",
        top: 0,
        background: "#0A0A0A",
        borderBottom: "1px solid #1A1A1A",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 100
      }}>
        <Link href="/m/log" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px",
          background: "transparent",
          border: "none",
          cursor: "pointer"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8B4B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "16px",
          fontWeight: 400,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#F5F0EB"
        }}>Log Detail</span>
      </div>
      <div className="log-detail-title" id="logDetailTitle">
        {log.title}
      </div>
      <div className="log-detail-meta" id="logDetailMeta">
        {log.date}
      </div>
      <div className="log-detail-image" id="logDetailImage">
        <img src={log.image} alt="" />
      </div>
      <div className="log-detail-content" id="logDetailContent">
        {log.content}
      </div>
    </div>
  );
}
