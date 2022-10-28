import { RSA_dec_data as RSA_dec } from "./rsa.js";

window.addEventListener("load", () => main());

const main = () => {
    /* Handle when a file is added to the input element */
    const button = document.getElementById("download");
    button.addEventListener("click", () => {
        const req = new XMLHttpRequest();
        req.open("POST", "/api/download");
        req.setRequestHeader("Content-Type", "application/json");

        const pub_key = window.location.hash
            .slice(1)
            .split(":")
            .map((v) => BigInt(v));
        const hash = window.location.pathname.split("/").pop();

        // Send the hash to the server
        req.send(JSON.stringify(hash));

        req.onload = () => {
            if (req.status == 200) {
                // Decrypt the file
                const json = JSON.parse(req.responseText);
                const decrypted_file = RSA_dec(
                    json.file.split(",").map((v) => BigInt(v)),
                    pub_key
                );

                // Decrypt the filename
                const decrypted_filename = RSA_dec(
                    json.filename.split(",").map((v) => BigInt(v)),
                    pub_key
                );

                // Send the file to the user
                const blob = new Blob([
                    decodeURIComponent(atob(decrypted_file)),
                ]);
                const url = URL.createObjectURL(blob);
                download(url, decrypted_filename);
            } else {
                console.error("Download failed.");
            }
        };
    });
};

/**
 * Ask the user to download a file
 * @param path URL
 * @param filename filename
 */
const download = (path, filename) => {
    const anchor = document.createElement("A");
    anchor.href = path;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
};
