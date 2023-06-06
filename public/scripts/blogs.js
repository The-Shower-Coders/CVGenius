let blogs = [
    {
        title: "Avoid These Mistakes: Characteristics of a Bad CV",
        description: "Learn the common pitfalls to avoid when crafting your CV. From missing contact information to weak work experience descriptions and language errors, discover how to improve your CV and make a positive impression on potential employers.",
        createDate: "30/05/2023", // dd/mm/yyyy formatında bir tarih olacak
        auther: "Neriman Topçu", // yazan kişi
        readtime: "6.4 min read",
        blogid: "45dd2534a187f77bf7471731a74b5d98e5147d6" // tıklandığında şöyle bir yönlendirme yapıcak cvgenius.app/blogs/<blogid>
    },
    {
        title: "Creating a Professional CV: Templates and Tips for Success",
        description: "Learn how to create an effective CV that catches the eye of employers. Discover essential templates and valuable tips for organizing information, using language strategically, tailoring your CV to specific job roles, and maintaining a concise and updated document.",
        createDate: "30/05/2023", // dd/mm/yyyy formatında bir tarih olacak
        auther: "Neriman Topçu", // yazan kişi
        readtime: "5.2 min read",
        blogid: "95dd25a34a187f77bf7sd471731a7da4b5d98e5147d6" // tıklandığında şöyle bir yönlendirme yapıcak cvgenius.app/blogs/<blogid>
    }
]
// gibi bir çıktı alıyorsun

$(document).ready(function () {
    function getBlogs() {
        fetch(`/api/getblogs`)
        .then((response) => response.json())
        .then((result) => {
            blogs = result.blogs;
            initalize()
        })
    }

    function initalize() {
        // Burada jquery kullanarak dinamik eklemelerini daha kolay yapabilirsin, birkaç şeyi araştırman gerekebilir.

        //örnek bir şema bırakıyorum
        blogs.forEach(blog => {

            // ul
            //  \- li
            //      \- a
            //         | inner = <blog.title>
            //         | href = "/"
            console.log(blog)
            let ul = document.createElement('ul')
            let li = document.createElement('li')
            let a = document.createElement('a')
            a.href = '/blog/' + blog.blogid

            $(a).append(blog.title)
            $(li).append(a)
            $(ul).append(li)

            $('body').append(ul)
        })
    }

    getBlogs();
})