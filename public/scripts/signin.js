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
                document.cookie = "userid="+nd.userid;
                window.location.replace('/app')
            }
        });
}

function showError(message) {
    $('.toast-body').html(message);
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
}