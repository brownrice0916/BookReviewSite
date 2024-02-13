import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (!req.query?.query || req.query?.displayName) return res.status(400).json({ error: 'Invalid values' });

  const response = await fetch(`https://openapi.naver.com/v1/search/book.json?` + new URLSearchParams(req.query), {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_CLIENT_SECRET
    }
  });

  const data = await response.json();

  res.json(data);
}
