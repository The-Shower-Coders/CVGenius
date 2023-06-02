let passwordVisible = false;

function view() {
    passwordVisible = !passwordVisible;
    if (passwordVisible) {
        $('#password').attr('type', 'text')
        $('#view').html('<i class="fas fa-eye-slash"></i>')
    } else {
        $('#password').attr('type', 'password')
        $('#view').html('<i class="fas fa-eye"></i>')
    }
}


function signup() {
    fetch(`/api/signup?name=${$('#username').val()}&password=${$('#password').val()}&mail=${$('#email').val()}`)
        .then(response => response.text())
        .then(data => {
            var nd = JSON.parse(data);
            if (nd.code === -2) {
                showError('Username already exists.')
                $('#username').addClass('shake')
                setTimeout(() => {
                    $('#username').removeClass('shake')
                }, 1000);
            } else if (nd.code === -3) {
                showError('Email already exists.')
                $('#email').addClass('shake')
                setTimeout(() => {
                    $('#email').removeClass('shake')
                }, 1000);
            } else if (nd.code === -4) {
                showError('Mail not valid.')
                $('#email').addClass('shake')
                setTimeout(() => {
                    $('#email').removeClass('shake')
                }, 1000);
            } else if (nd.code === -5) {
                console.log(nd)
                let problems = '';
                for (let i = 0; i < nd.problems.length;i++) {
                    let problem = nd.problems[i];
                    if (problem === 'min') {
                        problems += ' - Minimum length 8<br>';
                    } else if (problem === 'uppercase') {
                        problems += ' - Must have uppercase letters<br>';
                    } else if (problem === 'lowercase') {
                        problems += ' - Must have lowercase letters<br>';
                    } else if (problem === 'digits') {
                        problems += ' - Must have at least 2 digits<br>';
                    } else if (problem === 'spaces') {
                        problems += ' - Should not have spaces<br>';
                    }
                }
                showError(`Password not valid.<br>` + problems);
                $('#password').addClass('shake')
                setTimeout(() => {
                    $('#password').removeClass('shake')
                }, 1000);
            } else if (nd.code === -6) {
                showError(`Username must be at least 4 characters long.`)
                $('#username').addClass('shake')
                setTimeout(() => {
                    $('#username').removeClass('shake')
                }, 1000);
            } else if (nd.code === 0) {
                setCookie('userid', nd.userid, 365)
                window.location.replace('/resumes')
            }
        });
} 

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function showError(message) {
    $('.toast-body').html(message);
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
}