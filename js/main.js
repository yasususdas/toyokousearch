// スプレッドシートの情報
const SHEET_ID = "18I05YDukhyv8gjd9KWjFHNyouU4MhW0epWJiWnq4g3A"; // スプレッドシートのID
const API_KEY = "AIzaSyBFtw0AsHJrQUC-SIPhsdCMJavPBFdQxEI"; // APIキー
const RANGE = "'The_current_status_of_each_teacher'!C2:D7"; // 参照するセル範囲（C列：位置、D列：ステータス）

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
    // テキストサイズを可変式に設定
    blackoutOverlay.style.fontSize = "clamp(0.5rem, 5vw, 2rem)";
    blackoutOverlay.innerHTML = "ログインが行われていません <br> <br> 3秒後にログインページへ移動します...";
    document.body.appendChild(blackoutOverlay);
    // 3秒後にリダイレクト
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
} else {
    console.log("認証済みです。正常にページが表示されます。");
}

// ピンの情報を管理するオブジェクト
const pins = {
    pin1: { element: null, cell: "C2" },
    pin2: { element: null, cell: "C3" },
    pin3: { element: null, cell: "C4" },
    pin4: { element: null, cell: "C5" },
    pin5: { element: null, cell: "C6" }
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
// offset は、同一のセル値が複数ある場合に上にずらす量（%）
function updatePinPosition(pin, cellValue, offset = 0) {
    console.log("更新対象のピン:", pin, "セル値:", cellValue, "offset:", offset);
    if (cellValue === "Shokuin_Shitsu") {
        pin.style.top = offset === 0 ? "55%" : `calc(55% - ${offset}%)`;
        pin.style.left = "36.2%";
    } else if (cellValue === "Chigaku_Jikken_Shitsu") {
        pin.style.top = offset === 0 ? "75.6%" : `calc(75.6% - ${offset}%)`;
        pin.style.left = "24.5%";
    } else if (cellValue === "Butsuri_Kougi_Shitsu") {
        pin.style.top = offset === 0 ? "81.8%" : `calc(81.8% - ${offset}%)`;
        pin.style.left = "72%";
    } else if (cellValue === "Kagaku_Kougi_Shitsu") {
        pin.style.top = offset === 0 ? "75.6%" : `calc(75.6% - ${offset}%)`;
        pin.style.left = "72.05%";
    } else if (cellValue === "Bijutsu_Kyoushitsu") {
        pin.style.top = offset === 0 ? "15.7%" : `calc(15.7% - ${offset}%)`;
        pin.style.left = "54.8%";
    } else if (cellValue === "Jouhou_Junbi_Shitsu") {
        pin.style.top = offset === 0 ? "43.6%" : `calc(43.6% - ${offset}%)`;
        pin.style.left = "24.34%";
    } else if (cellValue === "Corridor") {
        pin.style.top = "200%";
        pin.style.left = "200%";
    } else {
        pin.style.top = "200%"; // デフォルトは非表示
        pin.style.left = "200%";
    }
}

// スプレッドシートからデータを取得してピンの位置を更新
async function fetchAndUpdatePins() {
    // エンコードしてURLを作成
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;
    console.log("リクエストURL:", url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const data = await response.json();
        if (data.values) {
            console.log("スプレッドシートのデータ:", data.values);
            // オフセット用に各対象セル値ごとに出現数をカウントするオブジェクト
            let cellCounts = {};
            // 対象とするセル値（重ね合わせの処理を行う値）
            const offsetCellValues = [
                "Shokuin_Shitsu",
                "Chigaku_Jikken_Shitsu",
                "Butsuri_Kougi_Shitsu",
                "Kagaku_Kougi_Shitsu",
                "Bijutsu_Kyoushitsu",
                "Jouhou_Junbi_Shitsu"
            ];
            data.values.forEach((row, index) => {
                const location = row[0] || ""; // C列の値（位置情報）
                const status = (row[1] || "").toLowerCase(); // D列の値（exit等）
                const pinKey = `pin${index + 1}`;
                if (pins[pinKey] && pins[pinKey].element) {
                    if (status === "exit") {
                        // D列が "exit" の場合、ピンを非表示にする
                        pins[pinKey].element.style.top = "200%";
                        pins[pinKey].element.style.left = "200%";
                    } else {
                        if (offsetCellValues.includes(location)) {
                            // 同一の対象セル値の出現数をカウント
                            cellCounts[location] = (cellCounts[location] || 0) + 1;
                            const count = cellCounts[location];
                            const offset = (count - 1) * 2; // 1つ目はoffset 0, 2つ目は3%, 3つ目は6%, …
                            updatePinPosition(pins[pinKey].element, location, offset);
                        } else {
                            updatePinPosition(pins[pinKey].element, location);
                        }
                    }
                }
            });
        } else {
            console.error("スプレッドシートにデータがありません");
        }
    } catch (error) {
        console.error("スプレッドシートのデータ取得エラー:", error.message);
    }
}

// DOMが完全に読み込まれた後に初期化と定期更新を実行
document.addEventListener("DOMContentLoaded", () => {
    initializePins();
    fetchAndUpdatePins();
    setInterval(fetchAndUpdatePins, 1500);
});

// ヘッダー固定処理
const navbar = document.querySelector(".navbar");
const menu = document.querySelector(".menu");

function isContentFittingInOneScreen() {
    return document.documentElement.scrollHeight <= window.innerHeight;
}

function handleScroll() {
    if (!isContentFittingInOneScreen()) {
        if (window.pageYOffset >= menu.offsetTop) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    } else {
        navbar.classList.remove("sticky");
    }
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("resize", handleScroll);