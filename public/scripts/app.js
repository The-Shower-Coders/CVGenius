function download() {
    fetch(`/api/json2pdf?json=${encodeURIComponent(JSON.stringify(json))}`)
        .then((response) => response.blob())
        .then((result) => {
            saveAs(result, "document.pdf");
        })
}

function updateArrayValue(array, target, value) {
    let segments_ = target.split('.');
    let nestedObject_ = array;
    for (let i = 0; i < segments_.length - 1; i++) {
        if (!nestedObject_[segments_[i]]) {
            nestedObject_[segments_[i]] = {};
        }
        nestedObject_ = nestedObject_[segments_[i]];
    }
    nestedObject_[segments_[segments_.length - 1]] = value;
}

function getArrayValue(array, target) {
    let segments_ = target.split('.');
    let nestedObject_ = array;
    for (let i = 0; i < segments_.length - 1; i++) {
        if (!nestedObject_[segments_[i]]) {
            nestedObject_[segments_[i]] = {};
        }
        nestedObject_ = nestedObject_[segments_[i]];
    }
    return nestedObject_[segments_[segments_.length - 1]];
}

function updateJsonValue(target, value) {
    let segments_ = target.split('.');
    let nestedObject_ = json;
    for (let i = 0; i < segments_.length - 1; i++) {
        if (!nestedObject_[segments_[i]]) {
            nestedObject_[segments_[i]] = {};
        }
        nestedObject_ = nestedObject_[segments_[i]];
    }
    nestedObject_[segments_[segments_.length - 1]] = value;
}

function getJsonValue(target) {
    let segments_ = target.split('.');
    let nestedObject_ = json;
    for (let i = 0; i < segments_.length - 1; i++) {
        if (!nestedObject_[segments_[i]]) {
            nestedObject_[segments_[i]] = {};
        }
        nestedObject_ = nestedObject_[segments_[i]];
    }
    return nestedObject_[segments_[segments_.length - 1]];
}

function saveJSON() {
    fetch(`/api/setproject?projectid=${projectid}&json=${encodeURIComponent(JSON.stringify(json))}`)
        .then((response) => response.json())
        .then((result) => {
        })
}

