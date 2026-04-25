import { Cat, Dog, Heart, Square, Circle, Tv, ShoppingBasket } from "lucide-react";
import sofaImg from "@/assets/images/sofa.png";
import tableImg from "@/assets/images/table.png";
import bedImg from "@/assets/images/bed.png";
import chairImg from "@/assets/images/chair.png";
import lampImg from "@/assets/images/lamp.png";
import shelfImg from "@/assets/images/shelf.png";
import mirrorImg from "@/assets/images/mirror.png";
import doorImg from "@/assets/images/door.png";
import windowImg from "@/assets/images/window.png";

type SceneKey =
  | "on-sofa"
  | "under-table"
  | "in-box"
  | "next-to-bed"
  | "behind-chair"
  | "in-front-sofa"
  | "between"
  | "on-shelf";

interface PrepositionSceneProps {
  sceneKey: SceneKey;
  className?: string;
}

export function PrepositionScene({ sceneKey, className }: PrepositionSceneProps) {
  return (
    <div
      className={`relative bg-gradient-to-b from-sky/15 via-white to-sun/15 rounded-3xl overflow-hidden border-2 border-sky/20 ${className ?? ""}`}
      style={{ aspectRatio: "4/3" }}
    >
      {sceneKey === "on-sofa" && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-3/4 max-w-xs">
            <img src={sofaImg} alt="" className="w-full h-auto" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-coral rounded-full p-3 shadow-md">
              <Cat size={48} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )}
      {sceneKey === "under-table" && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-3/4 max-w-xs">
            <img src={tableImg} alt="" className="w-full h-auto relative z-10" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 rounded-full p-3 shadow-md z-20">
              <Dog size={42} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )}
      {sceneKey === "in-box" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative bg-amber-200 border-4 border-amber-400 rounded-2xl flex items-center justify-center shadow-md"
            style={{ width: "60%", height: "60%" }}
          >
            <Square size={80} className="text-coral" fill="currentColor" strokeWidth={2.5} />
            <div className="absolute -top-2 left-0 right-0 h-3 bg-amber-300 rounded-t-xl border-t-4 border-amber-400" />
          </div>
        </div>
      )}
      {sceneKey === "next-to-bed" && (
        <div className="absolute inset-0 flex items-end justify-center gap-4 pb-4">
          <img src={bedImg} alt="" className="w-1/2 h-auto" />
          <img src={lampImg} alt="" className="w-1/4 h-auto" />
        </div>
      )}
      {sceneKey === "behind-chair" && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-1/2 max-w-[200px]">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-sky rounded-full size-16 shadow-md flex items-center justify-center">
              <Circle size={42} className="text-white" fill="currentColor" />
            </div>
            <img src={chairImg} alt="" className="w-full h-auto relative z-10" />
          </div>
        </div>
      )}
      {sceneKey === "in-front-sofa" && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-3/4 max-w-xs">
            <img src={sofaImg} alt="" className="w-full h-auto" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-700 rounded-xl p-2 shadow-md">
              <Tv size={48} className="text-sun" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )}
      {sceneKey === "between" && (
        <div className="absolute inset-0 flex items-center justify-center gap-3">
          <img src={windowImg} alt="" className="w-1/4 h-auto" />
          <img src={mirrorImg} alt="" className="w-1/4 h-auto" />
          <img src={doorImg} alt="" className="w-1/4 h-auto" />
        </div>
      )}
      {sceneKey === "on-shelf" && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-1/2 max-w-[200px]">
            <img src={shelfImg} alt="" className="w-full h-auto" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-600 rounded-2xl p-3 shadow-md">
              <ShoppingBasket size={40} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )}
      {/* Decorative floor */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-coral/30 via-sun/30 to-leaf/30" />
    </div>
  );
}

export type { SceneKey };
