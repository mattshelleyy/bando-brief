module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const body = req.body;
    const content = body && body.content ? body.content : null;
    if (!content) return res.status(400).json({ error: 'No content provided' });

    const token = process.env.GITHUB_TOKEN;
    const owner = 'mattshelleyy';
    const repo = 'bando-brief';
    const path = 'data/digest.json';

    const getFile = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    const fileData = await getFile.json();
    const sha = fileData.sha;

    const jsonContent = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const encoded = Buffer.from(jsonContent).toString('base64');

    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
      body: JSON.stringify({ message: 'Daily digest update', content: encoded, sha: sha })
    });

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

