import React from 'react'

const ActivityPanel: React.FC = () => {
  return (
    <aside className="w-full h-full bg-background-secondary border-l border-background-sidebar flex flex-col flex-shrink-0">
      <header className="h-12 px-4 flex items-center border-b border-background-sidebar shadow-sm">
        <h1 className="font-bold text-gray-100 uppercase text-[12px] tracking-wider">Active Now</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-background-sidebar/50 rounded-lg p-3 border border-white/5">
          <h2 className="text-sm font-semibold text-gray-100 mb-2">It's quiet for now...</h2>
          <p className="text-xs text-gray-400">
            When a friend starts an activity—like playing a game or hanging out in voice—it'll show up here!
          </p>
        </div>

        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Online — 42</h3>
          <div className="space-y-2">
            <ActivityMember name="AlexCoder" status="Solving: Graph Theory II" />
            <ActivityMember name="SarahJS" status="In Battle: vs Mike" online />
            <ActivityMember name="PythonPro" status="Online" online />
          </div>
        </section>
      </div>
    </aside>
  )
}

const ActivityMember = ({ name, status, online = false }: { name: string, status: string, online?: boolean }) => (
  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer group transition-colors">
    <div className="relative w-8 h-8 bg-background-modifier rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">
      {name.substring(0, 2).toUpperCase()}
      {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background-secondary" />}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors">{name}</span>
      <span className="text-xs text-gray-400 truncate">{status}</span>
    </div>
  </div>
)

export default ActivityPanel
