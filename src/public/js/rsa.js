import { modInv, modPow } from "./libs/bigint-mod.js";

/**
 * Generate a new RSA keypair
 * @param bits Key size
 * @returns RSA keypair
 */
export const gen_RSA_keypair = async (bits) => {
    const getPrime = (bits) => {
        return new Promise((ok, ko) => {
            forge.prime.generateProbablePrime(bits, (err, data) => {
                if (err) return ko(err);
                ok(BigInt(data));
            });
        });
    };

    const pq_size = bits / 2;

    const p = await getPrime(pq_size);
    const q = await getPrime(pq_size);
    console.assert(p != q);

    const n = p * q;

    const phi_n = (p - 1n) * (q - 1n);

    const e = 65537n;
    console.assert(e < phi_n && phi_n % e != 0n);

    const d = modInv(e, phi_n);

    return [
        [e, n],
        [d, n],
    ];
};

/**
 * RSA algorithm
 * @param msg data
 * @param key RSA key used
 * @returns Encrypted data
 */
const RSA = (msg, key) => {
    return modPow(msg, key[0], key[1]);
};

/**
 * Encrypt a string with RSA
 * @param data string
 * @param key RSA key used
 * @returns Int
 */
const RSA_enc = (data, key) => {
    return RSA(str_to_int(data)[0], key);
};

/**
 * Encrypt a big string with RSA
 * @param data big string
 * @param key RSA key used
 * @returns Int array
 */
export const RSA_enc_data = (data, key) => {
    let encoded = [];
    data.match(/(.{1,100})/g).forEach((piece) => {
        encoded.push(RSA_enc(piece, key));
    });

    return encoded;
};

/**
 * Decrypt a int to a string with RSA
 * @param data int
 * @param key RSA key used
 * @returns string
 */
const RSA_dec = (data, key) => {
    return int_to_str([RSA(data, key)]);
};

/**
 * Decrypt a int array to a string with RSA
 * @param data int array
 * @param key RSA key used
 * @returns big string
 */
export const RSA_dec_data = (data, key) => {
    let decoded = "";
    data.forEach((piece) => {
        decoded += RSA_dec(piece, key);
    });

    return decoded;
};

/**
 * Convert a string to an int (ASCII)
 * @param msg string
 * @returns int (ASCII)
 */
const str_to_int = (msg) => {
    let result = "";
    let table = [];
    for (let i = 0; i < msg.length; i++) {
        result += String(msg[i].charCodeAt(0)).padStart(3, "0");
        if (result.length == 100) {
            table.push(BigInt(`1${result}`));
        }
    }
    table.push(BigInt(`1${result}`));

    return table;
};

/**
 * Convert a int to string (ASCII)
 * @param msg int (ASCII)
 * @returns string
 */
const int_to_str = (msg) => {
    let result = "";
    for (let k = 0; k < msg.length; k++) {
        let full_msg = msg[k].toString().slice(1);
        for (let i = 0, step = 3; i < full_msg.length; i += step) {
            let txt = "";
            for (let j = 0; j < step; j++) {
                txt += full_msg.charAt(i + j);
            }
            result += String.fromCharCode(parseInt(txt));
        }
    }

    return result;
};
