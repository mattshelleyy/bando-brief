export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { Octokit } = await import('https://esm.sh/@octokit/rest');
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  
  try {
    const current = await octokit.repos.getContent({
      owner: 'mattshelleyy',
      repo: 'bando-brief',
      path: 'data/digest.json'
    });
    
    await octokit.repos.createOrUpdateFileContents({
      owner: 'mattshelleyy',
      repo: 'bando-brief',
      path: 'data/digest.json',
      message: 'Daily update',
      content: Buffer.from(req.body.content).toString('base64'),
      sha: current.data.sha
    });
    
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
