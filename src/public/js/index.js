import { gen_RSA_keypair, RSA_enc_data as RSA_enc } from "./rsa.js";

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

const update = (element, text, tag = undefined) => {
    if (element) {
        let parent = element.parentElement;
        parent.textContent = "";
        let newElement = document.createElement(
            tag === undefined ? element.tagName : tag
        );
        newElement.textContent = text;
        parent.appendChild(newElement);

        return newElement;
    }

    return undefined;
};

/**
 * Send a file to the server
 * @param file File to send
 */
const send = (file, element) => {
    file.text().then((content) => {
        const req = new XMLHttpRequest();

        element = update(element, "Génération des clefs...", "H3");
        gen_RSA_keypair(1024).then(([pub_key, sec_key]) => {
            element = update(element, "Chiffrement du fichier...", "H3");

            let data = {
                file: RSA_enc(content, sec_key).map((v) => v.toString()),
            };

            element = update(element, "Téléversement...", "H3");
            req.open("POST", "api/upload");
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(data));

            req.onload = () => {
                if (req.status == 200) {
                    /* Change here the area with the copy link */
                    let url = window.location.href.split("/");
                    url.pop();
                    url.push("file");
                    let link = `${url.join("/")}/${req.responseText.slice(
                        1,
                        -2
                    )}#${pub_key[0]}:${pub_key[1]}`;

                    let main_div = element.parentElement.parentElement;
                    main_div.textContent = "";
                    let div = document.createElement("DIV");
                    div.className = "link-area";
                    main_div.appendChild(div);

                    let div_title = document.createElement("H4");
                    div_title.textContent = "Fichier prêt !";
                    div.appendChild(div_title);

                    let message = document.createElement("P");
                    message.innerHTML = `Copiez le lien pour télécharger <code>${file.name}</code>`;
                    div.appendChild(message);

                    let input = document.createElement("INPUT");
                    input.value = link;
                    input.readOnly = true;
                    div.appendChild(input);

                    // TODO: Change button textContent on click
                    let button = document.createElement("BUTTON");
                    button.textContent = "Copier le lien";
                    div.appendChild(button);

                    button.addEventListener("click", () => {
                        navigator.clipboard
                            .writeText(link)
                            .then(() => (button.textContent = "Lien copié !"));
                    });
                } else {
                    console.error("Upload failed.");
                }
            };

            /* Here we need to store the public key and then wait for a response
             * from the server. When the server send us a hash of the file
             * we redirect the user the a wait page so the uploader can copy
             * a link like:
             * Wait page: https://d/upload
             * Copy link: https://d/download/hash#pub_key_0:pub_key_1
             * When the user click on the link, he can download the file, asking
             * to the server with the hash of the link and the public key
             * encoded in the URL */
        });
    });
};
