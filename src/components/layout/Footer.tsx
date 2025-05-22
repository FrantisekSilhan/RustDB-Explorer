import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                RustMarket
              </span>
            </Link>
            <p className="text-gray-400 mt-2 text-sm max-w-md">
              Track Rust game item prices and market data from the Steam marketplace.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-medium mb-3">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/items" className="text-gray-400 hover:text-white text-sm">
                    Items
                  </Link>
                </li>
                <li>
                  <Link href="/trending" className="text-gray-400 hover:text-white text-sm">
                    Trending
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://store.steampowered.com/itemstore/252490/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Steam Market
                  </a>
                </li>
                <li>
                  <a
                    href="https://rust.facepunch.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Rust Official
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} RustMarket Explorer. Not affiliated with Facepunch Studios or Valve.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500 text-sm">
              All game items and assets belong to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}