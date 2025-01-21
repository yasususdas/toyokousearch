document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const checkmark = document.getElementById("checkmark");
    const loginButton = document.getElementById("login-button");

    // パスワードが正しいかを確認する
    passwordInput.addEventListener("input", () => {
        if (passwordInput.value === "toyo") {
            checkmark.classList.remove("hidden");
            // 即座にmain.htmlへ遷移
            window.location.href = "main.html";
        } else {
            checkmark.classList.add("hidden");
        }
    });

    // ログインボタンをクリックするとページ遷移
    loginButton.addEventListener("click", () => {
        if (passwordInput.value === "toyo") {
            // パスワードが正しい場合、既に即時遷移されているので何もしない
        } else {
            alert("パスワードが正しくありません！");
        }
    });
});