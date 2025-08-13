import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });

  const navigate = useNavigate();

  // Connect to MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error('MetaMask connection error:', err);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('email', formData.email);
    // Log or send formData + walletAddress to backend here
    console.log({
      ...formData,
      walletAddress,
    });

    if (formData.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/consultant/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
        <p className="text-muted-foreground text-center text-sm">Sign in to your account</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultant">Consultant</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* MetaMask Wallet Connection */}
        <div className="space-y-2">
          <Label htmlFor="wallet">Wallet Address</Label>
          <div className="flex items-center gap-2">
            <Input
              id="wallet"
              value={walletAddress || 'Not connected'}
              readOnly
              className="flex-1"
            />
            <Button type="button" onClick={connectWallet}>
              {walletAddress ? 'Connected' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={!walletAddress}>
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}
