# Signup

Using for creating new accounts with API and query parameters

API url:

```
/api/signup
```

API parameters:

```
?
    name | required
    password | required
    mail | required
```

API return codes:

```
0  -> success
-1 -> name and password and mail required
-2 -> name already exists
-3 -> mail already exists
-4 -> mail not valid (  *@*.*  )
-5 -> password not valid (min 8 char, max 100 characters, no spaces, have uppercase letters, have lowercase letters)
-6 -> username must be at least 4 characters long
```

API Usage in js:

```javascript
fetch(`/api/signup?name=${username}&password=${password}&mail=${mail}`)
    .then((response) => response.text())
    .then((data) => {
        // code
        //.object
        //    code: 0
    });
```

# Signin

Using for is user exits with given username and password

API url:

```
/api/signin
```

API parameters:

```
?
    nameormail | required
    password | required
```

API return codes:

```
0  -> success
-1 -> (name || mail) & password required
-2 -> user not exits
```

API Usage in js:

```javascript
fetch(`/api/signin?nameormail=${nameormail}&password=${password}`)
    .then((response) => response.text())
    .then((data) => {
        // code
        // .object
        //     code: 0
        //     userid: 'c8s6v8a6045045fc93ee43cdf8736a54bfc93ee43cdf8736a54'
    });
```

# GetResumes

Using for get user's every resume json

API url:

```
/api/getresumes
```

API parameters:

```
?
    userid | required
```

API return codes:

```
0  -> success
-1 -> user not found
```

API Usage in js:

```javascript
fetch(`/api/getresumes?userid=${userid}`)
    .then((response) => response.text())
    .then((data) => {
        // code
        // .object
        //     code: 0
        //     resumeList: Array(2)
        //         O: {projectName: 'Neriman', projectId: '6045045fc93ee43cdf8736a54b', json: {...}
        //         1: {projectName: 'Neriman', projectId: '6045045fc93ee43cdf8736a54b', json:{...}
        //         length: 2 ► [[Prototype)): Array(0) ► [[Prototype)): Object
    });
```

# GetProfile

Using for get user's profile photo url

API url:

```
/api/getprofile
```

API parameters:

```
?
    userid | required
```

API return codes:

```
0  -> success
-1 -> user not found
```

API Usage in js:

```javascript
fetch(`/api/getprofile?userid=${userid}`)
    .then((response) => response.text())
    .then((data) => {
        // code
        // .object
        //     code: 0
        //     profileUrl: "https://..."
    });
```

# json2pdf

Using for convert stored resume json to pdf format

API url:

```
/api/json2pdf
```

API parameters:

```
?
    json | required
```

API return codes:

```
0  -> success
-1 -> json not valid
```

API Usage in js:

```javascript
fetch(`/api/json2pdf?json=${encodeURIComponent(JSON.stringify(json))}`)
    .then((response) => response.blob())
    .then((result) => {
        const pdfUrl = URL.createObjectURL(result);
    });
```
