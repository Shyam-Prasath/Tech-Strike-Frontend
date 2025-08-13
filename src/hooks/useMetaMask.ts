import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useMetaMask() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const location = useLocation();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts?.length) {
          const newAddress = accounts[0];
          setWalletAddress(newAddress);
          localStorage.setItem('wallet', newAddress); // ✅ always overwrite
        }
      } catch (err) {
        console.error("MetaMask connection error:", err);
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  useEffect(() => {
    // 🧹 Clear wallet if on login or signup
    if (['/signin', '/signup'].includes(location.pathname.toLowerCase())) {
      setWalletAddress(null);
      localStorage.removeItem('wallet');
      return;
    }

    // 🔄 Always get the latest stored wallet
    const storedAddress = localStorage.getItem('wallet');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }

    // 🔁 Listen for account changes in MetaMask
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          const newAddress = accounts[0];
          setWalletAddress(newAddress);
          localStorage.setItem('wallet', newAddress); // ✅ always overwrite on change
        } else {
          setWalletAddress(null);
          localStorage.removeItem('wallet');
        }
      });
    }

    return () => {
      window.ethereum?.removeAllListeners('accountsChanged');
    };
  }, [location.pathname]);

  return { walletAddress, connectWallet };
}
