$(function Naz() {
    $('.template-option').click(function () {
        $('.template-select').children().each(function () {
            $(this).attr('active', 'false')
        })
        $(this).attr('active', 'true')
    })

    let me = false;
    $('#new-project').click(function () {
        me = true;
        $('.widget').css('display', 'block')
        $('.back').css('filter', 'blur(5px)')
    })

    $('.back').click(function () {
        if (me) {
            me = false
            return
        }
        $('.widget').css('display', 'none')
        $('.back').css('filter', '')
    })

    $('.create-btn').click(function () {
        let projectname = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        let template = $('[active="true"]').attr('id')
        fetch(`/api/create?userid=${getCookie('userid')}&projectname=${projectname}&template=${template}`)
            .then((response) => response.json())
            .then((result) => {
                window.location.replace(`/app?projectid=${result.projectId}`)
            })
    })

    $(".logout").click(() => {
        delete_cookie('userid')
        window.location.replace('/signin')
    });

    function delete_cookie(name) {
        document.cookie =
            name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    function fetchData() {
        fetch("/api/getprofile?userid=" + getCookie("userid"))
            .then((response) => response.json())
            .then((data) => {
                console.log(data.profileUrl);
                $("#userprofile").attr("src", data.profileUrl);
            });

        fetch("/api/getresumes?userid=" + getCookie("userid"))
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                data.resumeList.forEach((json) => {
                    const projectName = json.projectName;
                    const projectId = json.projectId;
                    console.log(json);

                    fetch(
                        `/api/json2pdf?json=${encodeURIComponent(
                            JSON.stringify(json.json)
                        )}`
                    )
                        .then((response) => response.blob())
                        .then((result) => {
                            // Process the response from the server

                            const pdfUrl = URL.createObjectURL(result);
                            console.log(result, pdfUrl);

                            const container =
                                document.getElementById("pdfContainer");
                            pdfjsLib
                                .getDocument(pdfUrl)
                                .promise.then((pdf) => {
                                    pdf.getPage(1).then((page) => {
                                        const viewport =
                                            page.getViewport({
                                                scale: 1,
                                            });

                                        const divider =
                                            document.createElement(
                                                "div"
                                            );

                                        const href =
                                            document.createElement("a");
                                        href.href =
                                            "/app?projectid=" +
                                            projectId;
                                        const canvas =
                                            document.createElement(
                                                "canvas"
                                            );
                                        const context =
                                            canvas.getContext("2d");
                                        canvas.height = viewport.height;
                                        canvas.width = viewport.width;

                                        const label =
                                            document.createElement("a");
                                        label.href =
                                            "/app?projectid=" +
                                            projectId;
                                        label.innerText = projectName;

                                        href.appendChild(canvas);
                                        divider.appendChild(href);
                                        divider.appendChild(label);
                                        container.appendChild(divider);

                                        page.render({
                                            canvasContext: context,
                                            viewport: viewport,
                                        });
                                    });
                                });
                        })
                        .catch((error) => {
                            // Handle any errors that occurred during the request
                            console.error("Error:", error);
                        });
                });

                setTimeout(() => {
                    $('.lds-grid').removeClass('lds-grid')
                }, 1000);

            });
    }

    fetchData();
})