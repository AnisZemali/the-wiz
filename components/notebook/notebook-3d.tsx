"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, useEffect, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A real cuboid built from six CSS 3D faces — front cover, back cover,
 * spine, fore-edge and the two paper edges. It floats on an idle loop and
 * turns slowly as the page scrolls.
 *
 * Geometry is driven by three custom properties so the whole object scales
 * with the viewport without any JS measurement:
 *   --bw  cover width      --bh  cover height      --bd  block depth
 */

type FaceProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Transform applied after the centring translate. */
  transform: string;
  width: string;
  height: string;
};

function Face({
  children,
  className,
  style,
  transform,
  width,
  height,
}: FaceProps) {
  return (
    <div
      className={cn("absolute top-1/2 left-1/2 backface-hidden", className)}
      style={{
        width,
        height,
        transform: `translate(-50%, -50%) ${transform}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Stacked-paper striping used on all three cut edges of the block. */
const paperEdge: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(90deg, #fdfdfd 0px, #fdfdfd 1px, #efefef 1px, #efefef 2px)",
};

const paperEdgeHorizontal: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, #fdfdfd 0px, #fdfdfd 1px, #efefef 1px, #efefef 2px)",
};

export type CoverProps = {
  /** Small mark in the top-left. */
  edition?: string;
  /** The two lines of the wordmark. */
  wordmark?: readonly [string, string];
  /** Small caps block under the rule — the specific edition. */
  meta?: readonly string[];
  /** Footer line along the bottom. */
  footnote?: string;
};

/**
 * The cover artwork on its own — reused flat in the order panel and on
 * every book page. Type is sized in `em`, so the parent controls the scale.
 */
export function NotebookCover({
  edition = "Édition 01",
  wordmark = ["THE", "WIZ"],
  meta = ["First year", "Medicine"],
  footnote = "Summaries · Diagrams · Notes",
}: CoverProps = {}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-l-[3px] rounded-r-[14px] bg-white">
      {/* Light falling from the upper right, darkest along the spine. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(10,10,10,0.10) 0%, rgba(10,10,10,0.015) 14%, rgba(255,255,255,0) 46%, rgba(255,255,255,0.9) 82%)",
        }}
      />
      <div aria-hidden className="grain absolute inset-0 opacity-60" />

      {/* Blind-embossed frame. */}
      <div
        aria-hidden
        className="absolute inset-[7%] rounded-[8px] border border-ink/[0.09]"
      />

      <div className="relative flex h-full w-full flex-col justify-between p-[9%]">
        <div className="flex items-start justify-between">
          <span className="font-sans text-[0.5em] font-medium tracking-[0.28em] text-ink/40 uppercase">
            {edition}
          </span>
          <span
            aria-hidden
            className="mt-[0.35em] block h-[0.45em] w-[0.45em] rounded-full bg-ink"
          />
        </div>

        <div className="-mt-[8%]">
          <h3 className="type-display text-[1.9em] leading-[0.85] text-ink">
            {wordmark[0]}
            <br />
            {wordmark[1]}
          </h3>
          <div className="mt-[0.9em] h-px w-[42%] bg-ink/15" />
          <p className="mt-[0.8em] font-sans text-[0.46em] leading-[1.6] font-medium tracking-[0.2em] text-ink/45 uppercase">
            {meta.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        <p className="font-sans text-[0.42em] tracking-[0.24em] text-ink/30 uppercase">
          {footnote}
        </p>
      </div>

      {/* Hairline that reads as the folded cover edge. */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-[5.5%] w-px bg-ink/[0.07]"
      />
      <div
        aria-hidden
        className="absolute inset-0 rounded-l-[3px] rounded-r-[14px] ring-1 ring-ink/[0.12] ring-inset"
      />
    </div>
  );
}

export function Notebook3D({
  progress,
  className,
  coverSrc,
  coverAlt = '',
  locale = 'en',
}: {
  /** 0 → 1 scroll progress used to rotate the object. */
  progress?: MotionValue<number>;
  className?: string;
  coverSrc?: string;
  coverAlt?: string;
  locale?: string;
}) {
  const [angle, setAngle] = useState<{x:number;y:number}|null>(null);
  const drag = useRef<{id:number;x:number;y:number;rx:number;ry:number}|null>(null);
  const [dragging,setDragging] = useState(false);
  const hint = locale==='fr'?'Glissez pour tourner · flèches du clavier':locale==='ar'?'اسحب للتدوير · أو استخدم مفاتيح الأسهم':'Drag to rotate · or use arrow keys';
  const reduced = useReducedMotion();
  const fallback = useScroll().scrollYProgress;
  const source = progress ?? fallback;

  const smooth = useSpring(source, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.0005,
  });

  const rotateY = useTransform(smooth, [0, 1], [-26, 16]);
  const rotateX = useTransform(smooth, [0, 1], [10, -6]);
  const rotateZ = useTransform(smooth, [0, 1], [-3, 2]);
  const shadowScale = useTransform(smooth, [0, 0.5, 1], [0.94, 1, 0.9]);

  const manualX = useSpring(10, {stiffness:220,damping:30});
  const manualY = useSpring(-26, {stiffness:220,damping:30});
  useEffect(()=>{if(angle){manualX.set(angle.x);manualY.set(angle.y)}},[angle,manualX,manualY]);
  const still = { rotateY: -20, rotateX: 8, rotateZ: -2 };

  return (
    <div
      className={cn("relative select-none", className)}
      style={
        {
          "--bw": "clamp(190px, 24vw, 320px)",
          "--bh": "calc(var(--bw) * 1.4)",
          "--bd": "calc(var(--bw) * 0.11)",
          perspective: "1700px",
        } as CSSProperties
      }
    >
      {/* Contact shadow on the page beneath the object. */}
      <motion.div
        aria-hidden
        className="absolute top-[calc(50%+var(--bh)*0.60)] left-1/2 h-[calc(var(--bw)*0.30)] w-[calc(var(--bw)*1.15)] -translate-x-1/2 rounded-[50%] bg-ink/20 blur-2xl"
        style={reduced ? undefined : { scaleX: shadowScale }}
        animate={reduced ? undefined : { opacity: [0.5, 0.32, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex h-[calc(var(--bh)*1.25)] items-center justify-center preserve-3d outline-offset-4 focus-visible:outline-2" tabIndex={0} role="group" aria-label={hint} style={{touchAction:'pan-y',cursor:dragging?'grabbing':'grab'}}
        onDragStart={e=>e.preventDefault()}
        onPointerDown={e=>{if(e.button!==0)return;const current=angle??{x:reduced?8:rotateX.get(),y:reduced?-20:rotateY.get()};drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,rx:current.x,ry:current.y};e.currentTarget.setPointerCapture(e.pointerId);manualX.jump(current.x);manualY.jump(current.y);setDragging(true)}}
        onPointerMove={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;setAngle({x:Math.max(-45,Math.min(45,d.rx-(e.clientY-d.y)*.3)),y:d.ry+(e.clientX-d.x)*.6})}}
        onPointerUp={()=>{drag.current=null;setDragging(false)}}
        onPointerCancel={()=>{drag.current=null;setDragging(false)}}
        onLostPointerCapture={()=>{drag.current=null;setDragging(false)}}
        onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home'){setAngle(null);return}const a=angle??{x:reduced?8:rotateX.get(),y:reduced?-20:rotateY.get()};setAngle({x:Math.max(-45,Math.min(45,a.x+(e.key==='ArrowUp'?-10:e.key==='ArrowDown'?10:0))),y:a.y+(e.key==='ArrowRight'?15:e.key==='ArrowLeft'?-15:0)})}}
      >
        {/* Idle float. */}
        <motion.div
          className="preserve-3d"
          animate={reduced ? undefined : dragging||angle ? {y:0} : { y: [0, -8, 0] }}
          transition={dragging||angle ? {duration:.25} : {duration:7,repeat:Infinity,ease:"easeInOut"}}
        >
          <motion.div
            className="relative preserve-3d"
            style={
              angle
                ? {rotateX:reduced?angle.x:manualX,rotateY:reduced?angle.y:manualY,rotateZ:0,transformStyle:"preserve-3d"}
                : reduced
                ? still
                : { rotateY, rotateX, rotateZ, transformStyle: "preserve-3d" }
            }
          >
            {/* Front cover */}
            <Face
              width="var(--bw)"
              height="var(--bh)"
              transform="translateZ(calc(var(--bd) / 2))"
              style={{
                boxShadow: "var(--shadow-object)",
                // Cover typography is set in em so it scales with the object.
                fontSize: "calc(var(--bw) * 0.09)",
              }}
              className="rounded-l-[3px] rounded-r-[14px]"
            >
              {coverSrc ? <img draggable={false} src={coverSrc} alt={coverAlt} width={1000} height={1414} className="h-full w-full rounded-[3px] object-cover" /> : <NotebookCover />}
            </Face>

            {/* Back cover */}
            <Face
              width="var(--bw)"
              height="var(--bh)"
              transform="rotateY(180deg) translateZ(calc(var(--bd) / 2))"
              className="rounded-l-[14px] rounded-r-[3px] bg-[#f4f4f4] ring-1 ring-ink/10 ring-inset"
            />

            {/* Fore-edge — the visible block of pages */}
            <Face
              width="var(--bd)"
              height="var(--bh)"
              transform="rotateY(90deg) translateZ(calc(var(--bw) / 2))"
              className="rounded-[2px]"
              style={paperEdge}
            >
              <div className="h-full w-full bg-gradient-to-l from-ink/[0.08] to-transparent" />
            </Face>

            {/* Spine */}
            <Face
              width="var(--bd)"
              height="var(--bh)"
              transform="rotateY(-90deg) translateZ(calc(var(--bw) / 2))"
              className="flex items-center justify-center overflow-hidden rounded-[3px] bg-white ring-1 ring-ink/10 ring-inset"
            >
              <span className="type-display rotate-180 text-[calc(var(--bd)*0.42)] tracking-[0.06em] whitespace-nowrap text-ink [writing-mode:vertical-rl]">
                THE WIZ
              </span>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(10,10,10,0.10), rgba(255,255,255,0) 40%, rgba(10,10,10,0.08))",
                }}
              />
            </Face>

            {/* Head and tail edges */}
            <Face
              width="var(--bw)"
              height="var(--bd)"
              transform="rotateX(90deg) translateZ(calc(var(--bh) / 2))"
              style={paperEdgeHorizontal}
              className="rounded-[2px]"
            >
              <div className="h-full w-full bg-gradient-to-b from-white/70 to-transparent" />
            </Face>
            <Face
              width="var(--bw)"
              height="var(--bd)"
              transform="rotateX(-90deg) translateZ(calc(var(--bh) / 2))"
              style={paperEdgeHorizontal}
              className="rounded-[2px]"
            >
              <div className="h-full w-full bg-gradient-to-t from-ink/15 to-transparent" />
            </Face>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
