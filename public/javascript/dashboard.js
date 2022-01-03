function newPostBtnHandler(event) {
    document.location.replace('/dashboard/add-post');
}

document.querySelector('#new-post-btn').addEventListener('click', newPostBtnHandler);