function Frame() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#f0a720] content-stretch flex h-[42px] items-center justify-center left-1/2 px-[50px] py-[18px] rounded-[6px] top-[717px]">
      <p className="font-['Figtree:Black',sans-serif] font-black leading-[normal] relative shrink-0 text-[18px] text-center text-white uppercase">CONTINUE</p>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_1.6px_0px_rgba(255,255,255,0.5)]" />
    </div>
  );
}

export default function Example() {
  return (
    <div className="relative size-full" data-name="example" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 375 812\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0.0000013921 98.5 -46.51 6.5731e-7 188 -0.0000026569)\\'><stop stop-color=\\'rgba(32,125,240,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(68,145,244,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(104,164,248,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(140,184,251,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(176,203,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }}>
      <p className="-translate-x-1/2 absolute font-['Figtree:Black',sans-serif] font-black leading-[normal] left-[calc(50%+0.5px)] text-[18px] text-center text-white top-[567px] uppercase">Smart Fishing, Simplified</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-1/2 not-italic text-[15px] text-center text-white top-[604px] w-[345px] whitespace-pre-wrap">Get instant rig recommendations based on depth, season, fish type, water temperature, and fishing style. Explore gear guides, track your preferences, and discover what works best for your conditions — all in one place.</p>
      <Frame />
    </div>
  );
}