let json;
let refreshRate = 100;
const urlParams = new URLSearchParams(window.location.search);
const projectid = urlParams.get('projectid');
function body() {
    function initalize() {
        fetch(`/api/getproject?projectid=${projectid}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.code == -2) {
                    const htmlString = `
                    <html>
                        <head>
                            <title>Project Not Found</title>
                        </head>
                        <body>
                            <div style="display: flex;justify-content: center;">
                            <h3>Project not found. Redirecting to <b>/Resumes</b></h3>
                        </div>
                        </body>
                    </html>`;
                    $('html').html(htmlString);
                    setTimeout(() => {
                        window.location.replace("/resumes");
                      }, 2000);
                } else {
                    json = result.data;
                    afterInitalize()
                }
                
            })
    }

    initalize();

    function afterInitalize() {

        $('.back').click(() => {
            window.location.replace('/resumes')
        })

        function renderPDF(url, canvasContainer) {

            pdfjsLib
                .getDocument(url)
                .promise.then((pdf) => {
                    pdf.getPage(1).then((page) => {
                        $('canvas').remove()
                        const viewport =
                            page.getViewport({
                                scale: $('#scale').val() ?? 2,
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
                    $('#download').css('display', 'block');
                });

        }

        let template = {
            "catagories": [
                {
                    "title": "Personal",
                    "items": [
                        {
                            "title": "Name",
                            "isSingleInput": true,
                            "type": "string",
                            "target": "name.value",
                            "placeholder": "Your Name"
                        },
                        {
                            "title": "Job",
                            "isSingleInput": true,
                            "type": "string",
                            "target": "job.value",
                            "placeholder": "Your Job"
                        },
                        {
                            "title": "Phone Number",
                            "isSingleInput": true,
                            "type": "string",
                            "target": "phone.value",
                            "placeholder": "Your Phone Number"
                        },
                        {
                            "title": "Email Address",
                            "isSingleInput": true,
                            "type": "string",
                            "target": "email.value",
                            "placeholder": "Your Email Address"
                        },
                        {
                            "title": "Location",
                            "isSingleInput": true,
                            "type": "string",
                            "target": "location.value",
                            "placeholder": "Your Location"
                        },
                        {
                            "title": "External Links",
                            "target": "external-links",
                            "desc": "For fontawesome icons, you can go to <a href=\"https://fontawesome.com/search\" target=\"_blank\">Fontawesome.com</a><br><br>",
                            "isSingleInput": false,
                            "type": [
                                {
                                    "type": "string",
                                    "target": "fontawesomeIcon",
                                    "placeholder": "Fontawesome Icon Class"
                                },
                                {
                                    "type": "string",
                                    "target": "value",
                                    "placeholder": "Url for specific external link"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Experiences",
                    "items": [
                        {
                            "title": "Experience",
                            "target": "experiences",
                            "desc": "In here you able to fill your working experiences.<br><br>",
                            "isSingleInput": false,
                            "type": [
                                {
                                    "type": "string",
                                    "target": "job.value",
                                    "placeholder": "Job Name"
                                },
                                {
                                    "type": "string",
                                    "target": "company.value",
                                    "placeholder": "Company Name"
                                },
                                {
                                    "type": "string",
                                    "target": "working_period.value.start",
                                    "placeholder": "Beginning of Work Period"
                                },
                                {
                                    "type": "string",
                                    "target": "working_period.value.end",
                                    "placeholder": "End of Work Period"
                                },
                                {
                                    "type": "string",
                                    "target": "location.value",
                                    "placeholder": "Location"
                                },
                                {
                                    "type": "string",
                                    "target": "description.value",
                                    "placeholder": "Description"
                                },
                                {
                                    "isSingleInput": false,
                                    "title": "Points",
                                    "target": "points",
                                    "type": [
                                        {
                                            "type": "string",
                                            "target": "value",
                                            "placeholder": "one of importance point"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Educations",
                    "items": [
                        {
                            "title": "Education",
                            "target": "education",
                            "desc": "In here you able to fill your educational information.<br><br>",
                            "isSingleInput": false,
                            "type": [
                                {
                                    "type": "string",
                                    "target": "branch.value",
                                    "placeholder": "Branch"
                                },
                                {
                                    "type": "string",
                                    "target": "school.value",
                                    "placeholder": "School Name"
                                },
                                {
                                    "type": "string",
                                    "target": "education_period.value.start",
                                    "placeholder": "Beginning of Work Period"
                                },
                                {
                                    "type": "string",
                                    "target": "education_period.value.end",
                                    "placeholder": "End of Work Period"
                                },
                                {
                                    "type": "string",
                                    "target": "location.value",
                                    "placeholder": "Location"
                                },
                                {
                                    "type": "string",
                                    "target": "description.value",
                                    "placeholder": "Description"
                                },
                                {
                                    "isSingleInput": false,
                                    "title": "Points",
                                    "target": "points",
                                    "type": [
                                        {
                                            "type": "string",
                                            "target": "value",
                                            "placeholder": "one of importance point"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Skills",
                    "items": [
                        {
                            "isSingleInput": false,
                            "title": "Skills",
                            "target": "skills",
                            "type": [
                                {
                                    "type": "string",
                                    "target": "value",
                                    "placeholder": "Your Skill"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Languages",
                    "isSingleInput": false,
                    "target": "languages",
                    "items": [
                        {
                            "title": "Languages",
                            "target": "languages",
                            "type": [
                                {
                                    "type": "string",
                                    "target": "language.value",
                                    "placeholder": "Language Name"
                                },
                                {
                                    "type": "string",
                                    "target": "state.value",
                                    "placeholder": "State of your level(eg. Beginner or Advenced)"
                                },
                                {
                                    "type": "string",
                                    "target": "percent.value",
                                    "placeholder": "Percent of your state (0-100)"
                                },
                            ]
                        }
                    ]
                }
            ]
        }


        $(function Naz() {

            let left = 0;
            setInterval(function () {
                if (left === 0) {
                    // render page
                    left = -1;
                    $('.logs').html('Fetching PDF...')
                    fetch(`/api/json2pdf?json=${encodeURIComponent(JSON.stringify(json))}`)
                        .then((response) => response.blob())
                        .then((result) => {
                            const pdfUrl = URL.createObjectURL(result);
                            renderPDF(pdfUrl, document.getElementById("pdf"))
                            fetch(`/api/setproject?projectid=${projectid}&json=${encodeURIComponent(JSON.stringify(json))}`)
                                .then((response) => response.json())
                                .then((result) => {
                                })
                        })
                    setTimeout(() => {
                        $('.logs').html('Fetching was successful')
                    }, 1000);

                } else left--;
            }, refreshRate);

            function loadJson() {
                const maincollapsible = document.createElement("ul");
                $(maincollapsible).addClass("collapsible main-collapsible")

                template.catagories.forEach(function (catagoria) {
                    const dynamic_li = document.createElement("li");
                    const dynamic_header = document.createElement("div");
                    $(dynamic_header).addClass("collapsible-header")
                    $(dynamic_header).html(catagoria.title)

                    const dynamic_body = document.createElement("div");
                    $(dynamic_body).addClass("collapsible-body")

                    const collapsible = document.createElement("ul");
                    $(collapsible).addClass("collapsible")
                    catagoria.items.forEach(function (item) {
                        if (item.isSingleInput) {
                            if (item.type === 'string') {
                                const dynamic_inside_li = document.createElement("li");
                                const dynamic_inside_header = document.createElement("div");
                                const dynamic_inside_body = document.createElement("div");
                                $(dynamic_inside_header).addClass("collapsible-header")
                                $(dynamic_inside_header).html(item.title)
                                $(dynamic_inside_body).addClass("collapsible-body")

                                const dynamic_input = document.createElement("input");
                                $(dynamic_input).attr('target', item.target)
                                $(dynamic_input).on('input', function (e) {
                                    left = 5;
                                    updateJsonValue(item.target, $(dynamic_input).val())
                                })
                                $(dynamic_input).val(getJsonValue(item.target))
                                if (item.placeholder) {
                                    $(dynamic_input).attr('placeholder', item.placeholder)
                                }

                                const dynamic_custom_properties = document.createElement("div");
                                $(dynamic_custom_properties).addClass("t-slider")

                                const dynamic_custom_property_color = document.createElement("div");
                                const dynamic_custom_color_div = document.createElement("div")
                                $(dynamic_custom_color_div).addClass("flex-max")
                                const dynamic_custom_color_title = document.createElement("h6")
                                $(dynamic_custom_color_title).css('margin-top', '5px')
                                $(dynamic_custom_color_title).css('font-weight', 'bold')
                                $(dynamic_custom_color_title).text('Color: ')
                                const dynamic_custom_color_input = document.createElement("input")
                                $(dynamic_custom_color_input).attr('type', 'color')
                                let cvalue = getJsonValue(item.target.split('.').slice(0, -1).concat('color').join('.'))
                                if (cvalue === undefined) {
                                    $(dynamic_custom_color_input).attr('value', '#000000')
                                } else {
                                    $(dynamic_custom_color_input).attr('value', cvalue)
                                }
                                $(dynamic_custom_color_input).addClass('mr-1rem')
                                $(dynamic_custom_color_input).on("change", function () {
                                    updateJsonValue(
                                        item.target.split('.').slice(0, -1).concat('color').join('.'),
                                        $(dynamic_custom_color_input).val()
                                    )
                                    left = 1;
                                });
                                $(dynamic_custom_color_div).append(dynamic_custom_color_title)
                                $(dynamic_custom_color_div).append(dynamic_custom_color_input)
                                $(dynamic_custom_property_color).append(dynamic_custom_color_div)


                                const dynamic_custom_property_backgrorundColor = document.createElement("div");
                                const dynamic_custom_backgrorundColor_div = document.createElement("div")
                                $(dynamic_custom_backgrorundColor_div).addClass("flex-max")
                                const dynamic_custom_backgrorundColor_title = document.createElement("h6")
                                $(dynamic_custom_backgrorundColor_title).css('margin-top', '5px')
                                $(dynamic_custom_backgrorundColor_title).css('font-weight', 'bold')
                                $(dynamic_custom_backgrorundColor_title).text('Background Color: ')
                                const dynamic_custom_backgrorundColor_input = document.createElement("input")
                                $(dynamic_custom_backgrorundColor_input).on("change", function () {
                                    updateJsonValue(
                                        item.target.split('.').slice(0, -1).concat('background-color').join('.'),
                                        $(dynamic_custom_backgrorundColor_input).val()
                                    )
                                    left = 1;
                                });
                                $(dynamic_custom_backgrorundColor_input).attr('type', 'color')
                                let bgvalue = getJsonValue(item.target.split('.').slice(0, -1).concat('background-color').join('.'))
                                if (bgvalue === undefined) {
                                    $(dynamic_custom_backgrorundColor_input).attr('value', '#FFFFFF')
                                } else {
                                    $(dynamic_custom_backgrorundColor_input).attr('value', bgvalue)
                                }
                                $(dynamic_custom_backgrorundColor_input).addClass('mr-1rem')
                                $(dynamic_custom_backgrorundColor_div).append(dynamic_custom_backgrorundColor_title)
                                $(dynamic_custom_backgrorundColor_div).append(dynamic_custom_backgrorundColor_input)
                                $(dynamic_custom_property_backgrorundColor).append(dynamic_custom_backgrorundColor_div)

                                const dynamic_custom_property_textTransform = document.createElement("div");
                                const dynamic_custom_textTransform_div = document.createElement("div")
                                $(dynamic_custom_textTransform_div).addClass("flex-max")
                                const dynamic_custom_textTransform_title = document.createElement("h6")
                                $(dynamic_custom_textTransform_title).css('margin-top', '5px')
                                $(dynamic_custom_textTransform_title).css('font-weight', 'bold')
                                $(dynamic_custom_textTransform_title).text('Text Transform: ')
                                const dynamic_custom_textTransform_outer = document.createElement("div")
                                const dynamic_custom_textTransform_input = document.createElement("select")
                                $(dynamic_custom_textTransform_input).on("change", function () {
                                    updateJsonValue(
                                        item.target.split('.').slice(0, -1).concat('text-transform').join('.'),
                                        $(dynamic_custom_textTransform_input).val()
                                    )
                                    left = 1;
                                });
                                $(dynamic_custom_textTransform_input).css('display', 'block')
                                $(dynamic_custom_textTransform_input).css('border-radius', '10px')
                                $(dynamic_custom_textTransform_input).css('height', '35px')
                                const dynamic_custom_textTransform_input_child_one = document.createElement("option")
                                $(dynamic_custom_textTransform_input_child_one).attr('value', 'None')
                                $(dynamic_custom_textTransform_input_child_one).text('none')
                                const dynamic_custom_textTransform_input_child_two = document.createElement("option")
                                $(dynamic_custom_textTransform_input_child_two).attr('value', 'uppercase')
                                $(dynamic_custom_textTransform_input_child_two).text('Uppercase')
                                $(dynamic_custom_textTransform_input).append(dynamic_custom_textTransform_input_child_one)
                                $(dynamic_custom_textTransform_input).append(dynamic_custom_textTransform_input_child_two)
                                $(dynamic_custom_textTransform_outer).append(dynamic_custom_textTransform_input)

                                $(dynamic_custom_textTransform_div).append(dynamic_custom_textTransform_title)
                                $(dynamic_custom_textTransform_div).append(dynamic_custom_textTransform_outer)
                                $(dynamic_custom_property_textTransform).append(dynamic_custom_textTransform_div)

                                $(dynamic_custom_properties).append(dynamic_custom_property_color)
                                $(dynamic_custom_properties).append(dynamic_custom_property_backgrorundColor)
                                $(dynamic_custom_properties).append(dynamic_custom_property_textTransform)

                                $(dynamic_inside_body).append(dynamic_input)
                                $(dynamic_inside_body).append(dynamic_custom_properties)
                                $(dynamic_inside_li).append(dynamic_inside_header)
                                $(dynamic_inside_li).append(dynamic_inside_body)
                                $(collapsible).append(dynamic_inside_li)
                                $(dynamic_body).append(collapsible)
                            } else if (item.type === 'soon') {
                                // else than string
                            }
                        } else {
                            // Array input
                            const dynamic_inside_li = document.createElement("li");
                            const dynamic_inside_header = document.createElement("div");
                            const dynamic_inside_body = document.createElement("div");
                            $(dynamic_inside_header).addClass("collapsible-header")
                            $(dynamic_inside_header).html(item.title)
                            $(dynamic_inside_body).addClass("collapsible-body")

                            const dynamic_inside_list = document.createElement("div");

                            if (item.desc) {
                                const dynamic_inside_desc = document.createElement("div");
                                $(dynamic_inside_desc).addClass("item-desc")
                                $(dynamic_inside_desc).append(item.desc)
                                $(dynamic_inside_body).append(dynamic_inside_desc)
                            }
                            if (item.target !== undefined) {
                                getJsonValue(item.target)?.forEach((array_item, index) => {
                                    const dynamic_array_inputs = document.createElement("div");
                                    $(dynamic_array_inputs).addClass('array-item-stack')
                                    const dynamic_remove_div = document.createElement("div")
                                    $(dynamic_remove_div).addClass('array-item-remove')
                                    $(dynamic_remove_div).click(() => {
                                        getJsonValue(item.target)?.splice(index, 1)
                                        $(dynamic_array_inputs).css("display", "none")
                                        left = 5;
                                    })
                                    const dynamic_remove_div_left = document.createElement("div")
                                    $(dynamic_remove_div_left).addClass('array-item-remove-left')
                                    const dynamic_remove_div_right = document.createElement("div")
                                    $(dynamic_remove_div_right).addClass('array-item-remove-right')
                                    $(dynamic_remove_div).append(dynamic_remove_div_left)
                                    $(dynamic_remove_div).append(dynamic_remove_div_right)
                                    $(dynamic_array_inputs).append(dynamic_remove_div)

                                    item.type.forEach((type_array_item) => {
                                        if (type_array_item.isSingleInput === false) {
                                            const collapsible_clone = document.createElement("ul");
                                            $(collapsible_clone).addClass("collapsible")
                                            const dynamic_inside_li_clone = document.createElement("li");
                                            const dynamic_inside_header_clone = document.createElement("div");
                                            const dynamic_inside_body_clone = document.createElement("div");
                                            $(dynamic_inside_header_clone).addClass("collapsible-header")
                                            $(dynamic_inside_header_clone).html(type_array_item.title)
                                            $(dynamic_inside_body_clone).addClass("collapsible-body")
                                            const dynamic_inside_list_clone = document.createElement("div");
                                            getArrayValue(array_item, type_array_item.target)?.forEach((value) => {

                                                const dynamic_array_inputs_clone = document.createElement("div");
                                                $(dynamic_array_inputs_clone).addClass('array-item-stack')
                                                const dynamic_remove_div_clone = document.createElement("div")
                                                $(dynamic_remove_div_clone).addClass('array-item-remove')
                                                $(dynamic_remove_div_clone).click(() => {
                                                    getArrayValue(array_item, type_array_item.target)?.splice(index, 1)
                                                    $(dynamic_array_inputs_clone).css("display", "none")
                                                    left = 5;
                                                })
                                                const dynamic_remove_div_left_clone = document.createElement("div")
                                                $(dynamic_remove_div_left_clone).addClass('array-item-remove-left')
                                                const dynamic_remove_div_right_clone = document.createElement("div")
                                                $(dynamic_remove_div_right_clone).addClass('array-item-remove-right')
                                                $(dynamic_remove_div_clone).append(dynamic_remove_div_left_clone)
                                                $(dynamic_remove_div_clone).append(dynamic_remove_div_right_clone)
                                                $(dynamic_array_inputs_clone).append(dynamic_remove_div_clone)

                                                type_array_item.type.forEach((type) => {

                                                    const dynamic_input = document.createElement("input");
                                                    $(dynamic_input).attr('target', type.target)
                                                    $(dynamic_input).on('input', function (e) {
                                                        left = 5;
                                                        updateArrayValue(value, type.target, $(dynamic_input).val())
                                                    })
                                                    $(dynamic_input).val(getArrayValue(value, type.target))
                                                    if (type.placeholder) {
                                                        $(dynamic_input).attr('placeholder', type.placeholder)
                                                    }

                                                    $(dynamic_array_inputs_clone).append(dynamic_input)
                                                })

                                                $(dynamic_inside_list_clone).append(dynamic_array_inputs_clone)

                                            })

                                            const dynamic_add_new_item = document.createElement("button");
                                            $(dynamic_add_new_item).text('Add')
                                            $(dynamic_add_new_item).css('border-radius', '5px')
                                            $(dynamic_add_new_item).css('border-width', '1px')
                                            $(dynamic_add_new_item).css('padding', '6px')
                                            $(dynamic_add_new_item).click(() => {
                                                getArrayValue(array_item, type_array_item.target).push({})
                                                let array_item_arr = getArrayValue(array_item, type_array_item.target);
                                                let index = getArrayValue(array_item, type_array_item.target)?.length - 1;

                                                const dynamic_array_inputs_clone = document.createElement("div");
                                                $(dynamic_array_inputs_clone).addClass('array-item-stack')
                                                const dynamic_remove_div_clone = document.createElement("div")
                                                $(dynamic_remove_div_clone).addClass('array-item-remove')
                                                $(dynamic_remove_div_clone).click(() => {
                                                    getArrayValue(array_item, type_array_item.target)?.splice(index, 1)
                                                    $(dynamic_array_inputs_clone).css("display", "none")
                                                    left = 5;
                                                })
                                                const dynamic_remove_div_left_clone = document.createElement("div")
                                                $(dynamic_remove_div_left_clone).addClass('array-item-remove-left')
                                                const dynamic_remove_div_right_clone = document.createElement("div")
                                                $(dynamic_remove_div_right_clone).addClass('array-item-remove-right')
                                                $(dynamic_remove_div_clone).append(dynamic_remove_div_left_clone)
                                                $(dynamic_remove_div_clone).append(dynamic_remove_div_right_clone)
                                                $(dynamic_array_inputs_clone).append(dynamic_remove_div_clone)

                                                type_array_item.type.forEach((type) => {

                                                    const dynamic_input = document.createElement("input");
                                                    $(dynamic_input).attr('target', type.target)
                                                    $(dynamic_input).on('input', function (e) {
                                                        left = 5;
                                                        updateArrayValue(array_item_arr[index], type.target, $(dynamic_input).val())
                                                    })
                                                    $(dynamic_input).val(getArrayValue(array_item_arr[index], type.target))
                                                    if (type.placeholder) {
                                                        $(dynamic_input).attr('placeholder', type.placeholder)
                                                    }

                                                    $(dynamic_array_inputs_clone).append(dynamic_input)
                                                })

                                                $(dynamic_inside_list_clone).append(dynamic_array_inputs_clone)
                                            })

                                            $(dynamic_inside_body_clone).append(dynamic_inside_list_clone)
                                            $(dynamic_inside_body_clone).append(dynamic_add_new_item)
                                            $(dynamic_inside_li_clone).append(dynamic_inside_header_clone)
                                            $(dynamic_inside_li_clone).append(dynamic_inside_body_clone)
                                            $(collapsible_clone).append(dynamic_inside_li_clone)
                                            $(dynamic_array_inputs).append(collapsible_clone)
                                        }

                                        if (type_array_item.type === "string") {
                                            const dynamic_input = document.createElement("input");
                                            $(dynamic_input).attr('target', item.target)
                                            $(dynamic_input).on('input', function (e) {
                                                left = 5;
                                                updateArrayValue(array_item, type_array_item.target, $(dynamic_input).val())
                                            })
                                            $(dynamic_input).val(getArrayValue(array_item, type_array_item.target))
                                            if (type_array_item.placeholder) {
                                                $(dynamic_input).attr('placeholder', type_array_item.placeholder)
                                            }

                                            $(dynamic_array_inputs).append(dynamic_input)
                                        }
                                    })

                                    $(dynamic_inside_list).append(dynamic_array_inputs)
                                })
                                const dynamic_add_new_item = document.createElement("button");
                                $(dynamic_add_new_item).text('Add')
                                $(dynamic_add_new_item).css('border-radius', '5px')
                                $(dynamic_add_new_item).css('border-width', '1px')
                                $(dynamic_add_new_item).css('padding', '6px')
                                $(dynamic_add_new_item).click(() => {
                                    getJsonValue(item.target)?.push({})
                                    let array_item = getJsonValue(item.target);
                                    let index = getJsonValue(item.target)?.length - 1;

                                    // div of append -> dynamic_inside_list
                                    // values of item -> array_item

                                    const dynamic_array_inputs = document.createElement("div");
                                    $(dynamic_array_inputs).addClass('array-item-stack')
                                    const dynamic_remove_div = document.createElement("div")
                                    $(dynamic_remove_div).addClass('array-item-remove')
                                    $(dynamic_remove_div).click(() => {
                                        getJsonValue(item.target)?.splice(index, 1)
                                        $(dynamic_array_inputs).css("display", "none")
                                        left = 5;
                                    })
                                    const dynamic_remove_div_left = document.createElement("div")
                                    $(dynamic_remove_div_left).addClass('array-item-remove-left')
                                    const dynamic_remove_div_right = document.createElement("div")
                                    $(dynamic_remove_div_right).addClass('array-item-remove-right')
                                    $(dynamic_remove_div).append(dynamic_remove_div_left)
                                    $(dynamic_remove_div).append(dynamic_remove_div_right)
                                    $(dynamic_array_inputs).append(dynamic_remove_div)

                                    item.type.forEach((type_array_item) => {
                                        if (type_array_item.isSingleInput === false) {
                                            const collapsible_clone = document.createElement("ul");
                                            $(collapsible_clone).addClass("collapsible")
                                            const dynamic_inside_li_clone = document.createElement("li");
                                            const dynamic_inside_header_clone = document.createElement("div");
                                            const dynamic_inside_body_clone = document.createElement("div");
                                            $(dynamic_inside_header_clone).addClass("collapsible-header")
                                            $(dynamic_inside_header_clone).html(type_array_item.title)
                                            $(dynamic_inside_body_clone).addClass("collapsible-body")
                                            const dynamic_inside_list_clone = document.createElement("div");
                                            getArrayValue(array_item, type_array_item.target)?.forEach((value) => {

                                                const dynamic_array_inputs_clone = document.createElement("div");
                                                $(dynamic_array_inputs_clone).addClass('array-item-stack')
                                                const dynamic_remove_div_clone = document.createElement("div")
                                                $(dynamic_remove_div_clone).addClass('array-item-remove')
                                                $(dynamic_remove_div_clone).click(() => {
                                                    getArrayValue(array_item, type_array_item.target)?.splice(index, 1)
                                                    $(dynamic_array_inputs_clone).css("display", "none")
                                                    left = 5;
                                                })
                                                const dynamic_remove_div_left_clone = document.createElement("div")
                                                $(dynamic_remove_div_left_clone).addClass('array-item-remove-left')
                                                const dynamic_remove_div_right_clone = document.createElement("div")
                                                $(dynamic_remove_div_right_clone).addClass('array-item-remove-right')
                                                $(dynamic_remove_div_clone).append(dynamic_remove_div_left_clone)
                                                $(dynamic_remove_div_clone).append(dynamic_remove_div_right_clone)
                                                $(dynamic_array_inputs_clone).append(dynamic_remove_div_clone)

                                                type_array_item.type.forEach((type) => {

                                                    const dynamic_input = document.createElement("input");
                                                    $(dynamic_input).attr('target', type.target)
                                                    $(dynamic_input).on('input', function (e) {
                                                        left = 5;
                                                        updateArrayValue(value, type.target, $(dynamic_input).val())
                                                    })
                                                    $(dynamic_input).val(getArrayValue(value, type.target))
                                                    if (type.placeholder) {
                                                        $(dynamic_input).attr('placeholder', type.placeholder)
                                                    }

                                                    $(dynamic_array_inputs_clone).append(dynamic_input)
                                                })

                                                $(dynamic_inside_list_clone).append(dynamic_array_inputs_clone)

                                            })

                                            const dynamic_add_new_item = document.createElement("button");
                                            $(dynamic_add_new_item).text('Add')
                                            $(dynamic_add_new_item).css('border-radius', '5px')
                                            $(dynamic_add_new_item).css('border-width', '1px')
                                            $(dynamic_add_new_item).css('padding', '6px')
                                            $(dynamic_add_new_item).click(() => {
                                                getArrayValue(array_item, type_array_item.target).push({})
                                                let array_item_arr = getArrayValue(array_item, type_array_item.target);
                                                let index = getArrayValue(array_item, type_array_item.target)?.length - 1;

                                                const dynamic_array_inputs_clone = document.createElement("div");
                                                $(dynamic_array_inputs_clone).addClass('array-item-stack')
                                                const dynamic_remove_div_clone = document.createElement("div")
                                                $(dynamic_remove_div_clone).addClass('array-item-remove')
                                                $(dynamic_remove_div_clone).click(() => {
                                                    getArrayValue(array_item, type_array_item.target)?.splice(index, 1)
                                                    $(dynamic_array_inputs_clone).css("display", "none")
                                                    left = 5;
                                                })
                                                const dynamic_remove_div_left_clone = document.createElement("div")
                                                $(dynamic_remove_div_left_clone).addClass('array-item-remove-left')
                                                const dynamic_remove_div_right_clone = document.createElement("div")
                                                $(dynamic_remove_div_right_clone).addClass('array-item-remove-right')
                                                $(dynamic_remove_div_clone).append(dynamic_remove_div_left_clone)
                                                $(dynamic_remove_div_clone).append(dynamic_remove_div_right_clone)
                                                $(dynamic_array_inputs_clone).append(dynamic_remove_div_clone)

                                                type_array_item.type.forEach((type) => {

                                                    const dynamic_input = document.createElement("input");
                                                    $(dynamic_input).attr('target', type.target)
                                                    $(dynamic_input).on('input', function (e) {
                                                        left = 5;
                                                        updateArrayValue(array_item_arr[index], type.target, $(dynamic_input).val())
                                                    })
                                                    $(dynamic_input).val(getArrayValue(array_item_arr[index], type.target))
                                                    if (type.placeholder) {
                                                        $(dynamic_input).attr('placeholder', type.placeholder)
                                                    }

                                                    $(dynamic_array_inputs_clone).append(dynamic_input)
                                                })

                                                $(dynamic_inside_list_clone).append(dynamic_array_inputs_clone)
                                            })

                                            $(dynamic_inside_body_clone).append(dynamic_inside_list_clone)
                                            $(dynamic_inside_body_clone).append(dynamic_add_new_item)
                                            $(dynamic_inside_li_clone).append(dynamic_inside_header_clone)
                                            $(dynamic_inside_li_clone).append(dynamic_inside_body_clone)
                                            $(collapsible_clone).append(dynamic_inside_li_clone)
                                            $(dynamic_array_inputs).append(collapsible_clone)
                                        }

                                        if (type_array_item.type === "string") {
                                            const dynamic_input = document.createElement("input");
                                            $(dynamic_input).attr('target', item.target)
                                            $(dynamic_input).on('input', function (e) {
                                                left = 5;
                                                updateArrayValue(array_item[index], type_array_item.target, $(dynamic_input).val())
                                            })

                                            $(dynamic_input).val(getArrayValue(array_item, type_array_item.target))
                                            if (type_array_item.placeholder) {
                                                $(dynamic_input).attr('placeholder', type_array_item.placeholder)
                                            }

                                            $(dynamic_array_inputs).append(dynamic_input)
                                        }
                                    })

                                    $(dynamic_inside_list).append(dynamic_array_inputs)

                                })


                                $(dynamic_inside_body).append(dynamic_inside_list)
                                $(dynamic_inside_body).append(dynamic_add_new_item)
                            }

                            $(dynamic_inside_li).append(dynamic_inside_header)
                            $(dynamic_inside_li).append(dynamic_inside_body)
                            $(collapsible).append(dynamic_inside_li)
                            $(dynamic_body).append(collapsible)
                        }
                    })
                    $(dynamic_li).append(dynamic_header)
                    $(dynamic_li).append(dynamic_body)
                    $(maincollapsible).append(dynamic_li)
                })
                $('.left').append(maincollapsible)
                // Static settings page
                const static_collapsible = document.createElement("ul");
                $(static_collapsible).addClass('collapsible')
                const static_li = document.createElement("li");
                const static_header = document.createElement("div");
                $(static_header).addClass('collapsible-header')
                $(static_header).text('PDF Settings')
                const static_body = document.createElement("div");
                $(static_body).addClass('collapsible-body')
                const static_collapsible_inside = document.createElement("ul");
                $(static_collapsible_inside).addClass('collapsible')
                const static_li_inside = document.createElement("li");
                const static_header_inside = document.createElement("div");
                $(static_header_inside).addClass('collapsible-header')
                $(static_header_inside).text('PDF Settings')
                const static_body_inside = document.createElement("div");
                $(static_body_inside).addClass('collapsible-body')
                const static_input = document.createElement("input");
                $(static_input).attr('id', 'scale')
                $(static_input).attr('type', 'range')
                $(static_input).attr('min', '0.1')
                $(static_input).attr('max', '5')
                $(static_input).attr('step', '0.1')
                $(static_input).attr('value', '2')
                const static_desc = document.createElement("div");
                $(static_desc).html('<div>Min: 0.1<br>Max: 5.0<br>Per: 0.1</div><div id="current-scala">Current Scala: 2</div>')
                $(static_body_inside).append(static_input)
                $(static_body_inside).append(static_desc)
                $(static_li_inside).append(static_header_inside)
                $(static_li_inside).append(static_body_inside)
                $(static_collapsible_inside).append(static_li_inside)
                $(static_body).append(static_collapsible_inside)
                $(static_li).append(static_header)
                $(static_li).append(static_body)
                $(static_collapsible).append(static_li)
                $('.left').append(static_collapsible)
            }

            function initalize() {
                var elems = document.querySelectorAll(".collapsible");
                M.Collapsible.init(elems);
                var sliders = document.querySelectorAll('.t-slider'); // Get all elements with the class 't-slider'

                for (var i = 0; i < sliders.length; i++) {
                    var slider = tns({
                        container: sliders[i],
                        items: 1, // Number of slides to show at once
                        slideBy: 'page', // Slide by page instead of individual items
                    });
                }

                $('#scale').change(() => {
                    $('#current-scala').html('Current scale: ' + $('#scale').val())
                    left = 1;
                })

                let isLeftMouseDown = false;

                document.addEventListener('mousedown', handleMouseDown);
                document.addEventListener('mouseup', handleMouseUp);

                function handleMouseDown(event) {
                    if (event.button === 0) { // 0 represents the left mouse button
                        isLeftMouseDown = true;
                    }
                }

                function handleMouseUp(event) {
                    if (event.button === 0) { // 0 represents the left mouse button
                        isLeftMouseDown = false;
                    }
                }


                function dragPanel() {
                    // Select the element to be moved
                    const elementToMove = document.getElementsByClassName('right-move')[0];

                    // Variable to track if the element is being dragged
                    let isDragging = false;

                    // Variables to store the initial position of the element and mouse cursor
                    let initialX, initialY, offsetX, offsetY, initalsizex;

                    // Add event listeners to start and stop dragging
                    elementToMove.addEventListener('mousedown', startDragging);
                    elementToMove.addEventListener('mouseup', stopDragging);

                    // Function to start dragging
                    function startDragging(event) {
                        isDragging = true;
                        initialX = event.clientX;
                        initialY = event.clientY;
                        offsetX = 0;
                        offsetY = 0;
                        initalsizex = Number($('.left').css('min-width').slice(0, -2))
                        document.addEventListener('mousemove', moveElement);
                    }

                    // Function to stop dragging
                    function stopDragging() {
                        isDragging = false;
                        document.removeEventListener('mousemove', moveElement);
                    }

                    // Function to move the element with the mouse cursor
                    function moveElement(event) {
                        if (!isLeftMouseDown) stopDragging();
                        if (isDragging) {
                            offsetX = event.clientX - initialX;
                            if (event.clientX + 100 > $(window).width()) return;
                            $('.left').css('min-width', initalsizex + offsetX)
                        }
                    }

                }

                dragPanel();
            }

            loadJson()
            initalize()

        });
    }
}

body()