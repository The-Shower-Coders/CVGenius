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

function download() {
    fetch(`http://localhost:3000/api/json2pdf?json=${encodeURIComponent(JSON.stringify(json))}`)
        .then((response) => response.blob())
        .then((result) => {
            saveAs(result, "document.pdf");
        })
}

let json = {
    "name": {
        "value": "Neriman Topçu"
    },
    "job": {
        "value": "Web Developer"
    },
    "phone": {
        "value": "0505 001 12 12"
    },
    "email": {
        "value": "neriman.topcu@cvgenius.app"
    },
    "location": {
        "value": "Turkey/Istanbul"
    },
    "external-links": [
        {
            "fontawesomeIcon": "fa-brands fa-github",
            "value": "https://github.com/clowerty"
        },
        {
            "fontawesomeIcon": "fa-brands fa-linkedin",
            "value": "https://www.linkedin.com/in/neriman-top%C3%A7u-34800123a/"
        }
    ],
    "experiences": [
        {
            "job": {
                "value": "Web Developer"
            },
            "company": {
                "value": "Insider"
            },
            "working_period": {
                "value": {
                    "start": "2020",
                    "end": "2023"
                }
            },
            "location": {
                "value": "Turkey/Istanbul"
            },
            "description": {
                "value": "Insider connects data across channels, predicts future behavior with AI, and individualizes experiences from a single platform with the fastest time to value."
            },
            "points": [
                {
                    "value": "Something"
                },
                {
                    "value": "Something else"
                }
            ]
        }
    ],
    "education": [
        {
            "branch": {
                "value": "Web teknolojisleri"
            },
            "school": {
                "value": "Sabancı 50. Yıl Anadolu Lisesi"
            },
            "education_period": {
                "value": {
                    "start": "2019",
                    "end": "2023"
                }
            },
            "location": {
                "value": "Turkey/Istanbul"
            },
            "description": {
                "value": "Okulum bana çok şey kattı falan filan yalanlar..."
            },
            "points": [
                {
                    "value": "önemli noktalardan biri şudur"
                },
                {
                    "value": "diğeri şudur"
                }
            ]
        },
        {
            "branch": {
                "value": "Temel Eğitim"
            },
            "school": {
                "value": "Avcılar Ortaokulu"
            },
            "education_period": {
                "value": {
                    "start": "2015",
                    "end": "2019"
                }
            },
            "location": {
                "value": "Turkey/Istanbul"
            },
            "description": {
                "value": "Okulum bana çok şey kattı falan filan yalanlar..."
            },
            "points": [
                {
                    "value": "önemli noktalardan biri şudur"
                },
                {
                    "value": "diğeri şudur"
                }
            ]
        }
    ],
    "skills": [
        {
            "value": "HTML"
        },
        {
            "value": "CSS"
        },
        {
            "value": "DOM JS"
        },
        {
            "value": "VanillaJS"
        },
        {
            "value": "NODEJS"
        }
    ],
    "languages": [
        {
            "language": {
                "value": "Turkish"
            },
            "state": {
                "value": "Native"
            },
            "percent": {
                "value": "100"
            }
        },
        {
            "language": {
                "value": "English"
            },
            "state": {
                "value": "Proficient"
            },
            "percent": {
                "value": "75"
            }
        },
        {
            "language": {
                "value": "German"
            },
            "state": {
                "value": "Advenced"
            },
            "percent": {
                "value": "60"
            }
        }
    ]
};

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
            "items": [
                {
                    "title": "Experience",
                    "isSignleInput": false,
                    "type": [
                        {
                            "type": "string",
                            "target": "job"
                        },
                        {
                            "type": "string",
                            "target": "company"
                        }
                    ]
                }
            ]
        }
    ]
}

let refreshRate = 100;
$(function Naz() {

    let left = 0;
    setInterval(function () {
        if (left === 0) {
            // render page
            fetch(`http://localhost:3000/api/json2pdf?json=${encodeURIComponent(JSON.stringify(json))}`)
                .then((response) => response.blob())
                .then((result) => {
                    const pdfUrl = URL.createObjectURL(result);
                    renderPDF(pdfUrl, document.getElementById("pdf"))
                })
            left = -1;
        } else left--;
    }, refreshRate);

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
                        $(dynamic_custom_color_input).attr('value', '#000000')
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
                        $(dynamic_custom_backgrorundColor_input).attr('value', '#FFFFFF')
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
                    }
                }
            })

            $(dynamic_li).append(dynamic_header)
            $(dynamic_li).append(dynamic_body)
            $(maincollapsible).append(dynamic_li)
        })
        $('.left').append(maincollapsible)
    }

    function initalize() {
        var elems = document.querySelectorAll(".collapsible");
        var instances = M.Collapsible.init(elems);
        var sliders = document.querySelectorAll('.t-slider'); // Get all elements with the class 't-slider'

        for (var i = 0; i < sliders.length; i++) {
            var slider = tns({
                container: sliders[i],
                items: 1, // Number of slides to show at once
                slideBy: 'page', // Slide by page instead of individual items
            });
        }
    }

    loadJson()
    initalize()

});