function renderPDF(url, canvasContainer) {
    pdfjsLib
        .getDocument(url)
        .promise.then((pdf) => {
            pdf.getPage(1).then((page) => {
                $('canvas').remove()
                const viewport =
                    page.getViewport({
                        scale: 2,
                    });
                const canvas =
                    document.createElement(
                        "canvas"
                    );
                const context =
                    canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                canvasContainer.appendChild(canvas);

                page.render({
                    canvasContext: context,
                    viewport: viewport,
                });
            });
        });
}

let json = {};
let refreshRate = 100;
$(function () {

    // Initialize the collapsible
    var elems = document.querySelectorAll(".collapsible");
    var instances = M.Collapsible.init(elems);

    // renderPDF('http://localhost:3000/get', document.getElementById("pdf"))
    // Initalize
    $("input").each(function (i) {
        $("input").each(function (index) {
            let target = $(this).attr('target')
            let segments = target.split('.');
            let nestedObject = json;
            for (let i = 0; i < segments.length - 1; i++) {
                if (!nestedObject[segments[i]]) {
                    nestedObject[segments[i]] = {};
                }
                nestedObject = nestedObject[segments[i]];
            }
            nestedObject[segments[segments.length - 1]] = $(this).val() ?? '';
        })
    })

    $("input").each(function (i) {
        $(this).on('input', function (e) {
            $("input").each(function (index) {
                let target = $(this).attr('target')
                let segments = target.split('.');
                let nestedObject = json;
                for (let i = 0; i < segments.length - 1; i++) {
                    if (!nestedObject[segments[i]]) {
                        nestedObject[segments[i]] = {};
                    }
                    nestedObject = nestedObject[segments[i]];
                }
                nestedObject[segments[segments.length - 1]] = $(this).val() ?? '';
            })



            left = 5;
        })
    })

    let left = 0;
    setInterval(function () {
        if (left === 0) {
            renderPage()
            left = -1;
        } else left--;
    }, refreshRate);

    function renderPage() {
        fetch(`http://localhost:3000/api/json2pdf?json=${encodeURIComponent(JSON.stringify(json))}`)
            .then((response) => response.blob())
            .then((result) => {
                const pdfUrl = URL.createObjectURL(result);
                renderPDF(pdfUrl, document.getElementById("pdf"))
            })
    }

});

function download() {
    fetch(`http://localhost:3000/api/json2pdf?json=${encodeURIComponent(JSON.stringify(json))}`)
        .then((response) => response.blob())
        .then((result) => {
            saveAs(result, "document.pdf");
        })
}



// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

function ShowAddNewExternalLinks() {
    $('.abs').removeClass('none')
    let inputs = [
        {
            type: 'string',
            id: 'external-links.fontawesomeicon',
            placeholder: 'fa-brands fa-github'
        },
        {
            type: 'string',
            id: 'external-links.value',
            placeholder: 'Url'
        }
    ]
    $('.popup').append(getForm(
        'Add New External Link',
        false,  // isUpdate, false -> add
        inputs,
        'AddNewExternalLink()'))
}
function AddNewExternalLink() {
    $('#list-of-external-links').append(`
<li>
    <ul>
        <li style="margin-bottom: 5px;" target="external-links.fontawesomeIcon">
            <span style="padding:5px;font-size: 10px;background-color: gray;color: white;border-radius: 3px;">fontawesomeIcon </span><span>:</span>
            <span style="font-size: 10px;margin-left: 3px;">${document.getElementById('external-links.fontawesomeicon').value}</span>
        </li>
        <li style="margin-bottom: 5px;" target="external-links.value">
            <span style="padding:5px;font-size: 10px;background-color: gray;color: white;border-radius: 3px;">Value </span><span>:</span>
            <span style="font-size: 10px;margin-left: 3px;">${document.getElementById('external-links.value').value}</span>
        </li>
    </ul>
    <button style="float: right;" onclick="remove('list-of-external-links|${elCount}')">Remove</button>
    <button style="float: right;" onclick="ShowUpdateNewExternalLinks('${elCount}')">Update</button>
    <br>
    <hr>
</li>
`)
    elCount++;
    closeCurrentPopup()
}


function ShowUpdateNewExternalLinks(ntd) {
    $('.abs').removeClass('none')
    let inputs = [
        {
            type: 'string',
            id: 'external-links.fontawesomeicon',
            placeholder: 'fa-brands fa-github',
            value: $(`#list-of-external-links > li > ul > li:nth-child(${ntd + 1}) > span:nth-child(3)`).html()
        },
        {
            type: 'string',
            id: 'external-links.value',
            placeholder: 'Url',
            value: $(`#list-of-external-links > li > ul > li:nth-child(${ntd + 2}) > span:nth-child(3)`).html()
        }
    ]
    $('.popup').append(getForm(
        'Add New External Link',
        true,  // isUpdate, false -> add
        inputs,
        `UpdateNewExternalLink(${ntd})`))
}
function UpdateNewExternalLink(ntd) {
    $(`#list-of-external-links > li:nth-child(${ntd + 1}) > ul > li:nth-child(1) > span:nth-child(3)`).html(document.getElementById('external-links.fontawesomeicon').value)
    $(`#list-of-external-links > li:nth-child(${ntd + 1}) > ul > li:nth-child(2) > span:nth-child(3)`).html(document.getElementById('external-links.value').value)
    closeCurrentPopup()
}

let elCount = 0;


// dynamic
// ----------------

function remove(loc) {
    let id = loc.split('|')[0]
    let ntdChild = loc.split('|')[1]

    let list = document.getElementById(id)

    list.removeChild(list.children[ntdChild]);
    elCount--;
}

function getForm(title, isUpdate, inputs, onclick) {

    let inputHTML = ''
    inputs.forEach(element => {
        if (element.type === 'string') {
            inputHTML += `
            <div style="display: flex;justify-content: center;">
                <div><input type="text" name="" placeholder="${element.placeholder}" id="${element.id}" value="${element.value ? element.value : ''}"></div>
            </div>`
        }
    });

    return `
    <div style="width: 60vw; height: 60vh;border-radius: 10px; background-color: white;border-style: double;user-select: none;">
                    <div style="display: flex; flex-direction: column;">
                        <div style="display: flex;justify-content: end;">
                            <div style="margin-right: 5px;" onclick="closeCurrentPopup()">X</div>
                        </div>
                        <div style="height: 55vh;display: flex; flex-direction: column;justify-content: center;">
                            <div style="display: flex;justify-content: center;">
                                <div><h4>${title}</h4></div>
                            </div>
                            ${inputHTML}
                            
                            <div style="display: flex;justify-content: center;">
                                <div><button onclick="${onclick}">${isUpdate === true ? 'Update' : 'Add'}</button></div>
                            </div>
                        </div>
                    </div>
                </div>
    `
}

function closeCurrentPopup() {
    $('.abs').addClass('none')
    $('.popup').html('')
}