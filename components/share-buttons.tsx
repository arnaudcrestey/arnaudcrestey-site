const shareText = "Je viens de découvrir pourquoi ma vie professionnelle bloque.";

export function ShareButtons() {
  const encodedText = encodeURIComponent(shareText);
  const url = encodeURIComponent("https://procoach.vercel.app");

  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { label: "Twitter", href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}` },
    { label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encodedText}%20${url}` }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
        >
          Partager sur {link.label}
        </a>
      ))}
    </div>
  );
}
