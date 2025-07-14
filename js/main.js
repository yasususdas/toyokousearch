// スプレッドシートの情報
const SHEET_ID = "18I05YDukhyv8gjd9KWjFHNyouU4MhW0epWJiWnq4g3A"; // スプレッドシートのID
const API_KEY = "AIzaSyBFtw0AsHJrQUC-SIPhsdCMJavPBFdQxEI"; // APIキー
const RANGE = "'The_current_status_of_each_teacher'!C2:E7"; // C:位置, D:未使用, E:ON/OFF

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
    pin1: { normal: null, busy: null, cell: "C2" },
    pin2: { normal: null, busy: null, cell: "C3" },
    pin3: { normal: null, busy: null, cell: "C4" },
    pin4: { normal: null, busy: null, cell: "C5" },
    pin5: { normal: null, busy: null, cell: "C6" }
};

// 初期化処理：ピンのDOM要素を取得
function initializePins() {
    Object.keys(pins).forEach(k => {
        pins[k].normal = document.querySelector(`.${k}`);
        pins[k].busy   = document.querySelector(`.${k}_busy`);
        // busy は初期的に非表示
        if (pins[k].busy) pins[k].busy.style.display = "none";
    });
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

                const pinObj = pins[pinKey];
                if (pinObj && pinObj.normal && pinObj.busy) {
                    // busy 判定
                    const isBusy = (row[2] || "").toLowerCase() === "on";

                    // まず両方隠す
                    pinObj.normal.style.display = "none";
                    pinObj.busy.style.display   = "none";

                    const targetImg = isBusy ? pinObj.busy : pinObj.normal;

                    // exit 行は位置計算をスキップし画面外へ
                    if (status === "exit") {
                        targetImg.style.zIndex = 1;   // 画面外でも低い z-index
                        targetImg.style.top  = "200%";
                        targetImg.style.left = "200%";
                    } else {
                        // 位置オフセットを先に計算
                        let offset = 0;
                        if (offsetCellValues.includes(location)) {
                            cellCounts[location] = (cellCounts[location] || 0) + 1;
                            offset = (cellCounts[location] - 1) * 1.5; // すべてのピンを 1.5% 刻みに
                            const stackOrder = 100 - (cellCounts[location] - 1); // 先に来たピンほど前面
                            updatePinPosition(targetImg, location, offset);
                            // offset が小さいものほど前面になるように
                            targetImg.style.zIndex = stackOrder;
                        } else {
                            updatePinPosition(targetImg, location, offset);
                            targetImg.style.zIndex = 100;
                        }
                    }

                    // 最後に可視化
                    targetImg.style.display = "block";

                    // **ノーマル** ピンだけ拡大表示
                    if (isBusy) {
                        // busy ピンは元の大きさ
                        targetImg.style.transform = 'translate(-50%, -100%)';
                    } else {
                        // ノーマルピンを 1.0 倍に拡大
                        targetImg.style.transform = 'translate(-50%, -100%) scale(1.0)';
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
    navbar.classList.add("sticky");  // 常に sticky を付与
    fetchAndUpdatePins();
    setInterval(fetchAndUpdatePins, 1500);
});

// ヘッダー固定処理
const navbar = document.querySelector(".navbar");
const menu = document.querySelector(".menu");

function isContentFittingInOneScreen() {
    return document.documentElement.scrollHeight <= window.innerHeight;
}