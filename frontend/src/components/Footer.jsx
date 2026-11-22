export default function Footer() {
  return (
    <footer className="border-t border-menta-borda bg-white">
      <p className="mx-auto max-w-6xl px-4 py-4 text-sm sm:px-6">
        &copy; {new Date().getFullYear()} MontaAqui
      </p>
    </footer>
  )
}
