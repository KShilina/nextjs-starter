"use client";
import { useState, useEffect} from "react";

export default function Home() {
  const[posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    async function fetchData() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!res.ok){
          throw new Error("Faild to fetch");
        }
        const data = await res.json();
        setPosts(data.slice(0.5)); // show first 5

      } catch(err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); //runs once on mount

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error:{error}</p>


  return (
    <main>
      <h1>Hello Test Project: Fetch Example</h1>
      <ul>
        {posts.map((post) => (
           <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
           </li>
        ))}
        
      </ul>
    </main>
  );
}
