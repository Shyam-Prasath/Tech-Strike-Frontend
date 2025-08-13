import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMetaMask } from '@/hooks/useMetaMask'; // custom wallet hook
import { supabase } from '@/lib/supabaseClient'; // make sure this file is set up
import bcrypt from 'bcryptjs'; // for password hashing
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { walletAddress, connectWallet } = useMetaMask();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!walletAddress) {
      alert('Please connect your MetaMask wallet');
      return;
    }
    try {
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const { error } = await supabase.from('users').insert([
      {
        username: formData.username,
        email: formData.email,
        password: hashedPassword,
        role: formData.role,
        wallet_address: walletAddress
      }
    ]);

    if (error) {
      alert('Error creating user: ' + error.message);
      return;
    }

    alert('Registration successful!');
    // Redirect to sign in after successful registration
    navigate('/signin');
    } catch (err) {
    console.error('Registration failed:', err);
    alert('Something went wrong!');
  }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-center">Create Account</h2>
        <p className="text-muted-foreground text-center text-sm">Join the ConsultIQ platform</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Consultant">Consultant</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
          <Label htmlFor="wallet">MetaMask Wallet</Label>
          {walletAddress ? (
            <p className="text-sm text-green-600">Connected: {walletAddress}</p>
          ) : (
            <Button type="button" variant="outline" onClick={connectWallet}>
              Connect MetaMask
            </Button>
          )}
    </div>

      <Button type="submit" className="w-full" size="lg">
        <UserPlus className="h-4 w-4 mr-2" />
        Create Account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/signin" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}