import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CybersecurityNews = () => {
  const [articleContent, setArticleContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://article-extractor2.p.rapidapi.com/article/proxy/parse',
          params: {
            url: 'https://thehackernews.com/search/label/Vulnerability',
            word_per_minute: '300',
            desc_truncate_len: '210',
            desc_len_min: '180',
            content_len_min: '200'
          },
          headers: {
            'x-rapidapi-key': 'API_KEY',
            'x-rapidapi-host': 'article-extractor2.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        console.log('API response:', response.data);

        if (response.data && response.data.data && typeof response.data.data.content === 'string') {
          setArticleContent(response.data.data.content);
        } else {
          console.error('Unexpected response format:', response.data);
          setError(new Error('Unexpected response format'));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-white">Error fetching articles: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 text-white bg-gray-900 ">
      <Link to="/">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
          Back to Main Page
        </button>
      </Link>
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: articleContent }} />
      </div>
    </div>
  );
};

export default CybersecurityNews;
