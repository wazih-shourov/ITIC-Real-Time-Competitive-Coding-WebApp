import React from 'react'
import AnimatedPageContainer from '@components/core/AnimatedPageContainer'
import Topbar from '@components/layout/Topbar'
import { User, Shield, Bell, Keyboard, Palette } from 'lucide-react'
import { cn } from '@utils/cn'

const Settings: React.FC = () => {
  return (
    <AnimatedPageContainer>
      <Topbar title="User Settings" />
      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Settings Navigation */}
        <div className="w-full lg:w-60 bg-background-sidebar p-4 space-y-1">
          <SettingsNavItem icon={User} label="My Account" active />
          <SettingsNavItem icon={Shield} label="Privacy & Safety" />
          <SettingsNavItem icon={Palette} label="Appearance" />
          <SettingsNavItem icon={Bell} label="Notifications" />
          <SettingsNavItem icon={Keyboard} label="Keybinds" />
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-background-primary">
          <div className="max-w-2xl mx-auto space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">My Account</h2>
              <div className="bg-background-secondary rounded-xl p-6 border border-white/5 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center text-2xl font-bold">JD</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">JohnDoe</h3>
                    <span className="text-gray-400">#1234</span>
                  </div>
                  <button className="bg-brand hover:bg-brand-hover px-4 py-2 rounded-md text-sm font-bold transition-colors">Edit User Profile</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <InfoField label="Username" value="JohnDoe" />
                  <InfoField label="Email" value="john.doe@example.com" />
                  <InfoField label="Phone Number" value="********1234" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Security</h2>
              <div className="bg-background-secondary rounded-xl p-6 border border-white/5">
                <button className="bg-brand/10 text-brand hover:bg-brand hover:text-white px-4 py-2 rounded-md text-sm font-bold transition-all">Change Password</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AnimatedPageContainer>
  )
}

const SettingsNavItem = ({ icon: Icon, label, active = false }: any) => (
  <div className={cn(
    "flex items-center gap-3 px-3 py-2 rounded-md group cursor-pointer transition-colors",
    active ? "bg-background-modifier text-gray-100" : "text-gray-400 hover:bg-background-modifier hover:text-gray-100"
  )}>
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
)

const InfoField = ({ label, value }: any) => (
  <div className="flex flex-col">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</span>
    <span className="text-gray-100">{value}</span>
  </div>
)

export default Settings
