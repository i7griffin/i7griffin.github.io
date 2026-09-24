// Builds activity.json: your contribution calendar (last year), public repos and latest events.
const fs = require("fs");
const user = process.env.GH_USER, token = process.env.GH_TOKEN;
const headers = { Authorization: "Bearer " + token, "User-Agent": "portfolio-activity" };

const query = `query($login:String!){
  user(login:$login){
    contributionsCollection{ contributionCalendar{ weeks{ contributionDays{ date contributionCount } } } }
    repositories(first:100, ownerAffiliations:OWNER, privacy:PUBLIC, orderBy:{field:PUSHED_AT, direction:DESC}){
      nodes{ name url isFork description pushedAt primaryLanguage{ name } }
    }
  }
}`;

(async () => {
  const g = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: user } })
  }).then(r => r.json());
  if (g.errors || !g.data || !g.data.user) throw new Error(JSON.stringify(g.errors || g));

  const u = g.data.user, days = {};
  u.contributionsCollection.contributionCalendar.weeks.forEach(w =>
    w.contributionDays.forEach(d => { if (d.contributionCount) days[d.date] = d.contributionCount; }));

  const ev = await fetch(`https://api.github.com/users/${user}/events/public?per_page=10`, { headers }).then(r => r.json());

  const out = {
    generated: new Date().toISOString(),
    days,
    repos: u.repositories.nodes.map(r => ({
      name: r.name, html_url: r.url, fork: r.isFork, description: r.description,
      pushed_at: r.pushedAt, language: r.primaryLanguage ? r.primaryLanguage.name : null
    })),
    recent: (Array.isArray(ev) ? ev : []).slice(0, 5).map(e => ({ type: e.type, created_at: e.created_at, repo: e.repo.name }))
  };
  fs.writeFileSync("activity.json", JSON.stringify(out));
  console.log("Wrote activity.json:", Object.keys(days).length, "active days,", out.repos.length, "repos");
})().catch(e => { console.error(e); process.exit(1); });
