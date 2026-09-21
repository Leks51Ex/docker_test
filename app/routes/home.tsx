import type { Route } from "./+types/home";
import { Pool } from "pg";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`INSERT INTO visits DEFAULT VALUES`);
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM visits`
    );
    return { ok: true as const, count: result.rows[0].count };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await pool.end();
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div>
        <div className="title">Docker test app_4</div>
        {loaderData.ok ? (
          <div className="envTitle">count= {loaderData.count}</div>
        ) : (
          <div className="envTitle"> {loaderData.error}</div>
        )}
      </div>
    </main>
  );
}
