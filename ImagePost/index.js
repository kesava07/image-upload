let posts;
let myFile;
let image;

document.getElementById('myImage').style.display = 'none';
document.getElementById('loader').style.display = 'block';
fetch("http://localhost:5050/api/my-posts")
    .then(res => res.json())
    .then(data => {
        posts = data;
        displayPostsData()
        document.getElementById('loader').style.display = 'none';
    })
    .catch(err => {
        document.getElementById('loader').style.display = 'none';
    });

function handleImagePick(file) {
    const imageFile = file[0];
    const validation = validateFile(imageFile);
    if (!validation) {
        document.getElementById("fileError").style.display = 'inline-block';
        document.getElementById("fileError").innerHTML = "The file type does not supports";
        document.getElementById('myImage').style.display = 'none';
    } else {
        document.getElementById("fileError").style.display = 'none';
        image = imageFile;
        const fileReader = new FileReader();
        fileReader.onload = () => {
            previewImage(fileReader.result);
        }
        fileReader.readAsDataURL(imageFile);
    }
};

function previewImage(imageSrc) {
    document.getElementById('myImage').style.display = 'inline-block';
    document.getElementById('myImage').src = imageSrc;
}

function validateFile(file) {
    var fileTypes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png'
    ];
    for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }
    return false;
}


function postDataToServer() {
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);
    if (!!title.length && !!content.length && image !== undefined) {
        fetch("http://localhost:5050/api/my-posts", {
            method: "POST",
            body: postData
        })
            .then(res => res.json())
            .then(data => {
                updatePostsOnPostingData(data)
                clearValues();
            })
    } else {
        alert("Provide valid details")
    }
}
function updatePostsOnPostingData(data) {
    const copyData = [...posts];
    copyData.push(data.postData);
    posts = copyData;
    displayPostsData();
};

function clearValues() {
    document.getElementById("title").value = '';
    document.getElementById("content").value = '';
    document.getElementById('myImage').style.display = 'none';
    document.getElementById("imageFile").value = null;
}

function displayPostsData() {
    let postContent = ``;
    posts && posts.forEach(function (post) {
        postContent += `
        <div class='card'>
        <div class='card-body'>
        <h3>${post.title}</h3>
        <div class='text-center'><img src='${post.imagePath}' height='200' alt='${post.title}' /></div>
        <p>${post.content}</p> 
        <hr/> 
        <button onclick="deletePostData('${post._id}')">delete</button>
        </div>
        </div>
        `
    });
    document.getElementById("my_posts").innerHTML = postContent;
};

function deletePostData(postId) {
    if (postId) {
        fetch(`http://localhost:5050/api/my-posts/${postId}`, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: postId })
        })
            .then(res => res.json())
            .then(() => {
                const updatedPosts = [...posts].filter(p => p._id !== postId);
                posts = updatedPosts;
                displayPostsData();
            })
            .catch(err => {
                console.log(err)
            })
    }
}
