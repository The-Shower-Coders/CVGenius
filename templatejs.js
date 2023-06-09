Object.keys(json).forEach(function (k) {
    if (k === 'external-links') {
        json[k].forEach((val, index, array) => {
            $('#external-links').append(createExternalLink(val.fontawesomeIcon, val.value, index))
            injectProperties('#external-link-' + index, val)
        })
    }
    else if (k === 'experiences') {
        $('#experiences').append(`<h2 id="experience">EXPERIENCES</h2><hr style="margin-top: 0px; background-color: black;">`)
        json[k].forEach((val, index, array) => {
            $('#experiences').append(createExperience(val, index === array.length - 1, index))
            injectProperties('#experience-' + index + '-job', val.job)
            injectProperties('#experience-' + index + '-company', val.company)
            injectProperties('#experience-' + index + '-date', val.working_period)
            injectProperties('#experience-' + index + '-location', val.location)
            injectProperties('#experience-' + index + '-description', val.description)
            val.points?.forEach((point, i) => {
                injectProperties('#experience-' + index + '-point-' + i, val.points[i])
            })
        })
    }
    else if (k === 'education') {
        $('#education').append(`<h2 id="education">EDUCATION</h2><hr style="margin-top: 0px; background-color: black;">`)
        json[k].forEach((val, index, array) => {
            $('#education').append(createEducation(val, index === array.length - 1, index))
            injectProperties('#education-' + index + '-branch', val.branch)
            injectProperties('#education-' + index + '-school', val.school)
            injectProperties('#education-' + index + '-date', val.education_period)
            injectProperties('#education-' + index + '-location', val.location)
            injectProperties('#education-' + index + '-description', val.description)
            val.points?.forEach((point, i) => {
                injectProperties('#education-' + index + '-point-' + i, val.points[i])
            })
        })
    }
    else if (k === 'skills') {
        $('#skill').append(`<h2 id="skills">SKILLS</h2><hr style="margin-top: 0px;margin-bottom: 0px; background-color: black;"><br><div id="skill-list" class="flex flex-wrap"></div>`)
        json[k].forEach((val, index, array) => {
            $('#skill-list').append(createSkill(val, index))
            injectProperties('#skill-' + index, val)
        })
    }
    else if (k === 'languages') {
        $('#languages').append(`<h2 id="language">Languages</h2><hr style="margin-top: 0px; background-color: black;"><div class="flex flex-wrap lang-list"></div>`)
        json[k].forEach((val, index, array) => {
            $('.lang-list').append(createLanguage(val, index))
            injectProperties('#lang-' + index, val.language)
            injectProperties('#lang-level-' + index, val.state)
            injectProperties('#lang-percent-' + index, val.percent)
        })
    }
    else if (k === 'phone') {
        if (json[k].value.length !== 0) {
            $('#internals').append(createPhone(json[k]));
            injectProperties('#phone', json[k])
        }
    }
    else if (k === 'email') {
        if (json[k].value.length !== 0) {
            $('#internals').append(createEmail(json[k]));
            injectProperties('#email', json[k])
        }
    }
    else if (k === 'location') {
        if (json[k].value.length !== 0) {
            $('#internals').append(createLocation(json[k]));
            injectProperties('#location', json[k])
        }
    }
    else {
        $('#' + k).html(json[k].value);
        injectProperties('#' + k, json[k])
    }
});

function injectProperties(element, properties) {
    try {
        Object.keys(properties).forEach(function (p) {
            if (p !== 'value') {
                $(element).css(p, properties[p]);
            }
        })
    } catch (e) {
        console.log(e)
    }
}

function createLocation(obj) {
    return `
<div class="flex direction-row">
    <i class="fa-solid fa-location-dot fa-2xs mt-4"></i>
    <h5 id="location">${obj.value}</h5>
</div>`
}

function createEmail(obj) {
    return `
<div class="flex direction-row">
    <i class="fa-solid fa-envelope fa-2xs mt-4"></i>
    <h5 id="email">${obj.value}</h5>
</div>`
}

function createPhone(obj) {
    return `
<div class="flex direction-row">
    <i class="fa-solid fa-phone fa-2xs mt-4"></i>
    <h5 id="phone">${obj.value}</h5>
</div>`
}


function createExternalLink(icon, value, index) {
    return `
<div class="flex direction-row">
    <i class="${icon} fa-2xs mt-4"></i>
    <h5 id="external-link-${index}" style="margin-left: 10px; margin-top: 0px;"">${value}</h5>
</div>`
}

function createExperience(obj, isLast, index) {
    return `
${obj.job ? `<h3 id="experience-${index}-job" class="experience-job">${obj.job.value}</h3>` : ''}
${obj.company ? `<h4 id="experience-${index}-company" class="experience-company">${obj.company.value}</h4>` : ''}
<div class="flex direction-row gap-50">
${obj.working_period ? `
<div class="flex direction-row">
<i class="fa-solid fa-calendar-days fa-xs mt-4"></i>
<h5  id="experience-${index}-date" class="experience-date">${obj.working_period.value.start} - ${obj.working_period.value.end}</h5>
</div>` : ''}
${obj.location ? `
<div class="flex direction-row">
<i class="fa-solid fa-location-dot fa-xs mt-4"></i>
<h5  id="experience-${index}-location" class="experience-location">${obj.location.value}</h5>
</div>` : ''}
</div>
${obj.description ? `<h4 id="experience-${index}-description" class="experience-description">${obj.description.value}</h4>` : ''}
<ul class="experience-points">
${obj.points ? `${obj.points.map((val, i) => `<li id="experience-${index}-point-${i}">${val.value}</li>`).join('')}` : ''}
</ul>
${isLast ? '' : '<hr style="border-top: dotted 1px;" />'}
`
}

function createEducation(obj, isLast, index) {
    return `
${obj.branch ? `<h3 id="education-${index}-branch" class="education-branch">${obj.branch.value}</h3>` : ''}
${obj.school ? `<h4 id="education-${index}-school" class="education-school">${obj.school.value}</h4>` : ''}
<div class="flex direction-row gap-50">
${obj.education_period ? `
<div class="flex direction-row">
<i class="fa-solid fa-calendar-days fa-xs mt-4"></i>
<h5 id="education-${index}-date" class="education-date">${obj.education_period.value.start} - ${obj.education_period.value.end}</h5>
</div>` : ''}
${obj.location ? `
<div class="flex direction-row">
<i class="fa-solid fa-location-dot fa-xs mt-4"></i>
<h5 id="education-${index}-location" class="education-location">${obj.location.value}</h5>
</div>` : ''}
</div>
${obj.description ? `<h4 id="education-${index}-description" class="education-description">${obj.description.value}</h4>` : ''}
<ul class="education-points">
${obj.points ? `${obj.points.map((val, i) => `<li id="education-${index}-point-${i}">${val.value}</li>`).join('')}` : ''}
</ul>
${isLast ? '' : '<hr style="border-top: dotted 1px;" />'}
`
}

function createSkill(obj, index) {
    return `
    <div id="skill-${index}" class="skill">${obj.value}</div>
    `
}

function createLanguage(obj, index) {
    return `
<div class="flex direction-column lang-item">
    <div class="flex flex-nowrap lang-props">
        <div id="lang-${index}" class="lang">${obj.language.value}</div>
        <div id="lang-level-${index}"class="lang-level">${obj.state.value}</div>
    </div>
    <div class="lang-back"></div>
    <div id="lang-percent-${index}" class="lang-front percent-${obj.percent.value}"></div>
</div>`
}