window.addEventListener("load", () => main());

const main = () => {
    Array.from(document.getElementsByClassName("upload-area")).forEach(
        (uploadArea) => {
            uploadArea.addEventListener("drop", (event) => {
                fetchFile(event.dataTransfer.files);
            });
        }
    );

    const input = document.getElementById("upload");
    input.onchange = () => {
        fetchFile(input.files);
    };
};

/**
 * Check if they're is only one file and send it
 * @param list List of files
 */
const fetchFile = (list) => {
    if (list.length == 1) {
        send(list[0]);
    }
};

/**
 * Send a file to the server
 * @param file File to send
 */
const send = (file) => {
    // TODO: Encrypt the file before sending it
    const data = new FormData();
    data.append("file", file);

    const req = new XMLHttpRequest();
    req.open("POST", "upload");
    req.send(data);
};
