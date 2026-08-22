"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [message, setMessage] = useState("Testing Supabase...");

  useEffect(() => {
    async function testConnection() {
      const supabase = createClient();

      const { error } = await supabase
        .from("nonexistent_table")
        .select("*")
        .limit(1);

      if (error) {
        setMessage(`Supabase responded: ${error.message}`);
      } else {
        setMessage("Supabase connection works!");
      }
    }

    testConnection();
  }, []);

  return (
    <main>
      <h1>Supabase Test</h1>
      <p>{message}</p>
    </main>
  );
}