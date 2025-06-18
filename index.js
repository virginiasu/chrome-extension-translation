chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "contextMenuRealtimeTranslate",
        title: "Run Translate (YSu)",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "contextMenuRealtimeTranslate") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: runTranslate
        });
    }
});

function runTranslate() {
    function handleSelection() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&dt=bd&dt=at&q=${encodeURIComponent(selectedText)}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const translatedText = data[1]?.map(item => {
                        return `${item[0]}: ${item[1].join(", ")}`;
                    }).join("\n") || data[0][0][0];
                    document.getElementById("ysu_realtime_translate").innerText = translatedText;
                });
        }
    }

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    const myDiv = document.createElement("div");
    myDiv.id = "ysu_realtime_translate";
    myDiv.style.position = "fixed";
    myDiv.style.top = "0";
    myDiv.style.right = "0";
    myDiv.style.color = "#003000";
    myDiv.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    myDiv.style.zIndex = "9999";
    myDiv.style.fontWeight = "bold";
    myDiv.style.padding = "10px";
    myDiv.style.boxShadow = "-2px 2px 5px darkgreen";
    document.body.appendChild(myDiv);
}