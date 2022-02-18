function copy() {
    var copyText = document.getElementById("email");
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();

    var tooltip = document.getElementById("tooltip")
    tooltip.innerHTML = "Copied!";
}

function tooltipReset() {
    var tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = "Copy email to clipboard";
}

document.getElementById("copy").addEventListener("click", copy);
document.getElementById("copy").addEventListener("mouseleave", tooltipReset);

