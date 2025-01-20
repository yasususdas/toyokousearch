// スプレッドシートの情報
const SHEET_ID = "18I05YDukhyv8gjd9KWjFHNyouU4MhW0epWJiWnq4g3A"; // スプレッドシートのID
const API_KEY = "AIzaSyBFtw0AsHJrQUC-SIPhsdCMJavPBFdQxEI"; // APIキー
const RANGE = "'The_current_status_of_each_teacher'!C2:C7"; // 参照するセル範囲

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
    } else if (cellValue === "Kagaku_Junbi_Shitsu") {
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
    setInterval(fetchAndUpdatePins, 4000); // 2秒ごとにデータを更新
});

// ヘッダー固定処理
const navbar = document.querySelector(".navbar");
const menu = document.querySelector(".menu");

// ヘッダーがulタグの位置に来たら、ヘッダー固定する
window.addEventListener("scroll", () => {
    if (window.pageYOffset >= menu.offsetTop) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
});