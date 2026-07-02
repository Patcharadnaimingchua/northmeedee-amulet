export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">

      <div className="container mx-auto px-4 py-8 text-center">

        <h2 className="text-xl font-bold">
          NorthAmulet
        </h2>

        <p className="mt-2 text-gray-400">
          ตลาดพระเครื่องออนไลน์
        </p>

        <p className="mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} NorthAmulet
        </p>

      </div>

    </footer>
  );
}