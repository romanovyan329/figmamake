import imgImagePhotoroom21 from "../app/assets/logo.svg";

function Frame() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col gap-[9px] items-center left-1/2 top-1/2 w-[171px]">
      <div className="relative shrink-0 size-[144px]" data-name="image-Photoroom (2) 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImagePhotoroom21} />
      </div>
      <p className="font-['Figtree:Black',sans-serif] font-black leading-[normal] min-w-full relative shrink-0 text-[18px] text-center text-white uppercase w-[min-content] whitespace-pre-wrap">loading</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[15px] text-center text-white w-[min-content] whitespace-pre-wrap">Preparing your season…</p>
    </div>
  );
}

export default function Splash() {
  return (
    <div className="relative size-full" data-name="Splash" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 375 812\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0.0000013921 98.5 -46.51 6.5731e-7 188 -0.0000026569)\\'><stop stop-color=\\'rgba(32,125,240,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(68,145,244,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(104,164,248,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(140,184,251,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(176,203,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }}>
      <Frame />
    </div>
  );
}