import "../styles/globals.css";
import Link from "next/link";

function Marketplace({ Component, pageProps }) {
  return (
    <div>
      <nav className='p-5 border-b' style={{ backgroundColor: "black" }}>
        <p className='font-bold text-white first-letter:uppercase first-letter:text-4xl md:first-letter:text-8xl text-4x1 hover:text-[#66666e] cursor-pointer'>
          Marketplace
        </p>
        <div className='flex justify-center mt-1'>
          <Link href='/'>
            <a className='mr-4 text-[#66666e] hover:text-[#e6e6e9]'>
              Main Marketplace
            </a>
          </Link>
          <Link href='/mint-item'>
            <a className='mr-4 text-[#66666e] hover:text-[#e6e6e9]'>
              Mint Tokens
            </a>
          </Link>
          <Link href='/my-nfts'>
            <a className='mr-4 text-[#66666e] hover:text-[#e6e6e9]'>My NFts</a>
          </Link>
          <Link href='/account-dashboard'>
            <a className='mr-4 text-[#66666e] hover:text-[#e6e6e9]'>
              Account Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default Marketplace;
