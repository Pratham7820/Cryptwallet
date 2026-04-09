export async function encryption(password: string, msg: Uint8Array<ArrayBuffer>) : Promise<Data> {
    const encoder = new TextEncoder()
    const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    )

    const salt = crypto.getRandomValues(new Uint8Array(16))
    const key = await crypto.subtle.deriveKey({
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
    },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    )

    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv
        },
        key,
        msg
    );
    return {
        encrypted,
        salt,
        iv
    }
}

interface Data{
    encrypted: ArrayBuffer,
    salt : Uint8Array<ArrayBuffer>,
    iv : Uint8Array<ArrayBuffer>
}

export async function decryption(password:string,data:Data) {
    const encoder = new TextEncoder()
    const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    )

    const key = await crypto.subtle.deriveKey({
        name: "PBKDF2",
        salt: data.salt,
        iterations: 100000,
        hash: "SHA-256"
    },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    )
    const encrypt = data.encrypted
    const iv = data.iv
    const decrypt = await crypto.subtle.decrypt({
            name: "AES-GCM",
            iv
        },
        key,
        encrypt
    )
    return new Uint8Array(decrypt)
}