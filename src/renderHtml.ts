export function renderHtml(content: string) {
  const comments = JSON.parse(content);
  const commentsList = comments.map((comment: any) => `
    <div class="comment" style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>${comment.author}</strong>
        <div>
          <button onclick="editComment(${comment.id})" style="margin-right: 0.5rem;">编辑</button>
          <button onclick="deleteComment(${comment.id})" style="background: #ff4444;">删除</button>
        </div>
      </div>
      <p id="content-${comment.id}">${comment.content}</p>
      <form id="edit-form-${comment.id}" style="display: none;">
        <input type="text" id="edit-author-${comment.id}" value="${comment.author}" style="margin-right: 0.5rem;">
        <input type="text" id="edit-content-${comment.id}" value="${comment.content}" style="margin-right: 0.5rem;">
        <button type="submit">保存</button>
        <button type="button" onclick="cancelEdit(${comment.id})">取消</button>
      </form>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>D1 评论管理</title>
        <link rel="stylesheet" type="text/css" href="https://static.integrations.cloudflare.com/styles.css">
        <style>
          .form-group { margin-bottom: 1rem; }
          input, button { padding: 0.5rem; margin-right: 0.5rem; }
          button { cursor: pointer; border: none; border-radius: 4px; background: #0E838F; color: white; }
          button:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <header>
          <img src="https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/30e0d3f6-6076-40f8-7abb-8a7676f83c00/public" />
          <h1>📝 评论管理系统</h1>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 2rem;">
          <form id="add-comment-form" style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; border-radius: 4px;">
            <h3>添加新评论</h3>
            <div class="form-group">
              <input type="text" id="new-author" placeholder="作者名称" required style="width: 200px;">
            </div>
            <div class="form-group">
              <input type="text" id="new-content" placeholder="评论内容" required style="width: 400px;">
            </div>
            <button type="submit">添加评论</button>
          </form>

          <h3>评论列表</h3>
          <div id="comments-list">
            ${commentsList}
          </div>
        </main>

        <script>
          // 添加评论
          document.getElementById('add-comment-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const author = document.getElementById('new-author').value;
            const content = document.getElementById('new-content').value;
            
            try {
              const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', author, content })
              });
              
              if (response.ok) {
                window.location.reload();
              }
            } catch (error) {
              console.error('Error:', error);
            }
          });
          

          // 删除评论
          async function deleteComment(id) {
            if (!confirm('确定要删除这条评论吗？')) return;
            
            try {
              const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id })
              });
              
              if (response.ok) {
                window.location.reload();
              }
            } catch (error) {
              console.error('Error:', error);
            }
          }

          // 显示编辑表单
          function editComment(id) {
            document.getElementById(\`content-\${id}\`).style.display = 'none';
            document.getElementById(\`edit-form-\${id}\`).style.display = 'block';
          }

          // 取消编辑
          function cancelEdit(id) {
            document.getElementById(\`content-\${id}\`).style.display = 'block';
            document.getElementById(\`edit-form-\${id}\`).style.display = 'none';
          }

          // 提交编辑表单
          document.querySelectorAll('[id^="edit-form-"]').forEach(form => {
            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              const id = form.id.split('-')[2];
              const author = document.getElementById(\`edit-author-\${id}\`).value;
              const content = document.getElementById(\`edit-content-\${id}\`).value;
              
              try {
                const response = await fetch('/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'update', id, author, content })
                });
                
                if (response.ok) {
                  window.location.reload();
                }
              } catch (error) {
                console.error('Error:', error);
              }
            });
          });
        </script>
      </body>
    </html>
  `;
}
