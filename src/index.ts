import { renderHtml } from "./renderHtml";

interface CreateAction {
  action: 'create';
  author: string;
  content: string;
}

interface UpdateAction {
  action: 'update';
  id: number;
  author: string;
  content: string;
}

interface DeleteAction {
  action: 'delete';
  id: number;
}

type Action = CreateAction | UpdateAction | DeleteAction;

export default {
  async fetch(request: Request, env: Env) {
    // 处理 POST 请求
    if (request.method === 'POST') {
      const data: Action = await request.json();
      
      switch (data.action) {
        case 'create':
          const insertStmt = env.DB.prepare(
            "INSERT INTO comments (author, content) VALUES (?, ?)"
          );
          await insertStmt.bind(data.author, data.content).run();
          break;

        case 'update':
          const updateStmt = env.DB.prepare(
            "UPDATE comments SET author = ?, content = ? WHERE id = ?"
          );
          await updateStmt.bind(data.author, data.content, data.id).run();
          break;

        case 'delete':
          const deleteStmt = env.DB.prepare("DELETE FROM comments WHERE id = ?");
          await deleteStmt.bind(data.id).run();
          break;

        default:
          return new Response("Invalid action", { status: 400 });
      }

      // 重定向回主页
      return new Response(null, {
        status: 302,
        headers: { Location: '/' }
      });
    }

    // 处理 GET 请求
    const stmt = env.DB.prepare("SELECT * FROM comments ORDER BY id DESC");
    const { results } = await stmt.all();

    return new Response(renderHtml(JSON.stringify(results)), {
      headers: {
        "content-type": "text/html",
      },
    });
  },
} satisfies ExportedHandler<Env>;
