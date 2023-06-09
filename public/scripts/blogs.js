$(document).ready(function Naz() {
    function getBlogs() {
        fetch(`/api/getblogs`)
        .then((response) => response.json())
        .then((result) => {
            blogs = result.blogs;
            initalize()
        })
    }

    function initalize() {
        blogs.forEach(blog => {
            $('.appendclass').append(`
            <a class="item" href="blog/${blog.blogid}">
                    <div class="title">
                        ${blog.title}
                    </div>
                    <div class="desc">
                        ${blog.description}
                    </div>
                    <div class="props">
                        <div class="author">
                            ${blog.auther}
                        </div>
                        <div class="readtime">
                            ${blog.readtime}
                        </div>
                        <div class="date">
                            ${blog.createDate}
                        </div>
                    </div>
                </a>
            `)
        })
    }

    $(".logo").click(() => window.location.href = '/')
    getBlogs();
})