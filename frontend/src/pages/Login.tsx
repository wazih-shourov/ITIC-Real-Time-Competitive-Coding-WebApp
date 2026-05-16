import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '@lib/supabase'
import { AuthInput } from '@components/core/AuthInput'
import { toast } from 'sonner'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      toast.success('Welcome back!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background-primary p-4 bg-[url('/auth-bg.png')] bg-cover bg-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-[480px] bg-background-secondary p-8 rounded-lg shadow-2xl border border-white/5"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100">Welcome back!</h1>
          <p className="text-gray-400 mt-1">We're so excited to see you again!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email or Phone Number"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div className="space-y-1">
            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Link to="/forgot-password" className="text-brand hover:underline text-sm font-medium block">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="text-sm text-gray-400">
            Need an account?{' '}
            <Link to="/signup" className="text-brand hover:underline font-medium">
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
