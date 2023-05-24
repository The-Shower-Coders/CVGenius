function download() {
    fetch(`/api/json2pdf?json=${encodeURIComponent(JSON.stringify(json))}`)
        .then((response) => response.blob())
        .then((result) => {
            saveAs(result, "document.pdf");
        })
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

let json;
let refreshRate = 100;
const urlParams = new URLSearchParams(window.location.search);
const projectid = urlParams.get('projectid');
function body() {
    function initalize() {
        fetch(`/api/getproject?projectid=${projectid}`)
            .then((response) => response.json())
            .then((result) => {
                json = result.data;
                afterInitalize()
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
                });

        }

        let template = {
            "catagories": [
                {
                    "title": "Personal",
                    "items": [
                        {
                            "title": "Name",
                            "isSignleInput": true,
                            "type": "string",
                            "target": "name.value",
                            "placeholder": "Your Name"
                        },
                        {
                            "title": "Job",
                            "isSignleInput": true,
                            "type": "string",
                            "target": "job.value",
                            "placeholder": "Your Job"
                        },
                        {
                            "title": "Phone Number",
                            "isSignleInput": true,
                            "type": "string",
                            "target": "phone.value",
                            "placeholder": "Your Phone Number"
                        },
                        {
                            "title": "Email Address",
                            "isSignleInput": true,
                            "type": "string",
                            "target": "email.value",
                            "placeholder": "Your Email Address"
                        },
                        {
                            "title": "Location",
                            "isSignleInput": true,
                            "type": "string",
                            "target": "location.value",
                            "placeholder": "Your Location"
                        },
                        {
                            "title": "External Links",
                            "target": "external-links",
                            "desc": "For fontawesome icons, you can go to <a href=\"https://fontawesome.com/search\">Fontawesome.com</a><br><br>",
                            "isSignleInput": false,
                            "type": [
                                {
                                    "type": "string",
                                    "target": "fontawesomeIcon"
                                },
                                {
                                    "type": "string",
                                    "target": "value"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Experiences",
                    "target": "experiences",
                    "desc": "For fontawesome icons, you can go to <a href=\"https://fontawesome.com/search\">Fontawesome.com</a><br><br>",
                    "items": [
                        {
                            "title": "Experience",
                            "isSignleInput": false,
                            "type": [
                                {
                                    "type": "string",
                                    "target": "job.value"
                                },
                                {
                                    "type": "string",
                                    "target": "company.value"
                                }
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
                        if (item.isSignleInput) {
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
                                        if (type_array_item.type === "string") {
                                            const dynamic_input = document.createElement("input");
                                            $(dynamic_input).attr('target', item.target)
                                            $(dynamic_input).on('input', function (e) {
                                                left = 5;
                                                array_item[type_array_item.target] = $(dynamic_input).val()
                                            })
                                            $(dynamic_input).val(array_item[type_array_item.target])
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
                                    console.log(getJsonValue(item.target))
                                    getJsonValue(item.target)?.push({})
                                    let array_item = getJsonValue(item.target);
                                    let index = getJsonValue(item.target)?.length - 1;

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
                                        if (type_array_item.type === "string") {
                                            const dynamic_input = document.createElement("input");
                                            $(dynamic_input).attr('target', item.target)
                                            $(dynamic_input).on('input', function (e) {
                                                left = 5;
                                                array_item[index][type_array_item.target] = $(dynamic_input).val()
                                            })
                                            $(dynamic_input).val(array_item[type_array_item.target])
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
                $('.left').append(`
                <ul class="collapsible">
                    <li>
                        <div class="collapsible-header">PDF Settings</div>
                        <div class="collapsible-body">
                            <ul class="collapsible">
                                <li>
                                    <div class="collapsible-header">Scale</div>
                                    <div class="collapsible-body">
                                        <input id="scale" type="range" min="0.1" max="5" step="0.1" value="2" />
                                        <div>Min: 0.1<br>Max: 5.0<br>Per: 0.1</div><div id="current-scala">Current Scala: 2</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>`)
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
            }

            loadJson()
            initalize()

        });
    }
}

body()