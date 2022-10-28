import { RSA_dec_data as RSA_dec } from "./rsa.js";

window.addEventListener("load", () => main());

const main = () => {
    const pub_key = window.location.hash.slice(1).split(":");
    const hash = window.location.pathname.split("/").pop();
    console.log(pub_key, hash);
};
