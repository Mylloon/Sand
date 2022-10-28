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
                const decrypted_file = RSA_dec(
                    req.responseText
                        .slice(1, -2)
                        .split(",")
                        .map((v) => BigInt(v)),
                    pub_key
                );

                console.log(decrypted_file);
            } else {
                console.error("Download failed.");
            }
        };
    });
};
