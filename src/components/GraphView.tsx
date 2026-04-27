import { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import type { GraphData, GraphNode } from '../types';
import { graphConfig } from '../config';

interface Props {
  data: GraphData;
  onNodeClick: (id: string) => void;
  selectedNodeId?: string | null;
}

const COLORS = [
  '#c8956c', '#d4a574', '#b8845e', '#a07050',
  '#c0a080', '#d09060', '#b09070', '#c8a888',
];

interface SimNode extends GraphNode, d3.SimulationNodeDatum {}
type SimLink = d3.SimulationLinkDatum<SimNode>;

export default function GraphView({ data, onNodeClick, selectedNodeId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stableClick = useCallback(onNodeClick, [onNodeClick]);

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl || data.nodes.length === 0) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const svg = d3.select(svgEl).attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '5').attr('result', 'blur');
    const merge = filter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.15, 5]).on('zoom', (e) => g.attr('transform', e.transform));
    svg.call(zoom);

    const nodes = data.nodes.map((d) => ({ ...d })) as SimNode[];
    const links = data.edges.map((d) => ({ ...d })) as SimLink[];

    const sim = d3.forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(160).strength(0.35))
      .force('charge', d3.forceManyBody<SimNode>().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<SimNode>().radius((d) => nr(d) + 10))
      .force('x', d3.forceX<SimNode>(width / 2).strength(0.03))
      .force('y', d3.forceY<SimNode>(height / 2).strength(0.03));

    function nr(d: SimNode) { return Math.max(5, Math.sqrt(d.linkCount + 1) * 5.5); }

    const link = g.append('g').selectAll<SVGLineElement, SimLink>('line').data(links).enter().append('line')
      .attr('stroke', 'rgba(200,149,108,0.12)')
      .attr('stroke-width', 1);

    const node = g.append('g').selectAll<SVGGElement, SimNode>('g').data(nodes).enter().append('g')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', (e) => { if (!e.active) sim.alphaTarget(0.3).restart(); e.subject.fx = e.subject.x; e.subject.fy = e.subject.y; })
        .on('drag', (e) => { e.subject.fx = e.x; e.subject.fy = e.y; })
        .on('end', (e) => { if (!e.active) sim.alphaTarget(0); e.subject.fx = undefined; e.subject.fy = undefined; }));

    node.append('circle')
      .attr('r', nr)
      .attr('fill', (_, i) => COLORS[i % COLORS.length])
      .attr('fill-opacity', 0.7)
      .attr('stroke', (d) => d.id === selectedNodeId ? 'rgba(212,165,116,0.6)' : 'transparent')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow)');

    node.append('text')
      .text((d) => (d.title.length > 14 ? `${d.title.slice(0, 13)}…` : d.title))
      .attr('dx', (d) => nr(d) + 6)
      .attr('dy', 4)
      .attr('fill', '#777')
      .attr('font-size', '11px')
      .attr('pointer-events', 'none');

    node.on('click', (_, d) => stableClick(d.id));

    node.on('mouseover', function (_, d) {
      d3.select(this).select('circle').attr('fill-opacity', 1).attr('stroke', 'rgba(212,165,116,0.6)');
      link
        .attr('stroke', (l) => (l.source as SimNode).id === d.id || (l.target as SimNode).id === d.id ? 'rgba(200,149,108,0.35)' : 'rgba(200,149,108,0.03)')
        .attr('stroke-width', (l) => (l.source as SimNode).id === d.id || (l.target as SimNode).id === d.id ? 1.5 : 0.5);
      node.select('circle').attr('fill-opacity', (n) => {
        if (n.id === d.id) return 1;
        return links.some((l) => ((l.source as SimNode).id === d.id && (l.target as SimNode).id === n.id) || ((l.target as SimNode).id === d.id && (l.source as SimNode).id === n.id)) ? 0.8 : 0.15;
      });
      node.select('text').attr('fill-opacity', (n) => {
        if (n.id === d.id) return 1;
        return links.some((l) => ((l.source as SimNode).id === d.id && (l.target as SimNode).id === n.id) || ((l.target as SimNode).id === d.id && (l.source as SimNode).id === n.id)) ? 1 : 0.15;
      });
    });

    node.on('mouseout', () => {
      node.select('circle').attr('fill-opacity', 0.7).attr('stroke', (d) => d.id === selectedNodeId ? 'rgba(212,165,116,0.6)' : 'transparent');
      node.select('text').attr('fill-opacity', 1);
      link.attr('stroke', 'rgba(200,149,108,0.12)').attr('stroke-width', 1);
    });

    // Constrain nodes within SVG bounds to prevent clipping
    const padding = 30;
    sim.on('tick', () => {
      nodes.forEach((d) => {
        const r = nr(d) + padding;
        d.x = Math.max(r, Math.min(width - r, d.x ?? 0));
        d.y = Math.max(r, Math.min(height - r, d.y ?? 0));
      });
      link.attr('x1', (d) => (d.source as SimNode).x ?? 0).attr('y1', (d) => (d.source as SimNode).y ?? 0).attr('x2', (d) => (d.target as SimNode).x ?? 0).attr('y2', (d) => (d.target as SimNode).y ?? 0);
      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => { sim.stop(); };
  }, [data, stableClick, selectedNodeId]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" />
      <div className="liquid-glass absolute bottom-10 left-4 rounded-xl px-4 py-2.5 w-fit">
        <div className="relative z-10 text-xs text-[#666] space-y-0.5">
          <div><span className="text-[#999]">{data.nodes.length}</span> {graphConfig.notesLabel} · <span className="text-[#999]">{data.edges.length}</span> {graphConfig.connectionsLabel}</div>
        </div>
      </div>
      {data.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-[#333] text-sm">{graphConfig.emptyGraphLabel}</div>
      )}
    </div>
  );
}
