import { Cat, Dog, Backpack, Book, BookOpen, Beef } from "lucide-react";
import sofaImg from "@/assets/images/sofa.png";
import tableImg from "@/assets/images/table.png";
import bedImg from "@/assets/images/bed.png";
import chairImg from "@/assets/images/chair.png";
import lampImg from "@/assets/images/lamp.png";
import shelfImg from "@/assets/images/shelf.png";
import mirrorImg from "@/assets/images/mirror.png";
import doorImg from "@/assets/images/door.png";
import windowImg from "@/assets/images/window.png";
import rugImg from "@/assets/images/rug.png";
import wardrobeImg from "@/assets/images/wardrobe.png";
import fridgeImg from "@/assets/images/fridge.png";
import cookerImg from "@/assets/images/cooker.png";
import deskImg from "@/assets/images/desk.png";
import bookcaseImg from "@/assets/images/bookcase.png";
import armchairImg from "@/assets/images/armchair.png";

type SceneKey =
  | "on-sofa"
  | "under-table"
  | "in-box"
  | "next-to-bed"
  | "behind-chair"
  | "in-front-sofa"
  | "between"
  | "on-shelf"
  | "next-to-fridge"
  | "under-desk"
  | "on-bookcase"
  | "behind-armchair";

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
      {/* ── Original scenes ── */}
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
            {/* Ball inside box */}
            <div className="bg-coral rounded-full size-14 shadow border-4 border-white/60" />
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
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-grape rounded-2xl p-3 shadow-md flex items-center justify-center">
              <Backpack size={42} className="text-white" strokeWidth={2.5} />
            </div>
            <img src={chairImg} alt="" className="w-full h-auto relative z-10" />
          </div>
        </div>
      )}
      {sceneKey === "in-front-sofa" && (
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="relative w-3/4 max-w-xs flex flex-col items-center">
            <img src={sofaImg} alt="" className="w-full h-auto" />
            {/* Rug in front of sofa */}
            <img src={rugImg} alt="" className="w-3/4 h-auto -mt-2 z-10" />
          </div>
        </div>
      )}
      {sceneKey === "between" && (
        <div className="absolute inset-0 flex items-center justify-center gap-3">
          <img src={windowImg} alt="" className="w-1/4 h-auto" />
          <img src={doorImg} alt="" className="w-1/4 h-auto" />
          <img src={wardrobeImg} alt="" className="w-1/4 h-auto" />
        </div>
      )}
      {sceneKey === "on-shelf" && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-2/3 max-w-[240px]">
            <img src={shelfImg} alt="" className="w-full h-auto" />
            {/* Books on shelf */}
            <div className="absolute top-0 left-0 right-0 flex justify-center gap-1">
              <Book size={28} className="text-coral" strokeWidth={2} />
              <Book size={28} className="text-sky" strokeWidth={2} />
              <Book size={28} className="text-leaf" strokeWidth={2} />
            </div>
          </div>
        </div>
      )}

      {/* ── New Chapter 3 scenes ── */}
      {sceneKey === "next-to-fridge" && (
        <div className="absolute inset-0 flex items-end justify-center gap-4 pb-4">
          <img src={cookerImg} alt="" className="w-1/3 h-auto" />
          <img src={fridgeImg} alt="" className="w-1/3 h-auto" />
        </div>
      )}
      {sceneKey === "under-desk" && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-3/4 max-w-xs">
            <img src={deskImg} alt="" className="w-full h-auto relative z-10" />
            <img src={rugImg} alt="" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-auto z-0" />
          </div>
        </div>
      )}
      {sceneKey === "on-bookcase" && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-2/3 max-w-[240px]">
            <img src={bookcaseImg} alt="" className="w-full h-auto" />
            <img
              src={mirrorImg}
              alt=""
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-1/3 h-auto"
            />
          </div>
        </div>
      )}
      {sceneKey === "behind-armchair" && (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-3/4 max-w-xs">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-100 rounded-full p-2 shadow-md border-2 border-amber-300">
              <img src={lampImg} alt="" className="w-10 h-auto" />
            </div>
            <img src={armchairImg} alt="" className="w-full h-auto relative z-10" />
          </div>
        </div>
      )}

      {/* Decorative floor */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-coral/30 via-sun/30 to-leaf/30" />
    </div>
  );
}

export type { SceneKey };
