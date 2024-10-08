const postsContainer = document.getElementById('postsContainer');
const postInput = document.getElementById('postInput');
const imageInput = document.getElementById('imageInput');
const postButton = document.getElementById('postButton');
let posts = [];

postButton.addEventListener('click', () => {
    const content = postInput.value.trim();
    const imageFile = imageInput.files[0];
    const location = prompt("Enter the location:");

    if (content || imageFile) {
        const post = {
            id: Date.now(),
            content: content,
            image: imageFile ? URL.createObjectURL(imageFile) : null,
            location: location || "Unknown Location",
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
            <div class="location"><i class="fas fa-map-marker-alt"></i> ${post.location}</div>
            <div class="post-content">${post.content}</div>
            ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
            <div class="post-meta">Posted on: ${post.timestamp}</div>
            <div class="button-group">
                <button class="likeButton" data-id="${post.id}"><i class="fas fa-thumbs-up"></i> (${post.likes})</button>
                <button class="dislikeButton" data-id="${post.id}"><i class="fas fa-thumbs-down"></i> (${post.dislikes})</button>
                <button class="shareButton" data-id="${post.id}"><i class="fas fa-share"></i></button>
                <button class="deletePostButton" data-id="${post.id}"><i class="fas fa-trash"></i></button>
            </div>
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
                ${post.comments.map(comment => `
                    <div class="comment" data-id="${comment.id}">
                        <span class="comment-user">${comment.username}:</span> ${comment.content} 
                        <button class="likeCommentButton" data-post-id="${post.id}" data-comment-id="${comment.id}"><i class="fas fa-thumbs-up"></i> (${comment.likes})</button>
                        <button class="dislikeCommentButton" data-post-id="${post.id}" data-comment-id="${comment.id}"><i class="fas fa-thumbs-down"></i> (${comment.dislikes})</button>
                        <button class="deleteCommentButton" data-post-id="${post.id}" data-comment-id="${comment.id}"><i class="fas fa-trash"></i></button>
                    </div>`).join('')}
            </div>
        `;
        postsContainer.appendChild(postDiv);
    });

    addEventListeners();
}

function addEventListeners() {
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

    document.querySelectorAll('.shareButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = Number(e.target.getAttribute('data-id'));
            const post = posts.find(p => p.id === postId);
            alert(`Post shared: ${post.content}`);
        });
    });

    document.querySelectorAll('.deletePostButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = Number(e.target.getAttribute('data-id'));
            posts = posts.filter(p => p.id !== postId);
            renderPosts();
        });
    });

    document.querySelectorAll('.commentButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = Number(e.target.getAttribute('data-id'));
            const commentInput = document.querySelector(`.commentInput[data-id="${postId}"]`);
            const commentText = commentInput.value.trim();
            const username = prompt("Enter your username:");

            if (commentText) {
                const comment = {
                    id: Date.now(),
                    content: commentText,
                    username: username || "Anonymous",
                    likes: 0,
                    dislikes: 0
                };
                const post = posts.find(p => p.id === postId);
                post.comments.push(comment);
                commentInput.value = '';
                renderPosts();
            }
        });
    });

    document.querySelectorAll('.deleteCommentButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = Number(e.target.getAttribute('data-post-id'));
            const commentId = Number(e.target.getAttribute('data-comment-id'));
            const post = posts.find(p => p.id === postId);
            post.comments = post.comments.filter(c => c.id !== commentId);
            renderPosts();
        });
    });

    // Add event listeners for like/dislike comments
    document.querySelectorAll('.likeCommentButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = Number(e.target.getAttribute('data-post-id'));
            const commentId = Number(e.target.getAttribute('data-comment-id'));
            const post = posts.find(p => p.id === postId);
            const comment = post.comments.find(c => c.id === commentId);
            comment.likes++;
            renderPosts();
        });
    });

    document.querySelectorAll('.dislikeCommentButton').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = Number(e.target.getAttribute('data-post-id'));
            const commentId = Number(e.target.getAttribute('data-comment-id'));
            const post = posts.find(p => p.id === postId);
            const comment = post.comments.find(c => c.id === commentId);
            comment.dislikes++;
            renderPosts();
        });
    });

    document.querySelectorAll('.emoji').forEach(emoji => {
        emoji.addEventListener('click', (e) => {
            const postId = Number(e.target.closest('.comment-section').querySelector('.commentButton').getAttribute('data-id'));
            const commentInput = document.querySelector(`.commentInput[data-id="${postId}"]`);
            commentInput.value += emoji.textContent; // Add the emoji to the input
            commentInput.focus(); // Focus back on the input
        });
    });
}
