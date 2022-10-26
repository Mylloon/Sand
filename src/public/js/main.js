import { gen_RSA_keypair, RSA_dec, RSA_enc } from "./rsa.js";

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
    file.text().then((content) => {
        gen_RSA_keypair(1024).then((keys) => {
            let x = RSA_enc(content, keys[1]);
            console.log(RSA_dec(x, keys[0]));

            // Send it
            const data = new FormData();
            data.append("file", file);

            const req = new XMLHttpRequest();
            req.open("POST", "upload");
            req.send(data);

            /* Here we need to store the public key and then wait for a response
             * from the server. When the server send us a hash of the file
             * salted (so 2 same file don't have a different URL) we redirect
             * the user the a wait page so the uploader can copy a link like:
             * Wait page: https://d/done
             * Copy link: https://d/file/hash#pub_key_0:pub_key_1
             * When the user click on the link, he can download the file, asking
             * to the server with the hash of the link and the public key
             * encoded in the URL */

        });
    });
};
