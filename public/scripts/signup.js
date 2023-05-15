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
                $('#username').addClass('shake')
                setTimeout(() => {
                    $('#username').removeClass('shake')
                }, 1000);
            } else if (nd.code === -3 || nd.code === -4) {
                $('#email').addClass('shake')
                setTimeout(() => {
                    $('#email').removeClass('shake')
                }, 1000);
            } else if (nd.code === -5) {
                $('#password').addClass('shake')
                setTimeout(() => {
                    $('#password').removeClass('shake')
                }, 1000);
            } else if (nd.code === 0) {
                document.cookie = "userid=" + nd.userid;
                window.location.replace('/app')
            }
        });
} 