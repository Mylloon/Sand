BigNumber.prototype.floor = function () {
    return this.integerValue(BigNumber.ROUND_FLOOR);
};

export const gen_RSA_keypair = async (bits) => {
    const getPrime = (bits) => {
        return new Promise((ok, ko) => {
            forge.prime.generateProbablePrime(bits, (err, data) => {
                if (err) return ko(err);
                ok(new BigNumber(data));
            });
        });
    };

    const pq_size = bits / 2;

    const p = await getPrime(pq_size);
    const q = await getPrime(pq_size);
    console.assert(p != q);

    const n = p.times(q);

    const phi_n = p.minus(1).times(q.minus(1));

    const e = new BigNumber(65537);
    console.assert(e.isLessThan(phi_n) && phi_n.modulo(e) != 0);

    // https://stackoverflow.com/a/51562038/15436737
    const inverse = (a, m) => {
        const s = [];
        let b = m;
        while (b) {
            [a, b] = [b, a % b];
            s.push({ a, b });
        }
        let x = 1;
        let y = 0;
        for (let i = s.length - 2; i >= 0; --i) {
            [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
        }

        return ((y % m) + m) % m;
    };

    const d = inverse(e, phi_n);

    console.log((e, n), (d, n));
    return [(e, n), (d, n)];
};

const RSA = () => {};

export const RSA_enc = (key, data) => {};
