function json2html_teplate_standart(data) {
    let inner = '';

    

    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
            <link href="https://fonts.cdnfonts.com/css/hk-groteks?display=swap" rel="stylesheet" />
            <style>
            ${styles}
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
            <script src="script.js"></script>
        </head>
        <body>
            <div class="center">
                <div id="out-page">
                    <div id="page">
                        <h1 id="name"></h1>
                        <h2 id="job"></h2>
                        <h2 id="desc"></h2>
                        <div id="internals" class="flex direction-row gap-50">
                            <!-- Phone, Email, Location -->
                        </div>
                        <div id="external-links" class="flex direction-row gap-50">
                            <!-- ARRAY -->
                        </div>
                        <div id="experiences">
                            <!-- ARRAY -->
                        </div>
                        <div id="education">
                            <!-- ARRAY -->
                        </div>
                        <div id="skill">
                            <!-- ARRAY -->
                        </div>
                        <div id="languages">
                            <!-- ARRAY -->
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>    
    ` 
}

const styles = `
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,700,800");

body {
    margin: 60px;
}

/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* --- General Properties------------------------ */
/* ---------------------------------------------- */
/* ---------------------------------------------- */
* {
    font-family: "HK Grotesk", sans-serif;
}

.flex {
    display: flex;
}

.direction-row {
    flex-direction: row;
}

.direction-column {
    flex-direction: column;
}

.flex-wrap {
    flex-wrap: wrap;
}

.flex-nowrap {
    flex-wrap: nowrap;
}

.gap-10 {
    gap: 10px;
}

.gap-20 {
    gap: 20px;
}

.gap-30 {
    gap: 30px;
}

.gap-40 {
    gap: 40px;
}

.gap-50 {
    gap: 50px;
}

.mt-1 {
    margin-top: 2px;
}

.mt-2 {
    margin-top: 4px;
}

.mt-3 {
    margin-top: 6px;
}

.mt-4 {
    margin-top: 8px;
}

.mt-5 {
    margin-top: 10px;
}

h5 {
    margin-bottom: 5px;
}

.percent-0 {
    width: 0px;
}

.percent-1 {
    width: 2px;
}

.percent-2 {
    width: 4px;
}

.percent-3 {
    width: 6px;
}

.percent-4 {
    width: 8px;
}

.percent-5 {
    width: 10px;
}

.percent-6 {
    width: 12px;
}

.percent-7 {
    width: 14px;
}

.percent-8 {
    width: 16px;
}

.percent-9 {
    width: 18px;
}

.percent-10 {
    width: 20px;
}

.percent-11 {
    width: 22px;
}

.percent-12 {
    width: 24px;
}

.percent-13 {
    width: 26px;
}

.percent-14 {
    width: 28px;
}

.percent-15 {
    width: 30px;
}

.percent-16 {
    width: 32px;
}

.percent-17 {
    width: 34px;
}

.percent-18 {
    width: 36px;
}

.percent-19 {
    width: 38px;
}

.percent-20 {
    width: 40px;
}

.percent-21 {
    width: 42px;
}

.percent-22 {
    width: 44px;
}

.percent-23 {
    width: 46px;
}

.percent-24 {
    width: 48px;
}

.percent-25 {
    width: 50px;
}

.percent-26 {
    width: 52px;
}

.percent-27 {
    width: 54px;
}

.percent-28 {
    width: 56px;
}

.percent-29 {
    width: 58px;
}

.percent-30 {
    width: 60px;
}

.percent-31 {
    width: 62px;
}

.percent-32 {
    width: 64px;
}

.percent-33 {
    width: 66px;
}

.percent-34 {
    width: 68px;
}

.percent-35 {
    width: 70px;
}

.percent-36 {
    width: 72px;
}

.percent-37 {
    width: 74px;
}

.percent-38 {
    width: 76px;
}

.percent-39 {
    width: 78px;
}

.percent-40 {
    width: 80px;
}

.percent-41 {
    width: 82px;
}

.percent-42 {
    width: 84px;
}

.percent-43 {
    width: 86px;
}

.percent-44 {
    width: 88px;
}

.percent-45 {
    width: 90px;
}

.percent-46 {
    width: 92px;
}

.percent-47 {
    width: 94px;
}

.percent-48 {
    width: 96px;
}

.percent-49 {
    width: 98px;
}

.percent-50 {
    width: 100px;
}

.percent-51 {
    width: 102px;
}

.percent-52 {
    width: 104px;
}

.percent-53 {
    width: 106px;
}

.percent-54 {
    width: 108px;
}

.percent-55 {
    width: 110px;
}

.percent-56 {
    width: 112px;
}

.percent-57 {
    width: 114px;
}

.percent-58 {
    width: 116px;
}

.percent-59 {
    width: 118px;
}

.percent-60 {
    width: 120px;
}

.percent-61 {
    width: 122px;
}

.percent-62 {
    width: 124px;
}

.percent-63 {
    width: 126px;
}

.percent-64 {
    width: 128px;
}

.percent-65 {
    width: 130px;
}

.percent-66 {
    width: 132px;
}

.percent-67 {
    width: 134px;
}

.percent-68 {
    width: 136px;
}

.percent-69 {
    width: 138px;
}

.percent-70 {
    width: 140px;
}

.percent-71 {
    width: 142px;
}

.percent-72 {
    width: 144px;
}

.percent-73 {
    width: 146px;
}

.percent-74 {
    width: 148px;
}

.percent-75 {
    width: 150px;
}

.percent-76 {
    width: 152px;
}

.percent-77 {
    width: 154px;
}

.percent-78 {
    width: 156px;
}

.percent-79 {
    width: 158px;
}

.percent-80 {
    width: 160px;
}

.percent-81 {
    width: 162px;
}

.percent-82 {
    width: 164px;
}

.percent-83 {
    width: 166px;
}

.percent-84 {
    width: 168px;
}

.percent-85 {
    width: 170px;
}

.percent-86 {
    width: 172px;
}

.percent-87 {
    width: 174px;
}

.percent-88 {
    width: 176px;
}

.percent-89 {
    width: 178px;
}

.percent-90 {
    width: 180px;
}

.percent-91 {
    width: 182px;
}

.percent-92 {
    width: 184px;
}

.percent-93 {
    width: 186px;
}

.percent-94 {
    width: 188px;
}

.percent-95 {
    width: 190px;
}

.percent-96 {
    width: 192px;
}

.percent-97 {
    width: 194px;
}

.percent-98 {
    width: 196px;
}

.percent-99 {
    width: 198px;
}

.percent-100 {
    width: 200px;
}

/* ---------------------------------------------- */
/* ---------------------------------------------- */
/* --- Custom Properties------------------------- */
/* ---------------------------------------------- */
/* ---------------------------------------------- */

#name {
    font-weight: bolder;
    margin-bottom: 0px;
    font-size: 2.5em;

    text-shadow: 0.5px 0 black;
    letter-spacing: 0.5px;
}

