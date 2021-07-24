document.addEventListener("DOMContentLoaded", function() {

    let savedTabs = []
    const localStorageSavedTabs = localStorage.getItem("savedTabs");
    if (localStorageSavedTabs) {
        savedTabs = JSON.parse(localStorageSavedTabs);
    }
    renderSavedTabs(savedTabs);

    const inputBar = document.getElementById("input-el");

    // Save input
    const saveInputEvent = document.getElementById("input-btn").addEventListener("click", () => {
        if (inputBar.value.replace(/\s+/g, '') !== "") {
            savedTabs.push(inputBar.value);
            localStorage.setItem("savedTabs", JSON.stringify(savedTabs));
        }
        inputBar.value = "";
        renderSavedTabs(savedTabs);
    });

    // Save current tab
    const saveTabEvent = document.getElementById("save-btn").addEventListener("click", () => {
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            let activeTab = tabs[0];
            savedTabs.push(activeTab.url);
            localStorage.setItem("savedTabs", JSON.stringify(savedTabs));
            renderSavedTabs(savedTabs);
        });
    });

    // Clear all inputs
    const deleteInputsEvent = document.getElementById("clearBtn").addEventListener("click", () => {
        savedTabs = [];
        localStorage.clear();
        renderSavedTabs(savedTabs);
    });

    // Delete a specific entry
    const deleteSpecifiedInputEvent = document.getElementById("tabs-list").addEventListener("click", (el) => {
        const toDeleteItem = el.target.id;
        if (toDeleteItem.slice(0, 3) !== "li-") {
            return;
        }
        
        toDeleteItemIndex = toDeleteItem.slice(-1);
        if (toDeleteItemIndex > -1) {
            savedTabs.splice(toDeleteItemIndex, 1);
            localStorage.setItem("savedTabs", JSON.stringify(savedTabs));
            renderSavedTabs(savedTabs);
        }
        
    })
});

function renderSavedTabs(tabs) {
    const tabsList = document.getElementById("tabs-list");
    tabsList.innerHTML = "";
    
    for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i] // .replace('https://', '').replace('http://', '');

        // Link element
        const a = document.createElement("a");
        a.appendChild(document.createTextNode(tab));
        // a.href = "http://" + tab;
        a.href = tab;
        a.target = "_blank";

        // Dismiss button element
        const dismissSpan = document.createElement('span');
        dismissSpan.innerHTML = "&times; ";
        dismissSpan.setAttribute("id", "li-" + i);
        dismissSpan.classList.add("dismissBtn");

        // List element
        const div = document.createElement("div");
        div.classList.add("list-item");
        div.appendChild(dismissSpan);
        div.appendChild(a);

        // List container element
        tabsList.appendChild(div);
    }
}
