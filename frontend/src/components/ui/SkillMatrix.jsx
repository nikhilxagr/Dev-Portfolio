import { SKILL_GROUPS } from '@/constants/siteData'

const SkillMatrix = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {SKILL_GROUPS.map((group) => (
        <div key={group.title} className="card-surface rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-cyan-100">{group.title}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {group.items.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default SkillMatrix
