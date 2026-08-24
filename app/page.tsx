"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [message, setMessage] = useState("Testing Supabase...");
  const [result, setResult] = useState("");

  useEffect(() => {
    async function testConnection() {
      const supabase = createClient();

      // query the database
      const { data , error } = await supabase
        .from("profile")
        .select("*")
        .limit(1)

      if (error) {
        setMessage(`Supabase responded: ${error.message}`);
      } else if (data.length > 0) {
        setMessage("Supabase connection works!");
        setResult(data[0].display_name);
      } else {
        setMessage("Connected, but no rows were found. Check RLS.");
      }
    }

    testConnection();
  }, []);

  return (
    <main>
      <h1>Supabase Test</h1>
      <p>{message}</p>
      <p>{result}</p>
    </main>
  );
}