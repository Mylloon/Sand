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

/**
 * Update an element
 * @param element Element to update
 * @param text Content of the tag
 * @param tag Optional: specify a new tag
 * @returns new element
 */
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
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const content = btoa(encodeURIComponent(reader.result));

        if (file.size > 512000 || file.size == 0) {
            let message = file.size == 0 ? "vide" : "trop lourd (max ~500ko)";
            update(
                element,
                `Fichier ${message}, cliquez pour revenir en arrière.`,
                "H3"
            ).parentElement.addEventListener("click", () => {
                location.href = "/";
            });

            return;
        }

        const req = new XMLHttpRequest();

        element = update(
            element,
            "Génération des clefs et chiffrement du fichier...",
            "H3"
        );
        gen_RSA_keypair(1024).then(([pub_key, sec_key]) => {
            let data = {
                file: RSA_enc(content, sec_key).join(","),
                filename: RSA_enc(file.name, sec_key).join(","),
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
        });
    };
};
