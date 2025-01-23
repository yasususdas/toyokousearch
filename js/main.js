// スプレッドシートの情報
const SHEET_ID = "18I05YDukhyv8gjd9KWjFHNyouU4MhW0epWJiWnq4g3A"; // スプレッドシートのID
const API_KEY = "AIzaSyBFtw0AsHJrQUC-SIPhsdCMJavPBFdQxEI"; // APIキー
const RANGE = "'The_current_status_of_each_teacher'!C2:C7"; // 参照するセル範囲

// main.htmlで認証をチェックしてリダイレクトする処理
if (sessionStorage.getItem("authenticated") !== "true") {
    // タブをブラックアウトさせる
    const blackoutOverlay = document.createElement("div");
    blackoutOverlay.style.position = "fixed";
    blackoutOverlay.style.top = "0";
    blackoutOverlay.style.left = "0";
    blackoutOverlay.style.width = "100%";
    blackoutOverlay.style.height = "100%";
    blackoutOverlay.style.backgroundColor = "black";
    blackoutOverlay.style.zIndex = "9999";
    blackoutOverlay.style.display = "flex";
    blackoutOverlay.style.justifyContent = "center";
    blackoutOverlay.style.alignItems = "center";
    blackoutOverlay.style.color = "white";
    blackoutOverlay.style.textAlign = "center"; // 中央揃え

    // テキストサイズを可変式に設定（clampでサイズを制限）
    blackoutOverlay.style.fontSize = "clamp(0.5rem, 5vw, 2rem)"; // 最小1rem, 横幅の5%, 最大2rem
    blackoutOverlay.innerHTML = "ログインが行われていません <br> <br> 3秒後にログインページへ移動します..."; // テキストを改行付きで表示

    document.body.appendChild(blackoutOverlay);

    // 少し待ってリダイレクト
    setTimeout(() => {
        window.location.href = "index.html"; // ログインページにリダイレクト
    }, 3000); // 3秒後にリダイレクト
} else {
    console.log("認証済みです。正常にページが表示されます。");
}

// ピンの情報を管理するオブジェクト
const pins = {
    pin1: {
        element: null, // DOM要素を後で設定
        cell: "C2",    // 参照するセル
    },
    pin2: {
        element: null,
        cell: "C3",
    },
    pin3: {
        element: null,
        cell: "C4",
    },
    pin4: {
        element: null,
        cell: "C5",
    },
    pin5: {
        element: null,
        cell: "C6",
    },
};

// 初期化処理：ピンのDOM要素を取得
function initializePins() {
    pins.pin1.element = document.querySelector(".pin1");
    pins.pin2.element = document.querySelector(".pin2");
    pins.pin3.element = document.querySelector(".pin3");
    pins.pin4.element = document.querySelector(".pin4");
    pins.pin5.element = document.querySelector(".pin5");
}

// ピンの位置を条件に応じて更新
function updatePinPosition(pin, cellValue) {
    console.log("更新対象のピン:", pin, "セル値:", cellValue);
    if (cellValue === "Shokuin_Shitsu") {
        pin.style.top = "55%";
        pin.style.left = "36.2%";
    } else if (cellValue === "Chigaku_Jikken_Shitsu") {
        pin.style.top = "75.6%";
        pin.style.left = "24.5%";
    } else if (cellValue === "Butsuri_Kougi_Shitsu") {
        pin.style.top = "81.8%";
        pin.style.left = "72%";
    } else if (cellValue === "Kagaku_Kougi_Shitsu") {
        pin.style.top = "75.6%";
        pin.style.left = "72.05%";
    } else {
        pin.style.top = "200%"; // 地図外に非表示
        pin.style.left = "200%";
    }
}

// スプレッドシートからデータを取得してピンの位置を更新
async function fetchAndUpdatePins() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;
    console.log("リクエストURL:", url);
    try {
        const response = await fetch(url);

        // HTTPエラーを確認
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data = await response.json();

        // データが正しく取得できた場合
        if (data.values) {
            // 取得したセル値をそれぞれのピンに割り当て
            const [pin1Value, pin2Value, pin3Value, pin4Value, pin5Value] = data.values;
            if (pins.pin1.element) {
                updatePinPosition(pins.pin1.element, pin1Value[0]);
            }
            if (pins.pin2.element) {
                updatePinPosition(pins.pin2.element, pin2Value[0]);
            }
            if (pins.pin3.element) {
                updatePinPosition(pins.pin3.element, pin3Value[0]);
            }
            if (pins.pin4.element) {
                updatePinPosition(pins.pin4.element, pin4Value[0]);
            }
            if (pins.pin5.element) {
                updatePinPosition(pins.pin5.element, pin5Value[0]);
            }
        } else {
            console.error("スプレッドシートにデータがありません");
        }
    } catch (error) {
        console.error("スプレッドシートのデータ取得エラー:", error.message);
    }
}

// DOMが完全に読み込まれた後に初期化と定期更新を実行
document.addEventListener("DOMContentLoaded", () => {
    initializePins(); // ピンの初期化
    fetchAndUpdatePins(); // 初回データ取得
    setInterval(fetchAndUpdatePins, 1500); // 1.5秒ごとにデータを更新
});

// ヘッダー固定処理
const navbar = document.querySelector(".navbar");
const menu = document.querySelector(".menu");

// ページ内容が一画面に収まっているかを判定する関数
function isContentFittingInOneScreen() {
    return document.documentElement.scrollHeight <= window.innerHeight;
}

// ヘッダーがulタグの位置に来たら、ヘッダー固定する
function handleScroll() {
    if (!isContentFittingInOneScreen()) {
        // 一画面に収まっていない場合のみ固定処理を適用
        if (window.pageYOffset >= menu.offsetTop) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    } else {
        // 一画面に収まっている場合は固定を解除
        navbar.classList.remove("sticky");
    }
}

// スクロールイベントリスナーを設定
window.addEventListener("scroll", handleScroll);

// リサイズ時にも内容の変化をチェック
window.addEventListener("resize", () => {
    handleScroll(); // リサイズ時に再判定
});