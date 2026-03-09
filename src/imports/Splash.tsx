export default function Splash() {
  return (
    <div className="leading-[normal] relative size-full text-center text-white" data-name="Splash" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 375 812\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0.0000013921 98.5 -46.51 6.5731e-7 188 -0.0000026569)\\'><stop stop-color=\\'rgba(32,125,240,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(68,145,244,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(104,164,248,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(140,184,251,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(176,203,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }}>
      <p className="-translate-x-1/2 absolute font-['Figtree:Black',sans-serif] font-black left-1/2 text-[18px] top-[calc(50%-11px)] uppercase">loading</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal left-1/2 not-italic text-[15px] top-[calc(50%+20px)]">Preparing your season…</p>
    </div>
  );
}