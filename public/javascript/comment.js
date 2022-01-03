//captures form submission for the comment button
async function commentFormHandler(event) {
    event.preventDefault();
    //gets the comments text
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
    //gets the post id from the URL
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    //if there is a text the fetch will start
    const response = await fetch(`/api/comments`, {
        method: "POST",
        body: JSON.stringify({
            comment_text,
            post_id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace(`/post/${post_id}`);
    } else {
        alert(response.statusText);
    }

}

//query selector
document.querySelector('#comment-form').addEventListener('submit', commentFormHandler);