$(document).ready(function () {
    fetch(`/api/getblog?blogid=${window.location.href.split('/').slice(-1)[0]}`)
        .then((response) => response.json())
        .then((result) => {
            $('#title').text(result.blog.title)
            $('#author').text(result.blog.auther)
            $('#date-and-readtime').text(`${result.blog.createDate} - ${result.blog.readtime}`)
            $('#body').html(marked.parse(result.blog.body))
        })
})