#job {
    margin-top: 0px;
    margin-bottom: 5px;
    font-size: 1.2em;
    color: gray;
}

#desc {
    font-size: 1em;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: 600;
}

#phone {
    margin-left: 10px;
    margin-top: 0px;
}

#email {
    margin-left: 10px;
    margin-top: 0px;
}

#location {
    margin-left: 10px;
    margin-top: 0px;
}

#experience {
    font-family: "Open Sans", sans-serif;
    font-weight: bolder;
    letter-spacing: -1px;
    margin-top: 10px;
    margin-bottom: 0px;
}

.experiences hr {
    margin-top: 0px;
    margin-bottom: 0px;
}

.experience-job {
    margin-top: 10px;
    margin-bottom: 0px;
}

.experience-company {
    margin-top: 5px;
    margin-bottom: 5px;
    color: gray;
}

.experience-date {
    margin-left: 10px;
    margin-top: 2px;
}

.experience-location {
    margin-left: 10px;
    margin-top: 2px;
}

.experience-description {
    margin-top: 5px;
    margin-bottom: 0px;
    font-weight: 500;
}

.experience-points {
    margin-top: 5px;
    margin-bottom: 0px;
    padding-left: 20px;
}

.experience-points li {
    font-weight: 500;
}

#education {
    font-family: "Open Sans", sans-serif;
    font-weight: 700;
    letter-spacing: -1px;
    margin-top: 10px;
    margin-bottom: 0px;
}

.education-branch {
    margin-top: 10px;
    margin-bottom: 0px;
}

.education-school {
    margin-top: 5px;
    margin-bottom: 5px;
    color: gray;
}

.education-date {
    margin-left: 10px;
    margin-top: 2px;
}

.education-location {
    margin-left: 10px;
    margin-top: 2px;
}

.education-description {
    margin-top: 5px;
    margin-bottom: 0px;
    font-weight: 500;
}

.education-points {
    margin-top: 5px;
    margin-bottom: 0px;
    padding-left: 20px;
}

.education-points li {
    font-weight: 500;
}

#skills {
    font-family: "Open Sans", sans-serif;
    font-weight: 700;
    letter-spacing: -1px;
    margin-top: 10px;
    margin-bottom: 0px;
}

.skill {
    font-family: "Open Sans", sans-serif;
    font-size: 0.7em;
    font-weight: 700;
    background-color: #6f7878;
    color: honeydew;
    display: inline;
    padding: 10px;
    border-radius: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
}

#language {
    font-family: "Open Sans", sans-serif;
    font-weight: 700;
    letter-spacing: -1px;
    margin-top: 10px;
    margin-bottom: 0px;
}

.lang-list {
    gap: 35px;
}

.lang-back {
    position: absolute;
    margin-top: 20px;
    background-color: #e4e4e4;
    width: 200px;
    height: 10px;
    border-radius: 5px;
}

.lang-front {
    position: absolute;
    margin-top: 20px;
    background-color: #6b7575;
    height: 10px;
    border-radius: 5px;
}

.lang-item {
    width: 200px;
}

.lang-props {
    justify-content: space-between;
}

`

module.exports = { json2html_teplate_standart }