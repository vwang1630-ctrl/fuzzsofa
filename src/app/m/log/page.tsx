'use client';

import Link from 'next/link';

const logs = [
  {
    id: 1,
    title: '工坊手记：一件雕塑沙发的诞生',
    date: '2026-06-28',
    summary: '从一块海绵到最终成型的沙发，我们记录下每一道工序背后的思考与手感。',
    image: 'https://picsum.photos/seed/log1/600/400',
    content:
      '在Fuzz Sofa的工坊里，每一件作品都从一块海绵开始...',
  },
  {
    id: 2,
    title: '与自然对话：环形设计的灵感来源',
    date: '2026-06-20',
    summary: '环形的围坐形式并非偶然，它源于对自然中圆形聚落形态的观察。',
    image: 'https://picsum.photos/seed/log2/600/400',
    content:
      '我们观察自然中的环形结构，从鸟巢到古老的圆形剧场...',
  },
  {
    id: 3,
    title: '匠心工艺：从选材到成品',
    date: '2026-06-12',
    summary: '每一块海绵、每一根钢架都经过严格筛选，确保品质与耐久。',
    image: 'https://picsum.photos/seed/log3/600/400',
    content:
      '我们选用航空级镀锌钢框架，确保稳固与安全...',
  },
];

export default function LogListPage() {
  return (
    <div className="page page-log-list active">
      <div className="page-title">日志</div>
      <div className="page-sub">来自工作室的故事与灵感</div>
      <div className="log-list" id="logListContainer">
        {logs.map((log) => (
          <Link
            key={log.id}
            href={`/m/log/${log.id}`}
            className="log-list-item"
            data-id={log.id}
          >
            <div className="item-title">{log.title}</div>
            <div className="item-meta">{log.date}</div>
            <div className="item-summary">{log.summary}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
