//src/components/Footer.jsx
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full z-40 py-4 text-center border-t border-yely-white/5 bg-yely-richBlack/90 backdrop-blur-md">
      <p className="text-yely-softGray font-medium tracking-widest uppercase text-xs">
        © {currentYear} Yely. Tous droits reserves.
      </p>
    </footer>
  );
}