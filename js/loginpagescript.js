document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const checkmark = document.getElementById("checkmark");
    const loginButton = document.getElementById("login-button");

    // パスワードが正しいかを確認する
    passwordInput.addEventListener("input", () => {
        if (passwordInput.value === "toyo") {
            checkmark.classList.remove("hidden");
            // 正しいパスワードの場合にsessionStorageを更新
            sessionStorage.setItem("authenticated", "true"); // ログイン状態を保存
            setTimeout(() => {
                window.location.href = "main.html"; // main.htmlへ遷移
            }, 500);
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