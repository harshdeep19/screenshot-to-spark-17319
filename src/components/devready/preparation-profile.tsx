import { useDev } from "@/lib/dev-store";
import { skills, type Skill } from "@/lib/devready/progress";
export function PreparationProfile({ detailed = false }: { detailed?: boolean }) {
  const store = useDev();
  const changeSkill = (key: "strong" | "weak", skill: Skill) => {
    const values = store.profile[key];
    store.updateProfile({
      [key]: values.includes(skill) ? values.filter((x) => x !== skill) : [...values, skill],
      [key === "strong" ? "weak" : "strong"]: store.profile[
        key === "strong" ? "weak" : "strong"
      ].filter((x) => x !== skill),
    });
  };
  return (
    <div className="profile-fields">
      <label>
        Your name
        <input
          className="field mt-2"
          aria-label="Your name"
          value={store.profile.name}
          maxLength={60}
          onChange={(e) => store.updateProfile({ name: e.target.value })}
        />
      </label>
      <label>
        Target role
        <input
          className="field mt-2"
          aria-label="Target role"
          value={store.target}
          onChange={(e) => store.setTarget(e.target.value)}
        />
      </label>
      <label className="profile-wide">
        Current learning goal
        <input
          className="field mt-2"
          aria-label="Current learning goal"
          value={store.profile.goal}
          onChange={(e) => store.updateProfile({ goal: e.target.value })}
        />
      </label>
      <label>
        Interview date
        <input
          className="field mt-2"
          type="date"
          aria-label="Interview date"
          value={store.profile.interviewDate}
          onChange={(e) => store.updateProfile({ interviewDate: e.target.value })}
        />
      </label>
      <label>
        Daily study time (minutes)
        <input
          className="field mt-2"
          type="number"
          min="15"
          max="480"
          step="15"
          aria-label="Daily study time"
          value={store.profile.dailyMinutes}
          onChange={(e) =>
            store.updateProfile({
              dailyMinutes: Math.max(15, Math.min(480, Number(e.target.value))),
            })
          }
        />
      </label>
      {detailed && (
        <>
          <label>
            Years of experience
            <select
              className="field mt-2"
              aria-label="Years of experience"
              value={store.experience}
              onChange={(e) => store.setExperience(e.target.value)}
            >
              {["Fresher", "1–3 years", "3–5 years", "5–8 years", "8+ years"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Current skill level
            <select
              className="field mt-2"
              aria-label="Current skill level"
              value={store.profile.level}
              onChange={(e) => store.updateProfile({ level: e.target.value })}
            >
              {["Beginner", "Intermediate", "Advanced", "Senior engineer"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="profile-wide">
            Target companies (optional)
            <input
              className="field mt-2"
              aria-label="Target companies"
              placeholder="Microsoft, Adobe, Atlassian…"
              value={store.profile.companies}
              onChange={(e) => store.updateProfile({ companies: e.target.value })}
            />
          </label>
          {(["strong", "weak"] as const).map((key) => (
            <fieldset className="profile-wide" key={key}>
              <legend className="mb-3 font-semibold">
                {key === "strong" ? "Strong areas" : "Areas to improve"}
              </legend>
              <div className="skill-options">
                {skills.map((skill) => (
                  <label key={skill}>
                    <input
                      className="check-control"
                      type="checkbox"
                      checked={store.profile[key].includes(skill)}
                      onChange={() => changeSkill(key, skill)}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </>
      )}
    </div>
  );
}
