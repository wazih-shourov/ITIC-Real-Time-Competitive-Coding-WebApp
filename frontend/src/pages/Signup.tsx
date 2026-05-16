import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '@lib/supabase'
import { AuthInput } from '@components/core/AuthInput'
import { toast } from 'sonner'

const Signup: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
      
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account')
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
          <h1 className="text-2xl font-bold text-gray-100">Create an account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Continue'}
          </button>

          <p className="text-[12px] text-gray-400 mt-2">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="text-sm text-brand hover:underline font-medium">
            <Link to="/login">Already have an account?</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default Signup
