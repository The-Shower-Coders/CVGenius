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

function signin() {
    fetch(`/api/signin?nameormail=${$('#email').val()}&password=${$('#password').val()}`)
        .then(response => response.text())
        .then(data => {
            var nd = JSON.parse(data);
            if (nd.code === -2) {
                showError('Email or password was invalid.')
                $('#email').addClass('shake')
                $('#password').addClass('shake')
                setTimeout(() => {
                    $('#email').removeClass('shake')
                    $('#password').removeClass('shake')
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