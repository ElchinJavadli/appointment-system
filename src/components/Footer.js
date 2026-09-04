export default function Footer() {
  return (
    <footer className="border-t border-[#1C1F26]/10 dark:border-white/10 text-center text-sm text-[#6B6A62] dark:text-[#9B9A92] py-8 mt-10">
      © {new Date().getFullYear()} Slotly · Appointment System
    </footer>
  );
}