async function postContent() {
    const content = document.getElementById('post-content').value;
    if (!content) return;

    await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });

    document.getElementById('post-content').value = '';
    loadPosts();
}

async function loadPosts() {
    const response = await fetch('/posts');
    const posts = await response.json();
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.textContent = post.content;
        postsContainer.appendChild(postDiv);
    });
}

window.onload = loadPosts;
