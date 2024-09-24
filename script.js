const postsContainer = document.getElementById('postsContainer');
const postInput = document.getElementById('postInput');
const imageInput = document.getElementById('imageInput');
const postButton = document.getElementById('postButton');
const emojis = document.querySelectorAll('.emoji');
let posts = [];

postButton.addEventListener('click', () => {
    const content = postInput.value.trim();
    const imageFile = imageInput.files[0];

    if (content || imageFile) {
        const post = {
            id: Date.now(),
            content: content,
            image: imageFile ? URL.createObjectURL(imageFile) : null,
            likes: 0,
            dislikes: 0,
            comments: [],
            timestamp: new Date().toLocaleString()
        };
        posts.push(post);
        postInput.value = '';
        imageInput.value = '';
        renderPosts();
    }
});

function renderPosts() {
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <div class="post-content">${post.content}</div>
            ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
            <div class="post-meta">Posted on: ${post.timestamp}</div>
            <button class="likeButton" data-id="${post.id}">Like (${post.likes})</button>
            <button class="dislikeButton" data-id="${post.id}">Dislike (${post.dislikes})</button>
            <div class="comment-section">
                <input type="text" placeholder="Add a comment..." class="commentInput" data-id="${post.id}">
                <button class="commentButton" data-id="${post.id}">Comment</button>
                <div class="emoji-picker">
                    <span class="emoji" role="button" aria-label="smile">😊</span>
                    <span class="emoji" role="button" aria-label="thumbs up">👍</span>
                    <span class="emoji" role="button" aria-label="heart">❤️</span>
                    <span class="emoji" role="button" aria-label="laugh">😂</span>
                </div>
            </div>
            <div class="comments">
                ${post.comments.map(comment => `<div class="comment">${comment}</div>`).join('')}
            </div>
        `;
        postsContainer.appendChild(postDiv);
    });

    document.querySelectorAll('.likeButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = Number(e.target.getAttribute('data-id'));
            const post = posts.find(p => p.id === postId);
            post.likes++;
            renderPosts();
        });
    });

    document.querySelectorAll('.dislikeButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = Number(e.target.getAttribute('data-id'));
            const post = posts.find(p => p.id === postId);
            post.dislikes++;
            renderPosts();
        });
    });

    document.querySelectorAll('.commentButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = Number(e.target.getAttribute('data-id'));
            const commentInput = document.querySelector(`.commentInput[data-id="${postId}"]`);
            const comment = commentInput.value.trim();
            if (comment) {
                const post = posts.find(p => p.id === postId);
                post.comments.push(comment);
                commentInput.value = '';
                renderPosts();
            }
        });
    });

    // Emoji functionality for each post
    document.querySelectorAll('.emoji').forEach(emoji => {
        emoji.addEventListener('click', (e) => {
            const postId = Number(e.target.closest('.comment-section').querySelector('.commentButton').getAttribute('data-id'));
            const commentInput = document.querySelector(`.commentInput[data-id="${postId}"]`);
            commentInput.value += emoji.textContent; // Add the emoji to the input
            commentInput.focus(); // Focus back on the input
        });
    });
}
