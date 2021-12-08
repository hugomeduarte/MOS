async function login() {
    try {
        let obj = {
            nome: document.getElementById("nome").value,
            password: document.getElementById("password").value
        }
        let user = await $.ajax({
            url: '/api/users/login',
            method: 'post',
            dataType: 'json',
            data: JSON.stringify(obj),
            contentType: 'application/json'
        });
        sessionStorage.setItem("userId",user.util_id);
        if(user.util_admin) {
            window.location = "adminhome.html";
        } else {
            window.location = "home.html";
        }
    } catch (err) {
        document.getElementById("msg").innerText = err.responseJSON.msg;
    }
}