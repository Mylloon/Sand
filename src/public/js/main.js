import { gen_RSA_keypair, RSA_enc } from "./rsa.js";

window.addEventListener("load", () => main());

const main = () => {
    Array.from(document.getElementsByClassName("upload-area")).forEach(
        (uploadArea) => {
            /* Handle event when a file is dropped hover the input area */
            uploadArea.addEventListener("drop", (event) => {
                fetchFile(event.dataTransfer.files);
            });

            /* Handle color change when dragging a file hover the input area */
            const hoverCSS = "upload-area-hovered";
            uploadArea.addEventListener("dragover", () => {
                if (!uploadArea.classList.contains(hoverCSS)) {
                    uploadArea.classList.add(hoverCSS);
                }
            });
            uploadArea.addEventListener("dragleave", () => {
                if (uploadArea.classList.contains(hoverCSS)) {
                    uploadArea.classList.remove(hoverCSS);
                }
            });
        }
    );

    /* Handle when a file is added to the input element */
    const input = document.getElementById("upload");
    input.onchange = () => {
        fetchFile(input.files, input);
    };
};

/**
 * Check if they're is only one file and send it
 * @param list List of files
 */
const fetchFile = (list, element = undefined) => {
    if (list.length == 1) {
        send(list[0], element);
    }
};

/**
 * Send a file to the server
 * @param file File to send
 */
const send = (file, element) => {
    // Show the user a file is uploading
    if (element) {
        let parent = element.parentElement;
        parent.textContent = "";
        let newText = document.createElement("h3");
        newText.textContent = "Téléversement...";
        parent.appendChild(newText);
    }

    // Encrypt the file
    gen_RSA_keypair(1024).then((keys) =>
        console.log(`p=${keys[0]}, s=${keys[1]}`)
    );

    // Send it
    const data = new FormData();
    data.append("file", file);

    const req = new XMLHttpRequest();
    req.open("POST", "upload");
    req.send(data);
};
